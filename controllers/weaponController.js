const { Weapon } = require('../models');

exports.getAllWeapons = async (req, res) => {
  const weapons = await Weapon.findAll();
  res.json(weapons);
};

exports.getWeaponById = async (req, res) => {
  const weapon = await Weapon.findByPk(req.params.id);
  if (!weapon) return res.status(404).json({ message: 'Weapon not found' });
  res.json(weapon);
};

exports.createWeapon = async (req, res) => {
  try {
    const { weapon_name, weapon_type, description, stock, price } = req.body;
    const image = req.file ? req.file.filename : null;
    const weapon = await Weapon.create({ weapon_name, weapon_type, description, stock, price, image });
    res.status(201).json(weapon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateWeapon = async (req, res) => {
  try {
    const weapon = await Weapon.findByPk(req.params.id);
    if (!weapon) return res.status(404).json({ message: 'Weapon not found' });
    const image = req.file ? req.file.filename : weapon.image;
    await weapon.update({ ...req.body, image });
    res.json(weapon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteWeapon = async (req, res) => {
  const weapon = await Weapon.findByPk(req.params.id);
  if (!weapon) return res.status(404).json({ message: 'Weapon not found' });
  await weapon.destroy();
  res.json({ message: 'Weapon deleted' });
};