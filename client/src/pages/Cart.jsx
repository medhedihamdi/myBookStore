import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CartBooks from '../components/CartBooks';
import OrderSummary from '../components/OrderSummary';
import OrderForm from '../components/OrderForm';
import OrderDetails from '../components/OrderDetails';

const Cart = () => {
  const navigate = useNavigate();
  const [cartBooks, setCartBooks] = useState([]);
  const [order, setOrder] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showSummary, setShowSummary] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [orderDetails, setOrderDetails] = useState([]);
  const orderMessage = "Thank you for your order! You will receive your items within 15 days.";

 //const [sendDate, setSendDate] = useState(null);



  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : {};

  useEffect(() => {
    const fetchCartBooks = async () => {
      if (!token) return;
  
      try {
        const response = await axios.get('http://localhost:4000/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartBooks(response.data);
  
        const initialQuantities = response.data.reduce((acc, book) => {
          acc[book._id] = 1;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching cart books', error);
      }
    };
  
    fetchCartBooks();
  
    // جلب الطلبات المخزنة في localStorage عند تحميل الصفحة
    const savedOrderDetails = JSON.parse(localStorage.getItem('orderDetails')) || [];
    if (savedOrderDetails) {
      const userOrders = savedOrderDetails.filter(order => order.username === user.username);
      setOrderDetails(userOrders);  // تحديث الطلبات المعروضة بناءً على المستخدم
    }
  }, [token, user.username]);  // التأكد من تحديث البيانات إذا تغير المستخدم
  
  const goBack = () => {
    navigate('/protected');
  };

  const addToOrder = (book) => {
    const quantity = quantities[book._id] || 1;
    const updatedBook = {
      ...book,
      quantity,
      totalPrice: book.price * quantity,
    };
    setOrder((prevOrder) => [...prevOrder, updatedBook]);
  };

  const handleQuantityChange = (bookId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [bookId]: newQuantity,
    }));
  };

  const handleDeleteOrder = (bookId) => {
    setOrder((prevOrder) => prevOrder.filter((book) => book._id !== bookId));
  };

  const handleDeleteFromCart = async (bookId) => {
    try {
      await axios.delete(`http://localhost:4000/cart/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error('Error deleting book from cart', error);
    }
  };

  const handleGoToForm = () => {
    const totalOrderPrice = calculateTotalOrderPrice();

    if (totalOrderPrice === 0) {
      alert('Your order is empty.');
    } else {
      setShowForm(true);
      setShowSummary(false); // Hide Order Summary when going to form
    }
  };

  const calculateTotalOrderPrice = () => {
    return order.reduce((total, book) => total + book.totalPrice, 0);
  };

  const handleFormSubmit = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
  
    if (!emailPattern.test(userInfo.email)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    if (!phonePattern.test(userInfo.phone)) {
      alert('Please enter a valid phone number with 10 digits.');
      return;
    }
  
    const currentDate = new Date();
     const sendDate = currentDate.toISOString().split('T')[0];;
    //setSendDate(isoDate);
  
    const totalOrderPrice = calculateTotalOrderPrice();
  
    try {
      const orderDetails = {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
       // sendDate: isoDate,
       sendDate: sendDate,
        orderMessage,
        adminEmail: 'admin@example.com',
        books: order.map(book => ({
          _id: book._id,
          name: book.name,
          quantity: book.quantity,
          totalPrice: book.totalPrice,
        })),
        totalOrderPrice,
        username: user.username || 'Guest',
      };
  
      const response = await axios.post('http://localhost:4000/orders', orderDetails, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        const newOrderWithId = { ...orderDetails, _id: response.data._id };
  
        alert('Your order has been placed successfully!');
  
        const currentOrders = JSON.parse(localStorage.getItem('orderDetails')) || [];
  
        // تحديث الطلبات بناءً على المستخدم الحالي فقط
        const updatedOrders = [...currentOrders, newOrderWithId];
        localStorage.setItem('orderDetails', JSON.stringify(updatedOrders));
  
        // تحديث حالة الطلبات لعرضها مباشرةً بعد إضافة الطلب الجديد
        const userOrders = updatedOrders.filter(order => order.username === user.username);
        setOrderDetails(userOrders);
      } else {
        alert('There was an issue placing your order. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while placing your order. Please try again.');
      console.error('Error placing order:', error);
    }
  
    setShowSummary(true);
    setShowForm(false);
    setOrder([]); // إعادة تعيين الطلب
  };
  return (
    <div className="cart">
      <div id="head-cart">
        <h2>Welcome to your cart, <strong>{user.username || 'Guest'}</strong></h2>
        <button onClick={goBack}>go back</button>
      </div>

      <div className="cart-handeling">
        <CartBooks
          cartBooks={cartBooks}
          quantities={quantities}
          handleQuantityChange={handleQuantityChange}
          addToOrder={addToOrder}
          handleDeleteFromCart={handleDeleteFromCart}
        />

        <div className="order-handeling">
        {showSummary && (
        <OrderSummary
          order={order}
          calculateTotalOrderPrice={calculateTotalOrderPrice}
          handleDeleteOrder={handleDeleteOrder}
          handleGoToForm={handleGoToForm}
        />
      )}

          {showForm && (
            <OrderForm
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              handleFormSubmit={handleFormSubmit}
              setShowForm={setShowForm}
              setShowSummary={setShowSummary} 
            />
          )}

          <OrderDetails  orderDetails={orderDetails} user={user} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
