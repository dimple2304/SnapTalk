import nodemailer from "nodemailer";
import { EMAIL_ID, EMAIL_PASS } from "../config/envIndex.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_ID,
        pass: EMAIL_PASS
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000
});

transporter.verify((err, success) => {
    if (err) {
        console.error("Verify Error:", err);
    } else {
        console.log("SMTP Ready");
    }
});

export const sendMail = async ({ email, subject, html }) => {
    if (!email) throw new Error("Missing email");
    if (!subject) throw new Error("Missing subject");
    if (!html) throw new Error("Missing email body");
    try {
        const info = await transporter.sendMail({
            from: `"SnapTalk" <${EMAIL_ID}>`,
            to: email,
            subject,
            html
        });
        console.log("Email sent:", info.messageId);
        return {
            success: true,
            message: "OTP sent successfully"
        };

    } catch (err) {
        console.error("Email Error:", err);
        return {
            success: false,
            message: "Failed to send OTP"
        };
    }
};