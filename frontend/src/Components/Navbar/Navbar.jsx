import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ onLoginClick, onHomeClick, user, onLogout, cartCount, onCartClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFirstInitial = () => {
    if (!user || !user.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-logo" onClick={onHomeClick} style={{ cursor: 'pointer' }}>
          <span className="blink">blink</span><span className="it">it</span>
        </div>
        <div className="navbar-location">
          <span className="location-title">Delivery in 8 minutes</span>
          <span className="location-subtitle">Home - 123, Green Street, City</span>
        </div>
        <div className="navbar-search">
          <input type="text" placeholder='Search "milk"' />
          <button className="search-btn">🔍</button>
        </div>
        <div className="navbar-actions">
          {user ? (
            <div className="user-profile-nav" ref={dropdownRef}>
              <div
                className="avatar-circle"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {getFirstInitial()}
              </div>

              {showDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{getFirstInitial()}</div>
                    <div className="dropdown-info">
                      <p className="user-full-name">{user.name}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={onHomeClick}>My Orders</button>
                  <button className="dropdown-item" onClick={onHomeClick}>Saved Addresses</button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-logout" onClick={() => {
                    onLogout();
                    setShowDropdown(false);
                  }}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={onLoginClick}>Login</button>
          )}
          <button className="cart-btn" onClick={onCartClick}>
            🛒 <span className="cart-text">
              {cartCount > 0 ? `${cartCount} items` : 'My Cart'}
            </span>
          </button>
        </div>
      </div>
      <div className="navbar-create-account-toast">
        {/* Placeholder for toast or alerts */}
      </div>
    </header>
  );
};

export default Navbar;
