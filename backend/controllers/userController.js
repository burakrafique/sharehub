const User = require('../models/User');
const Item = require('../models/Item');
const bcrypt = require('bcryptjs');

// Get current user's profile (protected)
const getCurrentUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find user by id
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    delete user.password_hash;

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, latitude, longitude } = req.body;

    // Validate at least one field is provided
    if (!name && !phone && !address && !latitude && !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update'
      });
    }

    // Build update data object
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (latitude) updateData.latitude = parseFloat(latitude);
    if (longitude) updateData.longitude = parseFloat(longitude);

    // Update user
    const affectedRows = await User.update(userId, updateData);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fetch updated user data
    const updatedUser = await User.findById(userId);
    
    // Remove password from response
    delete updatedUser.password_hash;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Change user password
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Find user by id
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    await User.update(userId, { password_hash: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user's items
const getUserItems = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const items = await Item.findByUserId(userId);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile (public)
const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find user by id
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's available items count
    const userItems = await Item.findByUserId(id);
    const availableItemsCount = userItems.filter(item => item.status === 'available').length;

    // Return only public information
    const publicProfile = {
      id: user.id,
      name: user.name,
      role: user.role,
      address: user.address,
      created_at: user.created_at,
      availableItemsCount
    };

    res.status(200).json({
      success: true,
      data: publicProfile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentUserProfile,
  updateProfile,
  changePassword,
  getUserItems,
  getUserProfile
};
