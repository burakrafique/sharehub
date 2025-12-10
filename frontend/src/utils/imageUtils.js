// Utility functions for handling image URLs

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

/**
 * Get full image URL from relative path
 * @param {string} imagePath - Relative image path from backend (e.g., /uploads/items/image.jpg)
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/300x200?text=No+Image';
  }
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Construct full URL
  return `${BACKEND_URL}${imagePath}`;
};

/**
 * Get image URL for item (uses first image or placeholder)
 * @param {object} item - Item object with images array
 * @returns {string} - Image URL
 */
export const getItemImageUrl = (item) => {
  if (item.images && item.images.length > 0) {
    return getImageUrl(item.images[0].image_url);
  }
  return 'https://via.placeholder.com/300x200?text=No+Image';
};

/**
 * Get all image URLs for an item
 * @param {object} item - Item object with images array
 * @returns {array} - Array of image URLs
 */
export const getItemImages = (item) => {
  if (item.images && item.images.length > 0) {
    return item.images.map(img => getImageUrl(img.image_url));
  }
  return ['https://via.placeholder.com/600x400?text=No+Image'];
};

/**
 * Placeholder image URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Placeholder text
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = (width = 300, height = 200, text = 'No Image') => {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
};
