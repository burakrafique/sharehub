import React, { useState } from 'react';

const LocationPickerFallback = ({ onLocationSelect, initialLocation }) => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({
    lat: initialLocation?.lat || 31.5204,
    lng: initialLocation?.lng || 74.3587
  });

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleCoordinateChange = (field, value) => {
    const newCoords = { ...coordinates, [field]: parseFloat(value) || 0 };
    setCoordinates(newCoords);
    
    onLocationSelect({
      lat: newCoords.lat,
      lng: newCoords.lng,
      address: address || `${newCoords.lat}, ${newCoords.lng}`
    });
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCoordinates(newCoords);
          onLocationSelect({
            lat: newCoords.lat,
            lng: newCoords.lng,
            address: address || `${newCoords.lat}, ${newCoords.lng}`
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = () => {
    onLocationSelect({
      lat: coordinates.lat,
      lng: coordinates.lng,
      address: address || `${coordinates.lat}, ${coordinates.lng}`
    });
  };

  return (
    <div className="location-picker-fallback">
      <div className="alert alert-warning mb-3">
        <h6>📍 Manual Location Entry</h6>
        <p className="mb-0">Google Maps is not available. Please enter your location manually.</p>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your address (e.g., Johar Town, Lahore)"
            value={address}
            onChange={handleAddressChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Latitude</label>
          <input
            type="number"
            step="0.000001"
            className="form-control"
            placeholder="31.5204"
            value={coordinates.lat}
            onChange={(e) => handleCoordinateChange('lat', e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Longitude</label>
          <input
            type="number"
            step="0.000001"
            className="form-control"
            placeholder="74.3587"
            value={coordinates.lng}
            onChange={(e) => handleCoordinateChange('lng', e.target.value)}
          />
        </div>

        <div className="col-12">
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUseMyLocation}
            >
              <i className="bi bi-geo-alt-fill me-1"></i>
              Use My Location
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSubmit}
            >
              <i className="bi bi-check-lg me-1"></i>
              Confirm Location
            </button>
          </div>
        </div>
      </div>

      <div className="alert alert-info mt-3">
        <small>
          <i className="bi bi-info-circle me-2"></i>
          <strong>Tip:</strong> You can find coordinates by searching your location on Google Maps and copying the coordinates from the URL.
        </small>
      </div>
    </div>
  );
};

export default LocationPickerFallback;