const express = require('express');
const router = express.Router();
const {
  getCurrentUserProfile,
  updateProfile,
  changePassword,
  getUserItems,
  getUserProfile
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/users/profile - Get current user's profile (protected)
router.get('/profile', verifyToken, getCurrentUserProfile);

// GET /api/users/profile/:userId - Get user profile (public)
// Returns public user information and available items count
router.get('/profile/:id', getUserProfile);

// PUT /api/users/profile - Update current user's profile (protected)
// Body: name, phone, address, latitude, longitude
router.put('/profile', verifyToken, updateProfile);

// PUT /api/users/change-password - Change password (protected)
// Body: currentPassword, newPassword
router.put('/change-password', verifyToken, changePassword);

// GET /api/users/my-items - Get current user's items (protected)
// Returns all items created by the authenticated user
router.get('/my-items', verifyToken, getUserItems);

module.exports = router;
