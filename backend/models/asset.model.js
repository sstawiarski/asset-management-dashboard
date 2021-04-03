const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const Asset = new Schema({
    serial: { type: String, required: true, unique: true },
    assetName: { type: String, required: true, unique: false },
    assetType: { type: String, enum: ['Asset', 'Assembly'], required: true, unique: false },
    deployedLocation: { type: mongoose.Schema.Types.ObjectId, ref:'location', required: false, unique: false },
    deployedLocationOverride: { type: mongoose.Schema.Types.Mixed, required: false, unique: false },
    owner: { type: String, required: true, unique: false },
    parentId: { type: String, required: false, unique: false },
    dateCreated: { type: mongoose.Schema.Types.Date, required: true, unique: false },
    lastUpdated: { type: mongoose.Schema.Types.Date, required: false, unique: false },
    checkedOut: { type: mongoose.Schema.Types.Boolean, required: true, unique: false },
    groupTag: { type: String, required: false, unique: false },
    assignmentType: { type: String, enum: ['Owned', 'Rental'], required: true, unique: false },
    assignee: { type: String, required: false, unique: false },
    contractNumber: { type: String, required: false, unique: false },
    checkedOut: { type: mongoose.Schema.Types.Boolean, required: true, unique: false },
    retired: { type: mongoose.Schema.Types.Boolean, required: false, unique: false },
    confidenceScore: { type: mongoose.Schema.Types.Number, required: false, unique: false },
    incomplete: { type: mongoose.Schema.Types.Boolean, required: false, unique: false },
    missingItems: { type: mongoose.Schema.Types.Array, required: false, unique: false },
    assembled: { type: mongoose.Schema.Types.Boolean, required: false, unique: false },
});

Asset.plugin(mongoose_fuzzy_searching, {
    fields: [
        {
            name: 'serial',
            escapeSpecialCharacters: true
        }
    ]
})



const Assets = mongoose.model('asset', Asset);

module.exports = Assets;