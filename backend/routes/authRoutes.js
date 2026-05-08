import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Debug middleware for auth routes
router.use((req, res, next) => {
  console.log(`AUTH ${req.method} ${req.path}`, req.body);
  next();
});

// Get the correct frontend URL (production or local)
const getFrontendURL = () => {
  // Priority: explicit FRONTEND_URL > FRONTEND_DOMAIN > localhost
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL;
  }
  if (process.env.FRONTEND_DOMAIN) {
    return `https://${process.env.FRONTEND_DOMAIN}`;
  }
  // Default to production URL if available, else localhost
  return process.env.NODE_ENV === 'production' 
    ? 'https://hostel-ease-sigma.vercel.app'
    : 'http://localhost:5173';
};

// Email transporter - Create it lazily to ensure env vars are loaded
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, collegeName, cityName, stateName, password } = req.body;

    if (!fullName || !email || !phone || !collegeName || !cityName || !stateName || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email or phone already exists' });
    }

    const user = new User({ fullName, email: email.toLowerCase(), phone, collegeName, cityName, stateName, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

    const userResponse = {
      _id: user._id, fullName: user.fullName, email: user.email,
      phone: user.phone, collegeName: user.collegeName,
      cityName: user.cityName, stateName: user.stateName,
      role: user.role, createdAt: user.createdAt
    };

    res.status(201).json({ success: true, message: 'User registered successfully', data: { user: userResponse, token } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ success: false, message: 'Email/Phone and password are required' });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone.toLowerCase() }, { phone: emailOrPhone }]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

    const userResponse = {
      _id: user._id, fullName: user.fullName, email: user.email,
      phone: user.phone, role: user.role, createdAt: user.createdAt
    };

    res.json({ success: true, message: 'Login successful', data: { user: userResponse, token } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ success: true, message: 'If this email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send email with proper frontend URL
    const frontendURL = getFrontendURL();
    const resetURL = `${frontendURL}/reset-password?token=${resetToken}`;
    
    console.log('Password reset link:', resetURL);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'HostelEase - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Hi ${user.fullName},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetURL}" 
             style="display: inline-block; background: #2563eb; color: white; 
                    padding: 12px 24px; border-radius: 6px; text-decoration: none;
                    font-weight: bold; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #666;">This link will expire in <strong>1 hour</strong>.</p>
          <p style="color: #666;">If you didn't request this, please ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">HostelEase Team</p>
        </div>
      `
    };

    await getTransporter().sendMail(mailOptions);

    res.json({ success: true, message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Error sending reset email' });
  }
});

// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Find user with valid token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully! You can now login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Error resetting password' });
  }
});

// @route   GET /api/auth/validate-reset-token/:token
// @desc    Validate if reset token is valid and not expired
router.get('/validate-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    res.json({ success: true, message: 'Token is valid' });
  } catch (error) {
    console.error('Validate reset token error:', error);
    res.status(500).json({ success: false, message: 'Error validating token' });
  }
});

// @route   GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/logout
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;