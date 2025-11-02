// ==================== models/bookings/Amenity.js ====================
const Amenity = sequelize.define('Amenity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('room', 'hotel', 'general'),
    defaultValue: 'general'
  }
}, {
  tableName: 'amenities',
  timestamps: true
});

module.exports = Amenity;