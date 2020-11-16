const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Customer = require('../models/customer.model');
const sampleCustomers = require('../sample_data/sampleCustomer.data');

router.get('/', async (req, res) => {
    try {
        let customers = null;
        if (req.query.search) {

            //client should send in search term as an encoded URI,
            //mainly for replacing spaces in the search with %20
            const searchTerm = decodeURI(req.query.search).replace("-", "");
            customers = await Customer.fuzzySearch(searchTerm).select({
                _id: 0,
                __v: 0
            });

            if (customers.length > 0) {
                if (customers[0].confidenceScore > 10) {
                    const closeMatches = customers.filter(customer => customer.confidenceScore > 10);
                    res.status(200).json(closeMatches);
                    return;
                }
            } else {
                res.status(404).json({
                    message: "No customers found in database",
                    internal_code: "no_customers_found"
                });
                return;
            }
        } else {
            customers = await Customer.find({}).select({
                _id: 0,
                __v: 0
            });
        }

        if (customers.length > 0) {
            res.status(200).json(customers);
        } else {
            res.status(404).json({
                message: "No customers found in database",
                internal_code: "no_customers_found"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error retrieving customer list",
            internal_code: "customer_retrieval_error"
        })
    }
});

router.put('/load', async (req, res) => {
    try {
        sampleCustomers.forEach(async (item, idx) => {
            const customer = new Customer({
                ...item,
            });
            await customer.save();
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

module.exports = router;