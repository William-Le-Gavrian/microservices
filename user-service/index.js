const express = require('express');
const connectDB = require('./config/configdb'); // Connexion à MongoDB

const authRouter = require('./router/auth'); // Routeur pour l'authentification

const app = express(); // Créer une instance d'application Express
const port = 5000; // Définir le port d'écoute

// Connexion à MongoDB
connectDB();

// Middleware pour analyser les données JSON
app.use(express.json());

// Routes pour les livres

// Routes pour l'authentification
app.use('/api/auth', authRouter);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
