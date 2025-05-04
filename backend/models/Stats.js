// Stats Model for Website Statistics
const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  visitors: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create a singleton pattern - there should only be one Stats document
StatsSchema.statics.getStats = async function() {
  const stats = await this.findOne();
  
  if (stats) {
    return stats;
  } else {
    // Create initial stats if none exist
    return this.create({ visitors: 0 });
  }
};

// Increment visitor count
StatsSchema.statics.incrementVisitors = async function() {
  let stats = await this.findOne();
  
  if (!stats) {
    stats = await this.create({ visitors: 1 });
  } else {
    stats.visitors += 1;
    stats.lastUpdated = new Date();
    await stats.save();
  }
  
  return stats;
};

// Get dashboard stats
StatsSchema.statics.getDashboardStats = async function() {
  const User = mongoose.model('User');
  const Vote = mongoose.model('Vote');
  
  // Get stats
  const stats = await this.getStats();
  
  // Get users
  const users = await User.find();
  
  // Calculate attendance counts
  const adultCount = users.reduce((sum, user) => sum + (user.adultTickets || 0), 0);
  const childCount = users.reduce((sum, user) => sum + (user.childTickets || 0), 0);
  const infantCount = users.reduce((sum, user) => sum + (user.infantTickets || 0), 0);
  const totalAttendees = adultCount + childCount + infantCount;
  
  // Get vote statistics
  const voteStats = await Vote.getStats();
  
  // Calculate total budget from registrations
  const totalRegistrationBudget = users.reduce((sum, user) => sum + user.paymentAmount, 0);
  
  return {
    visitors: stats.visitors,
    registrations: users.length,
    adultCount,
    childCount,
    infantCount,
    totalAttendees,
    totalRegistrationBudget,
    totalVoteBudget: voteStats.totalBudget,
    totalSponsorshipBudget: voteStats.totalSponsorship,
    totalBudget: totalRegistrationBudget + voteStats.totalSponsorship,
    lastUpdated: stats.lastUpdated
  };
};

module.exports = mongoose.model('Stats', StatsSchema);