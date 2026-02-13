const { promisePool: pool } = require('../config/database');

const Transaction = {
  // Create a new transaction
  async createTransaction(transactionData) {
    const { item_id, seller_id, buyer_id, transaction_type, amount } = transactionData;

    const query = `
      INSERT INTO transactions (item_id, seller_id, buyer_id, transaction_type, amount, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;

    const [result] = await pool.execute(query, [
      item_id,
      seller_id,
      buyer_id,
      transaction_type,
      amount || null
    ]);

    return {
      id: result.insertId,
      ...transactionData,
      status: 'pending',
      created_at: new Date()
    };
  },

  // Find transaction by ID with complete details
  async findById(id) {
    const query = `
      SELECT 
        t.*,
        i.title as item_title,
        i.description as item_description,
        i.category as item_category,
        i.listing_type as item_listing_type,
        i.price as item_price,
        i.condition as item_condition,
        i.address as item_address,
        i.latitude as item_latitude,
        i.longitude as item_longitude,
        seller.id as seller_id,
        seller.username as seller_username,
        seller.name as seller_name,
        seller.email as seller_email,
        seller.phone as seller_phone,
        seller.profile_image as seller_profile_image,
        buyer.id as buyer_id,
        buyer.username as buyer_username,
        buyer.name as buyer_name,
        buyer.email as buyer_email,
        buyer.phone as buyer_phone,
        buyer.profile_image as buyer_profile_image,
        -- Get item images
        GROUP_CONCAT(
          DISTINCT CONCAT(
            '{"id":', ii.id, 
            ',"image_url":"', ii.image_url, 
            '","is_primary":', ii.is_primary, '}'
          ) SEPARATOR ','
        ) as item_images
      FROM transactions t
      INNER JOIN items i ON t.item_id = i.id
      INNER JOIN users seller ON t.seller_id = seller.id
      INNER JOIN users buyer ON t.buyer_id = buyer.id
      LEFT JOIN item_images ii ON i.id = ii.item_id
      WHERE t.id = ?
      GROUP BY t.id
    `;

    const [transactions] = await pool.execute(query, [id]);
    
    if (transactions.length === 0) {
      return null;
    }

    const transaction = transactions[0];
    
    // Parse item images
    if (transaction.item_images) {
      try {
        transaction.item_images = JSON.parse(`[${transaction.item_images}]`);
      } catch (error) {
        transaction.item_images = [];
      }
    } else {
      transaction.item_images = [];
    }

    return transaction;
  },

  // Get transactions by user with role filtering
  async findByUser(userId, role = 'all', page = 1, limit = 10) {
    let whereClause = '';
    let queryParams = [];

    if (role === 'buyer') {
      whereClause = 'WHERE t.buyer_id = ?';
      queryParams = [userId];
    } else if (role === 'seller') {
      whereClause = 'WHERE t.seller_id = ?';
      queryParams = [userId];
    } else {
      whereClause = 'WHERE (t.seller_id = ? OR t.buyer_id = ?)';
      queryParams = [userId, userId];
    }

    // Count total transactions
    const countQuery = `
      SELECT COUNT(*) as total
      FROM transactions t
      ${whereClause}
    `;

    const [countResult] = await pool.execute(countQuery, queryParams);
    const totalCount = countResult[0].total;

    // Get paginated transactions
    const offset = (page - 1) * limit;
    const query = `
      SELECT 
        t.*,
        i.title as item_title,
        i.category as item_category,
        i.listing_type as item_listing_type,
        i.price as item_price,
        seller.username as seller_username,
        seller.name as seller_name,
        seller.profile_image as seller_profile_image,
        buyer.username as buyer_username,
        buyer.name as buyer_name,
        buyer.profile_image as buyer_profile_image,
        CASE 
          WHEN t.seller_id = ? THEN 'seller'
          ELSE 'buyer'
        END as user_role,
        -- Get primary item image
        (SELECT image_url FROM item_images WHERE item_id = i.id AND is_primary = 1 LIMIT 1) as item_image
      FROM transactions t
      INNER JOIN items i ON t.item_id = i.id
      INNER JOIN users seller ON t.seller_id = seller.id
      INNER JOIN users buyer ON t.buyer_id = buyer.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [transactions] = await pool.execute(query, [userId, ...queryParams, limit, offset]);

    return {
      transactions,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1
    };
  },

  // Update transaction status
  async updateStatus(id, status, userId = null) {
    // First check if user is authorized (if userId provided)
    if (userId) {
      const transaction = await this.findById(id);
      
      if (!transaction) {
        return null;
      }

      if (transaction.seller_id !== userId && transaction.buyer_id !== userId) {
        throw new Error('Not authorized to update this transaction');
      }
    }

    const query = `
      UPDATE transactions 
      SET status = ?, completed_at = ?
      WHERE id = ?
    `;

    const completedAt = status === 'completed' ? new Date() : null;
    const [result] = await pool.execute(query, [status, completedAt, id]);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  },

  // Get complete transaction history for a user
  async getTransactionHistory(userId, filters = {}) {
    let whereClause = 'WHERE (t.seller_id = ? OR t.buyer_id = ?)';
    let queryParams = [userId, userId];

    // Add filters
    if (filters.transaction_type) {
      whereClause += ' AND t.transaction_type = ?';
      queryParams.push(filters.transaction_type);
    }

    if (filters.status) {
      whereClause += ' AND t.status = ?';
      queryParams.push(filters.status);
    }

    if (filters.date_from) {
      whereClause += ' AND t.created_at >= ?';
      queryParams.push(filters.date_from);
    }

    if (filters.date_to) {
      whereClause += ' AND t.created_at <= ?';
      queryParams.push(filters.date_to);
    }

    const query = `
      SELECT 
        t.*,
        i.title as item_title,
        i.category as item_category,
        i.listing_type as item_listing_type,
        seller.username as seller_username,
        seller.name as seller_name,
        buyer.username as buyer_username,
        buyer.name as buyer_name,
        CASE 
          WHEN t.seller_id = ? THEN 'seller'
          ELSE 'buyer'
        END as user_role,
        (SELECT image_url FROM item_images WHERE item_id = i.id AND is_primary = 1 LIMIT 1) as item_image
      FROM transactions t
      INNER JOIN items i ON t.item_id = i.id
      INNER JOIN users seller ON t.seller_id = seller.id
      INNER JOIN users buyer ON t.buyer_id = buyer.id
      ${whereClause}
      ORDER BY t.created_at DESC
    `;

    const [transactions] = await pool.execute(query, [userId, ...queryParams]);
    return transactions;
  },

  // Get transaction statistics for a user
  async getTransactionStats(userId) {
    const query = `
      SELECT 
        -- Sales statistics (as seller)
        COUNT(CASE WHEN t.seller_id = ? AND t.transaction_type = 'sale' THEN 1 END) as total_sales_count,
        COALESCE(SUM(CASE WHEN t.seller_id = ? AND t.transaction_type = 'sale' AND t.status = 'completed' THEN t.amount END), 0) as total_sales_amount,
        
        -- Purchase statistics (as buyer)
        COUNT(CASE WHEN t.buyer_id = ? AND t.transaction_type = 'sale' THEN 1 END) as total_purchases_count,
        COALESCE(SUM(CASE WHEN t.buyer_id = ? AND t.transaction_type = 'sale' AND t.status = 'completed' THEN t.amount END), 0) as total_purchases_amount,
        
        -- Donation statistics
        COUNT(CASE WHEN t.seller_id = ? AND t.transaction_type = 'donation' THEN 1 END) as total_donations_given,
        COUNT(CASE WHEN t.buyer_id = ? AND t.transaction_type = 'donation' THEN 1 END) as total_donations_received,
        
        -- Swap statistics
        COUNT(CASE WHEN (t.seller_id = ? OR t.buyer_id = ?) AND t.transaction_type = 'swap' THEN 1 END) as total_swaps,
        
        -- Status statistics
        COUNT(CASE WHEN (t.seller_id = ? OR t.buyer_id = ?) AND t.status = 'completed' THEN 1 END) as successful_transactions,
        COUNT(CASE WHEN (t.seller_id = ? OR t.buyer_id = ?) AND t.status = 'pending' THEN 1 END) as pending_transactions,
        COUNT(CASE WHEN (t.seller_id = ? OR t.buyer_id = ?) AND t.status = 'cancelled' THEN 1 END) as cancelled_transactions,
        
        -- Recent activity
        COUNT(CASE WHEN (t.seller_id = ? OR t.buyer_id = ?) AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as transactions_last_30_days
        
      FROM transactions t
      WHERE t.seller_id = ? OR t.buyer_id = ?
    `;

    const params = Array(16).fill(userId);
    const [result] = await pool.execute(query, params);
    
    return result[0] || {
      total_sales_count: 0,
      total_sales_amount: 0,
      total_purchases_count: 0,
      total_purchases_amount: 0,
      total_donations_given: 0,
      total_donations_received: 0,
      total_swaps: 0,
      successful_transactions: 0,
      pending_transactions: 0,
      cancelled_transactions: 0,
      transactions_last_30_days: 0
    };
  },

  // Get all transactions (admin only)
  async findAll(page = 1, limit = 20, filters = {}) {
    let whereClause = '';
    let queryParams = [];

    // Add filters
    if (filters.transaction_type) {
      whereClause += whereClause ? ' AND ' : ' WHERE ';
      whereClause += 't.transaction_type = ?';
      queryParams.push(filters.transaction_type);
    }

    if (filters.status) {
      whereClause += whereClause ? ' AND ' : ' WHERE ';
      whereClause += 't.status = ?';
      queryParams.push(filters.status);
    }

    if (filters.date_from) {
      whereClause += whereClause ? ' AND ' : ' WHERE ';
      whereClause += 't.created_at >= ?';
      queryParams.push(filters.date_from);
    }

    if (filters.date_to) {
      whereClause += whereClause ? ' AND ' : ' WHERE ';
      whereClause += 't.created_at <= ?';
      queryParams.push(filters.date_to);
    }

    // Count total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM transactions t
      ${whereClause}
    `;

    const [countResult] = await pool.execute(countQuery, queryParams);
    const totalCount = countResult[0].total;

    // Get paginated results
    const offset = (page - 1) * limit;
    const query = `
      SELECT 
        t.*,
        i.title as item_title,
        i.category as item_category,
        seller.username as seller_username,
        seller.name as seller_name,
        buyer.username as buyer_username,
        buyer.name as buyer_name,
        (SELECT image_url FROM item_images WHERE item_id = i.id AND is_primary = 1 LIMIT 1) as item_image
      FROM transactions t
      INNER JOIN items i ON t.item_id = i.id
      INNER JOIN users seller ON t.seller_id = seller.id
      INNER JOIN users buyer ON t.buyer_id = buyer.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [transactions] = await pool.execute(query, [...queryParams, limit, offset]);

    return {
      transactions,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    };
  },

  // Get transactions for specific item
  async findByItemId(itemId) {
    const query = `
      SELECT 
        t.*,
        seller.username as seller_username,
        seller.name as seller_name,
        seller.email as seller_email,
        buyer.username as buyer_username,
        buyer.name as buyer_name,
        buyer.email as buyer_email
      FROM transactions t
      INNER JOIN users seller ON t.seller_id = seller.id
      INNER JOIN users buyer ON t.buyer_id = buyer.id
      WHERE t.item_id = ?
      ORDER BY t.created_at DESC
    `;

    const [transactions] = await pool.execute(query, [itemId]);
    return transactions;
  },

  // Delete/Cancel transaction
  async cancelTransaction(id, userId) {
    // First check if user is authorized and transaction can be cancelled
    const transaction = await this.findById(id);
    
    if (!transaction) {
      return { success: false, message: 'Transaction not found' };
    }

    if (transaction.seller_id !== userId && transaction.buyer_id !== userId) {
      return { success: false, message: 'Not authorized to cancel this transaction' };
    }

    if (transaction.status !== 'pending') {
      return { success: false, message: 'Only pending transactions can be cancelled' };
    }

    // Update status to cancelled
    const updatedTransaction = await this.updateStatus(id, 'cancelled');
    
    if (updatedTransaction) {
      return { success: true, data: updatedTransaction };
    } else {
      return { success: false, message: 'Failed to cancel transaction' };
    }
  }
};

module.exports = Transaction;
