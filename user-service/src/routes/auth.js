const router = require('express').Router();
const authController = require('../controllers/auth');
const { verifyToken } = require('../middleware/jwt');

// Authentification
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.verifyUserToken);

router.put('/users/me', verifyToken, authController.updateUserDetails);
router.get('/users/me', verifyToken, authController.getUserDetails);
router.patch('/users/me/password', verifyToken, authController.changePassword);

module.exports = router; // Exporter correctement le routeur
