// ShareHub Frontend Configuration
// Centralized configuration using environment variables

const config = {
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    backendURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
    timeout: 30000 // 30 seconds
  },

  // Google Maps Configuration
  maps: {
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    defaultCenter: {
      lat: 31.5204, // Lahore, Pakistan
      lng: 74.3587
    },
    defaultZoom: 13
  },

  // App Configuration
  app: {
    name: 'ShareHub',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
    acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  },

  // Pagination
  pagination: {
    itemsPerPage: 12,
    messagesPerPage: 50
  }
};

export default config;
