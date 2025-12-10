import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Health check function to verify backend connection
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(BACKEND_URL);
    return {
      success: true,
      message: 'Backend is running',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Backend is not reachable',
      error: error.message
    };
  }
};

// Check API endpoints
export const checkAPIHealth = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/docs`);
    return {
      success: true,
      message: 'API is running',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: 'API is not reachable',
      error: error.message
    };
  }
};
