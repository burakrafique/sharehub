// ============================================
// ShareHub Backend Server - Main Entry Point
// Node.js/Express API Server for ShareHub Marketplace
// ============================================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database configuration
const { testConnection } = require('./config/database');

// Import middleware
const { handleMulterError } = require('./middleware/uploadMiddleware');

// ============================================
// Initialize Express Application
// ============================================

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Global Middleware Configuration
// ============================================

// CORS Configuration - Allow frontend to communicate with backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Static File Serving for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request Logging Middleware (Development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ============================================
// Health Check Route
// ============================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ShareHub Backend API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// ============================================
// API Routes
// ============================================

// Import route modules
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const messageRoutes = require('./routes/messageRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ngoRoutes = require('./routes/ngoRoutes');

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ngo', ngoRoutes);

// Additional user routes (for profile management, etc.)
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// ============================================
// File Upload Error Handling
// ============================================

app.use(handleMulterError);

// ============================================
// Error Handling Middleware
// ============================================

// 404 Handler - Route not found
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/items',
      'POST /api/items',
      'GET /api/messages',
      'POST /api/messages',
      'GET /api/transactions',
      'GET /api/favorites',
      'GET /api/notifications',
      'GET /api/admin/*',
      'GET /api/ngo/*'
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('===========================================================');
  console.error('=                                                         ❌ ERROR OCCURRED');
  console.error('===========================================================');
  console.error('=                                                         Timestamp:', new Date().toISOString());
  console.error('Method:', req.method);
  console.error('URL:', req.originalUrl);
  console.error('Status Code:', err.status || 500);
  console.error('Error Name:', err.name || 'Unknown');
  console.error('Error Code:', err.code || 'N/A');
  console.error('Error Message:', err.message || 'No message provided');
  
  if (err.stack) {
    console.error('Stack Trace:');
    console.error(err.stack);
  }
  
  console.error('===========================================================');
  console.error('=                                                         ');

  // Don't send stack trace in production
  const errorResponse = {
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  };

  res.status(err.status || 500).json(errorResponse);
});

// ============================================
// Server Startup
// ============================================

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Server not started.');
      process.exit(1);
    }

    // Start the server
    app.listen(PORT, () => {
      console.log('==================================================');
      console.log('🚀 ShareHub Backend Server Started!');
      console.log('==================================================');
      console.log(`📍 Server URL: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Started at: ${new Date().toISOString()}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/`);
      console.log('==================================================');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// ============================================
// Graceful Shutdown
// ============================================

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;