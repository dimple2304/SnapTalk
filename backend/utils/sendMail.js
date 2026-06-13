import { Resend } from "resend";
import { RESEND_API_KEY } from "../config/envIndex.js";

const resend = new Resend(RESEND_API_KEY);

export const sendMail = async ({ email, subject, html }) => {
    if (!email) throw new error("Missing email");
    if (!subject) throw new error("Missing subject");
    if (!html) throw new error("Missing email body");
    try {
        const response = await resend.emails.send({
            from: "SnapTalk <onboarding@resend.dev>",
            to: email,
            subject,
            html
        });

        console.log(response);

        return {
            success: true,
            message: "OTP sent successfully"
        };

    } catch (err) {
        console.error(err);

        return {
            success: false,
            message: "Failed to send OTP"
        };
    }
};