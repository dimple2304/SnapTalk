import express from 'express';
import { registerUser, sendOtp, userLogin, verifyOtp } from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerUser);
router.post('/login', userLogin);


export default router;