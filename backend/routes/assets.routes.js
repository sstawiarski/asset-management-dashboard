const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Asset = require('../models/asset.model');
const sampleAssets = require('../sample_data/sampleAssets.data')

router.get('/', async (req, res, err) => {
    try {
        res.status(400).json({
            message: "No assets found in database",
            interalCode: "no_assets"
        })
    }
    catch (err) {
        console.log(err.message)
    }
})

router.put('/loadSampleData', async (req, res) => {
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

    }
})

module.exports = router;