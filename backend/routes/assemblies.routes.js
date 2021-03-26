const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Assembly = require("../models/assembly.model");

//TODO: deal with the duplication of this functionality in assets.routes.js
router.get('/types', async (req, res) => {
    try {
        const types = await Assembly.find({}).select({ name: 1, _id: 0 }).cache({ ttl: 60 * 60 * 1000});
        const newTypes = types.map(item => item["name"]);
        res.status(200).json(newTypes);
    }
    catch (err) {
        res.status(500).json({
            message: "Error retrieving location information",
            internal_code: "location_retrieval_error"
        })
    }
})

module.exports = router;