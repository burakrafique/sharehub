const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
} = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/authMiddleware');

// All notification routes require authentication
router.use(verifyToken);

// GET /api/notifications - Get user's notifications (protected)
// Query params: limit (optional, default 50)
router.get('/', getUserNotifications);

// GET /api/notifications/unread-count - Get unread notification count (protected)
router.get('/unread-count', getUnreadCount);

// PUT /api/notifications/mark-read - Mark specific notifications as read (protected)
// Body: notificationIds (array of IDs)
router.put('/mark-read', markAsRead);

// PUT /api/notifications/mark-all-read - Mark all notifications as read (protected)
router.put('/mark-all-read', markAllAsRead);

// DELETE /api/notifications/:id - Delete a notification (protected)
// Params: id
router.delete('/:id', deleteNotification);

module.exports = router;
