// placeholder for shipment routing
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Assets = require('../models/asset.model');
const connection = mongoose.connection;
const Shipment = require('../models/shipment.model');
const sampleShipment = require('../sample_data/sampleShipment.data');

router.get('/', async (req, res) => {
    try {
        const shipments = await Shipment.find();
        res.status(200).json(shipments)
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
        sampleShipment.forEach(async (item, idx) => {
            const shipment = new Shipment({
                ...item,
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
})

router.post('/create-Shipment', async(req, res, err) => {
    try{
        const shipments = new Shipment({
            createdBy: req.body.createdBy,
            created: req.body.created,
            updated: req.body.updated,
            completed: req.body.completed,
            status: req.body.status,
            shipmentType: req.body.shipmentType,
            shipFrom: req.body.shipFrom,
            shipTo: req.body.shipTo,
            specialInstructions: req.body.specialInstructions,
            contractId: req.body.contractId,
            manifest: req.body.manifest
        })

        await shipments.save();
        res.status(200).json({ message: "Succesfully updated"})
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
          message: "Error creating assembly",
          interalCode: "assembly_creation_error"
        })
      }
})

module.exports = router;