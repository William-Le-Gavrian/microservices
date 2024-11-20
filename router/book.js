const express = require('express');
const router = express.Router();
const { getAllBooks, createBook, getBookById } = require('../controller/book'); // Importer le contrôleur
const authMiddleware = require('../midlleware/jws'); // Middleware pour protéger certaines routes

// Route GET /books - Récupérer tous les livres
router.get('/', getAllBooks);

// Route GET /books/:id - Récupérer un livre par son ID
router.get('/:id', getBookById);

// Route POST /books - Créer un livre (protégé)
router.post('/', authMiddleware, createBook)

module.exports = router;

