// models/index.js
const sequelize = require('../config/database');

// Import User model
const User = require('./User');

// Import E-commerce models
const Product = require('./ecommerce/Product');
const Category = require('./ecommerce/Category');
const Cart = require('./ecommerce/Cart');
const CartItem = require('./ecommerce/CartItem');
const Order = require('./ecommerce/Order');
const OrderItem = require('./ecommerce/OrderItem');
const Review = require('./ecommerce/Review');
const Wishlist = require('./ecommerce/Wishlist');

// Import Banking models
const Account = require('./banking/Account');
const Transaction = require('./banking/Transaction');
const Card = require('./banking/Card');
const Loan = require('./banking/Loan');
const Beneficiary = require('./banking/Beneficiary');

// Import Healthcare models
const Patient = require('./healthcare/Patient');
const Doctor = require('./healthcare/Doctor');
const Appointment = require('./healthcare/Appointment');
const Prescription = require('./healthcare/Prescription');
const MedicalRecord = require('./healthcare/MedicalRecord');
const LabReport = require('./healthcare/LabReport');
const Bill = require('./healthcare/Bill');

// Import Social models
const Post = require('./social/Post');
const Comment = require('./social/Comment');
const Like = require('./social/Like');
const Follower = require('./social/Follower');
const Message = require('./social/Message');
const Notification = require('./social/Notification');

// Import Bookings models
const Hotel = require('./bookings/Hotel');
const Room = require('./bookings/Room');
const Reservation = require('./bookings/Reservation');
const HotelReview = require('./bookings/HotelReview');
const Amenity = require('./bookings/Amenity');

// Store all models in an object
const models = {
  User,
  // E-commerce
  Product,
  Category,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Review,
  Wishlist,
  // Banking
  Account,
  Transaction,
  Card,
  Loan,
  Beneficiary,
  // Healthcare
  Patient,
  Doctor,
  Appointment,
  Prescription,
  MedicalRecord,
  LabReport,
  Bill,
  // Social
  Post,
  Comment,
  Like,
  Follower,
  Message,
  Notification,
  // Bookings
  Hotel,
  Room,
  Reservation,
  HotelReview,
  Amenity
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  ...models
};