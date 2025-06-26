import express from 'express';
import { shareLocation } from '../controllers/locationController.js';
import verifyJwt from '../middleware/verifyJwt.js';

const router = express.Router();

router.post('/share', verifyJwt, shareLocation);

export default router; 