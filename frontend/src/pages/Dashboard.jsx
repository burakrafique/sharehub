import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaPlus, FaBox, FaEnvelope, FaHeart, FaExchangeAlt, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../services/api';
import './Dashboard.css';

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
          <Link to="/my-items" className="text-decoration-none">
            <Card className="text-center shadow-sm h-100 hover-shadow" style={{ cursor: 'pointer' }}>
              <Card.Body>
                <FaBox size={40} className="text-primary mb-2" />
                <h3 className="mb-0 text-dark">{stats.totalItems}</h3>
                <p className="text-muted mb-0">My Items</p>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Link to="/messages" className="text-decoration-none">
            <Card className="text-center shadow-sm h-100 hover-shadow" style={{ cursor: 'pointer' }}>
              <Card.Body>
                <FaEnvelope size={40} className="text-info mb-2" />
                <h3 className="mb-0 text-dark">
                  {stats.unreadMessages}
                  {stats.unreadMessages > 0 && (
                    <Badge bg="danger" className="ms-2">New</Badge>
                  )}
                </h3>
                <p className="text-muted mb-0">Unread Messages</p>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Link to="/transactions" className="text-decoration-none">
            <Card className="text-center shadow-sm h-100 hover-shadow" style={{ cursor: 'pointer' }}>
              <Card.Body>
                <FaExchangeAlt size={40} className="text-success mb-2" />
                <h3 className="mb-0 text-dark">{stats.transactions}</h3>
                <p className="text-muted mb-0">Transactions</p>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Link to="/favorites" className="text-decoration-none">
            <Card className="text-center shadow-sm h-100 hover-shadow" style={{ cursor: 'pointer' }}>
              <Card.Body>
                <FaHeart size={40} className="text-danger mb-2" />
                <h3 className="mb-0 text-dark">{stats.favorites}</h3>
                <p className="text-muted mb-0">Favorites</p>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div className="mb-4">
        <h4 className="mb-3">Quick Actions</h4>
        <div className="row g-3">
          <div className="col-md-3">
            <Link to="/create-item" className="btn btn-primary w-100 py-4 shadow-sm hover-lift text-decoration-none">
              <i className="bi bi-plus-circle fs-1 d-block mb-2"></i>
              <strong>Create Item</strong>
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/my-items" className="btn btn-outline-primary w-100 py-4 shadow-sm hover-lift text-decoration-none">
              <i className="bi bi-box-seam fs-1 d-block mb-2"></i>
              <strong>My Items</strong>
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/messages" className="btn btn-outline-info w-100 py-4 shadow-sm hover-lift text-decoration-none">
              <i className="bi bi-envelope fs-1 d-block mb-2"></i>
              <strong>Messages</strong>
              {stats.unreadMessages > 0 && (
                <span className="badge bg-danger ms-2">{stats.unreadMessages}</span>
              )}
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/favorites" className="btn btn-outline-danger w-100 py-4 shadow-sm hover-lift text-decoration-none">
              <i className="bi bi-heart fs-1 d-block mb-2"></i>
              <strong>Favorites</strong>
            </Link>
          </div>
        </div>
      </div>

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
                    className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom recent-item-hover"
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
                    className={`mb-3 pb-3 border-bottom notification-item ${!notif.is_read ? 'fw-bold' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/notifications')}
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
