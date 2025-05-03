// Cloudinary Configuration
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reunion-website',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  }
});

// Create Multer upload instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 } // 5MB limit
});

module.exports = { cloudinary, upload };