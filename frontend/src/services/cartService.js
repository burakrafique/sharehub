import API from './api';

const cartService = {
  // Add item to cart
  addToCart: async (itemId, quantity = 1) => {
    return await API.post('/cart', { item_id: itemId, quantity });
  },

  // Get cart items
  getCartItems: async () => {
    return await API.get('/cart');
  },

  // Get cart summary
  getCartSummary: async () => {
    return await API.get('/cart/summary');
  },

  // Update cart item quantity
  updateCartItem: async (cartId, quantity) => {
    return await API.patch(`/cart/${cartId}`, { quantity });
  },

  // Remove item from cart
  removeFromCart: async (cartId) => {
    return await API.delete(`/cart/${cartId}`);
  },

  // Clear cart
  clearCart: async () => {
    return await API.delete('/cart');
  }
};

export default cartService;
