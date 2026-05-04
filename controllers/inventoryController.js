const { Inventory, Weapon } = require('../models');

exports.getInventory = async (req, res) => {
  const items = await Inventory.findAll({
    where: { user_id: req.user.user_id },
    include: [{ model: Weapon }],
  });
  res.json(items);
};