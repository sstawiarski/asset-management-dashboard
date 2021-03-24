const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const Customer = new Schema({
    customerId: { type: Number, required: true, unique: true },
    firstName: { type: String, required: false, unique: false },
    lastName: { type: String, required: false, unique: false },
    companyName: { type: String, required: false, unique: false },
    addressLine1: { type: String, required: true, unique: false },
    addressLine2: { type: String, required: false, unique: false },
    city: { type: String, required: true, unique: false },
    state: { type: String, required: true, unique: false },
    zip: { type: String, required: true, unique: false },
    confidenceScore: { type: mongoose.Schema.Types.Number, required: false, unique: false }
});

Customer.plugin(mongoose_fuzzy_searching, {
    fields: [
        {
            name: 'companyName',
            escapeSpecialCharacters: true
        },
        'firstName',
        'lastName'
    ]
});

const Customers = mongoose.model('customer', Customer);

module.exports = Customers;