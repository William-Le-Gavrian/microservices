require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const apiRouter = require('./routes/cart');
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
            title: "Cart Service API",
            version: "1.0.0",
            description: "API documentation for the Cart Service",
        },
        servers: [
            {
                url: "http://localhost:3002",
            },
        ],
    },
    apis: ["./src/routes/cart.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/cart-api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Connection has been etablished successfully');
    })
    .catch((error) => {
        console.error('Unable to connect database: ', error);
    });

app.get('/', (req, res) => {
    res.send('Bonjour nous sommes dans le panier');
});

app.use('/api/cart', apiRouter);

app.listen(3002, () => {
    console.log('Server is running on port http://localhost:3002');
    console.log(`Doc for Cart Service : http://localhost:3002/cart-api-docs`);
});
