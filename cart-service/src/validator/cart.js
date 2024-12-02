const {Validator} = require('jsonschema');

module.exports = {
    verifyCart: (cart) => {
        let validator = new Validator();
        let cartSchema = {
            type: 'object',
            properties: {
                // userId: {
                //     type: 'string',
                //     pattern: '^[0-9a-fA-F]{24}$',
                //     required: true,
                //     errorMessage: 'User ID is required and must be a valid ObjectId',
                // },
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            productId: {
                                type: 'string',
                                pattern: '^[0-9a-fA-F]{24}$',
                                errorMessage: 'Product ID is required and must be a valid ObjectId',
                            },
                            name: {
                                type: 'string',
                                minLength: 1,
                                errorMessage: 'Name is required',
                            },
                            price: {
                                type: 'number',
                                minimum: 0,
                                errorMessage: 'Price is required and must be a positive number',
                            },
                            quantity: {
                                type: 'number',
                                minimum: 1,
                                errorMessage: 'Quantity is required ans must be at least 1',
                            },
                        },
                        required: ['productId', 'name', 'price', 'quantity']
                    },
                },
            },
            required: ['items'],
        };
        let result = validator.validate(cart, cartSchema);

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