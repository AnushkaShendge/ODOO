const express = require('express');
const router = express.Router();
const safetyScoreController = require('../controllers/safetyScoreController');

// Get user's safety score
router.get('/:userId', safetyScoreController.getSafetyScore);

// Update user's safety score
router.post('/:userId', safetyScoreController.updateSafetyScore);

// Reset user's safety score
router.post('/:userId/reset', safetyScoreController.resetSafetyScore);

module.exports = router; 