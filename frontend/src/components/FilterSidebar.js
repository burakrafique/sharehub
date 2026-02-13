import { useState, useEffect } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  activeFiltersCount = 0,
  isMobile = false 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(key, value);
  };

  const categories = [
    { value: 'clothes', label: 'Clothes', icon: '👕' },
    { value: 'books', label: 'Books', icon: '📚' },
    { value: 'ration', label: 'Ration', icon: '🍱' }
  ];

  const listingTypes = [
    { value: 'sell', label: 'For Sale', color: 'success' },
    { value: 'donate', label: 'Donation', color: 'primary' },
    { value: 'swap', label: 'Swap', color: 'warning' }
  ];

  const conditions = [
    { value: '', label: 'Any Condition' },
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ];

  return (
    <div className={`card border-0 shadow-sm ${!isMobile ? 'sticky-top' : ''}`} style={{ top: '80px' }}>
      <div className="card-header bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-funnel me-2"></i>
            Filters
          </h5>
          {activeFiltersCount > 0 && (
            <span className="badge bg-light text-primary">
              {activeFiltersCount}
            </span>
          )}
        </div>
      </div>
      
      <div className="card-body">
        {/* Category Filter */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
            <i className="bi bi-tag me-1"></i>
            Category
          </label>
          <select
            className="form-select"
            value={localFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Listing Type Filter */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
            <i className="bi bi-list-ul me-1"></i>
            Listing Type
          </label>
          <div className="d-flex flex-column gap-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="listing_type"
                id="all_types"
                checked={!localFilters.listing_type}
                onChange={() => handleFilterChange('listing_type', '')}
              />
              <label className="form-check-label" htmlFor="all_types">
                All Types
              </label>
            </div>
            {listingTypes.map((type) => (
              <div key={type.value} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="listing_type"
                  id={type.value}
                  checked={localFilters.listing_type === type.value}
                  onChange={() => handleFilterChange('listing_type', type.value)}
                />
                <label className="form-check-label" htmlFor={type.value}>
                  <span className={`badge bg-${type.color} me-2`}>
                    {type.value.toUpperCase()}
                  </span>
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Condition Filter */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
            <i className="bi bi-star me-1"></i>
            Condition
          </label>
          <select
            className="form-select"
            value={localFilters.condition || ''}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
          >
            {conditions.map((condition) => (
              <option key={condition.value} value={condition.value}>
                {condition.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        {localFilters.listing_type !== 'donate' && (
          <div className="mb-4">
            <label className="form-label fw-semibold">
              <i className="bi bi-currency-dollar me-1"></i>
              Price Range (Rs.)
            </label>
            <div className="row g-2">
              <div className="col-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  min="0"
                />
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  min="0"
                />
              </div>
            </div>
            {(localFilters.minPrice || localFilters.maxPrice) && (
              <div className="mt-2 text-center">
                <small className="text-muted">
                  Rs. {localFilters.minPrice || '0'} - Rs. {localFilters.maxPrice || '∞'}
                </small>
              </div>
            )}
          </div>
        )}

        {/* Clear Filters Button */}
        <button
          className="btn btn-outline-secondary w-100"
          onClick={onClearFilters}
          disabled={activeFiltersCount === 0}
        >
          <i className="bi bi-x-circle me-2"></i>
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
