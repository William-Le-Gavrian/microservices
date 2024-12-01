const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token non fourni' });
  }

  try {
    const decoded = jwt.verify(token, 'secret_key'); // Vérifiez le token avec la clé secrète
    req.user = decoded; // Attachez les informations de l'utilisateur au `req`
    next(); // Passez au middleware suivant
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide', error: error.message });
  }
};

module.exports = authMiddleware;
