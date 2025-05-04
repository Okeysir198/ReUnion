// Vote Controller
const Vote = require('../models/Vote');

// Submit a vote
exports.submitVote = async (req, res) => {
  try {
    const { name, email, dateVote, budgetAmount, sponsorAmount } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Tên và email là bắt buộc'
      });
    }
    
    // Check if this email has already voted
    let vote = await Vote.findOne({ email });
    
    if (vote) {
      // Prepare update fields
      const updatedFields = {};
      if (name) updatedFields.name = name;
      if (dateVote) updatedFields.dateVote = dateVote;
      if (budgetAmount !== undefined) updatedFields.budgetAmount = parseFloat(budgetAmount) || 0;
      if (sponsorAmount !== undefined) updatedFields.sponsorAmount = parseFloat(sponsorAmount) || 0;
      
      // Track changes before updating
      vote.trackChanges(updatedFields);
      
      // Update fields
      Object.assign(vote, updatedFields);
      
      await vote.save();
      
      return res.status(200).json({
        success: true,
        message: 'Bình chọn đã được cập nhật thành công',
        data: vote
      });
    } else {
      // Create new vote
      vote = new Vote({
        name,
        email,
        dateVote,
        budgetAmount: parseFloat(budgetAmount) || 0,
        sponsorAmount: parseFloat(sponsorAmount) || 0
      });
    
      await vote.save();
      
      return res.status(201).json({
        success: true,
        message: 'Bình chọn đã được gửi thành công',
        data: vote
      });
    }
  } catch (err) {
    console.error('Lỗi khi gửi bình chọn:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
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
        message: 'Không tìm thấy bình chọn cho email này'
      });
    }
    
    res.status(200).json({
      success: true,
      data: vote
    });
    
  } catch (err) {
    console.error('Lỗi khi lấy bình chọn:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
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
    console.error('Lỗi khi lấy thống kê bình chọn:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
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
    console.error('Lỗi khi lấy tất cả bình chọn:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Get vote history (for tracking changes)
exports.getVoteHistory = async (req, res) => {
  try {
    const { email } = req.params;
    
    const vote = await Vote.findOne({ email });
    
    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bình chọn cho email này'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: vote._id,
        email: vote.email,
        changes: vote.changes || []
      }
    });
    
  } catch (err) {
    console.error('Lỗi khi lấy lịch sử bình chọn:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};