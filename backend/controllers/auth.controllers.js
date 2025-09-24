import express from 'express';
import { sendMail } from '../utils/sendMail.js';
import { generateOtpEmail } from '../utils/emailTemplate/otpTemplate.js';
import { Users } from '../models/user.models.js';
import { cache } from '../utils/cache.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import moment from 'moment-timezone';
import { tokenCreation } from '../utils/jwt_service.js';
import { BadRequestError, ConflictError, ForbiddenError, InternalServerError, UnauthorizedError } from '../utils/customErrorHandler/customError.js';


// otp sender
export const sendOtp = async (req, res, next) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const { email, year } = req.body;
        if (!email) throw new BadRequestError("Email missing!");

        const existed = await Users.findOne({ email });
        if (existed) {
            throw new ConflictError("Email is already in use.");
        }

        const currentYear = new Date().getFullYear();
        if (parseInt(year) > currentYear - 16) {
            throw new ForbiddenError("Age must be greater than 16.");
        }

        const cachedOtp = await cache.get(email);

        if (cachedOtp) {
            throw new BadRequestError("OTP has been sent already.");
        }

        await sendMail({ email: email, subject: "One Time Password Verification", html: generateOtpEmail(otp) })
        cache.set(email, otp);
        return res.status(200).json({ success: true, message: "OTP sent successfully to your registered email." })

    } catch (err) {
        // return res.status(500).json({ success: false, message: "Error sending OTP. Please try again." });
        next(err);
    }
}


// otp verification
export const verifyOtp = async (req, res, next) => {
    try {
        const { otp, email } = req.body;
        if (!otp) throw new BadRequestError("OTP missing");

        const cachedOtp = await cache.get(email);

        if (!cachedOtp || cachedOtp !== otp) throw new BadRequestError("Invalid OTP!");

        cache.del(email);

        return res.status(200).json({ success: true, message: "OTP verified successfully." });
    } catch (err) {
        next(err)
    }
}


// Save user details final
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, month, day, year, password } = req.body;
        if (!name || !email || !month || !day || !year || !password) {
            throw new BadRequestError("All fields are required!");
        }

        // const existingEmail = await Users.findOne({ email });
        // if (existingEmail) {
        //     return res.status(409).json({ success: false, message: "Email already in use." });
        // }

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
        if (!savedUser) throw new InternalServerError("Something went wrong!");

        const token = tokenCreation({ id: savedUser.id, email: savedUser.email, username: "" });
        console.log(token);
        res.cookie("token", token);

        return res.status(201).json({ success: true, redirectUrl: "/setting-username" });
    } catch (err) {
        next(err);
    }
}


// username
export const setUsername = async (req, res, next) => {
    try {
        const { username } = req.body;
        if (!username) throw new BadRequestError("Username is required!");

        const user = await getUserDetails(req.user.id);
        console.log(user);
        
        if(!user) throw new BadRequestError("User not found.");

        const existed = await Users.findOne({ username });
        if (existed) throw new ConflictError("This username is not available. Please choose a different one.");

        user.username = username;

        const updated = await user.save();
        if(!updated) throw new InternalServerError("Something went wrong!");

        const token = tokenCreation({ id: user.id, email: user.email, username: username });
        res.cookie("token", token);
        return res.status(200).json({ success: true, message: "Username set successfully.", redirectUrl: "/feed" });
    } catch (err) {
        next(err);
    }
}


// Login
export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new BadRequestError("All fields are required!");
        const user = await Users.findOne({ email });

        if (!user) {
            throw new UnauthorizedError("Either email or password is wrong!");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new UnauthorizedError("Either email or password is wrong!");
        }

        const token = tokenCreation({ id: user.id, email: user.email, username: user.username });
        res.cookie("token", token);
        return res.status(200).json({ success: true, message: "Login successful.", redirectUrl: "/feed" });
    } catch (err) {
        next(err);
    }
}


export const getUserDetails = async (_id) => {
    try {
        const user = await Users.findOne({ _id }).select('-password');
        if (!user) {
            return null;
        }

        return user;
    } catch (err) {
        throw new InternalServerError("Couldn't retrieve user details.")
    }
}