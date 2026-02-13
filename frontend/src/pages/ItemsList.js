import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import itemService from '../services/itemService';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './ItemsList.css';

const ItemsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // State management
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    listing_type: searchParams.get('listing_type') || '',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('min_price') || '',
    maxPrice: searchParams.get('max_price') || '',
    searchQuery: searchParams.get('search') || ''
  });
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    totalPages: 1,
    totalItems: 0
  });
  
  // Sort state
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_at');
  const [order, setOrder] = useState(searchParams.get('order') || 'DESC');

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Update URL params when filters change
  const updateURLParams = useCallback((newFilters, newPagination, newSort, newOrder) => {
    const params = new URLSearchParams();
    
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.listing_type) params.set('listing_type', newFilters.listing_type);
    if (newFilters.condition) params.set('condition', newFilters.condition);
    if (newFilters.minPrice) params.set('min_price', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('max_price', newFilters.maxPrice);
    if (newFilters.searchQuery) params.set('search', newFilters.searchQuery);
    if (newPagination.page > 1) params.set('page', newPagination.page.toString());
    if (newSort !== 'created_at') params.set('sort', newSort);
    if (newOrder !== 'DESC') params.set('order', newOrder);
    
    setSearchParams(params);
  }, [setSearchParams]);

  // Fetch items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sort_by: sortBy,
        order: order
      };
      
      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key] || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const response = await itemService.getAllItems(queryParams);
      
      if (response.success) {
        setItems(response.data.items || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.totalPages || 1,
          totalItems: response.data.totalItems || 0
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setError(error.message || 'Failed to load items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit, sortBy, order]);

  // Initial load and when dependencies change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Update URL when state changes
  useEffect(() => {
    updateURLParams(filters, pagination, sortBy, order);
  }, [filters, pagination, sortBy, order, updateURLParams]);

  // Handle search with debouncing
  const handleSearch = useCallback((searchQuery) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchQuery }));
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500);
    
    setSearchTimeout(timeout);
  }, [searchTimeout]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle sort changes
  const handleSortChange = (value) => {
    const [newSortBy, newOrder] = value.split('_');
    setSortBy(newSortBy);
    setOrder(newOrder || 'DESC');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      listing_type: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      searchQuery: ''
    });
    setSortBy('created_at');
    setOrder('DESC');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  // Handle mobile filter toggle
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="col">
          <div className="card skeleton-card loading-skeleton">
            <div className="skeleton-image loading-skeleton"></div>
            <div className="card-body">
              <div className="skeleton-text loading-skeleton"></div>
              <div className="skeleton-text short loading-skeleton"></div>
              <div className="skeleton-text medium loading-skeleton"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="items-list-container">
      <div className="container-fluid py-4">
        {/* Mobile Filter Overlay */}
        {showMobileFilters && (
          <div className="filter-overlay show d-lg-none" onClick={toggleMobileFilters}></div>
        )}
        
        {/* Search Bar */}
        <div className="row mb-4">
          <div className="col-12">
            <SearchBar 
              onSearch={handleSearch}
              initialValue={filters.searchQuery}
              placeholder="Search for items..."
            />
          </div>
        </div>

        <div className="row">
          {/* Desktop Filter Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              activeFiltersCount={getActiveFiltersCount()}
            />
          </div>

          {/* Mobile Filter Sidebar */}
          <div className={`filter-sidebar-mobile d-lg-none ${showMobileFilters ? 'show' : ''}`}>
            <div className="p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Filters</h5>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={toggleMobileFilters}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
            <div className="p-3">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                activeFiltersCount={getActiveFiltersCount()}
                isMobile={true}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Results Header */}
            <div className="results-header">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h2 className="h4 mb-1">
                    {loading ? 'Loading...' : `${pagination.totalItems} Items Found`}
                  </h2>
                  {getActiveFiltersCount() > 0 && (
                    <small className="text-muted">
                      {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} applied
                    </small>
                  )}
                </div>
                
                {/* Mobile Filter Toggle */}
                <button 
                  className="btn btn-outline-primary d-lg-none"
                  onClick={toggleMobileFilters}
                >
                  <i className="bi bi-funnel me-2"></i>
                  Filters
                  {getActiveFiltersCount() > 0 && (
                    <span className="badge bg-primary ms-2">{getActiveFiltersCount()}</span>
                  )}
                </button>
              </div>
              
              {/* Sort Controls */}
              <div className="d-flex align-items-center gap-2">
                <label className="form-label mb-0 text-muted small">Sort by:</label>
                <select
                  className="form-select form-select-sm sort-select"
                  value={`${sortBy}_${order}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="created_at_DESC">Latest First</option>
                  <option value="created_at_ASC">Oldest First</option>
                  <option value="price_ASC">Price: Low to High</option>
                  <option value="price_DESC">Price: High to Low</option>
                  <option value="title_ASC">Title: A to Z</option>
                  <option value="title_DESC">Title: Z to A</option>
                  <option value="views_DESC">Most Viewed</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {getActiveFiltersCount() > 0 && (
              <div className="active-filters">
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <span className="text-muted small">Active filters:</span>
                  {filters.searchQuery && (
                    <span className="filter-badge">
                      Search: "{filters.searchQuery}"
                      <button
                        className="btn-close"
                        onClick={() => handleFilterChange('searchQuery', '')}
                        aria-label="Remove search filter"
                      ></button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="filter-badge">
                      Category: {filters.category}
                      <button
                        className="btn-close"
                        onClick={() => handleFilterChange('category', '')}
                        aria-label="Remove category filter"
                      ></button>
                    </span>
                  )}
                  {filters.listing_type && (
                    <span className="filter-badge">
                      Type: {filters.listing_type}
                      <button
                        className="btn-close"
                        onClick={() => handleFilterChange('listing_type', '')}
                        aria-label="Remove type filter"
                      ></button>
                    </span>
                  )}
                  {filters.condition && (
                    <span className="filter-badge">
                      Condition: {filters.condition}
                      <button
                        className="btn-close"
                        onClick={() => handleFilterChange('condition', '')}
                        aria-label="Remove condition filter"
                      ></button>
                    </span>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="filter-badge">
                      Price: Rs. {filters.minPrice || '0'} - {filters.maxPrice || '∞'}
                      <button
                        className="btn-close"
                        onClick={() => {
                          handleFilterChange('minPrice', '');
                          handleFilterChange('maxPrice', '');
                        }}
                        aria-label="Remove price filter"
                      ></button>
                    </span>
                  )}
                  <button className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                    <i className="bi bi-x-circle me-1"></i>
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button className="btn btn-outline-danger btn-sm ms-3" onClick={fetchItems}>
                  Try Again
                </button>
              </div>
            )}

            {/* Items Grid */}
            <div className="items-grid fade-in">
              {loading ? (
                <LoadingSkeleton />
              ) : items.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {items.map(item => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="bi-inbox"
                  title="No items found"
                  message={
                    getActiveFiltersCount() > 0 
                      ? 'Try adjusting your filters or search terms'
                      : 'No items are currently available'
                  }
                  action={
                    getActiveFiltersCount() > 0 ? (
                      <button className="btn btn-outline-primary" onClick={clearFilters}>
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Clear Filters
                      </button>
                    ) : null
                  }
                />
              )}
            </div>

            {/* Pagination */}
            {!loading && items.length > 0 && pagination.totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalItems)} of {pagination.totalItems} items
                </div>
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.limit}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsList;