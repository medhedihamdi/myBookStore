require('dotenv').config(); // تحميل متغيرات البيئة
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(cors());

// الاتصال بقاعدة بيانات MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// تعريف نموذج المستخدم
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    permissions: { type: [String], default: [] }
});

const User = mongoose.model('User', userSchema);

// إعداد مستخدم أدمن
const createAdminUser = async () => {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('123', 10);
        const adminUser = new User({ username: 'admin', password: hashedPassword, role: 'admin' });
        await adminUser.save();
        console.log('Admin user created');
    }
};

createAdminUser();

// Middleware للتحقق من التوكن
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: 'Token missing' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// تسجيل مستخدم جديد
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const userExist = await User.findOne({ username });
    if (userExist) {
        return res.status(400).send("This user already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ username, role: 'user', permissions: [] }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// تسجيل الدخول
app.post('/login', async (req, res) => {
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

// الصفحة المحمية
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to the protected page', user: req.user });
});

// لوحة التحكم للأدمن
app.get('/admin/dashboard', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const users = await User.find();
    res.json({ message: 'Welcome to the admin dashboard', users });
});

// **مسار حذف المستخدم**
app.delete('/admin/delete', verifyToken, async (req, res) => {
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

// **مسار تغيير كلمة السر**
app.put('/admin/change-password', verifyToken, async (req, res) => {
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

// تعريف نموذج الكتاب
const bookSchema = new mongoose.Schema({
    name: String,
    author: String,
    genre: String,
    price: Number,
    pages: Number,
    volumes: Number,
    description: String,
    imageUrl: String // بدلاً من مسار الصورة، استخدم URL عادي
});

const Book = mongoose.model('Book', bookSchema);

// إنشاء كتاب جديد (خاص بالأدمن)
app.post('/admin/books', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { name, author, genre, price, pages, volumes, description, imageUrl } = req.body; // استلام URL للصورة مباشرة
    const newBook = new Book({ name, author, genre, price, pages, volumes, description, imageUrl });
    await newBook.save();
    res.json({ message: 'Book created successfully', book: newBook }); // إرجاع الكتاب المضاف
});

// تعديل الكتاب
app.put('/admin/books/:id', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { name, author, genre, price, pages, volumes, description, imageUrl } = req.body; // استلام URL للصورة مباشرة
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { name, author, genre, price, pages, volumes, description, imageUrl }, { new: true });
    
    if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json({ message: 'Book updated successfully', book: updatedBook }); // إرجاع الكتاب المعدل
});

// حذف الكتاب
app.delete('/admin/books/:id', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully', bookId: req.params.id }); // إرجاع معرف الكتاب المحذوف
});

// جلب جميع الكتب لعرضها
app.get('/books', async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

// باقي الكود كما هو...


//  ******* الكارت *******

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
  });
  
  const Cart = mongoose.model('Cart', cartSchema);
  
  // إضافة كتاب إلى الكارت
  app.post('/cart', verifyToken, async (req, res) => {
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
  app.get('/cart', verifyToken, async (req, res) => {
    const userId = req.user.id;
  
    const cart = await Cart.findOne({ userId }).populate('books');
    
    if (!cart) {
      return res.json([]);
    }
  
    res.json(cart.books);
  });

  app.delete('/cart/:bookId', verifyToken, async (req, res) => {
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


  // الطلبيات 
// الطلبيات 
  // تعريف نموذج الطلب
  const orderSchema = new mongoose.Schema({
    name:String,
    email: String,
    phone: String,
    address: String,
    orderDate: { type: Date, default: Date.now },
    sendDate: Date,
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

// مسار لإدخال تفاصيل الطلب
app.post('/orders', verifyToken, async (req, res) => {
    try {
        const { name,email, phone, address, sendDate, orderMessage, adminEmail, books, totalOrderPrice } = req.body;
        console.log('Received Order Data:', req.body); // عرض البيانات المستلمة

        // إنشاء الطلب الجديد
        const newOrder = new Order({
            name,
            email,
            phone,
            address,
            sendDate,
            orderMessage,
            adminEmail,
            books,
            totalOrderPrice,
            username: req.user.username
        });

        // حفظ الطلب في قاعدة البيانات
        await newOrder.save();
        res.status(200).json({ message: 'Order saved successfully', order: newOrder });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ message: 'Failed to save order', error });
    }
});


 //ادارة الادمن للطلبات 
 // جلب جميع الطلبات لجميع المستخدمين (خاص بالأدمن)
app.get('/admin/orders', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find().populate('books'); // جلب جميع الطلبات مع تفاصيل الكتب
    res.json(orders);
});

// جلب طلبات مستخدم معين
app.get('/admin/orders/:username', verifyToken, async (req, res) => {
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
app.put('/admin/orders/:orderId', verifyToken, async (req, res) => {
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
app.delete('/admin/orders/:orderId', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
});

  
// تشغيل السيرفر
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));