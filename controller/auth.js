const User = require('../models/User'); // Importer le modèle User
const bcrypt = require('bcryptjs'); // Pour le hashage des mots de passe
const jwt = require('jsonwebtoken'); // Pour générer les tokens

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

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      'secret_key', // Clé secrète (remplacez par une clé plus sécurisée, idéalement dans .env)
      { expiresIn: '1h' } // Le token expire après 1 heure
    );

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

// Exporter les fonctions
module.exports = { register, login };

