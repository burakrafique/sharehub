const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite
} = require('../controllers/favoriteController');
const { verifyToken } = require('../middleware/authMiddleware');

// All favorite routes require authentication
router.use(verifyToken);

// POST /api/favorites - Add item to favorites (protected)
// Body: itemId
router.post('/', addFavorite);

// GET /api/favorites - Get current user's favorite items (protected)
// Returns all favorited items with details
router.get('/', getUserFavorites);

// GET /api/favorites/check/:itemId - Check if item is favorited (protected)
// Params: itemId
// Returns: { isFavorited: true/false }
router.get('/check/:itemId', checkFavorite);

// DELETE /api/favorites/:itemId - Remove item from favorites (protected)
// Params: itemId
router.delete('/:itemId', removeFavorite);

module.exports = router;
