const express = require('express');
const { saveFakeCall , getFakeCalls , chatbotChat } = require('../controllers/UserController');
const router = express.Router();

router.post('/save/:id',saveFakeCall);
router.get('/get/:id', getFakeCalls);
router.post('/chat' , chatbotChat);

module.exports = router;