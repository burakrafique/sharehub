// ============================================
// ShareHub Backend - Main Server File
// ============================================
// This is the entry point of the Application Tier
// It initializes Express, configures middleware, sets up routes, and starts the server

// ============================================
// Import Required Packages
// ============================================
const express = require('express');           // Express.js web framework
const cors = require('cors');                  // Cross-Origin Resource Sharing middleware
const dotenv = require('dotenv');              // Load environment variables from .env file
const path = require('path');                 // Node.js path module for file/directory paths
const { testConnection } = require('./config/database');  // Database connection test function
const errorHandler = require('./middleware/errorHandler'); // Global error handler middleware

// Route handlers
const authRoutes = require('./routes/authRoutes');        // Routes for authentication features
const itemRoutes = require('./routes/itemRoutes');        // Routes for item operations
const messageRoutes = require('./routes/messageRoutes');  // Routes for messaging system
const userRoutes = require('./routes/userRoutes');        // Routes for user profile management
const transactionRoutes = require('./routes/transactionRoutes'); // Routes for transaction management
const favoriteRoutes = require('./routes/favoriteRoutes'); // Routes for favorites/bookmarks
const notificationRoutes = require('./routes/notificationRoutes'); // Routes for notifications
const adminRoutes = require('./routes/adminRoutes');      // Routes for admin operations
const { handleMulterError } = require('./middleware/uploadMiddleware'); // Multer error handler

// Load environment variables from .env file
// This must be called before accessing process.env variables
dotenv.config();

// ============================================
// Initialize Express Application
// ============================================
// Create an instance of Express application
// This app object will handle all HTTP requests and responses
const app = express();

// Get port from environment variables, or use default 5000
// PORT is where the server will listen for incoming requests
const PORT = process.env.PORT || 5000;

// Get environment (development or production)
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// Middleware Configuration
// ============================================
// IMPORTANT: Order of middleware matters!
// Middleware executes in the order they are defined
// Request flows through middleware from top to bottom

// ============================================
// 1. CORS (Cross-Origin Resource Sharing)
// ============================================
// WHAT IS CORS?
// CORS is a security feature that controls which websites can access your API
// By default, browsers block requests from different origins (different domain/port)
// 
// WHY DO WE NEED IT?
// Our React frontend runs on http://localhost:3000
// Our backend runs on http://localhost:5000
// Without CORS, the frontend cannot make requests to the backend
//
// HOW IT WORKS:
// CORS middleware adds special headers to responses that tell the browser
// "It's okay for http://localhost:3000 to access this API"
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],  // Allow requests from React frontend (multiple ports)
    credentials: true,                   // Allow cookies/authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Allowed request headers
}));

// ============================================
// 2. Body Parser Middleware
// ============================================
// WHAT IS BODY PARSER?
// Body parser extracts data from HTTP request body and makes it available in req.body
// 
// WHY DO WE NEED IT?
// When clients send JSON data (like in POST/PUT requests), it comes as raw text
// Body parser converts this text into a JavaScript object we can use
//
// EXAMPLE:
// Client sends: { "name": "John", "email": "john@example.com" }
// Without body parser: req.body is undefined
// With body parser: req.body = { name: "John", email: "john@example.com" }

// Parse JSON bodies (application/json content type)
// This handles POST/PUT requests with JSON data
app.use(express.json());

// Parse URL-encoded bodies (application/x-www-form-urlencoded)
// This handles form submissions
// extended: true allows parsing of rich objects and arrays
app.use(express.urlencoded({ extended: true }));

