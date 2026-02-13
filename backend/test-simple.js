try {
  const authController = require('./controllers/authController');
  console.log('Loaded successfully');
  console.log('Type:', typeof authController);
  console.log('Keys:', Object.keys(authController));
} catch (error) {
  console.error('Error loading:', error.message);
  console.error('Stack:', error.stack);
}