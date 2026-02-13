const NGO = require('../models/NGO');
const User = require('../models/User');

// Submit NGO verification request
const submitVerificationRequest = async (req, res, next) => {
  try {
    const { ngo_name, registration_number } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!ngo_name || !registration_number) {
      return res.status(400).json({
        success: false,
        message: 'Please provide NGO name and registration number'
      });
    }

    // Check if user already has a verification request
    const existingRequest = await NGO.hasVerificationRequest(userId);
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending verification request'
      });
    }

    // Handle document upload (if provided)
    let documentsUrl = null;
    if (req.file) {
      documentsUrl = `/uploads/${req.file.filename}`;
    }

    // Create verification request
    const verificationData = {
      user_id: userId,
      ngo_name,
      registration_number,
      documents_url: documentsUrl
    };

    const verificationId = await NGO.createVerificationRequest(verificationData);

    res.status(201).json({
      success: true,
      message: 'NGO verification request submitted successfully',
      data: { verificationId }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's verification status
const getVerificationStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const verification = await NGO.getByUserId(userId);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'No verification request found'
      });
    }

    res.status(200).json({
      success: true,
      data: verification
    });
  } catch (error) {
    next(error);
  }
};

// Get all verified NGOs (public)
const getVerifiedNGOs = async (req, res, next) => {
  try {
    const ngos = await NGO.getVerifiedNGOs();

    res.status(200).json({
      success: true,
      count: ngos.length,
      data: ngos
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all verification requests
const getAllVerifications = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    const verifications = await NGO.getAllVerifications(status);

    res.status(200).json({
      success: true,
      count: verifications.length,
      data: verifications
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get pending verifications
const getPendingVerifications = async (req, res, next) => {
  try {
    const verifications = await NGO.getPendingVerifications();

    res.status(200).json({
      success: true,
      count: verifications.length,
      data: verifications
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Approve/Reject verification
const updateVerificationStatus = async (req, res, next) => {
  try {
    const { verificationId } = req.params;
    const { status } = req.body;
    const adminId = req.user.id;

    // Validate status
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "verified" or "rejected"'
      });
    }

    const updated = await NGO.updateVerificationStatus(verificationId, status, adminId);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `NGO verification ${status} successfully`
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete verification request
const deleteVerification = async (req, res, next) => {
  try {
    const { verificationId } = req.params;

    const deleted = await NGO.deleteVerification(verificationId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification request deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitVerificationRequest,
  getVerificationStatus,
  getVerifiedNGOs,
  getAllVerifications,
  getPendingVerifications,
  updateVerificationStatus,
  deleteVerification
};