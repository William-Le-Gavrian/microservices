const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;
