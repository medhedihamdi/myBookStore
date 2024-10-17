const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: String,
    author: String,
    genre: String,
    price: Number,
    pages: Number,
    volumes: Number,
    description: String,
    imageUrl: String
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
