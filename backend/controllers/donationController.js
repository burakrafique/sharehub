const Donation = require('../models/Donation');
const Notification = require('../models/Notification');

// Create a new donation
exports.createDonation = async (req, res) => {
  try {
    const { ngo_id, item_id, message } = req.body;
    const donor_id = req.user.id;

    if (!ngo_id || !item_id) {
      return res.status(400).json({
        success: false,
        message: 'NGO ID and Item ID are required'
      });
    }

    const donation = await Donation.create({
      donor_id,
      ngo_id,
      item_id,
      message
    });

    // Get full donation details
    const fullDonation = await Donation.findById(donation.id);

    // Create notification for NGO
    await Notification.create({
      user_id: ngo_id,
      type: 'donation_received',
      title: 'New Donation',
      message: `${fullDonation.donor_name} wants to donate: ${fullDonation.item_title}`,
      related_id: donation.id
    });

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: fullDonation
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create donation',
      error: error.message
    });
  }
};

// Get user's donations
exports.getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.findByDonorId(req.user.id);

    res.json({
      success: true,
      data: donations
    });
  } catch (error) {
    console.error('Get user donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations',
      error: error.message
    });
  }
};

// Get donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Verify user is involved in this donation
    if (donation.donor_id !== req.user.id && donation.ngo_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this donation'
      });
    }

    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation',
      error: error.message
    });
  }
};

// Update donation status
exports.updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updatedDonation = await Donation.updateStatus(id, status);

    if (!updatedDonation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Create notification for donor
    await Notification.create({
      user_id: updatedDonation.donor_id,
      type: 'donation_status',
      title: `Donation ${status}`,
      message: `Your donation "${updatedDonation.item_title}" has been ${status}`,
      related_id: id
    });

    res.json({
      success: true,
      message: `Donation ${status} successfully`,
      data: updatedDonation
    });
  } catch (error) {
    console.error('Update donation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update donation status',
      error: error.message
    });
  }
};

// Get all verified NGOs
exports.getVerifiedNGOs = async (req, res) => {
  try {
    const ngos = await Donation.getVerifiedNGOs();

    res.json({
      success: true,
      data: ngos
    });
  } catch (error) {
    console.error('Get verified NGOs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NGOs',
      error: error.message
    });
  }
};
