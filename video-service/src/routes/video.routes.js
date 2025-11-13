const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../middleware/auth.middleware');
const { validateVideoRequest } = require('../middleware/validation.middleware');
const videoController = require('../controllers/video.controller');

/**
 * POST /api/video/render
 * Main endpoint to submit video generation job
 * 
 * Request body:
 * {
 *   projectId: string,
 *   script: { scenes: [...] },
 *   media: [{ url, type, tags, duration }],
 *   channelStyle: { transitions, pacing, ... },
 *   voiceover: { text, voice, speed },
 *   stockFootage: [{ url, insertAt, duration }],
 *   metadata: { title, description }
 * }
 */
router.post('/render', validateApiKey, validateVideoRequest, videoController.createRenderJob);

/**
 * GET /api/video/status/:jobId
 * Check status of video rendering job
 */
router.get('/status/:jobId', validateApiKey, videoController.getJobStatus);

/**
 * GET /api/video/result/:jobId
 * Get final video URL and metadata
 */
router.get('/result/:jobId', validateApiKey, videoController.getJobResult);

/**
 * DELETE /api/video/cancel/:jobId
 * Cancel a pending or processing job
 */
router.delete('/cancel/:jobId', validateApiKey, videoController.cancelJob);

/**
 * GET /api/video/queue/stats
 * Get queue statistics (admin only)
 */
router.get('/queue/stats', validateApiKey, videoController.getQueueStats);

module.exports = router;
