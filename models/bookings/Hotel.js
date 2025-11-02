// ==================== models/bookings/Hotel.js ====================
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Hotel = sequelize.define('Hotel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: { min: 0, max: 5 }
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  tableName: 'hotels',
  timestamps: true
});

Hotel.associate = (models) => {
  Hotel.hasMany(models.Room, { foreignKey: 'hotelId', as: 'rooms' });
  Hotel.hasMany(models.HotelReview, { foreignKey: 'hotelId', as: 'reviews' });
};

module.exports = Hotel;

// ==================== models/bookings/Room.js ====================
const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  hotelId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'hotels', key: 'id' }
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
  Room.belongsTo(models.Hotel, { foreignKey: 'hotelId', as: 'hotel' });
  Room.hasMany(models.Reservation, { foreignKey: 'roomId', as: 'reservations' });
};

module.exports = Room;