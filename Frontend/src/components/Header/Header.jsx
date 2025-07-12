import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🔄</span>
            SkillSwap
          </Link>

          <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            {user ? (
              <>
                {!isAdmin && (
                  <>
                    <Link 
                      to="/search" 
                      className={`nav-link ${isActive('/search') ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Search
                    </Link>
                    <Link 
                      to="/profile" 
                      className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/swap-requests" 
                      className={`nav-link ${isActive('/swap-requests') ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Requests
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}

                <div className="user-menu">
                  <span className="user-name">Hi, {user.name || 'User'}</span>
                  <button className="btn btn-outline btn-small" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary btn-small"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
