const Cart = require('../models/Cart');

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { item_id, quantity } = req.body;
    const user_id = req.user.id;

    if (!item_id) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }

    const result = await Cart.addItem(user_id, item_id, quantity || 1);

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: result
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// Get user's cart items
exports.getCartItems = async (req, res) => {
  try {
    const items = await Cart.getCartItems(req.user.id);

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get cart items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart items',
      error: error.message
    });
  }
};

// Get cart summary
exports.getCartSummary = async (req, res) => {
  try {
    const summary = await Cart.getCartSummary(req.user.id);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart summary',
      error: error.message
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const updated = await Cart.updateQuantity(id, req.user.id, quantity);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Cart.removeItem(id, req.user.id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const count = await Cart.clearCart(req.user.id);

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: { items_removed: count }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};
