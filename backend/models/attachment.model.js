const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Attachment = new Schema({
    uuid: { type: String, required: true, unique: true },
    filename: { type: String, required: true, unique: false },
    link: { type: String, required: true, unique: true },
    fileType: { type: String, required: true, unique: false },
    user: { type: String, required: true, unique: false },
    dateAdded: { type: Schema.Types.Date, required: false, unique: false }
});

module.exports = Attachment;