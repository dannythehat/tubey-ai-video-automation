# 🔌 API Endpoints: Captions & Copyright Detection

**Version:** 2.0.0  
**Last Updated:** November 13, 2025

This document extends the main API design with endpoints for the Caption System and Copyright Detection System.

---

## 📑 Table of Contents

1. [Channel Management](#channel-management)
2. [Caption System](#caption-system)
3. [Copyright Detection](#copyright-detection)
4. [Combined Workflows](#combined-workflows)

---

## 🎬 Channel Management

### `POST /channels/connect`
Connect a new channel (YouTube, TikTok, Instagram)

**Request Body:**
```json
{
  "platform": "youtube",
  "authCode": "oauth_authorization_code"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "platform": "youtube",
    "channelId": "UCxxxxx",
    "channelName": "True Crime Daily",
    "channelUrl": "https://youtube.com/@truecrimedaily",
    "subscriberCount": 234000,
    "isActive": true,
    "createdAt": "2025-11-13T12:00:00Z"
  }
}
```

---

### `GET /channels`
Get all connected channels for user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "platform": "youtube",
      "channelName": "True Crime Daily",
      "subscriberCount": 234000,
      "isActive": true,
      "lastAnalyzedAt": "2025-11-13T10:00:00Z",
      "videosAnalyzed": 50
    }
  ]
}
```

---

### `POST /channels/:channelId/analyze`
Analyze channel to learn style (including captions)

**Request Body:**
```json
{
  "sampleSize": 10,
  "forceRefresh": false,
  "analyzeCaptions": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "channelId": "uuid",
    "channelDNA": {
      "tone": "serious",
      "structure": "question_hook",
      "pacing": "moderate",
      "visualStyle": {
        "sceneDuration": 8,
        "transitions": "crossfade"
      }
    },
    "captionDNA": {
      "visual": {
        "font": {
          "family": "Arial Bold",
          "size": 48,
          "color": "#FFFFFF"
        },
        "positioning": {
          "vertical": "bottom",
          "horizontal": "center"
        }
      },
      "animation": {
        "type": "fade",
        "duration": 0.3
      }
    },
    "confidenceScore": 0.95,
    "videosAnalyzed": 10,
    "analyzedAt": "2025-11-13T12:00:00Z"
  }
}
```

---

### `DELETE /channels/:channelId`
Disconnect a channel

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Channel disconnected successfully"
  }
}
```

---

## 📝 Caption System

### `POST /videos/:videoId/captions/generate`
Generate captions for a video

**Request Body:**
```json
{
  "languages": ["en", "es"],
  "captionType": "full",
  "useChannelStyle": true,
  "customStyle": {
    "font": {
      "family": "Arial",
      "size": 42
    }
  }
}
```

**Validation:**
- `languages`: Array of ISO 639-1 language codes
- `captionType`: 'full', 'keywords', 'descriptions', 'bilingual'
- `useChannelStyle`: Boolean (requires connected channel)
- `customStyle`: Optional style override

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "uuid",
    "captions": [
      {
        "id": "uuid",
        "language": "en",
        "type": "full",
        "format": "srt",
        "fileUrl": "https://storage/captions/video-en.srt",
        "downloadUrl": "https://api/captions/uuid/download",
        "wordCount": 1250,
        "duration": 1200,
        "confidenceScore": 0.96
      },
      {
        "id": "uuid",
        "language": "es",
        "type": "full",
        "format": "srt",
        "fileUrl": "https://storage/captions/video-es.srt",
        "downloadUrl": "https://api/captions/uuid/download",
        "wordCount": 1320,
        "duration": 1200,
        "confidenceScore": 0.94
      }
    ],
    "transcriptionCost": 0.12,
    "processingTime": 45,
    "transcriptionApi": "whisper"
  }
}
```

---

### `GET /videos/:videoId/captions`
Get all captions for a video

**Query Parameters:**
- `language` (string, optional): Filter by language code
- `type` (string, optional): Filter by caption type

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "uuid",
    "captions": [
      {
        "id": "uuid",
        "language": "en",
        "type": "full",
        "format": "srt",
        "fileUrl": "https://storage/captions/video-en.srt",
        "downloadUrl": "https://api/captions/uuid/download",
        "wordCount": 1250,
        "createdAt": "2025-11-13T12:00:00Z"
      }
    ]
  }
}
```

