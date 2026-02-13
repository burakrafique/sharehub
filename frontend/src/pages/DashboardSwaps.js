import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Row, Col, Badge, Tabs, Tab, Modal } from 'react-bootstrap';
import swapService from '../services/swapService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const DashboardSwaps = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const fetchSwapRequests = async () => {
    try {
      setLoading(true);
      const [sentRes, receivedRes] = await Promise.all([
        swapService.getSentSwapRequests(),
        swapService.getReceivedSwapRequests()
      ]);
      setSentRequests(sentRes.data.data);
      setReceivedRequests(receivedRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load swap requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await swapService.updateSwapStatus(id, status);
      setSuccess(`Swap request ${status} successfully`);
      fetchSwapRequests();
      setShowDetails(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update swap request');
    }
  };

  const handleCancelRequest = async (id) => {
    try {
      await swapService.cancelSwapRequest(id);
      setSuccess('Swap request cancelled');
      fetchSwapRequests();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel swap request');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      accepted: 'success',
      rejected: 'danger',
      cancelled: 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const viewDetails = async (id) => {
    try {
      const res = await swapService.getSwapRequestById(id);
      setSelectedRequest(res.data.data);
      setShowDetails(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load details');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-swaps">
      <div className="page-header">
        <h2>Swap Requests</h2>
        <p className="text-muted">Manage your item swap requests</p>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Tabs defaultActiveKey="sent" className="mb-4">
        <Tab eventKey="sent" title={`Sent (${sentRequests.length})`}>
          {sentRequests.length === 0 ? (
            <EmptyState
              icon="arrow-left-right"
              title="No sent swap requests"
              message="You haven't sent any swap requests yet"
            />
          ) : (
            <Row>
              {sentRequests.map((request) => (
                <Col md={6} lg={4} key={request.id} className="mb-3">
                  <Card>
                    {request.requested_item_image && (
                      <Card.Img
                        variant="top"
                        src={`http://localhost:5000${request.requested_item_image}`}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body>
                      <h6>{request.requested_item_title}</h6>
                      <p className="text-muted mb-2">
                        <small>To: {request.owner_name}</small>
                      </p>
                      {getStatusBadge(request.status)}
                      <p className="mt-2 mb-0">
                        <small className="text-muted">
                          {new Date(request.created_at).toLocaleDateString()}
                        </small>
                      </p>
                      <div className="mt-3 d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => viewDetails(request.id)}
                        >
                          View Details
                        </Button>
                        {request.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleCancelRequest(request.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>

        <Tab eventKey="received" title={`Received (${receivedRequests.length})`}>
          {receivedRequests.length === 0 ? (
            <EmptyState
              icon="inbox"
              title="No received swap requests"
              message="You haven't received any swap requests yet"
            />
          ) : (
            <Row>
              {receivedRequests.map((request) => (
                <Col md={6} lg={4} key={request.id} className="mb-3">
                  <Card>
                    {request.requested_item_image && (
                      <Card.Img
                        variant="top"
                        src={`http://localhost:5000${request.requested_item_image}`}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body>
                      <h6>{request.requested_item_title}</h6>
                      <p className="text-muted mb-2">
                        <small>From: {request.requester_name}</small>
                      </p>
                      {getStatusBadge(request.status)}
                      <p className="mt-2 mb-0">
                        <small className="text-muted">
                          {new Date(request.created_at).toLocaleDateString()}
                        </small>
                      </p>
                      <div className="mt-3 d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => viewDetails(request.id)}
                        >
                          View Details
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleUpdateStatus(request.id, 'accepted')}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleUpdateStatus(request.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>
      </Tabs>

      {/* Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Swap Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <Row>
              <Col md={6}>
                <h6>Requested Item</h6>
                {selectedRequest.requested_item_image && (
                  <img
                    src={`http://localhost:5000${selectedRequest.requested_item_image}`}
                    alt="Requested"
                    className="img-fluid rounded mb-2"
                  />
                )}
                <p><strong>{selectedRequest.requested_item_title}</strong></p>
              </Col>
              {selectedRequest.offered_item_title && (
                <Col md={6}>
                  <h6>Offered Item</h6>
                  {selectedRequest.offered_item_image && (
                    <img
                      src={`http://localhost:5000${selectedRequest.offered_item_image}`}
                      alt="Offered"
                      className="img-fluid rounded mb-2"
                    />
                  )}
                  <p><strong>{selectedRequest.offered_item_title}</strong></p>
                </Col>
              )}
              <Col xs={12} className="mt-3">
                {selectedRequest.message && (
                  <>
                    <h6>Message</h6>
                    <p>{selectedRequest.message}</p>
                  </>
                )}
                <p><strong>Status:</strong> {getStatusBadge(selectedRequest.status)}</p>
                <p><strong>Date:</strong> {new Date(selectedRequest.created_at).toLocaleString()}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashboardSwaps;
