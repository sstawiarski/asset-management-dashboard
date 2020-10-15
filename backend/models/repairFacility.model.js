const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RepairFacility = new Schema({
    facilityName: { type: String, required: true, unique: false },
    address: { type: String, required: true, unique: false },
    city: { type: String, required: true, unique: false },
    state: { type: String, required: true, unique: false },
    zip: { type: String, required: true, unique: false },
    contactName: { type: String, required: false, unique: false },
    contactNumber: { type: String, required: true, unique: false }
});

const RepairFacilities = mongoose.model('repair_facility', RepairFacility, 'repair_facilities');

module.exports = RepairFacilities;