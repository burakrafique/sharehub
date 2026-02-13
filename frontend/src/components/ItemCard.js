import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { favoriteService } from '../services/favoriteService';
import './ItemCard.css';

const ItemCard = ({ item, userLocation = null }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    // Calculate distance if user location is available
    if (userLocation && item.latitude && item.longitude) {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        item.latitude,
        item.longitude
      );
      setDistance(dist);
    }
  }, [userLocation, item.latitude, item.longitude]);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isFavorited) {
        await favoriteService.removeFavorite(item.id);
      } else {
        await favoriteService.addFavorite(item.id);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const itemDate = new Date(dateString);
    const diffInHours = Math.floor((now - itemDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <div className="col">
      <div className="card h-100 item-card shadow-sm border-0 position-relative overflow-hidden">
        {/* Favorite Button */}
        <button 
          className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle z-index-2 favorite-btn"
          onClick={handleFavoriteToggle}
          style={{ width: '40px', height: '40px' }}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <i className={`bi bi-heart${isFavorited ? '-fill text-danger' : ''}`}></i>
        </button>

        {/* Listing Type Badge */}
        <div className="position-absolute top-0 start-0 m-2">
          <span className={`badge ${
            item.listing_type === 'sell' ? 'bg-success' :
            item.listing_type === 'donate' ? 'bg-primary' : 'bg-warning'
          }`}>
            {item.listing_type.toUpperCase()}
          </span>
        </div>

        {/* Views Count Badge */}
        {item.views_count > 0 && (
          <div className="position-absolute bottom-0 end-0 m-2">
            <span className="badge bg-dark bg-opacity-75">
              <i className="bi bi-eye me-1"></i>
              {item.views_count}
            </span>
          </div>
        )}

        {/* Image */}
        <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
          <img 
            src={item.images?.[0]?.image_url || '/placeholder.svg'} 
            className="card-img-top object-fit-cover w-100 h-100"
            alt={item.title}
            style={{ transition: 'transform 0.3s' }}
            loading="lazy"
          />
        </div>

        {/* Card Body */}
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0 text-truncate" title={item.title}>
              {item.title}
            </h5>
            {item.listing_type === 'sell' && item.price && (
              <span className="badge bg-dark fs-6">Rs. {item.price.toLocaleString()}</span>
            )}
          </div>

          <p className="card-text text-muted small" 
             style={{ 
               display: '-webkit-box',
               WebkitLineClamp: 2,
               WebkitBoxOrient: 'vertical',
               overflow: 'hidden'
             }}>
            {item.description}
          </p>

          {/* User Info */}
          <div className="d-flex align-items-center mb-2">
            <div className="user-avatar me-2">
              {item.user?.profile_image ? (
                <img 
                  src={item.user.profile_image} 
                  alt={item.user.username}
                  className="rounded-circle"
                  style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ width: '24px', height: '24px', fontSize: '12px' }}
                >
                  {item.user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="flex-grow-1">
              <div className="small text-muted">
                by <strong>{item.user?.username || 'Anonymous'}</strong>
              </div>
              <div className="small text-muted">
                {formatTimeAgo(item.created_at)}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className="badge bg-light text-dark">
              <i className="bi bi-tag me-1"></i>
              {item.category}
            </span>
            <div className="text-muted small d-flex align-items-center">
              <i className="bi bi-geo-alt me-1"></i>
              <span>
                {distance !== null ? `${distance} km away` : 
                 (item.address?.split(',')[0] || 'Location not specified')}
              </span>
            </div>
          </div>

          {/* Condition Badge */}
          {item.condition && (
            <div className="mt-2">
              <span className={`badge ${
                item.condition === 'new' ? 'bg-success' :
                item.condition === 'like_new' ? 'bg-info' :
                item.condition === 'good' ? 'bg-warning' :
                'bg-secondary'
              } bg-opacity-75`}>
                {item.condition.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="card-footer bg-transparent border-0">
          <Link to={`/items/${item.id}`} className="btn btn-primary w-100">
            View Details
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>

        {/* Hover Overlay */}
        <div className="card-hover-overlay"></div>
      </div>
    </div>
  );
};

export default ItemCard;
