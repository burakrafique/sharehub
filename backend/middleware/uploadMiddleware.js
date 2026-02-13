const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ============================================
// ShareHub Backend - File Upload Middleware
// Handles image uploads for items and profiles using Multer
// ============================================

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
};

// Create upload directories
const itemsUploadPath = process.env.UPLOAD_PATH_ITEMS || 'uploads/items';
const profilesUploadPath = process.env.UPLOAD_PATH_PROFILES || 'uploads/profiles';

ensureDirectoryExists(itemsUploadPath);
ensureDirectoryExists(profilesUploadPath);

// ============================================
// Storage Configuration for Items
// ============================================

const itemStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, itemsUploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + random number + original extension
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `item_${timestamp}_${randomNum}${extension}`;
    cb(null, filename);
  }
});

// ============================================
// Storage Configuration for Profiles
// ============================================

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilesUploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + random number + original extension
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `profile_${timestamp}_${randomNum}${extension}`;
    cb(null, filename);
  }
});

// ============================================
// File Filter Function
// Only allow specific image types
// ============================================

const fileFilter = (req, file, cb) => {
  // Check file mimetype
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];

  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// ============================================
// Multer Configuration for Items
// ============================================

const uploadItems = multer({
  storage: itemStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 5 // Maximum 5 files per request
  }
});

// ============================================
// Multer Configuration for Profiles
// ============================================

const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 1 // Only 1 profile image
  }
});

// ============================================
// Error Handling Middleware
// ============================================

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB per file.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 5 images allowed for items, 1 for profiles.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected field name. Use "images" for items or "profileImage" for profiles.'
        });
      default:
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
    }
  }

  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next(err);
};

// ============================================
// Utility Functions
// ============================================

// Delete file helper function
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error deleting file ${filePath}:`, error.message);
    return false;
  }
};

// Get file size helper
const getFileSize = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
};

// Validate image dimensions (optional)
const validateImageDimensions = (filePath, maxWidth = 2048, maxHeight = 2048) => {
  // This would require an image processing library like sharp
  // For now, we'll just return true
  return true;
};

// ============================================
// Export Middleware Functions
// ============================================

module.exports = {
  // Main upload middleware
  uploadImages: uploadItems.array('images', 5),
  uploadProfileImage: uploadProfile.single('profileImage'),
  
  // Alternative configurations
  uploadSingleItem: uploadItems.single('image'),
  uploadMultipleItems: uploadItems.array('images', 5),
  
  // Error handling
  handleMulterError,
  
  // Utility functions
  deleteFile,
  getFileSize,
  validateImageDimensions,
  
  // Direct access to multer instances
  itemsUploader: uploadItems,
  profileUploader: uploadProfile
};
