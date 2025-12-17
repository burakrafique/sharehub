import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs, Badge, ListGroup, Image, Spinner } from 'react-bootstrap';
import { FaUser, FaLock, FaBox, FaExchangeAlt, FaSignOutAlt, FaEdit, FaCamera, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../services/api';
import config from '../config/config';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // User items and transactions
  const [userItems, setUserItems] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (activeTab === 'items') {
      fetchUserItems();
    } else if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [activeTab]);

  const fetchUserItems = async () => {
    try {
      const response = await API.get('/users/my-items');
      if (response.data.success) {
        setUserItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await API.get('/transactions');
      if (response.data.success) {
        setTransactions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await API.put('/users/profile', profileData);
      if (response.data.success) {
        updateUser(response.data.data);
        setSuccess('Profile updated successfully');
        setEditMode(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await API.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        setSuccess('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${config.api.backendURL}${imagePath}`;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    await uploadProfileImage(file);
  };

  const uploadProfileImage = async (file) => {
    setUploadingImage(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('profile_image', file);

      const response = await API.post('/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        updateUser(response.data.data);
        setSuccess('Profile image updated successfully');
        setImagePreview(null);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    setUploadingImage(true);
    setError('');
    setSuccess('');

    try {
      const response = await API.delete('/users/profile-image');

      if (response.data.success) {
        updateUser(response.data.data);
        setSuccess('Profile image removed successfully');
        setImagePreview(null);
      }
    } catch (err) {
      console.error('Error removing image:', err);
      setError(err.response?.data?.message || 'Failed to remove image');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={3} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              {/* Profile Image */}
              <div className="mb-3 position-relative" style={{ display: 'inline-block' }}>
                {imagePreview || user?.profile_image ? (
                  <Image 
                    src={imagePreview || getProfileImageUrl(user?.profile_image)}
                    roundedCircle 
                    width={120} 
                    height={120}
                    style={{ objectFit: 'cover', border: '3px solid #dee2e6' }}
                    alt="Profile"
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                    style={{ width: '120px', height: '120px', border: '3px solid #dee2e6' }}
                  >
                    <FaUser size={60} className="text-muted" />
                  </div>
                )}
                
                {/* Upload Button Overlay */}
                <label 
                  htmlFor="profile-image-upload"
                  className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle"
                  style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                  title="Change profile picture"
                >
                  {uploadingImage ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <FaCamera />
                  )}
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  disabled={uploadingImage}
                />
              </div>

              <h5>{user?.name}</h5>
              <p className="text-muted mb-2">{user?.email}</p>
              <Badge bg="secondary">{user?.role}</Badge>
              
              {/* Remove Image Button */}
              {(user?.profile_image || imagePreview) && (
                <div className="mt-2">
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={uploadingImage}
                  >
                    <FaTrash className="me-1" />
                    Remove Photo
                  </Button>
                </div>
              )}
              
              <hr />
              <Button 
                variant="danger" 
                className="w-100"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <Card className="shadow-sm">
            <Card.Body>
              {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
              {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                {/* Profile Tab */}
                <Tab eventKey="profile" title={<><FaUser className="me-2" />Profile</>}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Profile Information</h5>
                    {!editMode && (
                      <Button variant="outline-primary" size="sm" onClick={() => setEditMode(true)}>
                        <FaEdit className="me-1" /> Edit
                      </Button>
                    )}
                  </div>

                  <Form onSubmit={handleUpdateProfile}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={user?.email}
                        disabled
                      />
                      <Form.Text className="text-muted">Email cannot be changed</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </Form.Group>

                    {editMode && (
                      <div className="d-flex gap-2">
                        <Button type="submit" variant="primary" disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="secondary" onClick={() => setEditMode(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </Form>
                </Tab>

                {/* Password Tab */}
                <Tab eventKey="password" title={<><FaLock className="me-2" />Password</>}>
                  <h5 className="mb-3">Change Password</h5>
                  <Form onSubmit={handleChangePassword}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>

                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </Form>
                </Tab>

                {/* Items Tab */}
                <Tab eventKey="items" title={<><FaBox className="me-2" />My Items ({userItems.length})</>}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>My Items</h5>
                    <Button variant="primary" size="sm" onClick={() => navigate('/create-item')}>
                      <FaBox className="me-1" /> Create New Item
                    </Button>
                  </div>

                  {userItems.length === 0 ? (
                    <Alert variant="info">You haven't created any items yet.</Alert>
                  ) : (
                    <ListGroup>
                      {userItems.map(item => (
                        <ListGroup.Item 
                          key={item.id}
                          action
                          onClick={() => navigate(`/items/${item.id}`)}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>{item.title}</strong>
                            <div className="small text-muted">
                              <Badge bg="secondary" className="me-2">{item.category}</Badge>
                              <Badge bg={item.status === 'available' ? 'success' : 'secondary'}>
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                          {item.listing_type === 'sell' && item.price && (
                            <strong className="text-primary">Rs. {parseFloat(item.price).toLocaleString()}</strong>
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Tab>

                {/* Transactions Tab */}
                <Tab eventKey="transactions" title={<><FaExchangeAlt className="me-2" />Transactions ({transactions.length})</>}>
                  <h5 className="mb-3">Transaction History</h5>

                  {transactions.length === 0 ? (
                    <Alert variant="info">No transactions yet.</Alert>
                  ) : (
                    <ListGroup>
                      {transactions.map(transaction => (
                        <ListGroup.Item key={transaction.id}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <strong>{transaction.item_title}</strong>
                              <div className="small text-muted">
                                {transaction.user_role === 'seller' ? 'Sold to' : 'Bought from'}: {transaction.user_role === 'seller' ? transaction.buyer_name : transaction.seller_name}
                              </div>
                              <div className="small text-muted">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-end">
                              <Badge bg={transaction.status === 'completed' ? 'success' : 'warning'}>
                                {transaction.status}
                              </Badge>
                              {transaction.amount > 0 && (
                                <div className="text-primary fw-bold">
                                  Rs. {parseFloat(transaction.amount).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
