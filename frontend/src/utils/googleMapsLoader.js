/**
 * Google Maps API Dynamic Loader
 * Loads Google Maps API with proper error handling and API key management
 */

let isLoading = false;
let isLoaded = false;
let loadPromise = null;

export const loadGoogleMapsAPI = () => {
  // Return existing promise if already loading
  if (loadPromise) {
    return loadPromise;
  }

  // Return resolved promise if already loaded
  if (isLoaded && window.google && window.google.maps) {
    return Promise.resolve();
  }

  // Check if API key exists
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(new Error('Google Maps API key is missing. Please add REACT_APP_GOOGLE_MAPS_API_KEY to your .env file.'));
  }

  isLoading = true;

  loadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      isLoaded = true;
      isLoading = false;
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    // Global callback function
    window.initGoogleMaps = () => {
      isLoaded = true;
      isLoading = false;
      console.log('✅ Google Maps API loaded successfully');
      resolve();
      
      // Clean up
      delete window.initGoogleMaps;
    };

    // Handle script load errors
    script.onerror = (error) => {
      isLoading = false;
      loadPromise = null;
      console.error('❌ Failed to load Google Maps API:', error);
      reject(new Error('Failed to load Google Maps API. Please check your internet connection and API key.'));
    };

    // Handle script load timeout
    const timeout = setTimeout(() => {
      isLoading = false;
      loadPromise = null;
      console.error('❌ Google Maps API load timeout');
      reject(new Error('Google Maps API load timeout. Please check your internet connection.'));
    }, 10000); // 10 second timeout

    // Clear timeout when script loads
    script.onload = () => {
      clearTimeout(timeout);
    };

    // Add script to document
    document.head.appendChild(script);
  });

  return loadPromise;
};

export const isGoogleMapsLoaded = () => {
  return isLoaded && window.google && window.google.maps;
};

export const waitForGoogleMaps = (maxWaitTime = 10000) => {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsLoaded()) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isGoogleMapsLoaded()) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > maxWaitTime) {
        clearInterval(checkInterval);
        reject(new Error('Timeout waiting for Google Maps API'));
      }
    }, 100);
  });
};

// Diagnostic function
export const diagnoseGoogleMaps = () => {
  const diagnosis = {
    timestamp: new Date().toISOString(),
    apiKey: {
      present: !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      value: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 
        `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY.substring(0, 10)}...` : 
        'Not found'
    },
    googleObject: !!window.google,
    mapsAPI: !!(window.google && window.google.maps),
    placesAPI: !!(window.google && window.google.maps && window.google.maps.places),
    loadingState: {
      isLoading,
      isLoaded,
      hasPromise: !!loadPromise
    }
  };

  console.group('🗺️ Google Maps Diagnosis');
  console.table(diagnosis);
  console.groupEnd();

  return diagnosis;
};