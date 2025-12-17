const express = require('express');
const router = express.Router();
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getNearbyItems,
  getUserItems,
  deleteItemImage,
  setPrimaryImage,
  advancedSearch,
  updateItemStatus,
  getFeaturedItems,
  getPremiumItems
} = require('../controllers/itemController');
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadImages } = require('../middleware/uploadMiddleware');

// POST /api/items - Create new item (protected, with image upload)
// Requires authentication and accepts up to 5 images
router.post('/', verifyToken, uploadImages, createItem);

// GET /api/items - Get all items with optional filters (public)
// Query params: category, listing_type, status, search
router.get('/', getAllItems);

// GET /api/items/search - Advanced search with filters and sorting (public)
// Query params: category, listing_type, min_price, max_price, condition, sort_by, order, search
router.get('/search', advancedSearch);

// GET /api/items/featured - Get featured items (public)
// Query params: limit (optional, default 6)
router.get('/featured', getFeaturedItems);

// GET /api/items/premium - Get premium items (public)
// Query params: limit (optional, default 4)
router.get('/premium', getPremiumItems);

// GET /api/items/nearby - Get nearby items based on location (public)
// Query params: latitude, longitude, radius (optional, default 10km)
router.get('/nearby', getNearbyItems);

// GET /api/items/user/:userId - Get all items by specific user (public)
// Params: userId
router.get('/user/:userId', getUserItems);

// GET /api/items/:id - Get single item by ID (public)
// Params: id
router.get('/:id', getItemById);

// PUT /api/items/:id - Update item (protected, owner only)
// Requires authentication, only item owner can update
router.put('/:id', verifyToken, updateItem);

// PUT /api/items/:id/status - Update item status (protected, owner only)
// Body: status (available, pending, sold, completed), buyer_id (required for completed/sold)
router.put('/:id/status', verifyToken, updateItemStatus);

// DELETE /api/items/:id - Delete item (protected, owner only)
// Requires authentication, only item owner can delete
router.delete('/:id', verifyToken, deleteItem);

// DELETE /api/items/images/:imageId - Delete item image (protected, owner only)
// Params: imageId
router.delete('/images/:imageId', verifyToken, deleteItemImage);

// PUT /api/items/images/:imageId/primary - Set image as primary (protected, owner only)
// Params: imageId
router.put('/images/:imageId/primary', verifyToken, setPrimaryImage);

module.exports = router;
