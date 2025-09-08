export function generateOtpEmail(otp) {
    const logoUrl = "https://drive.google.com/uc?export=view&id=11eYY6s2bCwc-qFeILwZjcCELaRI7uNbP";
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your One-Time Passcode</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f7f6;">
    <!-- Main container table -->
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-collapse: collapse; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <!-- Header Section with Logo -->
        <tr>
            <td align="center" style="padding: 30px 0;">
                <!-- Your logo URL is dynamically inserted here -->
                <img src="${logoUrl}" alt="Company Logo" style="display: block; max-width: 250px; max-height: 120px;">
            </td>
        </tr>
        
        <!-- Main Content Section -->
        <tr>
            <td style="padding: 0 40px 40px 40px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                    
                    <!-- Heading -->
                    <tr>
                        <td align="center" style="color: #333333; font-size: 24px; font-weight: bold; padding-bottom: 20px;">
                            Verify Your Identity
                        </td>
                    </tr>
                    
                    <!-- Introductory Text -->
                    <tr>
                        <td align="center" style="color: #555555; font-size: 16px; line-height: 1.6; padding-bottom: 30px;">
                            Hi there! Please use the following passcode to complete your action. This code is essential for securing your account.
                        </td>
                    </tr>
                    
                    <!-- OTP Display Box -->
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <div style="background-color: #EAEAEA; border-radius: 8px; display: inline-block; padding: 15px 30px; font-size: 36px; font-weight: bold; letter-spacing: 6px; color: purple; border: 1px dashed #bde0ff;">
                                <!-- The OTP is dynamically inserted here -->
                                ${otp}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Expiration Information -->
                    <tr>
                        <td align="center" style="color: #888888; font-size: 14px; padding-bottom: 30px;">
                            This passcode will expire in <strong>5 minutes</strong>.
                        </td>
                    </tr>
                    
                    <!-- Security Warning -->
                    <tr>
                        <td align="center" style="color: #555555; font-size: 16px; line-height: 1.6;">
                            If you did not request this code, you can safely ignore this email. Someone may have entered your email address by mistake.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Footer Section -->
        <tr>
            <td align="center" style="padding: 20px 30px; background-color: #f9fafb; color: #999999; font-size: 12px; border-top: 1px solid #eeeeee;">
                <p style="margin: 0;">&copy; 2025 SnapTalk. All rights reserved.</p>
                <p style="margin: 5px 0 0;">Tech City Kurukshetra, Digitaland</p>
            </td>
        </tr>
        
    </table>
</body>
</html>
    `;
}