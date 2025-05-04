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
        message: 'Không có tệp nào được tải lên'
      });
    }
    
    // Get uploader info from request body
    const { name, email, caption, year } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Tên và email là bắt buộc'
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
        year: year || 2005,
        // Skip approval process
        approved: true,
        likes: 0,
        comments: []
      });
      
      await photo.save();
      uploadedPhotos.push(photo);
    }
    
    res.status(201).json({
      success: true,
      message: `Đã tải lên thành công ${uploadedPhotos.length} ảnh`,
      data: uploadedPhotos
    });
    
  } catch (err) {
    console.error('Lỗi khi tải ảnh lên:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Get all photos (no approval filtering needed)
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find()
      .sort({ uploadDate: -1 });
    
    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos
    });
    
  } catch (err) {
    console.error('Lỗi khi lấy ảnh:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};


// Updated Like a photo function - simplified to only require name
exports.likePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Tên là bắt buộc'
      });
    }
    
    const photo = await Photo.findById(photoId);
    
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ảnh'
      });
    }
    
    // Check if user already liked the photo
    if (!photo.likedBy) {
      photo.likedBy = [];
    }
    
    const alreadyLiked = photo.likedBy.includes(name);
    
    if (alreadyLiked) {
      // Unlike the photo
      photo.likedBy = photo.likedBy.filter(likedName => likedName !== name);
      photo.likes = photo.likedBy.length;
      
      await photo.save();
      
      return res.status(200).json({
        success: true,
        message: 'Đã bỏ thích ảnh',
        data: {
          likes: photo.likes,
          liked: false
        }
      });
    } else {
      // Like the photo
      photo.likedBy.push(name);
      photo.likes = photo.likedBy.length;
      
      await photo.save();
      
      return res.status(200).json({
        success: true,
        message: 'Đã thích ảnh',
        data: {
          likes: photo.likes,
          liked: true
        }
      });
    }
  } catch (err) {
    console.error('Lỗi khi thích ảnh:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

// Updated Add a comment to a photo - simplified to only require name
exports.addComment = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { name, text } = req.body;
    
    if (!name || !text) {
      return res.status(400).json({
        success: false,
        message: 'Tên và nội dung bình luận là bắt buộc'
      });
    }
    
    const photo = await Photo.findById(photoId);
    
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ảnh'
      });
    }
    
    // Add comment
    if (!photo.comments) {
      photo.comments = [];
    }
    
    const comment = {
      name,
      text,
      createdAt: new Date()
    };
    
    photo.comments.push(comment);
    
    await photo.save();
    
    res.status(201).json({
      success: true,
      message: 'Đã thêm bình luận',
      data: comment
    });
    
  } catch (err) {
    console.error('Lỗi khi thêm bình luận:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
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
        message: 'Không tìm thấy ảnh'
      });
    }
    
    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(photo.cloudinaryId);
    
    // Delete the photo from the database
    await photo.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Đã xóa ảnh'
    });
    
  } catch (err) {
    console.error('Lỗi khi xóa ảnh:', err.message);
    
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};