// ============================================
// ShareHub Backend - Authentication Controller
// ============================================
// This file handles authentication-related business logic
// Controllers are part of the APPLICATION TIER (business logic layer)

// ============================================
// WHAT ARE CONTROLLERS?
// ============================================
// Controllers are the middle layer between Routes and Models in MVC architecture:
//
// 1. ROUTES: Define API endpoints (URLs) and map them to controller functions
// 2. CONTROLLERS (this file): Handle business logic, validation, and orchestration
// 3. MODELS: Handle database operations (SQL queries)
//
// CONTROLLER RESPONSIBILITIES:
// - Receive HTTP requests from routes
// - Validate and sanitize user input
// - Apply business rules (password hashing, token generation)
// - Call model functions to interact with database
// - Format and send HTTP responses
// - Handle errors and edge cases
//
// WHAT CONTROLLERS DO NOT DO:
// - Direct database queries (that's the model's job)
// - Define routes (that's routes files)
// - Render HTML (that's the frontend's job)
//
// EXAMPLE FLOW:
// ============================================
// 1. Client sends POST /api/auth/register → Route receives it
// 2. Route calls authController.register() → Controller function executes
// 3. Controller validates input → Checks if required fields exist
// 4. Controller calls User.findByEmail() → Model checks database
// 5. Controller hashes password → Business logic (bcrypt)
// 6. Controller calls User.create() → Model inserts into database
// 7. Controller generates JWT token → Business logic (jsonwebtoken)
// 8. Controller sends response → Client receives success/error

// ============================================
// Import Required Packages
// ============================================
const bcrypt = require('bcryptjs');              // Password hashing library
const jwt = require('jsonwebtoken');             // JWT token generation library
const User = require('../models/User');          // User model for database operations

// ============================================
// HTTP STATUS CODES EXPLAINED
// ============================================
// Status codes tell the client what happened with their request
//
// 200 OK:
//   - Request was successful
//   - Used for GET, PUT, DELETE operations
//   - Example: "User profile retrieved successfully"
//
// 201 Created:
//   - Request was successful AND a new resource was created
//   - Used for POST operations that create new records
//   - Example: "User account created successfully"
//   - Indicates the server created a new resource
//
// 400 Bad Request:
//   - Client sent invalid data
//   - Used for validation errors, missing fields, duplicate entries
//   - Example: "Email is required" or "User already exists"
//   - Client needs to fix their request
//
// 401 Unauthorized:
//   - Authentication required or failed
//   - Used when login fails, token is invalid/expired
//   - Example: "Invalid email or password"
//
// 404 Not Found:
//   - Resource doesn't exist
//   - Example: "User not found"
//
// 500 Internal Server Error:
//   - Server-side error (database error, code bug)
//   - Client can't fix this, it's the server's problem

// ============================================
// PASSWORD HASHING WITH BCRYPT
// ============================================
// WHAT IS PASSWORD HASHING?
// Password hashing converts a plain text password into an irreversible string
// using a one-way mathematical function. You can't reverse it to get the original password.
//
// WHY DO WE HASH PASSWORDS?
// - Security: If database is compromised, attackers can't see real passwords
// - Privacy: Even database admins can't see user passwords
// - Best Practice: Industry standard for password storage
//
// HOW BCRYPT WORKS:
// ============================================
// 1. Takes plain password: "mypassword123"
// 2. Generates random "salt" (extra random data)
// 3. Combines password + salt
// 4. Hashes the combination multiple times
// 5. Returns hash: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
//
// SALT ROUNDS (10 in our case):
// - Number of times the hash function is applied
// - Higher = more secure but slower
// - 10 rounds = good balance (takes ~100ms to hash)
// - Each round doubles the computation time
//
// EXAMPLE:
// ============================================
// Input:  "mypassword123"
// Output: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
//         ^^^^ ^^
//         |||| ||-- Salt rounds (10)
//         |||| |--- Algorithm version
//         |||| ---- Algorithm identifier
//
// VERIFICATION:
// - To check if password is correct, use bcrypt.compare()
// - It hashes the input password with the same salt
// - Compares the hashes (not the passwords directly)
//
// NEVER DO THIS:
// ❌ Store passwords in plain text
// ❌ Use MD5 or SHA1 (too fast, easily cracked)
// ✅ Always use bcrypt or similar (slow, secure)

