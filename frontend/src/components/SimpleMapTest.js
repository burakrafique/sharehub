import React, { useEffect, useRef } from 'react';

const SimpleMapTest = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      console.log('Checking Google Maps...');
      
      if (!window.google) {
        console.error('❌ Google Maps not loaded');
        return;
      }
      
      if (!window.google.maps) {
        console.error('❌ Google Maps API not available');
        return;
      }
      
      console.log('✅ Google Maps API available');
      
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 31.5204, lng: 74.3587 },
          zoom: 13,
        });
        
        const marker = new window.google.maps.Marker({
          position: { lat: 31.5204, lng: 74.3587 },
          map: map,
          title: 'Test Location'
        });
        
        console.log('✅ Map created successfully');
      } catch (error) {
        console.error('❌ Map creation failed:', error);
      }
    };

    // Wait for Google Maps to load
    if (window.google && window.google.maps) {
      initMap();
    } else {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          initMap();
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.google) {
          console.error('❌ Google Maps failed to load after 10 seconds');
        }
      }, 10000);
    }
  }, []);

  return (
    <div>
      <h3>Simple Map Test</h3>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          border: '2px solid #ccc',
          borderRadius: '8px'
        }} 
      />
      <p className="mt-2 text-muted">
        Check browser console (F12) for detailed logs
      </p>
    </div>
  );
};

export default SimpleMapTest;