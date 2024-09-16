const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    codProd: String,
    name: String,
    price_current: Number,
    price_promotion: Number,
    type: String,
    description: String,
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('Product', productSchema);