// ============================================
// JWT (JSON WEB TOKEN) EXPLAINED
// ============================================
// WHAT IS A JWT TOKEN?
// A JWT is a secure way to transmit information between parties
// It's a string that contains encoded data about the user
//
// JWT STRUCTURE:
// ============================================
// Header.Payload.Signature
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIn0.signature
//
// 1. HEADER: Algorithm and token type
//    {"alg": "HS256", "typ": "JWT"}
//
// 2. PAYLOAD: Data about the user (what we put in)
//    {"id": 1, "email": "john@example.com", "role": "user", "iat": 1234567890, "exp": 1234567890}
//    - id: User's ID (for database lookups)
//    - email: User's email (for identification)
//    - role: User's role (for authorization)
//    - iat: Issued at (timestamp)
//    - exp: Expires at (timestamp)
//
// 3. SIGNATURE: Verifies token hasn't been tampered with
//    HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
//
// HOW JWT WORKS:
// ============================================
// 1. User logs in → Server generates JWT with user data
// 2. Server sends JWT to client → Client stores it (localStorage/cookie)
// 3. Client sends JWT with every request → In Authorization header
// 4. Server verifies JWT → Checks signature and expiration
// 5. Server extracts user data → Uses it to identify the user
//
// WHY USE JWT?
// - Stateless: Server doesn't need to store sessions
// - Secure: Signature prevents tampering
// - Portable: Works across different servers/services
// - Standard: Industry standard for authentication
//
// SECURITY NOTES:
// - Never put sensitive data in JWT (it's encoded, not encrypted)
// - Always use HTTPS in production
// - Set reasonable expiration times (7 days in our case)
// - Store JWT_SECRET securely (in .env file)

/**
 * Register a new user account
 * 
 * This function handles user registration:
 * 1. Validates required fields
 * 2. Checks if email already exists
 * 3. Hashes the password
 * 4. Creates the user in database
 * 5. Generates JWT token
 * 6. Returns token and user data
 * 
 * @param {Object} req - Express request object
 *   - req.body.name: User's full name
 *   - req.body.email: User's email address
 *   - req.body.password: User's plain text password (will be hashed)
 *   - req.body.phone: User's phone number
 *   - req.body.role: User role ('user' or 'ngo')
 *   - req.body.address: User's address (optional)
 *   - req.body.latitude: Latitude coordinate (optional)
 *   - req.body.longitude: Longitude coordinate (optional)
 * 
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function (for error handling)
 * 
 * @returns {Object} JSON response with:
 *   - success: true
 *   - token: JWT token for authentication
 *   - user: User data (without password_hash)
 * 
 * @example
 * POST /api/auth/register
 * Body: {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "mypassword123",
 *   "phone": "+1234567890",
 *   "role": "user"
 * }
 */
