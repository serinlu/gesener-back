import express from 'express';
import { register, login, logout, profile, checkPassword, verifyEmail, checkToken } from '../controllers/auth.controller.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email/:token', verifyEmail)
router.get('/checkToken/:token', checkToken)
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authMiddleware, profile);
router.post('/checkPassword', authMiddleware, checkPassword);

export default router;