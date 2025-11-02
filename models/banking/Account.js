// models/banking/Account.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Account = sequelize.define('Account', {
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
  accountNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  accountType: {
    type: DataTypes.ENUM('savings', 'checking', 'credit'),
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  status: {
    type: DataTypes.ENUM('active', 'frozen', 'closed'),
    defaultValue: 'active'
  },
  overdraftLimit: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  tableName: 'accounts',
  timestamps: true,
  hooks: {
    beforeCreate: (account) => {
      // Generate account number
      account.accountNumber = `${account.accountType.substring(0, 2).toUpperCase()}${Date.now()}${Math.floor(Math.random() * 10000)}`;
    }
  }
});

Account.associate = (models) => {
  Account.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  Account.hasMany(models.Transaction, {
    foreignKey: 'accountId',
    as: 'transactions'
  });
  Account.hasMany(models.Card, {
    foreignKey: 'accountId',
    as: 'cards'
  });
};

module.exports = Account;