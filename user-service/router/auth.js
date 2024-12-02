const express = require('express');
const router = express.Router();
const { register, login, updateUserDetails, getUserDetails,changePassword } = require('../controller/auth'); // Importer les contrôleurs

 // Importer le contrôleur
 const authMiddleware = require('../midlleware/jws');

// Route POST /auth/register - Inscription
router.post('/register', register);

// Route POST /auth/login - Connexion
router.post('/login', login);
router.put('/users/me', authMiddleware, updateUserDetails);
router.get('/users/me', authMiddleware, getUserDetails);
router.patch('/users/me/password', authMiddleware, changePassword);


module.exports = router; // Exporter correctement le routeur

