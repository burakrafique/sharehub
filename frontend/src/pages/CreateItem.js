import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, Image, ProgressBar, Badge } from 'react-bootstrap';
import { FaUpload, FaTimes, FaCheckCircle, FaExclamationCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { createItem } from '../services/itemService';
import { validateFileSize, validateFileType } from '../utils/validation';
import LocationPicker from '../components/LocationPicker';
import SimpleMapTest from '../components/SimpleMapTest';

const CreateItem = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'clothes',
    listing_type: 'sell',
    price: '',
    item_condition: 'good',
    address: '',
    latitude: null,
    longitude: null,
    images: []
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { title, description, category, listing_type, price, item_condition, address, latitude, longitude } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newErrors = [];
    const validFiles = [];
    const newPreviews = [];
    
    // Check total count
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      e.target.value = '';
      return;
    }

    // Validate each file
    files.forEach((file, index) => {
      const errors = [];
      
      // Validate file type
      if (!validateFileType(file)) {
        errors.push('Invalid file type. Only JPG, PNG, GIF allowed');
      }
      
      // Validate file size (5MB)
      if (!validateFileSize(file, 5)) {
        errors.push('File size must be less than 5MB');
      }
      
      if (errors.length > 0) {
        newErrors.push({ file: file.name, errors });
      } else {
        validFiles.push(file);
        
        // Create preview for valid files
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, { 
            url: reader.result, 
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB'
          }]);
        };
        reader.readAsDataURL(file);
      }
    });

    if (newErrors.length > 0) {
      setImageErrors(newErrors);
      setTimeout(() => setImageErrors([]), 5000);
    }

    if (validFiles.length > 0) {
      setImages([...images, ...validFiles]);
      setError('');
    }

    // Reset input
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    setError('');
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      address: location.address,
      latitude: location.lat,
      longitude: location.lng
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!title || !description || !category || !listing_type || !item_condition || !address) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (listing_type === 'sell' && (!price || price <= 0)) {
      setError('Please enter a valid price for selling items');
      setLoading(false);
      return;
    }

    // Location coordinates are optional now (defaults provided)

    try {
      setUploadProgress(10);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', title);
      formDataToSend.append('description', description);
      formDataToSend.append('category', category);
      formDataToSend.append('listing_type', listing_type);
      formDataToSend.append('item_condition', item_condition);
      formDataToSend.append('address', address);
      formDataToSend.append('latitude', latitude);
      formDataToSend.append('longitude', longitude);

      if (listing_type === 'sell') {
        formDataToSend.append('price', price);
      }

      setUploadProgress(30);

      // Append images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      setUploadProgress(50);

      const response = await createItem(formDataToSend);

      setUploadProgress(90);

      if (response.success) {
        setUploadProgress(100);
        setTimeout(() => {
          navigate(`/items/${response.data.id}`);
        }, 500);
      } else {
        setError(response.message || 'Failed to create item');
        setUploadProgress(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="mb-4">Create New Item</h2>

              {error && <Alert variant="danger">{error}</Alert>}
              
              {imageErrors.length > 0 && (
                <Alert variant="warning" dismissible onClose={() => setImageErrors([])}>
                  <strong>Image Upload Errors:</strong>
                  <ul className="mb-0 mt-2">
                    {imageErrors.map((err, idx) => (
                      <li key={idx}>
                        <strong>{err.file}:</strong> {err.errors.join(', ')}
                      </li>
                    ))}
                  </ul>
                </Alert>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-3">
                  <small className="text-muted">Uploading...</small>
                  <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} animated />
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                    placeholder="Enter item title"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={description}
                    onChange={handleChange}
                    placeholder="Describe your item"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select name="category" value={category} onChange={handleChange}>
                        <option value="clothes">Clothes</option>
                        <option value="books">Books</option>
                        <option value="ration">Ration</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Listing Type *</Form.Label>
                      <Form.Select name="listing_type" value={listing_type} onChange={handleChange}>
                        <option value="sell">Sell</option>
                        <option value="donate">Donate</option>
                        <option value="exchange">Exchange</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  {listing_type === 'sell' && (
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Price (Rs.) *</Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={price}
                          onChange={handleChange}
                          placeholder="Enter price"
                          min="0"
                        />
                      </Form.Group>
                    </Col>
                  )}
                  <Col md={listing_type === 'sell' ? 6 : 12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Condition *</Form.Label>
                      <Form.Select name="item_condition" value={item_condition} onChange={handleChange}>
                        <option value="new">New</option>
                        <option value="like_new">Like New</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Location Section with Google Maps */}
                <div className="mb-4">
                  <Form.Label><FaMapMarkerAlt className="me-2" />Location *</Form.Label>
                  <LocationPicker 
                    onLocationSelect={handleLocationSelect}
                    initialLocation={formData.latitude && formData.longitude ? 
                      { lat: formData.latitude, lng: formData.longitude } : null
                    }
                  />
                  {formData.address && (
                    <div className="alert alert-success mt-3">
                      <strong>Selected Location:</strong><br />
                      <small>{formData.address}</small><br />
                      <small className="text-muted">
                        📍 Coordinates: {formData.latitude?.toFixed(4)}, {formData.longitude?.toFixed(4)}
                      </small>
                    </div>
                  )}
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Images (Max 5) 
                    <Badge bg="secondary" className="ms-2">{images.length}/5</Badge>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleImageChange}
                    disabled={images.length >= 5 || loading}
                  />
                  <Form.Text className="text-muted">
                    <FaCheckCircle className="text-success me-1" />
                    Upload up to 5 images. Max 5MB each. Formats: JPG, PNG, GIF
                  </Form.Text>
                </Form.Group>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mb-3">
                    <Form.Label>
                      Image Previews 
                      <Badge bg="success" className="ms-2">{imagePreviews.length} uploaded</Badge>
                    </Form.Label>
                    <Row>
                      {imagePreviews.map((preview, index) => (
                        <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                          <Card className="h-100">
                            <div style={{ position: 'relative' }}>
                              <Card.Img 
                                variant="top" 
                                src={preview.url} 
                                style={{ height: '150px', objectFit: 'cover' }} 
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0 m-1 rounded-circle"
                                onClick={() => removeImage(index)}
                                disabled={loading}
                                style={{ width: '30px', height: '30px', padding: '0' }}
                              >
                                <FaTimes />
                              </Button>
                              <Badge 
                                bg="dark" 
                                className="position-absolute bottom-0 start-0 m-1"
                                style={{ fontSize: '0.7rem' }}
                              >
                                {index + 1}
                              </Badge>
                            </div>
                            <Card.Body className="p-2">
                              <small className="text-muted d-block text-truncate">
                                {preview.name}
                              </small>
                              <small className="text-muted">{preview.size}</small>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" size="lg" disabled={loading}>
                    {loading ? 'Creating...' : <><FaUpload className="me-2" />Create Item</>}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateItem;
