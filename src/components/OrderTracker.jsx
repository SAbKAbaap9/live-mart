import React, { useState, useEffect } from 'react';
import { trackOrder } from '../services/orderService';

const OrderTracker = ({ orderId }) => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderStatus();
  }, [orderId]);

  const fetchOrderStatus = async () => {
    try {
      const data = await trackOrder(orderId);
      setOrderStatus(data);
    } catch (error) {
      console.error('Failed to track order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;
  if (!orderStatus) return <p style={{color: 'white'}}>Order not found</p>;

  const statuses = [
    { key: 'PLACED', label: 'Order Placed', icon: '📝' },
    { key: 'CONFIRMED', label: 'Confirmed', icon: '✅' },
    { key: 'PROCESSING', label: 'Processing', icon: '⚙️' },
    { key: 'SHIPPED', label: 'Shipped', icon: '🚚' },
    { key: 'DELIVERED', label: 'Delivered', icon: '📦' }
  ];

  const currentIndex = statuses.findIndex(s => s.key === orderStatus.status);

  return (
    <div className="glass-panel" style={styles.container}>
      <h3 style={styles.title}>Order #{orderId}</h3>
      
      <div style={styles.timeline}>
        {statuses.map((status, index) => (
          <div key={status.key} style={styles.step}>
            <div style={{
              ...styles.icon,
              ...(index <= currentIndex ? styles.iconActive : styles.iconInactive)
            }}>
              {status.icon}
            </div>
            <p style={{
              ...styles.label,
              ...(index <= currentIndex ? styles.labelActive : styles.labelInactive)
            }}>
              {status.label}
            </p>
            {index < statuses.length - 1 && (
              <div style={{
                ...styles.line,
                ...(index < currentIndex ? styles.lineActive : styles.lineInactive)
              }} />
            )}
          </div>
        ))}
      </div>

      <div style={styles.details}>
        <p style={styles.info}>Estimated Delivery: {orderStatus.estimatedDelivery}</p>
        <p style={styles.info}>Last Updated: {orderStatus.lastUpdated}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto'
  },
  title: {
    color: 'white',
    textAlign: 'center',
    marginBottom: '30px'
  },
  timeline: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: '30px'
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    position: 'relative'
  },
  icon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '10px',
    zIndex: 2
  },
  iconActive: {
    background: '#10b981',
    color: 'white'
  },
  iconInactive: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'rgba(255, 255, 255, 0.5)'
  },
  label: {
    fontSize: '14px',
    textAlign: 'center',
    fontWeight: '600'
  },
  labelActive: {
    color: 'white'
  },
  labelInactive: {
    color: 'rgba(255, 255, 255, 0.5)'
  },
  line: {
    position: 'absolute',
    top: '30px',
    left: '50%',
    width: '100%',
    height: '4px',
    zIndex: 1
  },
  lineActive: {
    background: '#10b981'
  },
  lineInactive: {
    background: 'rgba(255, 255, 255, 0.2)'
  },
  details: {
    textAlign: 'center'
  },
  info: {
    color: 'white',
    margin: '10px 0'
  }
};

export default OrderTracker;
