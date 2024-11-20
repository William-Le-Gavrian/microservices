const express = require('express');
const router = express.Router();
const { getAllBooks, createBook } = require('../controller/book');
const authMiddleware = require('../midlleware/jws'); // Importer le middleware

// Route GET /books - Accessible sans middleware
router.get('/', getAllBooks);

// Route POST /books - Créer un livre (protégé)
router.post('/', authMiddleware, createBook);

module.exports = router;

