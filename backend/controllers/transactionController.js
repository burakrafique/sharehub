const Transaction = require('../models/Transaction');
const Item = require('../models/Item');
const User = require('../models/User');

// Create a new transaction
const createTransaction = async (req, res, next) => {
  try {
    const { item_id, transaction_type, amount } = req.body;
    const buyer_id = req.user.id;

    // Validate required fields
    if (!item_id || !transaction_type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide item_id and transaction_type'
      });
    }

    // Validate transaction type
    const validTypes = ['sell', 'donate', 'exchange'];
    if (!validTypes.includes(transaction_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction type. Must be sell, donate, or exchange'
      });
    }

    // Find item
    const item = await Item.findById(item_id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if item is available
    if (item.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Item is not available for transaction'
      });
    }

    // Check if buyer is not the seller
    if (item.user_id === buyer_id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create transaction for your own item'
      });
    }

    // Validate amount for sell transactions
    if (transaction_type === 'sell' && (!amount || amount <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required for sell transactions'
      });
    }

    // Create transaction
    const transactionData = {
      item_id,
      seller_id: item.user_id,
      buyer_id,
      transaction_type,
      amount: transaction_type === 'sell' ? amount : 0
    };

    const newTransaction = await Transaction.create(transactionData);

    // Update item status to pending
    await Item.update(item_id, { status: 'pending' });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: newTransaction
    });
  } catch (error) {
    next(error);
  }
};

// Get user's transaction history
const getUserTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.findByUserId(userId);

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// Update transaction status
const updateTransactionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, completed, or cancelled'
      });
    }

    // Update transaction
    const updatedTransaction = await Transaction.updateStatus(id, status, userId);

    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Update item status based on transaction status
    if (status === 'completed') {
      await Item.update(updatedTransaction.item_id, { status: 'sold' });
    } else if (status === 'cancelled') {
      await Item.update(updatedTransaction.item_id, { status: 'available' });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction status updated successfully',
      data: updatedTransaction
    });
  } catch (error) {
    if (error.message === 'Not authorized to update this transaction') {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// Get single transaction by ID
const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user is part of the transaction
    if (transaction.seller_id !== userId && transaction.buyer_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this transaction'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getUserTransactions,
  updateTransactionStatus,
  getTransactionById
};
