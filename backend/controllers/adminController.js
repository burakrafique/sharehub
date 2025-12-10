const User = require('../models/User');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const { promisePool: pool } = require('../config/database');

// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, phone, role, address, created_at FROM users ORDER BY created_at DESC'
    );

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Get all items (admin only)
const getAllItemsAdmin = async (req, res, next) => {
  try {
    const [items] = await pool.execute(`
      SELECT 
        items.*,
        users.name as owner_name,
        users.email as owner_email
      FROM items
      INNER JOIN users ON items.user_id = users.id
      ORDER BY items.created_at DESC
    `);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// Get all transactions (admin only)
const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll();

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['user', 'admin', 'ngo'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user, admin, or ngo'
      });
    }

    // Update user role
    await User.update(userId, { role });

    const updatedUser = await User.findById(userId);
    delete updatedUser.password_hash;

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete item (admin only)
const deleteItemAdmin = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const deleted = await Item.delete(itemId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get platform statistics (admin only)
const getPlatformStats = async (req, res, next) => {
  try {
    const [userStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as regular_users,
        SUM(CASE WHEN role = 'ngo' THEN 1 ELSE 0 END) as ngo_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_users
      FROM users
    `);

    const [itemStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_items,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_items,
        SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold_items,
        SUM(CASE WHEN category = 'clothes' THEN 1 ELSE 0 END) as clothes_items,
        SUM(CASE WHEN category = 'books' THEN 1 ELSE 0 END) as books_items,
        SUM(CASE WHEN category = 'ration' THEN 1 ELSE 0 END) as ration_items
      FROM items
    `);

    const [transactionStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_transactions,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_transactions,
        SUM(amount) as total_amount
      FROM transactions
    `);

    res.status(200).json({
      success: true,
      stats: {
        users: userStats[0],
        items: itemStats[0],
        transactions: transactionStats[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getAllItemsAdmin,
  getAllTransactions,
  updateUserRole,
  deleteUser,
  deleteItemAdmin,
  getPlatformStats
};
