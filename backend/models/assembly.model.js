const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Assembly = new Schema({
    name: { type: String, required: true, unique: true },
    serializationFormat: { type: String, required: true, unique: false },
    components: { type: Array, required: false, unique: false }
});

const Assemblies = mongoose.model('schema', Assembly);

module.exports = Assemblies;