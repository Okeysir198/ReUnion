// API Routes for Reunion Website
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const registrationController = require('../controllers/registrationController');
const photoController = require('../controllers/photoController');

// Configure storage for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../frontend/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'photo-' + uniqueSuffix + ext);
  }
});

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Images Only!'));
    }
  }
});

// Registration routes
router.post('/register', registrationController.register);
router.get('/registrations', registrationController.getAllRegistrations);
router.get('/registration/:id', registrationController.getRegistrationById);
router.put('/registration/:id', registrationController.updateRegistration);
router.delete('/registration/:id', registrationController.deleteRegistration);

// Payment routes (these would connect to a payment gateway in production)
router.post('/payment', registrationController.processPayment);
router.get('/payment-status/:id', registrationController.getPaymentStatus);

// Photo upload routes
router.post('/upload-photos', upload.array('photos', 10), photoController.uploadPhotos);
router.get('/photos', photoController.getAllApprovedPhotos);
router.get('/photos/pending', photoController.getPendingPhotos);
router.put('/photo/:id/approve', photoController.approvePhoto);
router.delete('/photo/:id', photoController.deletePhoto);

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

// Stats routes (for displays like the career chart and map)
router.get('/stats/careers', (req, res) => {
  // In a real application, this would query the database
  // For demo purposes, returning hardcoded data
  
  const careerStats = {
    labels: ['Education', 'Healthcare', 'Technology', 'Business', 'Arts', 'Other'],
    data: [15, 20, 25, 18, 8, 14]
  };
  
  res.status(200).json(careerStats);
});

router.get('/stats/locations', (req, res) => {
  // In a real application, this would query the database
  // For demo purposes, returning hardcoded data
  
  const locationStats = [
    { name: "Sarah Johnson", location: [34.0522, -118.2437], city: "Los Angeles" },
    { name: "Mike Peterson", location: [40.7128, -74.0060], city: "New York" },
    { name: "Jessica Lee", location: [51.5074, -0.1278], city: "London" },
    { name: "David Smith", location: [35.6762, 139.6503], city: "Tokyo" },
    { name: "Lisa Wong", location: [-33.8688, 151.2093], city: "Sydney" }
  ];
  
  res.status(200).json(locationStats);
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