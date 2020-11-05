const express = require("express");
const { GridFSBucketReadStream } = require("mongodb");
const router = express.Router();
const mongoose = require("mongoose");
const { nGrams } = require('mongoose-fuzzy-searching/helpers');
const { searchFilter } = require("../documentation/schemas");
const connection = mongoose.connection;
const Asset = require("../models/asset.model");
const sampleAssets = require("../sample_data/sampleAssets.data");

router.get("/", async (req, res, err) => {

  try {

    let aggregateArray = [];

    if (req.query.search) {
      const searchTerm = req.query.search.replace("-", "");
      const search = {
        $match: {
          $text: {
            $search: nGrams(searchTerm, null, false).join(' ')
          }
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
    }

    //limit to 5 results -- modify later based on pagination
    const limit = { 
      $limit: 5 
    };
    aggregateArray.push(limit);

    //remove irrelevant fields from retrieved objects
    const projection = {
      $project: {
        _id: false,
        __v: false,
        serial_fuzzy: false
      }
    }
    aggregateArray.push(projection);

    const result = await Asset.aggregate(aggregateArray);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        message: "No assets found in database",
        interalCode: "no_assets_found",
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error searching for assets in database",
      internal_code: "asset_search_error"
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