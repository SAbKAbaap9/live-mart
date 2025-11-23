import { apiRequest } from './api';

export const getAllProducts = async () => {
  try {
    return await apiRequest("/products", "GET");
  } catch (error) {
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    return await apiRequest(`/products/category/${category}`, "GET");
  } catch (error) {
    throw error;
  }
};

export const searchProducts = async (filters) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.query) queryParams.append('q', filters.query);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.inStock !== undefined) queryParams.append('inStock', filters.inStock);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.distance) queryParams.append('distance', filters.distance);
    
    return await apiRequest(`/products/search?${queryParams.toString()}`, "GET");
  } catch (error) {
    throw error;
  }
};

export const getProductDetails = async (productId) => {
  try {
    return await apiRequest(`/products/${productId}`, "GET");
  } catch (error) {
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    return await apiRequest("/products", "POST", productData);
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    return await apiRequest(`/products/${productId}`, "PUT", productData);
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    return await apiRequest(`/products/${productId}`, "DELETE");
  } catch (error) {
    throw error;
  }
};

export const updateStock = async (productId, quantity) => {
  try {
    return await apiRequest(`/products/${productId}/stock`, "PUT", { quantity });
  } catch (error) {
    throw error;
  }
};

export const getNearbyShops = async (latitude, longitude, radius = 10) => {
  try {
    return await apiRequest(
      `/shops/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
      "GET"
    );
  } catch (error) {
    throw error;
  }
};


// ============================================
// FILE: src/services/orderService.js
// ============================================
import { apiRequest } from './api';

export const placeOrder = async (orderData) => {
  try {
    return await apiRequest("/orders", "POST", orderData);
  } catch (error) {
    throw error;
  }
};

export const getOrderHistory = async (userId) => {
  try {
    return await apiRequest(`/orders/user/${userId}`, "GET");
  } catch (error) {
    throw error;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    return await apiRequest(`/orders/${orderId}`, "GET");
  } catch (error) {
    throw error;
  }
};

export const trackOrder = async (orderId) => {
  try {
    return await apiRequest(`/orders/${orderId}/track`, "GET");
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    return await apiRequest(`/orders/${orderId}/status`, "PUT", { status });
  } catch (error) {
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    return await apiRequest(`/orders/${orderId}/cancel`, "PUT");
  } catch (error) {
    throw error;
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    return await apiRequest("/feedback", "POST", feedbackData);
  } catch (error) {
    throw error;
  }
};

export const getProductFeedback = async (productId) => {
  try {
    return await apiRequest(`/feedback/product/${productId}`, "GET");
  } catch (error) {
    throw error;
  }
};

export const processPayment = async (paymentData) => {
  try {
    return await apiRequest("/payments/process", "POST", paymentData);
  } catch (error) {
    throw error;
  }
};
