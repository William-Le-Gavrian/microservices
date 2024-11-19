const Book = require('../models/Book'); // Importer le modèle 'Book'

// Fonction pour créer un nouveau livre
const createBook = async (req, res) => {
  try {
    const { id, name } = req.body;

    // Vérifier que les champs requis sont présents
    if (!id || !name) {
      return res.status(400).json({ message: 'Les champs id et name sont requis.' });
    }

    // Vérifier si l'ID existe déjà
    const existingBook = await Book.findOne({ id });
    if (existingBook) {
      return res.status(400).json({ message: `Un livre avec l'ID ${id} existe déjà.` });
    }

    // Créer une nouvelle instance du modèle 'Book'
    const newBook = new Book({ id, name });

    // Sauvegarder le nouveau livre dans la base de données
    await newBook.save();

    // Répondre avec le livre créé
    res.status(201).json(newBook);
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Fonction pour récupérer tous les livres
const getAllBooks = async (req, res) => {
  try {
    // Récupérer tous les livres de la collection
    const books = await Book.find();

    // Répondre avec la liste des livres
    res.status(200).json(books);
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Exporter les fonctions
module.exports = {
  createBook,
  getAllBooks,
};

