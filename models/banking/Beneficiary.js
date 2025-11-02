// models/banking/Beneficiary.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Beneficiary = sequelize.define('Beneficiary', {
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
  beneficiaryName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ifscCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  swiftCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  relationship: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'beneficiaries',
  timestamps: true
});

Beneficiary.associate = (models) => {
  Beneficiary.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Beneficiary;