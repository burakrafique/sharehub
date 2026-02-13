const express = require('express');
const router = express.Router();

// Import controllers and middleware
const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');

const { verifyToken } = require('../middleware/authMiddleware');

const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation
} = require('../middleware/validationRules');

// ============================================
// ShareHub Backend - Authentication Routes
// All authentication-related API endpoints
// ============================================

// ============================================
// Public Routes (No Authentication Required)
// ============================================

// POST /api/auth/register - User registration
router.post('/register', registerValidation, register);

// POST /api/auth/login - User login
router.post('/login', loginValidation, login);

// POST /api/auth/logout - User logout (client-side token removal)
router.post('/logout', logout);

// ============================================
// Protected Routes (Authentication Required)
// ============================================

// GET /api/auth/me - Get current user profile
router.get('/me', verifyToken, getCurrentUser);

// PUT /api/auth/profile - Update user profile
router.put('/profile', verifyToken, updateProfileValidation, updateProfile);

// POST /api/auth/change-password - Change user password
router.post('/change-password', verifyToken, changePasswordValidation, changePassword);

// ============================================
// Legacy Routes (for backward compatibility)
// ============================================

// GET /api/auth/profile - Legacy route (redirect to /me)
router.get('/profile', verifyToken, getCurrentUser);

module.exports = router;

