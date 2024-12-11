const User = require('../models/User'); // Importer le modèle User
const bcrypt = require('bcryptjs'); // Pour le hashage des mots de passe
const jwt = require('jsonwebtoken'); // Pour générer les tokens

const verifyUserToken = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; // Extraire le token JWT
        if (!token) {
            return res.status(401).send({ message: 'Token manquant' });
        }

        console.log('Vérification du token ...');

        const secret = process.env.JWT_SECRET || 'secret_key'; // Utilisation de la même clé secrète

        // Vérifier et décoder le token avec la clé secrète
        const decoded = jwt.verify(token, secret);

        // Vérifier si l'utilisateur existe
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).send({ message: 'Utilisateur non trouvé ou token invalide' });
        }

        // Renvoie les informations utilisateur (par exemple, l'ID de l'utilisateur)
        res.status(200).send({ userId: user._id });
    } catch (error) {
        return res.status(500).send({ message: 'Erreur interne du serveur', error: error.message });
    }
};

// Fonction pour enregistrer un nouvel utilisateur
const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Vérifier que les champs requis sont fournis
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({ firstname, lastname, email, password: hashedPassword });
        await newUser.save();

        // Répondre avec succès
        res.status(201).json({ message: 'Utilisateur créé avec succès', user: { firstname, lastname, email } });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Fonction pour connecter un utilisateur
const login = async (req, res) => {
    try {
        console.log('Requête reçue dans le login ...');
        const { email, password } = req.body;

        // Vérifier que les champs requis sont fournis
        if (!email || !password) {
            return res.status(400).json({ message: 'Les champs email et password sont requis.' });
        }

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifier si le mot de passe est correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        const userData = {
            _id: user._id,
            email: user.email
        };

        const secret = process.env.JWT_SECRET || 'secret';
        console.log('secret', secret);

        const jwtData = {
            expiresIn: process.env.JWT_TIMEOUT_DURATION || '1h'
        };

        const token = jwt.sign(userData, secret, jwtData);

        console.log('Connexion réussie !');

        // Répondre avec succès
        res.status(200).json({
            message: 'Connexion réussie',
            token, // Inclure le token dans la réponse
            user: { email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Fonction pour mettre à jour les informations utilisateur
const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; // ID de l'utilisateur extrait du middleware JWT
        const { firstname, lastname, email } = req.body;

        if (!firstname && !lastname && !email) {
            return res.status(400).json({ message: 'Aucune donnée fournie pour la mise à jour.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstname, lastname, email },
            { new: true, runValidators: true } // Retourne les nouvelles données mises à jour
        ).select('firstname lastname email');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        res.status(200).json({
            message: 'Informations mises à jour avec succès.',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Fonction pour récupérer les informations de l'utilisateur connecté
const getUserDetails = async (req, res) => {
    try {
        console.log('Chargement pour les détails du profil ...');

        const userId = req.user.id; // Récupère l'ID utilisateur depuis le middleware JWT

        // Recherche de l'utilisateur dans la base de données
        const user = await User.findById(userId).select('firstname lastname email'); // Exclure les données sensibles comme le mot de passe

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        console.log('Informations récupérées avec succès !');

        // Réponse avec les données utilisateur
        res.status(200).json({
            message: 'Données utilisateur récupérées avec succès.',
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Exporter la fonction
// Fonction pour changer le mot de passe d'un utilisateur
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id; // ID de l'utilisateur extrait via authMiddleware
        const { oldPassword, newPassword } = req.body; // Ancien et nouveau mot de passe

        // Vérifie que les champs sont fournis
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Les champs oldPassword et newPassword sont requis.' });
        }

        // Recherche de l'utilisateur dans la base de données
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifie que l'ancien mot de passe est correct
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
        }

        // Hash du nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Sauvegarde du mot de passe mis à jour
        await user.save();

        res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

module.exports = { verifyUserToken, register, login, updateUserDetails, getUserDetails, changePassword };
