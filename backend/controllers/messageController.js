const Message = require('../models/Message');
const Item = require('../models/Item');

// Send a new message
const sendMessage = async (req, res, next) => {
  try {
    const { receiver_id, item_id, message_text } = req.body;
    const sender_id = req.user.id;

    // Validate required fields
    if (!receiver_id || !message_text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiver_id and message_text'
      });
    }

    // Check if sender is not sending message to themselves
    if (sender_id === parseInt(receiver_id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send message to yourself'
      });
    }

    // Check if item exists (if item_id provided)
    if (item_id) {
      const item = await Item.findById(item_id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }
    }

    // Create message
    const messageData = {
      sender_id,
      receiver_id,
      item_id: item_id || null,
      message_text
    };

    const newMessage = await Message.create(messageData);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

// Get conversation between current user and another user
const getConversation = async (req, res, next) => {
  try {
    const { otherUserId } = req.params;
    const { itemId } = req.query;
    const currentUserId = req.user.id;

    // Validate otherUserId
    if (!otherUserId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide otherUserId'
      });
    }

    // Get conversation messages
    const messages = await Message.getConversation(
      currentUserId,
      parseInt(otherUserId),
      itemId ? parseInt(itemId) : null
    );

    // Mark messages as read where current user is receiver
    const messageIdsToMarkRead = messages
      .filter(msg => msg.receiver_id === currentUserId && !msg.is_read)
      .map(msg => msg.id);

    if (messageIdsToMarkRead.length > 0) {
      await Message.markAsRead(messageIdsToMarkRead, currentUserId);
    }

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// Get all conversations for current user
const getAllConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const conversations = await Message.getUserConversations(userId);

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

// Mark messages as read
const markMessagesRead = async (req, res, next) => {
  try {
    const { messageIds } = req.body;
    const userId = req.user.id;

    // Validate messageIds
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of message IDs'
      });
    }

    const updatedCount = await Message.markAsRead(messageIds, userId);

    res.status(200).json({
      success: true,
      message: `${updatedCount} message(s) marked as read`,
      count: updatedCount
    });
  } catch (error) {
    next(error);
  }
};

// Get unread message count
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const count = await Message.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    next(error);
  }
};

// Delete a message
const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Validate messageId
    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide message ID'
      });
    }

    const deleted = await Message.deleteMessage(parseInt(messageId), userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or you are not authorized to delete it'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getAllConversations,
  markMessagesRead,
  getUnreadCount,
  deleteMessage
};
