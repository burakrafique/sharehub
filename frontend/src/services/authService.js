import API from './api';

// Register new user
export const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  
  // Save token and user data to localStorage
  if (response.data.success && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  
  // Save token and user data to localStorage
  if (response.data.success && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Get current user profile from backend
export const getCurrentUser = async () => {
  const response = await API.get('/auth/profile');
  return response.data;
};

// Get user from localStorage
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};
