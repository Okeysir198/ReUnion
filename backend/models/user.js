// User Model for Registration
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    default: ''
  },
  ticketType: {
    type: String,
    required: true,
    enum: ['early', 'regular']
  },
  guestTickets: {
    type: Number,
    default: 0
  },
  dietary: {
    type: String,
    default: ''
  },
  paymentStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'completed', 'failed']
  },
  paymentAmount: {
    type: Number
  }
}, {
  timestamps: true
});

// Calculate payment amount based on ticket type and guests
UserSchema.pre('save', function(next) {
  // Early bird: $85, Regular: $120, Guest: $95
  const ticketPrices = {
    early: 85,
    regular: 120
  };
  
  const guestPrice = 95;
  
  // Calculate base price
  let total = ticketPrices[this.ticketType];
  
  // Add guest tickets cost
  if (this.guestTickets > 0) {
    total += (this.guestTickets * guestPrice);
  }
  
  this.paymentAmount = total;
  next();
});

module.exports = mongoose.model('User', UserSchema);