const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Get cart items
router.get('/', cartController.getCartItems);

// Get cart summary
router.get('/summary', cartController.getCartSummary);

// Add item to cart
router.post('/', cartController.addToCart);

// Update cart item quantity
router.patch('/:id', cartController.updateCartItem);

// Remove item from cart
router.delete('/:id', cartController.removeFromCart);

// Clear cart
router.delete('/', cartController.clearCart);

module.exports = router;
