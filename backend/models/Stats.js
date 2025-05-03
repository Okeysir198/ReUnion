// Stats Model for Website Statistics
const fs = require('fs');
const path = require('path');

const statsFilePath = path.join(__dirname, '../data/stats.json');

// Helper functions
const getStats = () => {
  try {
    const fileData = fs.readFileSync(statsFilePath);
    return JSON.parse(fileData);
  } catch (error) {
    return {
      visitors: 0,
      lastUpdated: new Date().toISOString()
    };
  }
};

const saveStats = (stats) => {
  fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
};

// Stats Model
class Stats {
  // Increment visitor count
  static incrementVisitors() {
    const stats = getStats();
    stats.visitors += 1;
    stats.lastUpdated = new Date().toISOString();
    saveStats(stats);
    return stats;
  }

  // Get current stats
  static getStats() {
    return getStats();
  }

  // Get dashboard stats
  static getDashboardStats() {
    const stats = getStats();
    
    // Load other data for the dashboard
    const usersFilePath = path.join(__dirname, '../data/users.json');
    const votesFilePath = path.join(__dirname, '../data/votes.json');
    
    let users = [];
    let votes = [];
    
    try {
      users = JSON.parse(fs.readFileSync(usersFilePath));
    } catch (error) {
      users = [];
    }
    
    try {
      votes = JSON.parse(fs.readFileSync(votesFilePath));
    } catch (error) {
      votes = [];
    }
    
    // Calculate total budget from registrations
    const totalRegistrationBudget = users.reduce((sum, user) => sum + user.paymentAmount, 0);
    
    // Calculate budget from votes/sponsorships
    const totalVoteBudget = votes.reduce((sum, vote) => sum + vote.budgetAmount, 0);
    const totalSponsorshipBudget = votes.reduce((sum, vote) => sum + vote.sponsorAmount, 0);
    
    return {
      visitors: stats.visitors,
      registrations: users.length,
      totalRegistrationBudget,
      totalVoteBudget,
      totalSponsorshipBudget,
      totalBudget: totalRegistrationBudget + totalSponsorshipBudget,
      lastUpdated: stats.lastUpdated
    };
  }
}

module.exports = Stats;