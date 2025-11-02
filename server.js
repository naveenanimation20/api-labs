// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

// Database connection
const db = require('./config/database');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // 1000 requests per hour
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'APILabs - REST API Practice Platform',
      version: '1.0.0',
      description: 'Real-world REST APIs for QA and automation testing practice',
      contact: {
        name: 'Naveen Automation Labs',
        url: 'https://apilabs.com',
      },
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: []
    }],
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to APILabs - REST API Practice Platform',
    version: '1.0.0',
    documentation: `${process.env.BASE_URL || 'http://localhost:3000'}/docs`,
    domains: [
      'E-commerce',
      'Banking',
      'Healthcare',
      'Social Media',
      'Hotel Bookings'
    ],
    endpoints: {
      auth: '/api/v1/auth',
      ecommerce: '/api/v1/ecommerce',
      banking: '/api/v1/banking',
      healthcare: '/api/v1/healthcare',
      social: '/api/v1/social',
      bookings: '/api/v1/bookings'
    }
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const ecommerceRoutes = require('./routes/ecommerceRoutes');
const bankingRoutes = require('./routes/bankingRoutes');
const healthcareRoutes = require('./routes/healthcareRoutes');
const socialRoutes = require('./routes/socialRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ecommerce', ecommerceRoutes);
app.use('/api/v1/banking', bankingRoutes);
app.use('/api/v1/healthcare', healthcareRoutes);
app.use('/api/v1/social', socialRoutes);
app.use('/api/v1/bookings', bookingsRoutes);

// WebSocket for real-time features
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('subscribe', (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.path}`,
    documentation: `${process.env.BASE_URL || 'http://localhost:3000'}/docs`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 APILabs server running on port ${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/docs`);
});

module.exports = { app, io };