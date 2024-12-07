const router = require('express').Router();
const authController = require('../controllers/auth');

const { verifyToken } = require('../middleware/jwt');

// Route POST /auth/register - Inscription
router.post('/register', authController.register);

// Route POST /auth/login - Connexion
router.post('/login', authController.login);
router.put('/users/me', verifyToken, authController.updateUserDetails);
router.get('/users/me', verifyToken, authController.getUserDetails);
router.patch('/users/me/password', verifyToken, authController.changePassword);

module.exports = router; // Exporter correctement le routeur
