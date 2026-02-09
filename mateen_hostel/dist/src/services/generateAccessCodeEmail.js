"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessCodeEmail = void 0;
const generateAccessCodeEmail = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Access Code - Check-In Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
      <div style="padding: 40px 20px;">
        <div style="
          max-width: 1200px;
          margin: 0 auto;
          background: #ffffff;
          overflow: hidden;
        ">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #20c997 0%, #12b886 100%); padding: 0; text-align: center;">
            <div style="padding: 20px 0 12px 0; background: rgba(255,255,255,0.1);">
              <div style="font-size: 24px; font-weight: 700; color: white; letter-spacing: 1px;">FUSE</div>
            </div>
            <div style="padding: 20px 32px 24px 32px;">
              <div style="font-size: 36px; margin-bottom: 8px;">🔑</div>
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Your Access Code</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Required for check-in verification</p>
            </div>
          </div>

          <!-- Content -->
          <div style="padding: 32px;">
            <p style="font-size: 18px; color: #333; margin: 0 0 24px 0; line-height: 1.6;">
              Hello <strong style="color: #20c997;">${data.residentName}</strong>,
            </p>

            <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Congratulations on your booking at <strong>${data.hostelName}</strong>! Your payment has been confirmed and your room has been allocated.
            </p>

            <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              When you arrive at the hostel for check-in, please present the following <strong>access code</strong> to the manager. This code verifies your identity and booking details.
            </p>

            <!-- Access Code Section -->
            <div style="background: linear-gradient(135deg, #20c997 0%, #12b886 100%); padding: 32px 24px; border-radius: 12px; margin: 32px 0; text-align: center;">
              <p style="color: white; margin: 0 0 16px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Your Verification Access Code
              </p>

              <div style="background: rgba(255,255,255,0.15); padding: 24px; border-radius: 8px; margin-bottom: 16px;">
                <div style="color: white; font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; letter-spacing: 4px; line-height: 1;">
                  ${data.accessCode}
                </div>
              </div>

              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 13px;">
                Keep this code secure. You'll need to show it at check-in.
              </p>
            </div>

            <!-- Booking Details -->
            <div style="background: #f8f9fa; padding: 24px; border-radius: 8px; margin: 24px 0;">
              <p style="margin: 0 0 16px 0; color: #495057; font-size: 16px; font-weight: 600;">Booking Details</p>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <p style="margin: 0 0 4px 0; color: #6c757d; font-size: 13px;">Hostel</p>
                  <p style="margin: 0; color: #212529; font-size: 15px; font-weight: 500;">${data.hostelName}</p>
                </div>
                <div>
                  <p style="margin: 0 0 4px 0; color: #6c757d; font-size: 13px;">Room Number</p>
                  <p style="margin: 0; color: #212529; font-size: 15px; font-weight: 500;">${data.roomNumber}</p>
                </div>
              </div>
            </div>

            <!-- Instructions -->
            <div style="background: #e7f5ff; border: 1px solid #74c0fc; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <div style="display: flex; align-items: flex-start;">
                <span style="font-size: 20px; margin-right: 12px;">📋</span>
                <div>
                  <p style="margin: 0 0 8px 0; color: #1864ab; font-weight: 600; font-size: 15px;">Check-In Instructions</p>
                  <ul style="margin: 0; padding-left: 20px; color: #1864ab; font-size: 14px; line-height: 1.6;">
                    <li style="margin-bottom: 8px;">Present this access code to the hostel manager upon arrival</li>
                    <li style="margin-bottom: 8px;">The manager will verify your booking using this code</li>
                    <li>After verification, you will be officially checked in to your room</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Security Notice -->
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <div style="display: flex; align-items: flex-start;">
                <span style="font-size: 20px; margin-right: 12px;">🔒</span>
                <div>
                  <p style="margin: 0 0 8px 0; color: #856404; font-weight: 600; font-size: 14px;">Security Notice</p>
                  <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                    This access code is unique to your booking. Please do not share it with others. If you did not make this booking, please contact us immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 24px 32px; border-top: 1px solid #e9ecef;">
            <div style="text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">
                ${data.hostelName}
              </p>
              <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                This is an automated message. Do not reply.
              </p>
            </div>
          </div>
        </div>

        <!-- Bottom spacing -->
        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #6c757d; font-size: 12px; margin: 0;">
            © 2024 Fuse. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.generateAccessCodeEmail = generateAccessCodeEmail;
