import React, { useState, useEffect } from 'react';
import { Card, Alert } from 'react-bootstrap';

const LocationMap = ({ 
  latitude, 
  longitude, 
  onLocationSelect, 
  editable = false,
  height = '400px',
  zoom = 13,
  markers = [] // Array of {lat, lng, title, id}
}) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if Google Maps is loaded
    if (!window.google) {
      setError('Google Maps API not loaded. Please add the API key.');
      return;
    }

    initializeMap();
  }, [latitude, longitude]);

  useEffect(() => {
    if (map && markers.length > 0) {
      displayMarkers();
    }
  }, [map, markers]);

  const initializeMap = () => {
    try {
      const center = {
        lat: parseFloat(latitude) || 31.5204,
        lng: parseFloat(longitude) || 74.3587
      };

      const mapInstance = new window.google.maps.Map(
        document.getElementById('map'),
        {
          center: center,
          zoom: zoom,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true
        }
      );

      setMap(mapInstance);

      // Add main marker
      const mainMarker = new window.google.maps.Marker({
        position: center,
        map: mapInstance,
        draggable: editable,
        title: 'Location'
      });

      setMarker(mainMarker);

      // Add click listener for editable mode
      if (editable) {
        mapInstance.addListener('click', (e) => {
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();
          
          mainMarker.setPosition(e.latLng);
          
          if (onLocationSelect) {
            onLocationSelect(newLat, newLng);
          }
        });

        // Add drag listener
        mainMarker.addListener('dragend', (e) => {
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();
          
          if (onLocationSelect) {
            onLocationSelect(newLat, newLng);
          }
        });
      }
    } catch (err) {
      setError('Error initializing map: ' + err.message);
    }
  };

  const displayMarkers = () => {
    markers.forEach(markerData => {
      const newMarker = new window.google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: map,
        title: markerData.title,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><strong>${markerData.title}</strong></div>`
      });

      newMarker.addListener('click', () => {
        infoWindow.open(map, newMarker);
        if (markerData.onClick) {
          markerData.onClick(markerData.id);
        }
      });
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (map) {
            map.setCenter({ lat, lng });
            marker.setPosition({ lat, lng });
          }
          
          if (onLocationSelect) {
            onLocationSelect(lat, lng);
          }
        },
        (error) => {
          setError('Error getting location: ' + error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  if (error) {
    return (
      <Alert variant="warning">
        {error}
        <br />
        <small>
          To use maps, add Google Maps API key to your project.
          <br />
          Add this to public/index.html:
          <br />
          <code>
            &lt;script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"&gt;&lt;/script&gt;
          </code>
        </small>
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Body className="p-0">
        <div 
          id="map" 
          style={{ 
            width: '100%', 
            height: height,
            borderRadius: '0.25rem'
          }}
        />
        {editable && (
          <div className="p-3 bg-light border-top">
            <button 
              className="btn btn-sm btn-primary"
              onClick={getCurrentLocation}
            >
              Use My Current Location
            </button>
            <small className="text-muted ms-3">
              Click on map or drag marker to set location
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default LocationMap;
