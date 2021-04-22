const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Shipment = require('../models/shipment.model');
const Location = require('../models/location.model');
const Counter = require('../models/counter.model');
const Assets = require('../models/asset.model');
const Event = require("../models/event.model");

const { nGrams } = require('mongoose-fuzzy-searching/helpers');
const dateFunctions = require("date-fns");
const decrypt = require('../auth.utils').decrypt;

const { cacheTime } = require('../cache');
const sampleShipment = require('../sample_data/sampleShipment.data');

/**
 * Pulls all shipment info from Mongo
 */
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

        const result = await Shipment.aggregate(aggregateArray).cache({ ttl: cacheTime });

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
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {

            const username = JSON.parse(decrypt(req.body.user)); //get unique user info
            const serials = req.body["manifest"] ? req.body["manifest"].filter(item => item["serial"] !== "N/A").map(asset => asset["serial"]) : [];

            let updatedSerials = []; //stores all serials successfully updated for use with the event document later

            /* Find all assets who are in an assembly and whose parent assembly is not also being shipped */
            const inAssembly = await Assets.find({
                serial: {
                    $in: serials
                },
                $and: [
                    {
                        parentId: {
                            $ne: null
                        }
                    },
                    {
                        parentId: {
                            $nin: serials
                        }
                    }
                ]
            });

            /* Mark assets as checked out when they are added to a shipment */
            // TODO: Is this correct? When are assets marked checked out? What is the relative location from which they are checked out? What does this property even mean?
            const assetUpdateQuery = {
                checkedOut: true,
                lastUpdated: Date.now()
            };

            /* If override is present, just ship all the supplied assets with no checks */
            if (req.body.override) {
                await Assets.updateMany({ serial: { $in: serials } }, assetUpdateQuery).session(session); //update assemblies and lone assets
                await Assets.updateMany({ parentId: { $in: serials } }, assetUpdateQuery).session(session); //update children of assemblies automatically excluded from the cart
                updatedSerials = serials;
            } else {
                /* If no override is present, only update those assets who are not checked out and either not in an assembly or whose parent is being shipped */
                const alreadyCheckedOut = await Assets.find({
                    serial: { $in: serials },
                    $and: [
                        {
                            $or: [
                                { checkedOut: { $eq: false } },
                                { checkedOut: { $exists: false } }
                            ]
                        },
                        {
                            $or: [
                                {
                                    parentId: {
                                        $eq: null
                                    }
                                },
                                {
                                    parentId: {
                                        $exists: false
                                    }
                                },
                                {
                                    parentId: {
                                        $in: serials
                                    }
                                }
                            ]
                        }
                    ]
                });

                const checkedOutSerials = alreadyCheckedOut.map(asset => asset.serial);

                /* Update the assets that are not checked out */
                if (alreadyCheckedOut.length) {
                    const updateSerials = serials.filter(ser => !checkedOutSerials.includes(ser));
                    await Assets.updateMany({ serial: { $in: updateSerials } }, assetUpdateQuery).session(session);
                    updatedSerials = updateSerials;
                }

                /* Update assets without parent or whose parent is being shipped */
                if (inAssembly.length) {
                    const assemblySerials = inAssembly.map(asset => asset.serial);
                    const updateSerials = serials.filter(ser => !assemblySerials.includes(ser) && !checkedOutSerials.includes(ser));
                    await Assets.updateMany({ serial: { $in: updateSerials } }, assetUpdateQuery).session(session);
                    updatedSerials = [...updatedSerials, ...updateSerials];
                }


                /* Update children if the parent is in the shipment, no override needed */
                const findChildren = await Assets.find({
                    $and: [
                        {
                            parentId: {
                                $ne: null
                            }
                        },
                        {
                            parentId: {
                                $in: serials
                            }
                        }
                    ]
                });

                if (findChildren.length) {
                    await Assets.updateMany({
                        $and: [
                            {
                                parentId: {
                                    $ne: null
                                }
                            },
                            {
                                parentId: {
                                    $in: serials
                                }
                            }
                        ]
                    }, assetUpdateQuery).session(session);
                    updatedSerials.push(...findChildren.map(child => child.serial));
                }
            }

            /* If no assets were found, return 404 and don't create shipment */
            if (updatedSerials.length === 0) {
                res.status(400).json({ message: "No assets were added to the shipment", internalCode: "shipment_no_override" });
                return;
            }

            /* When overriding and some assets were in assemblies, update the assemblies to remove child assets and mark them incomplete */
            if (req.body.override && inAssembly.length) {

                /* Essentially a "GROUPBY" to only update each parent once */
                const parents = inAssembly.reduce((p, c) => {
                    if (p.hasOwnProperty(c["parentId"])) {
                        p[c["parentId"]].push({ serial: c["serial"], name: c["assetName"] });
                    } else {
                        p[c["parentId"]] = [].push({ serial: c["serial"], name: c["assetName"] });
                    }

                    return p;
                }, {});

                /* Add missing items to each assembly's missing items array */
                for (const key of Object.keys(parents)) {
                    const childrenNames = parents[key].map(item => item["name"]);
                    const childrenSerials = parents[key].map(item => item["serial"]);
                    await Assets.updateOne(
                        { serial: key },
                        {
                            incomplete: true,
                            $push: {
                                missingItems: {
                                    $each: childrenNames
                                }
                            }
                        }
                    ).session(session);

                    /* Generate event document for the assembly showing the removal of its children */
                    const number = await Counter.findOneAndUpdate({ name: "events" }, { $inc: { next: 1 } }, { useFindAndModify: false }).session(session);

                    await Event.create([{
                        eventType: 'Assembly Modification',
                        eventTime: Date.now(),
                        key: `ASM-${number}`,
                        productIds: [key],
                        initiatingUser: username.employeeId,
                        eventData: {
                            details: `${childrenNames.length} assets removed from parent assembly ${key} as a result of being added to a new shipment separate from the parent. Removed children: ${childrenSerials.join(", ")}.`
                        }
                    }], { session: session });

                }


            }

            /* Generate event document for the asset update and shipment */
            const count = await Counter.findOneAndUpdate({ name: "events" }, { $inc: { next: 1 } }, { useFindAndModify: false }).session(session);
            const newKey = `SHIP-${count.next}`; //shipment doc and event doc are in separate collections so they can have the same key

            await Event.create([{
                eventType: `${req.body.shipmentType} Shipment`,
                eventTime: Date.now(),
                key: newKey,
                productIds: updatedSerials,
                initiatingUser: username.employeeId,
                eventData: {}
            }], { session: session });

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
                key: newKey
            };
            if (req.body.shipFromOverride) shipment.shipFromOverride = req.body.shipFromOverride;
            if (req.body.shipToOverride) shipment.shipToOverride = req.body.shipToOverride;

            await Shipment.create([shipment], { session: session });

            await mongoose.clearCache({ collection: ['assets', 'events', 'shipments'] }, true);

            res.status(200).json({ message: "Successfully created shipment" })
        });

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Error creating shipment",
            interalCode: "shipment_creation_error"
        })
    } finally {
        session.endSession();
    }
});

