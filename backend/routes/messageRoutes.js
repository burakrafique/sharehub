const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getAllConversations,
  markMessagesRead,
  getUnreadCount,
  deleteMessage
} = require('../controllers/messageController');
const { verifyToken } = require('../middleware/authMiddleware');

// All message routes require authentication
// Apply verifyToken middleware to all routes
router.use(verifyToken);

// POST /api/messages - Send a new message (protected)
// Body: receiver_id, item_id (optional), message_text
router.post('/', sendMessage);

// GET /api/messages/conversations - Get all conversations for current user (protected)
// Returns list of conversations with last message and unread count
router.get('/conversations', getAllConversations);

// GET /api/messages/conversation/:otherUserId - Get conversation with specific user (protected)
// Params: otherUserId
// Query: itemId (optional)
router.get('/conversation/:otherUserId', getConversation);

// PUT /api/messages/mark-read - Mark messages as read (protected)
// Body: messageIds (array of message IDs)
router.put('/mark-read', markMessagesRead);

// GET /api/messages/unread-count - Get unread message count (protected)
// Returns count of unread messages for current user
router.get('/unread-count', getUnreadCount);

// DELETE /api/messages/:messageId - Delete a message (protected)
// Params: messageId
// Only sender can delete their own messages
router.delete('/:messageId', deleteMessage);

module.exports = router;
