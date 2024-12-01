const CartModel = require('../models/Cart');
const axios = require('axios');

module.exports = {
    createCart: async (req, res) => {
        try {
            // const userId = req.user.id;
            const cart = await CartModel.findOneAndUpdate(
                // { userId },
                { items: [] }, // Création d'un panier vide
                { upsert: true, new: true } // Crée le panier si inexistant
            );
            res.status(200).send({ cart });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    },

    getCart: async (req, res) => {
        try{
            // const userId = req.user.id;
            // const cart = await CartModel.findOne({ userId });
            const cart = await CartModel.find();

            if(!cart){
                return res.status(404).send({message: 'Cart not found'});
            }
            res.status(200).send({cart});

        } catch(error){
            res.status(500).send({error: error.message});
        }
    },

    addItemToCart: async (req, res) => {
        try {
            const { productId } = req.params;
            const { quantity } = req.body;

            console.log(productId);

            if (!productId) {
                return res.status(400).send({ message: "Invalid or missing productId" });
            }

            if (quantity < 1) {
                return res.status(400).send({ message: "Quantity is required and must be at least 1" });
            }

            const productResponse = await axios.get(`http://localhost:3001/api/products/${productId}`);
            const product = productResponse.data;

            console.log(product);

            if (!product || product.stock < quantity) {
                return res.status(400).send({ message: "Product not available in requested quantity" });
            }

            let cart = await CartModel.findOne();

            if(!cart) {
                cart = new CartModel({items: []})
            }

            const existingItem = cart.items.find(item => item.productId.toString() === productId);

            if(existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({
                    productId,
                    name: product.product.name,
                    price: product.product.price,
                    quantity,
                });
            }

            await cart.save();

            res.status(200).send({ message: "Product added top cart", cart });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    },

    removeItemFromCart: async (req, res) => {
        try{
            // const userId = req.params.id;
            const {productId} = req.params;

            const cart = await CartModel.findOneAndUpdate( // changer par findByIdAndUpdate
                // { userId },
                {},
                { $pull: { items: { productId } } },
                { new: true }
            );

            if(!cart) {
                return res.status(404).send({message: 'Cart not found'});
            }

            res.status(200).send({message: 'Product removed successfully.', cart});

        } catch (error){
            res.status(500).send({error: error.message});
        }
    }
}