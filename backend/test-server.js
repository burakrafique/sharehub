console.log('Starting test...');

try {
  console.log('Loading express...');
  const express = require('express');
  
  console.log('Loading database...');
  const { testConnection } = require('./config/database');
  
  console.log('Loading error handler...');
  const errorHandler = require('./middleware/errorHandler');
  
  console.log('Loading auth routes...');
  const authRoutes = require('./routes/authRoutes');
  
  console.log('Loading item routes...');
  const itemRoutes = require('./routes/itemRoutes');
  
  console.log('Loading multer error handler...');
  const { handleMulterError } = require('./middleware/uploadMiddleware');
  
  console.log('All modules loaded successfully!');
} catch (error) {
  console.error('Error loading modules:', error.message);
  console.error('Stack:', error.stack);
}
