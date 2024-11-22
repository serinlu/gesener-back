import { createPreference } from '../controllers/payment.controller.js';
import express from 'express';
const router = express.Router();

router.post('/create-preference', createPreference);

export default router