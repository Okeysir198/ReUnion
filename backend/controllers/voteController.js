// Vote Controller
const Vote = require('../models/Vote');

// Submit a vote
exports.submitVote = async (req, res) => {
  try {
    const { name, email, dateVote, budgetAmount, sponsorAmount } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    // Check if this email has already voted
    let vote = await Vote.findOne({ email });
    
    if (vote) {
      // Update existing vote
      vote.name = name;
      if (dateVote) vote.dateVote = dateVote;
      if (budgetAmount !== undefined) vote.budgetAmount = parseFloat(budgetAmount) || 0;
      if (sponsorAmount !== undefined) vote.sponsorAmount = parseFloat(sponsorAmount) || 0;
    } else {
      // Create new vote
      vote = new Vote({
        name,
        email,
        dateVote,
        budgetAmount: parseFloat(budgetAmount) || 0,
        sponsorAmount: parseFloat(sponsorAmount) || 0
      });
    }
    
    await vote.save();
    
    res.status(200).json({
      success: true,
      message: vote.isNew ? 'Vote submitted successfully' : 'Vote updated successfully',
      data: vote
    });
    
  } catch (err) {
    console.error('Vote submission error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Get vote by email
exports.getVoteByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    const vote = await Vote.findOne({ email });
    
    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'No vote found for this email'
      });
    }
    
    res.status(200).json({
      success: true,
      data: vote
    });
    
  } catch (err) {
    console.error('Get vote error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Get vote statistics
exports.getVoteStats = async (req, res) => {
  try {
    const stats = await Vote.getStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
    
  } catch (err) {
    console.error('Get vote stats error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Get all votes (admin only)
exports.getAllVotes = async (req, res) => {
  try {
    const votes = await Vote.find()
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: votes.length,
      data: votes
    });
    
  } catch (err) {
    console.error('Get all votes error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};