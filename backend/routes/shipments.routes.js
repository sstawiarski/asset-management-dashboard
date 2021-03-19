const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Shipment = require('../models/shipment.model');
const Location = require('../models/location.model');
const Counter = require('../models/counter.model');
const { nGrams } = require('mongoose-fuzzy-searching/helpers');
const dateFunctions = require("date-fns");
const decrypt = require('../auth.utils').decrypt;
const sampleShipment = require('../sample_data/sampleShipment.data');
const Assets = require('../models/asset.model');

router.get("/", async (req, res) => {
    try {
        let aggregateArray = [];

        //if there are possible filters other than search
        if (req.query) {
            const query = req.query;

            //remove page, limit, search, and sorting params since they do not go in the $match
            const disallowed = ["page", "limit", "search", "sort_by", "order", "shipTo", "shipFrom"];
            const filters = await Object.keys(query)
                .reduce(async (pc, c) => {
                    const p = await pc;

                    /* MongoDB compares exact dates and times
                    If we want to see an entire 24 hours, we much get the start and end times of the given day
                    And get everything in between the start and end */
                    if (c === "created" || c === "updated" || c === "completed") {
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

                //add confidence score to determine best matches
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
            //match everything
            const match = {
                $match: {

                }
            };

            aggregateArray.push(match);
        }

        /* Join locations collection with shipments to convert ObjectId reference to location to the actual location document */
        let fromLookup = {
            $lookup: {
                'from': Location.collection.name,
                let: { fromId: "$shipFrom" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$fromId"],
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            __v: 0
                        }
                    }
                ],
                'as': "shipFrom"
            }
        };

        let toLookup = {
            $lookup: {
                'from': Location.collection.name,
                let: { toId: "$shipTo" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$toId"],
                            }
                        }

                    }, {
                        $project: {
                            _id: 0,
                            __v: 0
                        }
                    }
                ],
                'as': "shipTo"
            }
        };

        /* if a specific location is specified in the query, the $match (in next "if") will return an array of one document, so unwind it into just the object */
        const fromUnwind = {
            $unwind: {
                path: "$shipFrom"
            }
        };

        const toUnwind = {
            $unwind: {
                path: "$shipTo"
            }
        };

        /* if filtering for shipments with a specific location, modify $lookup to only match those locations */
        if (req.query.shipFrom || req.query.shipTo) {
            if (req.query.shipFrom) {
                fromLookup = {
                    $lookup: {
                        'from': Location.collection.name,
                        let: { fromId: "$shipFrom" },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$fromId"],
                                }
                            }
                        }, {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", { $toObjectId: req.query.shipFrom }]
                                }
                            }
                        }],
                        'as': "shipFrom"
                    }
                };

                aggregateArray.push(fromLookup);
                fromLookup = null;

                const match = {
                    $match: {
                        shipFrom: {
                            $exists: true,
                            $ne: []
                        }
                    }
                };
                aggregateArray.push(match);
            }

            if (req.query.shipTo) {
                toLookup = {
                    $lookup: {
                        'from': Location.collection.name,
                        let: { toId: "$shipTo" },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$toId"],
                                }
                            }
                        }, {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", { $toObjectId: req.query.shipTo }]
                                }
                            }
                        }],
                        'as': "shipTo"
                    }
                };
                aggregateArray.push(toLookup);
                toLookup = null;

                const match = {
                    $match: {
                        shipTo: {
                            $exists: true,
                            $ne: []
                        }
                    }
                };
                aggregateArray.push(match);
            }

        }

        //only push these lookups if there wasn't a location filter applied since the ifs already take care of pushing it
        if (fromLookup !== null) aggregateArray.push(fromLookup);
        if (toLookup !== null) aggregateArray.push(toLookup);

        aggregateArray.push(fromUnwind);
        aggregateArray.push(toUnwind);

        /* 
         * If a shipment location's default information was overridden, 
         * use the "shipFromOverride" or "shipToOverride" object to merge with each $lookup'd location document 
         * and replace the modified fields prior to returning 
         */
        const shipFromOverride = {
            $set: {
                "shipFrom": {
                    $cond: [
                        { $ifNull: ["$shipFromOverride", false] },
                        { $mergeObjects: ["$shipFrom", "$shipFromOverride"] },
                        "$shipFrom"
                    ]
                }
            }
        };

        const shipToOverride = {
            $set: {
                "shipTo": {
                    $cond: [
                        { $ifNull: ["$shipToOverride", false] },
                        { $mergeObjects: ["$shipTo", "$shipToOverride"] },
                        "$shipTo"
                    ]
                }
            }
        };

        /* Remove the now-useless override fields from the final document */
        const shipModificationProjection = {
            $project: {
                shipFromOverride: 0,
                shipToOverride: 0
            }
        };

        aggregateArray.push(shipFromOverride);
        aggregateArray.push(shipToOverride);
        aggregateArray.push(shipModificationProjection);


        if (req.query.sort_by) {
            //default ascending order
            const sortOrder = (req.query.order === 'desc' ? -1 : 1);

            /*
             * Sort by best match as primary sort and *then*  sort order value if there is a search,
             * otherwise, sort by sort value
             */
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
            /* if there is a search and no sort is specify, sort by best match, otherwise sort by shipment key */
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
                        key: 1
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
                'data.key_fuzzy': false,
                'data.manifest': false
            }
        }
        aggregateArray.push(projection);

        const result = await Shipment.aggregate(aggregateArray);

        //filter results to determine better or even exact matches
        if (req.query.search) {

            //results are found
            if (result[0].data.length) {

                //if top match is an exact match, return only that one
                if (result[0].data[0].key.toUpperCase() === req.query.search.toUpperCase()) {
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

/**
 * Create a new shipment
 */
 router.post('/', async (req, res, err) => {
    try {
        const username = JSON.parse(decrypt(req.body.user)); //get unique user info

        if (req.body.override) {
            const serials = req.body["manifest"] ? req.body["manifest"].filter(item => item["serial"] !== "N/A").map(asset => asset["serial"]) : [];
            await Assets.updateMany({ serial: { $in: serials } }, { deployedLocation: mongoose.Types.ObjectId(req.body.shipTo), lastUpdated: Date.now() });
        } else {
            const serials = req.body["manifest"] ? req.body["manifest"].filter(item => item["serial"] !== "N/A").map(asset => asset["serial"]) : [];
            const alreadyDeployed = await Assets.find({ serial: { $in: serials } });
        }
        
        const count = await Counter.findOneAndUpdate({ name: "shipments" }, { $inc: { next: 1 } }, { useFindAndModify: false });
        const shipment = {
            createdBy: username.employeeId,
            created: Date.now(),
            updated: null,
            completed: null,
            status: "Staging",
            shipmentType: req.body.shipmentType,
            specialInstructions: req.body.specialInstructions,
            contractId: req.body.contractId || null,
            manifest: req.body.manifest,
            shipFrom: mongoose.Types.ObjectId(req.body.shipFrom),
            shipTo: mongoose.Types.ObjectId(req.body.shipTo),
            key: `SHIP-${count.next}`
        };
        if (req.body.shipFromOverride) shipment.shipFromOverride = req.body.shipFromOverride;
        if (req.body.shipToOverride) shipment.shipToOverride = req.body.shipToOverride;

        const newShipment = new Shipment(shipment);

        await newShipment.save();

        res.status(200).json({ message: "Successfully created shipment" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Error creating shipment",
            interalCode: "shipment_creation_error"
        })
    }
});

/**
 * Load database with sample documents and default shipFrom and shipTo values
 */
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

/**
 * Get a single shipment based on its unique key
 */
router.get('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        let shipment = await Shipment.findOne({ key: decodeURI(key) }).populate('shipFrom').populate('shipTo');
        if (shipment === null) {
            res.status(404).json({ message: "Shipment not found", internal_code: "shipment_not_found" });
            return;
        }
        shipment = shipment.toObject(); //convert Mongoose document to plain object to manipulate it

        /* if there is a shipment override, update the location documents with the overrides and remove the override object */
        if (shipment.shipFromOverride) {
            shipment["shipFrom"] = {
                ...shipment["shipFrom"],
                ...shipment["shipFromOverride"]
            };
            delete shipment["shipFromOverride"];
        }

        if (shipment.shipToOverride) {
            shipment["shipTo"] = {
                ...shipment["shipTo"],
                ...shipment["shipToOverride"]
            };
            delete shipment["shipToOverride"];
        }

        //return shipment as JSON document
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

module.exports = router;
