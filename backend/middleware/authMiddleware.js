const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');

// ============================================
// JWT Authentication Middleware (REQ-F-2, REQ-F-4)
// Verifies JWT token and attaches user to request
// ============================================

const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract token from "Bearer TOKEN" format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure user still exists and is active
    const [users] = await promisePool.execute(
      'SELECT id, name, email, role, is_active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found.'
      });
    }

    const user = users[0];

    // Check if user account is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Account is deactivated.'
      });
    }

    // Attach user information to request object
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active
    };

    // Log authentication for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 User authenticated: ${user.name} (${user.email}) - Role: ${user.role}`);
    }

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token expired.'
      });
    }

    console.error('❌ Authentication error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

// ============================================
// Optional Authentication Middleware
// Attaches user if token is valid, but doesn't require it
// ============================================

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [users] = await promisePool.execute(
      'SELECT id, name, email, role, is_active FROM users WHERE id = ? AND is_active = true',
      [decoded.id]
    );

    if (users.length > 0) {
      req.user = {
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
        role: users[0].role,
        is_active: users[0].is_active
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // If token is invalid, just set user to null and continue
    req.user = null;
    next();
  }
};

// ============================================
// Role-based Access Control Middleware
// ============================================

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// ============================================
// Generate JWT Token Helper Function
// ============================================

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h' // 24 hour expiry as requested
  });
};

// ============================================
// Verify Token Helper Function (for password reset, etc.)
// ============================================

const verifyTokenOnly = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  verifyToken,
  optionalAuth,
  checkRole,
  generateToken,
  verifyTokenOnly
};