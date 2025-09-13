import express from 'express';
import { registerUser, sendOtp, verifyOtp } from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register-user', registerUser);

export default router;