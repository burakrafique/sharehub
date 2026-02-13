// ============================================
// ShareHub Backend - Admin Authorization Middleware (REQ-F-34)
// ============================================

const { verifyToken } = require('./authMiddleware');

// ============================================
// Admin Role Check Middleware
// Ensures only users with 'admin' role can access protected routes
// ============================================

const requireAdmin = async (req, res, next) => {
  try {
    // First verify the token (this will set req.user)
    await new Promise((resolve, reject) => {
      verifyToken(req, res, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Check if user has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Log admin access for security auditing
    if (process.env.NODE_ENV === 'development') {
      console.log(`👨‍💼 Admin access: ${req.user.name} (${req.user.email}) - ${req.method} ${req.originalUrl}`);
    }

    next();
  } catch (error) {
    console.error('❌ Admin middleware error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during admin verification.'
    });
  }
};

// ============================================
// Simple Admin Check (for use after verifyToken)
// Use this when verifyToken is already applied to the route
// ============================================

const verifyAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated (should be set by verifyToken middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required. You do not have permission to access this resource.'
      });
    }

    // Log admin access for security auditing
    if (process.env.NODE_ENV === 'development') {
      console.log(`👨‍💼 Admin access: ${req.user.name} (${req.user.email}) - ${req.method} ${req.originalUrl}`);
    }

    // User is admin, proceed to next middleware/route handler
    next();
  } catch (error) {
    console.error('❌ Admin verification error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error verifying admin access',
      error: error.message
    });
  }
};

// ============================================
// Admin or NGO Role Check Middleware
// Allows both admin and NGO users to access certain routes
// ============================================

const requireAdminOrNGO = (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has admin or ngo role
    if (!['admin', 'ngo'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or NGO privileges required.'
      });
    }

    next();
  } catch (error) {
    console.error('❌ Admin/NGO middleware error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during role verification.'
    });
  }
};

// ============================================
// Helper Functions
// ============================================

// Check if user is admin (without requiring authentication)
const isAdmin = (req) => {
  return req.user && req.user.role === 'admin';
};

// Check if user is NGO (without requiring authentication)
const isNGO = (req) => {
  return req.user && req.user.role === 'ngo';
};

module.exports = {
  requireAdmin,
  verifyAdmin,
  requireAdminOrNGO,
  isAdmin,
  isNGO
};