const register = async (req, res, next) => {
    try {
        // ============================================
        // Step 1: Extract data from request body
        // ============================================
        // req.body contains the JSON data sent by the client
        // We extract each field we need
        const { name, email, password, phone, role, address, latitude, longitude } = req.body;
        
        // ============================================
        // Step 2: Validate required fields
        // ============================================
        // Check if all required fields are provided
        // If any are missing, return 400 Bad Request
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, password, phone'
            });
        }
        
        // ============================================
        // Step 3: Check if user already exists
        // ============================================
        // We don't want duplicate email addresses
        // Call the User model to check the database
        const existingUser = await User.findByEmail(email);
        
        // If user exists, return error (don't create duplicate)
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email address'
            });
        }
        
        // ============================================
        // Step 4: Hash the password
        // ============================================
        // NEVER store plain text passwords!
        // bcrypt.hash() takes the password and salt rounds (10)
        // Returns a hashed string that can't be reversed
        // This operation takes ~100ms (intentionally slow for security)
        const password_hash = await bcrypt.hash(password, 10);
        
        // ============================================
        // Step 5: Create user in database
        // ============================================
        // Call the User model's create() method
        // Pass all user data including the hashed password
        // The model handles the SQL INSERT query
        const result = await User.create({
            name,
            email,
            password_hash,  // Hashed password, not plain text!
            phone,
            role: role || 'user',  // Default to 'user' if not provided
            address: address || null,
            latitude: latitude || null,
            longitude: longitude || null
        });
        
        // result contains: { insertId, user }
        // user contains the complete user data from database
        
        // ============================================
        // Step 6: Generate JWT token
        // ============================================
        // Create a token containing user identification data
        // This token will be used for authentication in future requests
        const token = jwt.sign(
            {
                id: result.user.id,           // User ID for database lookups
                email: result.user.email,      // User email for identification
                role: result.user.role         // User role for authorization
            },
            process.env.JWT_SECRET,            // Secret key from .env file
            {
                expiresIn: '7d'               // Token expires in 7 days
            }
        );
        
        // ============================================
        // Step 7: Prepare user data for response
        // ============================================
        // Create a clean user object WITHOUT password_hash
        // Never send password hashes to clients (security risk)
        const userResponse = {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            phone: result.user.phone,
            role: result.user.role,
            address: result.user.address,
            latitude: result.user.latitude,
            longitude: result.user.longitude,
            created_at: result.user.created_at
            // Note: password_hash is NOT included!
        };
        
        // ============================================
        // Step 8: Send success response
        // ============================================
        // Return 201 Created status (new resource was created)
        // Include the JWT token and user data
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token: token,           // JWT token for authentication
            user: userResponse      // User data (without password)
        });
        
    } catch (error) {
        // ============================================
        // Error Handling
        // ============================================
        // If any error occurs (database error, hashing error, etc.)
        // Pass it to the error handler middleware
        // The error handler will format and send the response
        next(error);
    }
};

/**
 * Login an existing user
 * 
 * This function handles user authentication:
 * 1. Validates email and password are provided
 * 2. Finds user by email in database
 * 3. Verifies password matches the stored hash
 * 4. Generates JWT token for authenticated user
 * 5. Returns token and user data
 * 
 * @param {Object} req - Express request object
 *   - req.body.email: User's email address
 *   - req.body.password: User's plain text password
 * 
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function (for error handling)
 * 
 * @returns {Object} JSON response with:
 *   - success: true
 *   - token: JWT token for authentication
 *   - user: User data (without password_hash)
 * 
 * @example
 * POST /api/auth/login
 * Body: {
 *   "email": "john@example.com",
 *   "password": "mypassword123"
 * }
 */
