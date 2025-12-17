import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsAPI, isGoogleMapsLoaded } from '../utils/googleMapsLoader';
import LocationPickerFallback from './LocationPickerFallback.jsx';

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const searchInputRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if already loaded
        if (isGoogleMapsLoaded()) {
          setMapLoaded(true);
          initializeMap();
          setLoading(false);
          return;
        }

        // Load Google Maps API
        await loadGoogleMapsAPI();
        setMapLoaded(true);
        initializeMap();
        setLoading(false);
      } catch (err) {
        console.error('Failed to load Google Maps:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initGoogleMaps();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Default to Lahore, Pakistan
    const defaultLocation = initialLocation || {
      lat: 31.5204,
      lng: 74.3587
    };

    // Create map instance
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Create draggable marker
    const markerInstance = new window.google.maps.Marker({
      position: defaultLocation,
      map: mapInstance,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    // Geocode initial position
    geocodePosition(defaultLocation);

    // Handle marker drag end
    markerInstance.addListener('dragend', () => {
      const position = markerInstance.getPosition();
      const latLng = {
        lat: position.lat(),
        lng: position.lng()
      };
      geocodePosition(latLng);
    });

    // Handle map click
    mapInstance.addListener('click', (e) => {
      const latLng = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      markerInstance.setPosition(e.latLng);
      geocodePosition(latLng);
    });

    // Setup search box if input exists
    if (searchInputRef.current) {
      const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places && places.length > 0) {
          const place = places[0];
          if (place.geometry && place.geometry.location) {
            const location = place.geometry.location;
            const latLng = {
              lat: location.lat(),
              lng: location.lng()
            };

            mapInstance.setCenter(location);
            mapInstance.setZoom(15);
            markerInstance.setPosition(location);

            onLocationSelect({
              lat: latLng.lat,
              lng: latLng.lng,
              address: place.formatted_address || place.name
            });
          }
        }
      });
    }

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const geocodePosition = (position) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        onLocationSelect({
          lat: position.lat,
          lng: position.lng,
          address: results[0].formatted_address
        });
      } else {
        onLocationSelect({
          lat: position.lat,
          lng: position.lng,
          address: `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
        });
      }
    });
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          if (map && marker) {
            map.setCenter(pos);
            map.setZoom(15);
            marker.setPosition(pos);
            geocodePosition(pos);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please select manually on the map.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading map...</span>
        </div>
        <p className="text-muted mt-2">Loading Google Maps...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="alert alert-danger mb-3">
          <h6>❌ Google Maps Error</h6>
          <p className="mb-2">{error}</p>
          <small className="text-muted">
            <strong>Troubleshooting:</strong>
            <ul className="mb-0 mt-1">
              <li>Check your internet connection</li>
              <li>Verify API key in .env file</li>
              <li>Restart the development server</li>
              <li>Check browser console for more details</li>
            </ul>
          </small>
        </div>
        <LocationPickerFallback 
          onLocationSelect={onLocationSelect}
          initialLocation={initialLocation}
        />
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div className="alert alert-warning">
        <p className="mb-0">Google Maps is not available. Please check your configuration.</p>
      </div>
    );
  }

  return (
    <div className="location-picker">
      {/* Search Box */}
      <div className="input-group mb-3">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          ref={searchInputRef}
          type="text"
          className="form-control"
          placeholder="Search for a location (e.g., Johar Town, Lahore)..."
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleUseMyLocation}
        >
          <i className="bi bi-geo-alt-fill me-1"></i>
          Use My Location
        </button>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          border: '2px solid #e0e0e0'
        }}
      />

      <div className="alert alert-info mt-3 mb-0">
        <small>
          <i className="bi bi-info-circle me-2"></i>
          <strong>Tip:</strong> Click anywhere on the map or drag the marker to select your location
        </small>
      </div>
    </div>
  );
};

export default LocationPicker;