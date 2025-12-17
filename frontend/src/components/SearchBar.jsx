import React, { useState } from 'react';
import { Form, Row, Col, Button, InputGroup, Card, Collapse } from 'react-bootstrap';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const SearchBar = ({ onSearch, showAdvanced = true }) => {
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    category: '',
    listing_type: '',
    min_price: '',
    max_price: '',
    condition: '',
    sort_by: 'created_at',
    order: 'DESC'
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    const searchParams = {
      search: searchText,
      ...filters
    };

    // Remove empty values
    Object.keys(searchParams).forEach(key => {
      if (!searchParams[key]) {
        delete searchParams[key];
      }
    });

    onSearch(searchParams);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setFilters({
      category: '',
      listing_type: '',
      min_price: '',
      max_price: '',
      condition: '',
      sort_by: 'created_at',
      order: 'DESC'
    });
    onSearch({});
  };

  const hasActiveFilters = () => {
    return searchText || filters.category || filters.listing_type || 
           filters.min_price || filters.max_price || filters.condition;
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Form onSubmit={handleSearch}>
          {/* Main Search Bar */}
          <Row className="mb-3">
            <Col>
              <InputGroup size="lg">
                <Form.Control
                  type="text"
                  placeholder="Search for items..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  <FaSearch className="me-2" />
                  Search
                </Button>
                {showAdvanced && (
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FaFilter className="me-2" />
                    Filters
                  </Button>
                )}
              </InputGroup>
            </Col>
          </Row>

          {/* Advanced Filters */}
          {showAdvanced && (
            <Collapse in={showFilters}>
              <div>
                <hr />
                <h6 className="mb-3">Advanced Filters</h6>
                
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Categories</option>
                        <option value="clothes">Clothes</option>
                        <option value="books">Books</option>
                        <option value="ration">Ration</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Listing Type</Form.Label>
                      <Form.Select
                        name="listing_type"
                        value={filters.listing_type}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Types</option>
                        <option value="sell">For Sale</option>
                        <option value="donate">Donate</option>
                        <option value="exchange">Exchange</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Condition</Form.Label>
                      <Form.Select
                        name="condition"
                        value={filters.condition}
                        onChange={handleFilterChange}
                      >
                        <option value="">Any Condition</option>
                        <option value="new">New</option>
                        <option value="like_new">Like New</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Sort By</Form.Label>
                      <Form.Select
                        name="sort_by"
                        value={filters.sort_by}
                        onChange={handleFilterChange}
                      >
                        <option value="created_at">Date Posted</option>
                        <option value="price">Price</option>
                        <option value="title">Title</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Min Price (Rs.)</Form.Label>
                      <Form.Control
                        type="number"
                        name="min_price"
                        value={filters.min_price}
                        onChange={handleFilterChange}
                        placeholder="0"
                        min="0"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Max Price (Rs.)</Form.Label>
                      <Form.Control
                        type="number"
                        name="max_price"
                        value={filters.max_price}
                        onChange={handleFilterChange}
                        placeholder="Any"
                        min="0"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Order</Form.Label>
                      <Form.Select
                        name="order"
                        value={filters.order}
                        onChange={handleFilterChange}
                      >
                        <option value="DESC">Newest First</option>
                        <option value="ASC">Oldest First</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={3} className="d-flex align-items-end">
                    <Button 
                      variant="outline-danger" 
                      className="w-100"
                      onClick={handleClearFilters}
                      disabled={!hasActiveFilters()}
                    >
                      <FaTimes className="me-2" />
                      Clear Filters
                    </Button>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit">
                    <FaSearch className="me-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </Collapse>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SearchBar;
