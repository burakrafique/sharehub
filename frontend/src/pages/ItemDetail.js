import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import itemService from '../services/itemService';
import messageService from '../services/messageService';
import favoriteService from '../services/favoriteService';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './ItemDetail.css';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const response = await itemService.getItemById(id);
      setItem(response.data.item);
    } catch (error) {
      console.error('Error fetching item:', error);
      alert('Item not found');
      navigate('/items');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = async () => {
    if (!user) {
      alert('Please login to contact seller');
      navigate('/login');
      return;
    }

    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      await messageService.sendMessage({
        receiver_id: item.user_id,
        item_id: item.id,
        message_text: message
      });
      
      alert('Message sent successfully!');
      setShowContactModal(false);
      navigate('/messages');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      alert('Please login to add favorites');
      navigate('/login');
      return;
    }
    
    // Will implement later
    alert('Added to favorites!');
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/items">Items</Link>
          </li>
          <li className="breadcrumb-item active">{item.title}</li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Images Section */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            {/* Main Image */}
            <div className="main-image mb-3" style={{ height: '400px', overflow: 'hidden' }}>
              <img
                src={item.images?.[currentImage] || '/placeholder.jpg'}
                alt={item.title}
                className="w-100 h-100 object-fit-cover rounded"
              />
            </div>

            {/* Thumbnail Gallery */}
            {item.images && item.images.length > 1 && (
              <div className="d-flex gap-2 overflow-auto">
                {item.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${item.title} ${index + 1}`}
                    className={`thumbnail ${currentImage === index ? 'active' : ''}`}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: currentImage === index ? '3px solid #667eea' : 'none',
                      borderRadius: '8px'
                    }}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Item Details */}
        <div className="col-md-6">
          <div className="item-details">
            {/* Title & Badges */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h1 className="h2 fw-bold">{item.title}</h1>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleAddToFavorites}
              >
                <i className="bi bi-heart"></i>
              </button>
            </div>

            {/* Badges */}
            <div className="d-flex gap-2 mb-3">
              <span
                className={`badge ${
                  item.listing_type === 'sell'
                    ? 'bg-success'
                    : item.listing_type === 'donate'
                    ? 'bg-primary'
                    : 'bg-warning'
                } fs-6`}
              >
                {item.listing_type.toUpperCase()}
              </span>
              <span className="badge bg-secondary fs-6">{item.category}</span>
              <span className="badge bg-info fs-6">{item.item_condition}</span>
            </div>

            {/* Price */}
            {item.listing_type === 'sell' && (
              <div className="mb-4">
                <h3 className="text-primary mb-0">Rs. {item.price}</h3>
                <small className="text-muted">Fixed price</small>
              </div>
            )}

            {/* Description */}
            <div className="mb-4">
              <h5 className="mb-3">Description</h5>
              <p className="text-muted">{item.description}</p>
            </div>

            {/* Details */}
            <div className="mb-4">
              <h5 className="mb-3">Details</h5>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td className="text-muted">Category:</td>
                    <td className="fw-semibold">{item.category}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Condition:</td>
                    <td className="fw-semibold">{item.item_condition}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Location:</td>
                    <td className="fw-semibold">
                      <i className="bi bi-geo-alt text-danger me-1"></i>
                      {item.address}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Posted:</td>
                    <td className="fw-semibold">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Seller Info */}
            <div className="card bg-light mb-4 p-3">
              <h6 className="mb-3">Seller Information</h6>
              <div className="d-flex align-items-center">
                <div className="avatar-circle bg-primary text-white me-3">
                  {item.owner_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h6 className="mb-0">{item.owner_name}</h6>
                  <small className="text-muted">
                    <i className="bi bi-telephone me-1"></i>
                    {item.owner_phone}
                  </small>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2">
              {user && user.id === item.user_id ? (
                <>
                  <Link
                    to={`/items/${item.id}/edit`}
                    className="btn btn-outline-primary btn-lg"
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Edit Item
                  </Link>
                  <button className="btn btn-outline-danger btn-lg">
                    <i className="bi bi-trash me-2"></i>
                    Delete Item
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => setShowContactModal(true)}
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    Contact Seller
                  </button>
                  <button className="btn btn-outline-primary btn-lg">
                    <i className="bi bi-telephone me-2"></i>
                    Call: {item.owner_phone}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contact Seller</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowContactModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">
                  Send a message to {item.owner_name} about this item
                </p>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Hi, I'm interested in this item..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowContactModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleContactSeller}>
                  <i className="bi bi-send me-2"></i>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;