// models/banking/Loan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Loan = sequelize.define('Loan', {
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
  loanNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  loanType: {
    type: DataTypes.ENUM('personal', 'home', 'auto', 'education', 'business'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  termMonths: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  monthlyPayment: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  outstandingBalance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'active', 'paid', 'defaulted'),
    defaultValue: 'pending'
  },
  disbursementDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextPaymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'loans',
  timestamps: true,
  hooks: {
    beforeCreate: (loan) => {
      // Generate loan number
      loan.loanNumber = `LN${Date.now()}${Math.floor(Math.random() * 1000)}`;
      // Calculate monthly payment (simplified)
      const monthlyRate = loan.interestRate / 100 / 12;
      loan.monthlyPayment = (loan.amount * monthlyRate * Math.pow(1 + monthlyRate, loan.termMonths)) / 
                             (Math.pow(1 + monthlyRate, loan.termMonths) - 1);
      loan.outstandingBalance = loan.amount;
    }
  }
});

Loan.associate = (models) => {
  Loan.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Loan;