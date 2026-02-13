import React, { useState, useEffect } from 'react';
import { getNearbyItems, searchItems } from '../services/itemService';
import LocationMap from './LocationMap';
import ItemCard from './ItemCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './LocationBasedSearch.css';

const LocationBasedSearch = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10);
  const [filters, setFilters] = useState({
    category: '',
    listing_type: '',
    search: ''
  });
  const [mapView, setMapView] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      searchNearbyItems();
    }
  }, [userLocation, searchRadius, filters]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          setError('Unable to get your location. Please enable location services.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const searchNearbyItems = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      setError('');

      let response;
      if (filters.search || filters.category || filters.listing_type) {
        // Use advanced search with location
        const searchParams = {
          ...filters,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius: searchRadius
        };
        response = await searchItems(searchParams);
      } else {
        // Use simple nearby search
        response = await getNearbyItems(
          userLocation.latitude,
          userLocation.longitude,
          searchRadius
        );
      }

      setItems(response.data || []);
    } catch (error) {
      setError('Failed to search nearby items');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (latitude, longitude) => {
    setUserLocation({ latitude, longitude });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadiusChange = (e) => {
    setSearchRadius(parseInt(e.target.value));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      listing_type: '',
      search: ''
    });
  };

  const getMapMarkers = () => {
    return items.map(item => ({
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude),
      title: item.title,
      id: item.id,
      onClick: (itemId) => {
        window.location.href = `/items/${itemId}`;
      }
    })).filter(marker => !isNaN(marker.lat) && !isNaN(marker.lng));
  };

  return (
    <div className="location-search-container">
      <div className="search-header">
        <h2>Find Items Near You</h2>
        <p>Discover items available in your area</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="search-controls">
        <div className="search-filters">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              placeholder="Search items..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="clothes">Clothes</option>
              <option value="books">Books</option>
              <option value="ration">Ration Items</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              name="listing_type"
              value={filters.listing_type}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="sell">For Sale</option>
              <option value="donate">For Donation</option>
              <option value="exchange">For Exchange</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="radius">Radius: {searchRadius} km</label>
            <input
              type="range"
              id="radius"
              min="1"
              max="50"
              value={searchRadius}
              onChange={handleRadiusChange}
              className="radius-slider"
            />
          </div>

          <button onClick={clearFilters} className="clear-btn">
            Clear Filters
          </button>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${!mapView ? 'active' : ''}`}
            onClick={() => setMapView(false)}
          >
            List View
          </button>
          <button
            className={`toggle-btn ${mapView ? 'active' : ''}`}
            onClick={() => setMapView(true)}
          >
            Map View
          </button>
        </div>
      </div>

      {!userLocation && !error && (
        <div className="location-prompt">
          <p>Getting your location...</p>
          <button onClick={getCurrentLocation} className="location-btn">
            Enable Location
          </button>
        </div>
      )}

      {loading && <LoadingSpinner />}

      {userLocation && !loading && (
        <>
          {mapView ? (
            <div className="map-view">
              <LocationMap
                latitude={userLocation.latitude}
                longitude={userLocation.longitude}
                markers={getMapMarkers()}
                height="600px"
                zoom={12}
                editable={true}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          ) : (
            <div className="items-grid">
              {items.length === 0 ? (
                <div className="no-items">
                  <h3>No items found in your area</h3>
                  <p>Try increasing the search radius or adjusting your filters.</p>
                </div>
              ) : (
                <>
                  <div className="results-header">
                    <h3>Found {items.length} items within {searchRadius} km</h3>
                  </div>
                  <div className="items-list">
                    {items.map(item => (
                      <ItemCard key={item.id} item={item} showDistance={true} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LocationBasedSearch;