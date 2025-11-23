import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { CartProvider } from './context/cartContext';
import Navbar from './components/Navbar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CustomerHome from './pages/Dashboard/CustomerHome';
import RetailerHome from './pages/Dashboard/RetailerHome';
import WholesalerHome from './pages/Dashboard/WholesalerHome';
import ProductList from './pages/Product/ProductList';
import ProductDetail from './pages/Product/ProductDetail';
import SearchResults from './pages/Product/SearchResults';
import Cart from './pages/Order/Cart';
import Checkout from './pages/Order/Checkout';
import OrderTracking from './pages/Order/OrderTracking';
import './styles/glass.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar />
            <div className="page-transition">
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/customer" element={<CustomerHome />} />
                <Route path="/retailer" element={<RetailerHome />} />
                <Route path="/wholesaler" element={<WholesalerHome />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/track/:orderId" element={<OrderTracking />} />
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;