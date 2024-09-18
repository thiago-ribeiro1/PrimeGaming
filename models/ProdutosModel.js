const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    codProd: String,
    name: String,
    price_current: Number,
    price_promotion: Number,
    type: String,
    description: String,
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('Product', ProductSchema);
