// utils/helpers.js
const crypto = require('crypto');

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a unique reference number
 * @param {string} prefix - Prefix for the reference
 * @returns {string} Unique reference number
 */
const generateReferenceNumber = (prefix = 'REF') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Paginate results
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Offset and limit
 */
const paginate = (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  return { offset: parseInt(offset), limit: parseInt(limit) };
};

/**
 * Calculate pagination metadata
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total: parseInt(total),
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

/**
 * Format date
 * @param {Date} date - Date to format
 * @param {string} format - Format type
 * @returns {string} Formatted date
 */
const formatDate = (date, format = 'full') => {
  const d = new Date(date);
  
  switch (format) {
    case 'date':
      return d.toLocaleDateString('en-US');
    case 'time':
      return d.toLocaleTimeString('en-US');
    case 'datetime':
      return d.toLocaleString('en-US');
    case 'iso':
      return d.toISOString();
    default:
      return d.toLocaleString('en-US');
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(phone);
};

/**
 * Sanitize string (remove special characters)
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  return str.replace(/[^a-zA-Z0-9\s-_]/g, '');
};

/**
 * Generate slug from string
 * @param {string} str - String to convert
 * @returns {string} Slug
 */
const generateSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage
 */
const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
};

/**
 * Calculate discount amount
 * @param {number} price - Original price
 * @param {number} discountPercent - Discount percentage
 * @returns {number} Discounted price
 */
const calculateDiscount = (price, discountPercent) => {
  const discount = (price * discountPercent) / 100;
  return Math.round((price - discount) * 100) / 100;
};

/**
 * Mask sensitive data
 * @param {string} data - Data to mask
 * @param {number} visibleChars - Number of visible chars at end
 * @returns {string} Masked data
 */
const maskData = (data, visibleChars = 4) => {
  if (!data || data.length <= visibleChars) return data;
  const masked = '*'.repeat(data.length - visibleChars);
  const visible = data.slice(-visibleChars);
  return masked + visible;
};

/**
 * Mask credit card number
 * @param {string} cardNumber - Card number
 * @returns {string} Masked card number
 */
const maskCardNumber = (cardNumber) => {
  return maskData(cardNumber, 4);
};

/**
 * Mask email
 * @param {string} email - Email address
 * @returns {string} Masked email
 */
const maskEmail = (email) => {
  const [username, domain] = email.split('@');
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

/**
 * Generate random number in range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate OTP (One Time Password)
 * @param {number} length - OTP length
 * @returns {string} OTP
 */
const generateOTP = (length = 6) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Check if object is empty
 * @param {object} obj - Object to check
 * @returns {boolean} Is empty
 */
const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Deep clone object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Get error message from error object
 * @param {Error} error - Error object
 * @returns {string} Error message
 */
const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Truncate string
 * @param {string} str - String to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated string
 */
const truncateString = (str, length = 50) => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

/**
 * Remove duplicates from array
 * @param {Array} arr - Array with duplicates
 * @returns {Array} Array without duplicates
 */
const removeDuplicates = (arr) => {
  return [...new Set(arr)];
};

/**
 * Group array by key
 * @param {Array} arr - Array to group
 * @param {string} key - Key to group by
 * @returns {object} Grouped object
 */
const groupBy = (arr, key) => {
  return arr.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
};

module.exports = {
  generateRandomString,
  generateReferenceNumber,
  paginate,
  getPaginationMeta,
  formatCurrency,
  formatDate,
  isValidEmail,
  isValidPhone,
  sanitizeString,
  generateSlug,
  calculatePercentage,
  calculateDiscount,
  maskData,
  maskCardNumber,
  maskEmail,
  randomNumber,
  generateOTP,
  sleep,
  isEmpty,
  deepClone,
  getErrorMessage,
  toTitleCase,
  truncateString,
  removeDuplicates,
  groupBy
};