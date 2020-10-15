const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StagingFacility = new Schema({
    facilityName: { type: String, required: true, unique: false },
    operator: { type: String, required: false, unique: false },
    rigName: { type: String, required: false, unique: false },
    contactName: { type: String, required: false, unique: false },
    contactNumber: { type: String, required: true, unique: false }
});

const StagingFacilities = mongoose.model('staging_facility', StagingFacility, 'staging_facilities');

module.exports = StagingFacilities;