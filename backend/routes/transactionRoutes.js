const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getMyTransactions,
  getTransactionById,
  updateTransactionStatus,
  getTransactionStats,
  cancelTransaction,
  getTransactionHistory,
  getAllTransactions
} = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// All transaction routes require authentication
router.use(verifyToken);

// POST /api/transactions - Create a new transaction (protected)
// Body: item_id, buyer_id (optional), swap_partner_id (for swaps), transaction_type
router.post('/', createTransaction);

// GET /api/transactions - Get current user's transactions with filtering (protected)
// Query params: role (all|buyer|seller), page, limit, transaction_type, status, date_from, date_to
router.get('/', getMyTransactions);

// GET /api/transactions/stats - Get user's transaction statistics (protected)
// Returns sales, purchases, donations, swaps statistics
router.get('/stats', getTransactionStats);

// GET /api/transactions/history - Get complete transaction history with filters (protected)
// Query params: transaction_type, status, date_from, date_to
router.get('/history', getTransactionHistory);

// GET /api/transactions/all - Get all transactions (admin only)
// Query params: page, limit, transaction_type, status, date_from, date_to
router.get('/all', isAdmin, getAllTransactions);

// GET /api/transactions/:id - Get single transaction by ID (protected)
// Params: id
// Only accessible by buyer or seller of the transaction
router.get('/:id', getTransactionById);

// PATCH /api/transactions/:id/status - Update transaction status (protected)
// Params: id
// Body: status (pending, completed, cancelled)
// Only buyer or seller can update
router.patch('/:id/status', updateTransactionStatus);

// DELETE /api/transactions/:id - Cancel transaction (protected)
// Params: id
// Only pending transactions can be cancelled
// Only buyer or seller can cancel
router.delete('/:id', cancelTransaction);

module.exports = router;
