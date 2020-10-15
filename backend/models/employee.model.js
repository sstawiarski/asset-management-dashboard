const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Employee = new Schema({
    employeeId: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true, unique: false },
    lastName: { type: String, required: true, unique: false },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true },
    jobTitle: { type: String, required: false, unique: false },
    birthDate: { type: mongoose.Schema.Types.Date, required: false, unique: false },
    gender: { type: String, required: true, unique: false },
    password: { type: String, required: true, unique: false }
});

const Employees = mongoose.model('employee', Employee);

module.exports = Employees;