import API from './api';

// Get all notifications
export const getNotifications = async () => {
  const response = await API.get('/notifications');
  return response.data;
};

// Get unread notifications count
export const getUnreadCount = async () => {
  const response = await API.get('/notifications/unread-count');
  return response.data;
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  const response = await API.put(`/notifications/${notificationId}/read`);
  return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const response = await API.put('/notifications/mark-all-read');
  return response.data;
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  const response = await API.delete(`/notifications/${notificationId}`);
  return response.data;
};

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
