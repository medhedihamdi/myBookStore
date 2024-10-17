const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    orderDate: { type: Date, default: Date.now },
    sendDate: { type: Date, required: true  },
    orderMessage: String,
    adminEmail: String,
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        quantity: Number,
        totalPrice: Number
    }],
    totalOrderPrice: Number,
    username: String,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
