// Database Configuration - Using local file storage instead of MongoDB
const fs = require('fs');
const path = require('path');

// Create data directories if they don't exist
const dataDir = path.join(__dirname, '../data');
const uploadsDir = path.join(__dirname, '../../frontend/uploads');

// Database connection function
const connectDB = async () => {
  try {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
      console.log('Data directory created successfully');
    }
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
      console.log('Uploads directory created successfully');
    }
    
    // Create necessary data files if they don't exist
    const dataFiles = ['users.json', 'photos.json', 'votes.json', 'budget.json', 'stats.json'];
    
    dataFiles.forEach(file => {
      const filePath = path.join(dataDir, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
        console.log(`${file} created successfully`);
      }
    });
    
    console.log('Local database setup successfully');
  } catch (error) {
    console.error('Database setup error:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };