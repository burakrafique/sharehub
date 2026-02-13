import API from './api';

// Get all items with optional filters and pagination
export const getAllItems = async (filters = {}) => {
  const params = new URLSearchParams();
  
  // Add filters
  if (filters.category) params.append('category', filters.category);
  if (filters.listing_type) params.append('listing_type', filters.listing_type);
  if (filters.condition) params.append('condition', filters.condition);
  if (filters.minPrice) params.append('min_price', filters.minPrice);
  if (filters.maxPrice) params.append('max_price', filters.maxPrice);
  if (filters.searchQuery) params.append('search', filters.searchQuery);
  if (filters.status) params.append('status', filters.status);
  
  // Add pagination
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  
  // Add sorting
  if (filters.sort_by) params.append('sort_by', filters.sort_by);
  if (filters.order) params.append('order', filters.order);
  
  try {
    const response = await API.get(`/items?${params.toString()}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch items',
      data: { items: [], totalPages: 0, totalItems: 0 }
    };
  }
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
  try {
    const response = await API.delete(`/items/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete item',
      data: null
    };
  }
};

// Get nearby items based on location with filters
export const getNearbyItems = async (latitude, longitude, radius = 10, filters = {}) => {
  const params = new URLSearchParams();
  
  // Location parameters
  params.append('latitude', latitude);
  params.append('longitude', longitude);
  params.append('radius', radius);
  
  // Add filters
  if (filters.category) params.append('category', filters.category);
  if (filters.listing_type) params.append('listing_type', filters.listing_type);
  if (filters.condition) params.append('condition', filters.condition);
  if (filters.min_price) params.append('min_price', filters.min_price);
  if (filters.max_price) params.append('max_price', filters.max_price);
  
  // Pagination
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  
  try {
    const response = await API.get(`/items/nearby?${params.toString()}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch nearby items',
      data: { items: [], totalPages: 0, totalItems: 0 }
    };
  }
};

// Advanced search with filters and pagination
export const searchItems = async (searchParams) => {
  const params = new URLSearchParams();
  
  // Search query
  if (searchParams.query) params.append('search', searchParams.query);
  
  // Filters
  if (searchParams.category) params.append('category', searchParams.category);
  if (searchParams.listing_type) params.append('listing_type', searchParams.listing_type);
  if (searchParams.condition) params.append('condition', searchParams.condition);
  if (searchParams.min_price) params.append('min_price', searchParams.min_price);
  if (searchParams.max_price) params.append('max_price', searchParams.max_price);
  
  // Pagination
  if (searchParams.page) params.append('page', searchParams.page);
  if (searchParams.limit) params.append('limit', searchParams.limit);
  
  // Sorting
  if (searchParams.sort_by) params.append('sort_by', searchParams.sort_by);
  if (searchParams.order) params.append('order', searchParams.order);
  
  try {
    const response = await API.get(`/items/search?${params.toString()}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Search failed',
      data: { items: [], totalPages: 0, totalItems: 0 }
    };
  }
};

// Get user's items
export const getUserItems = async (userId) => {
  try {
    const response = await API.get(`/items/user/${userId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch user items',
      data: { items: [] }
    };
  }
};

// Get current user's items (my items)
export const getMyItems = async (status = null) => {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    
    const response = await API.get(`/items/my-items?${params.toString()}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch your items',
      data: { items: [] }
    };
  }
};

// Update item status
export const updateItemStatus = async (id, status, buyerId = null) => {
  try {
    const response = await API.put(`/items/${id}/status`, { status, buyer_id: buyerId });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update item status',
      data: null
    };
  }
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
  getMyItems,
  updateItemStatus,
  deleteItemImage,
  setPrimaryImage
};
