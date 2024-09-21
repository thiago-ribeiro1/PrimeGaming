const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Cliente', clientSchema);

