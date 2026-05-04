const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Weapon = sequelize.define('Weapon', {
    weapon_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    weapon_name: { type: DataTypes.STRING, allowNull: false },
    weapon_type: { type: DataTypes.ENUM('polearm', 'claymore', 'catalyst', 'sword', 'bow'), allowNull: false },
    description: { type: DataTypes.TEXT },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    image: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  }, { tableName: 'weapons', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

  return Weapon;
};