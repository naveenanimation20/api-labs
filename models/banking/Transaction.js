// models/banking/Transaction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  transactionType: {
    type: DataTypes.ENUM('debit', 'credit', 'transfer'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  referenceNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending'
  },
  balanceAfter: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  toAccountId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'accounts',
      key: 'id'
    }
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  hooks: {
    beforeCreate: (transaction) => {
      // Generate reference number
      transaction.referenceNumber = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
  }
});

Transaction.associate = (models) => {
  Transaction.belongsTo(models.Account, {
    foreignKey: 'accountId',
    as: 'account'
  });
  Transaction.belongsTo(models.Account, {
    foreignKey: 'toAccountId',
    as: 'toAccount'
  });
};

module.exports = Transaction;