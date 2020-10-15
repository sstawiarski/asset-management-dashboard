const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Event = require('../models/event.model');
const sampleEvents = require('../sample_data/sampleEvents.data')

router.put('/loadSampleEvents', async (req, res) => {
    try {
        sampleEvents.forEach(async (item) => {
            const event = new Event({
                ...item,
                eventTime: Date.now()
            })

            await event.save();

            res.status(200).json({message: "success"})
        })
    } catch (err) {
        console.log(err);
    }
})

router.get('/:serial', async (req, res) => {
    const serial = req.params.serial;
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