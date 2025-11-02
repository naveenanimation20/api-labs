// ==================== models/healthcare/Patient.js ====================
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  patientNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  bloodType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  emergencyContact: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'patients',
  timestamps: true,
  hooks: {
    beforeCreate: (patient) => {
      patient.patientNumber = `PAT${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
  }
});

Patient.associate = (models) => {
  Patient.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Patient.hasMany(models.Appointment, { foreignKey: 'patientId', as: 'appointments' });
  Patient.hasMany(models.MedicalRecord, { foreignKey: 'patientId', as: 'medicalRecords' });
};

module.exports = Patient;