// ==================== models/healthcare/Doctor.js ====================
const Doctor = sequelize.define('Doctor', {
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
  licenseNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  consultationFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  availability: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'doctors',
  timestamps: true
});

Doctor.associate = (models) => {
  Doctor.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Doctor.hasMany(models.Appointment, { foreignKey: 'doctorId', as: 'appointments' });
};

module.exports = Doctor;