import express from 'express';
import { sendMail } from '../utils/sendMail.js';
import { generateOtpEmail } from '../utils/emailTemplate/otpTemplate.js';
import { Users } from '../models/user.models.js';
import { cache } from '../utils/cache.js';

export const otpStore = {};

// otp sender
export const sendOtp = async (req, res) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const { email } = req.body;
        if (!email) return res.status(400).json({ message:"Email missing" });

        const existed = await Users.findOne({email});
        if(existed){
            return res.status(409).json({success:false, message:"Email already in use."})
        }

        await sendMail({ email: email, subject: "One Time Password Verification", html: generateOtpEmail(otp) })
        cache.set(email, otp);
        console.log("Otp sent");
        return res.status(200).json({ success: true, message: "OTP sent successfully to your registered email." })
        
    } catch (err) {
        return res.status(500).json({ success: false, message: "Error sending OTP. Please try again." });
    }
}


// otp verification
export const verifyOtp = async (req, res) => {
    try{
        const {otp, email} = req.body;
        if(!otp) return res.status(400).json({success:false, message:"OTP missing!"});

        const cachedOtp = await cache.get(email);
        console.log(cachedOtp);
        
        console.log(typeof cachedOtp);
        
        if(!cachedOtp || cachedOtp !== otp) return res.status(409).json({success:false, message:"Invalid OTP!"});
        
        return res.status(200).json({success:true, message:"OTP verified successfully."});
    }catch(err){
        return res.status(500).json({success:false, message:"Something went wrong. PLease check your internet connection and try again."})
    }
}
