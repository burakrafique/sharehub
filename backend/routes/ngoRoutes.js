const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyAdmin } = require('../middleware/adminMiddleware');
const multer = require('multer');

// Configure multer for document uploads
const upload = multer({
  dest: 'uploads/documents/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for documents
  }
});

// Public routes
router.get('/verified', ngoController.getVerifiedNGOs);

// Protected routes (require authentication)
router.use(verifyToken);

// User routes
router.post('/verify', upload.single('documents'), ngoController.submitVerificationRequest);
router.get('/verification-status', ngoController.getVerificationStatus);

// Admin routes
router.get('/verifications', verifyAdmin, ngoController.getAllVerifications);
router.get('/verifications/pending', verifyAdmin, ngoController.getPendingVerifications);
router.put('/verifications/:verificationId/status', verifyAdmin, ngoController.updateVerificationStatus);
router.delete('/verifications/:verificationId', verifyAdmin, ngoController.deleteVerification);

module.exports = router;