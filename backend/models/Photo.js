// Photo Model for Photo Uploads
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PhotoSchema = new mongoose.Schema({
  uploaderName: {
    type: String,
    required: true
  },
  uploaderEmail: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  cloudinaryUrl: {
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
    type: String,
    default: ''
  },
  year: {
    type: Number,
    default: 2005
  },
  approved: {
    type: Boolean,
    default: true
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: {
    type: [String],
    default: []
  },
  comments: {
    type: [CommentSchema],
    default: []
  }
}, {
  timestamps: { 
    createdAt: 'uploadDate', 
    updatedAt: 'updatedAt' 
  }
});

module.exports = mongoose.model('Photo', PhotoSchema);