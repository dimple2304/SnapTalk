import express from 'express';
import { registerUser, sendOtp, userLogin, verifyOtp, setUsername } from '../controllers/auth.controllers.js';
import { verifyToken } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/send-otp',sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerUser);
router.post('/login', userLogin);
router.patch('/setting-username', setUsername);


export default router;