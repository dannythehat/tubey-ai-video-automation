const Queue = require('bull');
const { logger } = require('../utils/logger');
const { processVideo } = require('./video.processor');

let videoQueue;

/**
 * Initialize Bull queue
 */
async function initializeQueue() {
  videoQueue = new Queue('video-processing', process.env.REDIS_URL || 'redis://localhost:6379', {
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      },
      timeout: parseInt(process.env.JOB_TIMEOUT_MS) || 600000, // 10 minutes default
      removeOnComplete: false,
      removeOnFail: false
    }
  });

  // Process jobs
  const concurrency = parseInt(process.env.MAX_CONCURRENT_JOBS) || 3;
  videoQueue.process(concurrency, async (job) => {
    logger.info(`Processing job ${job.id}`, { projectId: job.data.projectId });
    
    try {
      const result = await processVideo(job);
      logger.info(`Job ${job.id} completed successfully`);
      return result;
    } catch (error) {
      logger.error(`Job ${job.id} failed:`, error);
      throw error;
    }
  });

  // Event listeners
  videoQueue.on('completed', (job, result) => {
    logger.info(`Job ${job.id} completed`, { videoUrl: result.videoUrl });
    
    // Send webhook if provided
    if (job.data.webhookUrl) {
      sendWebhook(job.data.webhookUrl, {
        jobId: job.id,
        status: 'completed',
        result
      });
    }
  });

  videoQueue.on('failed', (job, err) => {
    logger.error(`Job ${job.id} failed:`, err);
    
    // Send webhook if provided
    if (job.data.webhookUrl) {
      sendWebhook(job.data.webhookUrl, {
        jobId: job.id,
        status: 'failed',
        error: err.message
      });
    }
  });

  videoQueue.on('progress', (job, progress) => {
    logger.debug(`Job ${job.id} progress: ${progress}%`);
  });

  videoQueue.on('stalled', (job) => {
    logger.warn(`Job ${job.id} stalled`);
  });

  logger.info('Video processing queue initialized');
}

/**
 * Add a video rendering job to the queue
 */
async function addVideoJob(data) {
  if (!videoQueue) {
    throw new Error('Queue not initialized');
  }

  const job = await videoQueue.add(data, {
    priority: data.priority || 10,
    jobId: data.projectId // Use projectId as jobId for easy tracking
  });

  return job;
}

/**
 * Get job by ID
 */
async function getJob(jobId) {
  if (!videoQueue) {
    throw new Error('Queue not initialized');
  }

  return await videoQueue.getJob(jobId);
}

/**
 * Cancel a job
 */
async function cancelJob(jobId) {
  if (!videoQueue) {
    throw new Error('Queue not initialized');
  }

  const job = await videoQueue.getJob(jobId);
  if (!job) {
    return false;
  }

  const state = await job.getState();
  if (state === 'completed' || state === 'failed') {
    return false;
  }

  await job.remove();
  return true;
}

/**
 * Get queue statistics
 */
async function getQueueStats() {
  if (!videoQueue) {
    throw new Error('Queue not initialized');
  }

  const [waiting, active, completed, failed, delayed] = await Promise.all([
    videoQueue.getWaitingCount(),
    videoQueue.getActiveCount(),
    videoQueue.getCompletedCount(),
    videoQueue.getFailedCount(),
    videoQueue.getDelayedCount()
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed
  };
}

/**
 * Send webhook notification
 */
async function sendWebhook(url, data) {
  try {
    const axios = require('axios');
    await axios.post(url, data, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    logger.info(`Webhook sent to ${url}`);
  } catch (error) {
    logger.error(`Failed to send webhook to ${url}:`, error.message);
  }
}

/**
 * Clean up old jobs
 */
async function cleanOldJobs(olderThanDays = 7) {
  if (!videoQueue) {
    throw new Error('Queue not initialized');
  }

  const timestamp = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
  
  await videoQueue.clean(timestamp, 'completed');
  await videoQueue.clean(timestamp, 'failed');
  
  logger.info(`Cleaned jobs older than ${olderThanDays} days`);
}

module.exports = {
  initializeQueue,
  addVideoJob,
  getJob,
  cancelJob,
  getQueueStats,
  cleanOldJobs
};
