const express = require('express');
const router = express.Router();
const { getAllBooks, createBook } = require('../controller/book');
const authMiddleware = require('../midlleware/jws'); // Importer le middleware

// Route GET /books - Protégée par le middleware
router.get('/', authMiddleware, getAllBooks);

// Route POST /books - Créer un livre (protégé)
router.post('/', authMiddleware, createBook);

module.exports = router;
