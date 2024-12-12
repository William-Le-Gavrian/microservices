const mongoose = require('mongoose');

// Définir le schéma pour l'utilisateur
const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String, // Correction : `firstname` doit être une chaîne de caractères
      required: true, // Champ obligatoire
      unique: false,  // Pas nécessaire que le prénom soit unique
    },
    lastname: {
      type: String, // Champ `lastname` est une chaîne de caractères
      required: true, // Champ obligatoire
    },
    email: {
      type: String, // L'email doit être une chaîne de caractères
      required: true, // Champ obligatoire
      unique: true,  // L'email doit être unique dans la base de données
    },
    password: {
      type: String, // Le mot de passe est une chaîne de caractères (hashé)
      required: true, // Champ obligatoire
    },
  },
  {
    timestamps: true, // Ajoute automatiquement `createdAt` et `updatedAt`
  }
);

// Créer le modèle basé sur le schéma
const User = mongoose.model('User', UserSchema);

module.exports = User; // Exporter le modèle pour une utilisation ailleurs
