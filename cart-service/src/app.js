require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const apiRouter = require('./routes/cart');
const cors = require('cors');

// Autorise l'accès exterieur au serveur
app.use(cors());

//Parse des requetes en JSON
app.use(express.json());

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
    console.log('Server is running on port 3002');
});
