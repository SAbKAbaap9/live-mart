import { apiRequest } from './api';

export const register = async (userData) => {
  try {
    const result = await apiRequest("/auth/register", "POST", userData);
    return result;
  } catch (error) {
    throw error;
  }
};

export const sendOTP = async (email) => {
  try {
    return await apiRequest("/auth/send-otp", "POST", { email });
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const result = await apiRequest("/auth/verify-otp", "POST", { email, otp });
    if (result.token) {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("userRole", result.role);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userName", result.name);
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const result = await apiRequest("/auth/login", "POST", credentials);
    if (result.token) {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("userRole", result.role);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userName", result.name);
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const socialLogin = async (provider, token) => {
  try {
    const result = await apiRequest("/auth/social-login", "POST", { 
      provider, 
      token 
    });
    if (result.token) {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("userRole", result.role);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userName", result.name);
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
};

export const getCurrentUser = () => {
  return {
    token: localStorage.getItem("authToken"),
    role: localStorage.getItem("userRole"),
    userId: localStorage.getItem("userId"),
    name: localStorage.getItem("userName")
  };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};