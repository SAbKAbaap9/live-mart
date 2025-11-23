import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';

const CartModal = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    isCartOpen,
    setIsCartOpen 
  } = useCart();
  
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div style={styles.overlay} onClick={() => setIsCartOpen(false)}>
      <div 
        className="glass-panel" 
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <h2>Shopping Cart</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={styles.closeBtn}
          >
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p style={styles.empty}>Your cart is empty</p>
        ) : (
          <>
            <div style={styles.items}>
              {cartItems.map(item => (
                <div key={item.id} style={styles.item}>
                  <img 
                    src={item.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    style={styles.itemImage}
                  />
                  
                  <div style={styles.itemDetails}>
                    <h4 style={styles.itemName}>{item.name}</h4>
                    <p style={styles.itemPrice}>₹{item.price}</p>
                    
                    <div style={styles.quantity}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={styles.qtyBtn}
                      >
                        -
                      </button>
                      <span style={styles.qtyText}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={styles.qtyBtn}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={styles.removeBtn}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.footer}>
              <div style={styles.total}>
                <span>Total:</span>
                <span style={styles.totalAmount}>₹{getCartTotal().toFixed(2)}</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="btn-primary"
                style={styles.checkoutBtn}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
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
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    zIndex: 2000,
    padding: '20px'
  },
  modal: {
    width: '400px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    color: 'white'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer'
  },
  empty: {
    color: 'white',
    textAlign: 'center',
    padding: '40px'
  },
  items: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '20px'
  },
  item: {
    display: 'flex',
    gap: '15px',
    padding: '15px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    marginBottom: '10px',
    alignItems: 'center'
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    color: 'white',
    fontSize: '16px',
    marginBottom: '5px'
  },
  itemPrice: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '10px'
  },
  quantity: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  qtyBtn: {
    background: 'rgba(255, 255, 255, 0.3)',
    border: 'none',
    color: 'white',
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  qtyText: {
    color: 'white',
    fontWeight: '600'
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer'
  },
  footer: {
    borderTop: '1px solid rgba(255, 255, 255, 0.3)',
    paddingTop: '20px'
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px'
  },
  totalAmount: {
    fontSize: '24px'
  },
  checkoutBtn: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px'
  }
};

export default CartModal;