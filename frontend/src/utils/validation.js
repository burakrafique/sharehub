// Form validation utilities

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password
 * @returns {object} - { isValid, message, strength }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required', strength: 'none' };
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters', strength: 'weak' };
  }

  if (password.length < 8) {
    return { isValid: true, message: 'Password is acceptable', strength: 'medium' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (strengthCount >= 3 && password.length >= 8) {
    return { isValid: true, message: 'Strong password', strength: 'strong' };
  }

  return { isValid: true, message: 'Password is acceptable', strength: 'medium' };
};

/**
 * Validate phone number (Pakistan format)
 * @param {string} phone - Phone number
 * @returns {boolean} - True if valid
 */
export const validatePhone = (phone) => {
  // Pakistan phone formats: 03001234567, 0300-1234567, +923001234567
  const phoneRegex = /^(\+92|0)?3\d{2}-?\d{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate required field
 * @param {any} value - Field value
 * @returns {boolean} - True if not empty
 */
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate username format
 * @param {string} username - Username
 * @returns {object} - { isValid, message }
 */
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters' };
  }

  if (username.length > 50) {
    return { isValid: false, message: 'Username must be less than 50 characters' };
  }

  // Allow alphanumeric characters and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }

  return { isValid: true, message: 'Username is valid' };
};

/**
 * Validate required field with custom field name
 * @param {any} value - Field value
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} - { isValid, message }
 */
export const validateRequiredField = (value, fieldName) => {
  const isValid = validateRequired(value);
  return {
    isValid,
    message: isValid ? '' : `${fieldName} is required`
  };
};

/**
 * Validate number range
 * @param {number} value - Number value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} - True if in range
 */
export const validateNumberRange = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

/**
 * Validate coordinates
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {boolean} - True if valid
 */
export const validateCoordinates = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  
  return true;
};

/**
 * Validate file size
 * @param {File} file - File object
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean} - True if valid
 */
export const validateFileSize = (file, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type
 * @param {File} file - File object
 * @param {array} allowedTypes - Array of allowed MIME types
 * @returns {boolean} - True if valid
 */
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']) => {
  return allowedTypes.includes(file.type);
};

/**
 * Get password strength color
 * @param {string} strength - Strength level
 * @returns {string} - Bootstrap color class
 */
export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 'strong':
      return 'success';
    case 'medium':
      return 'warning';
    case 'weak':
      return 'danger';
    default:
      return 'secondary';
  }
};

/**
 * Validate form data
 * @param {object} data - Form data
 * @param {object} rules - Validation rules
 * @returns {object} - { isValid, errors }
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];

    if (rule.required && !validateRequired(value)) {
      errors[field] = rule.message || `${field} is required`;
    }

    if (rule.email && value && !validateEmail(value)) {
      errors[field] = 'Invalid email format';
    }

    if (rule.phone && value && !validatePhone(value)) {
      errors[field] = 'Invalid phone number format';
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `Must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `Must be less than ${rule.maxLength} characters`;
    }

    if (rule.min && value && parseFloat(value) < rule.min) {
      errors[field] = `Must be at least ${rule.min}`;
    }

    if (rule.max && value && parseFloat(value) > rule.max) {
      errors[field] = `Must be less than ${rule.max}`;
    }

    if (rule.custom && value) {
      const customResult = rule.custom(value, data);
      if (customResult !== true) {
        errors[field] = customResult;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
