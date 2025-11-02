// ==================== models/bookings/HotelReview.js ====================
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const HotelReview = sequelize.define('HotelReview', {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cleanliness: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  service: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  location: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  value: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  }
}, {
  tableName: 'hotel_reviews',
  timestamps: true
});

HotelReview.associate = (models) => {
  HotelReview.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  HotelReview.belongsTo(models.Hotel, { foreignKey: 'hotelId', as: 'hotel' });
};

module.exports = HotelReview;
