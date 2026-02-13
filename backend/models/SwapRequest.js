const { promisePool: pool } = require('../config/database');

const SwapRequest = {
  // Create a new swap request
  async create(swapData) {
    const { requester_id, item_id, offered_item_id, message } = swapData;

    const query = `
      INSERT INTO swap_requests 
      (requester_id, item_id, offered_item_id, message, status)
      VALUES (?, ?, ?, ?, 'pending')
    `;

    const [result] = await pool.execute(query, [
      requester_id,
      item_id,
      offered_item_id || null,
      message || null
    ]);

    return {
      id: result.insertId,
      ...swapData,
      status: 'pending',
      created_at: new Date()
    };
  },

  // Get swap request by ID
  async findById(id) {
    const query = `
      SELECT 
        sr.*,
        requester.name as requester_name,
        requester.email as requester_email,
        requester.phone as requester_phone,
        requested_item.title as requested_item_title,
        requested_item.user_id as owner_id,
        owner.name as owner_name,
        owner.email as owner_email,
        offered_item.title as offered_item_title,
        (SELECT image_url FROM item_images WHERE item_id = sr.item_id LIMIT 1) as requested_item_image,
        (SELECT image_url FROM item_images WHERE item_id = sr.offered_item_id LIMIT 1) as offered_item_image
      FROM swap_requests sr
      INNER JOIN users requester ON sr.requester_id = requester.id
      INNER JOIN items requested_item ON sr.item_id = requested_item.id
      INNER JOIN users owner ON requested_item.user_id = owner.id
      LEFT JOIN items offered_item ON sr.offered_item_id = offered_item.id
      WHERE sr.id = ?
    `;

    const [requests] = await pool.execute(query, [id]);
    return requests.length > 0 ? requests[0] : null;
  },

  // Get user's swap requests (sent)
  async findByRequesterId(userId) {
    const query = `
      SELECT 
        sr.*,
        requested_item.title as requested_item_title,
        requested_item.category as requested_item_category,
        owner.name as owner_name,
        offered_item.title as offered_item_title,
        (SELECT image_url FROM item_images WHERE item_id = sr.item_id LIMIT 1) as requested_item_image
      FROM swap_requests sr
      INNER JOIN items requested_item ON sr.item_id = requested_item.id
      INNER JOIN users owner ON requested_item.user_id = owner.id
      LEFT JOIN items offered_item ON sr.offered_item_id = offered_item.id
      WHERE sr.requester_id = ?
      ORDER BY sr.created_at DESC
    `;

    const [requests] = await pool.execute(query, [userId]);
    return requests;
  },

  // Get swap requests for user's items (received)
  async findByOwnerId(userId) {
    const query = `
      SELECT 
        sr.*,
        requester.name as requester_name,
        requester.phone as requester_phone,
        requested_item.title as requested_item_title,
        offered_item.title as offered_item_title,
        (SELECT image_url FROM item_images WHERE item_id = sr.item_id LIMIT 1) as requested_item_image,
        (SELECT image_url FROM item_images WHERE item_id = sr.offered_item_id LIMIT 1) as offered_item_image
      FROM swap_requests sr
      INNER JOIN items requested_item ON sr.item_id = requested_item.id
      INNER JOIN users requester ON sr.requester_id = requester.id
      LEFT JOIN items offered_item ON sr.offered_item_id = offered_item.id
      WHERE requested_item.user_id = ?
      ORDER BY sr.created_at DESC
    `;

    const [requests] = await pool.execute(query, [userId]);
    return requests;
  },

  // Update swap request status
  async updateStatus(id, status, userId) {
    // First verify the user is the owner of the requested item
    const request = await this.findById(id);
    
    if (!request) {
      return null;
    }

    if (request.owner_id !== userId) {
      throw new Error('Not authorized to update this swap request');
    }

    const [result] = await pool.execute(
      'UPDATE swap_requests SET status = ?, responded_at = NOW() WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  },

  // Delete swap request
  async delete(id, userId) {
    // Verify user is the requester
    const [result] = await pool.execute(
      'DELETE FROM swap_requests WHERE id = ? AND requester_id = ?',
      [id, userId]
    );

    return result.affectedRows > 0;
  }
};

module.exports = SwapRequest;
