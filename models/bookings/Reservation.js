// ==================== models/bookings/Reservation.js ====================
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Reservation = sequelize.define('Reservation', {
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
  hotelId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'hotels', key: 'id' }
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'rooms', key: 'id' }
  },
  reservationNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  checkInDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  checkOutDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  numberOfGuests: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'),
    defaultValue: 'pending'
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'reservations',
  timestamps: true,
  hooks: {
    beforeCreate: (reservation) => {
      reservation.reservationNumber = `RES${Date.now()}${Math.floor(Math.random() * 10000)}`;
    }
  }
});

Reservation.associate = (models) => {
  Reservation.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Reservation.belongsTo(models.Hotel, { foreignKey: 'hotelId', as: 'hotel' });
  Reservation.belongsTo(models.Room, { foreignKey: 'roomId', as: 'room' });
};

module.exports = Reservation;