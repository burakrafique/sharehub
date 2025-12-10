import API from './api';

// Get all user's favorites
export const getFavorites = async () => {
  const response = await API.get('/favorites');
  return response.data;
};

// Add item to favorites
export const addFavorite = async (itemId) => {
  const response = await API.post('/favorites', { item_id: itemId });
  return response.data;
};

// Remove item from favorites
export const removeFavorite = async (itemId) => {
  const response = await API.delete(`/favorites/${itemId}`);
  return response.data;
};

// Check if item is favorited
export const isFavorited = async (itemId) => {
  const response = await API.get(`/favorites/check/${itemId}`);
  return response.data;
};

// Toggle favorite status
export const toggleFavorite = async (itemId, isFavorited) => {
  if (isFavorited) {
    return await removeFavorite(itemId);
  } else {
    return await addFavorite(itemId);
  }
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorited,
  toggleFavorite
};
