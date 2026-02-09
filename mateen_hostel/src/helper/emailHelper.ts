import { sendEmail } from "../utils/nodeMailer";
import { generateAccessCodeEmail } from "../services/generateAccessCodeEmail";

export const sendAccessCodeEmail = async (
    email: string,
    data: {
        residentName: string;
        accessCode: string;
        roomNumber: string;
        hostelName: string;
    }
) => {
    const subject = `Your Access Code - Check-In Verification - ${data.hostelName}`;
    const htmlContent = generateAccessCodeEmail(data);
    await sendEmail(email, subject, htmlContent);
};

export const sendBookingSuccessEmail = async (
    email: string,
    data: {
        residentName: string;
        studentId: string;
        hostelName: string;
        roomNumber: string;
        amountPaid: number;
        balanceOwed: number;
        reference: string;
        checkInDate: string;
    }
) => {
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

    await sendEmail(email, subject, htmlContent);
};

export const sendTopUpSuccessEmail = async (
    email: string,
    data: {
        residentName: string;
        amountPaid: number;
        balanceOwed: number;
        reference: string;
        hostelName: string;
    }
) => {
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

    await sendEmail(email, subject, htmlContent);
};
