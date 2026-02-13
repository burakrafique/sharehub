const { promisePool: pool } = require('../config/database');

const Cart = {
  // Add item to cart
  async addItem(userId, itemId, quantity = 1) {
    // Check if item already exists in cart
    const [existing] = await pool.execute(
      'SELECT * FROM cart WHERE user_id = ? AND item_id = ?',
      [userId, itemId]
    );

    if (existing.length > 0) {
      // Update quantity if already in cart
      const newQuantity = existing[0].quantity + quantity;
      const [result] = await pool.execute(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [newQuantity, existing[0].id]
      );
      return { id: existing[0].id, quantity: newQuantity };
    }

    // Add new item to cart
    const [result] = await pool.execute(
      'INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)',
      [userId, itemId, quantity]
    );

    return { id: result.insertId, quantity };
  },

  // Get user's cart items
  async getCartItems(userId) {
    const query = `
      SELECT 
        cart.id as cart_id,
        cart.quantity,
        cart.created_at as added_at,
        items.*,
        users.name as seller_name,
        users.phone as seller_phone,
        (SELECT image_url FROM item_images WHERE item_id = items.id LIMIT 1) as image_url
      FROM cart
      INNER JOIN items ON cart.item_id = items.id
      INNER JOIN users ON items.user_id = users.id
      WHERE cart.user_id = ? AND items.status = 'available'
      ORDER BY cart.created_at DESC
    `;

    const [items] = await pool.execute(query, [userId]);
    return items;
  },

  // Update cart item quantity
  async updateQuantity(cartId, userId, quantity) {
    const [result] = await pool.execute(
      'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, cartId, userId]
    );

    return result.affectedRows > 0;
  },

  // Remove item from cart
  async removeItem(cartId, userId) {
    const [result] = await pool.execute(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [cartId, userId]
    );

    return result.affectedRows > 0;
  },

  // Clear user's cart
  async clearCart(userId) {
    const [result] = await pool.execute(
      'DELETE FROM cart WHERE user_id = ?',
      [userId]
    );

    return result.affectedRows;
  },

  // Get cart summary
  async getCartSummary(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_items,
        SUM(cart.quantity) as total_quantity,
        SUM(items.price * cart.quantity) as total_amount
      FROM cart
      INNER JOIN items ON cart.item_id = items.id
      WHERE cart.user_id = ? AND items.status = 'available'
    `;

    const [result] = await pool.execute(query, [userId]);
    return result[0];
  }
};

module.exports = Cart;
