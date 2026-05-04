const { Sequelize } = require('sequelize');
const config = require('../config/database');
require('dotenv').config();

const sequelize = new Sequelize(config.development);

const User = require('./User')(sequelize);
const Wallet = require('./Wallet')(sequelize);
const Weapon = require('./Weapon')(sequelize);
const Inventory = require('./Inventory')(sequelize);
const Transaction = require('./Transaction')(sequelize);
const TransactionDetail = require('./TransactionDetail')(sequelize);
const TransactionLog = require('./TransactionLog')(sequelize);

// Associations
User.hasOne(Wallet, { foreignKey: 'user_id' });
Wallet.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Inventory, { foreignKey: 'user_id' });
Inventory.belongsTo(User, { foreignKey: 'user_id' });
Weapon.hasMany(Inventory, { foreignKey: 'weapon_id' });
Inventory.belongsTo(Weapon, { foreignKey: 'weapon_id' });

User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

Transaction.hasMany(TransactionDetail, { foreignKey: 'transaction_id' });
TransactionDetail.belongsTo(Transaction, { foreignKey: 'transaction_id' });
Weapon.hasMany(TransactionDetail, { foreignKey: 'weapon_id' });
TransactionDetail.belongsTo(Weapon, { foreignKey: 'weapon_id' });

Transaction.hasOne(TransactionLog, { foreignKey: 'transaction_id' });
TransactionLog.belongsTo(Transaction, { foreignKey: 'transaction_id' });

module.exports = { sequelize, User, Wallet, Weapon, Inventory, Transaction, TransactionDetail, TransactionLog };