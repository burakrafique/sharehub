import React, { useState } from 'react';
import LocationPicker from '../components/LocationPicker';

const GoogleMapsTest = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [testResults, setTestResults] = useState({
    googleLoaded: false,
    mapsLoaded: false,
    placesLoaded: false,
    apiKeyPresent: false
  });

  React.useEffect(() => {
    // Test Google Maps API loading
    const checkGoogleMaps = () => {
      const results = {
        googleLoaded: !!window.google,
        mapsLoaded: !!(window.google && window.google.maps),
        placesLoaded: !!(window.google && window.google.maps && window.google.maps.places),
        apiKeyPresent: !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      };
      setTestResults(results);
    };

    // Check immediately and after a delay
    checkGoogleMaps();
    setTimeout(checkGoogleMaps, 2000);
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    console.log('Location selected:', location);
  };

  const TestStatus = ({ label, status }) => (
    <div className="d-flex align-items-center mb-2">
      <span className={`badge ${status ? 'bg-success' : 'bg-danger'} me-2`}>
        {status ? '✓' : '✗'}
      </span>
      <span>{label}</span>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Google Maps Integration Test</h3>
            </div>
            <div className="card-body">
              <h5>Test the LocationPicker Component</h5>
              <p className="text-muted">
                Use the map below to test all Google Maps functionality:
              </p>
              
              <LocationPicker 
                onLocationSelect={handleLocationSelect}
                initialLocation={{ lat: 31.5204, lng: 74.3587 }}
              />

              {selectedLocation && (
                <div className="alert alert-success mt-3">
                  <h6>✅ Location Selected Successfully!</h6>
                  <p className="mb-1"><strong>Address:</strong> {selectedLocation.address}</p>
                  <p className="mb-0">
                    <strong>Coordinates:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>System Status</h5>
            </div>
            <div className="card-body">
              <TestStatus 
                label="Google API Loaded" 
                status={testResults.googleLoaded} 
              />
              <TestStatus 
                label="Maps API Available" 
                status={testResults.mapsLoaded} 
              />
              <TestStatus 
                label="Places API Available" 
                status={testResults.placesLoaded} 
              />
              <TestStatus 
                label="API Key Present" 
                status={testResults.apiKeyPresent} 
              />

              <hr />

              <h6>Debug Information</h6>
              <small className="text-muted">
                <div><strong>API Key:</strong> {process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing'}</div>
                <div><strong>Google Object:</strong> {window.google ? 'Loaded' : 'Not Loaded'}</div>
                <div><strong>User Agent:</strong> {navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other'}</div>
              </small>

              <hr />

              <h6>Test Checklist</h6>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="test1" />
                <label className="form-check-label small" htmlFor="test1">
                  Map loads without errors
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="test2" />
                <label className="form-check-label small" htmlFor="test2">
                  Search box works
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="test3" />
                <label className="form-check-label small" htmlFor="test3">
                  Click to place marker
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="test4" />
                <label className="form-check-label small" htmlFor="test4">
                  Drag marker works
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="test5" />
                <label className="form-check-label small" htmlFor="test5">
                  "Use My Location" works
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="test6" />
                <label className="form-check-label small" htmlFor="test6">
                  Address displays correctly
                </label>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h6>Console Commands</h6>
            </div>
            <div className="card-body">
              <small>
                <p>Open browser console (F12) and try:</p>
                <code>window.google</code><br />
                <code>window.google.maps</code><br />
                <code>window.google.maps.places</code>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsTest;