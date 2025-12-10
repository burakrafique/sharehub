import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaPlus, FaBox, FaEnvelope, FaHeart, FaExchangeAlt, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalItems: 0,
    unreadMessages: 0,
    transactions: 0,
    favorites: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user's items
      const itemsRes = await API.get('/users/my-items');
      const items = itemsRes.data.data || [];
      
      // Fetch unread messages count
      const messagesRes = await API.get('/messages/unread-count');
      const unreadCount = messagesRes.data.unreadCount || 0;

      // Fetch transactions
      const transactionsRes = await API.get('/transactions');
      const transactions = transactionsRes.data.data || [];

      // Fetch favorites
      const favoritesRes = await API.get('/favorites');
      const favorites = favoritesRes.data.data || [];

      // Fetch notifications
      const notificationsRes = await API.get('/notifications');
      const notifs = notificationsRes.data.data || [];

      setStats({
        totalItems: items.length,
        unreadMessages: unreadCount,
        transactions: transactions.length,
        favorites: favorites.length
      });

      setRecentItems(items.slice(0, 3));
      setNotifications(notifs.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: 'Create Item', icon: <FaPlus size={30} />, color: 'primary', path: '/create-item' },
    { title: 'My Items', icon: <FaBox size={30} />, color: 'success', path: '/my-items' },
    { title: 'Messages', icon: <FaEnvelope size={30} />, color: 'info', path: '/messages' },
    { title: 'Favorites', icon: <FaHeart size={30} />, color: 'danger', path: '/favorites' }
  ];

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <h2>Welcome back, {user?.name}!</h2>
          <p className="text-muted">Here's what's happening with your account</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <FaBox size={40} className="text-primary mb-2" />
              <h3 className="mb-0">{stats.totalItems}</h3>
              <p className="text-muted mb-0">My Items</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <FaEnvelope size={40} className="text-info mb-2" />
              <h3 className="mb-0">{stats.unreadMessages}</h3>
              <p className="text-muted mb-0">Unread Messages</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <FaExchangeAlt size={40} className="text-success mb-2" />
              <h3 className="mb-0">{stats.transactions}</h3>
              <p className="text-muted mb-0">Transactions</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <FaHeart size={40} className="text-danger mb-2" />
              <h3 className="mb-0">{stats.favorites}</h3>
              <p className="text-muted mb-0">Favorites</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">Quick Actions</h4>
        </Col>
      </Row>
      <Row className="mb-4">
        {quickActions.map((action, index) => (
          <Col key={index} md={3} sm={6} className="mb-3">
            <Card 
              className="text-center shadow-sm h-100 hover-shadow"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(action.path)}
            >
              <Card.Body className="py-4">
                <div className={`text-${action.color} mb-3`}>{action.icon}</div>
                <h6>{action.title}</h6>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        {/* Recent Items */}
        <Col lg={7} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Items</h5>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => navigate('/my-items')}
                >
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {recentItems.length > 0 ? (
                recentItems.map(item => (
                  <div 
                    key={item.id} 
                    className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/items/${item.id}`)}
                  >
                    <div>
                      <h6 className="mb-1">{item.title}</h6>
                      <small className="text-muted">
                        <Badge bg="secondary" className="me-2">{item.category}</Badge>
                        <Badge bg={item.status === 'available' ? 'success' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </small>
                    </div>
                    {item.listing_type === 'sell' && item.price && (
                      <strong className="text-primary">Rs. {parseFloat(item.price).toLocaleString()}</strong>
                    )}
                  </div>
                ))
              ) : (
                <Alert variant="info" className="mb-0">
                  No items yet. <Link to="/create-item">Create your first item</Link>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Notifications */}
        <Col lg={5} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaBell className="me-2" />
                  Notifications
                </h5>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => navigate('/notifications')}
                >
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`mb-3 pb-3 border-bottom ${!notif.is_read ? 'fw-bold' : ''}`}
                  >
                    <div className="d-flex justify-content-between">
                      <small className="text-primary">{notif.type}</small>
                      <small className="text-muted">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </small>
                    </div>
                    <p className="mb-0 small">{notif.message}</p>
                  </div>
                ))
              ) : (
                <Alert variant="info" className="mb-0">
                  No new notifications
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
