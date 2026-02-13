const express = require('express');
const router = express.Router();
const {
  createItem,
  getAllItems,
  getItemById,
  getMyItems,
  updateItem,
  deleteItem,
  getNearbyItems,
  searchItems,
  deleteItemImage,
  setPrimaryImage,
  advancedSearch,
  updateItemStatus
} = require('../controllers/itemController');
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadImages } = require('../middleware/uploadMiddleware');
const { createItemValidation } = require('../middleware/validationRules');

// POST /api/items - Create new item (protected, with image upload)
router.post('/', verifyToken, uploadImages, createItemValidation, createItem);

// GET /api/items - Get all items with pagination and filters (public)
router.get('/', getAllItems);

// GET /api/items/search - Search items with text and location (public)
router.get('/search', searchItems);

// GET /api/items/my-items - Get current user's items (protected)
router.get('/my-items', verifyToken, getMyItems);

// GET /api/items/nearby - Get nearby items based on location (public)
router.get('/nearby', getNearbyItems);

// GET /api/items/:id - Get single item by ID (public)
router.get('/:id', getItemById);

// PUT /api/items/:id - Update item (protected, owner only)
router.put('/:id', verifyToken, updateItem);

// PATCH /api/items/:id/status - Update item status (protected, owner only)
router.patch('/:id/status', verifyToken, updateItemStatus);

// DELETE /api/items/:id - Delete item (protected, owner only)
router.delete('/:id', verifyToken, deleteItem);

// DELETE /api/items/images/:imageId - Delete item image (protected, owner only)
// Params: imageId
router.delete('/images/:imageId', verifyToken, deleteItemImage);

// PUT /api/items/images/:imageId/primary - Set image as primary (protected, owner only)
// Params: imageId
router.put('/images/:imageId/primary', verifyToken, setPrimaryImage);

module.exports = router;
