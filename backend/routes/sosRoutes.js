const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');
const { triggerSOS, uploadSOSMedia, endSOS } = require('../controllers/sosController.js');
const upload = require('../middlewares/upload');

router.post('/sos/trigger', sosController.triggerSOS);
router.post('/sos/verify', sosController.verifyOTP);
router.post('/trigger', upload.fields([{ name: 'recording' }, { name: 'photo' }]), triggerSOS);
router.post('/:sosId/upload', upload.single('file'), uploadSOSMedia);
router.post('/:sosId/end', endSOS);

module.exports = router;
