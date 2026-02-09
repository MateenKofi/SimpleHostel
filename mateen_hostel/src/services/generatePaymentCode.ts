export const generateCodeEmail = (name: string, code?: string): string => {
  const accessCodeSection = code
    ? `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
        <p style="color: white; margin: 0 0 12px 0; font-size: 16px; font-weight: 500;">Your Access Code</p>
        <div style="
          font-size: 32px; 
          font-weight: bold; 
          color: white; 
          letter-spacing: 4px; 
          font-family: 'Courier New', monospace;
          background: rgba(255,255,255,0.1);
          padding: 16px 24px;
          border-radius: 8px;
          border: 2px dashed rgba(255,255,255,0.3);
        ">${code}</div>
        <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 14px;">Keep this code safe - you'll need it for facility access</p>
      </div>
    `
    : `
      <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
        <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
        <p style="color: white; margin: 0; font-size: 18px; font-weight: 500;">Payment Successfully Added</p>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Your account balance has been updated</p>
      </div>
    `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
      <div style="padding: 40px 20px;">
        <div style="
          min-width: 600px; 
          max-width: 1200px;
          margin: 0 auto; 
          background: #ffffff; 
          overflow: hidden;
        ">
          <!-- Header -->
            
            <!-- Content Header -->
            <div style="padding: 20px 32px 24px 32px;">
              <div style="font-size: 36px; margin-bottom: 8px;">🎉</div>
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Payment Confirmed!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Thank you for your payment</p>
            </div>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <p style="font-size: 18px; color: #333; margin: 0 0 24px 0; line-height: 1.6;">
              Hi <strong style="color: #667eea;">${name}</strong>,
            </p>
            
            ${accessCodeSection}
            
            <!-- Info Section -->
            <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 24px 0;">
              <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.5;">
                <strong>Need Help?</strong><br>
                If you have any questions about your ${
                  code ? "access code" : "account balance"
                } or need assistance, 
                please don't hesitate to contact our Fuse support team.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 24px 32px; border-top: 1px solid #e9ecef;">
            <div style="text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">
                Fuse
              </p>
              <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                This is an automated message. Please do not reply to this email.
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
