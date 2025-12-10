const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getUserTransactions,
  getTransactionById,
  updateTransactionStatus
} = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/authMiddleware');

// All transaction routes require authentication
router.use(verifyToken);

// POST /api/transactions - Create a new transaction (protected)
// Body: item_id, transaction_type, amount (for sell)
router.post('/', createTransaction);

// GET /api/transactions - Get current user's transactions (protected)
// Returns all transactions where user is buyer or seller
router.get('/', getUserTransactions);

// GET /api/transactions/:id - Get single transaction by ID (protected)
// Params: id
// Only accessible by buyer or seller of the transaction
router.get('/:id', getTransactionById);

// PUT /api/transactions/:id/status - Update transaction status (protected)
// Params: id
// Body: status (pending, completed, cancelled)
// Only buyer or seller can update
router.put('/:id/status', updateTransactionStatus);

module.exports = router;
