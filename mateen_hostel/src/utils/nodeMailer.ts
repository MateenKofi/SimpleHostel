import nodemailer from 'nodemailer';

export const sendEmail = async (
  email: string,
  subject: string,
  htmlContent: string
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Gmail email
      pass: process.env.EMAIL_PASS,  // Gmail App password or OAuth
    },
  });

  const mailOptions = {
    from: `"Hostel Management" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: htmlContent, // <-- styled HTML content goes here
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
