const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllItemsAdmin,
  getAllTransactions,
  updateUserRole,
  deleteUser,
  deleteItemAdmin,
  getPlatformStats
} = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyAdmin } = require('../middleware/adminMiddleware');

// All admin routes require authentication AND admin role
// Apply both middlewares to all routes
router.use(verifyToken);
router.use(verifyAdmin);

// GET /api/admin/users - Get all users (admin only)
router.get('/users', getAllUsers);

// GET /api/admin/items - Get all items (admin only)
router.get('/items', getAllItemsAdmin);

// GET /api/admin/transactions - Get all transactions (admin only)
router.get('/transactions', getAllTransactions);

// GET /api/admin/stats - Get platform statistics (admin only)
router.get('/stats', getPlatformStats);

// PUT /api/admin/users/:userId/role - Update user role (admin only)
// Body: role (user, admin, ngo)
router.put('/users/:userId/role', updateUserRole);

// DELETE /api/admin/users/:userId - Delete user (admin only)
router.delete('/users/:userId', deleteUser);

// DELETE /api/admin/items/:itemId - Delete item (admin only)
router.delete('/items/:itemId', deleteItemAdmin);

module.exports = router;
