// models/banking/Card.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Card = sequelize.define('Card', {
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
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  cardNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  cardType: {
    type: DataTypes.ENUM('debit', 'credit', 'prepaid'),
    allowNull: false
  },
  cardholderName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiryDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cvv: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'blocked', 'expired'),
    defaultValue: 'active'
  },
  cardLimit: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  availableLimit: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  tableName: 'cards',
  timestamps: true,
  hooks: {
    beforeCreate: (card) => {
      // Generate card number (simplified - not production ready)
      card.cardNumber = `4${Math.floor(Math.random() * 1000000000000000)}`.substring(0, 16);
      // Generate CVV
      card.cvv = Math.floor(Math.random() * 900 + 100).toString();
      // Set expiry date (3 years from now)
      const date = new Date();
      date.setFullYear(date.getFullYear() + 3);
      card.expiryDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear().toString().substring(2)}`;
    }
  }
});

Card.associate = (models) => {
  Card.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  Card.belongsTo(models.Account, {
    foreignKey: 'accountId',
    as: 'account'
  });
};

module.exports = Card;