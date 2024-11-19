const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/auth'); // Importer les contrôleurs

// Route POST /auth/register - Inscription
router.post('/register', register);

// Route POST /auth/login - Connexion
router.post('/login', login);

module.exports = router; // Exporter correctement le routeur

