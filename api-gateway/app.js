const express = require('express');

// Va permettre de rediriger les requêtes vers les bons microservices
const { createProxyMiddleware } = require('http-proxy-middleware');

// Envoi des requêtes HTTP
const axios = require('axios');

const app = express();

app.use(express.json({ limit: '10mb' }));

// Partie utilisateur
app.use('/auth', async (req, res, next) => {
    let userServiceUrl = `http://localhost:5000/api/auth${req.url}`; // Redirige vers /api/auth avec le même chemin

    if (req.url === '/') {
        userServiceUrl = `http://localhost:5000/`; // Redirige vers la route de base dans le microservice
    }

    try {
        // Log de la requête reçue
        console.log("Requête reçue dans l'API Gateway pour", req.url);

        // On ne passe pas les en-têtes pour login et register
        let headersToSend = {};

        // Si la route est '/login' ou '/register', on n'envoie pas les en-têtes
        if (req.url !== '/login' && req.url !== '/register') {
            headersToSend = req.headers;
        }

        if (req.headers['authorization']) {
            headersToSend['Authorization'] = req.headers['authorization']; // Assurez-vous que l'Authorization est transmis
        }

        console.log('En-têtes envoyés:', headersToSend);

        let bodyToSend = req.method === 'GET' ? undefined : req.body;

        // Log avant l'appel vers le microservice
        console.log('Fait appel au microservice:', userServiceUrl);
        console.log('Body:', bodyToSend);

        // Faire la requête vers le microservice
        const response = await axios({
            method: req.method, // Utilise la même méthode HTTP que la requête d'origine
            url: userServiceUrl, // Redirige vers l'URL du microservice
            data: bodyToSend, // Envoie le corps de la requête s'il y en a un
            headers: headersToSend // Passe les en-têtes si nécessaire
        });

        // console.log('Réponse reçue du microservice:', response.status, response.data);

        // Répondre avec la réponse du microservice
        res.status(response.status).json(response.data);
        console.log('Réponse envoyée au client');
    } catch (error) {
        console.error("Erreur lors de l'appel au microservice user-service:", error);
        console.log("Requête reçue dans l'API Gateway pour", req.url);
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.response ? error.response.data : error.message
        });
    }
});

// Partie produits
app.use('/products', async (req, res, next) => {
    let userServiceUrl = `http://localhost:3001/api/products${req.url}`;

    try {
        console.log("Requête reçue dans l'API Gateway pour", req.url);

        let bodyToSend = req.method === 'GET' ? undefined : req.body;

        console.log('Fait appel au microservice:', userServiceUrl);
        console.log('Body:', bodyToSend);

        // Faire la requête vers le microservice
        const response = await axios({
            method: req.method,
            url: userServiceUrl,
            data: bodyToSend
        });

        console.log('URL cible pour le microservice :', userServiceUrl);
        console.log('Méthode de la requête:', req.method);

        console.log('Réponse reçue du microservice:', response.status, response.data);

        if (!response || !response.data) {
            console.error('Aucune réponse valide reçue du microservice');
        }

        // Répondre avec la réponse du microservice
        res.status(response.status).json(response.data);
        console.log('Réponse envoyée au client');
    } catch (error) {
        console.error("Erreur lors de l'appel au microservice user-service:", error);
        console.log("Requête reçue dans l'API Gateway pour", req.url);
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.response ? error.response.data : error.message
        });
    }
});

// Partie panier
app.use('/cart', async (req, res, next) => {
    let userServiceUrl = `http://localhost:3002/api/cart${req.url}`;

    try {
        console.log("Requête reçue dans l'API Gateway pour", req.url);

        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token manquant ou invalide' });
        }

        let bodyToSend = req.method === 'GET' ? undefined : req.body;

        const headers = {
            Authorization: `Bearer ${token}`, // Inclure le token JWT dans l'en-tête
            ...req.headers // Copier d'autres en-têtes de la requête d'origine si nécessaire
        };

        console.log('Fait appel au microservice:', userServiceUrl);
        console.log('Body:', bodyToSend);
        console.log('Headers:', headers);

        // Faire la requête vers le microservice
        const response = await axios({
            method: req.method,
            url: userServiceUrl,
            data: bodyToSend,
            headers: headers,
            timeout: 10000
        });

        console.log('URL cible pour le microservice :', userServiceUrl);
        console.log('Méthode de la requête:', req.method);

        console.log('Réponse reçue du microservice:', response.status, response.data);

        if (!response || !response.data) {
            console.error('Aucune réponse valide reçue du microservice');
        }

        // Répondre avec la réponse du microservice
        res.status(response.status).json(response.data);
        console.log('Réponse envoyée au client');
    } catch (error) {
        console.error("Erreur lors de l'appel au microservice user-service:", error.message);
        if (error.response) {
            console.log('Réponse du microservice:', error.response.data);
        } else {
            console.log('Erreur non liée à la réponse du microservice :', error.message);
        }
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.response ? error.response.data : error.message
        });
    }
});

// Lancer le serveur API Gateway sur le port 3000
app.listen(3000, () => {
    console.log('API Gateway en fonctionnement sur http://localhost:3000');
});
