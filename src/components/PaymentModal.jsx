import React, { useState } from 'react';
import { processPayment } from '../services/orderService';

const PaymentModal = ({ amount, orderId, onSuccess, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await processPayment({
        orderId,
        amount,
        method: paymentMethod
      });
      
      alert('Payment successful!');
      if (onSuccess) onSuccess();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div 
        className="glass-panel" 
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={styles.title}>Complete Payment</h2>
        
        <div style={styles.amount}>
          <span>Total Amount:</span>
          <span style={styles.amountValue}>₹{amount.toFixed(2)}</span>
        </div>

        <div style={styles.methods}>
          <label style={styles.method}>
            <input
              type="radio"
              name="payment"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span style={styles.methodLabel}>💳 Online Payment</span>
          </label>

          <label style={styles.method}>
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span style={styles.methodLabel}>💵 Cash on Delivery</span>
          </label>
        </div>

        <div style={styles.buttons}>
          <button 
            onClick={handlePayment}
            disabled={loading}
            className="btn-primary"
            style={styles.button}
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>
          <button 
            onClick={onClose}
            className="btn-secondary"
            style={styles.button}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
  },
  modal: {
    width: '400px',
    maxWidth: '90%'
  },
  title: {
    color: 'white',
    marginBottom: '20px'
  },
  amount: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white',
    fontSize: '18px',
    marginBottom: '30px',
    padding: '15px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '8px'
  },
  amountValue: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  methods: {
    marginBottom: '30px'
  },
  method: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    marginBottom: '10px',
    cursor: 'pointer'
  },
  methodLabel: {
    color: 'white',
    marginLeft: '10px',
    fontSize: '16px'
  },
  buttons: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    flex: 1,
    padding: '12px'
  }
};

export default PaymentModal;