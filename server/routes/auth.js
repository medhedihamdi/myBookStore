const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const verifyToken = require('../midleware/verifyToken');
const router = express.Router();



// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const userExist = await User.findOne({ username });
    if (userExist) {
        return res.status(400).send("This user already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ username, role: 'user', permissions: [] }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token,message:"Registration successful!" });
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).send("This user does not exist");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).send("Incorrect password");
    }
    const token = jwt.sign({ username, role: user.role, permissions: user.permissions }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});


router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to the protected page', user: req.user });
});


module.exports = router;
