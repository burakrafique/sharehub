// Admin Middleware - Role-based Access Control
// This middleware checks if the authenticated user has admin role

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

    // User is admin, proceed to next middleware/route handler
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying admin access',
      error: error.message
    });
  }
};

module.exports = { verifyAdmin };
