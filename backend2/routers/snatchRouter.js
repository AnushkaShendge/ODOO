const express = require('express');
const router = express.Router();
const snatchController = require('../controllers/snatchController');

// Start a snatch detection event
router.post('/start', snatchController.startSnatchEvent);

// Resolve a snatch event
router.post('/resolve/:eventId', snatchController.resolveSnatchEvent);

// Predict safe route (stub)
router.post('/predict-route', snatchController.predictSafeRoute);

// Send SMS fallback (stub)
router.post('/send-fallback-sms', snatchController.sendFallbackSMS);

// Find nearest police station (stub)
router.get('/nearest-police', snatchController.findNearestPoliceStation);

module.exports = router; 