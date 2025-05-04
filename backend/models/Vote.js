// Vote Model for Event Date and Budget Voting
const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dateVote: {
    type: String,
    default: null
  },
  budgetAmount: {
    type: Number,
    default: 0
  },
  sponsorAmount: {
    type: Number,
    default: 0
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

// Track changes to vote information
VoteSchema.methods.trackChanges = function(updatedFields) {
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

// Static method to get vote statistics
VoteSchema.statics.getStats = async function() {
  const votes = await this.find();
  
  // Count votes for each date option
  const dateVotes = {};
  votes.forEach(vote => {
    if (vote.dateVote) {
      dateVotes[vote.dateVote] = (dateVotes[vote.dateVote] || 0) + 1;
    }
  });
  
  // Calculate budget stats
  const totalBudget = votes.reduce((sum, vote) => sum + vote.budgetAmount, 0);
  const totalSponsorship = votes.reduce((sum, vote) => sum + vote.sponsorAmount, 0);
  
  return {
    dateVotes,
    totalBudget,
    totalSponsorship,
    voteCount: votes.length
  };
};

module.exports = mongoose.model('Vote', VoteSchema);