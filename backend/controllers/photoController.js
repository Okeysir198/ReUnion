// Photo Controller
const Photo = require('../models/Photo');
const { cloudinary } = require('../config/cloudinary');

// Upload photos
exports.uploadPhotos = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }
    
    // Get uploader info from request body
    const { name, email, caption, year } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    // Process each uploaded file
    const uploadedPhotos = [];
    
    for (const file of req.files) {
      const photo = new Photo({
        uploaderName: name,
        uploaderEmail: email,
        originalName: file.originalname,
        cloudinaryId: file.filename,
        cloudinaryUrl: file.path,
        mimetype: file.mimetype,
        size: file.size,
        caption: caption || '',
        year: year || 2005
      });
      
      await photo.save();
      uploadedPhotos.push(photo);
    }
    
    // Send notification email to admin (in production)
    // sendPhotoUploadNotification(uploadedPhotos);
    
    res.status(201).json({
      success: true,
      message: `${uploadedPhotos.length} photo(s) uploaded successfully`,
      data: uploadedPhotos
    });
    
  } catch (err) {
    console.error('Photo upload error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Get all approved photos
exports.getAllApprovedPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ approved: true })
      .sort({ uploadDate: -1 });
    
    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos
    });
    
  } catch (err) {
    console.error('Get photos error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Get pending photos (admin only)
exports.getPendingPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ approved: false })
      .sort({ uploadDate: -1 });
    
    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos
    });
    
  } catch (err) {
    console.error('Get pending photos error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Approve a photo (admin only)
exports.approvePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }
    
    photo.approved = true;
    await photo.save();
    
    res.status(200).json({
      success: true,
      message: 'Photo approved',
      data: photo
    });
    
  } catch (err) {
    console.error('Approve photo error:', err.message);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Delete a photo
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }
    
    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(photo.cloudinaryId);
    
    // Delete the photo from the database
    await photo.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Photo deleted'
    });
    
  } catch (err) {
    console.error('Delete photo error:', err.message);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};