// ============================================
// ShareHub Backend - Authentication Middleware
// ============================================
// This file contains middleware functions for JWT token verification
// Middleware runs between receiving a request and sending a response

// ============================================
// Import Required Packages
// ============================================
const jwt = require('jsonwebtoken');  // JWT token verification library

// ============================================
// WHAT IS MIDDLEWARE?
// ============================================
// Middleware are functions that execute during the request-response cycle.
// They sit "in the middle" between the client's request and the server's response.
//
// MIDDLEWARE IN EXPRESS:
// ============================================
// Express middleware functions have access to:
// - req: The request object (contains data from client)
// - res: The response object (used to send data to client)
// - next: A function to pass control to the next middleware
//
// HOW MIDDLEWARE WORKS:
// ============================================
// 1. Client sends HTTP request → Express receives it
// 2. Request flows through middleware functions (in order)
// 3. Each middleware can:
//    - Execute code (validate, log, modify)
//    - Modify req/res objects
//    - End the request-response cycle (send response)
//    - Call next() to pass to next middleware
// 4. After all middleware, request reaches route handler
// 5. Route handler sends response → Client receives it
//
// MIDDLEWARE FLOW:
// ============================================
// Request
//   ↓
// Middleware 1 (CORS) → next()
//   ↓
// Middleware 2 (Body Parser) → next()
//   ↓
// Middleware 3 (Auth - THIS FILE) → next()
//   ↓
// Route Handler (Controller)
//   ↓
// Response
//
// TYPES OF MIDDLEWARE:
// ============================================
// 1. APPLICATION-LEVEL: Runs for every request
//    Example: CORS, body parser, request logger
//
// 2. ROUTE-LEVEL: Runs for specific routes
//    Example: Authentication middleware (this file)
//    Usage: router.get('/profile', authMiddleware, controller)
//
// 3. ERROR HANDLING: Runs when error occurs
//    Example: Global error handler
//
// WHAT THIS MIDDLEWARE DOES:
// ============================================
// This authentication middleware will:
// 1. Extract JWT token from Authorization header
// 2. Verify the token is valid (not expired, signature matches)
// 3. Extract user data from token payload
// 4. Attach user data to req.user
// 5. Call next() to continue to route handler
//
// If token is invalid/missing:
// - Return 401 Unauthorized error
// - Stop request from reaching route handler
//
// PROTECTED ROUTES:
// ============================================
// Routes that require authentication use this middleware:
//
// router.get('/profile', verifyToken, getProfile);
//                          ↑
//                    This middleware
//
// Without valid token → 401 Unauthorized
// With valid token → Request continues to getProfile controller

/**
 * Verify JWT Token Middleware
 * 
 * This middleware function verifies JWT tokens in incoming requests.
 * It extracts the token from the Authorization header, verifies it,
 * and attaches user data to req.user for use in route handlers.
 * 
 * @param {Object} req - Express request object
 *   - req.headers.authorization: JWT token in "Bearer <token>" format
 * 
 * @param {Object} res - Express response object
 *   - Used to send error responses if token is invalid
 * 
 * @param {Function} next - Express next function
 *   - Call next() to pass control to next middleware/route handler
 *   - Call next(error) to pass error to error handler
 * 
 * @example
 * // Usage in routes:
 * router.get('/profile', verifyToken, getProfile);
 * 
 * // If token is valid:
 * // - req.user is set with user data
 * // - Request continues to getProfile controller
 * 
 * // If token is invalid:
 * // - Returns 401 Unauthorized
 * // - Request stops, doesn't reach getProfile
 */
const verifyToken = (req, res, next) => {
    // ============================================
    // Step 1: Extract token from headers
    // ============================================
    // The JWT token is sent in the Authorization header
    // Format: "Bearer <token>"
    // Example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    //
    // HOW IT WORKS:
    // 1. Get Authorization header from req.headers.authorization
    // 2. Check if header exists and starts with "Bearer "
    // 3. Split by space to separate "Bearer" from the token
    // 4. Get the second part (index 1) which is the actual token
    
    // Get the Authorization header
    const authHeader = req.headers.authorization;
    
    // Check if header exists and has the correct format
    // We check for "Bearer " prefix to ensure proper format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // If no header or wrong format, return 401 Unauthorized
        // We don't call next() because we're ending the request here
        return res.status(401).json({
            success: false,
            message: 'No token, authorization denied'
        });
    }
    
    // Extract the token by splitting the header string
    // "Bearer <token>" → split by space → ["Bearer", "<token>"]
    // Get the second element (index 1) which is the token
    const token = authHeader.split(' ')[1];
    
    // ============================================
    // Step 2: Check if token exists
    // ============================================
    // After extracting, verify that we actually got a token
    // This handles cases where header is "Bearer " with no token after it
    if (!token) {
        // If no token found, return 401 Unauthorized
        // We don't call next() because we're ending the request here
        return res.status(401).json({
            success: false,
            message: 'No token, authorization denied'
        });
    }
    
    // ============================================
    // Step 3: Verify token
    // ============================================
    // Use try-catch to handle verification errors
    // jwt.verify() can throw errors if token is invalid or expired
    try {
        // Verify the token using jwt.verify()
        // Parameters:
        // 1. token: The JWT token to verify
        // 2. process.env.JWT_SECRET: The secret key used to sign the token
        // 
        // WHAT jwt.verify() DOES:
        // - Verifies the token signature (ensures it wasn't tampered with)
        // - Checks if token has expired
        // - Returns the decoded payload if valid
        // - Throws an error if invalid or expired
        //
        // DECODED PAYLOAD:
        // Contains the data we put in when creating the token (in authController)
        // Example: { id: 1, email: "john@example.com", role: "user", iat: 1234567890, exp: 1234567890 }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // ============================================
        // Step 4: Attach user to request
        // ============================================
        // Attach the decoded token data to req.user
        // This makes user data available in route handlers and controllers
        // Controllers can access: req.user.id, req.user.email, req.user.role
        req.user = decoded;
        
        // ============================================
        // Step 5: Continue to next middleware/controller
        // ============================================
        // Call next() to pass control to the next middleware or route handler
        // This allows the request to continue to the protected route
        // Without next(), the request would hang and never complete
        next();
        
    } catch (error) {
        // ============================================
        // Error Handling
        // ============================================
        // If token verification fails, jwt.verify() throws an error
        // Common errors:
        // - JsonWebTokenError: Token is malformed or signature is invalid
        // - TokenExpiredError: Token has expired
        // - NotBeforeError: Token is not yet valid
        //
        // We catch all these errors and return a generic error message
        // This prevents attackers from knowing why the token failed
        return res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};

/**
 * Role-based access control (RBAC) middleware
 *
 * @param {string[]} allowedRoles - Array of roles permitted to access the route
 * @returns {(req, res, next) => void}
 *
 * Usage example:
 * router.get('/admin-only', verifyToken, checkRole(['admin']), adminController);
 */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

// ============================================
// Export Middleware Function
// ============================================
// Export the verifyToken function so it can be used in routes
// Usage in routes: const { verifyToken } = require('../middleware/authMiddleware');
module.exports = {
    verifyToken,
    checkRole
};