---

### `GET /captions/:captionId/download`
Download caption file

**Query Parameters:**
- `format` (string, optional): 'srt', 'vtt', 'ass' (defaults to stored format)

**Response:** Caption file content with appropriate Content-Type header

**Example SRT Response:**
```
1
00:00:00,000 --> 00:00:03,500
On the night of August 31st, 1888,
something terrible happened in London.

2
00:00:03,500 --> 00:00:07,200
Mary Ann Nichols became the first victim
of the infamous Jack the Ripper.
```

---

### `GET /captions/:captionId/segments`
Get individual caption segments with timestamps

**Query Parameters:**
- `startTime` (number, optional): Filter segments after this time (seconds)
- `endTime` (number, optional): Filter segments before this time (seconds)

**Response:**
```json
{
  "success": true,
  "data": {
    "captionId": "uuid",
    "segments": [
      {
        "id": "uuid",
        "sequence": 1,
        "startTime": 0.0,
        "endTime": 3.5,
        "text": "On the night of August 31st, 1888...",
        "speakerLabel": null,
        "isSoundEffect": false,
        "isMusicCue": false,
        "keywords": ["August 31st", "1888"],
        "confidenceScore": 0.98
      },
      {
        "id": "uuid",
        "sequence": 2,
        "startTime": 3.5,
        "endTime": 7.2,
        "text": "Mary Ann Nichols became the first victim...",
        "speakerLabel": null,
        "isSoundEffect": false,
        "isMusicCue": false,
        "keywords": ["Mary Ann Nichols", "first victim"],
        "confidenceScore": 0.97
      }
    ],
    "totalSegments": 2
  }
}
```

---

### `PUT /channels/:channelId/caption-style`
Update or override channel's caption style

**Request Body:**
```json
{
  "captionDNA": {
    "visual": {
      "font": {
        "family": "Arial Bold",
        "size": 48,
        "color": "#FFFFFF"
      },
      "positioning": {
        "vertical": "bottom",
        "horizontal": "center"
      }
    },
    "animation": {
      "type": "fade",
      "duration": 0.3
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "channelId": "uuid",
    "captionDNA": { /* updated style */ },
    "updatedAt": "2025-11-13T12:00:00Z"
  }
}
```

---

