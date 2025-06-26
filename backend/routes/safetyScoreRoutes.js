import express from 'express';
import { getSafetyScore, updateSafetyScore } from '../controllers/safetyScoreController.js';
import verifyJwt from '../middleware/verifyJwt.js';

const router = express.Router();

router.get('/', verifyJwt, getSafetyScore);
router.post('/update', verifyJwt, updateSafetyScore);

export default router; 