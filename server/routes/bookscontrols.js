const express = require('express');
const Book = require('../models/BookModel');
const verifyToken = require('../midleware/verifyToken');

const router = express.Router();

// إنشاء كتاب جديد
router.post('/admin/books', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { name, author, genre, price, pages, volumes, description, imageUrl } = req.body;
    const newBook = new Book({ name, author, genre, price, pages, volumes, description, imageUrl });
    await newBook.save();
    res.json({ message: 'Book created successfully', book: newBook });
});

// تعديل الكتاب
router.put('/admin/books/:id', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { name, author, genre, price, pages, volumes, description, imageUrl } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { name, author, genre, price, pages, volumes, description, imageUrl }, { new: true });
    
    if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully', book: updatedBook });
});

// حذف الكتاب
router.delete('/admin/books/:id', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully', bookId: req.params.id });
});

// جلب جميع الكتب
router.get('/books', async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

module.exports = router;
