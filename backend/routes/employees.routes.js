const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Employee = require('../models/employee.model');
const sampleEmployees = require('../sample_data/sampleEmployee.data')

router.put('/load', async (req, res) => {
    try {
        sampleEmployees.forEach(async (item, idx) => {
            const employee = new Employee({
                ...item,
                birthDate: new Date(`07/${idx+1}/${1975+idx}`)
            });
            await employee.save();
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