const login = async (req, res, next) => {
    try {
        // ============================================
        // Step 1: Extract data from request body
        // ============================================
        // req.body contains the JSON data sent by the client
        // We only need email and password for login
        const { email, password } = req.body;
        
        // ============================================
        // Step 2: Validate required fields
        // ============================================
        // Check if both email and password are provided
        // If any are missing, return 400 Bad Request
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password'
            });
        }
        
        // ============================================
        // Step 3: Find user by email
        // ============================================
        // Call the User model to search for the user in database
        // This will return the user object if found, or null if not found
        const user = await User.findByEmail(email);
        
        // ============================================
        // Step 4: Check if user exists
        // ============================================
        // SECURITY NOTE: We don't reveal if email exists or not
        // If user doesn't exist, we still check password (even though it will fail)
        // This prevents attackers from discovering which emails are registered
        // We return the same error message for both cases: "Invalid credentials"
        //
        // WHY THIS MATTERS:
        // - If we said "Email not found", attackers could enumerate valid emails
        // - If we said "Wrong password", attackers would know the email exists
        // - Same error message for both = better security
        if (!user) {
            // User doesn't exist, but we don't reveal this
            // We still "check" the password (which will fail) to maintain timing consistency
            // This makes it harder for attackers to determine if email exists
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'  // Generic message (doesn't reveal if email exists)
            });
        }
        
        // ============================================
        // Step 5: Compare password with hash
        // ============================================
        // HOW BCRYPT.COMPARE() WORKS:
        // ============================================
        // bcrypt.compare() takes two parameters:
        // 1. Plain text password (from user input)
        // 2. Hashed password (from database)
        //
        // INTERNALLY:
        // 1. Extracts the salt from the stored hash
        // 2. Hashes the plain password with the same salt
        // 3. Compares the two hashes
        // 4. Returns true if they match, false otherwise
        //
        // WHY WE CAN'T JUST COMPARE STRINGS:
        // - Each hash includes a unique salt
        // - Same password hashed twice = different hashes (different salts)
        // - We need bcrypt.compare() to extract salt and compare correctly
        //
        // EXAMPLE:
        // ============================================
        // Stored hash: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
        // User input: "mypassword123"
        // bcrypt.compare("mypassword123", "$2a$10$N9qo8uLOickgx2ZMRZoMye...")
        //   → Extracts salt from hash
        //   → Hashes "mypassword123" with that salt
        //   → Compares: true (passwords match) or false (don't match)
        //
        // SECURITY:
        // - Takes ~100ms (intentionally slow to prevent brute force attacks)
        // - Constant-time comparison (prevents timing attacks)
        // - Handles all edge cases automatically
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        
        // ============================================
        // Step 6: Verify password is correct
        // ============================================
        // If password doesn't match, return 401 Unauthorized
        // We use the same generic message as when user doesn't exist
        // This prevents attackers from knowing if email exists or password is wrong
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'  // Generic message (doesn't reveal which is wrong)
            });
        }
        
        // ============================================
        // Step 7: Generate JWT token
        // ============================================
        // Create a token containing user identification data
        // Same process as in register function
        // This token will be used for authentication in future requests
        const token = jwt.sign(
            {
                id: user.id,           // User ID for database lookups
                email: user.email,      // User email for identification
                role: user.role         // User role for authorization
            },
            process.env.JWT_SECRET,     // Secret key from .env file
            {
                expiresIn: '7d'        // Token expires in 7 days
            }
        );
        
        // ============================================
        // Step 8: Prepare user data for response
        // ============================================
        // Create a clean user object WITHOUT password_hash
        // Never send password hashes to clients (security risk)
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            address: user.address,
            latitude: user.latitude,
            longitude: user.longitude,
            created_at: user.created_at
            // Note: password_hash is NOT included!
        };
        
        // ============================================
        // Step 9: Send success response
        // ============================================
        // Return 200 OK status (request was successful)
        // Include the JWT token and user data
        // Note: We use 200 (not 201) because we're not creating a new resource
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,           // JWT token for authentication
            user: userResponse      // User data (without password)
        });
        
    } catch (error) {
        // ============================================
        // Error Handling
        // ============================================
        // If any error occurs (database error, hashing error, etc.)
        // Pass it to the error handler middleware
        // The error handler will format and send the response
        next(error);
    }
};

