import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import itemService from '../services/itemService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './MyItems.css';

const MyItems = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [itemToUpdateStatus, setItemToUpdateStatus] = useState(null);
  
  // Filter and search state
  const [activeFilter, setActiveFilter] = useState(searchParams.get('status') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    donated: 0,
    swapped: 0
  });

  // Fetch user's items
  const fetchMyItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await itemService.getMyItems();
      
      if (response.success) {
        const userItems = response.data.items || [];
        setItems(userItems);
        calculateStats(userItems);
      } else {
        throw new Error(response.message || 'Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setError(error.message || 'Failed to load your items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate statistics
  const calculateStats = (itemsList) => {
    const newStats = {
      total: itemsList.length,
      available: itemsList.filter(item => item.status === 'available').length,
      sold: itemsList.filter(item => item.status === 'sold').length,
      donated: itemsList.filter(item => item.status === 'donated').length,
      swapped: itemsList.filter(item => item.status === 'swapped').length
    };
    setStats(newStats);
  };

  // Filter and search items
  const filterAndSearchItems = useCallback(() => {
    let filtered = [...items];
    
    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.status === activeFilter);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'price_high':
          return (b.price || 0) - (a.price || 0);
        case 'price_low':
          return (a.price || 0) - (b.price || 0);
        case 'views':
          return (b.views_count || 0) - (a.views_count || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    setFilteredItems(filtered);
  }, [items, activeFilter, searchQuery, sortBy]);

  // Update URL parameters
  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams();
    if (activeFilter !== 'all') params.set('status', activeFilter);
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    setSearchParams(params);
  }, [activeFilter, searchQuery, sortBy, setSearchParams]);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setSelectedItems([]);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  // Handle item selection for bulk actions
  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  // Handle delete item
  const handleDeleteItem = async (itemId) => {
    try {
      const response = await itemService.deleteItem(itemId);
      
      if (response.success) {
        setItems(prev => prev.filter(item => item.id !== itemId));
        setSelectedItems(prev => prev.filter(id => id !== itemId));
        showToast('Item deleted successfully', 'success');
      } else {
        throw new Error(response.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showToast(error.message || 'Failed to delete item', 'error');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedItems.map(itemId => itemService.deleteItem(itemId));
      await Promise.all(deletePromises);
      
      setItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      showToast(`${selectedItems.length} items deleted successfully`, 'success');
    } catch (error) {
      console.error('Error deleting items:', error);
      showToast('Failed to delete some items', 'error');
    }
  };

  // Handle status update
  const handleStatusUpdate = async (itemId, newStatus) => {
    try {
      const response = await itemService.updateItemStatus(itemId, newStatus);
      
      if (response.success) {
        setItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: newStatus } : item
        ));
        showToast('Item status updated successfully', 'success');
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast(error.message || 'Failed to update status', 'error');
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (newStatus) => {
    try {
      const updatePromises = selectedItems.map(itemId => 
        itemService.updateItemStatus(itemId, newStatus)
      );
      await Promise.all(updatePromises);
      
      setItems(prev => prev.map(item => 
        selectedItems.includes(item.id) ? { ...item, status: newStatus } : item
      ));
      setSelectedItems([]);
      showToast(`${selectedItems.length} items updated successfully`, 'success');
    } catch (error) {
      console.error('Error updating items:', error);
      showToast('Failed to update some items', 'error');
    }
  };

  // Show toast notification
  const showToast = (message, type) => {
    // You can implement a toast notification system here
    // For now, using alert as fallback
    if (type === 'error') {
      alert(`Error: ${message}`);
    } else {
      alert(message);
    }
  };

  // Effects
  useEffect(() => {
    if (user) {
      fetchMyItems();
    }
  }, [fetchMyItems, user]);

  useEffect(() => {
    filterAndSearchItems();
  }, [filterAndSearchItems]);

  useEffect(() => {
    updateURLParams();
  }, [updateURLParams]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="row">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="col-lg-4 col-md-6 mb-4">
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line medium"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      available: 'status-available',
      sold: 'status-sold',
      donated: 'status-donated',
      swapped: 'status-swapped',
      pending: 'status-pending'
    };
    return statusClasses[status] || 'status-available';
  };

  // Get listing type badge class
  const getListingTypeBadge = (listingType) => {
    const badges = {
      sell: { class: 'bg-success', text: 'SELL' },
      donate: { class: 'bg-primary', text: 'DONATE' },
      swap: { class: 'bg-warning', text: 'SWAP' }
    };
    return badges[listingType] || { class: 'bg-secondary', text: listingType?.toUpperCase() };
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="person-x"
          title="Please log in"
          message="You need to be logged in to view your items"
          action={
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Log In
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="my-items-container">
      {/* Header Section */}
      <div className="my-items-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>My Items</h1>
              <p className="subtitle">Manage and track your listed items</p>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to="/create-item" className="btn create-item-btn">
                <i className="bi bi-plus-circle me-2"></i>
                Create New Item
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stats-card total">
              <div className="stats-number">{stats.total}</div>
              <div className="stats-label">Total Items</div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stats-card available">
              <div className="stats-number">{stats.available}</div>
              <div className="stats-label">Available</div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stats-card sold">
              <div className="stats-number">{stats.sold}</div>
              <div className="stats-label">Sold Items</div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stats-card donated">
              <div className="stats-number">{stats.donated}</div>
              <div className="stats-label">Donations</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <div className="d-flex flex-wrap justify-content-center">
            {[
              { key: 'all', label: 'All Items', count: stats.total },
              { key: 'available', label: 'Available', count: stats.available },
              { key: 'sold', label: 'Sold', count: stats.sold },
              { key: 'donated', label: 'Donated', count: stats.donated },
              { key: 'swapped', label: 'Swapped', count: stats.swapped }
            ].map(tab => (
              <button
                key={tab.key}
                className={`filter-tab ${activeFilter === tab.key ? 'active' : ''}`}
                onClick={() => handleFilterChange(tab.key)}
              >
                {tab.label} <span className="count">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="controls-section">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="position-relative">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input
                  type="text"
                  className="form-control search-input ps-5"
                  placeholder="Search your items..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-md-end">
                <label className="me-2 text-muted">Sort by:</label>
                <select
                  className="form-select sort-select"
                  style={{ width: 'auto' }}
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="views">Most Viewed</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bulk-actions show">
            <div className="bulk-actions-left">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={selectedItems.length === filteredItems.length}
                onChange={handleSelectAll}
              />
              <span>{selectedItems.length} item(s) selected</span>
            </div>
            <div className="bulk-actions-right">
              <div className="dropdown me-2">
                <button
                  className="btn btn-outline-primary btn-sm dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  Update Status
                </button>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item" onClick={() => handleBulkStatusUpdate('available')}>Available</button></li>
                  <li><button className="dropdown-item" onClick={() => handleBulkStatusUpdate('sold')}>Sold</button></li>
                  <li><button className="dropdown-item" onClick={() => handleBulkStatusUpdate('donated')}>Donated</button></li>
                  <li><button className="dropdown-item" onClick={() => handleBulkStatusUpdate('swapped')}>Swapped</button></li>
                </ul>
              </div>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleBulkDelete}
              >
                <i className="bi bi-trash me-1"></i>
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button className="btn btn-outline-danger btn-sm ms-3" onClick={fetchMyItems}>
              Try Again
            </button>
          </div>
        )}

        {/* Items Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredItems.length > 0 ? (
          <div className="row">
            {filteredItems.map(item => (
              <div key={item.id} className="col-lg-4 col-md-6 mb-4">
                <div className="my-item-card">
                  {/* Item Image */}
                  <div className="item-image-container">
                    <img
                      src={item.images?.[0]?.image_url || '/placeholder.svg'}
                      alt={item.title}
                      className="item-image"
                    />
                    
                    {/* Status Badge */}
                    <div className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                      {item.status?.toUpperCase()}
                    </div>
                    
                    {/* Listing Type Badge */}
                    <div className={`listing-type-badge badge ${getListingTypeBadge(item.listing_type).class}`}>
                      {getListingTypeBadge(item.listing_type).text}
                    </div>
                    
                    {/* Views Badge */}
                    {item.views_count > 0 && (
                      <div className="views-badge">
                        <i className="bi bi-eye me-1"></i>
                        {item.views_count}
                      </div>
                    )}
                    
                    {/* Selection Checkbox */}
                    <div className="position-absolute top-0 start-0 m-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                      />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="item-card-body">
                    <h5 className="item-title">{item.title}</h5>
                    <p className="item-description">{item.description}</p>
                    
                    <div className="item-meta">
                      <div>
                        <span className="badge bg-light text-dark me-2">
                          <i className="bi bi-tag me-1"></i>
                          {item.category}
                        </span>
                        {item.condition && (
                          <span className="badge bg-info text-dark">
                            {item.condition.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      {item.listing_type === 'sell' && item.price && (
                        <div className="item-price">
                          Rs. {parseFloat(item.price).toLocaleString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small className="item-date text-muted">
                        <i className="bi bi-calendar me-1"></i>
                        {formatDate(item.created_at)}
                      </small>
                      <small className="text-muted">
                        <i className="bi bi-geo-alt me-1"></i>
                        {item.address?.split(',')[0] || 'No location'}
                      </small>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                      <Link
                        to={`/items/${item.id}`}
                        className="action-btn btn btn-outline-primary"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View
                      </Link>
                      <Link
                        to={`/items/${item.id}/edit`}
                        className="action-btn edit btn"
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </Link>
                      <div className="dropdown">
                        <button
                          className="action-btn status btn dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                        >
                          <i className="bi bi-arrow-repeat me-1"></i>
                          Status
                        </button>
                        <ul className="dropdown-menu">
                          <li><button className="dropdown-item" onClick={() => handleStatusUpdate(item.id, 'available')}>Available</button></li>
                          <li><button className="dropdown-item" onClick={() => handleStatusUpdate(item.id, 'sold')}>Sold</button></li>
                          <li><button className="dropdown-item" onClick={() => handleStatusUpdate(item.id, 'donated')}>Donated</button></li>
                          <li><button className="dropdown-item" onClick={() => handleStatusUpdate(item.id, 'swapped')}>Swapped</button></li>
                        </ul>
                      </div>
                      <button
                        className="action-btn delete btn"
                        onClick={() => {
                          setItemToDelete(item.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="inbox"
            title={
              activeFilter === 'all' 
                ? "No items found" 
                : `No ${activeFilter} items`
            }
            message={
              searchQuery 
                ? `No items match your search "${searchQuery}"`
                : activeFilter === 'all'
                ? "You haven't listed any items yet. Create your first item to get started!"
                : `You don't have any ${activeFilter} items yet.`
            }
            action={
              <div>
                {searchQuery && (
                  <button 
                    className="btn btn-outline-secondary me-2"
                    onClick={() => handleSearch('')}
                  >
                    Clear Search
                  </button>
                )}
                <Link to="/create-item" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Your First Item
                </Link>
              </div>
            }
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this item? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    handleDeleteItem(itemToDelete);
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyItems;