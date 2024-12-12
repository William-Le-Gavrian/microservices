const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

module.exports = {
    verifyToken: async (req, res, next) => {
        try {
            let token = req.headers['authorization'];
            if (!token) {
                console.log('No token provided');
                res.status(401).send({
                    message: 'No token provided'
                });
            } else {
                token = token.replace('Bearer ', '');

                const secretKey = process.env.JWT_SECRET || 'secret';

                // Décoder le token
                const decoded = jwt.verify(token, secretKey);

                const { email } = decoded;
                const user = await UserModel.findOne({ email });

                if (!user) {
                    res.status(401).send({
                        message: 'Token invalide'
                    });
                }

                req.user = user;
                console.log('Utilisateur authentifié :', user);
                next();
            }
        } catch (error) {
            console.log('Erreur verify Token dans auth : ', error);
            return res.status(500).send({
                message: error.message || 'Something went wrong'
            });
        }
    }
};
