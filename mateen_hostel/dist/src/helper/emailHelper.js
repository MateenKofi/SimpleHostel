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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTopUpSuccessEmail = exports.sendBookingSuccessEmail = exports.sendAccessCodeEmail = void 0;
const nodeMailer_1 = require("../utils/nodeMailer");
const generateAccessCodeEmail_1 = require("../services/generateAccessCodeEmail");
const sendAccessCodeEmail = (email, data) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = `Your Access Code - Check-In Verification - ${data.hostelName}`;
    const htmlContent = (0, generateAccessCodeEmail_1.generateAccessCodeEmail)(data);
    yield (0, nodeMailer_1.sendEmail)(email, subject, htmlContent);
});
exports.sendAccessCodeEmail = sendAccessCodeEmail;
const sendBookingSuccessEmail = (email, data) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = `Booking Confirmation & Allocation Letter - ${data.hostelName}`;
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Congratulations, ${data.residentName}!</h2>
      <p>Your booking at <strong>${data.hostelName}</strong> has been confirmed successfully.</p>
      
      <hr />
      
      <h3 style="color: #2980b9;">1. Payment Receipt Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Transaction Ref:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.reference}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Amount Paid:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">GHS ${data.amountPaid.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Balance Owed:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">GHS ${data.balanceOwed.toFixed(2)}</td>
        </tr>
      </table>

      <h3 style="color: #2980b9;">2. Allocation Details</h3>
      <p>
        <strong>Room Number:</strong> ${data.roomNumber}<br />
        <strong>Predicted Check-in:</strong> ${new Date(data.checkInDate).toLocaleDateString()}
      </p>

      <div style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #2980b9; margin-top: 20px;">
        <h4 style="margin-top: 0;">Official Allocation Letter Notice</h4>
        <p>This email serves as your digital proof of allocation. You can download a comprehensive PDF version of your Allocation Letter and Full Receipt from your resident portal at any time.</p>
      </div>

      <p style="margin-top: 20px;">We look forward to welcoming you to the hostel!</p>
      
      <p style="font-size: 0.9em; color: #7f8c8d;">
        Best Regards,<br />
        The Management,<br />
        ${data.hostelName}
      </p>
    </div>
  `;
    yield (0, nodeMailer_1.sendEmail)(email, subject, htmlContent);
});
exports.sendBookingSuccessEmail = sendBookingSuccessEmail;
const sendTopUpSuccessEmail = (email, data) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = `Payment Confirmation - ${data.hostelName}`;
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Payment Received, ${data.residentName}</h2>
      <p>We have successfully received your top-up payment for <strong>${data.hostelName}</strong>.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Transaction Ref:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.reference}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Partial Payment Amount:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">GHS ${data.amountPaid.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Remaining Balance:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">GHS ${data.balanceOwed.toFixed(2)}</td>
        </tr>
      </table>

      <p style="margin-top: 20px;">Thank you for your prompt payment.</p>
      
      <p style="font-size: 0.9em; color: #7f8c8d;">
        Best Regards,<br />
        The Management,<br />
        ${data.hostelName}
      </p>
    </div>
  `;
    yield (0, nodeMailer_1.sendEmail)(email, subject, htmlContent);
});
exports.sendTopUpSuccessEmail = sendTopUpSuccessEmail;
