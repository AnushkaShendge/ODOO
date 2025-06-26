import express from 'express';
import { reportSnatch } from '../controllers/snatchController.js';
import verifyJwt from '../middleware/verifyJwt.js';

const router = express.Router();

router.post('/report', verifyJwt, reportSnatch);

export default router; 