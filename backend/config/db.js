// Database Configuration
const mongoose = require('mongoose');

// MongoDB connection string - replace with your actual MongoDB URI
// For production, this should be stored in environment variables
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/reunion-website';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = { connectDB };