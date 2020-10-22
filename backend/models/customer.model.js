const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer = new Schema({
    customerId: { type: Number, required: true, unique: true },
    firstName: { type: String, required: false, unique: false },
    lastName: { type: String, required: false, unique: false },
    companyName: { type: String, required: false, unique: false },
    addressLine1: { type: String, required: true, unique: false },
    addressLine2: { type: String, required: false, unique: true },
    city: { type: String, required: true, unique: false },
    state: { type: String, required: true, unique: false },
    zip: { type: String, required: true, unique: false },
});

const Customers = mongoose.model('customer', Customer);

module.exports = Customers;