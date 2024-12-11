const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            min: 0,
            required: true
        },
        quantity:{
            type: Number,
            min: 1,
            required: true
        },
    }]
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;