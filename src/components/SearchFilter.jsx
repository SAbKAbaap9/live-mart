import React, { useState } from 'react';

const SearchFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      query: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: true
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={styles.form}>
      <h3 style={styles.title}>🔍 Search & Filter</h3>

      <input
        type="text"
        name="query"
        value={filters.query}
        onChange={handleChange}
        placeholder="Search products..."
        style={styles.input}
      />

      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
        style={styles.select}
      >
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Food">Food & Beverages</option>
        <option value="Home">Home & Kitchen</option>
        <option value="Books">Books</option>
        <option value="Sports">Sports</option>
      </select>

      <div style={styles.priceRow}>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Min Price"
          style={{...styles.input, width: '48%'}}
        />
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Max Price"
          style={{...styles.input, width: '48%'}}
        />
      </div>

      <label style={styles.checkbox}>
        <input
          type="checkbox"
          name="inStock"
          checked={filters.inStock}
          onChange={handleChange}
        />
        <span style={styles.checkboxLabel}>In Stock Only</span>
      </label>

      <div style={styles.buttons}>
        <button type="submit" className="btn-primary" style={styles.button}>
          Apply Filters
        </button>
        <button 
          type="button" 
          onClick={handleReset}
          className="btn-secondary"
          style={styles.button}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    marginBottom: '30px'
  },
  title: {
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
  select: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '16px'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px'
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    cursor: 'pointer'
  },
  checkboxLabel: {
    color: 'white',
    marginLeft: '10px',
    fontSize: '16px'
  },
  buttons: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    flex: 1,
    padding: '12px'
  }
};

export default SearchFilter;
