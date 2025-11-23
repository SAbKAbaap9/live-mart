import React, { useState, useEffect } from 'react';
import { 
  getAllProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../../services/productService';
import { useAuth } from '../../context/authContext';

const RetailerHome = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        inStock: parseInt(formData.stock) > 0,
        retailerId: user.userId
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        alert('Product updated successfully!');
      } else {
        await addProduct(productData);
        alert('Product added successfully!');
      }

      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        imageUrl: ''
      });
      setEditingProduct(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      imageUrl: product.imageUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(productId);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  if (loading && products.length === 0) return <div className="spinner" />;

  return (
    <div className="page-transition container">
      <div className="glass-panel" style={styles.header}>
        <h1 style={styles.title}>Retailer Dashboard</h1>
        <p style={styles.subtitle}>Manage your inventory</p>
      </div>

      <button
        onClick={() => {
          setShowForm(!showForm);
          if (showForm) {
            setEditingProduct(null);
            setFormData({
              name: '',
              category: '',
              price: '',
              stock: '',
              description: '',
              imageUrl: ''
            });
          }
        }}
        className="btn-primary"
        style={styles.addBtn}
      >
        {showForm ? '❌ Cancel' : '➕ Add New Product'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel" style={styles.form}>
          <h3 style={styles.formTitle}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food & Beverages</option>
            <option value="Home">Home & Kitchen</option>
            <option value="Books">Books</option>
            <option value="Sports">Sports</option>
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={styles.input}
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            style={styles.input}
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            style={styles.textarea}
          />

          <input
            type="url"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" className="btn-primary" style={styles.submitBtn}>
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      <div className="glass-panel">
        <h2 style={styles.sectionTitle}>Your Products</h2>
        
        {products.length === 0 ? (
          <p style={styles.noData}>No products yet. Add your first product!</p>
        ) : (
          <div className="grid grid-2">
            {products.map(product => (
              <div key={product.id} className="glass-card" style={styles.productCard}>
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/200'}
                  alt={product.name}
                  style={styles.productImage}
                />
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.productCategory}>{product.category}</p>
                <p style={styles.productPrice}>₹{product.price}</p>
                <p style={styles.productStock}>
                  Stock: {product.stock} {product.inStock ? '✓' : '✗'}
                </p>
                
                <div style={styles.actions}>
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn-primary"
                    style={styles.actionBtn}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn-danger"
                    style={styles.actionBtn}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
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
  addBtn: {
    marginBottom: '20px',
    padding: '15px 30px',
    fontSize: '16px'
  },
  form: {
    marginBottom: '30px'
  },
  formTitle: {
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
  submitBtn: {
    width: '100%',
    padding: '15px'
  },
  sectionTitle: {
    color: 'white',
    marginBottom: '20px'
  },
  noData: {
    color: 'white',
    textAlign: 'center',
    padding: '40px'
  },
  productCard: {
    padding: '20px',
    textAlign: 'center'
  },
  productImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  productName: {
    color: 'white',
    marginBottom: '5px'
  },
  productCategory: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    marginBottom: '10px'
  },
  productPrice: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  productStock: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '15px'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  actionBtn: {
    flex: 1,
    padding: '10px'
  }
};

export default RetailerHome;
