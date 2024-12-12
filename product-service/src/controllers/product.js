const ProductModel = require('../models/Product');
const { verifyProduct } = require('../validator/product');

module.exports = {
    createProduct: async (req, res) => {
        try {
            console.log('Création du produit...');
            const isNotValid = verifyProduct(req.body);
            if (isNotValid) {
                res.status(400).send({ error: isNotValid.message });
            }

            const newProduct = new ProductModel(req.body);

            await newProduct.save();

            return res.status(200).send({
                message: 'Produits créés avec succès',
                product: newProduct
            });

            console.log('Produit créé avec succès !');
        } catch (error) {
            console.log('Erreur lors de la création du produit :', error.message);
            res.status(500).send({ error: error.message });
        }
    },

    getAllProducts: async (req, res) => {
        try {
            console.log('Affichage de tous les produits...');

            const products = await ProductModel.find();
            if (!products) {
                res.status(404).send({ message: 'Products not found' });
            }

            res.status(201).send({
                message: 'Bienvenue sur la page des produits',
                products: products
            });

            console.log('Voici la page des produits !');
        } catch (error) {
            console.log('Erreur lors de la récupération des produits :', error.message);
            res.status(500).send({ error: error.message || 'Cannot get all products' });
        }
    },

    getOneProduct: async (req, res) => {
        const productId = req.params.id;

        try {
            console.log('Recherche du produit...');
            const product = await ProductModel.findById(productId);

            if (!product) {
                res.status(404).send({ message: 'Product not found' });
            }

            res.status(200).send({
                message: 'Produit trouvé avec succès',
                product: product
            });

            console.log('Produit trouvé avec succès !');
        } catch (error) {
            console.log('Erreur lors de la récupération du produit :', error.message);
            res.status(500).send({
                message: `Error retrieving product with id=${productId}`
            });
        }
    },

    updateProduct: async (req, res) => {
        try {
            console.log('Mise à jour du produit...');

            const isNotValid = verifyProduct(req.body);
            if (isNotValid) {
                res.status(400).send({ error: isNotValid.message });
            }

            const productId = req.params.id;

            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, req.body, { new: true });

            if (!updatedProduct) {
                return res.status(404).send({
                    message: `Product with id=${productId} not found.`
                });
            }
            res.status(200).send({
                message: 'Mise à jour du produit réussie',
                resume: updatedProduct
            });

            console.log('Produit mis à jour avec succès !');
        } catch (error) {
            res.status(500).send({ error: error.message || `Error updating product with id=${req.params.id}` });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            console.log('Suppression du produit...');

            const productId = req.params.id;
            const product = await ProductModel.findByIdAndDelete(productId);
            if (!product) {
                return res.status(404).send(`No record with given id: ${productId}`);
            }

            res.status(204).send({
                message: 'Produit supprimé avec succès'
            });

            console.log('Produit supprimé avec succès !');
        } catch (error) {
            console.log('Erreur lors de la suppression du produit :', error.message);
            res.status(500).send({ error: error.message });
        }
    }
};
