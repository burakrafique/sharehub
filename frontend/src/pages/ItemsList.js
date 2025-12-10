import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import itemService from '../services/itemService';
import ItemCard from '../components/ItemCard';

const ItemsList = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    listing_type: searchParams.get('type') || '',
    search: searchParams.get('search') || '',
    min_price: '',
    max_price: '',
    condition: ''
  });

  useEffect(() => {
    fetchItems();
  }, [filters, sortBy]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const queryParams = {
        ...filters,
        sort: sortBy
      };
      
      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) {
          delete queryParams[key];
        }
      });

      const response = await itemService.getAllItems(queryParams);
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      listing_type: '',
      search: '',
      min_price: '',
      max_price: '',
      condition: ''
    });
    setSortBy('latest');
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '80px' }}>
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-funnel me-2"></i>
                  Filters
                </h5>
                {getActiveFiltersCount() > 0 && (
                  <span className="badge bg-light text-primary">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </div>
            </div>
            <div className="card-body">
              {/* Search */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-search me-1"></i>
                  Search
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search items..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-tag me-1"></i>
                  Category
                </label>
                <select
                  className="form-select"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="clothes">Clothes</option>
                  <option value="books">Books</option>
                  <option value="ration">Ration</option>
                </select>
              </div>

              {/* Listing Type */}
              <div className="mb-3">
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
                      checked={filters.listing_type === ''}
                      onChange={() => handleFilterChange('listing_type', '')}
                    />
                    <label className="form-check-label" htmlFor="all_types">
                      All Types
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="listing_type"
                      id="sell"
                      checked={filters.listing_type === 'sell'}
                      onChange={() => handleFilterChange('listing_type', 'sell')}
                    />
                    <label className="form-check-label" htmlFor="sell">
                      <span className="badge bg-success me-2">SELL</span>
                      For Sale
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="listing_type"
                      id="donate"
                      checked={filters.listing_type === 'donate'}
                      onChange={() => handleFilterChange('listing_type', 'donate')}
                    />
                    <label className="form-check-label" htmlFor="donate">
                      <span className="badge bg-primary me-2">DONATE</span>
                      For Donation
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="listing_type"
                      id="swap"
                      checked={filters.listing_type === 'swap'}
                      onChange={() => handleFilterChange('listing_type', 'swap')}
                    />
                    <label className="form-check-label" htmlFor="swap">
                      <span className="badge bg-warning me-2">SWAP</span>
                      For Swap
                    </label>
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-star me-1"></i>
                  Condition
                </label>
                <select
                  className="form-select"
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                >
                  <option value="">Any Condition</option>
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              {/* Price Range */}
              {filters.listing_type !== 'donate' && (
                <div className="mb-3">
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
                        value={filters.min_price}
                        onChange={(e) => handleFilterChange('min_price', e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Max"
                        value={filters.max_price}
                        onChange={(e) => handleFilterChange('max_price', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Clear Button */}
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
                disabled={getActiveFiltersCount() === 0}
              >
                <i className="bi bi-x-circle me-2"></i>
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="col-md-9">
          {/* Header with Results Count and Sort */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-0">
                {loading ? 'Loading...' : `${items.length} Items Found`}
              </h2>
              {getActiveFiltersCount() > 0 && (
                <small className="text-muted">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} applied
                </small>
              )}
            </div>
            
            <div className="d-flex align-items-center gap-2">
              <label className="form-label mb-0 text-muted small">Sort by:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="title_asc">Title: A to Z</option>
                <option value="title_desc">Title: Z to A</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="mb-3">
              <div className="d-flex flex-wrap gap-2">
                {filters.search && (
                  <span className="badge bg-light text-dark border">
                    Search: "{filters.search}"
                    <button
                      className="btn-close btn-close-sm ms-2"
                      onClick={() => handleFilterChange('search', '')}
                    ></button>
                  </span>
                )}
                {filters.category && (
                  <span className="badge bg-light text-dark border">
                    Category: {filters.category}
                    <button
                      className="btn-close btn-close-sm ms-2"
                      onClick={() => handleFilterChange('category', '')}
                    ></button>
                  </span>
                )}
                {filters.listing_type && (
                  <span className="badge bg-light text-dark border">
                    Type: {filters.listing_type}
                    <button
                      className="btn-close btn-close-sm ms-2"
                      onClick={() => handleFilterChange('listing_type', '')}
                    ></button>
                  </span>
                )}
                {filters.condition && (
                  <span className="badge bg-light text-dark border">
                    Condition: {filters.condition}
                    <button
                      className="btn-close btn-close-sm ms-2"
                      onClick={() => handleFilterChange('condition', '')}
                    ></button>
                  </span>
                )}
                {(filters.min_price || filters.max_price) && (
                  <span className="badge bg-light text-dark border">
                    Price: Rs. {filters.min_price || '0'} - {filters.max_price || '∞'}
                    <button
                      className="btn-close btn-close-sm ms-2"
                      onClick={() => {
                        handleFilterChange('min_price', '');
                        handleFilterChange('max_price', '');
                      }}
                    ></button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Items Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3">Loading items...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {items.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
              <h5 className="text-muted">No items found</h5>
              <p className="text-muted">
                {getActiveFiltersCount() > 0 
                  ? 'Try adjusting your filters or search terms'
                  : 'No items are currently available'
                }
              </p>
              {getActiveFiltersCount() > 0 && (
                <button className="btn btn-outline-primary" onClick={clearFilters}>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemsList;