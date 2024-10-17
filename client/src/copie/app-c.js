import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import ProtectedSection from './pages/ProtectedSection ';

import Register from './pages/Register';
import Home from './pages/Home';
import axios from 'axios';
import Cart from './pages/Cart';

const apiUrl = 'http://localhost:4000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // جلب الكتب من السيرفر
    const fetchBooks = async () => {
      const response = await axios.get(`${apiUrl}/books`);
      setBooks(response.data);
    };

    fetchBooks();
  }, []);

  const logout = () => {
    setToken('');
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleGoBack = () => {
    document.body.style.backgroundColor = '';
    navigate('/protected');
  };

  return (
    <div className="App">
      <nav id="nav">
        <div id="l-n">
          <a href="/">Home</a>
          <a href="/contact">Contact</a>
        </div>
        <div id="r-n">
          {isLoggedIn ? (
            <div>
              <a id="logout" onClick={logout}>Logout</a>
            </div>
          ) : (
            <a href="/register">Register</a>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home books={books} />} />
        <Route path="/register" element={<Register setToken={setToken} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/protected" element={<ProtectedSection books={books} />} />
        <Route path="/admin" element={<AdminDashboard goBack={handleGoBack} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  );
}

export default App;
