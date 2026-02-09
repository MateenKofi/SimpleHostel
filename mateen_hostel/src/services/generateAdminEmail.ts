export const generateAdminWelcomeEmail = (
  email: string,
  password: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Account Created</title>
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
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 0; text-align: center;">
           
            
         <!-- Content Header -->
            <div style="padding: 20px 32px 24px 32px;">
              <div style="font-size: 36px; margin-bottom: 8px;">🔐</div>
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Admin Account Created</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Welcome to the management system</p>
            </div>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <p style="font-size: 18px; color: #333; margin: 0 0 24px 0; line-height: 1.6;">
              Hello <strong style="color: #ff6b6b;">Administrator</strong>,
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Your admin account for Fuse has been successfully created. 
              You now have full administrative access to manage the system.
            </p>
            
            <!-- Credentials Section -->
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 24px; border-radius: 12px; margin: 24px 0;">
              <p style="color: white; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; text-align: center;">Your Login Credentials</p>
              
              <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <span style="color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500; min-width: 80px;">Email:</span>
                  <span style="color: white; font-family: 'Courier New', monospace; font-size: 16px; font-weight: 600;">${email}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500; min-width: 80px;">Password:</span>
                  <span style="color: white; font-family: 'Courier New', monospace; font-size: 16px; font-weight: 600; letter-spacing: 1px;">${password}</span>
                </div>
              </div>
              
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 13px; text-align: center;">
                💡 Please save these credentials in a secure location
              </p>
            </div>
            
            <!-- Security Notice -->
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <div style="display: flex; align-items: flex-start;">
                <span style="font-size: 20px; margin-right: 12px;">⚠</span>
                <div>
                  <p style="margin: 0 0 8px 0; color: #856404; font-weight: 600; font-size: 14px;">Security Reminder</p>
                  <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                    For security reasons, please <strong>change your password immediately</strong> after your first login. 
                    Use a strong, unique password that you don't use elsewhere.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div style="text-align: center; margin: 32px 0 24px 0;">
              <div style="display: inline-block; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 14px 28px; border-radius: 8px; text-decoration: none;">
                <span style="color: white; font-weight: 600; font-size: 16px;">🚀 Access Admin Panel</span>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 24px 32px; border-top: 1px solid #e9ecef;">
            <div style="background: #fee; border: 1px solid #fcc; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
              <p style="margin: 0; color: #c33; font-size: 13px; text-align: center;">
                <strong>⚠ Important:</strong> If you did not request this admin account, please contact the system administrator immediately.
              </p>
            </div>
            
            <div style="text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">
                Fuse - Admin Portal
              </p>
              <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                This is an automated security notification. Please do not reply to this email.
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
