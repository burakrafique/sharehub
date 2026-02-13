const { promisePool } = require('../config/database');
const bcrypt = require('bcryptjs');

// ============================================
// ShareHub Backend - User Model
// Handles all user-related database operations
// ============================================

const User = {
  // ============================================
  // Create new user with hashed password
  // ============================================
  async createUser(userData) {
    const {
      username,
      email,
      password,
      full_name,
      phone_number,
      role = 'user',
      location_latitude,
      location_longitude,
      address
    } = userData;

    try {
      // Hash password with 10 salt rounds
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users (
          username, email, password_hash, full_name, phone_number, 
          role, location_latitude, location_longitude, address, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true)
      `;

      const [result] = await promisePool.execute(query, [
        username,
        email,
        password_hash,
        full_name || null,
        phone_number || null,
        role,
        location_latitude || null,
        location_longitude || null,
        address || null
      ]);

      // Return the created user (without password)
      return {
        id: result.insertId,
        username,
        email,
        full_name,
        phone_number,
        role,
        location_latitude,
        location_longitude,
        address,
        is_active: true,
        created_at: new Date()
      };
    } catch (error) {
      // Handle duplicate entry errors
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('email')) {
          throw new Error('Email already exists');
        }
        if (error.message.includes('username')) {
          throw new Error('Username already exists');
        }
        throw new Error('User already exists');
      }
      throw error;
    }
  },

  // ============================================
  // Find user by email
  // ============================================
  async findByEmail(email) {
    try {
      const query = `
        SELECT id, username, email, password_hash, full_name, phone_number, 
               profile_image, role, location_latitude, location_longitude, 
               address, is_active, created_at, updated_at
        FROM users 
        WHERE email = ?
      `;

      const [users] = await promisePool.execute(query, [email]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // Find user by username
  // ============================================
  async findByUsername(username) {
    try {
      const query = `
        SELECT id, username, email, password_hash, full_name, phone_number, 
               profile_image, role, location_latitude, location_longitude, 
               address, is_active, created_at, updated_at
        FROM users 
        WHERE username = ?
      `;

      const [users] = await promisePool.execute(query, [username]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // Find user by ID
  // ============================================
  async findById(id) {
    try {
      const query = `
        SELECT id, username, email, full_name, phone_number, 
               profile_image, role, location_latitude, location_longitude, 
               address, is_active, created_at, updated_at
        FROM users 
        WHERE id = ?
      `;

      const [users] = await promisePool.execute(query, [id]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // Find user by ID (including password hash for authentication)
  // ============================================
  async findByIdWithPassword(id) {
    try {
      const query = `
        SELECT id, username, email, password_hash, full_name, phone_number, 
               profile_image, role, location_latitude, location_longitude, 
               address, is_active, created_at, updated_at
        FROM users 
        WHERE id = ?
      `;

      const [users] = await promisePool.execute(query, [id]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // Update user profile
  // ============================================
  async updateUser(id, userData) {
    const allowedFields = [
      'username',
      'full_name',
      'phone_number',
      'profile_image',
      'location_latitude',
      'location_longitude',
      'address'
    ];

    const updates = [];
    const params = [];

    // Build dynamic UPDATE query based on provided fields
    Object.keys(userData).forEach(key => {
      if (allowedFields.includes(key) && userData[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(userData[key]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    try {
      params.push(id);

      const query = `
        UPDATE users 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND is_active = true
      `;

      const [result] = await promisePool.execute(query, params);

      if (result.affectedRows === 0) {
        throw new Error('User not found or inactive');
      }

      // Return updated user
      return await this.findById(id);
    } catch (error) {
      // Handle duplicate entry errors
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('username')) {
          throw new Error('Username already exists');
        }
        throw new Error('Duplicate entry error');
      }
      throw error;
    }
  },

  // ============================================
  // Update user password
  // ============================================
  async updatePassword(id, newPassword) {
    try {
      // Hash new password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(newPassword, saltRounds);

      const query = `
        UPDATE users 
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND is_active = true
      `;

      const [result] = await promisePool.execute(query, [password_hash, id]);

      if (result.affectedRows === 0) {
        throw new Error('User not found or inactive');
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // Soft delete user (set is_active = false)
  // ============================================
  async deleteUser(id) {
    try {
      const query = `
        UPDATE users 
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const [result] = await promisePool.execute(query, [id]);

      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // Validate password using bcrypt
  // ============================================
  async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // Check if email exists
  // ============================================
  async emailExists(email, excludeId = null) {
    try {
      let query = 'SELECT id FROM users WHERE email = ?';
      let params = [email];

      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }

      const [users] = await promisePool.execute(query, params);
      return users.length > 0;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // Check if username exists
  // ============================================
  async usernameExists(username, excludeId = null) {
    try {
      let query = 'SELECT id FROM users WHERE username = ?';
      let params = [username];

      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }

      const [users] = await promisePool.execute(query, params);
      return users.length > 0;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // Get user statistics
  // ============================================
  async getUserStats(userId) {
    try {
      const query = `
        SELECT 
          u.id,
          u.username,
          u.full_name,
          u.created_at,
          COUNT(DISTINCT i.id) as total_items,
          COUNT(DISTINCT CASE WHEN i.status = 'available' THEN i.id END) as active_items,
          COUNT(DISTINCT t1.id) as sales_count,
          COUNT(DISTINCT t2.id) as purchases_count,
          COUNT(DISTINCT f.id) as favorites_count
        FROM users u
        LEFT JOIN items i ON u.id = i.user_id AND i.is_active = true
        LEFT JOIN transactions t1 ON u.id = t1.seller_id AND t1.status = 'completed'
        LEFT JOIN transactions t2 ON u.id = t2.buyer_id AND t2.status = 'completed'
        LEFT JOIN favorites f ON u.id = f.user_id
        WHERE u.id = ? AND u.is_active = true
        GROUP BY u.id
      `;

      const [stats] = await promisePool.execute(query, [userId]);
      return stats.length > 0 ? stats[0] : null;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // Get all users (admin only)
  // ============================================
  async getAllUsers(limit = 50, offset = 0) {
    try {
      const query = `
        SELECT id, username, email, full_name, phone_number, 
               role, is_active, created_at, updated_at
        FROM users 
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;

      const [users] = await promisePool.execute(query, [limit, offset]);
      return users;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // Search users by name or email
  // ============================================
  async searchUsers(searchTerm, limit = 20) {
    try {
      const query = `
        SELECT id, username, email, full_name, profile_image, role
        FROM users 
        WHERE (full_name LIKE ? OR username LIKE ? OR email LIKE ?) 
          AND is_active = true
        ORDER BY full_name ASC
        LIMIT ?
      `;

      const searchPattern = `%${searchTerm}%`;
      const [users] = await promisePool.execute(query, [
        searchPattern, searchPattern, searchPattern, limit
      ]);
      
      return users;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = User;