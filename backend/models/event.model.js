const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const eventTypes = [
    'Creation',
    'Assembly Creation',
    'Incoming Shipment',
    'Outgoing Shipment',
    'Change of Ownership',
    'Change of Group Tag',
    'Change of Retirement Status',
    'Change of Assignment Type',
    'Reassignment',
    'Assembly Modification',
    'Change of Location',
    'Removal from Assembly'
]

const Event = new Schema({
    key: { type: String, required: true, unique: true },
    productIds: { type: mongoose.Schema.Types.Array, required: true, unique: false },
    eventType: { type: String, enum: eventTypes, required: true, unique: false },
    eventTime: { type: mongoose.Schema.Types.Date, required: true, unique: false },
    initiatingUser: { type: mongoose.Schema.Types.Number, required: false, unique: false },
    eventData: { type: mongoose.Schema.Types.Mixed, required: true, unique: false },
    confidenceScore: { type: mongoose.Schema.Types.Number, required: false, unique: false }
});

Event.plugin(mongoose_fuzzy_searching, {
    fields: [
        {
            name: 'key',
            escapeSpecialCharacters: true
        }
    ]
})

const Events = mongoose.model('event', Event);

module.exports = Events;