import API from './api';

// Get all items with optional filters
export const getAllItems = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.listing_type) params.append('listing_type', filters.listing_type);
  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  
  const response = await API.get(`/items?${params.toString()}`);
  return response.data;
};

// Get item by ID
export const getItemById = async (id) => {
  const response = await API.get(`/items/${id}`);
  return response.data;
};

// Create new item with images
export const createItem = async (formData) => {
  const response = await API.post('/items', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Update item
export const updateItem = async (id, data) => {
  const response = await API.put(`/items/${id}`, data);
  return response.data;
};

// Delete item
export const deleteItem = async (id) => {
  const response = await API.delete(`/items/${id}`);
  return response.data;
};

// Get nearby items based on location
export const getNearbyItems = async (latitude, longitude, radius = 10) => {
  const response = await API.get(`/items/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
  return response.data;
};

// Advanced search
export const searchItems = async (searchParams) => {
  const params = new URLSearchParams();
  
  if (searchParams.category) params.append('category', searchParams.category);
  if (searchParams.listing_type) params.append('listing_type', searchParams.listing_type);
  if (searchParams.min_price) params.append('min_price', searchParams.min_price);
  if (searchParams.max_price) params.append('max_price', searchParams.max_price);
  if (searchParams.condition) params.append('condition', searchParams.condition);
  if (searchParams.search) params.append('search', searchParams.search);
  if (searchParams.sort_by) params.append('sort_by', searchParams.sort_by);
  if (searchParams.order) params.append('order', searchParams.order);
  
  const response = await API.get(`/items/search?${params.toString()}`);
  return response.data;
};

// Get user's items
export const getUserItems = async (userId) => {
  const response = await API.get(`/items/user/${userId}`);
  return response.data;
};

// Update item status
export const updateItemStatus = async (id, status, buyerId = null) => {
  const response = await API.put(`/items/${id}/status`, { status, buyer_id: buyerId });
  return response.data;
};

// Delete item image
export const deleteItemImage = async (imageId) => {
  const response = await API.delete(`/items/images/${imageId}`);
  return response.data;
};

// Set primary image
export const setPrimaryImage = async (imageId) => {
  const response = await API.put(`/items/images/${imageId}/primary`);
  return response.data;
};

// Default export
export default {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getNearbyItems,
  searchItems,
  getUserItems,
  updateItemStatus,
  deleteItemImage,
  setPrimaryImage
};
