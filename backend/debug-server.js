console.log('=== DEBUG SERVER START ===');

try {
  console.log('1. Loading modules...');
  const express = require('express');
  const cors = require('cors');
  const dotenv = require('dotenv');
  const path = require('path');
  
  console.log('2. Loading database...');
  const { testConnection } = require('./config/database');
  
  console.log('3. Loading middleware...');
  const errorHandler = require('./middleware/errorHandler');
  const { handleMulterError } = require('./middleware/uploadMiddleware');
  
  console.log('4. Loading routes...');
  const authRoutes = require('./routes/authRoutes');
  const itemRoutes = require('./routes/itemRoutes');
  
  console.log('5. Loading environment variables...');
  dotenv.config();
  
  console.log('6. Creating Express app...');
  const app = express();
  const PORT = process.env.PORT || 5000;
  
  console.log('7. Setting up middleware...');
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  console.log('8. Setting up routes...');
  app.get('/', (req, res) => {
    res.json({ success: true, message: 'ShareHub Backend API is running!' });
  });
  
  app.use('/api/auth', authRoutes);
  app.use('/api/items', itemRoutes);
  
  console.log('9. Setting up error handlers...');
  app.use((req, res, next) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
  });
  
  app.use(handleMulterError);
  app.use(errorHandler);
  
  console.log('10. Starting server...');
  const startServer = async () => {
    try {
      console.log('11. Testing database connection...');
      await testConnection();
      
      console.log('12. Starting Express server...');
      app.listen(PORT, () => {
        console.log(`\n✅ Server started successfully on port ${PORT}`);
        console.log(`📍 http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('❌ Error starting server:', error);
      process.exit(1);
    }
  };
  
  startServer();
  
} catch (error) {
  console.error('❌ Fatal error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
