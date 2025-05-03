// User Model for Registration
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper functions
const getUsers = () => {
  try {
    const fileData = fs.readFileSync(usersFilePath);
    return JSON.parse(fileData);
  } catch (error) {
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// User Model
class User {
  constructor(userData) {
    this.id = userData.id || uuidv4();
    this.name = userData.name;
    this.email = userData.email;
    this.phone = userData.phone || '';
    this.ticketType = userData.ticketType;
    this.guestTickets = userData.guestTickets || 0;
    this.dietary = userData.dietary || '';
    this.createdAt = userData.createdAt || new Date().toISOString();
    this.paymentStatus = userData.paymentStatus || 'pending';
    this.paymentAmount = this.calculatePaymentAmount();
  }

  // Calculate total payment amount
  calculatePaymentAmount() {
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
    
    return total;
  }

  // Save the user to the JSON file
  async save() {
    const users = getUsers();
    
    // Check if user already exists (for update case)
    const existingUserIndex = users.findIndex(user => user.id === this.id);
    
    if (existingUserIndex >= 0) {
      // Update existing user
      users[existingUserIndex] = this;
    } else {
      // Add new user
      users.push(this);
    }
    
    saveUsers(users);
    return this;
  }

  // Find a user by ID
  static findById(id) {
    const users = getUsers();
    return users.find(user => user.id === id) || null;
  }

  // Find a user by email
  static findOne(query) {
    const users = getUsers();
    if (query.email) {
      return users.find(user => user.email === query.email) || null;
    }
    return null;
  }

  // Find all users
  static find(query = {}) {
    const users = getUsers();
    // Filter logic can be added here if needed
    return users;
  }

  // Delete a user
  async remove() {
    const users = getUsers();
    const updatedUsers = users.filter(user => user.id !== this.id);
    saveUsers(updatedUsers);
    return this;
  }
}

module.exports = User;