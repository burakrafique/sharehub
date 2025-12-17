import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../services/api';

const MyItems = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    donated: 0
  });

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const response = await API.get('/users/my-items');
      const userItems = response.data.data || [];
      
      setItems(userItems);
      
      // Calculate stats
      const stats = {
        total: userItems.length,
        available: userItems.filter(item => item.status === 'available').length,
        sold: userItems.filter(item => item.status === 'sold').length,
        donated: userItems.filter(item => item.status === 'donated').length
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await API.delete(`/items/${itemId}`);
        fetchMyItems(); // Refresh the list
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your items...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>My Items</h2>
              <p className="text-muted">Manage your listed items</p>
            </div>
            <Link to="/create-item" className="btn btn-primary">
              <FaPlus className="me-2" />
              Add New Item
            </Link>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="text-primary mb-0">{stats.total}</h3>
              <p className="text-muted mb-0">Total Items</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="text-success mb-0">{stats.available}</h3>
              <p className="text-muted mb-0">Available</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="text-info mb-0">{stats.sold}</h3>
              <p className="text-muted mb-0">Sold</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="text-warning mb-0">{stats.donated}</h3>
              <p className="text-muted mb-0">Donated</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Items List */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Your Items</h5>
            </Card.Header>
            <Card.Body>
              {items.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id}>
                          <td>
                            <div>
                              <h6 className="mb-1">{item.title}</h6>
                              <small className="text-muted">
                                {item.description?.substring(0, 50)}...
                              </small>
                            </div>
                          </td>
                          <td>
                            <Badge bg="secondary">{item.category}</Badge>
                          </td>
                          <td>
                            <Badge bg={
                              item.listing_type === 'sell' ? 'primary' :
                              item.listing_type === 'donate' ? 'success' : 'info'
                            }>
                              {item.listing_type}
                            </Badge>
                          </td>
                          <td>
                            {item.listing_type === 'sell' && item.price ? 
                              `Rs. ${parseFloat(item.price).toLocaleString()}` : 
                              '-'
                            }
                          </td>
                          <td>
                            <Badge bg={
                              item.status === 'available' ? 'success' :
                              item.status === 'sold' ? 'primary' :
                              item.status === 'donated' ? 'warning' : 'secondary'
                            }>
                              {item.status}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(item.created_at).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => navigate(`/items/${item.id}`)}
                                title="View Item"
                              >
                                <FaEye />
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => navigate(`/items/${item.id}/edit`)}
                                title="Edit Item"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
                                title="Delete Item"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Alert variant="info" className="text-center">
                  <h5>No items yet</h5>
                  <p>You haven't listed any items yet. Start by creating your first item!</p>
                  <Link to="/create-item" className="btn btn-primary">
                    <FaPlus className="me-2" />
                    Create Your First Item
                  </Link>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyItems;