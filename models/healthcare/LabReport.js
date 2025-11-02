// models/healthcare/LabReport.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const LabReport = sequelize.define('LabReport', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'patients', key: 'id' }
  },
  reportType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  testName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  results: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  testDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'reviewed'),
    defaultValue: 'pending'
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'lab_reports',
  timestamps: true
});

LabReport.associate = (models) => {
  LabReport.belongsTo(models.Patient, { foreignKey: 'patientId', as: 'patient' });
};

module.exports = LabReport;