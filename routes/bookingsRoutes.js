// routes/bookingsRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const {
  hotelValidation,
  roomValidation,
  reservationValidation,
  hotelReviewValidation,
  amenityValidation
} = require('../middleware/validators');

const {
  // Hotels
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  searchHotels,
  // Rooms
  getAllRooms,
  getRoomById,
  getHotelRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  checkRoomAvailability,
  // Reservations
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation,
  getUserReservations,
  // Reviews
  getHotelReviews,
  createHotelReview,
  updateReview,
  deleteReview,
  // Amenities
  getAllAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenity
} = require('../controllers/bookingsController');

// ============= HOTELS ROUTES =============

/**
 * @swagger
 * /api/v1/bookings/hotels:
 *   get:
 *     summary: Get all hotels
 *     tags: [Bookings - Hotels]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of hotels
 */
router.get('/hotels', optionalAuth, getAllHotels);
router.head('/hotels', optionalAuth, getAllHotels);

router.get('/hotels/search', optionalAuth, searchHotels);
router.get('/hotels/:id', optionalAuth, getHotelById);
router.post('/hotels', authenticate, hotelValidation, createHotel);
router.put('/hotels/:id', authenticate, updateHotel);
router.patch('/hotels/:id', authenticate, updateHotel);
router.delete('/hotels/:id', authenticate, deleteHotel);
router.options('/hotels', (req, res) => res.sendStatus(200));

// ============= ROOMS ROUTES =============

/**
 * @swagger
 * /api/v1/bookings/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Bookings - Rooms]
 *     responses:
 *       200:
 *         description: List of rooms
 */
router.get('/rooms', optionalAuth, getAllRooms);
router.get('/rooms/:id', optionalAuth, getRoomById);
router.get('/hotels/:hotelId/rooms', optionalAuth, getHotelRooms);
router.post('/rooms', authenticate, roomValidation, createRoom);
router.put('/rooms/:id', authenticate, updateRoom);
router.patch('/rooms/:id', authenticate, updateRoom);
router.delete('/rooms/:id', authenticate, deleteRoom);
router.get('/rooms/:id/availability', optionalAuth, checkRoomAvailability);
router.options('/rooms', (req, res) => res.sendStatus(200));

// ============= RESERVATIONS ROUTES =============

/**
 * @swagger
 * /api/v1/bookings/reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Bookings - Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 */
router.get('/reservations', authenticate, getAllReservations);
router.get('/reservations/:id', authenticate, getReservationById);
router.post('/reservations', authenticate, reservationValidation, createReservation);
router.put('/reservations/:id', authenticate, updateReservation);
router.patch('/reservations/:id', authenticate, updateReservation);
router.delete('/reservations/:id', authenticate, cancelReservation);
router.patch('/reservations/:id/cancel', authenticate, cancelReservation);
router.get('/users/reservations', authenticate, getUserReservations);
router.options('/reservations', (req, res) => res.sendStatus(200));

// ============= REVIEWS ROUTES =============

router.get('/hotels/:hotelId/reviews', optionalAuth, getHotelReviews);
router.post('/hotels/:hotelId/reviews', authenticate, hotelReviewValidation, createHotelReview);
router.put('/reviews/:id', authenticate, updateReview);
router.patch('/reviews/:id', authenticate, updateReview);
router.delete('/reviews/:id', authenticate, deleteReview);
router.options('/hotels/:hotelId/reviews', (req, res) => res.sendStatus(200));

// ============= AMENITIES ROUTES =============

router.get('/amenities', getAllAmenities);
router.post('/amenities', authenticate, amenityValidation, createAmenity);
router.put('/amenities/:id', authenticate, updateAmenity);
router.patch('/amenities/:id', authenticate, updateAmenity);
router.delete('/amenities/:id', authenticate, deleteAmenity);
router.options('/amenities', (req, res) => res.sendStatus(200));

module.exports = router;