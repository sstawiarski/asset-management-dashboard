const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Manifest = require('../models/manifest.model');
const sampleManifest = require('../sample_data/sampleManifest.data')


router.get('/', async (req, res) => {
    try {
        const manifest = await Manifest.find();
        res.status(200).json(manifest)
    }
    catch (err) {
        res.status(500).json({
            message: "Error loading sample data into database",
            internal_code: "database_load_error"
        })
    }
})

router.put('/load', async (req, res) => {
    try {
        sampleManifest.forEach(async (item, idx) => {
            const manifest = new Manifest({
                ...item,
            });
            await manifest.save();
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


module.exports = router;