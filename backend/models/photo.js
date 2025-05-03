// Photo Model for Photo Uploads
const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Set to true if login required for upload
  },
  uploaderName: {
    type: String,
    required: true
  },
  uploaderEmail: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  caption: {
    type: String
  },
  year: {
    type: Number
  },
  approved: {
    type: Boolean,
    default: false
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Photo', PhotoSchema);