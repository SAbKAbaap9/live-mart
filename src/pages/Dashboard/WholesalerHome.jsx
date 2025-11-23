import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../../services/productService';
import { useAuth } from '../../context/authContext';

const WholesalerHome = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productsData = await getAllProducts();
      setProducts(productsData);
      // Mock orders data - replace with actual API call
      setOrders([
        { id: 1, retailerId: 'R001', total: 50000, status: 'Pending', date: new Date() },
        { id: 2, retailerId: 'R002', total: 35000, status: 'Completed', date: new Date() }
      ]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-transition container">
      <div className="glass-panel" style={styles.header}>
        <h1 style={styles.title}>Wholesaler Dashboard</h1>
        <p style={styles.subtitle}>Manage bulk inventory and retailer orders</p>
      </div>

      <div style={styles.stats}>
        <div className="glass-card" style={styles.statCard}>
          <h3 style={styles.statTitle}>📦 Total Products</h3>
          <p style={styles.statValue}>{products.length}</p>
        </div>
        <div className="glass-card" style={styles.statCard}>
          <h3 style={styles.statTitle}>🏪 Active Retailers</h3>
          <p style={styles.statValue}>15</p>
        </div>
        <div className="glass-card" style={styles.statCard}>
          <h3 style={styles.statTitle}>💰 Monthly Revenue</h3>
          <p style={styles.statValue}>₹5,50,000</p>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            ...styles.tab,
            ...(activeTab === 'products' ? styles.tabActive : {})
          }}
          className="glass-button"
        >
          📦 Inventory
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            ...styles.tab,
            ...(activeTab === 'orders' ? styles.tabActive : {})
          }}
          className="glass-button"
        >
          📋 Retailer Orders
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="glass-panel">
          <h2 style={styles.sectionTitle}>Inventory Management</h2>
          <div className="grid grid-3">
            {products.map(product => (
              <div key={product.id} className="glass-card" style={styles.card}>
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/200'}
                  alt={product.name}
                  style={styles.image}
                />
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.price}>₹{product.price}</p>
                <p style={styles.stock}>Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-panel">
          <h2 style={styles.sectionTitle}>Retailer Orders</h2>
          <div style={styles.ordersList}>
            {orders.map(order => (
              <div key={order.id} className="glass-card" style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <span style={styles.orderId}>Order #{order.id}</span>
                  <span style={styles.orderStatus}>{order.status}</span>
                </div>
                <p style={styles.orderInfo}>Retailer: {order.retailerId}</p>
                <p style={styles.orderInfo}>Date: {new Date(order.date).toLocaleDateString()}</p>
                <p style={styles.orderTotal}>Total: ₹{order.total}</p>
                <button className="btn-primary" style={styles.approveBtn}>
                  {order.status === 'Pending' ? 'Approve Order' : 'View Details'}
                </button>
              </div>
            ))}
          </div>
        </div>
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
    fontSize: '2.5em',
    marginBottom: '10px'
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1.2em'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    padding: '30px',
    textAlign: 'center'
  },
  statTitle: {
    color: 'white',
    marginBottom: '10px',
    fontSize: '18px'
  },
  statValue: {
    color: 'white',
    fontSize: '36px',
    fontWeight: 'bold'
  },
  tabs: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px'
  },
  tab: {
    flex: 1,
    padding: '15px',
    fontSize: '16px',
    fontWeight: '600'
  },
  tabActive: {
    background: 'rgba(255,255,255,0.4)'
  },
  sectionTitle: {
    color: 'white',
    marginBottom: '20px'
  },
  card: {
    padding: '15px',
    textAlign: 'center'
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  name: {
    color: 'white',
    fontSize: '16px',
    marginBottom: '5px'
  },
  price: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  stock: {
    color: 'rgba(255,255,255,0.8)'
  },
  ordersList: {
    display: 'grid',
    gap: '15px'
  },
  orderCard: {
    padding: '20px'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px'
  },
  orderId: {
    color: 'white',
    fontWeight: '600',
    fontSize: '18px'
  },
  orderStatus: {
    color: '#10b981',
    fontWeight: '600'
  },
  orderInfo: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '8px'
  },
  orderTotal: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  approveBtn: {
    width: '100%',
    padding: '12px'
  }
};

export default WholesalerHome;