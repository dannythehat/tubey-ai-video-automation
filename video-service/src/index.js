require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { logger } = require('./utils/logger');
const videoRoutes = require('./routes/video.routes');
const healthRoutes = require('./routes/health.routes');
const { initializeQueue } = require('./services/queue.service');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Routes
app.use('/health', healthRoutes);
app.use('/api/video', videoRoutes);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Initialize queue and start server
async function startServer() {
  try {
    // Initialize Bull queue
    await initializeQueue();
    logger.info('Video processing queue initialized');

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🎬 Tubey Video Service running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`Max concurrent jobs: ${process.env.MAX_CONCURRENT_JOBS || 3}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer();

module.exports = app;
