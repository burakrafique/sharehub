import React, { useState, useEffect } from 'react';
import { getVerifiedNGOs } from '../services/ngoService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './NGOList.css';

const NGOList = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVerifiedNGOs();
  }, []);

  const fetchVerifiedNGOs = async () => {
    try {
      setLoading(true);
      const response = await getVerifiedNGOs();
      setNgos(response.data);
    } catch (error) {
      setError('Failed to fetch verified NGOs');
      console.error('Error fetching NGOs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ngo-list-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="ngo-list-container">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="ngo-list-container">
      <div className="ngo-list-header">
        <h1>Verified NGOs</h1>
        <p>Connect with verified non-governmental organizations to donate items and support their causes.</p>
      </div>

      {ngos.length === 0 ? (
        <div className="no-ngos">
          <h3>No Verified NGOs Yet</h3>
          <p>There are currently no verified NGOs on the platform. Check back later!</p>
        </div>
      ) : (
        <div className="ngo-grid">
          {ngos.map((ngo) => (
            <div key={ngo.id} className="ngo-card">
              <div className="ngo-header">
                <h3>{ngo.ngo_name}</h3>
                <span className="verified-badge">✓ Verified</span>
              </div>
              
              <div className="ngo-details">
                <div className="detail-row">
                  <span className="label">Registration:</span>
                  <span className="value">{ngo.registration_number}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Contact:</span>
                  <span className="value">{ngo.name}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{ngo.email}</span>
                </div>
                
                {ngo.phone && (
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span className="value">{ngo.phone}</span>
                  </div>
                )}
                
                {ngo.address && (
                  <div className="detail-row">
                    <span className="label">Address:</span>
                    <span className="value">{ngo.address}</span>
                  </div>
                )}
                
                <div className="detail-row">
                  <span className="label">Verified:</span>
                  <span className="value">
                    {new Date(ngo.verified_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="ngo-actions">
                <button 
                  className="contact-btn"
                  onClick={() => window.location.href = `mailto:${ngo.email}`}
                >
                  Contact NGO
                </button>
                <button 
                  className="donate-btn"
                  onClick={() => window.location.href = `/items?ngo=${ngo.user_id}`}
                >
                  View Donations
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NGOList;