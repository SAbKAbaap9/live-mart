import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, verifyOTP } from '../../services/authService';
import { useAuth } from '../../context/authContext';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER',
    location: ''
  });
  const [otp, setOtp] = useState('');
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      setStep(2);
      alert('OTP sent to your email!');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await verifyOTP(formData.email, otp);
      setAuthUser(result);
      alert('Registration successful!');
      navigate(`/${result.role.toLowerCase()}`);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-transition" style={styles.container}>
      <div className="glass-panel" style={styles.form}>
        <h1 style={styles.title}>🛒 Live MART</h1>
        <h2 style={styles.subtitle}>Create Your Account</h2>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="glass-input"
              style={styles.input}
            />

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
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="glass-input"
              style={styles.input}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="glass-input"
              style={styles.input}
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="glass-input"
              style={styles.input}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="RETAILER">Retailer</option>
              <option value="WHOLESALER">Wholesaler</option>
            </select>

            <input
              type="text"
              name="location"
              placeholder="Location/City"
              value={formData.location}
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
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <p style={styles.otpText}>
              Enter the OTP sent to <strong>{formData.email}</strong>
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              className="glass-input"
              style={styles.input}
            />

            <button 
              type="submit" 
              disabled={loading}
              className="glass-button"
              style={styles.button}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button 
              type="button"
              onClick={() => setStep(1)}
              className="glass-button"
              style={{...styles.button, marginTop: '10px'}}
            >
              Back
            </button>
          </form>
        )}

        <p style={styles.link}>
          Already have an account? <Link to="/login" style={styles.linkText}>Login here</Link>
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
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  otpText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '16px'
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

export default Register;
