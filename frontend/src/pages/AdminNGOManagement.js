import React, { useState, useEffect } from 'react';
import { getAllVerifications, updateVerificationStatus, deleteVerification } from '../services/ngoService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './AdminNGOManagement.css';

const AdminNGOManagement = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchVerifications();
  }, [filter]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const statusFilter = filter === 'all' ? null : filter;
      const response = await getAllVerifications(statusFilter);
      setVerifications(response.data);
    } catch (error) {
      setError('Failed to fetch verification requests');
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (verificationId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this NGO verification?`)) {
      return;
    }

    try {
      setActionLoading(verificationId);
      await updateVerificationStatus(verificationId, status);
      await fetchVerifications();
      alert(`NGO verification ${status} successfully!`);
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${status} verification`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (verificationId) => {
    if (!window.confirm('Are you sure you want to delete this verification request?')) {
      return;
    }

    try {
      setActionLoading(verificationId);
      await deleteVerification(verificationId);
      await fetchVerifications();
      alert('Verification request deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete verification');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-pending', text: 'Pending' },
      verified: { class: 'badge-verified', text: 'Verified' },
      rejected: { class: 'badge-rejected', text: 'Rejected' }
    };
    
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  if (loading) {
    return (
      <div className="admin-ngo-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="admin-ngo-container">
      <div className="admin-header">
        <h2>NGO Verification Management</h2>
        <p>Review and manage NGO verification requests</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({verifications.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-tab ${filter === 'verified' ? 'active' : ''}`}
          onClick={() => setFilter('verified')}
        >
          Verified
        </button>
        <button 
          className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      {verifications.length === 0 ? (
        <div className="no-verifications">
          <p>No verification requests found</p>
        </div>
      ) : (
        <div className="verifications-table">
          <table>
            <thead>
              <tr>
                <th>NGO Name</th>
                <th>Registration #</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((verification) => (
                <tr key={verification.id}>
                  <td className="ngo-name">{verification.ngo_name}</td>
                  <td>{verification.registration_number}</td>
                  <td>{verification.name}</td>
                  <td>{verification.email}</td>
                  <td>{getStatusBadge(verification.verification_status)}</td>
                  <td>{new Date(verification.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    {verification.verification_status === 'pending' && (
                      <>
                        <button
                          className="action-btn approve-btn"
                          onClick={() => handleStatusUpdate(verification.id, 'verified')}
                          disabled={actionLoading === verification.id}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="action-btn reject-btn"
                          onClick={() => handleStatusUpdate(verification.id, 'rejected')}
                          disabled={actionLoading === verification.id}
                        >
                          ✗ Reject
                        </button>
                      </>
                    )}
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(verification.id)}
                      disabled={actionLoading === verification.id}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminNGOManagement;