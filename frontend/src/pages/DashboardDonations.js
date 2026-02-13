import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Row, Col, Badge, Modal, Form } from 'react-bootstrap';
import donationService from '../services/donationService';
import itemService from '../services/itemService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const DashboardDonations = () => {
  const [donations, setDonations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationForm, setDonationForm] = useState({
    ngo_id: '',
    item_id: '',
    message: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [donationsRes, ngosRes, itemsRes] = await Promise.all([
        donationService.getUserDonations(),
        donationService.getVerifiedNGOs(),
        itemService.getUserItems()
      ]);
      setDonations(donationsRes.data.data);
      setNgos(ngosRes.data.data);
      // Filter only donate-type items
      setUserItems(itemsRes.data.data.filter(item => item.listing_type === 'donate'));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    try {
      await donationService.createDonation(donationForm);
      setSuccess('Donation request sent successfully!');
      setShowDonateModal(false);
      setDonationForm({ ngo_id: '', item_id: '', message: '' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donation');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      accepted: 'info',
      completed: 'success',
      cancelled: 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-donations">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h2>Donations</h2>
          <p className="text-muted">Track your donations to NGOs</p>
        </div>
        <Button variant="primary" onClick={() => setShowDonateModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          New Donation
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* NGO List */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="bi bi-building me-2"></i>
            Verified NGOs
          </h5>
        </Card.Header>
        <Card.Body>
          {ngos.length === 0 ? (
            <p className="text-muted mb-0">No verified NGOs available</p>
          ) : (
            <Row>
              {ngos.map((ngo) => (
                <Col md={6} lg={4} key={ngo.id} className="mb-3">
                  <Card className="h-100">
                    <Card.Body>
                      <h6>{ngo.ngo_name || ngo.name}</h6>
                      <p className="text-muted mb-1">
                        <small><i className="bi bi-envelope me-1"></i>{ngo.email}</small>
                      </p>
                      {ngo.phone && (
                        <p className="text-muted mb-1">
                          <small><i className="bi bi-telephone me-1"></i>{ngo.phone}</small>
                        </p>
                      )}
                      <Badge bg="success" className="mt-2">
                        <i className="bi bi-check-circle me-1"></i>
                        Verified
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Donation History */}
      <h4 className="mb-3">My Donations</h4>
      {donations.length === 0 ? (
        <EmptyState
          icon="heart"
          title="No donations yet"
          message="Start making a difference by donating to verified NGOs"
        />
      ) : (
        <Row>
          {donations.map((donation) => (
            <Col md={6} lg={4} key={donation.id} className="mb-3">
              <Card>
                {donation.item_image && (
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000${donation.item_image}`}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body>
                  <h6>{donation.item_title}</h6>
                  <p className="text-muted mb-2">
                    <small>To: {donation.ngo_name}</small>
                  </p>
                  <Badge bg="secondary" className="me-2">{donation.item_category}</Badge>
                  {getStatusBadge(donation.status)}
                  <p className="mt-2 mb-0">
                    <small className="text-muted">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </small>
                  </p>
                  {donation.completed_at && (
                    <p className="mb-0">
                      <small className="text-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Completed: {new Date(donation.completed_at).toLocaleDateString()}
                      </small>
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Donate Modal */}
      <Modal show={showDonateModal} onHide={() => setShowDonateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Donation</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleDonationSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select NGO *</Form.Label>
              <Form.Select
                value={donationForm.ngo_id}
                onChange={(e) => setDonationForm({ ...donationForm, ngo_id: e.target.value })}
                required
              >
                <option value="">Choose an NGO...</option>
                {ngos.map((ngo) => (
                  <option key={ngo.id} value={ngo.id}>
                    {ngo.ngo_name || ngo.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Item to Donate *</Form.Label>
              <Form.Select
                value={donationForm.item_id}
                onChange={(e) => setDonationForm({ ...donationForm, item_id: e.target.value })}
                required
              >
                <option value="">Choose an item...</option>
                {userItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.category})
                  </option>
                ))}
              </Form.Select>
              {userItems.length === 0 && (
                <Form.Text className="text-muted">
                  You need to create items with "donate" listing type first
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={donationForm.message}
                onChange={(e) => setDonationForm({ ...donationForm, message: e.target.value })}
                placeholder="Add a message for the NGO..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDonateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={!donationForm.ngo_id || !donationForm.item_id}>
              Submit Donation
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DashboardDonations;
