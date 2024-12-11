const axios = require('axios');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; // Extraire le token JWT
        if (!token) {
            return res.status(401).send({ message: 'Token manquant ou invalide' });
        }

        // Vérifier le token via le microservice `user-service`
        const userResponse = await axios.get('http://localhost:5000/api/auth/verify', {
            headers: {
                Authorization: `Bearer ${token}` // Passer le token au microservice `user-service`
            }
        });

        // Si la vérification du token échoue, renvoyer une erreur
        if (userResponse.status !== 200) {
            return res.status(401).send({ message: 'Utilisateur non authentifié' });
        }

        // Si l'utilisateur est authentifié, on peut continuer
        req.user = userResponse.data;

        next(); // Passer à la suite de la requête (au contrôleur)
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);

        if (error.response) {
            // L'erreur provient de la réponse HTTP (par exemple, 401)
            return res
                .status(error.response.status)
                .send({ message: error.response.data.message || "Erreur d'authentification" });
        } else {
            // Si l'erreur n'est pas liée à la réponse HTTP, il s'agit d'une erreur dans le code (par exemple, réseau, etc.)
            return res.status(500).send({ message: 'Erreur interne du serveur', error: error.message });
        }
    }
};

module.exports = { verifyToken };
