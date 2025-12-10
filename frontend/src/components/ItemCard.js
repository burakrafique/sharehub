import { Link } from 'react-router-dom';
import { useState } from 'react';
import './ItemCard.css';

const ItemCard = ({ item }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="col">
      <div className="card h-100 item-card shadow-sm border-0 position-relative overflow-hidden">
        {/* Favorite Button */}
        <button 
          className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle z-index-2"
          onClick={() => setIsFavorited(!isFavorited)}
          style={{ width: '40px', height: '40px' }}
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

        {/* Image */}
        <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
          <img 
            src={item.images?.[0] || '/placeholder.jpg'} 
            className="card-img-top object-fit-cover w-100 h-100"
            alt={item.title}
            style={{ transition: 'transform 0.3s' }}
          />
        </div>

        {/* Card Body */}
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0 text-truncate">{item.title}</h5>
            {item.listing_type === 'sell' && (
              <span className="badge bg-dark fs-6">Rs. {item.price}</span>
            )}
          </div>

          <p className="card-text text-muted small text-truncate">
            {item.description}
          </p>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="badge bg-light text-dark">
              <i className="bi bi-tag me-1"></i>
              {item.category}
            </span>
            <span className="text-muted small">
              <i className="bi bi-geo-alt me-1"></i>
              {item.address?.split(',')[0] || 'Lahore'}
            </span>
          </div>
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
