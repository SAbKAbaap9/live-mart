import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { useAuth } from '../../context/authContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      setAuthUser(result);
      
      // Redirect based on role
      const dashboardRoute = `/${result.role.toLowerCase()}`;
      navigate(dashboardRoute);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-transition" style={styles.container}>
      <div className="glass-panel" style={styles.form}>
        <h1 style={styles.title}>🛒 Live MART</h1>
        <h2 style={styles.subtitle}>Login to Your Account</h2>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="glass-input"
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="glass-input"
            style={styles.input}
          />

          <button 
            type="submit" 
            disabled={loading}
            className="glass-button"
            style={styles.button}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account? <Link to="/register" style={styles.linkText}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 70px)',
    padding: '20px'
  },
  form: {
    width: '100%',
    maxWidth: '450px'
  },
  title: {
    color: 'white',
    textAlign: 'center',
    fontSize: '2.5em',
    marginBottom: '10px'
  },
  subtitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: '1.5em',
    marginBottom: '30px'
  },
  error: {
    background: 'rgba(239, 68, 68, 0.3)',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid rgba(239, 68, 68, 0.5)'
  },
  input: {
    width: '100%',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '10px',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    fontWeight: '600',
    marginTop: '10px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  link: {
    color: 'white',
    textAlign: 'center',
    marginTop: '20px'
  },
  linkText: {
    color: '#4facfe',
    fontWeight: '600',
    textDecoration: 'none'
  }
};

export default Login;