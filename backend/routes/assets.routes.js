const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ngrams } = require('mongoose-fuzzy-searching/helpers');
const { searchFilter } = require("../documentation/schemas");
const connection = mongoose.connection;
const Asset = require("../models/asset.model");
const sampleAssets = require("../sample_data/sampleAssets.data");

router.get("/", async (req, res, err) => {

  try {

    let aggregateArray = [];

    if (req.query.search) {

      const searchTerm = req.query.search.replace("-", "");
      let search =  { 
        $match: {
          $text: {
            $search: nGrams(searchTerm, null, false).join(' ')
          }
        }
      }

      let confidenceScore = {
        $addFields: {
          confidenceScore: { $meta: "textScore" }
        }
      }

      aggregateArray.push(search);
      aggregateArray.push(confidenceScore)
    }
    
     if  (req.query.sort_by) {
      //default ascending order
      var sortby = req.query.sort_by.toString().trim();
      const sortOrder = (req.query.order == 'desc' ? -1 : 1);
      if (req.query.search) {
        let sort = { $sort: { confidenceScore : -1, [req.query.sort_by] :  sortOrder }};
        aggregateArray.push(sort);
      } else {
        let sort = { $sort: { [req.query.sort_by] :  sortOrder }};
        aggregateArray.push(sort);
      }
    }

    let limit = { $limit : 5 };
    aggregateArray.push(limit);

    const result = await Asset.aggregate(aggregateArray);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(204).json({
          message: "No assets found in database",
          interalCode: "no_assets_found",
        });
    }
  
  } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error searching for events in database",
        internal_code: "event_search_error"
      });
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

router.get("/:serial", async (req, res, err) => {
  const serial = req.params.serial;
  try {
    const asset = await Asset.find({ serial: serial });

    if (asset.length) {
      res.status(200).json(asset[0]);
    } else {
      res.status(500).json({
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

router.get("/searchFilter", async (req, res, err) => {
  const filter = req.params.search;
  try {
    const asset = await Asset.find({ searchFilter: searchFilter });

    if (asset.length) {
      res.status(200).json(asset[0]);
    } else {
      res.status(500).json({
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



module.exports = router;