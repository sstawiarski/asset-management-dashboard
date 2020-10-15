const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Event = require('../models/event.model');
const Shipment = require('../models/shipment.model')
const sampleEvents = require('../sample_data/sampleEvents.data')

router.put('/load', (req, res) => {
    try {
        sampleEvents.forEach(async (item) => {
            let data = item.eventData;
            if (item.eventType.includes("Shipment")) {
                data = new Shipment({
                    ...item.eventData
                })
            }
            const event = new Event({
                ...item,
                eventTime: Date.now(),
                eventData: data
            })

            await event.save();
        })
        res.status(200).json({message: "success"})
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error loading sample data into database",
            internal_code: "database_load_error"
        })
    }
})

module.exports = router;