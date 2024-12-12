const ProductModel = require("../models/Product");
const {verifyProduct} = require("../validator/product");


module.exports = {
    createProduct: async (req, res) => {
        try {
            const isNotValid = verifyProduct(req.body);
            if(isNotValid) {
                res.status(400).send({error: isNotValid.message});
            }

            const newProduct = new ProductModel(req.body);

            await newProduct.save();

            return res.status(200).send({message: 'Product created', product: newProduct});

        } catch(error){
            res.status(500).send({error: error.message});
        }
    },

    getAllProducts: async (req, res) =>{
        try {
            const products = await ProductModel.find();

            if(!products){
                res.status(404).send({message: 'Products not found'});
            }

            res.status(200).send({products: products});
        } catch(error){
            res.status(500).send({error: error.message || 'Cannot get all products'});
        }
    },

    getOneProduct: async (req, res) => {
        const productId = req.params.id;

        try {
            const product = await ProductModel.findById(productId);

            if(!product){
                res.status(404).send({message: 'Product not found'});
            }

            res.status(200).send({product: product});
        } catch (error) {
            res.status(500).send({
                message: `Error retrieving product with id=${productId}`
            });
        }
    },

    updateProduct: async (req, res) => {

        try{
            const isNotValid = verifyProduct(req.body);
            if(isNotValid) {
                res.status(400).send({error: isNotValid.message});
            }

            const productId = req.params.id;

            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, req.body, {new: true});

            if(!updatedProduct) {
                return res.status(404).send({
                    message: `Product with id=${productId} not found.`
                });
            }

            res.status(200).send({
                message: 'Product was updated successfully.',
                product: updatedProduct
            });
        } catch(error){
            res.status(500).send({error: error.message || `Error updating product with id=${req.params.id}`});
        }
    },

    deleteProduct: async (req, res) => {
        try{
            const productId = req.params.id;
            const product = await ProductModel.findByIdAndDelete(productId);
            if(!product) {
                return res.status(404).send(`No record with given id: ${productId}`)
            }

            res.status(204).send({message: 'Product deleted successfully.'});

        } catch(error){
            res.status(500).send({error: error.message});
        }
    }
}