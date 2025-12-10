// ============================================
// ShareHub Backend - Database Configuration
// ============================================
// This file handles the connection to the MySQL database
// It uses connection pooling for efficient database management

// Import required packages
const mysql = require('mysql2'); // mysql2 package for MySQL database connection
const dotenv = require('dotenv'); // dotenv package to load environment variables from .env file

// Load environment variables from .env file
// This makes all variables in .env available via process.env
dotenv.config();

// ============================================
// Database Configuration Object
// ============================================
// This object contains all the database connection settings
// Values are read from environment variables (.env file)
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',        // Database server address (default: localhost)
    user: process.env.DB_USER || 'root',             // MySQL username (default: root)
    password: process.env.DB_PASSWORD || '',         // MySQL password (empty for XAMPP default)
    database: process.env.DB_NAME || 'sharehub',     // Database name (default: sharehub)
    port: process.env.DB_PORT || 3306,               // MySQL port (default: 3306)
    
    // Connection pool settings
    // ============================================
    // WHAT IS A CONNECTION POOL?
    // ============================================
    // A connection pool is a cache of database connections maintained so that
    // the connections can be reused when future requests to the database are required.
    // 
    // WHY USE A CONNECTION POOL?
    // - Creating a new database connection is expensive (takes time and resources)
    // - Instead of creating/destroying connections for each query, we reuse existing ones
    // - Improves performance and reduces database load
    // - Prevents "too many connections" errors
    //
    // HOW IT WORKS:
    // 1. Pool creates a set of connections (up to connectionLimit)
    // 2. When you need to query, pool gives you an available connection
    // 3. After query completes, connection returns to pool for reuse
    // 4. If all connections are busy, new requests wait in queue
    
    connectionLimit: 10,        // Maximum number of connections in the pool
                                 // 10 means max 10 simultaneous database operations
                                 // Adjust based on your server capacity
    
    waitForConnections: true,   // If true, wait for available connection when pool is full
                                 // If false, immediately return error when pool is exhausted
    
    queueLimit: 0                // Maximum number of queued connection requests
                                 // 0 means unlimited queue (requests wait indefinitely)
                                 // Set a number to limit queue (e.g., 10) to prevent memory issues
};

// ============================================
// Create Connection Pool
// ============================================
// mysql2.createPool() creates a pool of database connections
// The pool manages multiple connections efficiently
const pool = mysql.createPool(dbConfig);

// ============================================
// Convert Pool to Use Promises
// ============================================
// WHAT ARE PROMISES?
// ============================================
// Promises are a modern JavaScript feature for handling asynchronous operations.
// They provide a cleaner way to handle async code compared to callbacks.
//
// WHY PROMISES OVER CALLBACKS?
// - Callbacks can lead to "callback hell" (nested callbacks)
// - Promises allow cleaner, more readable code
// - Better error handling with .catch()
// - Can use async/await syntax for even cleaner code
//
// EXAMPLE COMPARISON:
//
// CALLBACKS (old way):
//   pool.query('SELECT * FROM users', (error, results) => {
//       if (error) throw error;
//       console.log(results);
//   });
//
// PROMISES (modern way):
//   pool.promise().query('SELECT * FROM users')
//       .then(([results]) => console.log(results))
//       .catch(error => console.error(error));
//
// ASYNC/AWAIT (even cleaner):
//   try {
//       const [results] = await pool.promise().query('SELECT * FROM users');
//       console.log(results);
//   } catch (error) {
//       console.error(error);
//   }
//
// The .promise() method converts the pool to use promises instead of callbacks
const promisePool = pool.promise();

// ============================================
// Test Database Connection Function
// ============================================
// This function tests if we can successfully connect to the database
// It's useful for:
// - Verifying database credentials are correct
// - Checking if database server is running
// - Ensuring connection pool is working properly
//
// HOW TO USE:
// Call this function when your server starts (e.g., in server.js)
// It will log success or exit the process if connection fails
const testConnection = async () => {
    try {
        // Execute a simple query to test the connection
        // SELECT 1 is a lightweight query that just returns the number 1
        // It's perfect for testing connectivity without heavy database operations
        const [results] = await promisePool.query('SELECT 1 as test');
        
        // If we get here, connection is successful!
        console.log('✅ Database connection successful!');
        console.log(`📊 Connected to database: ${dbConfig.database}`);
        console.log(`🔌 Database host: ${dbConfig.host}:${dbConfig.port}`);
        
        // Return true to indicate success
        return true;
        
    } catch (error) {
        // If connection fails, log the error and exit the process
        // This prevents the server from running with a broken database connection
        console.error('❌ Database connection failed!');
        console.error('Error details:', error.message);
        console.error('\n💡 Troubleshooting tips:');
        console.error('   1. Check if MySQL server is running');
        console.error('   2. Verify database credentials in .env file');
        console.error('   3. Ensure database "sharehub" exists');
        console.error('   4. Check if DB_PORT is correct (default: 3306)');
        console.error('   5. Verify network connectivity to database server');
        
        // Exit the Node.js process with error code 1
        // This stops the server from starting with a broken database connection
        process.exit(1);
    }
};

// ============================================
// Export for Use in Other Files
// ============================================
// We export both the promisePool and testConnection function
// so they can be used in other parts of the application
//
// HOW TO USE IN OTHER FILES:
// ============================================
// 1. Import at the top of your file:
//    const { promisePool, testConnection } = require('../config/database');
//
// 2. Test connection when server starts (in server.js):
//    await testConnection();
//
// 3. Use promisePool to execute queries (in models/controllers):
//    // Using async/await (recommended):
//    try {
//        const [rows] = await promisePool.query('SELECT * FROM users WHERE id = ?', [userId]);
//        // rows contains the query results
//    } catch (error) {
//        console.error('Database query error:', error);
//    }
//
//    // Using .then()/.catch():
//    promisePool.query('SELECT * FROM users')
//        .then(([rows]) => {
//            // Process rows
//        })
//        .catch(error => {
//            console.error('Database query error:', error);
//        });
//
// EXAMPLE USAGE IN A MODEL FILE:
// ============================================
// const { promisePool } = require('../config/database');
//
// const User = {
//     async findById(id) {
//         try {
//             const [rows] = await promisePool.query(
//                 'SELECT * FROM users WHERE id = ?',
//                 [id]
//             );
//             return rows[0]; // Return first row (single user)
//         } catch (error) {
//             throw error;
//         }
//     },
//
//     async findAll() {
//         try {
//             const [rows] = await promisePool.query('SELECT * FROM users');
//             return rows; // Return all rows
//         } catch (error) {
//             throw error;
//         }
//     }
// };
//
// module.exports = User;

module.exports = {
    promisePool,      // Export the promise-based connection pool
    testConnection    // Export the connection test function
};

// ============================================
// Additional Notes
// ============================================
// - Always use parameterized queries (with ? placeholders) to prevent SQL injection
// - Handle errors properly in your queries
// - Close connections are handled automatically by the pool
// - The pool will automatically reconnect if connection is lost
// - Monitor connection pool usage in production to optimize connectionLimit

