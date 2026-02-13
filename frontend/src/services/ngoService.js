import api from './api';

// Submit NGO verification request
export const submitVerificationRequest = async (formData) => {
  const response = await api.post('/ngo/verify', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Get user's verification status
export const getVerificationStatus = async () => {
  const response = await api.get('/ngo/verification-status');
  return response.data;
};

// Get all verified NGOs (public)
export const getVerifiedNGOs = async () => {
  const response = await api.get('/ngo/verified');
  return response.data;
};

// Admin: Get all verification requests
export const getAllVerifications = async (status = null) => {
  const url = status ? `/ngo/verifications?status=${status}` : '/ngo/verifications';
  const response = await api.get(url);
  return response.data;
};

// Admin: Get pending verifications
export const getPendingVerifications = async () => {
  const response = await api.get('/ngo/verifications/pending');
  return response.data;
};

// Admin: Update verification status
export const updateVerificationStatus = async (verificationId, status) => {
  const response = await api.put(`/ngo/verifications/${verificationId}/status`, { status });
  return response.data;
};

// Admin: Delete verification request
export const deleteVerification = async (verificationId) => {
  const response = await api.delete(`/ngo/verifications/${verificationId}`);
  return response.data;
};

export default {
  submitVerificationRequest,
  getVerificationStatus,
  getVerifiedNGOs,
  getAllVerifications,
  getPendingVerifications,
  updateVerificationStatus,
  deleteVerification
};