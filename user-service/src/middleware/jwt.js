// Nino
// Avec l'api gateway ce fichier ne sera plus utilisé
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
                        message: 'Token invalide'
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
