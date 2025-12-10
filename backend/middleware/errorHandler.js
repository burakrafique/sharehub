// ============================================
// ShareHub Backend - Global Error Handler Middleware
// ============================================
// This middleware provides centralized error handling for all API endpoints
// It should be the last middleware in the Express app (after all routes)

// ============================================
// WHAT IS MIDDLEWARE?
// ============================================
// Middleware are functions that execute during the request-response cycle
// They can:
// - Execute code
// - Modify request/response objects
// - End the request-response cycle
// - Call the next middleware in the stack
//
// Error handling middleware is special - it has 4 parameters instead of 3
// Express automatically recognizes it as an error handler

// ============================================
// HOW ERROR HANDLERS WORK IN EXPRESS
// ============================================
// 1. When an error occurs in your route/controller, call next(error)
//    Example: next(new Error('Something went wrong'))
//
// 2. Express skips all regular middleware and jumps to error handlers
//
// 3. Error handler receives the error and formats a proper response
//
// 4. Client receives a JSON error response instead of crashing
//
// EXAMPLE USAGE IN ROUTE:
// ============================================
// app.get('/api/users/:id', async (req, res, next) => {
//     try {
//         const user = await getUserById(req.params.id);
//         if (!user) {
//             const error = new Error('User not found');
//             error.statusCode = 404;
//             return next(error);  // Pass error to error handler
//         }
//         res.json({ success: true, data: user });
//     } catch (error) {
//         next(error);  // Pass caught error to error handler
//     }
// });

// ============================================
// HTTP STATUS CODES MEANING
// ============================================
// Status codes tell the client what happened with their request
//
// 200-299: Success (200 OK, 201 Created)
// 300-399: Redirection (301 Moved, 304 Not Modified)
// 400-499: Client Error (your fault - bad request, unauthorized, not found)
// 500-599: Server Error (server's fault - internal error, database error)
//
// Common Status Codes:
// - 400 Bad Request: Client sent invalid data (validation errors, duplicate entries)
// - 401 Unauthorized: Authentication required or invalid token
// - 403 Forbidden: Authenticated but not authorized (wrong permissions)
// - 404 Not Found: Resource doesn't exist
// - 409 Conflict: Resource conflict (duplicate entry)
// - 500 Internal Server Error: Server-side error (database, code bug)

/**
 * Global Error Handler Middleware
 * 
 * This function handles all types of errors that can occur in the application:
 * - Database errors (MySQL)
 * - Authentication errors (JWT)
 * - Validation errors
 * - Custom application errors
 * - Unexpected server errors
 * 
 * @param {Error} err - The error object passed from previous middleware/routes
 * @param {Object} req - Express request object (contains request info)
 * @param {Object} res - Express response object (used to send response)
 * @param {Function} next - Express next function (required parameter, not used in error handlers)
 */