// ============================================
// 3. Static File Serving
// ============================================
// WHAT ARE STATIC FILES?
// Static files are files that don't change (images, CSS, JavaScript, etc.)
// They are served directly to the client without processing
//
// WHY DO WE NEED IT?
// Users upload images for items, and we need to serve these images
// When someone requests /uploads/items/image.jpg, Express serves the file
//
// HOW IT WORKS:
// path.join(__dirname, 'uploads') creates the full path to uploads folder
// __dirname = current directory (backend folder)
// So it points to: backend/uploads/
//
// When client requests: http://localhost:5000/uploads/items/image.jpg
// Express serves: backend/uploads/items/image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// 4. Request Logger Middleware
// ============================================
// WHAT IS REQUEST LOGGING?
// Logging every HTTP request helps with debugging and monitoring
// You can see what endpoints are being called, when, and by what method
//
// WHY DO WE NEED IT?
// - Debug issues: "Why isn't my API working?" Check the logs!
// - Monitor usage: See which endpoints are most popular
// - Track errors: See which requests are failing
//
// HOW IT WORKS:
// This middleware runs before every request
// It logs the HTTP method (GET, POST, etc.) and the URL
// Then calls next() to continue to the next middleware/route
app.use((req, res, next) => {
    // Log request method and URL
    // Example output: "GET /api/items" or "POST /api/auth/login"
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Call next() to pass control to the next middleware
    // Without next(), the request would hang and never complete
    next();
});

// ============================================
// API Routes
// ============================================
// HOW EXPRESS ROUTING WORKS:
// ============================================
// Routes define what happens when a client makes a request to a specific URL
// 
// SYNTAX: app.METHOD(PATH, HANDLER)
// - METHOD: HTTP method (GET, POST, PUT, DELETE, etc.)
// - PATH: URL path (e.g., '/api/items')
// - HANDLER: Function that processes the request and sends a response
//
// REQUEST-RESPONSE CYCLE:
// 1. Client sends HTTP request: GET http://localhost:5000/api/items
// 2. Express matches the route based on method and path
// 3. Handler function executes
// 4. Handler sends response back to client
// 5. Client receives response

// ============================================
// Health Check Endpoint
// ============================================
// This is a simple endpoint to verify the server is running
// Useful for monitoring, testing, and deployment checks
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'ShareHub Backend API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV
    });
});

// ============================================
// API Route Placeholders
// ============================================
// These routes are placeholders for future implementation
// They will be replaced with actual route handlers from route files
//
// ROUTE STRUCTURE:
// - /api/auth: Authentication routes (login, register, etc.)
// - /api/items: Item CRUD operations (create, read, update, delete items)
// - /api/users: User management routes
// - /api/messages: Messaging system routes

// Authentication routes - mounted at /api/auth
app.use('/api/auth', authRoutes);

// Item routes - mounted at /api/items
app.use('/api/items', itemRoutes);

// Message routes - mounted at /api/messages
app.use('/api/messages', messageRoutes);

// User routes - mounted at /api/users
app.use('/api/users', userRoutes);

// Transaction routes - mounted at /api/transactions
app.use('/api/transactions', transactionRoutes);

// Favorite routes - mounted at /api/favorites
app.use('/api/favorites', favoriteRoutes);

// Notification routes - mounted at /api/notifications
app.use('/api/notifications', notificationRoutes);

// Admin routes - mounted at /api/admin
app.use('/api/admin', adminRoutes);

// Setup routes - mounted at /api/setup (for demo data)
const setupRoutes = require('./routes/setupRoutes');
app.use('/api/setup', setupRoutes);

