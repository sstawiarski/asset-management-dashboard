const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { nGrams } = require('mongoose-fuzzy-searching/helpers');
const connection = mongoose.connection;
const Asset = require("../models/asset.model");
const Counter = require("../models/counter.model");
const Event = require("../models/event.model");
const AssemblySchema = require('../models/assembly.model');
const sampleAssets = require("../sample_data/sampleAssets.data");
const dateFunctions = require("date-fns");


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
          } else if (!disallowed.includes(c)) {
            //convert the "true" and "false" strings in the query into actual booleans
            if (query[c] === "true") {
              p[c] = true;
            } else if (query[c] === "false") {
              p[c] = false;
            } else if (query[c] === "null") {
              p[c] = null;
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

/* 
 *  Update assets and assemblies with fields along with their children
 *  Allows override option in request body to allow changes to child assets without also updating the parent
 *  Parent is marked incomplete and child is removed from parent assembly
 */
router.patch("/", async (req, res) => {
  try {
    const list = req.body.assets; //list of selected serials from client

    //object from client representing fields to update
    //should really only be one
    const field = req.body.update;
    const fieldName = Object.getOwnPropertyNames(field)[0];

    //get all parent assembly documents so we can get their serial and update children
    //searches through array we got from client using $in
    const parentAssemblies = await Asset.find({ serial: { $in: list }, assetType: "Assembly" }).select({ serial: 1 });

    const serials = parentAssemblies.map(obj => obj.serial); //get only the serials of the parent assemblies for comparison later

    //get assets too so we can link to the new event
    let foundAssets = [];
    foundAssets = await Asset.find({ serial: { $in: list }, assetType: "Asset" }).select({ serial: 1, parentId: 1, assetName: 1 });

    /* 
     * Determine whether any children are in the edit request that are part of an assembly
     * But whose parent assembly is not also being updated
     * Keep track of the names, serials, and parent serials so we can update each if necessary
     */
    let missingChildNames = [];
    let missingParentSerials = [];
    let missingChildSerials = [];
    foundAssets.forEach(asset => {
      if (asset.parentId) {
        if (!serials.includes(asset.parentId)) {
          missingChildSerials.push(asset.serial);
          missingChildNames.push(asset.assetName);
          missingParentSerials.push(asset.parentId);
        }
      }
    });

    //updates main assets and assemblies selected
    //See mongoose API docs -- [Model name].updateMany( { filters }, { fields and values to update });
    await Asset.updateMany({ serial: { $in: list }, assetType: "Assembly" }, field);

    //check whether any children are edited apart from their parent
    if (missingParentSerials.length > 0) {

      //remove child and update parent assembly if any are specified
      if (req.body.override) {
        await Asset.updateMany({ serial: { $in: list }, assetType: "Asset" }, {
          parentId: null,
          ...field
        });

        for (const [idx, name] of missingChildNames.entries()) {
          await Asset.updateOne(
            {
              serial: missingParentSerials[idx]
            },
            {
              incomplete: true,
              $push: {
                missingItems: name
              }
            }
          );

          const count = await Counter.findOneAndUpdate({ name: "events" }, { $inc: { next: 1 } }, { useFindAndModify: false });
          const removal = new Event({
            eventType: "Removal of Child Asset",
            eventTime: Date.now(),
            key: `REM-${count.next}`,
            productIds: missingParentSerials[idx],
            eventData: {
              details: `Removed ${name} from ${missingParentSerials[idx]} and marked incomplete.`
            }
          });

          await removal.save();
        }

        //else only update the children that don't have this problem
      } else {
        const newList = list.filter(item => !missingChildSerials.includes(item));
        await Asset.updateMany({ serial: { $in: newList }, assetType: "Asset" }, field);
      }
      //else update all assets
    } else {
      await Asset.updateMany({ serial: { $in: list }, assetType: "Asset" }, field);
    }


    //use parent assemblies we found earlier to get their serials to find children
    let parentSerials = [];
    parentAssemblies.forEach((assembly) => {
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

      //if override, then we can use all the found assets
      if (req.body.override) {
        foundAssets.forEach((asset) => {
          allAffectedAssets.push(asset.serial);
        })

        //else filter out as needed
      } else {
        if (missingChildSerials.length) {
          const newList = list.filter(item => !missingChildSerials.includes(item));
          allAffectedAssets = [...allAffectedAssets, ...newList];
        } else {
          foundAssets.forEach((asset) => {
            allAffectedAssets.push(asset.serial);
          })
        }

      }
    }

    if (foundChildren.length) {
      foundChildren.forEach((child) => {
        allAffectedAssets.push(child.serial);
      })
    }

    allAffectedAssets = [...allAffectedAssets, ...parentSerials];

    //generate new event and save
    //TODO: make up eventData is some kind of predefined way
    if (allAffectedAssets.length) {
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

      const additionalInfo = (missingChildSerials.length && req.body.override) ? `` : (!req.body.override && missingChildSerials.length) ? `${missingChildSerials.length} of these assets were children of assemblies not in the requested list and were not updated.` : "";
      //use lengths from found arrays to send a response
      res.status(200).json({
        message: `Updated ${req.body.override ? foundAssets.length : foundAssets.length - missingChildSerials.length} regular assets, ${parentSerials.length} assemblies, and ${foundChildren.length} of their children. ${additionalInfo}`,
        key: `${eventInfo[1]}${counter.next}`
      })
    } else {
      res.status(200).json({
        message: `No changes made.`
      })
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error updating assets",
      internal_code: "asset_update_error"
    })
  }
});

router.post('/create-Asset', async (req, res) => {
  try {
    const asset = {
      assetName: req.body.assetName,
      serial: req.body.serial,
      owner: req.body.owner,
      assignmentType: req.body.assignmentType,
      groupTag: req.body.groupTag,
      assignee: req.body.assignee,
      checkedOut: false,
      assetType: "Asset"
    }
    
      //console.log(asset);
      const newAsset = new Asset({
        ...asset,
        dateCreated: Date.now(),
      });
      newAsset.save();
    
    console.log(newAsset);
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({
      message: "Error loading sample data into database",
      internal_code: "database_load_error",
    });
  }
});

router.put("/load", async (req, res) => {
  try {
    sampleAssets.forEach(async (item) => {
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
    const assets = req.body.assets
    const override = req.body.override

    // Queryig DB to find the assetTYPE
    const asset = await Asset.findOne({ assetName: req.body.type, provisioned: true });
    if (!asset) {
      res.status(404).json({
        message: "No available assembly serials."
      })
      return;
    }

    if (override) {
      await Asset.updateOne({ assetName: req.body.type, provisioned: true }, { assetType: "Assembly", owner: req.body.owner, missingItems: req.body.missingItems, groupTag: req.body.groupTag, provisioned: false })
      await Asset.updateMany({ serial: { $in: assets } }, { parentId: asset.serial })
      res.status(200).json({ message: "Successfully updated" })
    }
    else {
      const findSerial = await Asset.find({ serial: { $in: assets }, parentId: null })
      if (findSerial.length === assets.length) {
        await Asset.updateOne({ assetName: req.body.type, provisioned: true }, { assetType: "Assembly", owner: req.body.owner, missingItems: [], groupTag: req.body.groupTag, provisioned: false })
        await Asset.updateMany({ serial: { $in: assets } }, { parentId: asset.serial })
        res.status(200).json({ message: "Successfully updated" })
      }
      else {
        if (findSerial) {
          const objs = findSerial.map(obj => obj.serial);
          const missingSers = assets.filter(ser => !objs.includes(ser));
          res.status(403).json({
            message: "Some assets were added to other assemblies prior to this submission.",
            internalCode: "assets_already_used",
            used: missingSers
          })
        } else {
          res.status(500).json({ 
            message: "Error finding assets",
            interalCode: "cannot_find_assets" 
          })
        }
        
      }
    }

  }
  catch (err) {
    console.log(err)
    res.status(500).json({ 
      message: "Error creating assembly",
      interalCode: "assembly_creation_error" 
    })
  }
});

//load databse with assembly schemas for comparison when creating an assembly
router.put("/assembly/schema", async (req, res) => {
  try {
    const assemblySchemas = [{
      name: "Carrier",
      serializationFormat: "G800-",
      components: [
        "Landing Sub",
        "Crossover Sub",
        "Centralizer",
        "Gap Sub"]
    }, {
      name: "Electronics Probe",
      serializationFormat: "ELP-",
      components: [
        "Pulser",
        "ECAM",
        "Gamma",
        "Directional",
        "Female Rotatable"
      ]
    }, {
      name: "Battery Probe",
      serializationFormat: "BAP-",
      components: [
        "Transmission Rod",
        "Gap Joint",
        "Male Rotatable",
        "Battery Bulkhead"
      ]
    }, {
      name: "Kit Box",
      serializationFormat: "EVO-ONE-",
      components: []
    }, {
      name: "Pulser",
      serializationFormat: "ELP-",
      components: [
        "Motor",
        "Gearbox",
        "Pressure Feedthrough"
      ]
    }];

    for (const item of assemblySchemas) {
      const assembly = new AssemblySchema({
        name: item.name,
        serializationFormat: item.serializationFormat,
        components: item.components
      });
      await assembly.save();
    }

    res.status(200).json({
      message: "success"
    });
  } catch (err) {
    console.log(err);
    res.status(503).json({
      message: "Error loading sample data into database",
      internal_code: "database_load_error",
    });
  }

});

router.get("/assembly/schema", async (req, res) => {
  const type = decodeURI(req.query.type);
  try {
    const chosenSchema = await AssemblySchema.findOne({ name: type }).select({
      _id: 0,
      __v: 0
    });
    if (chosenSchema) {
      res.status(200).json(chosenSchema);
    } else {
      res.status(404).json({
        message: "Error finding assembly schema",
        internal_code: "schema_error",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(503).json({
      message: "Error finding assembly schema",
      internal_code: "schema_error",
    });
  }
})


router.post('/asset-Provision', async (req, res, err) => {
  try {
    const serial = req.body.serial
    const serialBase = req.body.serialBase
    const body = req.body

    if (serial) {
      for (let i in serial) {

        const existingDoc = await Asset.findOne({ serial: i })
        if (existingDoc) {
          continue
        }
        const newAssets = new Asset({
          serial: i,
          assetName: req.body.assetName,
          provisioned: true,
          owner: "Supply Chain USA",
          assetType: "Asset",
          dateCreated: Date.now(),
          checkedOut: false,
          assignmentType: "Owned"
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
      const num = serialBase.split("-", 2)
      const beginningSerial = parseInt(num[1])
      if (req.body.quantity) {
        for (let i = beginningSerial; i < req.body.quantity; i++) {
          const newSerial = num[0] + i

          const existingDoc = await Asset.findOne({ serial: newSerial })
          if (existingDoc) {
            continue
          }
          const newAssets = new Asset({
            serial: newSerial,
            assetName: req.body.assetName,
            provisioned: true,
            owner: "Supply Chain USA",
            assetType: "Asset",
            dateCreated: Date.now(),
            checkedOut: false,
            assignmentType: "Owned"

          })
          await newAssets.save()

        }
        res.status(200).json({ message: "success" });
      }
      res.status(400).json({ message: "success", interalCode: "missing_quantity_param" });
    }


  }
  catch (err) {
    console.log(err)
  }
});

router.get("/:serial", async (req, res, err) => {
  const serial = req.params.serial;
  const { project } = req.query
  let projection = {};
  if (project) {
    projection = {
      [project]: 1,
      _id: 0
    }
  }
  try {
    const asset = await Asset.find({ serial: serial }, projection);

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
      return ["Change of Retirement Status", "RET-"];
    case "groupTag":
      return ["Change of Group Tag", "GRP-"];
    case "assignee":
      return ["Reassignment", "REA-"];
    case "owner":
      return ["Change of Ownership", "OWN-"];
    case "assignmentType":
      return ["Change of Assignment Type", "ASN-"];
  }
}

module.exports = router;
