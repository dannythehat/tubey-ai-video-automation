const { addVideoJob, getJob, cancelJob: cancelQueueJob, getQueueStats: getStats } = require('../services/queue.service');
const { logger } = require('../utils/logger');

/**
 * Create a new video rendering job
 */
exports.createRenderJob = async (req, res) => {
  try {
    const {
      projectId,
      script,
      media,
      channelStyle,
      voiceover,
      stockFootage,
      metadata,
      webhookUrl
    } = req.body;

    logger.info(`Creating render job for project: ${projectId}`);

    // Add job to queue
    const job = await addVideoJob({
      projectId,
      script,
      media,
      channelStyle,
      voiceover,
      stockFootage,
      metadata,
      webhookUrl
    });

    res.status(202).json({
      success: true,
      message: 'Video rendering job created',
      jobId: job.id,
      status: 'queued',
      estimatedTime: calculateEstimatedTime(media.length, script.scenes.length)
    });

  } catch (error) {
    logger.error('Error creating render job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create render job',
      message: error.message
    });
  }
};

/**
 * Get job status
 */
exports.getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const state = await job.getState();
    const progress = job.progress();

    res.json({
      success: true,
      jobId: job.id,
      status: state,
      progress: progress,
      createdAt: job.timestamp,
      processedAt: job.processedOn,
      finishedAt: job.finishedOn,
      failedReason: job.failedReason
    });

  } catch (error) {
    logger.error('Error getting job status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get job status',
      message: error.message
    });
  }
};

/**
 * Get job result (final video URL)
 */
exports.getJobResult = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const state = await job.getState();

    if (state !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Job not completed',
        status: state
      });
    }

    res.json({
      success: true,
      jobId: job.id,
      status: 'completed',
      result: job.returnvalue,
      finishedAt: job.finishedOn
    });

  } catch (error) {
    logger.error('Error getting job result:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get job result',
      message: error.message
    });
  }
};

/**
 * Cancel a job
 */
exports.cancelJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const success = await cancelQueueJob(jobId);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Job not found or already completed'
      });
    }

    res.json({
      success: true,
      message: 'Job cancelled successfully',
      jobId
    });

  } catch (error) {
    logger.error('Error cancelling job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel job',
      message: error.message
    });
  }
};

/**
 * Get queue statistics
 */
exports.getQueueStats = async (req, res) => {
  try {
    const stats = await getStats();

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    logger.error('Error getting queue stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get queue stats',
      message: error.message
    });
  }
};

/**
 * Calculate estimated processing time
 */
function calculateEstimatedTime(mediaCount, sceneCount) {
  // Rough estimate: 2 seconds per media item + 1 second per scene
  const estimatedSeconds = (mediaCount * 2) + sceneCount;
  return `${Math.ceil(estimatedSeconds / 60)} minutes`;
}
