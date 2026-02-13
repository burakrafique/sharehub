const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');
const { validationResult } = require('express-validator');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, username, password, full_name, phone_number, role, address, location_latitude, location_longitude } = req.body;

    const existingEmailUser = await User.findByEmail(email);
    if (existingEmailUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const existingUsernameUser = await User.findByUsername(username);
    if (existingUsernameUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }

    const userData = {
      email,
      username,
      password,
      full_name,
      phone_number,
      role: role || 'user',
      address,
      location_latitude: location_latitude ? parseFloat(location_latitude) : null,
      location_longitude: location_longitude ? parseFloat(location_longitude) : null
    };

    const newUser = await User.createUser(userData);

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name,
        phone_number: newUser.phone_number,
        role: newUser.role,
        address: newUser.address,
        location_latitude: newUser.location_latitude,
        location_longitude: newUser.location_longitude,
        is_active: newUser.is_active,
        created_at: newUser.created_at
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error.message);
    
    if (error.message.includes('Email already exists')) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    if (error.message.includes('Username already exists')) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }

    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    const isPasswordValid = await User.validatePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ User logged in: ${user.username} (${user.email})`);
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        profile_image: user.profile_image,
        role: user.role,
        address: user.address,
        location_latitude: user.location_latitude,
        location_longitude: user.location_longitude,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error.message);
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userStats = await User.getUserStats(userId);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        profile_image: user.profile_image,
        role: user.role,
        address: user.address,
        location_latitude: user.location_latitude,
        location_longitude: user.location_longitude,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
        stats: userStats || {
          total_items: 0,
          active_items: 0,
          sales_count: 0,
          purchases_count: 0,
          favorites_count: 0
        }
      }
    });

  } catch (error) {
    console.error('❌ Get current user error:', error.message);
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { full_name, phone_number, address, location_latitude, location_longitude, username } = req.body;

    const updateData = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone_number !== undefined) updateData.phone_number = phone_number;
    if (address !== undefined) updateData.address = address;
    if (location_latitude !== undefined) updateData.location_latitude = parseFloat(location_latitude);
    if (location_longitude !== undefined) updateData.location_longitude = parseFloat(location_longitude);
    if (username !== undefined) updateData.username = username;

    if (username && username !== req.user.username) {
      const usernameExists = await User.usernameExists(username, userId);
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    const updatedUser = await User.updateUser(userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Update profile error:', error.message);
    
    if (error.message.includes('Username already exists')) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }

    if (error.message.includes('No valid fields to update')) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update'
      });
    }

    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByIdWithPassword(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isCurrentPasswordValid = await User.validatePassword(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const isSamePassword = await User.validatePassword(newPassword, user.password_hash);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    await User.updatePassword(userId, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('❌ Change password error:', error.message);
    next(error);
  }
};

const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully. Please remove token from client storage.'
  });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout
};