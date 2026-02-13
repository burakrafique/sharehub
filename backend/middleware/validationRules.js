const { body } = require('express-validator');

// ============================================
// ShareHub Backend - Validation Rules
// Express-validator rules for different endpoints
// ============================================

// ============================================
// Authentication Validation Rules
// ============================================

// Registration validation
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters long and contain only letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('Password must be at least 6 characters long and contain at least one letter and one number'),
  body('full_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .trim()
    .withMessage('Full name must be 2-100 characters long'),
  body('phone_number')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('role')
    .optional()
    .isIn(['user', 'ngo'])
    .withMessage('Role must be either user or ngo'),
  body('address')
    .optional()
    .isLength({ max: 500 })
    .trim()
    .withMessage('Address must be less than 500 characters'),
  body('location_latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('location_longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
const updateProfileValidation = [
  body('full_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .trim()
    .withMessage('Full name must be 2-100 characters long'),
  body('phone_number')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters long and contain only letters, numbers, and underscores'),
  body('address')
    .optional()
    .isLength({ max: 500 })
    .trim()
    .withMessage('Address must be less than 500 characters'),
  body('location_latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('location_longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

// Change password validation
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('New password must be at least 6 characters long and contain at least one letter and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

// ============================================
// Item Validation Rules
// ============================================

const createItemValidation = [
  body('title')
    .isLength({ min: 3, max: 200 })
    .trim()
    .withMessage('Title must be 3-200 characters long'),
  body('description')
    .isLength({ min: 10, max: 2000 })
    .trim()
    .withMessage('Description must be 10-2000 characters long'),
  body('category')
    .isIn(['clothes', 'books', 'ration'])
    .withMessage('Category must be clothes, books, or ration'),
  body('listing_type')
    .isIn(['sell', 'donate', 'exchange'])
    .withMessage('Listing type must be sell, donate, or exchange'),
  body('item_condition')
    .isIn(['new', 'like_new', 'good', 'fair', 'poor'])
    .withMessage('Item condition must be new, like_new, good, fair, or poor'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('address')
    .isLength({ min: 5, max: 500 })
    .trim()
    .withMessage('Address must be 5-500 characters long'),
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

// ============================================
// Message Validation Rules
// ============================================

const sendMessageValidation = [
  body('receiver_id')
    .isInt({ min: 1 })
    .withMessage('Receiver ID must be a valid user ID'),
  body('item_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Item ID must be a valid item ID'),
  body('message_text')
    .isLength({ min: 1, max: 1000 })
    .trim()
    .withMessage('Message must be 1-1000 characters long')
];

// ============================================
// Search Validation Rules
// ============================================

const searchValidation = [
  body('query')
    .optional()
    .isLength({ min: 2, max: 100 })
    .trim()
    .withMessage('Search query must be 2-100 characters long'),
  body('category')
    .optional()
    .isIn(['clothes', 'books', 'ration'])
    .withMessage('Category must be clothes, books, or ration'),
  body('listing_type')
    .optional()
    .isIn(['sell', 'donate', 'exchange'])
    .withMessage('Listing type must be sell, donate, or exchange'),
  body('min_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  body('max_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  body('radius')
    .optional()
    .isFloat({ min: 1, max: 100 })
    .withMessage('Radius must be between 1 and 100 km')
];

module.exports = {
  // Authentication
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  
  // Items
  createItemValidation,
  
  // Messages
  sendMessageValidation,
  
  // Search
  searchValidation
};