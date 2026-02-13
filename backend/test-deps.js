try {
  console.log('Testing User model...');
  const User = require('./models/User');
  console.log('✅ User model loaded');

  console.log('Testing authMiddleware...');
  const { generateToken } = require('./middleware/authMiddleware');
  console.log('✅ authMiddleware loaded');

  console.log('Testing express-validator...');
  const { validationResult } = require('express-validator');
  console.log('✅ express-validator loaded');

  console.log('All dependencies loaded successfully');
} catch (error) {
  console.error('❌ Error loading dependencies:', error.message);
  console.error('Stack:', error.stack);
}