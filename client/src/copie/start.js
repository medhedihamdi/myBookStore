/*
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import ProtectedSection from './pages/ProtectedSection ';
import Register from './pages/Register';
const apiUrl = 'http://localhost:4000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const navigate = useNavigate();

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
        {!isLoggedIn ? (
          <Route
            path="/"
            element={<h1>Welcome</h1>}
          />
        ) : null}
        <Route path="/register" element={<Register setToken={setToken} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/protected" element={<ProtectedSection />} />
        <Route path="/admin" element={<AdminDashboard goBack={handleGoBack} />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
*/