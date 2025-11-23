import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div 
      className="glass-card card" 
      style={styles.card}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img 
        src={product.imageUrl || 'https://via.placeholder.com/250'}
        alt={product.name}
        style={styles.image}
      />
      
      <div style={styles.content}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.category}>{product.category}</p>
        
        <div style={styles.priceRow}>
          <span style={styles.price}>₹{product.price}</span>
          <span style={product.inStock ? styles.inStock : styles.outOfStock}>
            {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
          </span>
        </div>

        {product.inStock && (
          <button 
            onClick={handleAddToCart}
            style={styles.addBtn}
            className="btn-primary"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    cursor: 'pointer',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px 8px 0 0'
  },
  content: {
    padding: '15px'
  },
  name: {
    color: 'white',
    fontSize: '18px',
    marginBottom: '5px'
  },
  category: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    marginBottom: '10px'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  price: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  inStock: {
    color: '#10b981',
    fontSize: '14px',
    fontWeight: '600'
  },
  outOfStock: {
    color: '#ef4444',
    fontSize: '14px',
    fontWeight: '600'
  },
  addBtn: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  }
};

export default ProductCard;