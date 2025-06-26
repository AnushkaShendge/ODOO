import express from 'express';
import { createContact, getContacts, updateContact, deleteContact } from '../controllers/emergencyContactController.js';
import verifyJwt from '../middleware/verifyJwt.js';

const router = express.Router();

router.post('/', verifyJwt, createContact);
router.get('/', verifyJwt, getContacts);
router.patch('/:id', verifyJwt, updateContact);
router.delete('/:id', verifyJwt, deleteContact);

export default router; 