const express = require('express');
const { saveFakeCall , getFakeCalls , chatbotChat } = require('../controllers/UserController');
const router = express.Router();

router.post('/save',saveFakeCall);
router.get('/get', getFakeCalls);
router.post('/chat' , chatbotChat);

module.exports = router;