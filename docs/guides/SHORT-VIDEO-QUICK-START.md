# 🚀 Short Video System - Quick Start Guide

**For Developers: Implementing the Short Video Generation Feature**

---

## Overview

This guide helps you implement the Short Video System that automatically generates TikTok/Reels/Shorts from long-form videos.

---

## Prerequisites

- Long video generation pipeline working (Gateway 5 complete)
- FFmpeg installed and configured
- GPT-5 API access
- Face detection library (optional but recommended)

---

## Implementation Steps

### Step 1: Database Setup

Add the `short_videos` table:

```sql
CREATE TABLE short_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  long_video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  
  -- Clip Details
  title TEXT NOT NULL,
  duration INTEGER NOT NULL,
  start_timestamp INTEGER NOT NULL,
  end_timestamp INTEGER NOT NULL,
  
  -- Scoring
  engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
  hook_strength INTEGER,
  emotional_impact INTEGER,
  visual_interest INTEGER,
  story_completeness INTEGER,
  viral_potential INTEGER,
  
  -- Platform Optimization
  platforms TEXT[] DEFAULT ARRAY['tiktok', 'reels', 'shorts'],
  hook_text TEXT,
  caption_style JSONB,
  
  -- Processing
  status TEXT DEFAULT 'pending',
  file_url TEXT,
  thumbnail_url TEXT,
  
  -- Publishing
  published_at TIMESTAMP,
  tiktok_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_short_videos_project ON short_videos(project_id);
CREATE INDEX idx_short_videos_long_video ON short_videos(long_video_id);
CREATE INDEX idx_short_videos_status ON short_videos(status);
```

### Step 2: GPT-5 Moment Analysis

Create a service to analyze the long video script:

```javascript
// services/shortVideo/momentAnalyzer.js

async function analyzeVideoForShorts(videoScript, options = {}) {
  const {
    count = 5,
    minDuration = 30,
    maxDuration = 60
  } = options;

  const prompt = `
Analyze this video script and identify the ${count} most engaging moments for short-form content (TikTok/Reels/Shorts).

VIDEO SCRIPT:
${videoScript}

For each moment, provide:
1. Title (catchy, 5-8 words)
2. Start timestamp (MM:SS)
3. End timestamp (MM:SS)
4. Duration (seconds, between ${minDuration}-${maxDuration}s)
5. Hook text (platform-optimized, 10-15 words)
6. Engagement score breakdown:
   - Hook strength (0-25)
   - Emotional impact (0-20)
   - Visual interest (0-20)
   - Story completeness (0-20)
   - Viral potential (0-15)

Return as JSON array.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-5',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
}
```

### Step 3: Video Extraction

Extract clips using FFmpeg:

```javascript
// services/shortVideo/videoExtractor.js

const ffmpeg = require('fluent-ffmpeg');

async function extractClip(longVideoPath, startTime, endTime, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(longVideoPath)
      .setStartTime(startTime) // Format: "00:08:32"
      .setDuration(endTime - startTime)
      .output(outputPath)
      .outputOptions([
        '-c copy', // Copy codec (fast, no re-encoding)
        '-avoid_negative_ts 1'
      ])
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}
```

### Step 4: Smart Cropping to Vertical

Convert horizontal to vertical with smart cropping:

```javascript
// services/shortVideo/smartCropper.js

