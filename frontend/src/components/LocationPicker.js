import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      onLocationSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        address: `Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`
      });
    },
  });

  return position ? <Marker position={position} draggable={true} eventHandlers={{
    dragend: (e) => {
      const marker = e.target;
      const newPos = marker.getLatLng();
      setPosition([newPos.lat, newPos.lng]);
      onLocationSelect({
        lat: newPos.lat,
        lng: newPos.lng,
        address: `Lat: ${newPos.lat.toFixed(4)}, Lng: ${newPos.lng.toFixed(4)}`
      });
    }
  }} /> : null;
};

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  // Default to Lahore, Pakistan
  const defaultPosition = initialLocation 
    ? [initialLocation.lat, initialLocation.lng]
    : [31.5204, 74.3587];
  
  const [position, setPosition] = useState(defaultPosition);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = React.useRef(null);

  useEffect(() => {
    // Set initial location
    if (initialLocation) {
      onLocationSelect({
        lat: initialLocation.lat,
        lng: initialLocation.lng,
        address: `Lat: ${initialLocation.lat.toFixed(4)}, Lng: ${initialLocation.lng.toFixed(4)}`
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.position-relative')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setSuggestions(data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Suggestion error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for autocomplete
    if (value.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 500); // Wait 500ms after user stops typing
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a location to search');
      return;
    }

    setSearching(true);
    setSearchResults([]);
    setShowSuggestions(false);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setSearchResults(data);
        setShowResults(true);
      } else {
        alert('No results found. Try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search location. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = (result) => {
    const newPos = [parseFloat(result.lat), parseFloat(result.lon)];
    setPosition(newPos);
    onLocationSelect({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name
    });
    setShowResults(false);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const handleSelectSuggestion = (suggestion) => {
    const newPos = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];
    setPosition(newPos);
    onLocationSelect({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      address: suggestion.display_name
    });
    setShowSuggestions(false);
    setSearchQuery(suggestion.display_name);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        onLocationSelect({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`
        });
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to get your location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        
        alert(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="location-picker">
      {/* Search Box */}
      <div className="mb-3 position-relative">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search for a location (e.g., Johar Town, Lahore)..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={handleSearch}
            disabled={searching}
          >
            {searching ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleUseMyLocation}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Getting...
              </>
            ) : (
              <>
                <i className="bi bi-geo-alt-fill me-1"></i>
                My Location
              </>
            )}
          </button>
        </div>

        {/* Autocomplete Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            className="position-absolute w-100 mt-1" 
            style={{ 
              zIndex: 1000,
              maxHeight: '250px',
              overflowY: 'auto',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <div className="list-group">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="list-group-item list-group-item-action text-start"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="bi bi-geo-alt text-primary me-2"></i>
                  <small>{suggestion.display_name}</small>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className="mb-3">
          <div className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                className="list-group-item list-group-item-action text-start"
                onClick={() => handleSelectResult(result)}
              >
                <i className="bi bi-geo-alt text-primary me-2"></i>
                <small>{result.display_name}</small>
              </button>
            ))}
          </div>
          <button
            className="btn btn-sm btn-link"
            onClick={() => setShowResults(false)}
          >
            Close results
          </button>
        </div>
      )}

      {/* Map Container */}
      <div style={{ height: '400px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e0e0e0' }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          key={`${position[0]}-${position[1]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            setPosition={setPosition}
            onLocationSelect={onLocationSelect}
          />
        </MapContainer>
      </div>

      <div className="alert alert-info mt-3 mb-0">
        <small>
          <i className="bi bi-info-circle me-2"></i>
          <strong>Tips:</strong>
          <ul className="mb-0 mt-1">
            <li>Search for an address or place name (e.g., "Johar Town, Lahore")</li>
            <li>Click "My Location" to get your current GPS location</li>
            <li>Click anywhere on the map to select a location</li>
            <li>Drag the marker to adjust your location</li>
          </ul>
        </small>
      </div>
    </div>
  );
};

export default LocationPicker;
