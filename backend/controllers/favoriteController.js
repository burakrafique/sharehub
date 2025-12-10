const Favorite = require('../models/Favorite');
const Item = require('../models/Item');

// Add item to favorites
const addFavorite = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    const userId = req.user.id;

    // Validate itemId
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide itemId'
      });
    }

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is trying to favorite their own item
    if (item.user_id === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot favorite your own item'
      });
    }

    // Add to favorites
    const favorite = await Favorite.add(userId, itemId);

    res.status(201).json({
      success: true,
      message: 'Item added to favorites',
      data: favorite
    });
  } catch (error) {
    if (error.message === 'Item already in favorites') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// Remove item from favorites
const removeFavorite = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    // Validate itemId
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide itemId'
      });
    }

    // Remove from favorites
    const removed = await Favorite.remove(userId, parseInt(itemId));

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// Get user's favorite items
const getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.getUserFavorites(userId);

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

// Check if item is favorited by user
const checkFavorite = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    // Validate itemId
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide itemId'
      });
    }

    const isFavorited = await Favorite.isFavorited(userId, parseInt(itemId));

    res.status(200).json({
      success: true,
      isFavorited
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite
};
