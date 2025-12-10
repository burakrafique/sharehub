const { promisePool: pool } = require('../config/database');

const Message = {
  // Create a new message
  async create(messageData) {
    const { sender_id, receiver_id, item_id, message_text } = messageData;

    const query = `
      INSERT INTO messages (sender_id, receiver_id, item_id, message_text, is_read)
      VALUES (?, ?, ?, ?, false)
    `;

    const [result] = await pool.execute(query, [
      sender_id,
      receiver_id,
      item_id || null,
      message_text
    ]);

    return {
      id: result.insertId,
      ...messageData,
      is_read: false,
      created_at: new Date()
    };
  },

  // Get conversation between two users about a specific item
  async getConversation(userId1, userId2, itemId = null) {
    let query = `
      SELECT 
        messages.*,
        sender.name as sender_name,
        sender.email as sender_email,
        receiver.name as receiver_name,
        receiver.email as receiver_email,
        items.title as item_title
      FROM messages
      INNER JOIN users as sender ON messages.sender_id = sender.id
      INNER JOIN users as receiver ON messages.receiver_id = receiver.id
      LEFT JOIN items ON messages.item_id = items.id
      WHERE (
        (messages.sender_id = ? AND messages.receiver_id = ?)
        OR
        (messages.sender_id = ? AND messages.receiver_id = ?)
      )
    `;

    const params = [userId1, userId2, userId2, userId1];

    // Add item filter if provided
    if (itemId) {
      query += ' AND messages.item_id = ?';
      params.push(itemId);
    }

    query += ' ORDER BY messages.created_at ASC';

    const [messages] = await pool.execute(query, params);
    return messages;
  },

  // Get all conversations for a user with summary
  async getUserConversations(userId) {
    const query = `
      SELECT 
        CASE 
          WHEN messages.sender_id = ? THEN messages.receiver_id
          ELSE messages.sender_id
        END as other_user_id,
        CASE 
          WHEN messages.sender_id = ? THEN receiver.name
          ELSE sender.name
        END as other_user_name,
        items.id as item_id,
        items.title as item_title,
        MAX(messages.created_at) as last_message_time,
        (
          SELECT message_text 
          FROM messages m2 
          WHERE (
            (m2.sender_id = ? AND m2.receiver_id = other_user_id)
            OR
            (m2.sender_id = other_user_id AND m2.receiver_id = ?)
          )
          AND (messages.item_id IS NULL OR m2.item_id = messages.item_id)
          ORDER BY m2.created_at DESC 
          LIMIT 1
        ) as last_message,
        (
          SELECT COUNT(*) 
          FROM messages m3 
          WHERE m3.receiver_id = ? 
          AND m3.sender_id = other_user_id
          AND m3.is_read = false
          AND (messages.item_id IS NULL OR m3.item_id = messages.item_id)
        ) as unread_count
      FROM messages
      INNER JOIN users as sender ON messages.sender_id = sender.id
      INNER JOIN users as receiver ON messages.receiver_id = receiver.id
      LEFT JOIN items ON messages.item_id = items.id
      WHERE messages.sender_id = ? OR messages.receiver_id = ?
      GROUP BY other_user_id, item_id
      ORDER BY last_message_time DESC
    `;

    const [conversations] = await pool.execute(query, [
      userId, userId, userId, userId, userId, userId, userId
    ]);

    return conversations;
  },

  // Mark messages as read
  async markAsRead(messageIds, userId) {
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return 0;
    }

    const placeholders = messageIds.map(() => '?').join(',');
    const query = `
      UPDATE messages 
      SET is_read = true 
      WHERE id IN (${placeholders}) 
      AND receiver_id = ?
    `;

    const params = [...messageIds, userId];
    const [result] = await pool.execute(query, params);

    return result.affectedRows;
  },

  // Get unread message count for user
  async getUnreadCount(userId) {
    const query = `
      SELECT COUNT(*) as count
      FROM messages
      WHERE receiver_id = ? AND is_read = false
    `;

    const [result] = await pool.execute(query, [userId]);
    return result[0].count;
  },

  // Delete message (only by sender)
  async deleteMessage(messageId, userId) {
    const query = `
      DELETE FROM messages 
      WHERE id = ? AND sender_id = ?
    `;

    const [result] = await pool.execute(query, [messageId, userId]);
    return result.affectedRows > 0;
  }
};

module.exports = Message;
