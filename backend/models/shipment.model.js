const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const manifest = require('./manifest.model')

const shipmentType = [
    'Incoming',
    'Outgoing'
];

const status = [
    'Staging',
    'Completed',
    'Abandoned'
];

const Shipment = new Schema({
    createdBy: { type: String, required: true, unique: false},
    created: { type: mongoose.Schema.Types.Date, required: true, unique: false },
    updated: { type: mongoose.Schema.Types.Date, required: false, unique: false },
    completed: { type: mongoose.Schema.Types.Date, required: false, unique: false },
    status: { type: String, enum: status, required: true, unique: false },
    shipmentType: { type: String, enum: shipmentType, required: true, unique: false },
    shipFrom: { type: mongoose.Schema.Types.Mixed, required: true, unique: false },
    shipTo: { type: mongoose.Schema.Types.Mixed, required: true, unique: false },
    specialInstructions: { type: String, required: false, unique: false },
    contractId: { type: String, required: false, unique: false },
    manifest: [manifest]
});

const Shipments = mongoose.model('shipments', Shipment);

module.exports = Shipments;