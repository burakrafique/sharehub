import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Button, Badge, Alert, Spinner, ButtonGroup } from 'react-bootstrap';
import { FaBell, FaCheckDouble, FaTrash, FaFilter } from 'react-icons/fa';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../services/notificationService';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getNotifications();
      
      if (response.success) {
        setNotifications(response.data || []);
      } else {
        setError('Failed to load notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      
      setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
      setError('Failed to mark all as read');
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      await deleteNotification(notificationId);
      
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Failed to delete notification');
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }

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
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.is_read;
    if (filter === 'read') return notif.is_read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading notifications...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <FaBell className="me-2" />
                Notifications
                {unreadCount > 0 && (
                  <Badge bg="danger" className="ms-2">
                    {unreadCount} unread
                  </Badge>
                )}
              </h2>
              <p className="text-muted mb-0">
                {notifications.length} total notifications
              </p>
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="primary"
                onClick={handleMarkAllAsRead}
              >
                <FaCheckDouble className="me-2" />
                Mark All as Read
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Filter Buttons */}
      <Row className="mb-3">
        <Col>
          <ButtonGroup>
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </Button>
            <Button 
              variant={filter === 'unread' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button 
              variant={filter === 'read' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('read')}
            >
              Read ({notifications.length - unreadCount})
            </Button>
          </ButtonGroup>
        </Col>
      </Row>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <FaBell size={50} className="text-muted mb-3" />
          <h4>No {filter !== 'all' ? filter : ''} notifications</h4>
          <p className="mb-0">
            {filter === 'unread' 
              ? "You're all caught up!" 
              : "You don't have any notifications yet."}
          </p>
        </Alert>
      ) : (
        <Card className="shadow-sm">
          <ListGroup variant="flush">
            {filteredNotifications.map((notification) => (
              <ListGroup.Item
                key={notification.id}
                action
                onClick={() => handleNotificationClick(notification)}
                className={`${!notification.is_read ? 'bg-light border-start border-primary border-3' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-start">
                  <div className="me-3" style={{ fontSize: '2rem' }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="mb-0">
                        {notification.title || notification.type}
                        {!notification.is_read && (
                          <Badge bg="primary" className="ms-2">New</Badge>
                        )}
                      </h6>
                      <div className="d-flex gap-2">
                        {!notification.is_read && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            title="Mark as read"
                          >
                            <FaCheckDouble size={14} />
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </Button>
                      </div>
                    </div>
                    <p className="mb-1 text-muted">
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
        </Card>
      )}
    </Container>
  );
};

export default Notifications;
