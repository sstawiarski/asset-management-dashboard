const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const manifest = require('./manifest.model')
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const { getValue, setValue } = require("mongoose/lib/utils");

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
    key: { type: String, required: true, unique: true },
    createdBy: { type: String, required: true, unique: false},
    created: { type: mongoose.Schema.Types.Date, required: true, unique: false },
    updated: { type: mongoose.Schema.Types.Date, required: false, unique: false },
    completed: { type: mongoose.Schema.Types.Date, required: false, unique: false },
    status: { type: String, enum: status, required: true, unique: false },
    shipmentType: { type: String, enum: shipmentType, required: true, unique: false },
    shipFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'location', required: true, unique: false },
    shipTo: { type: mongoose.Schema.Types.ObjectId, ref: 'location', required: true, unique: false },
    specialInstructions: { type: String, required: false, unique: false },
    contractId: { type: String, required: false, unique: false },
    confidenceScore: { type: mongoose.Schema.Types.Number, required: false, unique: false },
    manifest: [manifest]
});

Shipment.plugin(mongoose_fuzzy_searching, {
    fields: [
        {
            name: 'key',
            escapeSpecialCharacters: true
        }
    ]
})

Shipment.static({
    getFullShipment(query) {
        return this.findOne(query).populate('shipFrom').populate('shipTo');
    },
    hydratePopulated(json) {
        let obj = this.hydrate(json);
        for (const [key, val] of Object.entries(this.schema.obj)) {
          const ref = val["ref"];
          if (!ref) continue;
          
          const value = getValue(key, json);
          if (value === null || value instanceof mongoose.Types.ObjectId) continue;
          setValue(key, mongoose.model(ref).hydrate(value), obj);
        }
      
        return obj;
      }
})

const Shipments = mongoose.model('shipment', Shipment);

module.exports = Shipments;