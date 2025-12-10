import API from './api';

// Send a message
export const sendMessage = async (receiverId, messageText, itemId = null) => {
  const response = await API.post('/messages', {
    receiver_id: receiverId,
    message_text: messageText,
    item_id: itemId
  });
  return response.data;
};

// Get all conversations for current user
export const getConversations = async () => {
  const response = await API.get('/messages/conversations');
  return response.data;
};

// Get conversation with specific user
export const getConversation = async (otherUserId, itemId = null) => {
  const params = itemId ? `?itemId=${itemId}` : '';
  const response = await API.get(`/messages/conversation/${otherUserId}${params}`);
  return response.data;
};

// Mark messages as read
export const markAsRead = async (messageIds) => {
  const response = await API.put('/messages/mark-read', {
    messageIds
  });
  return response.data;
};

// Get unread message count
export const getUnreadCount = async () => {
  const response = await API.get('/messages/unread-count');
  return response.data;
};

// Delete a message
export const deleteMessage = async (messageId) => {
  const response = await API.delete(`/messages/${messageId}`);
  return response.data;
};
