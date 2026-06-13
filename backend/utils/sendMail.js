import nodemailer from 'nodemailer';
import { EMAIL_ID, EMAIL_PASS } from "../config/envIndex.js";

export const sendMail = async ({ email, subject, html }) => {
    if (!email) throw new error("Missing email");
    if (!subject) throw new error("Missing subject");
    if (!html) throw new error("Missing email body");

    try {

        console.log("EMAIL_ID:", EMAIL_ID);
        console.log("EMAIL_PASS exists:", !!EMAIL_PASS);
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: EMAIL_ID,
                pass: EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"SnapTalk" <${EMAIL_ID}>`,
            to: email,
            subject,
            html
        });
        console.log(info);
        return {
            success: true,
            message: "OTP sent to your registered email id."
        };
    } catch (err) {
        console.log("Error occured", err);
        return { success: false, message: "Failed to send OTP" };
    }
}
