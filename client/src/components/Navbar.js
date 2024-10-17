import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, logout }) {
  const navigate = useNavigate();

  return (
    <nav id="nav">
      <div id="l-n">
        <a href="/">Home</a>
        <a href="/contact">Contact</a>
      </div>
      <div id="r-n">
        {isLoggedIn ? (
          <div>
            <button className="nav-button" onClick={() => navigate('/protected')} >
              Protected
            </button>
            <button id="logout"  className="nav-button" onClick={logout} >
              Logout
            </button>
          </div>
        ) : (
          <a href="/register">Register</a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
