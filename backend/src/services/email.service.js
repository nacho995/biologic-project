import nodemailer from 'nodemailer';

// Email service will only work if EMAIL_USER and EMAIL_PASS are configured
let transporter = null;

const initializeEmailService = async () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email service not configured (EMAIL_USER or EMAIL_PASS missing)');
      return;
    }

    // Debug: Check what nodemailer exports
    console.log('📧 Nodemailer type:', typeof nodemailer);
    console.log('📧 Nodemailer.createTransport type:', typeof nodemailer.createTransport);
    
    // Correct method name is createTransport (not createTransporter)
    if (typeof nodemailer.createTransport !== 'function') {
      console.error('❌ nodemailer.createTransport is not a function');
      return;
    }

    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Verify connection (non-blocking)
    transporter.verify((error) => {
      if (error) {
        console.error('❌ Email service verification failed:', error.message);
      } else {
        console.log('✅ Email service configured and verified');
      }
    });
  } catch (error) {
    console.error('❌ Error initializing email service:', error.message);
    console.error('Full error:', error);
    transporter = null;
  }
};

// Initialize email service
initializeEmailService();

export const sendVerificationEmail = async (email, token, name) => {
  if (!transporter) {
    console.warn('⚠️ Email service not configured, skipping verification email to:', email);
    return;
  }

  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:80'}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Biologic Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Welcome to Biologic Platform!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 24 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendPasswordResetEmail = async (email, token, name) => {
  if (!transporter) {
    console.warn('⚠️ Email service not configured, skipping password reset email to:', email);
    return;
  }

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:80'}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Biologic Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export const sendWelcomeEmail = async (email, name) => {
  if (!transporter) {
    console.warn('⚠️ Email service not configured, skipping welcome email to:', email);
    return;
  }

  const mailOptions = {
    from: `"Biologic Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Biologic Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Welcome to Biologic Platform!</h2>
        <p>Hi ${name},</p>
        <p>Your email has been verified successfully. You can now access all features of the platform.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:80'}" 
             style="background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        <p>Happy analyzing!</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
};

