const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Get verified NGOs (public for authenticated users)
router.get('/ngos', donationController.getVerifiedNGOs);

// Create donation
router.post('/', donationController.createDonation);

// Get user's donations
router.get('/my-donations', donationController.getUserDonations);

// Get donation by ID
router.get('/:id', donationController.getDonationById);

// Update donation status
router.patch('/:id/status', donationController.updateDonationStatus);

module.exports = router;
