import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/cartContext';
import { useAuth } from '../../context/authContext';
import { placeOrder } from '../../services/orderService';
import LocationPicker from '../../components/LocationPicker';
import PaymentModal from '../../components/PaymentModal';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'online'
  });
  
  const [location, setLocation] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setFormData(prev => ({
      ...prev,
      address: loc.address
    }));
  };

  const subtotal = getCartTotal();
  const delivery = 50;
  const tax = subtotal * 0.05;
  const total = subtotal + delivery + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        userId: user.userId,
        items: cartItems,
        deliveryAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          location: location
        },
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        status: 'PLACED'
      };

      const result = await placeOrder(orderData);
      
      if (formData.paymentMethod === 'online') {
        setShowPayment(true);
      } else {
        alert('Order placed successfully!');
        clearCart();
        navigate(`/track/${result.orderId}`);
      }
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    alert('Payment successful! Order confirmed.');
    clearCart();
    setShowPayment(false);
    navigate('/customer');
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-transition container">
        <div className="glass-panel" style={styles.empty}>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <button 
            onClick={() => navigate('/products')}
            className="btn-primary"
            style={styles.shopBtn}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition container">
      <div className="glass-panel" style={styles.header}>
        <h1 style={styles.title}>💳 Checkout</h1>
      </div>

      <div style={styles.grid}>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="glass-panel" style={styles.section}>
              <h2 style={styles.sectionTitle}>📋 Delivery Information</h2>
              
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <textarea
                name="address"
                placeholder="Delivery Address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                style={styles.textarea}
              />

              <div style={styles.row}>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={{...styles.input, marginBottom: 0}}
                />

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  style={{...styles.input, marginBottom: 0}}
                />
              </div>
            </div>

            <LocationPicker onLocationSelect={handleLocationSelect} />

            <div className="glass-panel" style={styles.section}>
              <h2 style={styles.sectionTitle}>💰 Payment Method</h2>
              
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === 'online'}
                  onChange={handleChange}
                />
                <span style={styles.radioText}>💳 Online Payment</span>
              </label>

              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                />
                <span style={styles.radioText}>💵 Cash on Delivery</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
              style={styles.submitBtn}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div>
          <div className="glass-panel" style={styles.summary}>
            <h2 style={styles.summaryTitle}>📦 Order Summary</h2>
            
            <div style={styles.items}>
              {cartItems.map(item => (
                <div key={item.id} style={styles.item}>
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    style={styles.itemImage}
                  />
                  <div style={styles.itemDetails}>
                    <p style={styles.itemName}>{item.name}</p>
                    <p style={styles.itemQty}>Qty: {item.quantity}</p>
                  </div>
                  <p style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div style={styles.totals}>
              <div style={styles.totalRow}>
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={styles.totalRow}>
                <span>Delivery:</span>
                <span>₹{delivery.toFixed(2)}</span>
              </div>
              <div style={styles.totalRow}>
                <span>Tax (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div style={{...styles.totalRow, ...styles.grandTotal}}>
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          amount={total}
          orderId="new-order"
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    color: 'white',
    fontSize: '2.5em'
  },
  empty: {
    textAlign: 'center',
    padding: '60px'
  },
  emptyTitle: {
    color: 'white',
    marginBottom: '30px'
  },
  shopBtn: {
    padding: '15px 40px',
    fontSize: '1.2em'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '30px'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    color: 'white',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '16px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '15px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    marginBottom: '10px',
    cursor: 'pointer',
    color: 'white'
  },
  radioText: {
    marginLeft: '10px',
    fontSize: '16px'
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    fontSize: '18px'
  },
  summary: {
    position: 'sticky',
    top: '90px'
  },
  summaryTitle: {
    color: 'white',
    marginBottom: '20px'
  },
  items: {
    marginBottom: '20px',
    maxHeight: '300px',
    overflowY: 'auto'
  },
  item: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    padding: '10px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '8px'
  },
  itemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '5px'
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    color: 'white',
    marginBottom: '5px',
    fontSize: '14px'
  },
  itemQty: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '12px'
  },
  itemPrice: {
    color: 'white',
    fontWeight: 'bold'
  },
  totals: {
    borderTop: '2px solid rgba(255,255,255,0.3)',
    paddingTop: '15px'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white',
    marginBottom: '10px',
    fontSize: '16px'
  },
  grandTotal: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '2px solid rgba(255,255,255,0.3)'
  }
};

export default Checkout;
