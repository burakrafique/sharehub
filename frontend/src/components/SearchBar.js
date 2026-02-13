import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, initialValue = '', placeholder = 'Search items...' }) => {
  const [searchText, setSearchText] = useState(initialValue);

  useEffect(() => {
    setSearchText(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchText);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    // Trigger search on input change for real-time search
    onSearch(value);
  };

  const handleClear = () => {
    setSearchText('');
    onSearch('');
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit}>
        <div className="search-input-group">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder={placeholder}
            value={searchText}
            onChange={handleInputChange}
          />
          {searchText && (
            <button
              type="button"
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3"
              onClick={handleClear}
              style={{ zIndex: 5 }}
            >
              <i className="bi bi-x-circle text-muted"></i>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
