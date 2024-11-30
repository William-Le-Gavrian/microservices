const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    stock:{
        type: Number,
        required: true,
        min: 0
    },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;