### `GET /transcription-jobs/:jobId`
Get transcription job status

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "videoId": "uuid",
    "status": "processing",
    "apiProvider": "whisper",
    "jobId": "whisper_job_123",
    "processingTime": 30,
    "createdAt": "2025-11-13T12:00:00Z"
  }
}
```

---

## ⚖️ Copyright Detection

### `POST /copyright/scan`
Scan uploaded media for copyright issues

**Request Body:**
```json
{
  "mediaId": "uuid",
  "scanTypes": ["image", "video", "audio"],
  "priority": "normal"
}
```

**Validation:**
- `mediaId`: Required, valid UUID
- `scanTypes`: Optional, auto-detected if not provided
- `priority`: 'low', 'normal', 'high'

**Response:**
```json
{
  "success": true,
  "data": {
    "scanId": "uuid",
    "mediaId": "uuid",
    "status": "scanning",
    "estimatedTime": 30
  }
}
```

---

### `GET /copyright/scan/:scanId`
Get copyright scan status and results

**Response:**
```json
{
  "success": true,
  "data": {
    "scanId": "uuid",
    "mediaId": "uuid",
    "status": "completed",
    "riskLevel": "medium",
    "riskScore": 45,
    "riskFactors": [
      "Found on stock photo sites",
      "Widely distributed online"
    ],
    "matches": [
      {
        "id": "uuid",
        "type": "reverse_image",
        "source": "Getty Images",
        "sourceUrl": "https://gettyimages.com/...",
        "confidence": 0.92,
        "copyrightHolder": "Getty Images",
        "licenseType": "all_rights_reserved"
      },
      {
        "id": "uuid",
        "type": "reverse_image",
        "source": "CNN.com",
        "sourceUrl": "https://cnn.com/...",
        "confidence": 0.88,
        "copyrightHolder": "CNN",
        "licenseType": "all_rights_reserved"
      }
    ],
    "recommendation": "Review matches and confirm rights",
    "processingTime": 28,
    "cost": 0.04,
    "completedAt": "2025-11-13T12:00:00Z"
  }
}
```

---

### `GET /media/:mediaId/copyright`
Get copyright status for specific media

**Response:**
```json
{
  "success": true,
  "data": {
    "mediaId": "uuid",
    "hasScan": true,
    "latestScan": {
      "scanId": "uuid",
      "riskLevel": "low",
      "riskScore": 15,
      "scannedAt": "2025-11-13T12:00:00Z"
    },
    "userAcknowledged": false,
    "blocked": false
  }
}
```

---

### `POST /copyright/acknowledge`
User acknowledges copyright risk and confirms rights

**Request Body:**
```json
{
  "mediaId": "uuid",
  "scanId": "uuid",
  "confirmation": "I confirm I have the legal right to use this content"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "acknowledgmentId": "uuid",
    "mediaId": "uuid",
    "scanId": "uuid",
    "riskLevel": "medium",
    "riskScore": 45,
    "acknowledged": true,
    "timestamp": "2025-11-13T12:00:00Z"
  }
}
```

---

### `GET /videos/:videoId/copyright-report`
Get comprehensive copyright report for generated video

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "uuid",
    "projectId": "uuid",
    "totalMedia": 25,
    "scannedMedia": 25,
    "riskSummary": {
      "low": 20,
      "medium": 4,
      "high": 1
    },
    "blockedMedia": [
      {
        "mediaId": "uuid",
        "filename": "getty-watermark.jpg",
        "reason": "Watermark detected",
        "riskScore": 85,
        "riskLevel": "high"
      }
    ],
    "acknowledgedRisks": [
      {
        "mediaId": "uuid",
        "filename": "news-photo.jpg",
        "riskLevel": "medium",
        "riskScore": 45,
        "userConfirmed": true,
        "confirmedAt": "2025-11-13T11:00:00Z"
      }
    ],
    "stockFootage": [
      {
        "mediaId": "uuid",
        "filename": "pexels-london-street.mp4",
        "source": "Pexels",
        "license": "Pexels License",
        "attributionRequired": false,
        "photographer": "John Doe"
      }
    ],
    "safeToPublish": false,
    "warnings": [
      "1 high-risk media file blocked",
      "4 medium-risk files require user confirmation"
    ],
    "generatedAt": "2025-11-13T12:00:00Z"
  }
}
```

---

### `POST /copyright/verify-stock-license`
Verify and store stock footage license information

**Request Body:**
```json
{
  "mediaId": "uuid",
  "sourceApi": "pexels",
  "sourceId": "12345",
  "sourceUrl": "https://pexels.com/photo/12345"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "licenseId": "uuid",
    "mediaId": "uuid",
    "verified": true,
    "license": {
      "type": "Pexels License",
      "url": "https://pexels.com/license",
      "commercialUse": true,
      "attributionRequired": false,
      "modificationAllowed": true,
      "photographer": "John Doe",
      "photographerUrl": "https://pexels.com/@johndoe"
    },
    "verifiedAt": "2025-11-13T12:00:00Z"
  }
}
```

---

### `POST /copyright/blocklist` (Admin Only)
Add known copyrighted content to blocklist

**Request Body:**
```json
{
  "contentType": "image",
  "identifier": "abc123hash",
  "identifierType": "perceptual_hash",
  "copyrightHolder": "Getty Images",
  "sourceName": "Getty Images",
  "reason": "Known copyrighted stock photo"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "blocklistId": "uuid",
    "added": true,
    "timestamp": "2025-11-13T12:00:00Z"
  }
}
```

---

### `GET /copyright/blocklist/check`
Check if content matches blocklist

