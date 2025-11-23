import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetails, getProductFeedback } from '../../services/productService';
import { useCart } from '../../context/cartContext';
import FeedbackForm from '../../components/FeedbackForm';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    try {
      const [productData, feedbackData] = await Promise.all([
        getProductDetails(id),
        getProductFeedback(id)
      ]);
      setProduct(productData);
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  if (loading) return <div className="spinner" />;
  if (!product) return <p style={{color: 'white', textAlign: 'center'}}>Product not found</p>;

  return (
    <div className="page-transition container">
      <button 
        onClick={() => navigate(-1)}
        className="glass-button"
        style={styles.backBtn}
      >
        ← Back
      </button>

      <div className="glass-panel" style={styles.container}>
        <div style={styles.grid}>
          <div style={styles.imageSection}>
            <img
              src={product.imageUrl || 'https://via.placeholder.com/500'}
              alt={product.name}
              style={styles.image}
            />
          </div>

          <div style={styles.details}>
            <h1 style={styles.title}>{product.name}</h1>
            <p style={styles.category}>Category: {product.category}</p>
            
            <div style={styles.priceSection}>
              <span style={styles.price}>₹{product.price}</span>
              <span style={product.inStock ? styles.inStock : styles.outOfStock}>
                {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
            </div>

            <p style={styles.description}>
              {product.description || 'No description available'}
            </p>

            {product.inStock && (
              <div style={styles.actions}>
                <div style={styles.quantity}>
                  <label style={styles.label}>Quantity:</label>
                  <div style={styles.quantityControls}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={styles.qtyBtn}
                    >
                      -
                    </button>
                    <span style={styles.qtyValue}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      style={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-primary"
                  style={styles.addBtn}
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h2 style={styles.sectionTitle}>Customer Reviews</h2>
        {feedback.length === 0 ? (
          <p style={styles.noFeedback}>No reviews yet. Be the first to review!</p>
        ) : (
          <div style={styles.feedbackList}>
            {feedback.map((item, index) => (
              <div key={index} className="glass-card" style={styles.feedbackCard}>
                <div style={styles.rating}>
                  {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                </div>
                <p style={styles.comment}>{item.comment}</p>
                <p style={styles.date}>{new Date(item.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  backBtn: {
    marginBottom: '20px',
    padding: '10px 20px'
  },
  container: {
    marginBottom: '30px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px'
  },
  imageSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '15px'
  },
  details: {
    color: 'white'
  },
  title: {
    fontSize: '2.5em',
    marginBottom: '10px'
  },
  category: {
    fontSize: '1.2em',
    opacity: 0.8,
    marginBottom: '20px'
  },
  priceSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '15px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px'
  },
  price: {
    fontSize: '2.5em',
    fontWeight: 'bold'
  },
  inStock: {
    color: '#10b981',
    fontSize: '1.2em',
    fontWeight: '600'
  },
  outOfStock: {
    color: '#ef4444',
    fontSize: '1.2em',
    fontWeight: '600'
  },
  description: {
    lineHeight: '1.8',
    marginBottom: '30px',
    opacity: 0.9
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  label: {
    fontSize: '1.2em',
    fontWeight: '600'
  },
  quantityControls: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  qtyBtn: {
    background: 'rgba(255,255,255,0.3)',
    border: 'none',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    fontSize: '20px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  qtyValue: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    minWidth: '40px',
    textAlign: 'center'
  },
  addBtn: {
    padding: '15px',
    fontSize: '1.2em'
  },
  sectionTitle: {
    color: 'white',
    marginBottom: '20px'
  },
  noFeedback: {
    color: 'white',
    textAlign: 'center',
    padding: '40px',
    opacity: 0.7
  },
  feedbackList: {
    display: 'grid',
    gap: '15px'
  },
  feedbackCard: {
    padding: '20px'
  },
  rating: {
    color: '#fbbf24',
    fontSize: '20px',
    marginBottom: '10px'
  },
  comment: {
    color: 'white',
    marginBottom: '10px',
    lineHeight: '1.6'
  },
  date: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px'
  }
};

export default ProductDetail;
