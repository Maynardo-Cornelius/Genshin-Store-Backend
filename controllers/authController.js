const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Wallet } = require('../models');

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

    console.log('User di callback:', user); // debug

    if (!user) return res.status(401).json({ message: 'Auth failed' });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Return JSON untuk testing
    res.json({ token, role: user.role, user_id: user.user_id });

  } catch (err) {
    console.log('Callback error:', err.message);
    res.status(500).json({ message: err.message });
  }
};