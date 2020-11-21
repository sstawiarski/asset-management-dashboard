const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Customer = require('../models/customer.model');
const sampleCustomers = require('../sample_data/sampleCustomer.data')
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find({}).select({companyName: 1});
        res.status(200).json(customers)
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
        sampleCustomers.forEach(async (item, idx) => {
            const customer = new Customer({
                ...item,
            });
            await customer.save();
        })
        res.status(200).json({message: "success"})
    }
    catch (err) {
        res.status(500).json({
            message: "Error loading sample data into database",
            internal_code: "database_load_error"
        })
    }
})



module.exports = router;