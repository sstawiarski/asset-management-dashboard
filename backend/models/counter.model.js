const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Counter = new Schema({
    name: { type: String, required: true, unique: true },
    next: { type: Number, required: true, unique: false}
});

const Counters = mongoose.model('counter', Counter);

module.exports = Counters;