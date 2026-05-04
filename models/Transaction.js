const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    transaction_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    total_price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  }, { tableName: 'transactions', timestamps: true, createdAt: 'created_at', updatedAt: false });

  return Transaction;
};