// ============================================
// API Documentation Endpoint
// ============================================
// GET /api/docs - API documentation with all available endpoints
app.get('/api/docs', (req, res) => {
    res.json({
        success: true,
        version: '1.0.0',
        description: 'ShareHub API - A platform for sharing, selling, and donating items',
        baseUrl: `http://localhost:${PORT}`,
        endpoints: {
            auth: [
                'POST /api/auth/register - Register new user',
                'POST /api/auth/login - Login user',
                'GET /api/auth/profile - Get user profile (protected)'
            ],
            items: [
                'POST /api/items - Create item (protected)',
                'GET /api/items - Get all items',
                'GET /api/items/search - Advanced search',
                'GET /api/items/nearby - Get nearby items',
                'GET /api/items/:id - Get item by ID',
                'PUT /api/items/:id - Update item (protected)',
                'PUT /api/items/:id/status - Update item status (protected)',
                'DELETE /api/items/:id - Delete item (protected)',
                'DELETE /api/items/images/:imageId - Delete image (protected)',
                'PUT /api/items/images/:imageId/primary - Set primary image (protected)'
            ],
            messages: [
                'POST /api/messages - Send message (protected)',
                'GET /api/messages/conversations - Get all conversations (protected)',
                'GET /api/messages/conversation/:otherUserId - Get conversation (protected)',
                'PUT /api/messages/mark-read - Mark messages as read (protected)',
                'GET /api/messages/unread-count - Get unread count (protected)',
                'DELETE /api/messages/:messageId - Delete message (protected)'
            ],
            users: [
                'GET /api/users/profile/:id - Get user profile',
                'PUT /api/users/profile - Update profile (protected)',
                'PUT /api/users/change-password - Change password (protected)',
                'GET /api/users/my-items - Get user items (protected)'
            ],
            transactions: [
                'POST /api/transactions - Create transaction (protected)',
                'GET /api/transactions - Get user transactions (protected)',
                'GET /api/transactions/:id - Get transaction by ID (protected)',
                'PUT /api/transactions/:id/status - Update status (protected)'
            ],
            favorites: [
                'POST /api/favorites - Add to favorites (protected)',
                'GET /api/favorites - Get user favorites (protected)',
                'GET /api/favorites/check/:itemId - Check if favorited (protected)',
                'DELETE /api/favorites/:itemId - Remove from favorites (protected)'
            ],
            notifications: [
                'GET /api/notifications - Get notifications (protected)',
                'GET /api/notifications/unread-count - Get unread count (protected)',
                'PUT /api/notifications/mark-read - Mark as read (protected)',
                'PUT /api/notifications/mark-all-read - Mark all as read (protected)',
                'DELETE /api/notifications/:id - Delete notification (protected)'
            ],
            admin: [
                'GET /api/admin/users - Get all users (admin)',
                'GET /api/admin/items - Get all items (admin)',
                'GET /api/admin/transactions - Get all transactions (admin)',
                'GET /api/admin/stats - Get platform stats (admin)',
                'PUT /api/admin/users/:userId/role - Update user role (admin)',
                'DELETE /api/admin/users/:userId - Delete user (admin)',
                'DELETE /api/admin/items/:itemId - Delete item (admin)'
            ],
            stats: [
                'GET /api/stats - Get platform statistics'
            ]
        }
    });
});

