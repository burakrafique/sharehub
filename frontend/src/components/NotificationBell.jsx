import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Badge, ListGroup, Button, Spinner } from 'react-bootstrap';
import { FaBell, FaCheck, FaCheckDouble, FaExternalLinkAlt } from 'react-icons/fa';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../services/notificationService';
import './NotificationBell.css';

const NotificationBell = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (show) {
      fetchNotifications();
    }
  }, [show]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      
      if (response.success) {
        // Get only recent 10 notifications
        setNotifications(response.data.slice(0, 10) || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      
      if (response.success) {
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    
    try {
      await markAsRead(notificationId);
      
      // Update local state
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      
      // Update local state
      setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      await markAsRead(notification.id);
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    // Close dropdown
    setShow(false);

    // Navigate based on notification type
    if (notification.link) {
      navigate(notification.link);
    } else if (notification.item_id) {
      navigate(`/items/${notification.item_id}`);
    } else if (notification.type === 'message') {
      navigate('/messages');
    } else if (notification.type === 'transaction') {
      navigate('/transactions');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'transaction':
        return '💰';
      case 'favorite':
        return '❤️';
      case 'item':
        return '📦';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dropdown 
      show={show} 
      onToggle={(isOpen) => setShow(isOpen)}
      align="end"
      ref={dropdownRef}
    >
      <Dropdown.Toggle 
        variant="link" 
        className="notification-bell-toggle text-white position-relative p-2"
        id="notification-dropdown"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            pill 
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.65rem' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="notification-dropdown-menu shadow-lg">
        {/* Header */}
        <div className="notification-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
          <h6 className="mb-0">
            <FaBell className="me-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge bg="danger" className="ms-2">
                {unreadCount}
              </Badge>
            )}
          </h6>
          {unreadCount > 0 && (
            <Button 
              variant="link" 
              size="sm" 
              className="text-decoration-none p-0"
              onClick={handleMarkAllAsRead}
              title="Mark all as read"
            >
              <FaCheckDouble size={16} />
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" variant="primary" />
              <p className="text-muted small mt-2 mb-0">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <FaBell size={40} className="mb-2 opacity-50" />
              <p className="mb-0">No notifications</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((notification) => (
                <ListGroup.Item
                  key={notification.id}
                  action
                  onClick={() => handleNotificationClick(notification)}
                  className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-start">
                    <div className="notification-icon me-2">
                      <span style={{ fontSize: '1.5rem' }}>
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <p className="mb-1 small fw-semibold">
                          {notification.title || notification.type}
                        </p>
                        {!notification.is_read && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 ms-2"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            title="Mark as read"
                          >
                            <FaCheck size={12} className="text-primary" />
                          </Button>
                        )}
                      </div>
                      <p className="mb-1 small text-muted">
                        {notification.message}
                      </p>
                      <small className="text-muted">
                        {formatTime(notification.created_at)}
                      </small>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="notification-footer border-top">
            <Button
              variant="link"
              className="w-100 text-center text-decoration-none py-2"
              onClick={() => {
                setShow(false);
                navigate('/notifications');
              }}
            >
              View All Notifications
              <FaExternalLinkAlt className="ms-2" size={12} />
            </Button>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell;
