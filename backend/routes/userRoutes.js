const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadProfileImage } = require('../middleware/uploadMiddleware');

// ============================================
// ShareHub Backend - User Routes
// Routes for user profile management and user-related operations
// ============================================

// Import user controller (to be created)
const {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  getUserItems,
  getUserStats,
  deactivateAccount,
  changePassword
} = require('../controllers/userController');

// ============================================
// User Profile Routes
// ============================================

// GET /api/users/profile - Get current user's profile
router.get('/profile', verifyToken, getUserProfile);

// PUT /api/users/profile - Update current user's profile
router.put('/profile', verifyToken, updateUserProfile);

// POST /api/users/profile/image - Upload profile picture
router.post('/profile/image', verifyToken, uploadProfileImage, uploadProfilePicture);

// GET /api/users/my-items - Get current user's items
router.get('/my-items', verifyToken, getUserItems);

// GET /api/users/stats - Get user statistics
router.get('/stats', verifyToken, getUserStats);

// ============================================
// Account Management Routes
// ============================================

// PUT /api/users/change-password - Change password
router.put('/change-password', verifyToken, changePassword);

// DELETE /api/users/deactivate - Deactivate account
router.delete('/deactivate', verifyToken, deactivateAccount);

// ============================================
// Public User Routes
// ============================================

// GET /api/users/:id - Get public user profile
router.get('/:id', getUserProfile);

module.exports = router;