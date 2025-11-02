// ==================== models/healthcare/Bill.js ====================
const Bill = sequelize.define('Bill', {
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
  billNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'pending'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paidDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'bills',
  timestamps: true,
  hooks: {
    beforeCreate: (bill) => {
      bill.billNumber = `BILL${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
  }
});

Bill.associate = (models) => {
  Bill.belongsTo(models.Patient, { foreignKey: 'patientId', as: 'patient' });
};

module.exports = Bill;
