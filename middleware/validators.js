// middleware/validators.js
const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// ============= E-COMMERCE VALIDATORS =============

const productValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 200 }).withMessage('Name must be between 3 and 200 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('categoryId')
    .notEmpty().withMessage('Category ID is required')
    .isUUID().withMessage('Category ID must be a valid UUID'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('description')
    .optional()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  handleValidationErrors
];

const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  handleValidationErrors
];

const cartValidation = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isUUID().withMessage('Product ID must be a valid UUID'),
  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  handleValidationErrors
];

const updateCartItemValidation = [
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  handleValidationErrors
];

const orderValidation = [
  body('shippingAddress')
    .trim()
    .notEmpty().withMessage('Shipping address is required')
    .isLength({ min: 10 }).withMessage('Shipping address must be at least 10 characters'),
  body('paymentMethod')
    .trim()
    .notEmpty().withMessage('Payment method is required')
    .isIn(['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'])
    .withMessage('Invalid payment method'),
  handleValidationErrors
];

const reviewValidation = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  handleValidationErrors
];

const wishlistValidation = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isUUID().withMessage('Product ID must be a valid UUID'),
  handleValidationErrors
];

// ============= BANKING VALIDATORS =============

const accountValidation = [
  body('accountType')
    .notEmpty().withMessage('Account type is required')
    .isIn(['savings', 'checking', 'credit']).withMessage('Invalid account type'),
  body('accountNumber')
    .trim()
    .notEmpty().withMessage('Account number is required')
    .isLength({ min: 8, max: 20 }).withMessage('Account number must be between 8 and 20 characters'),
  body('balance')
    .optional()
    .isFloat({ min: 0 }).withMessage('Balance must be non-negative'),
  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'INR']).withMessage('Invalid currency'),
  handleValidationErrors
];

const transactionValidation = [
  body('accountId')
    .notEmpty().withMessage('Account ID is required')
    .isUUID().withMessage('Account ID must be a valid UUID'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('transactionType')
    .notEmpty().withMessage('Transaction type is required')
    .isIn(['debit', 'credit', 'transfer']).withMessage('Invalid transaction type'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  handleValidationErrors
];

const cardValidation = [
  body('accountId')
    .notEmpty().withMessage('Account ID is required')
    .isUUID().withMessage('Account ID must be a valid UUID'),
  body('cardType')
    .notEmpty().withMessage('Card type is required')
    .isIn(['debit', 'credit', 'prepaid']).withMessage('Invalid card type'),
  body('cardNumber')
    .notEmpty().withMessage('Card number is required')
    .matches(/^\d{16}$/).withMessage('Card number must be 16 digits'),
  body('expiryDate')
    .optional()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage('Expiry date must be in MM/YY format'),
  body('cvv')
    .optional()
    .matches(/^\d{3,4}$/).withMessage('CVV must be 3 or 4 digits'),
  handleValidationErrors
];

const loanValidation = [
  body('amount')
    .notEmpty().withMessage('Loan amount is required')
    .isFloat({ min: 1000 }).withMessage('Loan amount must be at least 1000'),
  body('loanType')
    .notEmpty().withMessage('Loan type is required')
    .isIn(['personal', 'home', 'auto', 'education']).withMessage('Invalid loan type'),
  body('duration')
    .notEmpty().withMessage('Loan duration is required')
    .isInt({ min: 1, max: 360 }).withMessage('Duration must be between 1 and 360 months'),
  body('purpose')
    .optional()
    .isLength({ max: 500 }).withMessage('Purpose cannot exceed 500 characters'),
  handleValidationErrors
];

const beneficiaryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Beneficiary name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
  body('accountNumber')
    .trim()
    .notEmpty().withMessage('Account number is required')
    .isLength({ min: 8, max: 20 }).withMessage('Account number must be between 8 and 20 characters'),
  body('bankName')
    .trim()
    .notEmpty().withMessage('Bank name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Bank name must be between 3 and 100 characters'),
  body('ifscCode')
    .optional()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Invalid IFSC code format'),
  handleValidationErrors
];

const transferValidation = [
  body('fromAccountId')
    .notEmpty().withMessage('From account ID is required')
    .isUUID().withMessage('From account ID must be a valid UUID'),
  body('toAccountId')
    .notEmpty().withMessage('To account ID is required')
    .isUUID().withMessage('To account ID must be a valid UUID'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  handleValidationErrors
];

// ============= HEALTHCARE VALIDATORS =============

const patientValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Patient name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[\d\s\-()]+$/).withMessage('Invalid phone number format'),
  body('dateOfBirth')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Valid date of birth is required'),
  body('bloodType')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type'),
  handleValidationErrors
];

const doctorValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Doctor name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
  body('specialty')
    .trim()
    .notEmpty().withMessage('Specialty is required')
    .isLength({ min: 3, max: 100 }).withMessage('Specialty must be between 3 and 100 characters'),
  body('licenseNumber')
    .trim()
    .notEmpty().withMessage('License number is required')
    .isLength({ min: 5, max: 50 }).withMessage('License number must be between 5 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-()]+$/).withMessage('Invalid phone number format'),
  body('email')
    .optional()
    .isEmail().withMessage('Valid email is required'),
  handleValidationErrors
];

const appointmentValidation = [
  body('patientId')
    .notEmpty().withMessage('Patient ID is required')
    .isUUID().withMessage('Patient ID must be a valid UUID'),
  body('doctorId')
    .notEmpty().withMessage('Doctor ID is required')
    .isUUID().withMessage('Doctor ID must be a valid UUID'),
  body('appointmentDate')
    .notEmpty().withMessage('Appointment date is required')
    .isISO8601().withMessage('Valid appointment date is required'),
  body('reason')
    .trim()
    .notEmpty().withMessage('Reason for appointment is required')
    .isLength({ min: 5, max: 500 }).withMessage('Reason must be between 5 and 500 characters'),
  handleValidationErrors
];

const prescriptionValidation = [
  body('patientId')
    .notEmpty().withMessage('Patient ID is required')
    .isUUID().withMessage('Patient ID must be a valid UUID'),
  body('doctorId')
    .notEmpty().withMessage('Doctor ID is required')
    .isUUID().withMessage('Doctor ID must be a valid UUID'),
  body('medications')
    .notEmpty().withMessage('Medications are required')
    .isArray({ min: 1 }).withMessage('At least one medication is required'),
  body('medications.*.name')
    .notEmpty().withMessage('Medication name is required'),
  body('medications.*.dosage')
    .notEmpty().withMessage('Medication dosage is required'),
  handleValidationErrors
];

// ============= SOCIAL MEDIA VALIDATORS =============

const postValidation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Post content is required')
    .isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters'),
  body('visibility')
    .optional()
    .isIn(['public', 'private', 'friends']).withMessage('Invalid visibility setting'),
  handleValidationErrors
];

const commentValidation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  handleValidationErrors
];

const messageValidation = [
  body('receiverId')
    .notEmpty().withMessage('Receiver ID is required')
    .isUUID().withMessage('Receiver ID must be a valid UUID'),
  body('content')
    .trim()
    .notEmpty().withMessage('Message content is required')
    .isLength({ min: 1, max: 2000 }).withMessage('Message must be between 1 and 2000 characters'),
  handleValidationErrors
];

// ============= BOOKINGS VALIDATORS =============

const hotelValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Hotel name is required')
    .isLength({ min: 3, max: 200 }).withMessage('Name must be between 3 and 200 characters'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required')
    .isLength({ min: 2, max: 100 }).withMessage('City must be between 2 and 100 characters'),
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 10, max: 500 }).withMessage('Address must be between 10 and 500 characters'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  handleValidationErrors
];

const roomValidation = [
  body('hotelId')
    .notEmpty().withMessage('Hotel ID is required')
    .isUUID().withMessage('Hotel ID must be a valid UUID'),
  body('roomType')
    .trim()
    .notEmpty().withMessage('Room type is required')
    .isIn(['single', 'double', 'suite', 'deluxe']).withMessage('Invalid room type'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('capacity')
    .optional()
    .isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  handleValidationErrors
];

const reservationValidation = [
  body('roomId')
    .notEmpty().withMessage('Room ID is required')
    .isUUID().withMessage('Room ID must be a valid UUID'),
  body('checkInDate')
    .notEmpty().withMessage('Check-in date is required')
    .isISO8601().withMessage('Valid check-in date is required'),
  body('checkOutDate')
    .notEmpty().withMessage('Check-out date is required')
    .isISO8601().withMessage('Valid check-out date is required')
    .custom((checkOutDate, { req }) => {
      if (new Date(checkOutDate) <= new Date(req.body.checkInDate)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
  body('guests')
    .optional()
    .isInt({ min: 1 }).withMessage('Number of guests must be at least 1'),
  handleValidationErrors
];

const hotelReviewValidation = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  handleValidationErrors
];

const amenityValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Amenity name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  handleValidationErrors
];

// ============= EXPORT ALL VALIDATORS =============

module.exports = {
  handleValidationErrors,
  
  // E-commerce
  productValidation,
  categoryValidation,
  cartValidation,
  updateCartItemValidation,
  orderValidation,
  reviewValidation,
  wishlistValidation,
  
  // Banking
  accountValidation,
  transactionValidation,
  cardValidation,
  loanValidation,
  beneficiaryValidation,
  transferValidation,
  
  // Healthcare
  patientValidation,
  doctorValidation,
  appointmentValidation,
  prescriptionValidation,
  
  // Social Media
  postValidation,
  commentValidation,
  messageValidation,
  
  // Bookings
  hotelValidation,
  roomValidation,
  reservationValidation,
  hotelReviewValidation,
  amenityValidation
};