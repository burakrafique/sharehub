import React, { useEffect, useState } from 'react';

const SimpleMapTest = () => {
  const [status, setStatus] = useState('Checking...');
  const [details, setDetails] = useState({});

  useEffect(() => {
    const checkGoogleMaps = () => {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      
      const results = {
        apiKeyPresent: !!apiKey,
        apiKeyValue: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found',
        googleObject: !!window.google,
        mapsAPI: !!(window.google && window.google.maps),
        placesAPI: !!(window.google && window.google.maps && window.google.maps.places),
        timestamp: new Date().toLocaleTimeString()
      };

      setDetails(results);

      if (results.mapsAPI) {
        setStatus('✅ Google Maps API is working!');
      } else if (results.googleObject) {
        setStatus('⚠️ Google object found but Maps API not ready');
      } else if (results.apiKeyPresent) {
        setStatus('⏳ API key found, waiting for Google Maps to load...');
      } else {
        setStatus('❌ API key missing');
      }
    };

    // Check immediately
    checkGoogleMaps();

    // Check every 2 seconds for 30 seconds
    const interval = setInterval(checkGoogleMaps, 2000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!window.google || !window.google.maps) {
        setStatus('❌ Google Maps failed to load after 30 seconds');
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const testMapCreation = () => {
    if (!window.google || !window.google.maps) {
      alert('Google Maps API not loaded yet');
      return;
    }

    try {
      // Create a test div
      const testDiv = document.createElement('div');
      testDiv.style.width = '300px';
      testDiv.style.height = '200px';
      testDiv.id = 'test-map';
      
      // Clear any existing test map
      const existing = document.getElementById('test-map-container');
      if (existing) {
        existing.innerHTML = '';
        existing.appendChild(testDiv);
      }

      // Create map
      const map = new window.google.maps.Map(testDiv, {
        center: { lat: 31.5204, lng: 74.3587 },
        zoom: 13
      });

      // Add marker
      new window.google.maps.Marker({
        position: { lat: 31.5204, lng: 74.3587 },
        map: map,
        title: 'Test Location - Lahore'
      });

      setStatus('✅ Map created successfully!');
    } catch (error) {
      setStatus(`❌ Map creation failed: ${error.message}`);
    }
  };

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header">
          <h4>🗺️ Simple Google Maps Test</h4>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h5>Status: {status}</h5>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h6>Diagnostic Details:</h6>
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <td>API Key Present:</td>
                    <td>{details.apiKeyPresent ? '✅ Yes' : '❌ No'}</td>
                  </tr>
                  <tr>
                    <td>API Key Value:</td>
                    <td><code>{details.apiKeyValue}</code></td>
                  </tr>
                  <tr>
                    <td>Google Object:</td>
                    <td>{details.googleObject ? '✅ Loaded' : '❌ Not Loaded'}</td>
                  </tr>
                  <tr>
                    <td>Maps API:</td>
                    <td>{details.mapsAPI ? '✅ Available' : '❌ Not Available'}</td>
                  </tr>
                  <tr>
                    <td>Places API:</td>
                    <td>{details.placesAPI ? '✅ Available' : '❌ Not Available'}</td>
                  </tr>
                  <tr>
                    <td>Last Check:</td>
                    <td>{details.timestamp}</td>
                  </tr>
                </tbody>
              </table>

              <button 
                className="btn btn-primary me-2" 
                onClick={testMapCreation}
                disabled={!details.mapsAPI}
              >
                Test Map Creation
              </button>

              <button 
                className="btn btn-secondary" 
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>

            <div className="col-md-6">
              <h6>Test Map:</h6>
              <div 
                id="test-map-container" 
                className="border rounded p-2"
                style={{ minHeight: '200px', backgroundColor: '#f8f9fa' }}
              >
                <p className="text-muted text-center mt-5">
                  Click "Test Map Creation" to create a map here
                </p>
              </div>
            </div>
          </div>

          <hr />

          <h6>Troubleshooting Steps:</h6>
          <ol>
            <li>Check if API key is in <code>.env</code> file</li>
            <li>Restart development server after adding API key</li>
            <li>Check browser console for errors (F12)</li>
            <li>Verify API key in Google Cloud Console</li>
            <li>Enable required APIs: Maps JavaScript API, Places API</li>
            <li>Check API restrictions (allow localhost:3000)</li>
          </ol>

          <div className="alert alert-warning">
            <strong>Common Issues:</strong>
            <ul className="mb-0">
              <li>Ad blockers blocking Google APIs</li>
              <li>API key restrictions too strict</li>
              <li>Billing not enabled in Google Cloud Console</li>
              <li>Required APIs not enabled</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMapTest;