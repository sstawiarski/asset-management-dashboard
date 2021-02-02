const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManifestItems = new Schema({
    item: { type: String, required: true, unique: false },
    type: { type: String, required: true, unique: false },
    quantity: { type: Number, required: true, unique: false },
    notes: { type: String, required: false, unique: false }
});

const Manifest = new Schema({
    date: { type: mongoose.Schema.Types.Date, required: false, unique: false },
    manifest: [ManifestItems]
});

//const Manifests = mongoose.model('manifest', Manifest);

module.exports = Manifest;