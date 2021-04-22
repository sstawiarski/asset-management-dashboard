const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { nGrams } = require('mongoose-fuzzy-searching/helpers');
const connection = mongoose.connection;
const Event = require('../models/event.model');
const Shipment = require('../models/shipment.model')
const sampleEvents = require('../sample_data/sampleEvents.data')
const dateFunctions = require("date-fns");
const { cacheTime } = require('../cache');

router.get('/', async (req, res) => {

    try {

        let aggregateArray = [];

        if (req.query) {
            const query = req.query;

            const disallowed = ["page", "limit", "search", "sort_by", "order"];
            const filters = Object.keys(query)
                .reduce((p, c) => {

                    /* MongoDB compares exact dates and times
                    If we want to see an entire 24 hours, we much get the start and end times of the given day
                    And get everything in between the start and end */
                    if (c === "eventTime") {
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
                    } else if (c === "eventType") {
                        p[c] = decodeURI(query[c]);
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
                aggregateArray.push(confidenceScore);

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
            ///default ascending order
            const sortOrder = (req.query.order == 'desc' ? -1 : 1);
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
                'data.key_fuzzy': false
            }
        }
        aggregateArray.push(projection);

        const result = await Event.aggregate(aggregateArray).cache({ ttl: cacheTime });

        if (req.query.search) {

            if (result[0].data.length) {
                if (result[0].data[0].key.toUpperCase() === req.query.search.toUpperCase()) {
                    const exactMatch = [result[0].data[0]];
                    res.status(200).json({
                        count: [{ count: 1 }],
                        data: exactMatch
                    });
                } else {

                    if (result[0].data[0].confidenceScore > 10) {
                        const closeMatches = result[0].data.filter(event => event.confidenceScore > 10);
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
                    message: "No events found in database",
                    interalCode: "no_assets_found",
                });
            }

        } else {

            if (result[0].data.length) {
                res.status(200).json(result[0]);

            } else {
                res.status(404).json({
                    message: "No events found in database",
                    interalCode: "no_events_found",
                });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error searching for events in database",
            internal_code: "event_search_error"
        });
    }
});

router.put('/load', async (req, res) => {
    try {
        sampleEvents.forEach(async (item) => {
            let data = item.eventData;
            if (item.eventType.includes("Shipment")) {
                data = new Shipment({
                    ...item.eventData
                })
            }
            const event = new Event({
                ...item,
                eventTime: Date.now(),
                eventData: data
            })

            await event.save();
        });

        await mongoose.clearCache({ collection: 'events' }, true);

        res.status(200).json({ message: "success" })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error loading sample data into database",
            internal_code: "database_load_error"
        })
    }
});

router.get('/:serial', async (req, res) => {
    const serial = req.params.serial.toUpperCase();
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);
    try {
        let events = await Event.find({
            $or: [
                {
                    productIds: {
                        $in: serial
                    }
                },
                {
                   "productIds.serial": serial
                }
            ]
        }).sort({ eventTime: -1 }).cache({ ttl: cacheTime });

        if (req.query) {
            if (limit && (skip >= 0)) {
                events = events.slice(skip*limit, skip*limit + limit);
            }
        }
        res.status(200).json(events);
    }
    catch (err) {
        console.log(err)
    }
});

module.exports = router;