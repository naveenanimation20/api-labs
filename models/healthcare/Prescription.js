// models/healthcare/Prescription.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Prescription = sequelize.define('Prescription', {
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
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'doctors', key: 'id' }
  },
  medications: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  dosage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'prescriptions',
  timestamps: true
});

Prescription.associate = (models) => {
  Prescription.belongsTo(models.Patient, { foreignKey: 'patientId', as: 'patient' });
  Prescription.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
};

module.exports = Prescription;