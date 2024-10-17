const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const verifyToken = require('../midleware/verifyToken');

const router = express.Router();

// لوحة التحكم للأدمن
router.get('/admin/dashboard', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const users = await User.find();
    res.json({ message: 'Welcome to the admin dashboard', users });
});

// حذف المستخدم
router.delete('/admin/delete', verifyToken, async (req, res) => {
    const { username } = req.body;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findOneAndDelete({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
});

// تغيير كلمة السر
router.put('/admin/change-password', verifyToken, async (req, res) => {
    const { username, newPassword } = req.body;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
});

module.exports = router;
