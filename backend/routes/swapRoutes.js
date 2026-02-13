const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Create swap request
router.post('/', swapController.createSwapRequest);

// Get sent swap requests
router.get('/sent', swapController.getSentSwapRequests);

// Get received swap requests
router.get('/received', swapController.getReceivedSwapRequests);

// Get swap request by ID
router.get('/:id', swapController.getSwapRequestById);

// Update swap request status
router.patch('/:id/status', swapController.updateSwapStatus);

// Cancel swap request
router.delete('/:id', swapController.cancelSwapRequest);

module.exports = router;
