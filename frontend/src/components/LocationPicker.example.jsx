/**
 * LocationPicker Component Usage Examples
 * 
 * This file demonstrates various ways to use the LocationPicker component
 */

import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import LocationPicker from './LocationPicker';

// Example 1: Basic Usage
const BasicExample = () => {
  const [location, setLocation] = useState(null);

  return (
    <div>
      <h3>Basic Location Picker</h3>
      <LocationPicker
        onLocationSelect={(loc) => {
          setLocation(loc);
          console.log('Selected location:', loc);
        }}
      />
      
      {location && (
        <Alert variant="success" className="mt-3">
          <strong>Selected Location:</strong>
          <br />
          Latitude: {location.lat}
          <br />
          Longitude: {location.lng}
          <br />
          Address: {location.address}
        </Alert>
      )}
    </div>
  );
};

// Example 2: With Form Integration
const FormExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    address: ''
  });

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
      address: location.address
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Send to API
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          initialLat={formData.latitude ? parseFloat(formData.latitude) : undefined}
          initialLng={formData.longitude ? parseFloat(formData.longitude) : undefined}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
        <Form.Text>
          Coordinates: {formData.latitude && formData.longitude 
            ? `${formData.latitude}, ${formData.longitude}` 
            : 'Not set'}
        </Form.Text>
      </Form.Group>

      <Button type="submit" variant="primary">Submit</Button>
    </Form>
  );
};

// Example 3: Custom Height and Options
const CustomExample = () => {
  return (
    <div>
      <h3>Custom Configuration</h3>
      <LocationPicker
        onLocationSelect={(loc) => console.log(loc)}
        initialLat={40.7128}
        initialLng={-74.0060}
        height="500px"
        showSearch={true}
        showCurrentLocation={true}
      />
    </div>
  );
};

// Example 4: Without Search (Simple Picker)
const SimpleExample = () => {
  return (
    <div>
      <h3>Simple Location Picker (No Search)</h3>
      <LocationPicker
        onLocationSelect={(loc) => console.log(loc)}
        height="300px"
        showSearch={false}
        showCurrentLocation={true}
      />
    </div>
  );
};

// Example 5: Multiple Location Pickers
const MultiplePickersExample = () => {
  const [pickup, setPickup] = useState(null);
  const [delivery, setDelivery] = useState(null);

  return (
    <Row>
      <Col md={6}>
        <Card className="mb-3">
          <Card.Header>Pickup Location</Card.Header>
          <Card.Body className="p-0">
            <LocationPicker
              onLocationSelect={setPickup}
              height="300px"
            />
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="mb-3">
          <Card.Header>Delivery Location</Card.Header>
          <Card.Body className="p-0">
            <LocationPicker
              onLocationSelect={setDelivery}
              height="300px"
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

// Example 6: With Validation
const ValidationExample = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setError('');
  };

  const handleSubmit = () => {
    if (!location) {
      setError('Please select a location');
      return;
    }

    if (!location.address) {
      setError('Please select a location with a valid address');
      return;
    }

    console.log('Valid location:', location);
    // Proceed with submission
  };

  return (
    <div>
      <h3>Location Picker with Validation</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <LocationPicker
        onLocationSelect={handleLocationSelect}
      />
      
      <Button 
        variant="primary" 
        className="mt-3"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </div>
  );
};

// Main Demo Component
const LocationPickerDemo = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-4">LocationPicker Component Examples</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <BasicExample />
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <FormExample />
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <CustomExample />
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <SimpleExample />
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <MultiplePickersExample />
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <ValidationExample />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LocationPickerDemo;
