const ProductModel = require('../models/Product');
const { verifyProduct } = require('../validator/product');

module.exports = {
    createProduct: async (req, res) => {
        try {
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
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const products = await ProductModel.find();
            res.status(201).send({
                message: 'Bienvenue sur la page des produits',
                products: products
            });
        } catch (error) {
            res.status(500).send({ error: error.message || 'Cannot get all products' });
        }
    },

    getOneProduct: async (req, res) => {
        const productId = req.params.id;

        try {
            const product = await ProductModel.findById(productId);
            res.status(200).send({
                message: 'Produit trouvé avec succès',
                product: product
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: `Error retrieving resume with id=${productId}`
            });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const isNotValid = verifyProduct(req.body);
            if (isNotValid) {
                res.status(400).send({ error: isNotValid.message });
            }

            const productId = req.params.id;

            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, req.body, { new: true });

            if (!updatedProduct) {
                return res.status(404).send({
                    message: `Resume with id=${productId} not found.`
                });
            }

            res.send({
                message: 'Mise à jour du produit réussie',
                resume: updatedProduct
            });
        } catch (error) {
            res.status(500).send({ error: error.message || `Error updating product with id=${req.params.id}` });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await ProductModel.findByIdAndDelete(productId);
            if (!product) {
                return res.status(404).send(`No record with given id: ${productId}`);
            }

            res.status(204).send({
                message: 'Produit supprimé avec succès'
            });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
};
