import API from './api';

const swapService = {
  // Create a new swap request
  createSwapRequest: async (swapData) => {
    return await API.post('/swaps', swapData);
  },

  // Get sent swap requests
  getSentSwapRequests: async () => {
    return await API.get('/swaps/sent');
  },

  // Get received swap requests
  getReceivedSwapRequests: async () => {
    return await API.get('/swaps/received');
  },

  // Get swap request by ID
  getSwapRequestById: async (id) => {
    return await API.get(`/swaps/${id}`);
  },

  // Update swap request status
  updateSwapStatus: async (id, status) => {
    return await API.patch(`/swaps/${id}/status`, { status });
  },

  // Cancel swap request
  cancelSwapRequest: async (id) => {
    return await API.delete(`/swaps/${id}`);
  }
};

export default swapService;
