import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import BookCard from '../components/BookCard';

const ProtectedSection = ({ books }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const user = jwtDecode(token);

  useEffect(() => {
    if (!token) {
      return <p>Please log in to access this page</p>;
    }

    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items', error);
      }
    };

    fetchCartItems();
  }, [token]);

  const addToCart = async (bookId) => {
    if (cartItems.some(item => item._id === bookId)) {
      alert('This book is already in your cart!');
      return;
    }

    try {
      await axios.post('http://localhost:4000/cart', { bookId }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Book added to cart!');
      setCartItems([...cartItems, { _id: bookId }]);
    } catch (error) {
      console.error('Error adding to cart', error);
    }
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const goToAdminDashboard = () => {
    navigate('/admin');
  };

  return (
    <div id="protected" style={{ margin: '10px' }}>
      <div id="head-protectContainer" style={{ display: 'flex', justifyContent: 'space-between', margin: '20px' }}>
        <h2 style={{ color: 'brown' }}>Welcome, <span style={{ color: 'gold' }}>{user.username}</span></h2>
        <button onClick={goToCart}>Go to Cart</button>
        {user.role === 'admin' && (
          <div>
            <button onClick={goToAdminDashboard} style={{ margin: '20px' }}>Go to Admin Dashboard</button>
          </div>
        )}
      </div>

      <div className="row">
        {books.map(book => (
          <BookCard key={book._id} book={book} showAddToCart={true} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default ProtectedSection;
