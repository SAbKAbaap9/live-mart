import React from 'react';
import { socialLogin } from '../../services/authService';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const SocialAuth = () => {
  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      // In a real implementation, you would use Google OAuth
      // This is a placeholder
      alert('Google login would be implemented with OAuth 2.0');
      
      // Simulated response
      const mockResponse = {
        token: 'mock-google-token',
        role: 'CUSTOMER',
        userId: '123',
        name: 'Google User'
      };
      
      setAuthUser(mockResponse);
      navigate('/customer');
    } catch (error) {
      alert('Google login failed');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // In a real implementation, you would use Facebook OAuth
      alert('Facebook login would be implemented with OAuth 2.0');
      
      const mockResponse = {
        token: 'mock-facebook-token',
        role: 'CUSTOMER',
        userId: '456',
        name: 'Facebook User'
      };
      
      setAuthUser(mockResponse);
      navigate('/customer');
    } catch (error) {
      alert('Facebook login failed');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Or continue with</h3>
      
      <div style={styles.buttons}>
        <button 
          onClick={handleGoogleLogin}
          className="glass-button"
          style={styles.button}
        >
          <span style={styles.icon}>🔵</span>
          Google
        </button>

        <button 
          onClick={handleFacebookLogin}
          className="glass-button"
          style={styles.button}
        >
          <span style={styles.icon}>📘</span>
          Facebook
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px'
  },
  title: {
    color: 'white',
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '14px'
  },
  buttons: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    flex: 1,
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px'
  },
  icon: {
    fontSize: '20px'
  }
};

export default SocialAuth;