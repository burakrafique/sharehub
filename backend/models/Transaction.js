const { promisePool: pool } = require('../config/database');

const Transaction = {
  // Create a new transaction
  async create(transactionData) {
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
      amount || 0
    ]);

    return {
      id: result.insertId,
      ...transactionData,
      status: 'pending',
      created_at: new Date()
    };
  },

  // Find transaction by ID with details
  async findById(id) {
    const query = `
      SELECT 
        transactions.*,
        items.title as item_title,
        items.category as item_category,
        seller.name as seller_name,
        seller.email as seller_email,
        seller.phone as seller_phone,
        buyer.name as buyer_name,
        buyer.email as buyer_email,
        buyer.phone as buyer_phone
      FROM transactions
      INNER JOIN items ON transactions.item_id = items.id
      INNER JOIN users as seller ON transactions.seller_id = seller.id
      INNER JOIN users as buyer ON transactions.buyer_id = buyer.id
      WHERE transactions.id = ?
    `;

    const [transactions] = await pool.execute(query, [id]);
    return transactions.length > 0 ? transactions[0] : null;
  },

  // Get user's transactions (as buyer or seller)
  async findByUserId(userId) {
    const query = `
      SELECT 
        transactions.*,
        items.title as item_title,
        items.category as item_category,
        seller.name as seller_name,
        buyer.name as buyer_name,
        CASE 
          WHEN transactions.seller_id = ? THEN 'seller'
          ELSE 'buyer'
        END as user_role
      FROM transactions
      INNER JOIN items ON transactions.item_id = items.id
      INNER JOIN users as seller ON transactions.seller_id = seller.id
      INNER JOIN users as buyer ON transactions.buyer_id = buyer.id
      WHERE transactions.seller_id = ? OR transactions.buyer_id = ?
      ORDER BY transactions.created_at DESC
    `;

    const [transactions] = await pool.execute(query, [userId, userId, userId]);
    return transactions;
  },

  // Update transaction status
  async updateStatus(id, status, userId) {
    // First check if user is part of the transaction
    const transaction = await this.findById(id);
    
    if (!transaction) {
      return null;
    }

    if (transaction.seller_id !== userId && transaction.buyer_id !== userId) {
      throw new Error('Not authorized to update this transaction');
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

  // Get all transactions (admin)
  async findAll() {
    const query = `
      SELECT 
        transactions.*,
        items.title as item_title,
        seller.name as seller_name,
        buyer.name as buyer_name
      FROM transactions
      INNER JOIN items ON transactions.item_id = items.id
      INNER JOIN users as seller ON transactions.seller_id = seller.id
      INNER JOIN users as buyer ON transactions.buyer_id = buyer.id
      ORDER BY transactions.created_at DESC
    `;

    const [transactions] = await pool.execute(query);
    return transactions;
  },

  // Get transactions for specific item
  async findByItemId(itemId) {
    const query = `
      SELECT 
        transactions.*,
        seller.name as seller_name,
        seller.email as seller_email,
        buyer.name as buyer_name,
        buyer.email as buyer_email
      FROM transactions
      INNER JOIN users as seller ON transactions.seller_id = seller.id
      INNER JOIN users as buyer ON transactions.buyer_id = buyer.id
      WHERE transactions.item_id = ?
      ORDER BY transactions.created_at DESC
    `;

    const [transactions] = await pool.execute(query, [itemId]);
    return transactions;
  }
};

module.exports = Transaction;
