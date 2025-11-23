import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../../services/productService';
import ProductCard from '../../components/ProductCard';
import SearchFilter from '../../components/SearchFilter';
import CartModal from '../../components/CartModal';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
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
      console.error('Filter failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-transition container">
      <CartModal />
      
      <div className="glass-panel" style={styles.header}>
        <h1 style={styles.title}>🛍️ All Products</h1>
        <p style={styles.subtitle}>Discover amazing deals</p>
      </div>

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
  noData: {
    color: 'white',
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    gridColumn: '1 / -1'
  }
};

export default ProductList;
