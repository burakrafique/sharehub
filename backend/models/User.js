// ============================================
// ShareHub Backend - User Model
// ============================================
// This file is part of the DATA ACCESS LAYER
// It contains ONLY database queries (SQL) for the users table
// NO business logic, NO validation, NO password hashing here!

// ============================================
// Import Database Connection Pool
// ============================================
// We import the promisePool from our database configuration
// This gives us access to execute SQL queries against the MySQL database
const { promisePool } = require('../config/database');

// ============================================
// WHAT ARE MODELS IN MVC ARCHITECTURE?
// ============================================
// MVC stands for Model-View-Controller, a software design pattern
// that separates an application into three interconnected components:
//
// 1. MODEL (This file):
//    - Represents the DATA and DATABASE operations
//    - Contains ONLY SQL queries and database interactions
//    - Does NOT contain business logic or validation
//    - Does NOT know about HTTP requests/responses
//    - Returns raw data from the database
//
// 2. VIEW:
//    - Represents the USER INTERFACE (UI)
//    - In our case, this is the React frontend
//    - Displays data to users
//
// 3. CONTROLLER:
//    - Handles HTTP requests and responses
//    - Contains BUSINESS LOGIC (validation, password hashing, etc.)
//    - Uses Models to get/save data
//    - Sends responses back to the client
//
// EXAMPLE FLOW:
// ============================================
// 1. Client sends HTTP request → Controller receives it
// 2. Controller validates data, hashes password, etc. (business logic)
// 3. Controller calls Model method → Model executes SQL query
// 4. Model returns data → Controller processes it
// 5. Controller sends HTTP response → Client receives it
//
// Client Request
//      ↓
// Controller (handles request, validates, processes)
//      ↓
// Model (executes SQL query)
//      ↓
// Database (returns data)
//      ↓
// Model (returns data to controller)
//      ↓
// Controller (sends response to client)
//      ↓
// Client Response

// ============================================
// WHY SEPARATE DATABASE QUERIES FROM BUSINESS LOGIC?
// ============================================
// Separation of Concerns is a fundamental principle in software development
//
// BENEFITS:
// ============================================
// 1. MAINTAINABILITY:
//    - If database schema changes, you only update the Model
//    - Business logic changes don't affect database queries
//    - Easier to find and fix bugs
//
// 2. REUSABILITY:
//    - Model methods can be used by multiple controllers
//    - Example: findById() can be used in auth, profile, admin controllers
//
// 3. TESTABILITY:
//    - Easy to test database queries separately
//    - Can mock models when testing controllers
//
// 4. CLARITY:
//    - Clear responsibility: Models = Database, Controllers = Business Logic
//    - New developers can quickly understand the codebase
//
// 5. FLEXIBILITY:
//    - Can switch databases (MySQL → PostgreSQL) by only changing models
//    - Can add caching layer without changing controllers
//
// EXAMPLE OF SEPARATION:
// ============================================
// ❌ BAD (mixing concerns):
//    function createUser(userData) {
//        // Business logic (should be in controller)
//        if (!userData.email) throw new Error('Email required');
//        const hashedPassword = bcrypt.hash(userData.password, 10);
//        
//        // Database query (should be in model)
//        db.query('INSERT INTO users...');
//    }
//
// ✅ GOOD (separated):
//    // In Controller:
//    if (!userData.email) throw new Error('Email required');
//    const hashedPassword = bcrypt.hash(userData.password, 10);
//    const user = await User.create({ ...userData, password_hash: hashedPassword });
//
//    // In Model (this file):
//    create(userData) {
//        return promisePool.query('INSERT INTO users...', [userData.email, ...]);
//    }

// ============================================
// WHAT THIS FILE CONTAINS
// ============================================
// This file will contain ONLY:
// - SQL queries (SELECT, INSERT, UPDATE, DELETE)
// - Parameterized queries (to prevent SQL injection)
// - Database result processing
//
// This file will NOT contain:
// - Password hashing (that's in the controller)
// - Input validation (that's in the controller)
// - Business logic (that's in the controller)
// - HTTP request/response handling (that's in the controller)
// - Authentication logic (that's in the controller)
//
// EXAMPLE:
// ============================================
// ✅ Model does: "Get user with email = 'john@example.com'"
// ❌ Model does NOT: "Validate email format" or "Hash password"

