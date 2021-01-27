const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Manifest = require('../models/manifest.model');

router.get('/', async (req, res) => {
    try {
        const manifest = await Manifest.find({}).select();
        res.status(200).json(manifest)
    }
    catch (err) {
        res.status(500).json({
            message: "Error loading sample data into database",
            internal_code: "database_load_error"
        })
    }
});


module.exports = router;