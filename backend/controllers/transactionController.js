const Transaction = require('../models/Transaction');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

// Create a new transaction
const createTransaction = async (req, res, next) => {
  try {
    const { item_id, buyer_id, swap_partner_id, transaction_type } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!item_id || !transaction_type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide item_id and transaction_type'
      });
    }

    // Validate transaction type
    const validTypes = ['sale', 'donation', 'swap'];
    if (!validTypes.includes(transaction_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction type. Must be sale, donation, or swap'
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

    // Validate listing type matches transaction type
    const typeMapping = {
      'sale': 'sell',
      'donation': 'donate',
      'swap': 'swap'
    };

    if (item.listing_type !== typeMapping[transaction_type]) {
      return res.status(400).json({
        success: false,
        message: `Item is listed for ${item.listing_type}, cannot create ${transaction_type} transaction`
      });
    }

    // Determine buyer and validate
    let finalBuyerId;
    if (transaction_type === 'swap') {
      finalBuyerId = swap_partner_id;
      if (!swap_partner_id) {
        return res.status(400).json({
          success: false,
          message: 'swap_partner_id is required for swap transactions'
        });
      }
    } else {
      finalBuyerId = buyer_id || userId;
    }

    // Check if buyer is not the seller
    if (item.user_id === finalBuyerId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create transaction for your own item'
      });
    }

    // Create transaction
    const transactionData = {
      item_id,
      seller_id: item.user_id,
      buyer_id: finalBuyerId,
      transaction_type,
      amount: transaction_type === 'sale' ? item.price : null
    };

    const newTransaction = await Transaction.createTransaction(transactionData);

    // Update item status to pending
    await Item.update(item_id, { status: 'pending' });

    // Create notifications for both parties
    const notificationData = {
      user_id: item.user_id,
      type: 'transaction_created',
      title: `New ${transaction_type} request`,
      message: `Someone wants to ${transaction_type === 'sale' ? 'buy' : transaction_type === 'donation' ? 'receive' : 'swap'} your item "${item.title}"`,
      related_id: newTransaction.id,
      related_type: 'transaction'
    };

    await Notification.create(notificationData);

    // Notification for buyer
    const buyerNotificationData = {
      user_id: finalBuyerId,
      type: 'transaction_created',
      title: `Transaction request sent`,
      message: `Your ${transaction_type} request for "${item.title}" has been sent`,
      related_id: newTransaction.id,
      related_type: 'transaction'
    };

    await Notification.create(buyerNotificationData);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: newTransaction
    });
  } catch (error) {
    next(error);
  }
};

// Get user's transactions with filtering and pagination
const getMyTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { 
      role = 'all', 
      page = 1, 
      limit = 10,
      transaction_type,
      status,
      date_from,
      date_to
    } = req.query;

    // Validate role
    const validRoles = ['all', 'buyer', 'seller'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be all, buyer, or seller'
      });
    }

    const result = await Transaction.findByUser(
      userId, 
      role, 
      parseInt(page), 
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: {
        transactions: result.transactions,
        pagination: {
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage
        }
      }
    });
  } catch (error) {
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

    // Get current transaction
    const currentTransaction = await Transaction.findById(id);
    if (!currentTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Update transaction
    const updatedTransaction = await Transaction.updateStatus(id, status, userId);

    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or not authorized'
      });
    }

    // Update item status based on transaction status
    let itemStatus;
    if (status === 'completed') {
      switch (updatedTransaction.transaction_type) {
        case 'sale':
          itemStatus = 'sold';
          break;
        case 'donation':
          itemStatus = 'donated';
          break;
        case 'swap':
          itemStatus = 'swapped';
          break;
        default:
          itemStatus = 'sold';
      }
    } else if (status === 'cancelled') {
      itemStatus = 'available';
    }

    if (itemStatus) {
      await Item.update(updatedTransaction.item_id, { status: itemStatus });
    }

    // Create notifications
    const otherUserId = updatedTransaction.seller_id === userId 
      ? updatedTransaction.buyer_id 
      : updatedTransaction.seller_id;

    const notificationData = {
      user_id: otherUserId,
      type: 'transaction_updated',
      title: `Transaction ${status}`,
      message: `Transaction for "${updatedTransaction.item_title}" has been ${status}`,
      related_id: updatedTransaction.id,
      related_type: 'transaction'
    };

    await Notification.create(notificationData);

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

// Get transaction statistics
const getTransactionStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const stats = await Transaction.getTransactionStats(userId);

    res.status(200).json({
      success: true,
      data: {
        sales: {
          count: stats.total_sales_count,
          amount: parseFloat(stats.total_sales_amount)
        },
        purchases: {
          count: stats.total_purchases_count,
          amount: parseFloat(stats.total_purchases_amount)
        },
        donations: {
          given: stats.total_donations_given,
          received: stats.total_donations_received
        },
        swaps: {
          count: stats.total_swaps
        },
        summary: {
          successful_transactions: stats.successful_transactions,
          pending_transactions: stats.pending_transactions,
          cancelled_transactions: stats.cancelled_transactions,
          transactions_last_30_days: stats.transactions_last_30_days
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cancel transaction
const cancelTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await Transaction.cancelTransaction(id, userId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Revert item status to available
    await Item.update(result.data.item_id, { status: 'available' });

    // Create notification
    const otherUserId = result.data.seller_id === userId 
      ? result.data.buyer_id 
      : result.data.seller_id;

    const notificationData = {
      user_id: otherUserId,
      type: 'transaction_cancelled',
      title: 'Transaction cancelled',
      message: `Transaction for "${result.data.item_title}" has been cancelled`,
      related_id: result.data.id,
      related_type: 'transaction'
    };

    await Notification.create(notificationData);

    res.status(200).json({
      success: true,
      message: 'Transaction cancelled successfully',
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

// Get transaction history with filters (extended version of getMyTransactions)
const getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const filters = {
      transaction_type: req.query.transaction_type,
      status: req.query.status,
      date_from: req.query.date_from,
      date_to: req.query.date_to
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    const transactions = await Transaction.getTransactionHistory(userId, filters);

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all transactions
const getAllTransactions = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      transaction_type,
      status,
      date_from,
      date_to
    } = req.query;

    const filters = {
      transaction_type,
      status,
      date_from,
      date_to
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    const result = await Transaction.findAll(
      parseInt(page), 
      parseInt(limit), 
      filters
    );

    res.status(200).json({
      success: true,
      data: {
        transactions: result.transactions,
        pagination: {
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getMyTransactions,
  getTransactionById,
  updateTransactionStatus,
  getTransactionStats,
  cancelTransaction,
  getTransactionHistory,
  getAllTransactions
};
