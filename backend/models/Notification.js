const { promisePool: pool } = require('../config/database');

const Notification = {
  // Create a new notification
  async create(notificationData) {
    const { user_id, type, title, message, related_id } = notificationData;

    const query = `
      INSERT INTO notifications (user_id, type, title, message, related_id, is_read)
      VALUES (?, ?, ?, ?, ?, false)
    `;

    const [result] = await pool.execute(query, [
      user_id,
      type,
      title,
      message,
      related_id || null
    ]);

    return {
      id: result.insertId,
      ...notificationData,
      is_read: false,
      created_at: new Date()
    };
  },

  // Get user's notifications
  async getUserNotifications(userId, limit = 50) {
    const query = `
      SELECT *
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;

    const [notifications] = await pool.execute(query, [userId, limit]);
    return notifications;
  },

  // Mark specific notifications as read
  async markAsRead(notificationIds) {
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return 0;
    }

    const placeholders = notificationIds.map(() => '?').join(',');
    const query = `
      UPDATE notifications
      SET is_read = true
      WHERE id IN (${placeholders})
    `;

    const [result] = await pool.execute(query, notificationIds);
    return result.affectedRows;
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    const query = `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = ? AND is_read = false
    `;

    const [result] = await pool.execute(query, [userId]);
    return result.affectedRows;
  },

  // Get unread notification count
  async getUnreadCount(userId) {
    const query = `
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ? AND is_read = false
    `;

    const [result] = await pool.execute(query, [userId]);
    return result[0].count;
  },

  // Delete a notification
  async delete(notificationId) {
    const query = `
      DELETE FROM notifications
      WHERE id = ?
    `;

    const [result] = await pool.execute(query, [notificationId]);
    return result.affectedRows > 0;
  },

  // Delete all notifications for a user
  async deleteAllForUser(userId) {
    const query = `
      DELETE FROM notifications
      WHERE user_id = ?
    `;

    const [result] = await pool.execute(query, [userId]);
    return result.affectedRows;
  }
};

module.exports = Notification;
