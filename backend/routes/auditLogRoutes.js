import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import verifyJwt from '../middleware/verifyJwt.js';

const router = express.Router();

router.get('/', verifyJwt, getAuditLogs);

export default router; 