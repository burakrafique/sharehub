import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitVerificationRequest, getVerificationStatus } from '../services/ngoService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './NGOVerification.css';

const NGOVerification = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [formData, setFormData] = useState({
    ngo_name: '',
    registration_number: '',
    documents: null
  });

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const response = await getVerificationStatus();
      setVerificationStatus(response.data);
    } catch (error) {
      // No verification request found - this is normal for new users
      if (error.response?.status !== 404) {
        console.error('Error fetching verification status:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      documents: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      submitData.append('ngo_name', formData.ngo_name);
      submitData.append('registration_number', formData.registration_number);
      if (formData.documents) {
        submitData.append('documents', formData.documents);
      }

      await submitVerificationRequest(submitData);
      setSuccess('NGO verification request submitted successfully! We will review your application and get back to you.');
      setFormData({
        ngo_name: '',
        registration_number: '',
        documents: null
      });
      // Refresh verification status
      fetchVerificationStatus();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit verification request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-pending', text: 'Pending Review' },
      verified: { class: 'status-verified', text: 'Verified' },
      rejected: { class: 'status-rejected', text: 'Rejected' }
    };
    
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  if (verificationStatus) {
    return (
      <div className="ngo-verification-container">
        <div className="verification-status-card">
          <h2>NGO Verification Status</h2>
          
          <div className="status-info">
            <div className="status-row">
              <label>NGO Name:</label>
              <span>{verificationStatus.ngo_name}</span>
            </div>
            
            <div className="status-row">
              <label>Registration Number:</label>
              <span>{verificationStatus.registration_number}</span>
            </div>
            
            <div className="status-row">
              <label>Status:</label>
              {getStatusBadge(verificationStatus.verification_status)}
            </div>
            
            <div className="status-row">
              <label>Submitted:</label>
              <span>{new Date(verificationStatus.created_at).toLocaleDateString()}</span>
            </div>
            
            {verificationStatus.verified_at && (
              <div className="status-row">
                <label>Verified:</label>
                <span>{new Date(verificationStatus.verified_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {verificationStatus.verification_status === 'pending' && (
            <div className="status-message pending">
              <p>Your NGO verification request is under review. We will notify you once the review is complete.</p>
            </div>
          )}

          {verificationStatus.verification_status === 'verified' && (
            <div className="status-message verified">
              <p>Congratulations! Your NGO has been verified. You can now accept donations on the platform.</p>
            </div>
          )}

          {verificationStatus.verification_status === 'rejected' && (
            <div className="status-message rejected">
              <p>Your NGO verification request was rejected. Please contact support for more information or submit a new request with updated documents.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ngo-verification-container">
      <div className="verification-form-card">
        <h2>NGO Verification Request</h2>
        <p className="form-description">
          Apply to become a verified NGO on ShareHub to receive donations from our community.
        </p>

        {error && <ErrorMessage message={error} />}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="verification-form">
          <div className="form-group">
            <label htmlFor="ngo_name">NGO Name *</label>
            <input
              type="text"
              id="ngo_name"
              name="ngo_name"
              value={formData.ngo_name}
              onChange={handleInputChange}
              required
              placeholder="Enter your NGO's official name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="registration_number">Registration Number *</label>
            <input
              type="text"
              id="registration_number"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleInputChange}
              required
              placeholder="Enter your NGO's registration number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="documents">Verification Documents</label>
            <input
              type="file"
              id="documents"
              name="documents"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <small className="file-help">
              Upload registration certificate, tax exemption certificate, or other official documents (PDF, JPG, PNG, DOC)
            </small>
          </div>

          <div className="verification-requirements">
            <h4>Requirements for NGO Verification:</h4>
            <ul>
              <li>Valid NGO registration certificate</li>
              <li>Tax exemption certificate (if applicable)</li>
              <li>Official contact information</li>
              <li>Proof of charitable activities</li>
            </ul>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Submit Verification Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NGOVerification;