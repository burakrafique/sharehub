import API from './api';

const donationService = {
  // Create a new donation
  createDonation: async (donationData) => {
    return await API.post('/donations', donationData);
  },

  // Get user's donations
  getUserDonations: async () => {
    return await API.get('/donations/my-donations');
  },

  // Get donation by ID
  getDonationById: async (id) => {
    return await API.get(`/donations/${id}`);
  },

  // Update donation status
  updateDonationStatus: async (id, status) => {
    return await API.patch(`/donations/${id}/status`, { status });
  },

  // Get verified NGOs
  getVerifiedNGOs: async () => {
    return await API.get('/donations/ngos');
  }
};

export default donationService;
