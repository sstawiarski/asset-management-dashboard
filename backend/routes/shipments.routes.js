const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Shipment = require('../models/shipment.model');
const sampleShipment = require('../sample_data/sampleShipment.data');

// router.get('/', async (req, res) => {
//     try {
//         const shipments = await Shipment.find({}, { __v: 0, manifest: 0 }).populate('shipFrom').populate('shipTo');
//         res.status(200).json(shipments)
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: "Error loading sample data into database",
//             internal_code: "database_load_error"
//         })
//     }
// });

//Code below implements filtering and pagination from Assets route.  Implement below for Shipments. -efritts

router.get("/", async (req, res, err) => {
    try {
      let aggregateArray = [];
  
      //if there are possible filters other than search
      if (req.query) {
        const query = req.query;
  
        //remove page, limit, search, and sorting params since they do not go in the $match
        const disallowed = ["page", "limit", "search", "sort_by", "order"];
        const filters = await Object.keys(query)
          .reduce(async (pc, c) => {
            const p = await pc;
  
            /* MongoDB compares exact dates and times
            If we want to see an entire 24 hours, we much get the start and end times of the given day
            And get everything in between the start and end */
            if (c === "created" || c === "updated") {
  
              const beforeDate = dateFunctions.startOfDay(new Date(parseInt(query[c])));
              const afterDate = dateFunctions.endOfDay(new Date(parseInt(query[c])));
              p["$and"] = [{
                [c]: {
                  $gte: beforeDate
                }
              }, {
                [c]: {
                  $lte: afterDate
                }
              }];

            } 
           
  
            return pc;
          }, {});
  
        if (req.query.search) {
          const searchTerm = req.query.search.replace("-", "");
  
          //match search and regular filters
          const search = {
            $match: {
              $text: {
                $search: nGrams(searchTerm, null, false).join(' ')
              },
              ...filters
            }
          }
  
          const confidenceScore = {
            $addFields: {
              confidenceScore: { $meta: "textScore" }
            }
          }
  
          aggregateArray.push(search);
          aggregateArray.push(confidenceScore)
  
        } else {
  
          //match only the regular filters
          const match = {
            $match: {
              ...filters
            }
          };
          aggregateArray.push(match);
        }
  
      } else {
        const match = {
          $match: {
  
          }
        };
  
        aggregateArray.push(match);
      }
  
      if (req.query.sort_by) {
        //default ascending order
        const sortOrder = (req.query.order === 'desc' ? -1 : 1);
  
        if (req.query.search) {
          const sort = {
            $sort: {
              confidenceScore: -1,
              [req.query.sort_by]: sortOrder
            }
          };
          aggregateArray.push(sort);
  
        } else {
          const sort = {
            $sort: {
              [req.query.sort_by]: sortOrder
            }
          };
          aggregateArray.push(sort);
        }
      } else {
        if (req.query.search) {
          const sort = {
            $sort: {
              confidenceScore: -1,
            }
          };
          aggregateArray.push(sort);
        } else {
          const sort = {
            $sort: {
              serial: 1
            }
          };
          aggregateArray.push(sort);
        }
      }
  
      //pagination initial setup
      const skip = {
        $skip: (req.query.page && req.query.limit) ? (parseInt(req.query.page) * parseInt(req.query.limit)) : 0
      }
  
      //limit to 5 results -- modify later based on pagination
      const limit = {
        $limit: req.query.limit ? parseInt(req.query.limit) : 5
      };
  
      const group = {
        $facet: {
          count: [{ $count: "count" }],
          data: [skip, limit]
        }
      };
      aggregateArray.push(group);
  
      //remove irrelevant fields from retrieved objects
      const projection = {
        $project: {
          _id: false,
          'data._id': false,
          'data.__v': false,
          'data.serial_fuzzy': false
        }
      }
      aggregateArray.push(projection);
  
      const result = await Shipment.aggregate(aggregateArray);
  
      //filter results to determine better or even exact matches
      if (req.query.search) {
  
        //results are found
        if (result[0].data.length) {
  
          //if top match is an exact match, return only that one
          if (result[0].data[0].serial.toUpperCase() === req.query.search.toUpperCase()) {
            const exactMatch = [result[0].data[0]];
            res.status(200).json({
              count: [{ count: 1 }],
              data: exactMatch
            });
  
          } else {
            //if matches are extremely close then only return the close matches
            if (result[0].data[0].confidenceScore > 10) {
              const closeMatches = result[0].data.filter(asset => asset.confidenceScore > 10);
              res.status(200).json({
                count: [{ count: closeMatches.length }],
                data: [...closeMatches]
              });
            } else {
              res.status(200).json(result[0]);
            }
          }
  
        } else {
          res.status(404).json({
            message: "No shipments found in database",
            internalCode: "no_shipments_found",
          });
        }
  
        //return all results found if not a search
      } else {
        if (result[0].data.length) {
          res.status(200).json(result[0]);
  
        } else {
          res.status(404).json({
            message: "No shipments found in database",
            internalCode: "no_shipments_found",
          });
        }
      }
  
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error searching for shipments in database",
        internalCode: "shipment_search_error"
      });
    }
  });

router.put('/load', async (req, res) => {
    try {
        sampleShipment.forEach(async (item, idx) => {
            const shipment = new Shipment({
                ...item,
                shipFrom: mongoose.Types.ObjectId("602b197047bcea2afc7025f3"),
                shipTo: mongoose.Types.ObjectId("602b197047bcea2afc7025f9")
            });
            await shipment.save();
        })
        res.status(200).json({ message: "success" })
    }
    catch (err) {
        res.status(500).json({
            message: "Error loading sample data into database",
            internal_code: "database_load_error"
        })
    }
});

router.get('/:key', async (req, res) => {
    try {
        const key = req.params.key;
        //const { key } = req.params;
        const shipment = await Shipment.findOne({ key: decodeURI(key) }).populate('shipFrom').populate('shipTo');
        res.status(200).json(shipment)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Could not get shipment",
            internal_code: "shipment_retrieval_error"
        })
    }
});

router.patch('/:key', async (req, res)=>{
    console.log(req);
    //console.log(res);

    var key = req.params.key;
    const status = req.params.status;
    const shipment = await Shipment.findOne({ key: decodeURI(key) });
    //var body = req.body.status;

    // if(!ObjectID.isValid(key)){
    //   res.status(404).send();
    // }
  
    Shipment.findByIdAndUpdate(shipment._id, req.body, {new: true}).then(
      (shipment)=>{
        if(!shipment){
          res.status(404).send();
        }
        res.send(shipment);
      },
      (error) =>{
        res.send(error);
      }
    ).catch((e)=>{
      res.status(404).send();
    });
  });

module.exports = router;