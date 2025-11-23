import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackOrder, getOrderDetails } from '../../services/orderService';
import OrderTracker from '../../components/OrderTracker';
import FeedbackForm from '../../components/FeedbackForm';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const data = await getOrderDetails(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!order) return <p style={{color: 'white', textAlign: 'center'}}>Order not found</p>;

  return (
    <div className="page-transition container">
      <button 
        onClick={() => navigate(-1)}
        className="glass-button"
        style={styles.backBtn}
      >
        ← Back
      </button>

      <div className="glass-panel" style={styles.header}>
        <h1 style={styles.title}>📦 Track Your Order</h1>
        <p style={styles.orderId}>Order #{orderId}</p>
      </div>

      <OrderTracker orderId={orderId} />

      <div className="glass-panel">
        <h2 style={styles.sectionTitle}>Order Details</h2>
        
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>📅 Order Date</h3>
            <p style={styles.infoValue}>{new Date(order.date).toLocaleDateString()}</p>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>💰 Total Amount</h3>
            <p style={styles.infoValue}>₹{order.total}</p>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>📍 Status</h3>
            <p style={styles.infoValue}>{order.status}</p>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>🚚 Delivery</h3>
            <p style={styles.infoValue}>{order.estimatedDelivery || '3-5 days'}</p>
          </div>
        </div>

        <div style={styles.items}>
          <h3 style={styles.itemsTitle}>Items in this order:</h3>
          {order.items?.map((item, index) => (
            <div key={index} className="glass-card" style={styles.item}>
              <img
                src={item.imageUrl || 'https://via.placeholder.com/80'}
                alt={item.name}
                style={styles.itemImage}
              />
              <div style={styles.itemDetails}>
                <h4 style={styles.itemName}>{item.name}</h4>
                <p style={styles.itemQty}>Quantity: {item.quantity}</p>
              </div>
              <p style={styles.itemPrice}>₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <div style={styles.address}>
          <h3 style={styles.addressTitle}>📍 Delivery Address</h3>
          <p style={styles.addressText}>{order.deliveryAddress?.fullName}</p>
          <p style={styles.addressText}>{order.deliveryAddress?.phone}</p>
          <p style={styles.addressText}>{order.deliveryAddress?.address}</p>
          <p style={styles.addressText}>
            {order.deliveryAddress?.city}, {order.deliveryAddress?.pincode}
          </p>
        </div>
      </div>

      {order.status === 'DELIVERED' && !showFeedback && (
        <button
          onClick={() => setShowFeedback(true)}
          className="btn-primary"
          style={styles.feedbackBtn}
        >
          ⭐ Leave Feedback
        </button>
      )}

      {showFeedback && (
        <FeedbackForm
          orderId={orderId}
          productId={order.items[0]?.id}
          onSuccess={() => {
            setShowFeedback(false);
            alert('Thank you for your feedback!');
          }}
        />
      )}
    </div>
  );
};

const styles = {
  backBtn: {
    marginBottom: '20px',
    padding: '10px 20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    color: 'white',
    fontSize: '2.5em',
    marginBottom: '10px'
  },
  orderId: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1.2em'
  },
  sectionTitle: {
    color: 'white',
    marginBottom: '20px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  infoCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center'
  },
  infoTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    marginBottom: '10px'
  },
  infoValue: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  items: {
    marginBottom: '30px'
  },
  itemsTitle: {
    color: 'white',
    marginBottom: '15px'
  },
  item: {
    display: 'flex',
    gap: '15px',
    padding: '15px',
    marginBottom: '10px'
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
    marginBottom: '5px'
  },
  itemQty: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px'
  },
  itemPrice: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  address: {
    background: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '10px'
  },
  addressTitle: {
    color: 'white',
    marginBottom: '15px'
  },
  addressText: {
    color: 'white',
    marginBottom: '5px',
    lineHeight: '1.6'
  },
  feedbackBtn: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    marginTop: '20px'
  }
};

export default OrderTracking;