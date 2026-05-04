const { sequelize, Transaction, TransactionDetail, TransactionLog, Wallet, Inventory, Weapon, User } = require('../models');

exports.buyWeapon = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items } = req.body;
    const user_id = req.user.user_id;

    let total_price = 0;
    const details = [];

    for (const item of items) {
      const weapon = await Weapon.findByPk(item.weapon_id, { transaction: t });
      if (!weapon || weapon.stock < item.quantity)
        throw new Error(`Insufficient stock for ${weapon?.weapon_name}`);
      total_price += weapon.price * item.quantity;
      details.push({ weapon, quantity: item.quantity, price: weapon.price });
    }

    const wallet = await Wallet.findOne({ where: { user_id }, transaction: t });
    if (parseFloat(wallet.balance) < total_price)
      throw new Error('Insufficient balance');

    wallet.balance = parseFloat(wallet.balance) - total_price;
    await wallet.save({ transaction: t });

    const trx = await Transaction.create({ user_id, total_price }, { transaction: t });

    for (const d of details) {
      await TransactionDetail.create({
        transaction_id: trx.transaction_id,
        weapon_id: d.weapon.weapon_id,
        quantity: d.quantity,
        price: d.price,
      }, { transaction: t });

      d.weapon.stock -= d.quantity;
      await d.weapon.save({ transaction: t });

      const inv = await Inventory.findOne({
        where: { user_id, weapon_id: d.weapon.weapon_id },
        transaction: t
      });

      if (inv) {
        inv.quantity += d.quantity;
        await inv.save({ transaction: t });
      } else {
        await Inventory.create({
          user_id,
          weapon_id: d.weapon.weapon_id,
          quantity: d.quantity
        }, { transaction: t });
      }
    }

    await TransactionLog.create({
      transaction_id: trx.transaction_id,
      status: 'success',
      message: 'Purchase successful'
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'Purchase successful', transaction_id: trx.transaction_id });
  } catch (err) {
    await t.rollback();
    res.status(400).json({ message: err.message });
  }
};

exports.getTransactionLogs = async (req, res) => {
  const logs = await TransactionLog.findAll({
    include: [{
      model: Transaction,
      include: [
        { model: User, attributes: ['username', 'email'] },
        { model: TransactionDetail, include: [Weapon] }
      ]
    }],
    order: [['created_at', 'DESC']],
  });
  res.json(logs);
};