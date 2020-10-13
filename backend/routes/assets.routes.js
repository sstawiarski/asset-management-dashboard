const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;

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

router.get('/findBySerial', async (req, res) => {
    mongoose.connection.db.collection('asset', (err, collection) => {
        collection.find({ serial: req.query.serial }).toArray((err, data) => {
            res.json(data);
        })
    });
})

module.exports = router;