// Authentication Routes for Admin Panel
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In a real application, you would use a database model
// For simplicity, using hardcoded admin user for this example
const adminUser = {
  username: 'admin',
  // This would be a hashed password in a real application
  password: '$2a$10$XFDu94glMAmsKaPQcswDTOX0YO9XagmLmAQL2qYPLQ1QFzxlgVUeO', // "reunion2025"
};

// JWT secret key - in production this would be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-jwt-key';

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    if (username !== adminUser.username) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Create JWT payload
    const payload = {
      user: {
        username: adminUser.username,
        isAdmin: true
      }
    };
    
    // Create and return JWT token
    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({
        success: true,
        token
      });
    });
    
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Auth middleware for protected routes
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token, authorization denied' 
    });
  }
  
  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

// Verify token route (for checking if user is still logged in)
router.get('/verify', auth, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = { router, auth };