const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Shipment = require('../models/shipment.model');
const Location = require('../models/location.model');
const { nGrams } = require('mongoose-fuzzy-searching/helpers');
const dateFunctions = require("date-fns");
const sampleShipment = require('../sample_data/sampleShipment.data');

// const client = require('../redis_db');

// const isCached = (req, res, next) => {
//     const { id } = req.params;
//     //First check in Redis
//     client.get(id, (err, data) => {
//         if (err) {
//             console.log(err);
//         }
//         if (data) {
//             const reponse = JSON.parse(data);
//             return res.status(200).json(reponse);
//         }
//         next();
//     });
// }

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

        if (fromLookup !== null) aggregateArray.push(fromLookup);
        if (toLookup !== null) aggregateArray.push(toLookup);
        aggregateArray.push(fromUnwind);
        aggregateArray.push(toUnwind);

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

        const result = await Shipment.aggregate(aggregateArray).cache({ ttl: 5 * 1000}); // caches for 5 seconds for testing (5 * 1000 milliseconds)

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


        const shipment = await Shipment.getFullShipment({ key: decodeURI(key) }).cache({ ttl: 30 * 1000 }); // cache for 30 seconds (30 * 1000 milliseconds)
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