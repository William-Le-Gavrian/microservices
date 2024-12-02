require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = () => {
  try {
    mongoose
        .connect(process.env.DATABASE_URL)
        .then(() => {
          console.log('MongoDB Atlas connecté avec succès');
    })
  } catch (error) {
    console.error('Erreur de connexion à MongoDB Atlas :', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
//commentaires
