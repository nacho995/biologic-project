import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import models from '../models/index.js';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../services/email.service.js';

const { User } = models;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required' 
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Check if email service is configured
    const emailServiceConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

    // Generate verification token only if email service is configured
    const verificationToken = emailServiceConfigured ? crypto.randomBytes(32).toString('hex') : null;
    const verificationTokenExpires = emailServiceConfigured ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

    const user = await User.create({
      email,
      password,
      name,
      role: 'viewer',
      emailVerified: !emailServiceConfigured, // Auto-verify if email service not configured
      verificationToken,
      verificationTokenExpires,
    });

    // Send verification email only if service is configured
    if (emailServiceConfigured) {
      try {
        await sendVerificationEmail(email, verificationToken, name);
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
      }
    }

    const token = generateToken(user);

    res.status(201).json({
      message: emailServiceConfigured 
        ? 'Registration successful! Please check your email to verify your account.'
        : 'Registration successful! You can now log in.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      details: error.message 
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    console.log('📧 Email verification attempt');
    console.log('Token received:', token ? `${token.substring(0, 10)}...` : 'NO TOKEN');

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const user = await User.findOne({
      where: {
        verificationToken: token,
      },
    });

    console.log('User found:', user ? `${user.email} (expires: ${user.verificationTokenExpires})` : 'NO USER FOUND');
    console.log('Current time:', new Date().toISOString());

    if (!user) {
      console.log('❌ Invalid token - no user found with this token');
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
      console.log('❌ Token expired');
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    console.log('✅ Token valid, verifying email');
    user.emailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    console.log('✅ Email verified successfully for:', user.email);

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
    }

    const jwtToken = generateToken(user);

    res.json({
      message: 'Email verified successfully!',
      token: jwtToken,
      user,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      error: 'Email verification failed',
      details: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        error: 'Account is deactivated' 
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Check if email service is configured
    const emailServiceConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

    // Only require email verification if email service is configured
    if (emailServiceConfigured && !user.emailVerified) {
      return res.status(403).json({ 
        error: 'Please verify your email before logging in',
        emailVerified: false,
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      details: error.message 
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    
    console.log('🔑 Reset token generated for:', email);
    console.log('⏰ Token expires at:', resetExpires.toISOString());

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      return res.status(500).json({ error: 'Failed to send password reset email' });
    }

    res.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      error: 'Password reset request failed',
      details: error.message 
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    console.log('🔑 Reset password attempt');
    console.log('Token received:', token ? `${token.substring(0, 10)}...` : 'NO TOKEN');
    console.log('Password length:', password ? password.length : 'NO PASSWORD');

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
      },
    });

    console.log('User found:', user ? `${user.email} (expires: ${user.resetPasswordExpires})` : 'NO USER FOUND');
    console.log('Current time:', new Date().toISOString());

    if (!user) {
      console.log('❌ Invalid token - no user found with this token');
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (user.resetPasswordExpires < new Date()) {
      console.log('❌ Token expired');
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    console.log('✅ Token valid, updating password');
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log('✅ Password reset successful for:', user.email);

    res.json({
      message: 'Password reset successful! You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      error: 'Password reset failed',
      details: error.message 
    });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken, user.name);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({
      message: 'Verification email sent! Please check your inbox.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ 
      error: 'Failed to resend verification email',
      details: error.message 
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Failed to get user',
      details: error.message 
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const users = await User.findAll({
      order: [['created_at', 'DESC']],
    });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      error: 'Failed to get users',
      details: error.message 
    });
  }
};
