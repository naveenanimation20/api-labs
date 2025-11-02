// models/bookings/Room.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  hotelId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'hotels',
      key: 'id'
    }
  },
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  roomType: {
    type: DataTypes.ENUM('single', 'double', 'suite', 'deluxe'),
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'rooms',
  timestamps: true
});

Room.associate = (models) => {
  Room.belongsTo(models.Hotel, {
    foreignKey: 'hotelId',
    as: 'hotel'
  });
  Room.hasMany(models.Reservation, {
    foreignKey: 'roomId',
    as: 'reservations'
  });
};

module.exports = Room;