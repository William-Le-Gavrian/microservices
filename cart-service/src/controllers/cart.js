const CartModel = require('../models/Cart');
const axios = require('axios');
const mongoose = require('mongoose');

module.exports = {
    // createCart: async (req, res) => {
    //     try {
    //         // const userId = req.user.id;
    //         const cart = await CartModel.findOneAndUpdate(
    //             // { userId },
    //             { items: [] }, // Création d'un panier vide
    //             { upsert: true, new: true } // Crée le panier si inexistant
    //         );
    //         res.status(200).send({ cart });
    //     } catch (error) {
    //         res.status(500).send({ error: error.message });
    //     }
    // },

    getCart: async (req, res) => {
        try {
            console.log('Chargement du panier ...');

            // Si l'utilisateur est authentifié, on peut continuer
            const userId = req.user.userId;

            // Récupérer le panier de l'utilisateur via l'ID
            let cart = await CartModel.findOne({ userId });

            if (!cart) {
                // Si le panier n'existe pas encore, créer un panier vide
                cart = new CartModel({
                    userId: userId,
                    items: [] // Le panier est vide au départ
                });
            }

            console.log('Accès au panier validé !', cart);
            res.status(200).send({
                message: 'Voici votre panier :',
                cart
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    addItemToCart: async (req, res) => {
        try {
            const { productId } = req.params;
            const { quantity } = req.body;
            const userId = req.user.userId;

            if (!productId) {
                return res.status(400).send({ message: "Attention, le produit n'existe pas" });
            }

            if (quantity < 1) {
                return res.status(400).send({ message: 'Quantité requis doit être au dessus de 1' });
            }

            console.log('Ajout du produit au panier ...');

            const productResponse = await axios.get(`http://localhost:3001/api/products/${productId}`);
            const product = productResponse.data;

            if (!product || product.stock < quantity) {
                return res.status(400).send({ message: 'Product not available in requested quantity' });
            }

            console.log('userId:', userId);

            let cart = await CartModel.findOne({ userId });

            if (!cart) {
                cart = new CartModel({ userId: userId, items: [] });
            }

            console.log('Cart:', cart);
            console.log('userId:', userId);

            const existingItem = cart.items.find((item) => item.productId.toString() === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({
                    productId,
                    name: product.product.name,
                    price: product.product.price,
                    quantity
                });
            }

            await cart.save();

            res.status(200).send({
                message: 'Produit ajouté au panier avec succès.',
                cart
            });

            console.log('Produit en cours ajouté : ', product);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    },

    removeItemFromCart: async (req, res) => {
        try {
            const { productId } = req.params;

            if (!productId) {
                return res.status(400).send({ message: "Le produit n'existe pas" });
            }

            const userId = req.user.userId;

            // Convertir le productId de chaîne de caractères en ObjectId
            const productObjectId = new mongoose.Types.ObjectId(productId);

            // Trouver le panier de l'utilisateur
            let cart = await CartModel.findOne({ userId });

            if (!cart) {
                return res.status(404).send({ message: 'Panier introuvable' });
            }

            // Vérifier si le produit est présent dans le panier
            const productIndex = cart.items.findIndex((item) => {
                return item.productId.toString() === productObjectId.toString(); // Comparaison correcte
            });

            cart.items.splice(productIndex, 1);

            console.log(productIndex);

            if (productIndex === -1) {
                return res.status(404).send({ message: 'Produit introuvable dans le panier' });
            }

            await cart.save();

            console.log('Retrait du produit ...');

            res.status(200).send({
                message: 'Produit retiré du panier avec succès.',
                cart
            });
            console.log('Produit retiré du panier avec succès.');
        } catch (error) {
            res.status(500).send({
                error: error.message
            });
        }
    }
};
