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
  }
}, {
  timestamps: true
});

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