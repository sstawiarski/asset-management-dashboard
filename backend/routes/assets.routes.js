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
        	const sort = req.params.sort;
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
            const assets = await Asset.find({}).sort({'dateCreated': 1});
            if (assets) res.status(200).json(assets);
            else res.status(500).json({
                message: "No assets found in database",
                interalCode: "no_assets_found"
            })
        }

    }
    catch (err) {
        console.log(err.message)
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

        res.status(200).json({message: "success"})
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

router.get('/searchFilter', async (req, res, err) => {
    const filter = req.params.search;
    try {
        const asset = await Asset.find({ searchFilter: searchFilter });

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