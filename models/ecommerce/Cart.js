// models/ecommerce/Cart.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  tableName: 'carts',
  timestamps: true
});

Cart.associate = (models) => {
  Cart.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  Cart.hasMany(models.CartItem, {
    foreignKey: 'cartId',
    as: 'items'
  });
};

module.exports = Cart;