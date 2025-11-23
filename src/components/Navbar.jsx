import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount, toggleCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🛒 Live MART
        </Link>

        <div style={styles.menu}>
          {isAuthenticated ? (
            <>
              <Link to="/products" style={styles.link}>Products</Link>
              <Link to="/search" style={styles.link}>Search</Link>
              
              {user?.role === 'CUSTOMER' && (
                <>
                  <button onClick={toggleCart} style={styles.cartBtn}>
                    🛒 Cart ({getCartCount()})
                  </button>
                  <Link to="/customer" style={styles.link}>Dashboard</Link>
                </>
              )}
              
              {user?.role === 'RETAILER' && (
                <Link to="/retailer" style={styles.link}>Dashboard</Link>
              )}
              
              {user?.role === 'WHOLESALER' && (
                <Link to="/wholesaler" style={styles.link}>Dashboard</Link>
              )}

              <span style={styles.username}>Hi, {user?.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    padding: '15px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  },
  menu: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'opacity 0.3s'
  },
  cartBtn: {
    background: 'rgba(255, 255, 255, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  username: {
    color: 'white',
    fontWeight: '600'
  },
  logoutBtn: {
    background: '#ef4444',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  }
};

export default Navbar;