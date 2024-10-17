const express = require('express');
const Order = require('../models/OrderModel');
const verifyToken = require('../midleware/verifyToken');

const router = express.Router();

// إنشاء طلب جديد
router.post('/orders', verifyToken, async (req, res) => {
    try {
        const { name, email, phone, address, sendDate, orderMessage, adminEmail, books, totalOrderPrice } = req.body;
        
        // تحويل sendDate إلى كائن Date
        const formattedSendDate = new Date(sendDate);

        const newOrder = new Order({
            name,
            email,
            phone,
            address,
            sendDate: formattedSendDate, // استخدام التاريخ المحول
            orderMessage,
            adminEmail,
            books,
            totalOrderPrice,
            username: req.user.username
        });

        // حفظ الطلب في قاعدة البيانات
        const savedOrder = await newOrder.save();

        // إرسال استجابة تحتوي على الـ _id الخاص بالطلب بالإضافة إلى الرسالة
        res.status(200).json({ message: 'Order saved successfully', _id: savedOrder._id, order: savedOrder });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ message: 'Failed to save order', error: error.message });
    }
});



 //ادارة الادمن للطلبات 
 
 // جلب جميع الطلبات لجميع المستخدمين (خاص بالأدمن)
 router.get('/admin/orders', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find().populate('books'); // جلب جميع الطلبات مع تفاصيل الكتب
    res.json(orders);
});

// جلب جميع الطلبات
router.get('/admin/orders', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find().populate('books');
    res.json(orders);
});

// جلب طلبات مستخدم معين
router.get('/admin/orders/:username', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({ username: req.params.username }).populate('books');
    if (!orders.length) {
        return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.json(orders);
});

// تعديل طلب معين
router.put('/admin/orders/:orderId', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, req.body, { new: true }).populate('books');
    if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', order: updatedOrder });
});

// حذف طلب معين
router.delete('/admin/orders/:orderId', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
});

module.exports = router;
