import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { FaUsers, FaBox, FaExchangeAlt, FaChartLine, FaTrash, FaEdit, FaEye } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    totalTransactions: 0,
    pendingItems: 0
  });
  
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data || {});
      }

      // Fetch users
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.data || []);
      }

      // Fetch items
      const itemsResponse = await fetch('/api/admin/items');
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json();
        setItems(itemsData.data || []);
      }

      // Fetch transactions
      const transactionsResponse = await fetch('/api/admin/transactions');
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData.data || []);
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      setAlert({ type: 'danger', message: 'Failed to load admin data' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setAlert({ type: 'success', message: 'User deleted successfully' });
          fetchAdminData();
        } else {
          setAlert({ type: 'danger', message: 'Failed to delete user' });
        }
      } catch (error) {
        setAlert({ type: 'danger', message: 'Error deleting user' });
      }
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/admin/items/${itemId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setAlert({ type: 'success', message: 'Item deleted successfully' });
          fetchAdminData();
        } else {
          setAlert({ type: 'danger', message: 'Failed to delete item' });
        }
      } catch (error) {
        setAlert({ type: 'danger', message: 'Error deleting item' });
      }
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h3 className={`mb-0 text-${color}`}>{value}</h3>
          </div>
          <div className={`text-${color} fs-1`}>
            {icon}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading admin dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">
            <FaChartLine className="me-2" />
            Admin Dashboard
          </h2>
          <p className="text-muted">Manage users, items, and monitor platform activity</p>
        </Col>
      </Row>

      {alert && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers || 0}
            icon={<FaUsers />}
            color="primary"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Total Items"
            value={stats.totalItems || 0}
            icon={<FaBox />}
            color="success"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Transactions"
            value={stats.totalTransactions || 0}
            icon={<FaExchangeAlt />}
            color="info"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Pending Items"
            value={stats.pendingItems || 0}
            icon={<FaBox />}
            color="warning"
          />
        </Col>
      </Row>

      {/* Navigation Tabs */}
      <Row className="mb-4">
        <Col>
          <div className="btn-group" role="group">
            <Button
              variant={activeTab === 'overview' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'users' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('users')}
            >
              Users ({users.length})
            </Button>
            <Button
              variant={activeTab === 'items' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('items')}
            >
              Items ({items.length})
            </Button>
            <Button
              variant={activeTab === 'transactions' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions ({transactions.length})
            </Button>
          </div>
        </Col>
      </Row>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <Row>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Recent Users</h5>
              </Card.Header>
              <Card.Body>
                {users.slice(0, 5).map(user => (
                  <div key={user.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                      <strong>{user.name}</strong>
                      <br />
                      <small className="text-muted">{user.email}</small>
                    </div>
                    <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Recent Items</h5>
              </Card.Header>
              <Card.Body>
                {items.slice(0, 5).map(item => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                      <strong>{item.title}</strong>
                      <br />
                      <small className="text-muted">{item.category} • {item.listing_type}</small>
                    </div>
                    <Badge bg={item.status === 'available' ? 'success' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {activeTab === 'users' && (
        <Card>
          <Card.Header>
            <h5 className="mb-0">All Users</h5>
          </Card.Header>
          <Card.Body>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>{user.phone}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDeleteUser(user.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {activeTab === 'items' && (
        <Card>
          <Card.Header>
            <h5 className="mb-0">All Items</h5>
          </Card.Header>
          <Card.Body>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>
                      <Badge bg="secondary">{item.category}</Badge>
                    </td>
                    <td>
                      <Badge bg={
                        item.listing_type === 'sell' ? 'success' :
                        item.listing_type === 'donate' ? 'primary' : 'warning'
                      }>
                        {item.listing_type}
                      </Badge>
                    </td>
                    <td>{item.price ? `Rs. ${item.price}` : 'Free'}</td>
                    <td>
                      <Badge bg={item.status === 'available' ? 'success' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td>{item.owner_name}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>
                      <Button size="sm" variant="outline-primary" className="me-1">
                        <FaEye />
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDeleteItem(item.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {activeTab === 'transactions' && (
        <Card>
          <Card.Header>
            <h5 className="mb-0">All Transactions</h5>
          </Card.Header>
          <Card.Body>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item</th>
                  <th>Seller</th>
                  <th>Buyer</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.item_title}</td>
                    <td>{transaction.seller_name}</td>
                    <td>{transaction.buyer_name}</td>
                    <td>
                      <Badge bg={
                        transaction.transaction_type === 'sell' ? 'success' :
                        transaction.transaction_type === 'donate' ? 'primary' : 'warning'
                      }>
                        {transaction.transaction_type}
                      </Badge>
                    </td>
                    <td>{transaction.amount ? `Rs. ${transaction.amount}` : 'Free'}</td>
                    <td>
                      <Badge bg={transaction.status === 'completed' ? 'success' : 'warning'}>
                        {transaction.status}
                      </Badge>
                    </td>
                    <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AdminDashboard;