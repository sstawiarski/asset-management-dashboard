const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { nGrams } = require('mongoose-fuzzy-searching/helpers');
const connection = mongoose.connection;
const Asset = require("../models/asset.model");
const Counter = require("../models/counter.model");
const Event = require("../models/event.model");
const sampleAssets = require("../sample_data/sampleAssets.data");

router.get("/", async (req, res, err) => {

  try {

    let aggregateArray = [];

    //if there are possible filters other than search
    if (req.query) {
      const query = req.query;

      //remove page, limit, search, and sorting params since they do not go in the $match
      const disallowed = ["page", "limit", "search", "sort_by", "order"];
      const filters = Object.keys(query)
        .reduce((p, c) => {

          /* MongoDB compares exact dates and times
          If we want to see an entire 24 hours, we much get the start and end times of the given day
          And get everything in between the start and end */
          if (c === "dateCreated" || c === "dateUpdated") {
            p[c] = {
              $gte: new Date(parseInt(query[c])).setHours(0, 0, 0, 0),
              $lte: new Date(parseInt(query[c])).setHours(23, 59, 59, 999)
            };
          } else if (!disallowed.includes(c)) {
            //convert the "true" and "false" strings in the query into actual booleans
            if (query[c] === "true") {
              p[c] = true;
            } else if (query[c] === "false") {
              p[c] = false;
            } else {
              p[c] = query[c];
            }
          };
          return p;
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

    const result = await Asset.aggregate(aggregateArray);

    //filter results to determine better or even exact matches
    //currently returns asset object, not object with count and data properties
    if (req.query.search) {

      if (result[0].data.length) {

        if (result[0].data[0].serial.toUpperCase() === req.query.search.toUpperCase()) {
          const exactMatch = [result[0].data[0]];
          res.status(200).json({
            count: [{ count: 1 }],
            data: [exactMatch]
          });

        } else {

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
          message: "No assets found in database",
          interalCode: "no_assets_found",
        });
      }

      //return all results found if not a search
    } else {

      if (result[0].data.length) {
        res.status(200).json(result[0]);

      } else {
        res.status(404).json({
          message: "No assets found in database",
          interalCode: "no_assets_found",
        });
      }
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error searching for assets in database",
      internal_code: "asset_search_error"
    });
  }
});

/* Update assets and assemblies with fields
*  Updates children as well
*  Should support all future bulk edit options
*/
router.patch("/", async (req, res) => {
  try {
    //list of selected serials from client
    const list = req.body.assets;

    //object from client representing fields to update
    //should really only be one
    const field = req.body.update;
    const fieldName = Object.getOwnPropertyNames(field)[0];

    //get all parent assembly documents so we can get their serial and update children
    //searches through array we got from client using $in
    const parentAssemblies = await Asset.find({ serial: { $in: list }, assetType: "Assembly" }).select({ serial: 1 });

    //get assets too so we can link to the new event
    let foundAssets = [];
    foundAssets = await Asset.find({ serial: { $in: list }, assetType: "Asset" }).select({ serial: 1 });


    //updates main assets and assemblies selected
    //See mongoose API docs -- [Model name].updateMany( { filters }, { fields and values to update });
    //returns object with a property 'n' representing number of documents updated
    await Asset.updateMany({ serial: { $in: list }, assetType: "Assembly" }, field);
    await Asset.updateMany({ serial: { $in: list }, assetType: "Asset" }, field);

    //use parent assemblies we found earlier to get their serials to find children
    let parentSerials = [];
    parentAssemblies.map((assembly) => {
      parentSerials.push(assembly.serial);
    });

    //keep track of children too
    let foundChildren = [];

    if (parentSerials.length) {
      foundChildren = await Asset.find({ parentId: { $in: parentSerials }, assetType: "Asset" }).select({ serial: 1 });
      await Asset.updateMany({ parentId: { $in: parentSerials } }, field);
    }

    //get event type and key beginning -- function declared at bottom of this file
    const eventInfo = getEventType(fieldName);
    const counter = await Counter.findOneAndUpdate({ name: "events" }, { $inc: { next: 1 } }, { useFindAndModify: false }); //get counter and increment for event key

    //make up array of all serials affected
    let allAffectedAssets = [];
    if (foundAssets.length) {
      foundAssets.map((asset) => {
        allAffectedAssets.push(asset.serial);
      })
    }
    if (foundChildren.length) {
      foundChildren.map((child) => {
        allAffectedAssets.push(child.serial);
      })
    }

    allAffectedAssets = [...allAffectedAssets, ...parentSerials];

    //generate new event and save
    //TODO: make up eventData is some kind of predefined way
    const event = new Event({
      eventType: eventInfo[0],
      eventTime: Date.now(),
      key: `${eventInfo[1]}${counter.next}`,
      productIds: allAffectedAssets,
      eventData: {
        details: `Changed ${allAffectedAssets.length} product(s) ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} to ${field[fieldName]}.`
      }
    });
    await event.save();

    //use lengths from found arrays to send a response
    res.status(200).json({
      message: `Updated ${foundAssets.length} regular assets, ${parentSerials.length} assemblies, and ${foundChildren.length} of their children.`
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error updating assets",
      internal_code: "asset_update_error"
    })
  }
});

router.put("/load", async (req, res) => {
  try {
    sampleAssets.forEach(async (item) => {
      console.log(item);
      const asset = new Asset({
        ...item,
        dateCreated: Date.now(),
      });
      await asset.save();
    });

    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({
      message: "Error loading sample data into database",
      internal_code: "database_load_error",
    });
  }
});

router.post('/create-Assembly', async (req, res, err) => {
  try {
    const serial = req.body.Assets
    const override = req.body.override



    // Queryig DB to find the assetTYPE
    const asset = await Asset.findOneAndUpdate({ assetName: req.body.assetName, owner: null }, { assetType: "Assembly", owner: "Supply Chain" });

    if (override) {
      await Asset.updateMany({ serial: { $in: serial } }, { parentId: asset.serial })
      res.status(200).json({ message: "Successfully updated" })


    }
    else {

      const findSerial = await Asset.find({ serial: { $in: serial }, parentId: null })
      if (findSerial.length === serial.length) {
        await Asset.updateMany({ serial: { $in: serial } }, { parentId: asset.serial })
        res.status(200).json({ message: "Successfully updated" })
      }
      else {
        await Asset.updateMany({ serial: { $in: serial }, parentId: null }, { parentId: asset.serial })
        res.status(250).json({ message: "failed to update some assets" })
      }
    }



  }
  catch (err) {
    console.log(err)
  }
})


router.post('/asset-Provision', async (req, res, err) => {
  try {
    const serial = req.body.serial
    const serialBase= req.body.serialBase
    const body = req.body

    if (serial) {
    	 for(let i in serial){

    	 	const existingDoc= await Asset.findOne({serial:i})
    	 	if(existingDoc){
    	 		continue
    	 	}
    	 	const newAssets=new Asset({
    	 		serial:i,
    	 		assetName:req.body.assetName,
    	 		provisioned:true,
    	 		owner:"Supply Chain USA",
    	 		assetType:"Asset",
    	 		dateCreated: Date.now(),
    	 		checkedOut:false,
    	 		assignmentType:"Owned"
    	 	})
    	 	await newAssets.save()
    	 }
	res.status(200).json
    	({
      message: "success"
     ,
    });
    }
    else if (serialBase) {
    	const num=serialBase.split("-",2)
    	const beginningSerial= parseInt(num[1])
    	if (req.body.quantity) {
    		for (let i =beginningSerial; i<req.body.quantity; i++) {
    			const newSerial= num[0]+i

    			const existingDoc= await Asset.findOne({serial:newSerial})
    	 	if(existingDoc){
    	 		continue
    	 	}
    	 	const newAssets=new Asset({
    	 		serial:newSerial,
    	 		assetName:req.body.assetName,
    	 		provisioned:true,
    	 		owner:"Supply Chain USA" ,
    	 		assetType:"Asset",
    	 		dateCreated: Date.now(),
    	 		checkedOut:false,
    	 		assignmentType:"Owned"

    	 	})
    	 	await newAssets.save()

    		}
    	
    	}
    	res.status(200).json
    	({
      message: "success"
     ,
    });


  }
  catch (err) {
    console.log(err)
  }
}

router.get("/:serial", async (req, res, err) => {
  const serial = req.params.serial;
  try {
    const asset = await Asset.find({ serial: serial });

    if (asset.length) {
      res.status(200).json(asset[0]);
    } else {
      res.status(404).json({
        message: "No assets found for serial",
        internalCode: "no_assets_found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "serial is missing",
      interalCode: "missing_parameters",
    });
  }

});

function getEventType(field) {
  switch (field) {
    case "retired":
      return ["Change of Retirement Status", "RET-"]
  }
}

module.exports = router;