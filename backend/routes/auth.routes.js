const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Employee = require('../models/employee.model');
const encrypt = require('../auth.utils').encrypt;
const decrypt = require('../auth.utils').decrypt;

router.post('/login', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "Login information missing" });
        return;
    }

    let user = null;
    if (req.body.username) {
        user = await Employee.findOne({ username: req.body.username });
    } else if (req.body.email) {
        user = await Employee.findOne({ email: req.body.email });
    }

    if (!user) {
        res.status(404).json({ message: "No user found for specified login" });
    } else {
        if (user.password === req.body.password) {
            const info = {
                employeeId: user.employeeId
            };
            const encryptedInfo = encrypt(Buffer.from(JSON.stringify(info), 'utf-8'));
            res.status(200).json({
                uniqueId: encryptedInfo,
                firstName: user.firstName,
                lastName: user.lastName
            });
        } else {
            res.status(403).json({ message: "Incorrect password" });
        }
    }
});

module.exports = router;