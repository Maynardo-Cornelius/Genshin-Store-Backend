const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Wallet } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, role });

    if (role === 'player') {
      await Wallet.create({ user_id: user.user_id, balance: 0 });
    }

    res.status(201).json({ message: 'User registered', user_id: user.user_id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.googleCallback = (req, res) => {
  try {
    const user = req.user;

    if (!user) return res.status(401).json({ message: 'Auth failed' });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Return JSON untuk testing
    res.json({ token, role: user.role, user_id: user.user_id });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verifikasi dengan multiple audience
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_CLIENT_ID,         // Web Client ID
        process.env.GOOGLE_ANDROID_CLIENT_ID,  // Android Client ID
      ],
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const username = payload.name;

    let user = await User.findOne({ where: { email } });

    if (user && user.role === 'admin') {
      return res.status(403).json({ message: 'Admin must login with email and password' });
    }

    if (!user) {
      user = await User.create({
        username,
        email,
        password: 'OAUTH_USER',
        role: 'player',
      });
      await Wallet.create({ user_id: user.user_id, balance: 0 });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token, role: user.role, user_id: user.user_id });
  } catch (err) {
    console.error('Google Sign In error:', err.message);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};