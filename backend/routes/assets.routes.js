const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { searchFilter } = require('../documentation/schemas');
const connection = mongoose.connection;
const Asset = require('../models/asset.model');
const sampleAssets = require('../sample_data/sampleAssets.data')

router.get('/', async (req, res, err) => {
    try {
        if (req.query.search) {
            const searchTerm = req.query.search.replace("-", "");
            const assets = await Asset.fuzzySearch(searchTerm).limit(5);
            if (assets.length) {
                if (assets[0].serial.toUpperCase() === req.query.search.toUpperCase()) {
                    const result = [assets[0]]
                    res.status(200).json(result)
                }
                else {
                    if (assets[0].confidenceScore > 10) {
                        const result = assets.filter(asset => asset.confidenceScore > 10);
                        res.status(200).json(result);

                    } else {
                        res.status(200).json(assets);
                    }
                }
            } else {
                res.status(500).json({
                    message: 'No assets found for serial',
                    internalCode: 'no_assets_found'
                })
            }
        }
        else {

            //if there are possible filters, then parse them
            if (req.query) {
                const query = req.query;

                //remove page and limit filters from the query because they do not go in the .find()
                const disallowed = ["page", "limit"];
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
                        } else if (!disallowed.includes(query[c])) {
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

                //pass newly parsed filters into the find query and return the results
                const assets = await Asset.find({ ...filters });
                if (assets) res.status(200).json(assets);
                else res.status(500).json({
                    message: "No assets found in database",
                    interalCode: "no_assets_found"
                });

                //else, get all the assets in the database sorted by their creation date
            } else {
                const assets = await Asset.find({}).sort({ 'dateCreated': 1 });
                if (assets) res.status(200).json(assets);
                else res.status(500).json({
                    message: "No assets found in database",
                    interalCode: "no_assets_found"
                })
            }

        }

    }
    catch (err) {
        console.log(err.message)
        console.log(err);
    }
})

router.put('/load', async (req, res) => {
    try {
        sampleAssets.forEach(async (item) => {
            console.log(item)
            const asset = new Asset({
                ...item,
                dateCreated: Date.now()
            });
            await asset.save();
        })

        res.status(200).json({ message: "success" })
    }
    catch (err) {
        res.status(500).json({
            message: "Error loading sample data into database",
            internal_code: "database_load_error"
        })
    }
})

router.get('/:serial', async (req, res, err) => {
    const serial = req.params.serial;
    try {
        const asset = await Asset.find({ serial: serial });

        if (asset.length) {
            res.status(200).json(asset[0]);
        } else {
            res.status(500).json({
                message: 'No assets found for serial',
                internalCode: 'no_assets_found'
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: 'serial is missing',
            interalCode: 'missing_parameters'
        });
    }
})

module.exports = router;