// ============================================
// Statistics Endpoint
// ============================================
// GET /api/stats - Get platform statistics for dashboard
// Returns total users, available items, and total transactions
app.get('/api/stats', async (req, res) => {
    try {
        const { promisePool } = require('./config/database');
        
        // Get total users count
        const [users] = await promisePool.execute('SELECT COUNT(*) as count FROM users');
        
        // Get available items count
        const [items] = await promisePool.execute('SELECT COUNT(*) as count FROM items WHERE status = "available"');
        
        // Get total transactions count
        const [transactions] = await promisePool.execute('SELECT COUNT(*) as count FROM transactions');
        
        res.json({
            success: true,
            stats: {
                totalUsers: users[0].count,
                availableItems: items[0].count,
                totalTransactions: transactions[0].count
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching stats',
            error: error.message 
        });
    }
});

// ============================================
// 404 Handler (Not Found)
// ============================================
// WHAT IS A 404 HANDLER?
// This middleware catches all requests that don't match any defined routes
// It should be placed AFTER all other routes
//
// WHY DO WE NEED IT?
// If a client requests a route that doesn't exist, we should send a proper error
// Without this, Express would send a default HTML error page
//
// HOW IT WORKS:
// This middleware runs only if no previous route matched the request
// It sends a 404 (Not Found) status with a JSON error message
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.url}`,
        hint: 'Check the API documentation for available endpoints'
    });
});

// ============================================
// Multer Error Handler
// ============================================
// Handle file upload errors from multer middleware
app.use(handleMulterError);

// ============================================
// Global Error Handler
// ============================================
// WHAT IS A GLOBAL ERROR HANDLER?
// This middleware catches all errors that occur anywhere in the application
// It must be the LAST middleware in the chain
//
// WHY DO WE NEED IT?
// Instead of crashing the server, errors are caught and sent as proper HTTP responses
// Provides consistent error format across all endpoints
//
// HOW IT WORKS:
// When an error occurs, call next(error) in your route handler
// Express skips all middleware and goes directly to error handlers
// This middleware formats the error and sends it to the client
//
// EXAMPLE USAGE IN ROUTE:
// try {
//     // Some code that might throw an error
// } catch (error) {
//     next(error);  // Pass error to error handler
// }
app.use(errorHandler);

// ============================================
// Handle Unhandled Promise Rejections
// ============================================
// WHAT ARE UNHANDLED PROMISE REJECTIONS?
// When you use async/await or promises, errors can occur
// If you don't catch them with try/catch or .catch(), they become "unhandled"
//
// WHY DO WE NEED THIS?
// Unhandled promise rejections can crash your Node.js application
// This listener catches them and logs them before the app crashes
//
// HOW IT WORKS:
// process.on() listens for specific Node.js events
// 'unhandledRejection' event fires when a promise is rejected but not caught
process.on('unhandledRejection', (err, promise) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
    console.error('Stack:', err.stack);
    // In production, you might want to close the server gracefully
    // For now, we just log the error
});

// ============================================
// Server Startup Function
// ============================================
// This function starts the server after testing database connection
// It's wrapped in an async function because testConnection() is async
const startServer = async () => {
    try {
        // Step 1: Test database connection
        // This ensures the database is accessible before starting the server
        // If database connection fails, the server won't start (prevents runtime errors)
        console.log('🔌 Testing database connection...');
        await testConnection();
        
        // Step 2: Start the Express server
        // app.listen() starts the server and makes it listen on the specified PORT
        // When a request comes to that port, Express handles it
        app.listen(PORT, () => {
            // This callback runs when the server successfully starts
            console.log('\n' + '='.repeat(50));
            console.log('🚀 ShareHub Backend Server Started!');
            console.log('='.repeat(50));
            console.log(`📍 Server URL: http://localhost:${PORT}`);
            console.log(`🌍 Environment: ${NODE_ENV}`);
            console.log(`⏰ Started at: ${new Date().toISOString()}`);
            console.log(`📊 Health Check: http://localhost:${PORT}/`);
            console.log('='.repeat(50) + '\n');
        });
        
    } catch (error) {
        // If database connection fails, testConnection() will exit the process
        // But we catch any other errors here just in case
        console.error('❌ Failed to start server:', error);
        process.exit(1);  // Exit with error code 1
    }
};

// ============================================
// Start the Server
// ============================================
// Call the startServer function to begin the application
// This is the entry point that kicks everything off
startServer();

// ============================================
// Additional Notes
// ============================================
// MIDDLEWARE ORDER MATTERS:
// 1. CORS - Must be first to allow cross-origin requests
// 2. Body Parser - Must be before routes that need req.body
// 3. Static Files - Before routes (so /uploads works)
// 4. Request Logger - Before routes (to log all requests)
// 5. Routes - Your actual API endpoints
// 6. 404 Handler - After all routes (catches unmatched routes)
// 7. Error Handler - Must be last (catches all errors)
//
// PRODUCTION TIPS:
// - Use environment variables for all configuration
// - Enable HTTPS in production
// - Use a reverse proxy (like Nginx) in production
// - Set up proper logging (use winston or morgan)
// - Implement rate limiting
// - Add request validation
// - Use helmet.js for security headers

