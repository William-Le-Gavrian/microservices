// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ message: 'Token non fourni' });
//   }

//   try {
//     const decoded = jwt.verify(token, 'secret_key'); // Vérifiez le token avec la clé secrète
//     req.user = decoded; // Attachez les informations de l'utilisateur au `req`
//     next(); // Passez au middleware suivant
//   } catch (error) {
//     return res.status(401).json({ message: 'Token invalide', error: error.message });
//   }
// };

// module.exports = authMiddleware;

// Nino
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

module.exports = {
    verifyToken: async (req, res, next) => {
        try {
            let token = req.headers['authorization'];
            if (!token) {
                res.status(401).send({
                    message: 'No token provided'
                });
            } else {
                token = token.replace('Bearer ', '');
                const { email } = jwt.verify(token, process.env.JWT || 'secret');
                const user = await UserModel.findOne({ email });

                if (!user) {
                    res.status(401).send({
                        message: 'Invalid token'
                    });
                }

                req.user = user;
                next();
            }
        } catch (error) {
            return res.status(500).send({
                message: error.message || 'Something went wrong'
            });
        }
    }
};
