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

module.exports = router;