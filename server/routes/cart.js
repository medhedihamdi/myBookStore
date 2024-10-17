const express = require('express');
const verifyToken =require('../midleware/verifyToken')
const Cart = require('../models/CartModel');
const router = express.Router();

// إضافة كتاب إلى الكارت
router.post('/', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { bookId } = req.body;
  
    let cart = await Cart.findOne({ userId });
  
    if (!cart) {
      cart = new Cart({ userId, books: [bookId] });
    } else {
      cart.books.push(bookId);
    }
  
    await cart.save();
    res.json({ message: 'Book added to cart' });
});

// جلب الكتب من الكارت
router.get('/', verifyToken, async (req, res) => {
    const userId = req.user.id;
  
    const cart = await Cart.findOne({ userId }).populate('books');
    
    if (!cart) {
      return res.json([]);
    }
  
    res.json(cart.books);
});

// حذف كتاب من الكارت
router.delete('/:bookId', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { bookId } = req.params;
  
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
  
    cart.books = cart.books.filter(book => book.toString() !== bookId); // حذف الكتاب
    await cart.save();
  
    res.json({ message: 'Book removed from cart' });
});

module.exports = router;
