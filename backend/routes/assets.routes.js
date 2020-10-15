const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Asset = require('../models/asset.model');
const sampleAssets = require('../sample_data/sampleAssets.data')

router.get('/', async (req, res, err) => {
    try {
        if (req.query.search) {
            const assets = await Asset.fuzzySearch(req.query.search).limit(5);
            if (assets.length) {
                res.status(200).json(assets);
            } else {
                res.status(500).json({
                    message: 'No assets found for serial',
                    internalCode: 'no_assets_found'
                })
            }
        }
        else {
            const assets = await Asset.find({});
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

module.exports = router;