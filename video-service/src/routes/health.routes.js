const express = require('express');
const router = express.Router();
const ffmpeg = require('fluent-ffmpeg');

/**
 * GET /health
 * Basic health check
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'tubey-video-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /health/detailed
 * Detailed health check including FFmpeg
 */
router.get('/detailed', async (req, res) => {
  const health = {
    success: true,
    service: 'tubey-video-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      ffmpeg: false,
      storage: false,
      queue: false
    }
  };

  // Check FFmpeg
  try {
    await new Promise((resolve, reject) => {
      ffmpeg.getAvailableFormats((err, formats) => {
        if (err) reject(err);
        else resolve(formats);
      });
    });
    health.checks.ffmpeg = true;
  } catch (error) {
    health.checks.ffmpeg = false;
    health.status = 'degraded';
  }

  // Check storage (Supabase)
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    const { data, error } = await supabase.storage.listBuckets();
    health.checks.storage = !error;
  } catch (error) {
    health.checks.storage = false;
    health.status = 'degraded';
  }

  // Check queue
  try {
    const Queue = require('bull');
    const videoQueue = new Queue('video-processing', process.env.REDIS_URL);
    await videoQueue.isReady();
    health.checks.queue = true;
  } catch (error) {
    health.checks.queue = false;
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

module.exports = router;
