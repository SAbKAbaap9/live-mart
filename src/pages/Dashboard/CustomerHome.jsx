import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../../services/productService';
import { getOrderHistory } from '../../services/orderService';
import { useAuth } from '../../context/authContext';
import ProductCard from '../../components/ProductCard';
import CartModal from '../../components/CartModal';
import SearchFilter from '../../components/SearchFilter';

const CustomerHome = () => {
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
      const [productsData, ordersData] = await Promise.all([
        getAllProducts(),
        getOrderHistory(user.userId)
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (filters) => {
    setLoading(true);
    try {
      const { searchProducts } = await import('../../services/productService');
      const results = await searchProducts(filters);
      setProducts(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-transition container">
      <CartModal />
      
      <div className="glass-panel" style={styles.header}>
        <h1 style={styles.title}>Welcome, {user.name}! 👋</h1>
        <p style={styles.subtitle}>Explore products and manage your orders</p>
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
          🛍️ Browse Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            ...styles.tab,
            ...(activeTab === 'orders' ? styles.tabActive : {})
          }}
          className="glass-button"
        >
          📦 My Orders
        </button>
      </div>

      {activeTab === 'products' ? (
        <>
          <SearchFilter onFilter={handleFilter} />
          
          <div className="grid grid-3">
            {products.length === 0 ? (
              <p style={styles.noData}>No products found</p>
            ) : (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </>
      ) : (
        <div className="glass-panel">
          <h2 style={styles.sectionTitle}>Order History</h2>
          {orders.length === 0 ? (
            <p style={styles.noData}>No orders yet</p>
          ) : (
            <div style={styles.ordersList}>
              {orders.map(order => (
                <div key={order.id} className="glass-card" style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <span style={styles.orderId}>Order #{order.id}</span>
                    <span style={styles.orderStatus}>{order.status}</span>
                  </div>
                  <p style={styles.orderDate}>{new Date(order.date).toLocaleDateString()}</p>
                  <p style={styles.orderTotal}>Total: ₹{order.total}</p>
                  <button 
                    onClick={() => window.location.href = `/track/${order.id}`}
                    className="btn-primary"
                    style={styles.trackBtn}
                  >
                    Track Order
                  </button>
                </div>
              ))}
            </div>
          )}
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
  noData: {
    color: 'white',
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px'
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
    marginBottom: '10px'
  },
  orderId: {
    color: 'white',
    fontWeight: '600'
  },
  orderStatus: {
    color: '#10b981',
    fontWeight: '600'
  },
  orderDate: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    marginBottom: '5px'
  },
  orderTotal: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  trackBtn: {
    width: '100%',
    padding: '10px'
  }
};

export default CustomerHome;
