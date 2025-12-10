// ShareHub Backend - Authentication Routes
// Defines API endpoints for authentication features

const express = require('express');
const router = express.Router();

const { register, login, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/profile
router.get('/profile', verifyToken, getProfile);

module.exports = router;

