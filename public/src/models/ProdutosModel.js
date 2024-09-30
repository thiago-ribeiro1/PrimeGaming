const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    codProd: { type: String, required: true, unique: true },
    name: {type: String, required: true },
    price_current: { type: Number, required: true},
    price_promotion: { type: Number, default: null },
    type: {type: String, required: true },
    description: {type: String, required: true },
    created_at: {type: Date },
    updated_at: {type: Date },
    image: { type: String }
});

module.exports = mongoose.model('Product', ProductSchema);
