const {Validator} = require('jsonschema');

module.exports = {
    verifyProduct: (product) => {
        let validator = new Validator();
        let productSchema = {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    errorMessage: 'Name is required',
                },
                price: {
                    type: 'number',
                    minimum: 0,
                    errorMessage: 'Price is required',
                },
                category: {
                    type: 'string',
                    trim: true,
                    enum: ['food', 'clothing', 'book', 'electronics', 'household'],
                    errorMessage: 'Category is required and must be either food, clothing, book, electronics or household',
                },
                stock: {
                    type: 'number',
                    min: 0,
                    errorMessage: 'Stock is required',
                },
            },
            required: ['name', 'price', 'category', 'stock']
        };
        let result = validator.validate(product, productSchema);

        // If validation fails
        if (Array.isArray(result.errors) && result.errors.length) {
            let failedInputs = '';

            result.errors.forEach((error) => {
                failedInputs += (error.schema.errorMessage || error.message) + ', ';
            });
            return {
                message: failedInputs
            };
        }

    }
}