router.patch('/', async (req, res) => {
    const session = await mongoose.startSession();

    /* Destructure key from request URL params to find shipment and get status from request body */
    const { shipments, user } = req.body;
    const username = JSON.parse(decrypt(user));

    /* Ensure only valid updates are applied (can add more later) */
    const allowedUpdates = ['status'];
    const updateObject = Object.entries(req.body["update"]).reduce((acc, [key, val]) => {
        if (!allowedUpdates.includes(key)) return acc;
        acc[key] = val
        return acc;
    }, {});

    try {
        await session.withTransaction(async () => {

            const foundShipments = await Shipment.find({ key: { $in: shipments } });
            const updatedShipments = await Shipment.updateMany({ key: { $in: shipments } }, updateObject).session(session);

            if (!updatedShipments.n) {
                /* Document(s) with key not found */
                res.status(404).json({ message: "Shipment not found", internal_code: "shipment_not_found" });
            } else {

                /* Update was successful */
                for (let i = 0; i < foundShipments.length; i++) {

                    /* Dynamically create the update query and description for the event document */
                    const assetUpdateObject = {};
                    const updateDescriptions = [];

                    /* Only act on assets in the manifest marked as serialized (i.e. have valid serials, not an unserialized item) */
                    const serials = foundShipments[i]["manifest"].reduce((acc, asset) => asset.serialized ? [...acc, asset.serial] : acc, []);

                    /** 
                     * Status update handler (TODO: Add more handling for abandoned?)
                     * 
                     * Updates assets' deployedLocation to the shipment's "shipTo" if the shipment is being moved from "Staging" to "Completed", indicating the asset is now at its destination
                     * Updates assets' deployedLocation to the shipment's "shipFrom" if the shipment is being moved from "Completed" back to "Staging", indicating the asset is back at its source
                     * Updates or removes assets' deployedLocationOverride as needed
                     */
                    if (updateObject["status"]) {
                        /* Store new location ID to lookup later for the event details */
                        let location = null;

                        if (foundShipments[i]["status"] === "Staging" && updateObject["status"] === "Completed") {
                            assetUpdateObject["deployedLocation"] = foundShipments[i]["shipTo"];
                            location = foundShipments[i]["shipTo"];

                            /* Set overrides as needed */
                            if (foundShipments[i]["shipToOverride"]) assetUpdateObject["deployedLocationOverride"] = foundShipments[i]["shipToOverride"];
                            else assetUpdateObject["$unset"] = { deployedLocationOverride: 1 };

                        } else if (foundShipments[i]["status"] === "Completed" && updateObject["status"] === "Staging") {
                            assetUpdateObject["deployedLocation"] = foundShipments[i]["shipFrom"];
                            location = foundShipments[i]["shipFrom"];

                            if (foundShipments[i]["shipFromOverride"]) assetUpdateObject["deployedLocationOverride"] = foundShipments[i]["shipFromOverride"];
                            else assetUpdateObject["$unset"] = { deployedLocationOverride: 1 };
                        }

                        /* Document event details */
                        updateDescriptions.push(`Shipment ${foundShipments[i]["key"]} marked '${updateObject["status"]}' from '${foundShipments[i]["status"]}'.`);
                        const foundLocation = await Location.findById({ _id: location });
                        updateDescriptions.push(`Location changed to ${foundLocation["locationName"]}.`);
                    }

                    /* Perform actual updates on all the assets in the shipment */
                    const updatedAssets = await Assets.updateMany({ serial: { $in: serials } }, assetUpdateObject).session(session);
                    if (updatedAssets.nModified) updateDescriptions.push(`Updated ${updatedAssets.nModified} asset(s) ${Object.keys(updateObject).join(", ")}.`)

                    /* Perform updates on child assets */
                    const parentAssemblies = await Assets.find({ serial: { $in: serials }, assetType: "Assembly" });
                    if (parentAssemblies.length) {
                        const parentSerials = parentAssemblies.map(asm => asm.serial);
                        const findChildren = await Assets.find({ parentId: { $in: parentSerials } }).select({ serial: 1 });
                        if (findChildren.length) {
                            const updateChildren = await Assets.updateMany({ parentId: { $in: parentSerials } }, assetUpdateObject).session(session);
                            if (updateChildren.nModified) updateDescriptions.push(`${updateChildren.nModified} asset(s) were children of assemblies in the shipment and were updated accordingly.`);
                            serials.push(...findChildren.map(child => child.serial));
                        }
                    }

                    /* Generate event document for the asset update */
                    const count = await Counter.findOneAndUpdate({ name: "events" }, { $inc: { next: 1 } }, { useFindAndModify: false }).session(session);

                    await Event.create([{
                        eventType: "Change of Location",
                        eventTime: Date.now(),
                        key: `LOC-${count.next}`,
                        productIds: serials,
                        initiatingUser: username.employeeId,
                        eventData: {
                            details: updateDescriptions.join(" ")
                        }
                    }], { session: session });
                }

                await mongoose.clearCache({ collection: ['assets', 'events', 'shipments'] }, true);

                res.status(200).json({ message: "Shipment(s) successfully updated" });
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating shipment", internal_code: "shipment_update_error" });
    } finally {
        session.endSession();
    }
});

/**
 * Load database with sample documents and default shipFrom and shipTo values
 */
router.put('/load', async (req, res) => {
    try {
        const newShipments = sampleShipment.map(shipment => ({
            ...item,
            shipFrom: item["shipFrom"] ? mongoose.Types.ObjectId(item["shipFrom"]) : null,
            shipTo: item["shipFrom"] ? mongoose.Types.ObjectId(item["shipTo"]) : null
        }));

        await Shipment.create(newShipments);

        await mongoose.clearCache({ collection: 'shipments' }, true);

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

        let shipment = await Shipment
            .getFullShipment({ key: decodeURI(key) })
            .cache({ ttl: cacheTime });

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
