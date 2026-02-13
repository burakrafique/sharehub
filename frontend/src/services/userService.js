import API from './api';

const userService = {
  // Get user profile
  getUserProfile: async () => {
    return await API.get('/users/profile');
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    return await API.put('/users/profile', profileData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return await API.put('/users/change-password', passwordData);
  },

  // Get user's items
  getUserItems: async () => {
    return await API.get('/users/my-items');
  }
};

export default userService;
