const multer = require('multer');
const path = require('path');

// Multer is a middleware for handling multipart/form-data (file uploads)
// It processes files and makes them available in req.files

// Configure storage settings
const storage = multer.diskStorage({
  // Set destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, './uploads/items/');
  },
  
  // Generate unique filename using timestamp to prevent conflicts
  // Format: timestamp-originalname (e.g., 1732567890-jacket.jpg)
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname;
    cb(null, `${timestamp}-${originalName}`);
  }
});

// File filter to validate uploaded files
// Only accept image files to prevent malicious uploads
const fileFilter = (req, file, cb) => {
  // Check if mimetype starts with 'image/'
  if (file.mimetype.startsWith('image/')) {
    // Get file extension
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Accept only specific image formats
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    
    if (allowedExtensions.includes(ext)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error('Only image files allowed (.jpg, .jpeg, .png, .gif)'), false);
    }
  } else {
    cb(new Error('Only image files allowed'), false);
  }
};

// Configure multer with storage, file filter, and limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum file size
    files: 5 // Maximum 5 files per request
  }
});

// Multer error handler middleware
// Handles specific multer errors and provides user-friendly messages
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB per file'
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 images allowed'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Use "images" as field name'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  // Custom file filter errors
  if (err.message.includes('Only image files allowed')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  // Pass other errors to next error handler
  next(err);
};

// Export upload middleware for multiple files with field name 'images'
// Usage in routes: uploadMiddleware, then access files via req.files
module.exports = {
  uploadImages: upload.array('images', 5),
  handleMulterError
};
