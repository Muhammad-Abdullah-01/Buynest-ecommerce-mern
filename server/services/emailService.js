import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // Check if SMTP is configured, else log the email and return (mocking)
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('--- MOCK EMAIL SENT ---');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message:\n${options.message}`);
    console.log('-----------------------');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'E-Shop'} <${process.env.EMAIL_FROM_ADDRESS || 'noreply@eshop.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message
  };

  await transporter.sendMail(mailOptions);
};
