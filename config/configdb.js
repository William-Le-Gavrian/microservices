const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = 'mongodb+srv://zazariimane:ImaneEfrei@cluster0.3t0qm.mongodb.net/express-books?retryWrites=true&w=majority';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connecté avec succès');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB Atlas :', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
//commentaires
