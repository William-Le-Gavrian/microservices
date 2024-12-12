require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const apiRouter = require('./routes/product');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Autorise l'accès exterieur au serveur
app.use(cors());

//Parse des requetes en JSON
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Product Service API",
            version: "1.0.0",
            description: "API documentation for the Product Service",
        },
        servers: [
            {
                url: "http://localhost:3001",
            },
        ],
    },
    apis: ["./src/routes/product.js"], // Chemin vers vos routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/product-api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Connection has been etablished successfully');
    })
    .catch((error) => {
        console.error('Unable to connect database: ', error);
    });

app.use('/api/products', apiRouter);

app.listen(3001, () => {
    console.log('Server is running on port http://localhost:3001');
    console.log(`Doc for Product Service : http://localhost:3001/product-api-docs`);
});
