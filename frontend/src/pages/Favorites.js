import { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingBag } from 'react-icons/fa';
import ItemCard from '../components/ItemCard';
import { getFavorites } from '../services/favoriteService';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getFavorites();
      
      if (response.success) {
        setFavorites(response.data || []);
      } else {
        setError('Failed to load favorites');
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (itemId, isFavorited) => {
    // Remove from list if unfavorited
    if (!isFavorited) {
      setFavorites(favorites.filter(item => item.id !== itemId));
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your favorites...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <h2>
            <FaHeart className="text-danger me-2" />
            My Favorites
          </h2>
          <p className="text-muted">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
          </p>
        </Col>
      </Row>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <Row className="g-4">
          {favorites.map(item => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
              <ItemCard 
                item={{ ...item, is_favorited: true }} 
                onFavoriteToggle={handleFavoriteToggle}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center py-5">
          <FaHeart size={50} className="text-muted mb-3" />
          <h4>No favorites yet</h4>
          <p className="mb-4">
            Start adding items to your favorites by clicking the heart icon on items you like!
          </p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/items')}
          >
            <FaShoppingBag className="me-2" />
            Browse Items
          </Button>
        </Alert>
      )}
    </Container>
  );
};

export default Favorites;
