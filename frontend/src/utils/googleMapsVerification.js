/**
 * Google Maps API Verification Utility
 * Use this to programmatically check if Google Maps is working
 */

export const verifyGoogleMaps = () => {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {},
    overall: 'UNKNOWN'
  };

  // Test 1: Check if Google object exists
  results.tests.googleObject = {
    name: 'Google Object Available',
    status: !!window.google,
    message: window.google ? 'Google object found' : 'Google object not found'
  };

  // Test 2: Check if Maps API is loaded
  results.tests.mapsAPI = {
    name: 'Maps JavaScript API',
    status: !!(window.google && window.google.maps),
    message: (window.google && window.google.maps) ? 'Maps API loaded' : 'Maps API not loaded'
  };

  // Test 3: Check if Places API is loaded
  results.tests.placesAPI = {
    name: 'Places API',
    status: !!(window.google && window.google.maps && window.google.maps.places),
    message: (window.google && window.google.maps && window.google.maps.places) ? 'Places API loaded' : 'Places API not loaded'
  };

  // Test 4: Check if API key is present
  results.tests.apiKey = {
    name: 'API Key Present',
    status: !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    message: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'API key found in environment' : 'API key missing'
  };

  // Test 5: Check if we can create a basic map (requires DOM element)
  results.tests.mapCreation = {
    name: 'Map Creation Test',
    status: false,
    message: 'Skipped - requires DOM element'
  };

  if (window.google && window.google.maps) {
    try {
      // Create a temporary div for testing
      const testDiv = document.createElement('div');
      testDiv.style.width = '100px';
      testDiv.style.height = '100px';
      testDiv.style.position = 'absolute';
      testDiv.style.left = '-9999px';
      document.body.appendChild(testDiv);

      const testMap = new window.google.maps.Map(testDiv, {
        center: { lat: 31.5204, lng: 74.3587 },
        zoom: 10
      });

      if (testMap) {
        results.tests.mapCreation.status = true;
        results.tests.mapCreation.message = 'Map creation successful';
      }

      // Clean up
      document.body.removeChild(testDiv);
    } catch (error) {
      results.tests.mapCreation.message = `Map creation failed: ${error.message}`;
    }
  }

  // Calculate overall status
  const passedTests = Object.values(results.tests).filter(test => test.status).length;
  const totalTests = Object.values(results.tests).length;
  
  if (passedTests === totalTests) {
    results.overall = 'PASS';
  } else if (passedTests >= totalTests - 1) {
    results.overall = 'MOSTLY_PASS';
  } else if (passedTests > 0) {
    results.overall = 'PARTIAL_FAIL';
  } else {
    results.overall = 'FAIL';
  }

  results.summary = `${passedTests}/${totalTests} tests passed`;

  return results;
};

export const logGoogleMapsStatus = () => {
  const results = verifyGoogleMaps();
  
  console.group('🗺️ Google Maps Verification Results');
  console.log('Overall Status:', results.overall);
  console.log('Summary:', results.summary);
  console.log('Timestamp:', results.timestamp);
  
  console.group('Individual Tests:');
  Object.entries(results.tests).forEach(([key, test]) => {
    const icon = test.status ? '✅' : '❌';
    console.log(`${icon} ${test.name}: ${test.message}`);
  });
  console.groupEnd();
  
  if (results.overall === 'FAIL') {
    console.group('🔧 Troubleshooting Tips:');
    console.log('1. Check if Google Maps script is loaded in index.html');
    console.log('2. Verify API key in .env file');
    console.log('3. Restart development server after adding API key');
    console.log('4. Check browser console for additional errors');
    console.log('5. Verify API key restrictions in Google Cloud Console');
    console.groupEnd();
  }
  
  console.groupEnd();
  
  return results;
};

export const waitForGoogleMaps = (timeout = 10000) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error('Google Maps API failed to load within timeout'));
      }
    }, 100);
  });
};

// Auto-run verification when this module is imported (in development)
if (process.env.NODE_ENV === 'development') {
  // Wait a bit for the page to load, then run verification
  setTimeout(() => {
    logGoogleMapsStatus();
  }, 3000);
}