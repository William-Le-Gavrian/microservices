const express = require('express');
const connectDB = require('../config/configdb'); // Connexion à MongoDB
const authRouter = require('./routes/auth'); // Routeur pour l'authentification
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express(); // Créer une instance d'application Express
const port = 5000; // Définir le port d'écoute

// Connexion à MongoDB
connectDB();

// Middleware pour analyser les données JSON
app.use(express.json());

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API d\'authentification',
      version: '1.0.0',
      description: 'API pour gérer l\'authentification des utilisateurs',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur local',
      },
    ],
  },
  apis: ['./routes/*.js'], // Chemin vers vos fichiers de routes (ajustez si nécessaire)
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Page d'accueil
app.get('/', (req, res) => {
  res.send('Bonjour nous sommes dans la page d\'authentification');
});

// Routes pour l'authentification
app.use('/api/auth', authRouter);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
  console.log(`Documentation disponible sur http://localhost:${port}/api-docs`);
});
