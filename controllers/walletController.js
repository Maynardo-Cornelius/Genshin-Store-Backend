const { Wallet } = require('../models');

exports.getWallet = async (req, res) => {
  const wallet = await Wallet.findOne({ where: { user_id: req.user.user_id } });
  if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
  res.json(wallet);
};

exports.topUp = async (req, res) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ where: { user_id: req.user.user_id } });
    wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
    await wallet.save();
    res.json({ message: 'Top up success', balance: wallet.balance });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};