const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Rig = require('../models/rig.model');
const RepairFacility = require('../models/repairFacility.model')
const StagingFacility = require('../models/stagingFacility.model')
const sampleRigs = require('../sample_data/sampleRig.data')
const sampleStagingFacilities = require('../sample_data/sampleStagingFacility.data')
const sampleRepairFacilities = require('../sample_data/sampleRepairFacility.data')

router.get('/', async (req, res) => {
    const type = req.query.type;
    try {
        if (!type) {
            res.status(400).json({
                message: "Missing location type query paramter",
                internal_code: "missing_query_params"
            })
        } else {
            if (type === "rig") {
                const rigs = await Rig.find({});
                res.status(200).json(rigs)
            } else if (type === "staging") {
                const staging = await StagingFacility.find({});
                res.status(200).json(staging)
            } else if (type === "repair") {
                const repair = await RepairFacility.find({});
                res.status(200).json(repair)
            }
        }
    }
    catch (err) {
        res.status(500).json({
            message: "Error retrieving location information",
            internal_code: "location_retrieval_error"
        })
    }
})

router.put('/load', (req, res) => {
    const type = req.query.type;

    try {
        if (type) {

            if (type === "rig") {

                sampleRigs.forEach(async (item) => {
                    const rig = new Rig({
                        ...item
                    })
                    await rig.save();
                })

            } else if (type === "staging") {

                sampleStagingFacilities.forEach(async (item) => {
                    const staging = new StagingFacility({
                        ...item
                    })
                    await staging.save();
                })

            } else if (type === "repair") {

                sampleRepairFacilities.forEach(async (item) => {
                    const repair = new RepairFacility({
                        ...item
                    })
                    await repair.save();
                })

            }

            res.status(200).send({ message: "success" })
        } else {

            sampleRigs.forEach(async (item) => {
                const rig = new Rig({
                    ...item
                })
                await rig.save();
            })

            sampleStagingFacilities.forEach(async (item) => {
                const staging = new StagingFacility({
                    ...item
                })
                await staging.save();
            })

            sampleRepairFacilities.forEach(async (item) => {
                const repair = new RepairFacility({
                    ...item
                })
                await repair.save();
            })

            res.status(200).json({ message: "success" })
        }

    } catch (err) {

    }
})

module.exports = router;