import express from 'express';
import { register, login, logout, profile, checkPassword } from '../controllers/auth.controller.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authMiddleware, profile);
router.post('/checkPassword', authMiddleware, checkPassword);

export default router;