import express from 'express';
import { signup, login, verifyToken, getStats } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify', verifyToken);
router.get('/stats', getStats);

export default router;
