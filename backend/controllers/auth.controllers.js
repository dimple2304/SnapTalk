import express from 'express';
import { sendMail } from '../utils/sendMail.js';
import { generateOtpEmail } from '../utils/emailTemplate/otpTemplate.js';
import { Users } from '../models/user.models.js';
import { cache } from '../utils/cache.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import moment from 'moment-timezone';
import { tokenCreation } from '../utils/jwt_service.js';

export const otpStore = {};

// otp sender
export const sendOtp = async (req, res) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const { email, year } = req.body;
        if (!email) return res.status(400).json({ message: "Email missing" });

        const existed = await Users.findOne({ email });
        if (existed) {
            return res.status(409).json({ success: false, message: "Email already in use." })
        }
        if (year > 2009) {
            return res.status(400).json({ success: false, message: "Age must be greater than 16." })
        }

        const cachedOtp = await cache.get(email);

        if (cachedOtp) {
            return res.status(400).json({ success: false, message: "OTP already sent. Wait for 5 minutes before retry." });
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
    try {
        const { otp, email } = req.body;
        if (!otp) return res.status(400).json({ success: false, message: "OTP missing!" });

        const cachedOtp = await cache.get(email);

        if (!cachedOtp || cachedOtp !== otp) return res.status(409).json({ success: false, message: "Invalid OTP!" });

        return res.status(200).json({ success: true, message: "OTP verified successfully." });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Something went wrong. Please check your internet connection and try again." })
    }
}


// Save user details final
export const registerUser = async (req, res) => {
    try {
        const { name, email, month, day, year, password } = req.body;
        if (!name || !email || !month || !day || !year || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const existingEmail = await Users.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ success: false, message: "Email already in use." });
        }

        const dobInIst = moment.tz([parseInt(year), parseInt(month) - 1, parseInt(day)], "Asia/Kolkata");
        const dobInUtc = dobInIst.utc();

        console.log(dobInUtc);

        const isVerified = true;
        const isOnline = true;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({
            id: new mongoose.Types.ObjectId(),
            name,
            email,
            dob: dobInUtc,
            password: hashedPassword,
            isVerified: isVerified,
            isOnline: isOnline,

        })

        const savedUser = await newUser.save();
        if (!savedUser) return res.status(500).json({ success: false, message: "Something went wrong!" });

        const token = tokenCreation(savedUser.id, savedUser.email);
        console.log(token);
        res.cookie("token", token);

        return res.status(201).json({ success: true, redirectUrl: "/homepage" });
    } catch (err) {
        console.log(err);

        return res.status(500).json({ success: false, message: "Something went wrong. Please check your internet connection and try again." })
    }
}

