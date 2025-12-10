import { useState, useEffect } from 'react';
import { Card, Form, Button, Badge, Accordion, InputGroup } from 'react-bootstrap';
import { FaFilter, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import './FilterSidebar.css';

const FilterSidebar = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    categories: initialFilters.categories || [],
    listingType: initialFilters.listingType || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    condition: initialFilters.condition || '',
    locationRadius: initialFilters.locationRadius || '',
    sortBy: initialFilters.sortBy || 'newest'
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    // Count active filters
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.listingType) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.condition) count++;
    if (filters.locationRadius) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    updateFilter('categories', newCategories);
  };

  const handleListingTypeChange = (type) => {
    updateFilter('listingType', filters.listingType === type ? '' : type);
  };

  const handlePriceChange = (field, value) => {
    updateFilter(field, value);
  };

  const handleConditionChange = (e) => {
    updateFilter('condition', e.target.value);
  };

  const handleLocationRadiusChange = (e) => {
    updateFilter('locationRadius', e.target.value);
  };

  const handleSortChange = (e) => {
    updateFilter('sortBy', e.target.value);
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      categories: [],
      listingType: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      locationRadius: '',
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  const categories = [
    { value: 'clothes', label: 'Clothes', icon: '👕' },
    { value: 'books', label: 'Books', icon: '📚' },
    { value: 'ration', label: 'Ration', icon: '🍱' },
    { value: 'electronics', label: 'Electronics', icon: '💻' },
    { value: 'furniture', label: 'Furniture', icon: '🪑' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];

  const listingTypes = [
    { value: 'sell', label: 'For Sale', icon: '💰' },
    { value: 'donate', label: 'Donation', icon: '🎁' },
    { value: 'exchange', label: 'Exchange', icon: '🔄' }
  ];

  const conditions = [
    { value: '', label: 'Any Condition' },
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'title_asc', label: 'Title: A to Z' },
    { value: 'title_desc', label: 'Title: Z to A' }
  ];

  return (
    <Card className="filter-sidebar shadow-sm sticky-top" style={{ top: '80px' }}>
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <div>
          <FaFilter className="me-2" />
          <strong>Filters</strong>
          {activeFiltersCount > 0 && (
            <Badge bg="light" text="dark" className="ms-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button 
            variant="light" 
            size="sm"
            onClick={handleClearFilters}
            title="Clear all filters"
          >
            <FaTimes />
          </Button>
        )}
      </Card.Header>

      <Card.Body className="filter-sidebar-body">
        <Accordion defaultActiveKey={['0', '1']} alwaysOpen>
          {/* Category Filter */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <strong>Category</strong>
              {filters.categories.length > 0 && (
                <Badge bg="primary" className="ms-2">
                  {filters.categories.length}
                </Badge>
              )}
            </Accordion.Header>
            <Accordion.Body>
              {categories.map((category) => (
                <Form.Check
                  key={category.value}
                  type="checkbox"
                  id={`category-${category.value}`}
                  label={
                    <span>
                      <span className="me-2">{category.icon}</span>
                      {category.label}
                    </span>
                  }
                  checked={filters.categories.includes(category.value)}
                  onChange={() => handleCategoryChange(category.value)}
                  className="mb-2"
                />
              ))}
            </Accordion.Body>
          </Accordion.Item>

          {/* Listing Type Filter */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <strong>Listing Type</strong>
              {filters.listingType && (
                <Badge bg="primary" className="ms-2">1</Badge>
              )}
            </Accordion.Header>
            <Accordion.Body>
              {listingTypes.map((type) => (
                <Form.Check
                  key={type.value}
                  type="radio"
                  id={`type-${type.value}`}
                  name="listingType"
                  label={
                    <span>
                      <span className="me-2">{type.icon}</span>
                      {type.label}
                    </span>
                  }
                  checked={filters.listingType === type.value}
                  onChange={() => handleListingTypeChange(type.value)}
                  className="mb-2"
                />
              ))}
              {filters.listingType && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 text-decoration-none"
                  onClick={() => handleListingTypeChange('')}
                >
                  Clear selection
                </Button>
              )}
            </Accordion.Body>
          </Accordion.Item>

          {/* Price Range Filter */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <strong>Price Range</strong>
              {(filters.minPrice || filters.maxPrice) && (
                <Badge bg="primary" className="ms-2">1</Badge>
              )}
            </Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-3">
                <Form.Label className="small">Minimum Price (Rs.)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  min="0"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small">Maximum Price (Rs.)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  min="0"
                />
              </Form.Group>
              {(filters.minPrice || filters.maxPrice) && (
                <div className="text-center">
                  <Badge bg="info">
                    {filters.minPrice && `Rs. ${filters.minPrice}`}
                    {filters.minPrice && filters.maxPrice && ' - '}
                    {filters.maxPrice && `Rs. ${filters.maxPrice}`}
                  </Badge>
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>

          {/* Condition Filter */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <strong>Condition</strong>
              {filters.condition && (
                <Badge bg="primary" className="ms-2">1</Badge>
              )}
            </Accordion.Header>
            <Accordion.Body>
              <Form.Select
                value={filters.condition}
                onChange={handleConditionChange}
                size="sm"
              >
                {conditions.map((condition) => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </Form.Select>
            </Accordion.Body>
          </Accordion.Item>

          {/* Location Radius Filter */}
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <strong>
                <FaMapMarkerAlt className="me-2" />
                Location Radius
              </strong>
              {filters.locationRadius && (
                <Badge bg="primary" className="ms-2">1</Badge>
              )}
            </Accordion.Header>
            <Accordion.Body>
              <Form.Group>
                <Form.Label className="small">
                  Within {filters.locationRadius || '0'} km
                </Form.Label>
                <Form.Range
                  value={filters.locationRadius}
                  onChange={handleLocationRadiusChange}
                  min="0"
                  max="100"
                  step="5"
                />
                <div className="d-flex justify-content-between small text-muted">
                  <span>0 km</span>
                  <span>50 km</span>
                  <span>100 km</span>
                </div>
              </Form.Group>
              <Form.Text className="text-muted">
                Set to 0 to disable location filter
              </Form.Text>
            </Accordion.Body>
          </Accordion.Item>

          {/* Sort By */}
          <Accordion.Item eventKey="5">
            <Accordion.Header>
              <strong>Sort By</strong>
            </Accordion.Header>
            <Accordion.Body>
              <Form.Select
                value={filters.sortBy}
                onChange={handleSortChange}
                size="sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>

      <Card.Footer className="bg-light">
        <div className="d-grid gap-2">
          <Button 
            variant="primary" 
            onClick={handleApplyFilters}
            disabled={activeFiltersCount === 0 && filters.sortBy === 'newest'}
          >
            Apply Filters
          </Button>
          {activeFiltersCount > 0 && (
            <Button 
              variant="outline-secondary" 
              onClick={handleClearFilters}
            >
              <FaTimes className="me-2" />
              Clear All
            </Button>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default FilterSidebar;
