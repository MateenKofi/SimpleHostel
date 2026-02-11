"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmailConfiguration = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Send an email using nodemailer with Gmail service
 * Requires EMAIL_USER and EMAIL_PASS environment variables
 *
 * For Gmail, you need to use an App Password:
 * 1. Go to Google Account > Security > 2-Step Verification
 * 2. App Passwords > Generate > Enter name "Fuse Hostel"
 * 3. Copy the 16-character password and set as EMAIL_PASS
 */
const sendEmail = (email, subject, htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if email configuration is set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Email configuration missing. Please set EMAIL_USER and EMAIL_PASS environment variables.');
        console.error('   For Gmail: Generate an App Password at https://myaccount.google.com/apppasswords');
        return { success: false, error: 'Email configuration missing' };
    }
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: `"SimpleHostel" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: htmlContent,
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', {
            to: email,
            subject: subject,
            messageId: info.messageId,
        });
        return { success: true };
    }
    catch (error) {
        console.error('❌ Error sending email:', {
            to: email,
            subject: subject,
            error: error.message,
            code: error.code,
        });
        // Provide helpful error messages
        let errorMessage = 'Failed to send email';
        if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Check EMAIL_USER and EMAIL_PASS. Use a Gmail App Password.';
        }
        else if (error.code === 'ECONNECTION') {
            errorMessage = 'Could not connect to email server. Check your internet connection.';
        }
        return { success: false, error: errorMessage };
    }
});
exports.sendEmail = sendEmail;
/**
 * Test email configuration by sending a test email
 */
const testEmailConfiguration = (toEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const testEmail = toEmail || process.env.EMAIL_USER;
    if (!testEmail) {
        return { success: false, error: 'No email address provided' };
    }
    const testHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #20c997;">✅ Email Configuration Test Successful!</h2>
      <p>Your SimpleHostel email service is working correctly.</p>
      <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
    </div>
  `;
    return (0, exports.sendEmail)(testEmail, 'SimpleHostel Email Test', testHtml);
});
exports.testEmailConfiguration = testEmailConfiguration;
