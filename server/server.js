const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); // مسارات المصادقة
const userRoutes = require('./routes/userscontrols'); // مسارات المستخدمين
const bookRoutes = require('./routes/bookscontrols'); // مسارات الكتب
const orderRoutes = require('./routes/orderscontrols'); // مسارات الطلبات
const cartRoutes = require('./routes/cart');


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// مسارات
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', bookRoutes);
app.use('/', orderRoutes);
app.use('/cart', cartRoutes);

// تشغيل السيرفر
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


