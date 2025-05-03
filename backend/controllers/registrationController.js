// Registration Controller
const User = require('../models/User');

// Register a new attendee
exports.register = async (req, res) => {
  try {
    const { name, email, phone, ticketType, guestTickets, dietary } = req.body;
    
    // Check if user already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered'
      });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      phone,
      ticketType,
      guestTickets: guestTickets || 0,
      dietary
    });
    
    await user.save();
    
    // Send confirmation email (in production)
    // sendConfirmationEmail(user);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        userId: user._id,
        ticketType: user.ticketType,
        totalAmount: user.paymentAmount,
        paymentStatus: user.paymentStatus
      }
    });
    
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
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
    console.error('Get registrations error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
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
        message: 'Registration not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
    
  } catch (err) {
    console.error('Get registration error:', err.message);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Update registration
exports.updateRegistration = async (req, res) => {
  try {
    const { name, email, phone, ticketType, guestTickets, dietary, paymentStatus } = req.body;
    
    // Find registration
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (ticketType) user.ticketType = ticketType;
    if (guestTickets !== undefined) user.guestTickets = guestTickets;
    if (dietary) user.dietary = dietary;
    if (paymentStatus) user.paymentStatus = paymentStatus;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Registration updated',
      data: user
    });
    
  } catch (err) {
    console.error('Update registration error:', err.message);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
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
        message: 'Registration not found'
      });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Registration deleted'
    });
    
  } catch (err) {
    console.error('Delete registration error:', err.message);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
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
        message: 'Registration not found'
      });
    }
    
    // Verify amount
    if (amount !== user.paymentAmount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount mismatch'
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
      message: 'Payment processed successfully',
      data: {
        paymentId: 'DEMO-' + Date.now(),
        amount: user.paymentAmount,
        status: 'completed'
      }
    });
    
  } catch (err) {
    console.error('Payment processing error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
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
    console.error('Get payment status error:', err.message);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};