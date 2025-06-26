import express from 'express';
import { triggerFakeCall } from '../controllers/fakeCallController.js';
import verifyJwt from '../middleware/verifyJwt.js';

const router = express.Router();

router.post('/trigger', verifyJwt, triggerFakeCall);

export default router; 