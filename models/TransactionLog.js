const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TransactionLog = sequelize.define('TransactionLog', {
    transaction_log_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    transaction_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('success', 'failed'), allowNull: false },
    message: { type: DataTypes.TEXT },
  }, { tableName: 'transaction_logs', timestamps: true, createdAt: 'created_at', updatedAt: false });

  return TransactionLog;
};