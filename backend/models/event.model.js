const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventTypes = [
    'Incoming Shipment',
    'Outgoing Shipment',
    'Change of Ownership',
    'Change of Group Tag',
    'Change of Retirement Status',
    'Change of Assignment Type',
    'Reassignment'
]

const Event = new Schema({
    key: { type: String, required: true, unique: true },
    productIds: { type: mongoose.Schema.Types.Array, required: true, unique: false },
    eventType: { type: String, enum: eventTypes, required: true, unique: false },
    eventTime: { type: mongoose.Schema.Types.Date, required: true, unique: false },
    eventData: { type: mongoose.Schema.Types.Mixed, required: true, unique: false }
});

const Events = mongoose.model('event', Event);

module.exports = Events;