const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    permissions: { type: [String], default: [] }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