**Query Parameters:**
- `identifier` (string, required): Hash or fingerprint
- `identifierType` (string, required): Type of identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "blocked": true,
    "match": {
      "id": "uuid",
      "contentType": "image",
      "copyrightHolder": "Getty Images",
      "reason": "Known copyrighted stock photo",
      "addedAt": "2025-11-01T10:00:00Z"
    }
  }
}
```

---

## 🔄 Combined Workflows

### `POST /projects/:projectId/media/upload-and-scan`
Upload media and automatically scan for copyright

**Request:** `multipart/form-data`
```
file: <binary>
tags: ["Crime Scene", "Victorian London"]
autoScan: true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "media": {
      "id": "uuid",
      "fileUrl": "https://storage/...",
      "fileName": "crime-scene.jpg",
      "fileType": "image",
      "tags": ["Crime Scene", "Victorian London"]
    },
    "copyrightScan": {
      "scanId": "uuid",
      "status": "scanning",
      "estimatedTime": 30
    }
  }
}
```

---

### `POST /projects/:projectId/generate-with-captions`
Generate video with automatic caption generation

**Request Body:**
```json
{
  "autoPublish": false,
  "enableCaptions": true,
  "captionLanguages": ["en", "es"],
  "captionType": "full",
  "useChannelStyle": true,
  "youtubeTitle": "The Untold Story of Jack the Ripper",
  "youtubeDescription": "A deep dive into...",
  "youtubeTags": ["true crime", "history", "jack the ripper"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "renderId": "uuid",
    "status": "queued",
    "estimatedTime": 600,
    "captionsEnabled": true,
    "captionLanguages": ["en", "es"],
    "message": "Video generation with captions started"
  }
}
```

---

### `GET /projects/:projectId/pre-publish-check`
Comprehensive pre-publish check (copyright + captions)

**Response:**
```json
{
  "success": true,
  "data": {
    "projectId": "uuid",
    "readyToPublish": false,
    "copyright": {
      "totalMedia": 25,
      "scanned": 25,
      "safe": 20,
      "needsReview": 4,
      "blocked": 1,
      "safeToPublish": false
    },
    "captions": {
      "generated": true,
      "languages": ["en", "es"],
      "accuracy": 0.96,
      "readyToPublish": true
    },
    "blockers": [
      {
        "type": "copyright",
        "severity": "high",
        "message": "1 media file blocked due to copyright",
        "mediaId": "uuid",
        "action": "Remove or replace this media"
      }
    ],
    "warnings": [
      {
        "type": "copyright",
        "severity": "medium",
        "message": "4 media files need user confirmation",
        "action": "Review and acknowledge copyright risks"
      }
    ],
    "checkedAt": "2025-11-13T12:00:00Z"
  }
}
```

---

## 📊 Batch Operations

### `POST /copyright/scan-batch`
Scan multiple media files at once

**Request Body:**
```json
{
  "mediaIds": ["uuid1", "uuid2", "uuid3"],
  "priority": "normal"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "batchId": "uuid",
    "totalMedia": 3,
    "scansStarted": 3,
    "estimatedTime": 90,
    "scanIds": ["scan_uuid1", "scan_uuid2", "scan_uuid3"]
  }
}
```

---

### `GET /copyright/scan-batch/:batchId`
Get batch scan status

**Response:**
```json
{
  "success": true,
  "data": {
    "batchId": "uuid",
    "totalMedia": 3,
    "completed": 2,
    "pending": 1,
    "failed": 0,
    "results": [
      {
        "mediaId": "uuid1",
        "scanId": "scan_uuid1",
        "status": "completed",
        "riskLevel": "low"
      },
      {
        "mediaId": "uuid2",
        "scanId": "scan_uuid2",
        "status": "completed",
        "riskLevel": "medium"
      },
      {
        "mediaId": "uuid3",
        "scanId": "scan_uuid3",
        "status": "scanning",
        "riskLevel": null
      }
    ]
  }
}
```

---

## 🔔 Webhooks

### Caption Generation Complete
```http
POST https://your-app.com/webhooks/captions-complete
Content-Type: application/json

