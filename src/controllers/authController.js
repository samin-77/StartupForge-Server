const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
  try {
    const { name, email, image, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters with one uppercase and one lowercase letter',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name, email, image: image || '', password: hashedPassword, role: role || 'collaborator',
    });

    const token = generateToken(user._id.toString(), user.role);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ _id: user._id, name: user.name, email: user.email, image: user.image, role: user.role, token });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.isBlocked) return res.status(403).json({ message: 'Account is blocked' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id.toString(), user.role);
    res.cookie('token', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ _id: user._id, name: user.name, email: user.email, image: user.image, role: user.role, token });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Login failed' });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: 'Google login failed' });

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(payload.sub + process.env.JWT_SECRET, 12);
      user = await User.create({
        name: payload.name || 'User', email: payload.email, image: payload.picture || '',
        password: hashedPassword, role: 'collaborator',
      });
    }
    if (user.isBlocked) return res.status(403).json({ message: 'Account is blocked' });

    const token = generateToken(user._id.toString(), user.role);
    res.cookie('token', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ _id: user._id, name: user.name, email: user.email, image: user.image, role: user.role, token });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Google login failed' });
  }
};

const logoutUser = async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, googleLogin, logoutUser, getMe };
