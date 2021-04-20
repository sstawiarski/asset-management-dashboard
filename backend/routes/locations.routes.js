const express = require('express');
const router = express.Router();
const Location = require('../models/location.model');
const sampleLocations = require('../sample_data/sampleLocations.data');
const mongoose = require('mongoose');
const { cacheTime } = require('../cache');

router.get('/', async (req, res) => {
    const type = req.query.type;
    const decodeType = decodeURI(type);
    try {

        /* No specific type selected, send all as one array with appropriate type and name identifiers */
        if (!type) {

            const result = await Location
                .find({})
                .select({ contactName: 0, contactNumber: 0, __v: 0 })
                .sort({ locationType: 1, locationName: 1 })
                .cache({ ttl: cacheTime });

            res.status(200).json(result);

        } else {
            if (decodeType !== "Rig" && decodeType !== "Staging Facility" && decodeType !== "Repair Facility") {
                res.status(400).json({ message: "Invalid type specifier", internalCode: "invalid_location_type" });
            } else {

                const result = await Location
                    .find({ locationType: decodeType })
                    .select({ contactName: 0, contactNumber: 0, __v: 0 })
                    .sort({ locationName: 1 });

                if (result.length) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "No results found for type", internalCode: "no_locations_found" });
                }
            }
        }
    }
    catch (err) {
        res.status(500).json({
            message: "Error retrieving location information",
            internal_code: "location_retrieval_error"
        })
    }
});

router.put("/load", async (req, res) => {
    try {
        await Location.create(sampleLocations);
        await mongoose.clearCache({ collection: 'locations' }, true);
        res.status(200).json({ message: "loaded locations" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "error loading locations", internalCode: "location_load_error" });
    }
});

router.get("/:location", async (req, res) => {
    try {
        const getLocation = req.params.location;

        const location = await Location
            .findOne({ key: getLocation })
            .cache({ ttl: cacheTime });

        if (location) res.status(200).json(location);
        else res.status(404).json({ message: "No location found for key", internalCode: "location_not_found" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "error retrieving location data", internalCode: "location_retrieval_error" });
    }
});

module.exports = router;