/**
 * Get authenticated user's profile
 * 
 * This function retrieves the current user's profile information.
 * The user must be authenticated (JWT token verified by auth middleware).
 * The user ID is extracted from req.user (set by authentication middleware).
 * 
 * @param {Object} req - Express request object
 *   - req.user.id: User ID (set by authentication middleware after JWT verification)
 * 
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function (for error handling)
 * 
 * @returns {Object} JSON response with:
 *   - success: true
 *   - user: User data (without password_hash)
 * 
 * @example
 * GET /api/auth/profile
 * Headers: {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
const getProfile = async (req, res, next) => {
    try {
        // ============================================
        // Step 1: Get user ID from request
        // ============================================
        // req.user is set by the authentication middleware
        // The middleware verifies the JWT token and extracts user data
        // It then attaches the user data to req.user
        // 
        // HOW IT WORKS:
        // 1. Client sends request with JWT token in Authorization header
        // 2. Auth middleware verifies token and extracts payload (id, email, role)
        // 3. Auth middleware calls User.findById() to get full user data
        // 4. Auth middleware sets req.user = user object
        // 5. Controller can now access req.user.id
        const userId = req.user.id;
        
        // ============================================
        // Step 2: Find user in database
        // ============================================
        // Call the User model to get the complete user data
        // We fetch from database to ensure we have the latest data
        // (user might have updated their profile since token was issued)
        const user = await User.findById(userId);
        
        // ============================================
        // Step 3: Check if user exists
        // ============================================
        // This should rarely happen, but it's possible if:
        // - User was deleted after token was issued
        // - Database was reset
        // - Token contains invalid user ID
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // ============================================
        // Step 4: Prepare user data for response
        // ============================================
        // Create a clean user object WITHOUT password_hash
        // Never send password hashes to clients (security risk)
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            address: user.address,
            latitude: user.latitude,
            longitude: user.longitude,
            created_at: user.created_at
            // Note: password_hash is NOT included!
        };
        
        // ============================================
        // Step 5: Send success response
        // ============================================
        // Return 200 OK status (request was successful)
        // Include the user data
        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            user: userResponse
        });
        
    } catch (error) {
        // ============================================
        // Error Handling
        // ============================================
        // If any error occurs (database error, etc.)
        // Pass it to the error handler middleware
        // The error handler will format and send the response
        next(error);
    }
};

// ============================================
// Export Controller Functions
// ============================================
// Export all three functions so they can be used in routes
// Usage in routes: const { register, login, getProfile } = require('../controllers/authController');
module.exports = {
    register,
    login,
    getProfile
};

// ============================================
// COMPREHENSIVE GUIDE: CONTROLLERS IN MVC ARCHITECTURE
// ============================================
// 
// WHAT ARE CONTROLLERS?
// ============================================
// Controllers are the middle layer in MVC (Model-View-Controller) architecture.
// They act as the "brain" of your application, coordinating between:
//
// 1. ROUTES (Presentation Layer):
//    - Define API endpoints (URLs like /api/auth/register)
//    - Map HTTP methods (GET, POST, PUT, DELETE) to controller functions
//    - Handle URL parameters and query strings
//
// 2. CONTROLLERS (Application/Business Logic Layer - THIS FILE):
//    - Receive HTTP requests from routes
//    - Validate and sanitize user input
//    - Apply business rules (password hashing, token generation, calculations)
//    - Call model functions to interact with database
//    - Format and send HTTP responses
//    - Handle errors and edge cases
//
// 3. MODELS (Data Access Layer):
//    - Handle database operations (SQL queries)
//    - Interact with MySQL database
//    - Return raw data from database
//    - No business logic, just data retrieval/storage
//
// CONTROLLER RESPONSIBILITIES:
// ============================================
// ✅ VALIDATION: Check if required fields are provided
// ✅ BUSINESS LOGIC: Hash passwords, generate tokens, calculate prices
// ✅ ORCHESTRATION: Coordinate multiple model calls
// ✅ RESPONSE FORMATTING: Structure data for client
// ✅ ERROR HANDLING: Catch and handle errors gracefully
//
// CONTROLLERS DO NOT:
// ============================================
// ❌ Execute SQL queries directly (that's the model's job)
// ❌ Define routes (that's routes files)
// ❌ Render HTML (that's the frontend's job)
// ❌ Store business logic in models (separation of concerns)
//
// EXAMPLE FLOW:
// ============================================
// 1. Client → POST /api/auth/register → Route receives request
// 2. Route → Calls authController.register() → Controller function executes
// 3. Controller → Validates input → Checks if fields exist
// 4. Controller → Calls User.findByEmail() → Model checks database
// 5. Controller → Hashes password → Business logic (bcrypt)
// 6. Controller → Calls User.create() → Model inserts into database
// 7. Controller → Generates JWT token → Business logic (jsonwebtoken)
// 8. Controller → Sends response → Client receives success/error
//
// WHY SEPARATION MATTERS:
// ============================================
// - MAINTAINABILITY: Easy to find and fix bugs
// - TESTABILITY: Can test controllers and models separately
// - REUSABILITY: Model methods can be used by multiple controllers
// - CLARITY: Clear responsibility for each layer
// - FLEXIBILITY: Can change database without changing business logic

// ============================================
// PASSWORD HASHING SECURITY
// ============================================
// 
// WHY HASH PASSWORDS?
// ============================================
// Password hashing is CRITICAL for security. Here's why:
//
// 1. DATABASE SECURITY:
//    - If database is compromised, attackers can't see real passwords
//    - Even database admins can't see user passwords
//    - Protects users who reuse passwords on other sites
//
// 2. PRIVACY:
//    - Users trust you with their passwords
//    - You have a responsibility to protect them
//    - Legal requirement in many jurisdictions (GDPR, etc.)
//
// 3. BEST PRACTICE:
//    - Industry standard for password storage
//    - Required by security audits
//    - Prevents password theft
//
// HOW BCRYPT WORKS:
// ============================================
// bcrypt is a password hashing function designed by security experts.
//
// PROCESS:
// 1. Takes plain password: "mypassword123"
// 2. Generates random "salt" (unique random data)
// 3. Combines password + salt
// 4. Hashes the combination multiple times (10 rounds = 2^10 = 1024 iterations)
// 5. Returns hash: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
//
// SALT ROUNDS (10 in our case):
// - Number of times the hash function is applied
// - Higher = more secure but slower
// - 10 rounds = good balance (takes ~100ms to hash)
// - Each round doubles the computation time
// - Recommended: 10-12 rounds
//
// WHY SALT MATTERS:
// - Without salt: Same password = same hash (vulnerable to rainbow tables)
// - With salt: Same password = different hash (unique salt per user)
// - Makes pre-computed attack tables useless
//
// VERIFICATION:
// - Use bcrypt.compare(plainPassword, hashedPassword)
// - Extracts salt from stored hash
// - Hashes plain password with same salt
// - Compares the two hashes
// - Returns true if match, false otherwise
//
// SECURITY FEATURES:
// - Intentionally slow (~100ms) to prevent brute force attacks
// - Constant-time comparison prevents timing attacks
// - Handles all edge cases automatically
// - Industry-proven and battle-tested
//
// NEVER DO THIS:
// ============================================
// ❌ Store passwords in plain text
// ❌ Use MD5 or SHA1 (too fast, easily cracked)
// ❌ Use SHA256 for passwords (designed for data integrity, not passwords)
// ❌ Send password hashes to clients
// ✅ Always use bcrypt or similar (Argon2, scrypt)

// ============================================
// JWT (JSON WEB TOKEN) BASICS
// ============================================
// 
// WHAT IS A JWT?
// ============================================
// JWT is a secure way to transmit information between parties.
// It's a string that contains encoded data about the user.
//
// JWT STRUCTURE:
// ============================================
// Header.Payload.Signature
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIn0.signature
//
// 1. HEADER:
//    - Algorithm used (HS256 = HMAC SHA256)
//    - Token type (JWT)
//    Example: {"alg": "HS256", "typ": "JWT"}
//
// 2. PAYLOAD (Claims):
//    - User data we put in (id, email, role)
//    - Standard claims (iat = issued at, exp = expires at)
//    Example: {"id": 1, "email": "john@example.com", "role": "user", "iat": 1234567890, "exp": 1234567890}
//
// 3. SIGNATURE:
//    - Verifies token hasn't been tampered with
//    - Created using: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
//    - Only server with secret can create/verify valid tokens
//
// HOW JWT AUTHENTICATION WORKS:
// ============================================
// 1. USER LOGS IN:
//    - Client sends email + password
//    - Server verifies credentials
//    - Server generates JWT with user data
//    - Server sends JWT to client
//
// 2. CLIENT STORES TOKEN:
//    - Client stores JWT (localStorage, sessionStorage, or cookie)
//    - Token is sent with every authenticated request
//
// 3. CLIENT SENDS REQUESTS:
//    - Client includes JWT in Authorization header: "Bearer <token>"
//    - Server receives request with token
//
// 4. SERVER VERIFIES TOKEN:
//    - Server extracts token from header
//    - Server verifies signature (ensures token wasn't tampered with)
//    - Server checks expiration (ensures token is still valid)
//    - Server extracts user data from payload
//
// 5. SERVER PROCESSES REQUEST:
//    - Server uses user data from token
//    - Server can look up user in database if needed
//    - Server processes request and sends response
//
// WHY USE JWT?
// ============================================
// ✅ STATELESS: Server doesn't need to store sessions
// ✅ SCALABLE: Works across multiple servers (no shared session store needed)
// ✅ PORTABLE: Works across different services/microservices
// ✅ STANDARD: Industry standard for authentication
// ✅ SECURE: Signature prevents tampering
//
// SECURITY NOTES:
// ============================================
// ⚠️ JWT is ENCODED, not ENCRYPTED (can be decoded, but signature prevents tampering)
// ⚠️ Don't put sensitive data in JWT (anyone can decode it)
// ⚠️ Always use HTTPS in production
// ⚠️ Set reasonable expiration times (7 days in our case)
// ⚠️ Store JWT_SECRET securely (in .env file, never commit to git)
// ⚠️ Use strong, random JWT_SECRET (at least 32 characters)
//
// TOKEN EXPIRATION:
// - Short expiration = more secure but requires frequent re-login
// - Long expiration = less secure but better user experience
// - 7 days = good balance for most applications
// - Refresh tokens can extend this for better UX

// ============================================
// HTTP STATUS CODES EXPLAINED
// ============================================
// 
// Status codes are 3-digit numbers that tell the client what happened with their request.
// They're grouped into categories:
//
// 200-299: SUCCESS
// ============================================
// 200 OK:
//   - Request was successful
//   - Used for GET, PUT, DELETE operations
//   - Example: "User profile retrieved successfully"
//   - Example: "User updated successfully"
//
// 201 Created:
//   - Request was successful AND a new resource was created
//   - Used for POST operations that create new records
//   - Example: "User account created successfully"
//   - Indicates the server created a new resource
//   - Response should include location of new resource (optional)
//
// 204 No Content:
//   - Request was successful but no content to return
//   - Used for DELETE operations
//
// 300-399: REDIRECTION
// ============================================
// 301 Moved Permanently:
//   - Resource has moved to a new location
//
// 304 Not Modified:
//   - Resource hasn't changed since last request
//   - Used for caching
//
// 400-499: CLIENT ERRORS (Client's fault)
// ============================================
// 400 Bad Request:
//   - Client sent invalid data
//   - Used for validation errors, missing fields, duplicate entries
//   - Example: "Email is required"
//   - Example: "User already exists"
//   - Client needs to fix their request
//
// 401 Unauthorized:
//   - Authentication required or failed
//   - Used when login fails, token is invalid/expired
//   - Example: "Invalid email or password"
//   - Example: "Authentication token required"
//   - Client needs to authenticate
//
// 403 Forbidden:
//   - Authenticated but not authorized (wrong permissions)
//   - Example: "You don't have permission to access this resource"
//   - Different from 401: user is authenticated but lacks permission
//
// 404 Not Found:
//   - Resource doesn't exist
//   - Example: "User not found"
//   - Example: "Route not found"
//   - Client requested something that doesn't exist
//
// 409 Conflict:
//   - Resource conflict (duplicate entry, concurrent modification)
//   - Example: "Email already exists"
//
// 422 Unprocessable Entity:
//   - Request is well-formed but semantically incorrect
//   - Used for validation errors with detailed field errors
//
// 500-599: SERVER ERRORS (Server's fault)
// ============================================
// 500 Internal Server Error:
//   - Server-side error (database error, code bug)
//   - Client can't fix this, it's the server's problem
//   - Should be logged and investigated
//
// 502 Bad Gateway:
//   - Server acting as gateway received invalid response
//
// 503 Service Unavailable:
//   - Server is temporarily unavailable (maintenance, overload)
//
// CHOOSING THE RIGHT STATUS CODE:
// ============================================
// - 200: Successful GET, PUT, DELETE
// - 201: Successful POST that creates resource
// - 400: Client sent bad data (validation errors)
// - 401: Authentication failed or required
// - 403: Authenticated but not authorized
// - 404: Resource doesn't exist
// - 500: Server error (database, code bug)

// ============================================
// WHY WE USE TRY-CATCH
// ============================================
// 
// WHAT IS TRY-CATCH?
// ============================================
// try-catch is JavaScript's error handling mechanism.
// It allows you to "catch" errors that occur in your code and handle them gracefully.
//
// SYNTAX:
// ============================================
// try {
//     // Code that might throw an error
//     const user = await User.findById(id);
// } catch (error) {
//     // Code to handle the error
//     console.error('Error:', error);
//     next(error);  // Pass to error handler
// }
//
// WHY WE NEED IT:
// ============================================
// 1. PREVENT CRASHES:
//    - Without try-catch, errors crash the entire application
//    - With try-catch, we can handle errors gracefully
//    - Server continues running even if one request fails
//
// 2. USER-FRIENDLY ERRORS:
//    - Instead of crashing, we send a proper error response
//    - User sees: "Something went wrong" instead of blank page
//    - Better user experience
//
// 3. DEBUGGING:
//    - We can log errors for debugging
//    - We can see what went wrong and where
//    - Helps fix bugs faster
//
// 4. ERROR HANDLING:
//    - We can format errors consistently
//    - We can send appropriate HTTP status codes
//    - We can provide helpful error messages
//
// WHAT CAN GO WRONG?
// ============================================
// - Database connection errors
// - SQL query errors (syntax, constraint violations)
// - Network errors
// - Invalid input data
// - Missing environment variables
// - File system errors
// - Third-party API errors
//
// HOW WE HANDLE ERRORS:
// ============================================
// 1. TRY BLOCK:
//    - Contains the main code that might fail
//    - If error occurs, execution jumps to catch block
//
// 2. CATCH BLOCK:
//    - Catches any errors thrown in try block
//    - Receives error object with details
//    - Calls next(error) to pass to error handler middleware
//
// 3. ERROR HANDLER MIDDLEWARE:
//    - Receives error from catch block
//    - Formats error response
//    - Sends appropriate HTTP status code
//    - Logs error for debugging
//
// EXAMPLE:
// ============================================
// try {
//     const user = await User.findById(id);  // Might throw error if database fails
//     if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ success: true, user });
// } catch (error) {
//     // If database error occurs, we catch it here
//     console.error('Database error:', error);
//     next(error);  // Pass to error handler middleware
// }
//
// BEST PRACTICES:
// ============================================
// ✅ Always use try-catch in async functions
// ✅ Always call next(error) in catch block
// ✅ Don't swallow errors silently
// ✅ Log errors for debugging
// ✅ Provide helpful error messages
// ✅ Use error handler middleware for consistent formatting
// ❌ Don't catch errors and do nothing
// ❌ Don't expose sensitive error details to clients
// ❌ Don't catch errors you can't handle


