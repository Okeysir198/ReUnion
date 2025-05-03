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
router.get('/photos', photoController.getAllApprovedPhotos);
router.get('/photos/pending', photoController.getPendingPhotos);
router.put('/photo/:id/approve', photoController.approvePhoto);
router.delete('/photo/:id', photoController.deletePhoto);

// Vote routes
router.post('/vote', voteController.submitVote);
router.get('/vote/:email', voteController.getVoteByEmail);
router.get('/vote-stats', voteController.getVoteStats);
router.get('/votes', voteController.getAllVotes);

// Stats routes
router.post('/record-visitor', statsController.recordVisitor);
router.get('/dashboard-stats', statsController.getDashboardStats);

// Contact and volunteer routes
router.post('/volunteer', (req, res) => {
  // Handle volunteer sign-ups
  const { name, email, phone, role } = req.body;
  
  // In a real application, you would save this to the database
  // and perhaps send notification emails
  
  console.log('New volunteer:', { name, email, phone, role });
  
  res.status(200).json({ 
    success: true, 
    message: 'Volunteer information received successfully' 
  });
});

router.post('/memorabilia', (req, res) => {
  // Handle memorabilia submissions
  const { name, email, description } = req.body;
  
  // In a real application, you would save this to the database
  // and perhaps send notification emails
  
  console.log('Memorabilia submission:', { name, email, description });
  
  res.status(200).json({ 
    success: true, 
    message: 'Memorabilia information received successfully' 
  });
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

module.exports = router;