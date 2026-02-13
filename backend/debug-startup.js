// Debug script to find startup issues
console.log('🔍 Debugging server startup...');

try {
  console.log('1. Loading basic modules...');
  const express = require('express');
  const cors = require('cors');
  require('dotenv').config();
  console.log('✅ Basic modules loaded');

  console.log('2. Testing database config...');
  const { testConnection } = require('./config/database');
  console.log('✅ Database config loaded');

  console.log('3. Testing auth controller...');
  const authController = require('./controllers/authController');
  console.log('✅ Auth controller loaded');
  console.log('   Available functions:', Object.keys(authController));

  console.log('4. Testing validation rules...');
  const validationRules = require('./middleware/validationRules');
  console.log('✅ Validation rules loaded');
  console.log('   Available rules:', Object.keys(validationRules));

  console.log('5. Testing auth routes...');
  const authRoutes = require('./routes/authRoutes');
  console.log('✅ Auth routes loaded');

  console.log('6. Testing user routes...');
  const userRoutes = require('./routes/userRoutes');
  console.log('✅ User routes loaded');

  console.log('🎉 All modules loaded successfully!');
  console.log('The server should start without issues.');

} catch (error) {
  console.error('❌ Error found:', error.message);
  console.error('📍 Stack trace:', error.stack);
}