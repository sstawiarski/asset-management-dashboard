
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ngrams } = require('mongoose-fuzzy-searching/helpers');
const connection = mongoose.connection;
const Event = require('../models/event.model');
const Shipment = require('../models/shipment.model')
const sampleEvents = require('../sample_data/sampleEvents.data')

router.get('/', async (req, res) => {

    try {

        let aggregateArray = [];

        if (req.query.search) {

            const searchTerm = req.query.search.replace("-", "");
            let search = { 
                $match: {
                    $text: {
                        $search: nGrams(searchTerm, null, false).join(' ')
                    }
                }
            }
            
            let confidenceScore = {
                $addFields: {
                    confidenceScore: { $meta: "textScore" }
                }
            }

            aggregateArray.push(search);
            aggregateArray.push(confidenceScore);

        }

       if  (req.query.sort_by) {
            //default ascending order
            var sortby = req.query.sort_by.toString().trim();
            const sortOrder = (req.query.order == 'desc' ? -1 : 1);
            if (req.query.search) {
                let sort = { $sort: { confidenceScore : -1, [req.query.sort_by] :  sortOrder }};
                aggregateArray.push(sort);
            } else {
                let sort = { $sort: { [req.query.sort_by] :  sortOrder }};
                aggregateArray.push(sort);
            }
        }

  

        let limit = { $limit : 5 };
        aggregateArray.push(limit);


        const result = await Event.aggregate(aggregateArray);

        if (req.query.search) {

            if (result) {   

                res.status(200).json(result);

            } else {

                res.status(204).json({
                message: "No events found in database",
                interalCode: "no_assets_found",
                });
            }

        } else {

            if (result) {

                res.status(200).json(result);

            } else {

                res.status(204).json({
                message: "No events found in database",
                interalCode: "no_assets_found",
                });
            }

        }
    }  
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error searching for events in database",
            internal_code: "event_search_error"
        });
    }
});

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
});

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
});

module.exports = router;