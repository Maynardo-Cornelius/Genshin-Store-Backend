const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Wallet = sequelize.define('Wallet', {
    wallet_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    balance: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  }, { tableName: 'wallets', timestamps: false });

  return Wallet;
};