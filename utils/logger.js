// utils/logger.js
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Text colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current log level (from environment or default to INFO)
const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

// Logs directory
const logsDir = path.join(__dirname, '../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Get current timestamp
 * @returns {string} Formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Format log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} meta - Additional metadata
 * @returns {string} Formatted log message
 */
const formatLogMessage = (level, message, meta = {}) => {
  const timestamp = getTimestamp();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
};

/**
 * Write log to file
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} meta - Additional metadata
 */
const writeToFile = (level, message, meta = {}) => {
  const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
  const logMessage = formatLogMessage(level, message, meta) + '\n';
  
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

/**
 * Write to combined log file
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} meta - Additional metadata
 */
const writeToCombinedLog = (level, message, meta = {}) => {
  const logFile = path.join(logsDir, 'combined.log');
  const logMessage = formatLogMessage(level, message, meta) + '\n';
  
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error('Failed to write to combined log:', err);
  });
};

/**
 * Log error message
 * @param {string} message - Error message
 * @param {object} meta - Additional metadata
 */
const error = (message, meta = {}) => {
  if (currentLogLevel >= LOG_LEVELS.ERROR) {
    console.error(`${colors.red}${colors.bright}[ERROR]${colors.reset} ${message}`, meta);
    writeToFile('ERROR', message, meta);
    writeToCombinedLog('ERROR', message, meta);
  }
};

/**
 * Log warning message
 * @param {string} message - Warning message
 * @param {object} meta - Additional metadata
 */
const warn = (message, meta = {}) => {
  if (currentLogLevel >= LOG_LEVELS.WARN) {
    console.warn(`${colors.yellow}${colors.bright}[WARN]${colors.reset} ${message}`, meta);
    writeToFile('WARN', message, meta);
    writeToCombinedLog('WARN', message, meta);
  }
};

/**
 * Log info message
 * @param {string} message - Info message
 * @param {object} meta - Additional metadata
 */
const info = (message, meta = {}) => {
  if (currentLogLevel >= LOG_LEVELS.INFO) {
    console.info(`${colors.cyan}${colors.bright}[INFO]${colors.reset} ${message}`, meta);
    writeToFile('INFO', message, meta);
    writeToCombinedLog('INFO', message, meta);
  }
};

/**
 * Log debug message
 * @param {string} message - Debug message
 * @param {object} meta - Additional metadata
 */
const debug = (message, meta = {}) => {
  if (currentLogLevel >= LOG_LEVELS.DEBUG) {
    console.debug(`${colors.magenta}[DEBUG]${colors.reset} ${message}`, meta);
    writeToFile('DEBUG', message, meta);
    writeToCombinedLog('DEBUG', message, meta);
  }
};

/**
 * Log success message (alias for info with green color)
 * @param {string} message - Success message
 * @param {object} meta - Additional metadata
 */
const success = (message, meta = {}) => {
  console.log(`${colors.green}${colors.bright}[SUCCESS]${colors.reset} ${message}`, meta);
  writeToFile('INFO', `SUCCESS: ${message}`, meta);
  writeToCombinedLog('INFO', `SUCCESS: ${message}`, meta);
};

/**
 * Log HTTP request
 * @param {object} req - Express request object
 */
const logRequest = (req) => {
  const message = `${req.method} ${req.originalUrl}`;
  const meta = {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    body: req.method !== 'GET' ? req.body : undefined
  };
  info(message, meta);
};

/**
 * Log HTTP response
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {number} responseTime - Response time in ms
 */
const logResponse = (req, res, responseTime) => {
  const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`;
  const logLevel = res.statusCode >= 500 ? error : res.statusCode >= 400 ? warn : info;
  logLevel(message);
};

/**
 * Clear all log files
 */
const clearLogs = () => {
  const files = fs.readdirSync(logsDir);
  files.forEach(file => {
    fs.unlinkSync(path.join(logsDir, file));
  });
  success('All log files cleared');
};

/**
 * Express middleware for logging requests
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logRequest(req);
  
  // Intercept response
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    logResponse(req, res, responseTime);
  });
  
  next();
};

module.exports = {
  error,
  warn,
  info,
  debug,
  success,
  logRequest,
  logResponse,
  clearLogs,
  requestLogger,
  LOG_LEVELS
};