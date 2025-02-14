const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const { requireUser } = require('./middleware/auth');
const UserService = require('../services/user');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: req.t('invalidCredentials') });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({ message: req.t('invalidCredentials') });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: req.t('internalServerError') });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Registration attempt for email:', email);

    const existingUser = await User.findOne({ email });
    console.log('Existing user check result:', existingUser);

    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ message: req.t('emailAlreadyRegistered') });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword
    });
    console.log('New user created:', user);

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    console.log('Registration successful for email:', email);
    res.json({ accessToken });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: req.t('internalServerError') });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: req.t('refreshTokenRequired') });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: req.t('userNotFound') });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ message: req.t('invalidRefreshToken') });
  }
});

router.get('/profile', requireUser, async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.user.id);
    const user = await UserService.get(req.user.id);

    if (!user) {
      console.log('User not found for profile request');
      return res.status(404).json({ message: req.t('userNotFound') });
    }

    console.log('Profile retrieved successfully for user:', user.email);
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: req.t('internalServerError') });
  }
});

router.put('/profile', requireUser, async (req, res) => {
  try {
    console.log('Profile update attempt for user:', req.user.userId);
    const { name, email } = req.body;
    const userId = req.user.userId;

    if (!name && !email) {
      console.log('No update data provided');
      return res.status(400).json({ error: req.t('noUpdateDataProvided') });
    }

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        console.log('Email already in use:', email);
        return res.status(400).json({ error: req.t('emailAlreadyInUse') });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log('User not found for update');
      return res.status(404).json({ error: req.t('userNotFound') });
    }

    console.log('Profile updated successfully for user:', updatedUser.email);
    res.json({
      email: updatedUser.email,
      name: updatedUser.name,
      createdAt: updatedUser.createdAt
    });
  } catch (error) {
    console.error('Error updating user profile:', error.stack);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;