// ============================================
// PARAMETERIZED QUERIES - SQL INJECTION PREVENTION
// ============================================
// WHAT IS SQL INJECTION?
// SQL injection is a code injection technique where malicious SQL code
// is inserted into a query, allowing attackers to manipulate the database.
//
// EXAMPLE OF SQL INJECTION ATTACK:
// ============================================
// ❌ VULNERABLE CODE (DON'T DO THIS!):
//    const email = req.body.email; // User input: "admin@example.com' OR '1'='1"
//    const query = `SELECT * FROM users WHERE email = '${email}'`;
//    // Results in: SELECT * FROM users WHERE email = 'admin@example.com' OR '1'='1'
//    // This returns ALL users! Security breach!
//
// ✅ SAFE CODE (USE PARAMETERIZED QUERIES):
//    const email = req.body.email; // Same malicious input
//    const query = 'SELECT * FROM users WHERE email = ?';
//    await promisePool.query(query, [email]);
//    // MySQL treats the entire input as a single value, not as SQL code
//    // Results in: SELECT * FROM users WHERE email = "admin@example.com' OR '1'='1"
//    // This searches for that exact string - safe!
//
// HOW PARAMETERIZED QUERIES WORK:
// ============================================
// 1. Use ? placeholders in SQL query instead of direct values
// 2. Pass values as a separate array parameter
// 3. Database driver automatically escapes and sanitizes the values
// 4. Prevents SQL injection attacks completely
//
// BENEFITS:
// - Prevents SQL injection attacks
// - Automatically handles special characters and quotes
// - More readable and maintainable code
// - Database can optimize query execution

