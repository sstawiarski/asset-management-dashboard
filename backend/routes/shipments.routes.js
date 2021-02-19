const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Shipment = require('../models/shipment.model');
const sampleShipment = require('../sample_data/sampleShipment.data');

router.get('/', async (req, res) => {
    try {
        const shipments = await Shipment.find({}, { __v: 0, manifest: 0 }).populate('shipFrom').populate('shipTo');
        res.status(200).json(shipments)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error loading sample data into database",
            internal_code: "database_load_error"
        })
    }
})

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
        const { key } = req.params;
        const shipment = await Shipment.findOne({ key: decodeURI(key) }).populate('shipFrom').populate('shipTo');
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