{
  "event": "captions.generation.completed",
  "data": {
    "videoId": "uuid",
    "captionIds": ["uuid1", "uuid2"],
    "languages": ["en", "es"],
    "processingTime": 45,
    "completedAt": "2025-11-13T12:30:00Z"
  }
}
```

---

### Copyright Scan Complete
```http
POST https://your-app.com/webhooks/copyright-scan-complete
Content-Type: application/json

{
  "event": "copyright.scan.completed",
  "data": {
    "scanId": "uuid",
    "mediaId": "uuid",
    "riskLevel": "medium",
    "riskScore": 45,
    "requiresAction": true,
    "completedAt": "2025-11-13T12:30:00Z"
  }
}
```

---

### High Risk Copyright Detected
```http
POST https://your-app.com/webhooks/copyright-high-risk
Content-Type: application/json

{
  "event": "copyright.high_risk_detected",
  "data": {
    "scanId": "uuid",
    "mediaId": "uuid",
    "riskLevel": "high",
    "riskScore": 85,
    "blocked": true,
    "reason": "Watermark detected",
    "detectedAt": "2025-11-13T12:30:00Z"
  }
}
```

---

## ⚠️ Additional Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `SCAN_IN_PROGRESS` | 409 | Media already being scanned |
| `SCAN_FAILED` | 500 | Copyright scan failed |
| `HIGH_RISK_BLOCKED` | 403 | Media blocked due to high copyright risk |
| `TRANSCRIPTION_FAILED` | 500 | Caption transcription failed |
| `UNSUPPORTED_LANGUAGE` | 400 | Language not supported for captions |
| `CHANNEL_NOT_CONNECTED` | 400 | Channel must be connected first |
| `QUOTA_EXCEEDED` | 429 | API quota exceeded |

---

## 📈 Cost Tracking

### `GET /usage/copyright-scans`
Get copyright scan usage and costs

**Query Parameters:**
- `startDate` (string, optional): ISO 8601 date
- `endDate` (string, optional): ISO 8601 date

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-11-01T00:00:00Z",
      "end": "2025-11-13T23:59:59Z"
    },
    "totalScans": 150,
    "scansByType": {
      "image": 100,
      "video": 40,
      "audio": 10
    },
    "totalCost": 6.50,
    "costByApi": {
      "google_vision": 1.50,
      "tineye": 4.00,
      "acrcloud": 0.40,
      "youtube_content_id": 0.00,
      "processing": 0.60
    },
    "averageCostPerScan": 0.043
  }
}
```

---

### `GET /usage/captions`
Get caption generation usage and costs

**Query Parameters:**
- `startDate` (string, optional): ISO 8601 date
- `endDate` (string, optional): ISO 8601 date

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-11-01T00:00:00Z",
      "end": "2025-11-13T23:59:59Z"
    },
    "totalCaptions": 50,
    "totalMinutes": 1000,
    "languageBreakdown": {
      "en": 50,
      "es": 25,
      "fr": 10
    },
    "totalCost": 12.00,
    "costByApi": {
      "whisper": 10.00,
      "assemblyai": 1.50,
      "storage": 0.50
    },
    "averageCostPerVideo": 0.24
  }
}
```

---

## 🧪 Testing & Development

### `POST /test/copyright-scan` (Development Only)
Test copyright scan with mock data

**Request Body:**
```json
{
  "mediaId": "uuid",
  "mockRiskLevel": "medium",
  "mockMatches": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scanId": "uuid",
    "status": "completed",
    "riskLevel": "medium",
    "note": "This is a test scan with mock data"
  }
}
```

---

### `POST /test/caption-generation` (Development Only)
Test caption generation with mock data

**Request Body:**
```json
{
  "videoId": "uuid",
  "mockDuration": 600,
  "mockLanguages": ["en"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "captionId": "uuid",
    "status": "completed",
    "note": "This is a test caption with mock data"
  }
}
```

---

**Related Documentation:**
- [Caption System Architecture](./CAPTION-SYSTEM.md)
- [Copyright Detection System Architecture](./COPYRIGHT-DETECTION-SYSTEM.md)
- [Main API Design](./API-DESIGN.md)
- [Database Schema](./DATABASE-SCHEMA.md)
