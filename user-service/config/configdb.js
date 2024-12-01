const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = 'mongodb+srv://williamlegavrian:rDWtqK1tTkgDZh29@clustercoursjs.e33hi.mongodb.net/user_service_db?retryWrites=true&w=majority&appName=ClusterCoursJS';
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