const errorHandler = (err, req, res, next) => {
    // Initialize default values
    let statusCode = err.statusCode || 500;  // Default to 500 (Internal Server Error)
    let message = err.message || 'Something went wrong';
    
    // ============================================
    // Handle MySQL Database Errors
    // ============================================
    // MySQL errors have a code property that identifies the error type
    // We check err.code to determine what kind of database error occurred
    
    // MySQL Error: Duplicate Entry (ER_DUP_ENTRY)
    // This happens when trying to insert a record that violates a UNIQUE constraint
    // Example: Trying to register with an email that already exists
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 400;  // Bad Request - client sent duplicate data
        
        // Extract field name from error message
        // MySQL error format: "Duplicate entry 'value' for key 'field_name'"
        const match = err.sqlMessage?.match(/for key '(.+?)'/);
        const field = match ? match[1] : 'field';
        
        message = `Record already exists. This ${field} is already in use.`;
    }
    
    // MySQL Error: Foreign Key Constraint (ER_NO_REFERENCED_ROW_2)
    // This happens when trying to reference a record that doesn't exist
    // Example: Creating an item with a user_id that doesn't exist in users table
    else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400;  // Bad Request - invalid reference
        message = 'Invalid reference. The referenced record does not exist.';
    }
    
    // MySQL Error: Cannot add foreign key constraint
    else if (err.code === 'ER_CANNOT_ADD_FOREIGN') {
        statusCode = 400;
        message = 'Invalid foreign key reference.';
    }
    
    // MySQL Error: Data too long for column
    else if (err.code === 'ER_DATA_TOO_LONG') {
        statusCode = 400;
        message = 'Data provided is too long for the field.';
    }
    
    // MySQL Error: Invalid default value
    else if (err.code === 'ER_INVALID_DEFAULT') {
        statusCode = 400;
        message = 'Invalid default value provided.';
    }
    
    // ============================================
    // Handle JWT (JSON Web Token) Errors
    // ============================================
    // JWT errors occur when:
    // - Token is missing
    // - Token is invalid/malformed
    // - Token has expired
    // - Token signature doesn't match
    
    // JWT Error: Invalid Token (JsonWebTokenError)
    // This happens when the token is malformed or signature is invalid
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;  // Unauthorized - invalid authentication token
        message = 'Invalid authentication token. Please login again.';
    }
    
    // JWT Error: Token Expired (TokenExpiredError)
    // This happens when the token's expiration time has passed
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;  // Unauthorized - token expired
        message = 'Authentication token has expired. Please login again.';
    }
    
    // JWT Error: Not Before (token not yet valid)
    else if (err.name === 'NotBeforeError') {
        statusCode = 401;
        message = 'Authentication token is not yet valid.';
    }
    
    // ============================================
    // Handle Validation Errors
    // ============================================
    // Validation errors come from express-validator or custom validation
    // They usually have an array of errors with field names and messages
    
    // Express-Validator errors
    // express-validator returns errors in a specific format
    else if (err.name === 'ValidationError' || Array.isArray(err.errors)) {
        statusCode = 400;  // Bad Request - validation failed
        
        // If it's an express-validator error array
        if (Array.isArray(err.errors)) {
            const firstError = err.errors[0];
            message = firstError.msg || 'Validation failed';
        } else {
            message = err.message || 'Validation failed. Please check your input.';
        }
    }
    
    // Mongoose validation errors (if you ever use MongoDB)
    else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid data format provided.';
    }
    
    // ============================================
    // Handle Custom Application Errors
    // ============================================
    // If error already has a statusCode, use it
    // This allows routes to set custom status codes
    // Example: const error = new Error('User not found'); error.statusCode = 404;
    
    // ============================================
    // Handle Default Server Errors
    // ============================================
    // If none of the above conditions match, it's an unexpected server error
    // In production, don't expose detailed error messages for security
    if (statusCode === 500 && process.env.NODE_ENV === 'production') {
        message = 'Internal Server Error. Please try again later.';
    }
    
    // ============================================
    // Log Error Details
    // ============================================
    // Logging errors helps with debugging and monitoring
    // In production, you might want to log to a file or external service
    console.error('\n' + '='.repeat(60));
    console.error('❌ ERROR OCCURRED');
    console.error('='.repeat(60));
    console.error('Timestamp:', new Date().toISOString());
    console.error('Method:', req.method);
    console.error('URL:', req.originalUrl);
    console.error('Status Code:', statusCode);
    console.error('Error Name:', err.name || 'Error');
    console.error('Error Code:', err.code || 'N/A');
    console.error('Error Message:', err.message);
    
    // Log stack trace in development (helps with debugging)
    if (process.env.NODE_ENV === 'development') {
        console.error('Stack Trace:');
        console.error(err.stack);
    }
    console.error('='.repeat(60) + '\n');
    
    // ============================================
    // Send Error Response to Client
    // ============================================
    // Always send a consistent JSON error response
    // This makes it easier for frontend to handle errors
    const errorResponse = {
        success: false,
        message: message,
        statusCode: statusCode
    };
    
    // Only include stack trace in development mode
    // Stack traces contain sensitive information (file paths, code structure)
    // Never expose them in production!
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        errorResponse.error = {
            name: err.name,
            code: err.code,
            message: err.message
        };
    }
    
    // Send the error response
    res.status(statusCode).json(errorResponse);
};

// ============================================
// Export Error Handler
// ============================================
// Export the function so it can be used in server.js
// Usage: app.use(errorHandler);
module.exports = errorHandler;

// ============================================
// DIFFERENT TYPES OF ERRORS EXPLAINED
// ============================================
//
// 1. DATABASE ERRORS:
//    - Occur when interacting with MySQL database
//    - Examples: duplicate entries, foreign key violations, connection errors
//    - Usually have err.code property (like 'ER_DUP_ENTRY')
//
// 2. AUTHENTICATION ERRORS:
//    - Occur when JWT token is invalid, expired, or missing
//    - Examples: JsonWebTokenError, TokenExpiredError
//    - Usually have err.name property
//
// 3. VALIDATION ERRORS:
//    - Occur when user input doesn't meet requirements
//    - Examples: missing required fields, invalid email format, too short password
//    - Can come from express-validator or custom validation
//
// 4. APPLICATION ERRORS:
//    - Custom errors you create in your code
//    - Examples: "User not found", "Insufficient permissions"
//    - Usually have statusCode set manually
//
// 5. SERVER ERRORS:
//    - Unexpected errors that shouldn't happen
//    - Examples: null pointer exceptions, undefined function calls
//    - Usually indicate a bug in your code
//
// ============================================
// BEST PRACTICES
// ============================================
// 1. Always use try/catch in async functions
// 2. Call next(error) to pass errors to error handler
// 3. Set appropriate status codes for different error types
// 4. Don't expose sensitive information in error messages
// 5. Log errors for debugging and monitoring
// 6. Return consistent error response format
// 7. Use validation libraries to catch errors early

