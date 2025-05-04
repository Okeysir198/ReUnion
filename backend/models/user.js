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
  adultTickets: {
    type: Number,
    required: true,
    default: 1
  },
  childTickets: {
    type: Number,
    default: 0
  },
  infantTickets: {
    type: Number,
    default: 0
  },
  comments: {
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
  },
  changes: [{
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    changedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Calculate payment amount based on tickets
UserSchema.pre('save', function(next) {
  // Adult: 2,000,000 VND, Child (5-12): 1,400,000 VND (70% of adult), Infant (under 5): Free
  const adultPrice = 4000000;
  const childPrice = 2800000;
  const infantPrice = 0;
  
  // Calculate total cost
  let total = (this.adultTickets * adultPrice) + (this.childTickets * childPrice) + (this.infantTickets * infantPrice);
  
  this.paymentAmount = total;
  next();
});

// Track changes to registration information
UserSchema.methods.trackChanges = function(updatedFields) {
  const changes = [];
  
  // Compare current values with updated values
  Object.keys(updatedFields).forEach(field => {
    // Skip _id and timestamps
    if (['_id', 'createdAt', 'updatedAt', 'changes'].includes(field)) {
      return;
    }
    
    // Check if value has changed
    if (JSON.stringify(this[field]) !== JSON.stringify(updatedFields[field])) {
      changes.push({
        field,
        oldValue: this[field],
        newValue: updatedFields[field],
        changedAt: new Date()
      });
    }
  });
  
  // Add changes to the history
  if (changes.length > 0) {
    this.changes = this.changes || [];
    this.changes.push(...changes);
  }
  
  return changes.length > 0;
};

module.exports = mongoose.model('User', UserSchema);