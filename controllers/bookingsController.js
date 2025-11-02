// controllers/bookingsController.js
const { Op } = require('sequelize');
const { Hotel, Room, Reservation, HotelReview, Amenity, User } = require('../models');

// ============= HOTELS =============
exports.getAllHotels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, rating } = req.query;
    const where = {};
    
    if (city) where.city = { [Op.iLike]: `%${city}%` };
    if (minPrice) where.pricePerNight = { ...where.pricePerNight, [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.pricePerNight = { ...where.pricePerNight, [Op.lte]: parseFloat(maxPrice) };
    if (rating) where.rating = { [Op.gte]: parseFloat(rating) };

    const hotels = await Hotel.findAll({
      where,
      order: [['rating', 'DESC']]
    });

    res.json({ hotels });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
};

exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id, {
      include: [
        { model: Room, as: 'rooms' },
        { model: HotelReview, as: 'reviews' }
      ]
    });
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    res.json({ hotel });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
};

exports.createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ message: 'Hotel created', hotel });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create hotel' });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    await hotel.update(req.body);
    res.json({ message: 'Hotel updated', hotel });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update hotel' });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    await hotel.destroy();
    res.json({ message: 'Hotel deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
};

exports.searchHotels = async (req, res) => {
  try {
    const { query, city, checkIn, checkOut } = req.query;
    const where = {};
    
    if (query) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } }
      ];
    }
    if (city) where.city = { [Op.iLike]: `%${city}%` };

    const hotels = await Hotel.findAll({ where });
    res.json({ hotels });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search hotels' });
  }
};

// ============= ROOMS =============
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id, {
      include: [{ model: Hotel, as: 'hotel' }]
    });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json({ room });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
};

exports.getHotelRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: { hotelId: req.params.hotelId }
    });
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotel rooms' });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ message: 'Room created', room });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create room' });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    await room.update(req.body);
    res.json({ message: 'Room updated', room });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update room' });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    await room.destroy();
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete room' });
  }
};

exports.checkRoomAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    const room = await Room.findByPk(req.params.id);
    
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // Check for overlapping reservations
    const overlapping = await Reservation.findOne({
      where: {
        roomId: req.params.id,
        status: { [Op.notIn]: ['cancelled'] },
        [Op.or]: [
          {
            checkInDate: { [Op.between]: [checkIn, checkOut] }
          },
          {
            checkOutDate: { [Op.between]: [checkIn, checkOut] }
          },
          {
            [Op.and]: [
              { checkInDate: { [Op.lte]: checkIn } },
              { checkOutDate: { [Op.gte]: checkOut } }
            ]
          }
        ]
      }
    });

    res.json({ 
      available: !overlapping,
      room
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check availability' });
  }
};

// ============= RESERVATIONS =============
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Hotel, as: 'hotel' },
        { model: Room, as: 'room' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { model: Hotel, as: 'hotel' },
        { model: Room, as: 'room' }
      ]
    });
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json({ reservation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create({
      ...req.body,
      userId: req.user.id
    });

    // Real-time notification
    const io = req.app.get('io');
    io.to(`user_${req.user.id}`).emit('reservation_created', reservation);

    res.status(201).json({ message: 'Reservation created', reservation });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create reservation' });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    await reservation.update(req.body);
    res.json({ message: 'Reservation updated', reservation });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update reservation' });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    
    if (reservation.status === 'checked-out') {
      return res.status(400).json({ error: 'Cannot cancel completed reservation' });
    }

    reservation.status = 'cancelled';
    await reservation.save();
    res.json({ message: 'Reservation cancelled', reservation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Hotel, as: 'hotel' },
        { model: Room, as: 'room' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

// ============= REVIEWS =============
exports.getHotelReviews = async (req, res) => {
  try {
    const reviews = await HotelReview.findAll({
      where: { hotelId: req.params.hotelId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

exports.createHotelReview = async (req, res) => {
  try {
    const review = await HotelReview.create({
      ...req.body,
      userId: req.user.id,
      hotelId: req.params.hotelId
    });
    res.status(201).json({ message: 'Review created', review });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create review' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await HotelReview.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    await review.update(req.body);
    res.json({ message: 'Review updated', review });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update review' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await HotelReview.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    await review.destroy();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

// ============= AMENITIES =============
exports.getAllAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.findAll();
    res.json({ amenities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
};

exports.createAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.create(req.body);
    res.status(201).json({ message: 'Amenity created', amenity });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create amenity' });
  }
};

exports.updateAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByPk(req.params.id);
    if (!amenity) return res.status(404).json({ error: 'Amenity not found' });
    await amenity.update(req.body);
    res.json({ message: 'Amenity updated', amenity });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update amenity' });
  }
};

exports.deleteAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByPk(req.params.id);
    if (!amenity) return res.status(404).json({ error: 'Amenity not found' });
    await amenity.destroy();
    res.json({ message: 'Amenity deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete amenity' });
  }
};