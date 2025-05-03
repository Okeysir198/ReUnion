// Vote Model for Event Date and Budget Voting
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const votesFilePath = path.join(__dirname, '../data/votes.json');

// Helper functions
const getVotes = () => {
  try {
    const fileData = fs.readFileSync(votesFilePath);
    return JSON.parse(fileData);
  } catch (error) {
    return [];
  }
};

const saveVotes = (votes) => {
  fs.writeFileSync(votesFilePath, JSON.stringify(votes, null, 2));
};

// Vote Model
class Vote {
  constructor(voteData) {
    this.id = voteData.id || uuidv4();
    this.email = voteData.email;
    this.name = voteData.name;
    this.dateVote = voteData.dateVote || null;
    this.budgetAmount = voteData.budgetAmount || 0;
    this.sponsorAmount = voteData.sponsorAmount || 0;
    this.createdAt = voteData.createdAt || new Date().toISOString();
  }

  // Save the vote to the JSON file
  async save() {
    const votes = getVotes();
    
    // Check if vote already exists (for update case)
    const existingVoteIndex = votes.findIndex(vote => vote.email === this.email);
    
    if (existingVoteIndex >= 0) {
      // Update existing vote
      votes[existingVoteIndex] = this;
    } else {
      // Add new vote
      votes.push(this);
    }
    
    saveVotes(votes);
    return this;
  }

  // Find a vote by email
  static findByEmail(email) {
    const votes = getVotes();
    return votes.find(vote => vote.email === email) || null;
  }

  // Get all votes
  static find() {
    return getVotes();
  }

  // Get vote stats
  static getStats() {
    const votes = getVotes();
    
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
  }
}

module.exports = Vote;