// ============================================
// User Model Object
// ============================================
// This object contains methods for all database operations
// related to the users table
//
// Each method:
// 1. Executes a SQL query using promisePool
// 2. Uses parameterized queries (prevents SQL injection)
// 3. Returns a Promise (can use async/await)
// 4. Handles errors properly with try-catch
const User = {
    /**
     * Create a new user in the database
     * 
     * @param {Object} userData - User data object containing:
     *   - name: User's full name
     *   - email: User's email address (must be unique)
     *   - password_hash: Hashed password (hashing done in controller)
     *   - phone: User's phone number (optional)
     *   - role: User role ('user' or 'ngo')
     *   - address: User's address (optional)
     *   - latitude: Latitude coordinate (optional)
     *   - longitude: Longitude coordinate (optional)
     * 
     * @returns {Promise<Object>} Object containing:
     *   - insertId: The ID of the newly inserted user
     *   - user: The complete user data including the new ID
     * 
     * @example
     * // In controller:
     * const userData = {
     *     name: 'John Doe',
     *     email: 'john@example.com',
     *     password_hash: hashedPassword, // Hashed in controller
     *     phone: '+1234567890',
     *     role: 'user',
     *     address: '123 Main St',
     *     latitude: 40.7128,
     *     longitude: -74.0060
     * };
     * const result = await User.create(userData);
     * console.log(result.insertId); // New user ID
     */
    async create(userData) {
        try {
            // SQL INSERT query with parameterized placeholders (?)
            // Each ? will be replaced with a value from the array
            // This prevents SQL injection attacks
            const query = `
                INSERT INTO users 
                (name, email, password_hash, phone, role, address, latitude, longitude) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            // Execute query with parameterized values
            // Values are passed as an array in the same order as ? placeholders
            const [result] = await promisePool.query(query, [
                userData.name,
                userData.email,
                userData.password_hash,
                userData.phone || null,
                userData.role || 'user',
                userData.address || null,
                userData.latitude || null,
                userData.longitude || null
            ]);
            
            // result.insertId contains the auto-generated ID of the new user
            // result.affectedRows tells us how many rows were inserted (should be 1)
            
            // Return the insertId and fetch the complete user data
            // We fetch the user to return complete data including timestamps
            const [rows] = await promisePool.query(
                'SELECT * FROM users WHERE id = ?',
                [result.insertId]
            );
            
            return {
                insertId: result.insertId,
                user: rows[0] // Return the first (and only) row
            };
            
        } catch (error) {
            // Re-throw the error so the controller can handle it
            // The error handler middleware will catch it and format the response
            throw error;
        }
    },

    /**
     * Find a user by their email address
     * 
     * @param {string} email - User's email address to search for
     * 
     * @returns {Promise<Object|null>} User object if found, null if not found
     * 
     * @example
     * // In controller:
     * const user = await User.findByEmail('john@example.com');
     * if (user) {
     *     console.log('User found:', user.name);
     * } else {
     *     console.log('User not found');
     * }
     */
    async findByEmail(email) {
        try {
            // SQL SELECT query with parameterized placeholder
            // ? is replaced with the email value from the array
            const query = 'SELECT * FROM users WHERE email = ?';
            
            // Execute query with email as parameter
            // This prevents SQL injection even if email contains malicious SQL
            const [rows] = await promisePool.query(query, [email]);
            
            // If user found, rows[0] contains the user object
            // If not found, rows is an empty array, so rows[0] is undefined
            // Return null if not found for cleaner code in controllers
            return rows[0] || null;
            
        } catch (error) {
            // Re-throw the error so the controller can handle it
            throw error;
        }
    },

    /**
     * Find a user by their ID
     * 
     * @param {number} id - User's ID to search for
     * 
     * @returns {Promise<Object|null>} User object if found, null if not found
     * 
     * @example
     * // In controller:
     * const user = await User.findById(1);
     * if (user) {
     *     console.log('User found:', user.name);
     * } else {
     *     console.log('User not found');
     * }
     */
    async findById(id) {
        try {
            // SQL SELECT query with parameterized placeholder
            // ? is replaced with the id value from the array
            const query = 'SELECT * FROM users WHERE id = ?';
            
            // Execute query with id as parameter
            // Even though id is usually a number, we still use parameterized queries
            // This is a best practice and prevents any potential issues
            const [rows] = await promisePool.query(query, [id]);
            
            // If user found, rows[0] contains the user object
            // If not found, rows is an empty array, so rows[0] is undefined
            // Return null if not found for cleaner code in controllers
            return rows[0] || null;
            
        } catch (error) {
            // Re-throw the error so the controller can handle it
            throw error;
        }
    },

    /**
     * Update user data in the database
     * 
     * @param {number} id - User's ID to update
     * @param {Object} userData - User data object containing fields to update:
     *   - name: User's full name (optional)
     *   - phone: User's phone number (optional)
     *   - address: User's address (optional)
     *   - latitude: Latitude coordinate (optional)
     *   - longitude: Longitude coordinate (optional)
     * 
     * @returns {Promise<number>} Number of affected rows (0 if user not found, 1 if updated)
     * 
     * @example
     * // In controller:
     * const updateData = {
     *     name: 'Jane Doe',
     *     phone: '+1234567890',
     *     address: '456 Oak Ave'
     * };
     * const affectedRows = await User.update(1, updateData);
     * if (affectedRows > 0) {
     *     console.log('User updated successfully');
     * } else {
     *     console.log('User not found');
     * }
     */
    async update(id, userData) {
        try {
            // Build dynamic UPDATE query based on provided fields
            const allowedFields = ['name', 'phone', 'address', 'latitude', 'longitude', 'password_hash'];
            const updates = [];
            const values = [];
            
            // Build SET clause dynamically
            Object.keys(userData).forEach(key => {
                if (allowedFields.includes(key) && userData[key] !== undefined) {
                    updates.push(`${key} = ?`);
                    values.push(userData[key]);
                }
            });
            
            // If no valid fields to update, return 0
            if (updates.length === 0) {
                return 0;
            }
            
            // Add id to values array for WHERE clause
            values.push(id);
            
            // Build and execute query
            const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
            const [result] = await promisePool.query(query, values);
            
            // result.affectedRows tells us how many rows were updated
            // 0 = user not found, 1 = user updated successfully
            return result.affectedRows;
            
        } catch (error) {
            // Re-throw the error so the controller can handle it
            throw error;
        }
    },

    /**
     * Delete a user from the database
     * 
     * @param {number} id - User's ID to delete
     * 
     * @returns {Promise<boolean>} true if user was deleted, false if user not found
     * 
     * @example
     * // In controller:
     * const deleted = await User.delete(1);
     * if (deleted) {
     *     console.log('User deleted successfully');
     * } else {
     *     console.log('User not found');
     * }
     */
    async delete(id) {
        try {
            // SQL DELETE query with parameterized placeholder
            // ? is replaced with the id value from the array
            const query = 'DELETE FROM users WHERE id = ?';
            
            // Execute query with id as parameter
            // This prevents SQL injection attacks
            const [result] = await promisePool.query(query, [id]);
            
            // result.affectedRows tells us how many rows were deleted
            // 0 = user not found, 1 = user deleted successfully
            // Convert to boolean: > 0 means success
            return result.affectedRows > 0;
            
        } catch (error) {
            // Re-throw the error so the controller can handle it
            throw error;
        }
    },

    /**
     * Find all users in the database
     * 
     * Note: This method does NOT return password_hash for security reasons
     * Password hashes should never be sent to clients
     * 
     * @param {Object} filters - Optional filters object (for future use):
     *   - role: Filter by user role ('user' or 'ngo')
     * 
     * @returns {Promise<Array>} Array of user objects (without password_hash)
     * 
     * @example
     * // In controller:
     * const users = await User.findAll();
     * console.log(`Found ${users.length} users`);
     * 
     * // Each user object contains:
     * // - id, name, email, phone, role, address, created_at
     * // - Does NOT contain password_hash (security)
     */
    async findAll(filters = {}) {
        try {
            // SQL SELECT query - explicitly list columns we want
            // We exclude password_hash for security reasons
            // Never send password hashes to clients!
            let query = `
                SELECT id, name, email, phone, role, address, latitude, longitude, created_at 
                FROM users
            `;
            
            const params = [];
            
            // Optional: Add WHERE clause if filters are provided
            // This allows filtering by role in the future
            if (filters.role) {
                query += ' WHERE role = ?';
                params.push(filters.role);
            }
            
            // Order by created_at descending (newest first)
            query += ' ORDER BY created_at DESC';
            
            // Execute query with optional parameters
            const [rows] = await promisePool.query(query, params);
            
            // Return array of users (empty array if no users found)
            // Each user object does NOT contain password_hash
            return rows;
            
        } catch (error) {
            // Re-throw the error so the controller can handle it
            throw error;
        }
    }
};

// ============================================
// Export User Model
// ============================================
// Export the User object so it can be imported in controllers
// Usage in controller: const User = require('../models/User');
module.exports = User;

