const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./shared/config');
const globalErrorHandler = require('./shared/errors/errorHandler');

// Import features
const { authRoutes, authMiddleware } = require('./features/auth');
const { eventController } = require('./features/events');
const { userController } = require('./features/users');
const { categoryController } = require('./features/categories');
const { createHomeFeature } = require('./features/home');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    status: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// CORS
app.use(cors(config.cors));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Initialize home feature with dependencies
const { userRepository } = require('./features/users');
const { eventRepository } = require('./features/events');
const { categoryRepository } = require('./features/categories');
const { homeController } = createHomeFeature(categoryRepository, eventRepository, userRepository);

// API routes
app.use('/api/v1/auth', authRoutes);

// Events routes
const createEventRoutes = require('./features/events/presentation/routes/eventRoutes');
app.use('/api/v1/events', createEventRoutes(eventController, authMiddleware));

// Users routes
const createUserRoutes = require('./features/users/presentation/routes/userRoutes');
app.use('/api/v1/users', createUserRoutes(userController, authMiddleware));

// Categories routes
const createCategoryRoutes = require('./features/categories/presentation/routes/categoryRoutes');
app.use('/api/v1/category', createCategoryRoutes(categoryController, authMiddleware));

// Home routes
const createHomeRoutes = require('./features/home/presentation/routes/homeRoutes');
app.use('/api/v1/home', createHomeRoutes(homeController, authMiddleware));

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
