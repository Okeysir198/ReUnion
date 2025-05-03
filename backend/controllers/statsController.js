// Stats Controller
const Stats = require('../models/Stats');

// Record a visitor
exports.recordVisitor = async (req, res) => {
  try {
    const stats = Stats.incrementVisitors();
    
    res.status(200).json({
      success: true,
      data: stats
    });
    
  } catch (err) {
    console.error('Record visitor error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = Stats.getDashboardStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
    
  } catch (err) {
    console.error('Get dashboard stats error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};