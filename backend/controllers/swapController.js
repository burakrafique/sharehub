const SwapRequest = require('../models/SwapRequest');
const Notification = require('../models/Notification');

// Create a new swap request
exports.createSwapRequest = async (req, res) => {
  try {
    const { item_id, offered_item_id, message } = req.body;
    const requester_id = req.user.id;

    // Validate required fields
    if (!item_id) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }

    const swapRequest = await SwapRequest.create({
      requester_id,
      item_id,
      offered_item_id,
      message
    });

    // Get the full swap request details
    const fullRequest = await SwapRequest.findById(swapRequest.id);

    // Create notification for item owner
    await Notification.create({
      user_id: fullRequest.owner_id,
      type: 'swap_request',
      title: 'New Swap Request',
      message: `${fullRequest.requester_name} wants to swap for your item: ${fullRequest.requested_item_title}`,
      related_id: swapRequest.id
    });

    res.status(201).json({
      success: true,
      message: 'Swap request created successfully',
      data: fullRequest
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create swap request',
      error: error.message
    });
  }
};

// Get user's sent swap requests
exports.getSentSwapRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.findByRequesterId(req.user.id);

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get sent swap requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch swap requests',
      error: error.message
    });
  }
};

// Get user's received swap requests
exports.getReceivedSwapRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.findByOwnerId(req.user.id);

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get received swap requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch swap requests',
      error: error.message
    });
  }
};

// Get swap request by ID
exports.getSwapRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await SwapRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Verify user is involved in this swap
    if (request.requester_id !== req.user.id && request.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this swap request'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get swap request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch swap request',
      error: error.message
    });
  }
};

// Update swap request status (accept/reject)
exports.updateSwapStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "accepted" or "rejected"'
      });
    }

    const updatedRequest = await SwapRequest.updateStatus(id, status, req.user.id);

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found or not authorized'
      });
    }

    // Create notification for requester
    await Notification.create({
      user_id: updatedRequest.requester_id,
      type: 'swap_response',
      title: `Swap Request ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
      message: `Your swap request for "${updatedRequest.requested_item_title}" has been ${status}`,
      related_id: id
    });

    res.json({
      success: true,
      message: `Swap request ${status} successfully`,
      data: updatedRequest
    });
  } catch (error) {
    console.error('Update swap status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update swap request',
      error: error.message
    });
  }
};

// Cancel swap request
exports.cancelSwapRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SwapRequest.delete(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found or not authorized'
      });
    }

    res.json({
      success: true,
      message: 'Swap request cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel swap request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel swap request',
      error: error.message
    });
  }
};