async function convertToVertical(inputPath, outputPath, options = {}) {
  const {
    faceDetection = true,
    quality = 18 // CRF value (lower = better quality)
  } = options;

  return new Promise((resolve, reject) => {
    const filters = [];
    
    if (faceDetection) {
      // Use cropdetect to find optimal crop area
      filters.push('crop=ih*9/16:ih');
    } else {
      // Center crop
      filters.push('crop=ih*9/16:ih:iw/2-ih*9/32:0');
    }
    
    filters.push('scale=1080:1920');

    ffmpeg(inputPath)
      .videoFilters(filters)
      .outputOptions([
        `-crf ${quality}`,
        '-preset slow',
        '-c:a copy' // Keep audio as-is
      ])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}
```

### Step 5: Platform-Specific Hooks

Generate platform-optimized hooks:

```javascript
// services/shortVideo/hookGenerator.js

async function generatePlatformHooks(originalHook, platforms) {
  const prompt = `
Original hook: "${originalHook}"

Generate platform-specific hooks for:
${platforms.join(', ')}

Requirements:
- TikTok: 2-3 seconds, bold, emoji, trending language
- Instagram Reels: 3-4 seconds, aesthetic, engaging
- YouTube Shorts: 4-5 seconds, informative, subscribe CTA

Return as JSON object with platform keys.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-5',
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.choices[0].message.content);
}
```

### Step 6: API Endpoints

Create REST API endpoints:

```javascript
// routes/shortVideos.js

const express = require('express');
const router = express.Router();

// Generate shorts from long video
router.post('/projects/:projectId/shorts/generate', async (req, res) => {
  const { projectId } = req.params;
  const { long_video_id, platforms, count, duration_range } = req.body;

  try {
    // 1. Get long video and script
    const video = await getVideo(long_video_id);
    const script = await getVideoScript(long_video_id);

    // 2. Analyze for moments
    const moments = await analyzeVideoForShorts(script, {
      count,
      minDuration: duration_range.min,
      maxDuration: duration_range.max
    });

    // 3. Create short video records
    const shorts = await Promise.all(
      moments.map(moment => createShortVideo(projectId, long_video_id, moment))
    );

    // 4. Queue processing jobs
    await queueShortVideoProcessing(shorts);

    res.json({
      success: true,
      data: {
        job_id: generateJobId(),
        status: 'processing',
        shorts_count: shorts.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// List shorts for a project
router.get('/projects/:projectId/shorts', async (req, res) => {
  const { projectId } = req.params;
  
  const shorts = await getShortVideos(projectId);
  
  res.json({
    success: true,
    data: { shorts, total: shorts.length }
  });
});

// Publish short to platforms
router.post('/shorts/:shortId/publish', async (req, res) => {
  const { shortId } = req.params;
  const { platforms, metadata } = req.body;

  try {
    const results = await publishShortVideo(shortId, platforms, metadata);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

### Step 7: Processing Queue

Use Bull for background processing:

```javascript
// queues/shortVideoQueue.js

const Queue = require('bull');
const shortVideoQueue = new Queue('short-video-processing');

shortVideoQueue.process(async (job) => {
  const { shortId } = job.data;
  
  try {
    // 1. Get short video record
    const short = await getShortVideo(shortId);
    
    // 2. Extract clip from long video
    const extractedPath = await extractClip(
      short.long_video_path,
      short.start_timestamp,
      short.end_timestamp,
      `/tmp/extracted_${shortId}.mp4`
    );
    
    // 3. Convert to vertical
    const verticalPath = await convertToVertical(
      extractedPath,
      `/tmp/vertical_${shortId}.mp4`
    );
    
    // 4. Generate platform hooks
    const hooks = await generatePlatformHooks(
      short.hook_text,
      short.platforms
    );
    
    // 5. Upload to storage
    const fileUrl = await uploadToStorage(verticalPath);
    
    // 6. Update database
    await updateShortVideo(shortId, {
      status: 'ready',
      file_url: fileUrl,
      platform_hooks: hooks
    });
    
    // 7. Cleanup temp files
    await cleanupTempFiles([extractedPath, verticalPath]);
    
    return { success: true, shortId };
  } catch (error) {
    await updateShortVideo(shortId, { status: 'failed' });
    throw error;
  }
});
```

### Step 8: Frontend Integration

Add UI components:

```jsx
// components/ShortVideoGenerator.jsx

import React, { useState } from 'react';

export function ShortVideoGenerator({ projectId, longVideoId }) {
  const [settings, setSettings] = useState({
    platforms: ['tiktok', 'reels', 'shorts'],
    count: 5,
    duration: { min: 30, max: 60 }
  });

  const handleGenerate = async () => {
    const response = await fetch(`/api/projects/${projectId}/shorts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        long_video_id: longVideoId,
        ...settings
      })
    });

    const data = await response.json();
    // Handle response
  };

  return (
    <div className="short-video-generator">
      <h3>Generate Short Videos</h3>
      
      <div className="platforms">
        <label>
          <input
            type="checkbox"
            checked={settings.platforms.includes('tiktok')}
            onChange={(e) => togglePlatform('tiktok', e.target.checked)}
          />
          TikTok (15-60s)
        </label>
        {/* More platform checkboxes */}
      </div>

      <div className="count">
        <label>Number of shorts:</label>
        <select
          value={settings.count}
          onChange={(e) => setSettings({ ...settings, count: e.target.value })}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      <button onClick={handleGenerate}>
        Generate Short Videos
      </button>
    </div>
  );
}
```

---

## Testing

### Unit Tests

```javascript
// tests/shortVideo.test.js

describe('Short Video System', () => {
  test('analyzes video and identifies moments', async () => {
    const script = loadTestScript();
    const moments = await analyzeVideoForShorts(script, { count: 5 });
    
    expect(moments).toHaveLength(5);
    expect(moments[0]).toHaveProperty('engagement_score');
    expect(moments[0].engagement_score).toBeGreaterThan(80);
  });

  test('extracts clip correctly', async () => {
    const outputPath = await extractClip(
      'test-video.mp4',
      '00:01:00',
      '00:01:45',
      'output.mp4'
    );
    
    expect(fs.existsSync(outputPath)).toBe(true);
    const duration = await getVideoDuration(outputPath);
    expect(duration).toBe(45);
  });

  test('converts to vertical format', async () => {
    const outputPath = await convertToVertical('input.mp4', 'output.mp4');
    
    const metadata = await getVideoMetadata(outputPath);
    expect(metadata.width).toBe(1080);
    expect(metadata.height).toBe(1920);
  });
});
```

---

## Deployment Checklist

- [ ] Database migrations run
- [ ] FFmpeg installed on server
- [ ] Bull queue configured with Redis
- [ ] Storage bucket configured
- [ ] Platform APIs configured (TikTok, Instagram, YouTube)
- [ ] GPT-5 API key set
- [ ] Rate limits configured
- [ ] Error monitoring enabled
- [ ] Background workers running

---

## Performance Optimization

### Caching
- Cache GPT-5 moment analysis results
- Cache extracted clips for 24 hours
- Use CDN for final short videos

### Parallel Processing
- Process multiple shorts simultaneously
- Use worker pools for FFmpeg operations
- Batch platform uploads

### Cost Optimization
- Use lower CRF for drafts (faster)
- Only process approved shorts
- Compress before upload

---

## Monitoring

Track these metrics:
- Processing time per short
- Success/failure rates
- GPT-5 API costs
- Storage usage
- Platform upload success rates
- User approval rates

---

## Troubleshooting

### Common Issues

**Audio sync problems:**
- Use `-avoid_negative_ts 1` flag
- Ensure consistent frame rates
- Check for variable frame rate source

**Poor crop quality:**
- Enable face detection
- Adjust crop parameters
- Use higher quality settings

**Slow processing:**
- Use `-c copy` when possible
- Optimize FFmpeg presets
- Scale worker count

---

## Next Steps

1. Implement Phase 1 (Core Extraction)
2. Test with sample videos
3. Add face detection (Phase 2)
4. Implement platform publishing (Phase 4)
5. Gather user feedback
6. Optimize based on metrics

---

## Resources

- **Full Architecture:** `docs/architecture/SHORT-VIDEO-SYSTEM.md`
- **Summary:** `docs/SHORT-VIDEO-SUMMARY.md`
- **FFmpeg Docs:** https://ffmpeg.org/documentation.html
- **Platform APIs:**
  - TikTok: https://developers.tiktok.com/
  - Instagram: https://developers.facebook.com/docs/instagram-api
  - YouTube: https://developers.google.com/youtube/v3

---

**Ready to implement? Start with Phase 1 and test thoroughly before moving to the next phase!**
