const Notification = require('../models/Notification');

// Get user's notifications
const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit } = req.query;

    const notifications = await Notification.getUserNotifications(
      userId,
      limit ? parseInt(limit) : 50
    );

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// Mark specific notifications as read
const markAsRead = async (req, res, next) => {
  try {
    const { notificationIds } = req.body;

    // Validate notificationIds
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of notification IDs'
      });
    }

    const updatedCount = await Notification.markAsRead(notificationIds);

    res.status(200).json({
      success: true,
      message: `${updatedCount} notification(s) marked as read`,
      count: updatedCount
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read for current user
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const updatedCount = await Notification.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: `${updatedCount} notification(s) marked as read`,
      count: updatedCount
    });
  } catch (error) {
    next(error);
  }
};

// Get unread notification count
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const count = await Notification.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    next(error);
  }
};

// Delete a notification
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide notification ID'
      });
    }

    const deleted = await Notification.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
};
