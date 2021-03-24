const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationTypes = [
    "Rig",
    "Repair Facility",
    "Staging Facility"
];

const Location = new Schema({
    key: { type: String, required: true, unique: true },
    locationName: { type: String, required: true, unique: false },
    locationType: { type: String, enum: locationTypes, required: true, unique: false },
    client: { type: String, required: false, unique: false },
    rigName: { type: String, required: false, unique: false },
    operator: { type: String, required: false, unique: false },
    address: { type: String, required: false, unique: false },
    city: { type: String, required: false, unique: false },
    state: { type: String, required: false, unique: false },
    zip: { type: String, required: false, unique: false },
    coordinates: { type: [Number], required: false, unique: false },
    contactName: { type: String, required: false, unique: false },
    contactNumber: { type: String, required: true, unique: false }
});

const Locations = mongoose.model('location', Location);

module.exports = Locations;