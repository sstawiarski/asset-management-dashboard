const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Rig = new Schema({
    client: { type: String, required: true, unique: false },
    operator: { type: String, required: false, unique: false },
    rigName: { type: String, required: true, unique: false },
    contactName: { type: String, required: false, unique: false },
    contactNumber: { type: String, required: true, unique: false }
});

const Rigs = mongoose.model('rig', Rig);

module.exports = Rigs;