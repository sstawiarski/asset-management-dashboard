const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Employee = require('../models/employee.model');
const encrypt = require('../auth.utils').encrypt;
const decrypt = require('../auth.utils').decrypt;
const base64url = require('base64url');

/* 
 * Simple POST endpoint for user authentication
 * Takes username or email along with password in body of POST request
 * 
 * Returns either error message and code or plaintext first and last name of user along with an encrypted unique identifier
 * 
 * Unique Identifier used locally for sending along with database modifications to tie events to the user
 * Encrypted to prevent editing on the frontend and to allow for secure local storage
 * 
 * See encryption specifics in auth.utils.js in parent folder
 */
router.post('/login', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ internalCode: "login_info_missing", message: "Login information missing" });
        return;
    }

    let user = null;
    if (req.body.username) {
        user = await Employee.findOne({ username: req.body.username });
    } else if (req.body.email) {
        user = await Employee.findOne({ email: req.body.email });
    }

    if (!user) {
        res.status(404).json({ internalCode: "no_user_found", message: "No user found for specified login" });
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
            res.status(403).json({ internalCode: "incorrect_password", message: "Incorrect password" });
        }
    }
});

router.get('/:user', async (req, res) => {
    try {
        const user = base64url.decode(req.params.user);
        const employee = decrypt(JSON.parse(user));
        const { employeeId } = JSON.parse(employee);

        let found = await Employee.findOne({ employeeId: employeeId }, { __v: 0, _id: 0 });
        if (found) {
            const passwordLength = found.password.length;
            found.set('password', undefined, { strict: false });
            found.set('passwordLength', passwordLength, { strict: false });
            res.status(200).json(found);
        } else {
            res.status(404).json({ message: "Unable to find user", internalCode: "user_not_found" });
        }
    } catch (err) {
        res.status(500);
    }
});

module.exports = router;