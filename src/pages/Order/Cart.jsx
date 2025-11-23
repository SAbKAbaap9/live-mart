import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/cartContext';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    clearCart
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="page-transition container">
      <div className="glass-panel" style={styles.header}>
        <h1 style={styles.title}>🛒 Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="glass-panel" style={styles.empty}>
          <p style={styles.emptyText}>Your cart is empty</p>
          <button 
            onClick={() => navigate('/products')}
            className="btn-primary"
            style={styles.shopBtn}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="glass-panel">
            {cartItems.map(item => (
              <div key={item.id} style={styles.item}>
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  style={styles.image}
                />
                
                <div style={styles.details}>
                  <h3 style={styles.name}>{item.name}</h3>
                  <p style={styles.price}>₹{item.price}</p>
                </div>

                <div style={styles.quantity}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={styles.qtyBtn}
                  >
                    -
                  </button>
                  <span style={styles.qtyValue}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>

                <p style={styles.subtotal}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  style={styles.removeBtn}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={styles.summary}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Delivery:</span>
              <span>₹50.00</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Tax (5%):</span>
              <span>₹{(getCartTotal() * 0.05).toFixed(2)}</span>
            </div>
            <div style={{...styles.summaryRow, ...styles.total}}>
              <span>Total:</span>
              <span>₹{(getCartTotal() * 1.05 + 50).toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-primary"
              style={styles.checkoutBtn}
            >
              Proceed to Checkout
            </button>

            <button
              onClick={clearCart}
              className="btn-danger"
              style={styles.clearBtn}
            >
              Clear Cart
            </button>
          </div>
        </>
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
  emptyText: {
    color: 'white',
    fontSize: '1.5em',
    marginBottom: '30px'
  },
  shopBtn: {
    padding: '15px 40px',
    fontSize: '1.2em'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    marginBottom: '15px'
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  details: {
    flex: 1
  },
  name: {
    color: 'white',
    marginBottom: '5px'
  },
  price: {
    color: 'rgba(255,255,255,0.8)'
  },
  quantity: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  qtyBtn: {
    background: 'rgba(255,255,255,0.3)',
    border: 'none',
    color: 'white',
    width: '35px',
    height: '35px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  qtyValue: {
    color: 'white',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center'
  },
  subtotal: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    minWidth: '100px',
    textAlign: 'right'
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer'
  },
  summary: {
    marginTop: '30px',
    maxWidth: '400px',
    marginLeft: 'auto'
  },
  summaryTitle: {
    color: 'white',
    marginBottom: '20px'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white',
    marginBottom: '15px',
    fontSize: '16px'
  },
  total: {
    fontSize: '24px',
    fontWeight: 'bold',
    paddingTop: '15px',
    borderTop: '2px solid rgba(255,255,255,0.3)',
    marginTop: '15px'
  },
  checkoutBtn: {
    width: '100%',
    padding: '15px',
    marginTop: '20px',
    fontSize: '18px'
  },
  clearBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '10px'
  }
};
export default Cart;