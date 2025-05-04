// API Routes for Reunion Website
const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const registrationController = require('../controllers/registrationController');
const photoController = require('../controllers/photoController');
const voteController = require('../controllers/voteController');
const statsController = require('../controllers/statsController');

// Registration routes
router.post('/register', registrationController.register);
router.get('/registrations', registrationController.getAllRegistrations);
router.get('/registration/:id', registrationController.getRegistrationById);
router.put('/registration/:id', registrationController.updateRegistration);
router.delete('/registration/:id', registrationController.deleteRegistration);

// Payment routes
router.post('/payment', registrationController.processPayment);
router.get('/payment-status/:id', registrationController.getPaymentStatus);

// Photo upload routes
router.post('/upload-photos', upload.array('photos', 10), photoController.uploadPhotos);
router.get('/photos', photoController.getAllPhotos);
router.post('/photo/:photoId/like', photoController.likePhoto);
router.post('/photo/:photoId/comment', photoController.addComment);
router.delete('/photo/:id', photoController.deletePhoto);

// Vote routes
router.post('/vote', voteController.submitVote);
router.get('/vote/:email', voteController.getVoteByEmail);
router.get('/vote-stats', voteController.getVoteStats);
router.get('/votes', voteController.getAllVotes);
router.get('/vote-history/:email', voteController.getVoteHistory);

// Stats routes
router.post('/record-visitor', statsController.recordVisitor);
router.get('/dashboard-stats', statsController.getDashboardStats);

// Contact and volunteer routes
router.post('/volunteer', (req, res) => {
  // Handle volunteer sign-ups
  const { name, email, phone, role } = req.body;
  
  // In a real application, you would save this to the database
  // and perhaps send notification emails
  
  console.log('Đã nhận đăng ký tình nguyện viên mới:', { name, email, phone, role });
  
  res.status(200).json({ 
    success: true, 
    message: 'Thông tin tình nguyện viên đã được nhận thành công' 
  });
});

router.post('/memorabilia', (req, res) => {
  // Handle memorabilia submissions
  const { name, email, description } = req.body;
  
  // In a real application, you would save this to the database
  // and perhaps send notification emails
  
  console.log('Thông tin kỷ vật đã nhận:', { name, email, description });
  
  res.status(200).json({ 
    success: true, 
    message: 'Thông tin kỷ vật đã được nhận thành công' 
  });
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Lỗi máy chủ',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

module.exports = router;