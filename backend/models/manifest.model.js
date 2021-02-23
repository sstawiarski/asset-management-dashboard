const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Manifest = new Schema({
    item: { type: String, required: true, unique: false },
    type: { type: String, required: true, unique: false },
    quantity: { type: Number, required: true, unique: false },
    notes: { type: String, required: false, unique: false },
    serialized: { type: Boolean, required: true, unique: false }
});

module.exports = Manifest;