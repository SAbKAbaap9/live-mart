import React, { useState } from 'react';
import ProductCard from '../../components/ProductCard';
import SearchFilter from '../../components/SearchFilter';
import CartModal from '../../components/CartModal';
import { searchProducts } from '../../services/productService';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (filters) => {
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchProducts(filters);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-transition container">
      <CartModal />
      
      <div className="glass-panel" style={styles.header}>
        <h1 style={styles.title}>🔍 Search Products</h1>
        <p style={styles.subtitle}>Find exactly what you need</p>
      </div>

      <SearchFilter onFilter={handleSearch} />

      {loading && <div className="spinner" />}

      {!loading && searched && (
        <div className="glass-panel">
          <h2 style={styles.resultsTitle}>
            {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
          </h2>
          <div className="grid grid-3">
            {results.length === 0 ? (
              <p style={styles.noResults}>No products match your search criteria</p>
            ) : (
              results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
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
  resultsTitle: {
    color: 'white',
    marginBottom: '20px'
  },
  noResults: {
    color: 'white',
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    gridColumn: '1 / -1'
  }
};

export default SearchResults;
