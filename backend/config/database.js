const mysql = require('mysql2');
require('dotenv').config();

// ============================================
// MySQL Database Connection Pool Configuration
// ============================================

// Create connection pool for better performance and connection management
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sharehub_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Create promise-based pool for async/await support
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    console.log('🔌 Testing database connection...');
    const connection = await promisePool.getConnection();
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    
    if (rows[0].test === 1) {
      console.log('✅ Database connection successful!');
      console.log(`📊 Connected to database: ${process.env.DB_NAME}`);
      console.log(`🔌 Database host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    }
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔧 Please check your database configuration in .env file');
    return false;
  }
};

// Handle pool errors
pool.on('connection', (connection) => {
  console.log(`🔗 New database connection established as id ${connection.threadId}`);
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Attempting to reconnect to database...');
  } else {
    throw err;
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Closing database pool...');
  pool.end(() => {
    console.log('✅ Database pool closed');
    process.exit(0);
  });
});

module.exports = {
  pool,
  promisePool,
  testConnection
};