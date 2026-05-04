const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TransactionDetail = sequelize.define('TransactionDetail', {
    transaction_detail_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    transaction_id: { type: DataTypes.INTEGER, allowNull: false },
    weapon_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  }, { tableName: 'transaction_details', timestamps: false });

  return TransactionDetail;
};