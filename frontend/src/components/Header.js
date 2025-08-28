import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/" className="logo-link">
            <h1>📚 Library Management System</h1>
          </Link>
        </div>
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/books" 
            className={`nav-link ${isActive('/books') ? 'active' : ''}`}
          >
            Books
          </Link>
          <Link 
            to="/profile" 
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            Profile
          </Link>
          <Link 
            to="/login" 
            className={`nav-link ${isActive('/login') ? 'active' : ''}`}
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className={`nav-link ${isActive('/register') ? 'active' : ''}`}
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
