// Registration Controller
const User = require('../models/User');

// Register a new attendee
exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      adultTickets, 
      childTickets, 
      infantTickets, 
      comments 
    } = req.body;
    
    // Validation
    if (!name || !email || !adultTickets) {
      return res.status(400).json({
        success: false,
        message: 'Tên, email và số lượng người lớn là bắt buộc'
      });
    }
    
    // Check if user already registered
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Update existing registration if already exists
      const updatedFields = {
        name,
        phone,
        adultTickets: parseInt(adultTickets) || 1,
        childTickets: parseInt(childTickets) || 0,
        infantTickets: parseInt(infantTickets) || 0,
        comments
      };
      
      // Track changes
      const hasChanges = existingUser.trackChanges(updatedFields);
      
      // Update fields
      Object.assign(existingUser, updatedFields);
      
      await existingUser.save();
      
      // Send update confirmation email (in production)
      // sendUpdateConfirmationEmail(existingUser);
      
      return res.status(200).json({
        success: true,
        message: 'Thông tin đăng ký đã được cập nhật',
        data: {
          userId: existingUser._id,
          name: existingUser.name,
          totalAmount: existingUser.paymentAmount,
          paymentStatus: existingUser.paymentStatus,
          isUpdate: true
        }
      });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      phone,
      adultTickets: parseInt(adultTickets) || 1,
      childTickets: parseInt(childTickets) || 0,
      infantTickets: parseInt(infantTickets) || 0,
      comments
    });
    
    await user.save();
    
    // Send confirmation email (in production)
    // sendConfirmationEmail(user);
    
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        userId: user._id,
        name: user.name,
        totalAmount: user.paymentAmount,
        paymentStatus: user.paymentStatus,
        isUpdate: false
      }
    });
    
  } catch (err) {
    console.error('Lỗi đăng ký:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Get all registrations (admin only)
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await User.find()
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
    
  } catch (err) {
    console.error('Lỗi khi lấy đăng ký:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Get registration by ID
exports.getRegistrationById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đăng ký'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
    
  } catch (err) {
    console.error('Lỗi khi lấy đăng ký:', err.message);
    
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Update registration
exports.updateRegistration = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      adultTickets, 
      childTickets, 
      infantTickets, 
      comments, 
      paymentStatus 
    } = req.body;
    
    // Find registration
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đăng ký'
      });
    }
    
    // Prepare updated fields
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (phone) updatedFields.phone = phone;
    if (adultTickets !== undefined) updatedFields.adultTickets = parseInt(adultTickets);
    if (childTickets !== undefined) updatedFields.childTickets = parseInt(childTickets);
    if (infantTickets !== undefined) updatedFields.infantTickets = parseInt(infantTickets);
    if (comments) updatedFields.comments = comments;
    if (paymentStatus) updatedFields.paymentStatus = paymentStatus;
    
    // Track changes
    const hasChanges = user.trackChanges(updatedFields);
    
    // Update fields
    Object.assign(user, updatedFields);
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Đăng ký đã được cập nhật',
      data: user
    });
    
  } catch (err) {
    console.error('Lỗi khi cập nhật đăng ký:', err.message);
    
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Delete registration
exports.deleteRegistration = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đăng ký'
      });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Đăng ký đã bị xóa'
    });
    
  } catch (err) {
    console.error('Lỗi khi xóa đăng ký:', err.message);
    
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Process payment (in a real app this would connect to a payment processor like Stripe)
exports.processPayment = async (req, res) => {
  try {
    const { userId, paymentMethod, amount } = req.body;
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đăng ký'
      });
    }
    
    // Verify amount
    if (amount !== user.paymentAmount) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền thanh toán không đúng'
      });
    }
    
    // In a real application, this would call a payment processor API
    // For this example, we'll just simulate a successful payment
    
    // Update payment status
    user.paymentStatus = 'completed';
    await user.save();
    
    // Send payment confirmation email (in production)
    // sendPaymentConfirmationEmail(user);
    
    res.status(200).json({
      success: true,
      message: 'Thanh toán thành công',
      data: {
        paymentId: 'DEMO-' + Date.now().toString().slice(-6),
        amount: user.paymentAmount,
        status: 'completed'
      }
    });
    
  } catch (err) {
    console.error('Lỗi xử lý thanh toán:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        paymentStatus: user.paymentStatus,
        paymentAmount: user.paymentAmount
      }
    });
    
  } catch (err) {
    console.error('Lỗi khi lấy trạng thái thanh toán:', err.message);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};