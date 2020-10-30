const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Event = require('../models/event.model');
const Shipment = require('../models/shipment.model')
const sampleEvents = require('../sample_data/sampleEvents.data')

router.get('/', async (req, res) => {
    try {
        if (req.query.search) {
            const search = req.query.search.replace("-", "");
            const events = await Event.fuzzySearch(search).limit(5).select({ eventData: 0, _id: 0, __v: 0 });
            const sortBy = req.query.sort_by;
            const sortOrder = req.query.order;

            if (events.length) {
                const result = events.aggregate( $sort : { [sortBy]: sortOrder });
                res.status(200).json(result);
            } else {
                res.status(400).json({
                    message: "No events found in database",
                    interalCode: "no_events_found"
                })
            }
        } else {
            const events = await Event.find({});
            if (events) res.status(200).json(events);
            else res.status(400).json({
                message: "No events found in database",
                interalCode: "no_events_found"
            })
        }
        
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error searching for events in database",
            internal_code: "event_search_error"
        })
    }
})

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

router.get('/:serial', async (req, res) => {
    const serial = req.params.serial.toUpperCase();
    try {
        const events = await Event.find({
            productIds: {
                $in: serial
            }
        });
        res.status(200).json(events);
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router;