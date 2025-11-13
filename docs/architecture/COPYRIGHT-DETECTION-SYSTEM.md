# ⚖️ Copyright Detection System Architecture

**Last Updated:** November 13, 2025

---

## Overview

The Copyright Detection System protects users from copyright strikes by scanning all uploaded media (images, videos, audio) for potential copyright issues BEFORE video generation. This critical system prevents legal problems, platform penalties, and channel termination.

---

## Why This Matters

### The Risk
- **YouTube Copyright Strikes:** 3 strikes = channel termination
- **Content ID Claims:** Monetization loss, video takedown
- **Legal Liability:** Lawsuits, damages, legal fees
- **Platform Bans:** Permanent account suspension
- **Reputation Damage:** Loss of audience trust

### Target Users Need Protection
- **True Crime Channels:** Often use news footage, crime scene photos
- **Historical Channels:** Archival footage may have unclear rights
- **Missing Persons:** Family photos may have restrictions
- **Nostalgia Channels:** Sports clips, music, TV footage often copyrighted

### Our Responsibility
We MUST protect users by detecting copyright issues before they publish.

---

## Core Features

### 1. **Pre-Upload Detection**
- Scan ALL media before accepting upload
- Block known copyrighted content immediately
- Warn users about potential risks
- Provide education and alternatives

### 2. **Multi-Modal Scanning**
- **Image Detection:** Reverse image search, watermark detection
- **Video Detection:** Content fingerprinting, scene matching
- **Audio Detection:** Music recognition, voice matching
- **Text Detection:** Copyrighted text, trademarked phrases

### 3. **Risk Assessment**
- **Low Risk (Green):** Safe to use, no matches found
- **Medium Risk (Yellow):** Potential match, requires review
- **High Risk (Red):** Known copyright, blocked automatically

### 4. **License Verification**
- Verify stock footage licenses
- Track attribution requirements
- Store license proof
- Auto-generate attribution text

### 5. **User Education**
- Explain copyright basics
- Suggest alternatives
- Provide safe sources
- Link to legal resources

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              COPYRIGHT DETECTION PIPELINE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. MEDIA UPLOAD                                     │  │
│  │                                                      │  │
│  │  User uploads: Image / Video / Audio                │  │
│  │  ↓                                                   │  │
│  │  Pre-validation:                                     │  │
│  │    - File type check                                │  │
│  │    - File size validation                           │  │
│  │    - Malware scan                                   │  │
│  │    - Metadata extraction                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  2. COPYRIGHT SCAN DISPATCH                          │  │
│  │                                                      │  │
│  │  Route to appropriate scanner based on media type:  │  │
│  │    - Images → Image Scanner                         │  │
│  │    - Videos → Video Scanner                         │  │
│  │    - Audio → Audio Scanner                          │  │
│  │  Run scans in parallel for efficiency               │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  3. IMAGE SCANNER                                    │  │
│  │                                                      │  │
│  │  APIs Used:                                          │  │
│  │    - Google Vision API (reverse image search)       │  │
│  │    - TinEye API (image matching)                    │  │
│  │    - Custom watermark detector                      │  │
│  │                                                      │  │
│  │  Checks:                                             │  │
│  │    ✓ Reverse image search for matches               │  │
│  │    ✓ Watermark detection (Getty, Shutterstock)      │  │
│  │    ✓ Known copyrighted image database               │  │
│  │    ✓ EXIF metadata analysis                         │  │
│  │    ✓ Visual similarity matching                     │  │
│  │                                                      │  │
│  │  Output: Risk score + match details                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  4. VIDEO SCANNER                                    │  │
│  │                                                      │  │
│  │  APIs Used:                                          │  │
│  │    - YouTube Content ID API                         │  │
│  │    - Vimeo Copyright Match                          │  │
│  │    - Custom video fingerprinting                    │  │
│  │                                                      │  │
│  │  Checks:                                             │  │
│  │    ✓ Content ID database matching                   │  │
│  │    ✓ Scene-by-scene fingerprinting                  │  │
│  │    ✓ Known copyrighted video database               │  │
│  │    ✓ Broadcast content detection                    │  │
│  │    ✓ Movie/TV show detection                        │  │
│  │                                                      │  │
│  │  Output: Risk score + match details                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  5. AUDIO SCANNER                                    │  │
│  │                                                      │  │
│  │  APIs Used:                                          │  │
│  │    - ACRCloud (music recognition)                   │  │
│  │    - Audible Magic                                  │  │
│  │    - Shazam API                                     │  │
│  │                                                      │  │
│  │  Checks:                                             │  │
│  │    ✓ Music recognition and matching                 │  │
│  │    ✓ Voice/speech pattern matching                  │  │
│  │    ✓ Sound effect library matching                  │  │
│  │    ✓ Podcast/radio content detection                │  │
│  │    ✓ Known copyrighted audio database               │  │
│  │                                                      │  │
│  │  Output: Risk score + match details                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  6. RISK ASSESSMENT ENGINE                           │  │
│  │                                                      │  │
│  │  Aggregate all scan results:                        │  │
│  │    - Combine risk scores                            │  │
│  │    - Identify highest risk elements                 │  │
│  │    - Generate detailed report                       │  │
│  │    - Provide recommendations                        │  │
│  │                                                      │  │
│  │  Risk Levels:                                        │  │
│  │    🟢 LOW (0-30):    Safe to use                    │  │
│  │    🟡 MEDIUM (31-70): Review required               │  │
│  │    🔴 HIGH (71-100):  Blocked, do not use           │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  7. USER NOTIFICATION                                │  │
│  │                                                      │  │
│  │  Present results to user:                           │  │
│  │    - Show risk level with color coding              │  │
│  │    - Display match details                          │  │
│  │    - Explain copyright concerns                     │  │
│  │    - Suggest alternatives                           │  │
│  │    - Require confirmation for medium risk           │  │
│  │    - Block high risk uploads                        │  │
│  │                                                      │  │
│  │  User Actions:                                       │  │
│  │    - Accept risk (medium only)                      │  │
│  │    - Remove flagged media                           │  │
│  │    - Replace with alternative                       │  │
│  │    - Contact support for review                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  8. FINAL APPROVAL                                   │  │
│  │                                                      │  │
│  │  If user accepts risk or media is safe:             │  │
│  │    - Store media with copyright scan results        │  │
│  │    - Generate copyright report for video            │  │
│  │    - Track user's copyright acknowledgment          │  │
│  │    - Proceed to video generation                    │  │
│  │                                                      │  │
│  │  If user rejects or media blocked:                  │  │
│  │    - Delete uploaded media                          │  │
│  │    - Log rejection reason                           │  │
│  │    - Suggest alternatives                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Detection Methods

### Image Detection

#### 1. Reverse Image Search
**API:** Google Vision API, TinEye
**Process:**
- Upload image to reverse search API
- Find visually similar images on the web
- Check if matches are from copyrighted sources
- Identify original source and copyright holder

**Risk Indicators:**
- Found on Getty Images, Shutterstock, Adobe Stock
- Found on news websites with copyright notices
- Found on photographer portfolios with © symbol
- EXIF data shows professional camera/studio

#### 2. Watermark Detection
**Method:** Computer vision pattern matching
**Process:**
- Scan image for common watermark patterns
- Detect semi-transparent overlays
- Identify stock photo agency logos
- Check for copyright symbols

**Known Watermarks:**
- Getty Images
- Shutterstock
- iStock
- Adobe Stock
- Alamy
- Reuters
- AP Images

#### 3. EXIF Metadata Analysis
**Process:**
- Extract EXIF data from image
- Check copyright field
- Identify photographer/creator
- Verify licensing information

**Red Flags:**
- Copyright field populated
- Professional camera equipment
- Studio lighting metadata
- Agency attribution

### Video Detection

#### 1. YouTube Content ID
**API:** YouTube Data API v3
**Process:**
- Generate video fingerprint
- Compare against Content ID database
- Identify matching segments
- Report copyright claims

**Detects:**
- Movies and TV shows
- Music videos
- News broadcasts
- Sports footage
- Copyrighted YouTube content

#### 2. Scene Fingerprinting
**Method:** Perceptual hashing
**Process:**
- Extract keyframes from video
- Generate perceptual hash for each frame
- Compare against known copyrighted content
- Identify matching scenes

**Detects:**
- Edited/modified copyrighted content
- Clips from longer videos
- Screen recordings of copyrighted material

#### 3. Broadcast Content Detection
**Method:** Pattern matching + metadata
**Process:**
- Detect TV station logos/watermarks
- Identify news ticker patterns
- Recognize broadcast graphics
- Check for FCC/broadcast metadata

### Audio Detection

#### 1. Music Recognition
**API:** ACRCloud, Shazam
**Process:**
- Generate audio fingerprint
- Match against music database
- Identify song, artist, label
- Check copyright status

**Detects:**
- Commercial music
- Background music in videos
- Podcast theme music
- Sound effects from libraries

#### 2. Voice Pattern Matching
**Method:** Voice fingerprinting
**Process:**
- Extract voice characteristics
- Compare against known voices
- Identify celebrities, public figures
- Check for interview/speech recordings

**Detects:**
- Celebrity interviews
- Podcast clips
- Radio show segments
- Audiobook excerpts

---

## Risk Scoring Algorithm

### Calculation

```javascript
function calculateRiskScore(scanResults) {
  let score = 0;
  let factors = [];

  // Image Risk Factors
  if (scanResults.image) {
    if (scanResults.image.watermarkDetected) {
      score += 40;
      factors.push("Watermark detected");
    }
    if (scanResults.image.reverseSearchMatches > 10) {
      score += 20;
      factors.push("Widely distributed online");
    }
    if (scanResults.image.foundOnStockSites) {
      score += 30;
      factors.push("Found on stock photo sites");
    }
    if (scanResults.image.exifCopyright) {
      score += 25;
      factors.push("Copyright in EXIF data");
    }
  }

  // Video Risk Factors
  if (scanResults.video) {
    if (scanResults.video.contentIdMatch) {
      score += 50;
      factors.push("YouTube Content ID match");
    }
    if (scanResults.video.broadcastDetected) {
      score += 35;
      factors.push("Broadcast content detected");
    }
    if (scanResults.video.movieTvDetected) {
      score += 45;
      factors.push("Movie/TV content detected");
    }
  }

  // Audio Risk Factors
  if (scanResults.audio) {
    if (scanResults.audio.musicRecognized) {
      score += 40;
      factors.push("Copyrighted music detected");
    }
    if (scanResults.audio.voiceMatch) {
      score += 30;
      factors.push("Recognized voice/speaker");
    }
  }

  // Cap at 100
  score = Math.min(score, 100);

  // Determine risk level
  let riskLevel;
  if (score <= 30) riskLevel = "low";
  else if (score <= 70) riskLevel = "medium";
  else riskLevel = "high";

  return {
    score,
    riskLevel,
    factors,
    recommendation: getRiskRecommendation(riskLevel)
  };
}

function getRiskRecommendation(riskLevel) {
  switch(riskLevel) {
    case "low":
      return "Safe to use. No copyright concerns detected.";
    case "medium":
      return "Potential copyright concerns. Review matches and confirm you have rights to use this content.";
    case "high":
      return "High copyright risk. Do not use this content. Find alternative media or obtain proper licensing.";
  }
}
```

---

## Database Schema

```sql
-- Copyright scans for uploaded media
CREATE TABLE copyright_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID REFERENCES media(id) ON DELETE CASCADE,
  scan_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'audio'
  status VARCHAR(50) NOT NULL, -- 'pending', 'scanning', 'completed', 'failed'
  risk_level VARCHAR(20), -- 'low', 'medium', 'high'
  risk_score INTEGER, -- 0-100
  risk_factors TEXT[], -- Array of detected issues
  scan_results JSONB, -- Detailed scan results from all APIs
  apis_used TEXT[], -- ['google_vision', 'tineye', 'acrcloud']
  processing_time_seconds INTEGER,
  cost_usd DECIMAL(10,4),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Individual matches found during scans
CREATE TABLE copyright_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  copyright_scan_id UUID REFERENCES copyright_scans(id) ON DELETE CASCADE,
  match_type VARCHAR(50) NOT NULL, -- 'reverse_image', 'content_id', 'music', etc.
  source_url TEXT, -- Where the match was found
  source_name VARCHAR(255), -- Getty Images, YouTube, etc.
  confidence_score DECIMAL(3,2), -- 0.00-1.00
  match_details JSONB, -- Specific match information
  copyright_holder VARCHAR(255),
  license_type VARCHAR(100), -- 'all_rights_reserved', 'creative_commons', etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User acknowledgments of copyright risks
CREATE TABLE copyright_acknowledgments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  media_id UUID REFERENCES media(id) ON DELETE CASCADE,
  copyright_scan_id UUID REFERENCES copyright_scans(id),
  risk_level VARCHAR(20) NOT NULL,
  risk_score INTEGER NOT NULL,
  user_confirmed BOOLEAN DEFAULT FALSE,
  confirmation_text TEXT, -- What user agreed to
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock footage license tracking
CREATE TABLE stock_footage_licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID REFERENCES media(id) ON DELETE CASCADE,
  source_api VARCHAR(50) NOT NULL, -- 'pexels', 'pixabay', 'unsplash'
  source_id VARCHAR(255) NOT NULL, -- ID from source API
  source_url TEXT NOT NULL,
  license_type VARCHAR(100) NOT NULL, -- 'pexels_license', 'pixabay_license', etc.
  license_url TEXT,
  attribution_required BOOLEAN DEFAULT FALSE,
  attribution_text TEXT,
  commercial_use_allowed BOOLEAN DEFAULT TRUE,
  modification_allowed BOOLEAN DEFAULT TRUE,
  photographer_name VARCHAR(255),
  photographer_url TEXT,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Known copyrighted content database (blocklist)
CREATE TABLE copyrighted_content_blocklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'audio'
  identifier TEXT NOT NULL, -- Hash, fingerprint, or unique ID
  identifier_type VARCHAR(50) NOT NULL, -- 'perceptual_hash', 'content_id', etc.
  copyright_holder VARCHAR(255) NOT NULL,
  source_name VARCHAR(255),
  reason TEXT,
  added_by UUID REFERENCES users(id),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(identifier, identifier_type)
);

-- Copyright scan API usage tracking
CREATE TABLE copyright_api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_name VARCHAR(50) NOT NULL,
  endpoint VARCHAR(255),
  request_count INTEGER DEFAULT 1,
  cost_usd DECIMAL(10,4),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_copyright_scans_media ON copyright_scans(media_id);
CREATE INDEX idx_copyright_scans_risk ON copyright_scans(risk_level);
CREATE INDEX idx_copyright_scans_status ON copyright_scans(status);
CREATE INDEX idx_copyright_matches_scan ON copyright_matches(copyright_scan_id);
CREATE INDEX idx_copyright_matches_type ON copyright_matches(match_type);
CREATE INDEX idx_copyright_acknowledgments_user ON copyright_acknowledgments(user_id);
CREATE INDEX idx_copyright_acknowledgments_media ON copyright_acknowledgments(media_id);
CREATE INDEX idx_stock_licenses_media ON stock_footage_licenses(media_id);
CREATE INDEX idx_stock_licenses_source ON stock_footage_licenses(source_api, source_id);
CREATE INDEX idx_blocklist_identifier ON copyrighted_content_blocklist(identifier, identifier_type);
CREATE INDEX idx_api_usage_date ON copyright_api_usage(date, api_name);
```

---

## API Endpoints

### Scan Media

```
POST /api/copyright/scan
Description: Scan uploaded media for copyright issues
Request Body:
{
  "mediaId": "uuid",
  "scanTypes": ["image", "video", "audio"], // Optional, auto-detected
  "priority": "normal" // 'low', 'normal', 'high'
}
Response:
{
  "scanId": "uuid",
  "mediaId": "uuid",
  "status": "scanning",
  "estimatedTime": 30 // seconds
}
```

### Get Scan Status

```
GET /api/copyright/scan/:scanId
Description: Get current status of copyright scan
Response:
{
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
      "type": "reverse_image",
      "source": "Getty Images",
      "url": "https://gettyimages.com/...",
      "confidence": 0.92
    }
  ],
  "recommendation": "Review matches and confirm rights",
  "processingTime": 28,
  "completedAt": "2025-11-13T06:00:00Z"
}
```

### Get Media Copyright Status

```
GET /api/media/:mediaId/copyright
Description: Get copyright status for specific media
Response:
{
  "mediaId": "uuid",
  "hasScan": true,
  "latestScan": {
    "scanId": "uuid",
    "riskLevel": "low",
    "riskScore": 15,
    "scannedAt": "2025-11-13T06:00:00Z"
  },
  "userAcknowledged": false,
  "blocked": false
}
```

### Acknowledge Copyright Risk

```
POST /api/copyright/acknowledge
Description: User acknowledges copyright risk and confirms rights
Request Body:
{
  "mediaId": "uuid",
  "scanId": "uuid",
  "confirmation": "I confirm I have the legal right to use this content"
}
Response:
{
  "acknowledgmentId": "uuid",
  "mediaId": "uuid",
  "acknowledged": true,
  "timestamp": "2025-11-13T06:00:00Z"
}
```

### Get Video Copyright Report

```
GET /api/videos/:videoId/copyright-report
Description: Get comprehensive copyright report for generated video
Response:
{
  "videoId": "uuid",
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
      "riskScore": 85
    }
  ],
  "acknowledgedRisks": [
    {
      "mediaId": "uuid",
      "filename": "news-photo.jpg",
      "riskLevel": "medium",
      "userConfirmed": true
    }
  ],
  "stockFootage": [
    {
      "mediaId": "uuid",
      "source": "Pexels",
      "license": "Pexels License",
      "attributionRequired": false
    }
  ],
  "generatedAt": "2025-11-13T06:00:00Z"
}
```

### Add to Blocklist

```
POST /api/copyright/blocklist
Description: Add known copyrighted content to blocklist (admin only)
Request Body:
{
  "contentType": "image",
  "identifier": "abc123hash",
  "identifierType": "perceptual_hash",
  "copyrightHolder": "Getty Images",
  "reason": "Known copyrighted stock photo"
}
Response:
{
  "blocklistId": "uuid",
  "added": true,
  "timestamp": "2025-11-13T06:00:00Z"
}
```

### Verify Stock License

```
POST /api/copyright/verify-stock-license
Description: Verify and store stock footage license information
Request Body:
{
  "mediaId": "uuid",
  "sourceApi": "pexels",
  "sourceId": "12345",
  "sourceUrl": "https://pexels.com/photo/12345"
}
Response:
{
  "licenseId": "uuid",
  "verified": true,
  "license": {
    "type": "Pexels License",
    "commercialUse": true,
    "attributionRequired": false,
    "photographer": "John Doe"
  }
}
```

---

## API Integration Details

### Google Vision API

**Purpose:** Reverse image search, watermark detection  
**Endpoint:** `vision.googleapis.com/v1/images:annotate`  
**Cost:** $1.50 per 1,000 images  
**Rate Limit:** 1,800 requests/minute

**Implementation:**
```javascript
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

async function scanImage(imageBuffer) {
  const [result] = await client.webDetection(imageBuffer);
  const webDetection = result.webDetection;
  
  return {
    fullMatchingImages: webDetection.fullMatchingImages,
    partialMatchingImages: webDetection.partialMatchingImages,
    pagesWithMatchingImages: webDetection.pagesWithMatchingImages,
    visuallySimilarImages: webDetection.visuallySimilarImages
  };
}
```

### TinEye API

**Purpose:** Reverse image search  
**Endpoint:** `api.tineye.com/rest/search`  
**Cost:** $200/month for 5,000 searches  
**Rate Limit:** 5 requests/second

### YouTube Content ID API

**Purpose:** Video copyright detection  
**Endpoint:** `youtube.googleapis.com/youtube/v3/videos`  
**Cost:** Free (quota-based)  
**Rate Limit:** 10,000 units/day

### ACRCloud

**Purpose:** Music and audio recognition  
**Endpoint:** `identify-{region}.acrcloud.com/v1/identify`  
**Cost:** $0.004 per recognition  
**Rate Limit:** 2,000 requests/day (free tier)

**Implementation:**
```javascript
const acrcloud = require('acrcloud');

async function recognizeMusic(audioBuffer) {
  const result = await acrcloud.recognize({
    host: 'identify-us-west-2.acrcloud.com',
    access_key: process.env.ACRCLOUD_ACCESS_KEY,
    access_secret: process.env.ACRCLOUD_ACCESS_SECRET,
    data: audioBuffer,
    data_type: 'audio'
  });
  
  return result.metadata?.music || [];
}
```

---

## User Interface Flow

### Upload Screen

```
┌─────────────────────────────────────────┐
│  Upload Media                           │
├─────────────────────────────────────────┤
│                                         │
│  [Drag & Drop or Click to Upload]      │
│                                         │
│  ⚠️ Copyright Notice:                   │
│  All uploads are scanned for copyright │
│  issues. You must have legal rights to │
│  use all media you upload.             │
│                                         │
│  [ ] I confirm I own or have rights    │
│      to use this content                │
│                                         │
│  [Upload]                               │
└─────────────────────────────────────────┘
```

### Scanning Screen

```
┌─────────────────────────────────────────┐
│  Scanning for Copyright Issues...      │
├─────────────────────────────────────────┤
│                                         │
│  📸 image1.jpg                          │
│  ⏳ Scanning... (15s remaining)         │
│                                         │
│  🎥 video1.mp4                          │
│  ✅ Safe to use (Risk: Low)             │
│                                         │
│  🎵 audio1.mp3                          │
│  ⚠️ Potential issue detected            │
│                                         │
└─────────────────────────────────────────┘
```

### Risk Warning Screen (Medium Risk)

```
┌─────────────────────────────────────────┐
│  ⚠️ Copyright Warning                   │
├─────────────────────────────────────────┤
│                                         │
│  File: news-photo.jpg                   │
│  Risk Level: MEDIUM (Score: 45)         │
│                                         │
│  Issues Detected:                       │
│  • Found on 15 websites                 │
│  • Appears on news websites             │
│  • Professional photography detected    │
│                                         │
│  Matches Found:                         │
│  • CNN.com (92% match)                  │
│  • BBC.co.uk (88% match)                │
│  • Reuters.com (85% match)              │
│                                         │
│  ⚠️ This content may be copyrighted.    │
│  Only proceed if you have legal rights. │
│                                         │
│  [ ] I confirm I have rights to use     │
│      this content                       │
│                                         │
│  [Remove Media]  [I Have Rights]        │
│                                         │
│  [Learn About Copyright]                │
└─────────────────────────────────────────┘
```

### Blocked Screen (High Risk)

```
┌─────────────────────────────────────────┐
│  🚫 Upload Blocked                      │
├─────────────────────────────────────────┤
│                                         │
│  File: getty-image.jpg                  │
│  Risk Level: HIGH (Score: 85)           │
│                                         │
│  This content cannot be used:           │
│  • Getty Images watermark detected      │
│  • Known copyrighted stock photo        │
│                                         │
│  ⛔ This upload has been blocked to     │
│  protect your channel from copyright    │
│  strikes.                               │
│                                         │
│  Suggestions:                           │
│  • Use your own original photos         │
│  • Find royalty-free alternatives       │
│  • Purchase proper license              │
│                                         │
│  [Find Free Alternatives]               │
│  [Contact Support]                      │
│  [Remove This File]                     │
└─────────────────────────────────────────┘
```

---

## Cost Analysis

### Per Media Scan

**Image Scan:**
- Google Vision: $0.0015
- TinEye: $0.04 (if used)
- Processing: $0.001
- **Total:** ~$0.04 per image

**Video Scan:**
- YouTube Content ID: Free
- Frame extraction: $0.01
- Processing: $0.02
- **Total:** ~$0.03 per video

**Audio Scan:**
- ACRCloud: $0.004
- Processing: $0.001
- **Total:** ~$0.005 per audio file

### Per Video Project (25 media files)

- 20 images: $0.80
- 4 videos: $0.12
- 1 audio: $0.005
- **Total:** ~$0.93 per video project

### Monthly (100 videos)

- Scanning: $93
- Storage: $5
- API overhead: $10
- **Total:** ~$108/month

---

## Legal Considerations

### Terms of Service

Users must agree to:
1. Only upload content they own or have rights to use
2. Accept responsibility for copyright violations
3. Acknowledge that scans are not 100% accurate
4. Understand that Tubey is not liable for copyright claims
5. Agree to indemnify Tubey against copyright claims

### Disclaimer

```
COPYRIGHT DISCLAIMER

Tubey's copyright detection system is provided as a helpful tool 
to identify potential copyright issues. However:

• Scans are not 100% accurate
• Some copyrighted content may not be detected
• Some flagged content may be fair use or licensed
• Users are solely responsible for ensuring they have rights
• Tubey is not liable for copyright claims or strikes

By using Tubey, you agree to:
• Only upload content you own or have rights to use
• Accept full responsibility for copyright compliance
• Indemnify Tubey against any copyright claims
• Remove content if requested by copyright holders

If you receive a copyright claim, contact support immediately.
```

---

## Fair Use Education

### What is Fair Use?

Provide users with educational content about fair use:

**Fair Use Factors:**
1. **Purpose:** Educational, commentary, criticism, news reporting
2. **Nature:** Factual vs creative works
3. **Amount:** Small portions vs entire work
4. **Effect:** Impact on market value

**Examples for True Crime Channels:**
- ✅ News photos for reporting on cases (fair use likely)
- ✅ Short clips from interviews for commentary (fair use likely)
- ❌ Entire documentary episodes (not fair use)
- ❌ Full songs as background music (not fair use)

**When in Doubt:**
- Consult a lawyer
- Use royalty-free alternatives
- Create your own content
- Obtain proper licenses

---

## Future Enhancements

### Phase 2
- AI-powered fair use analysis
- Automatic license acquisition suggestions
- Integration with stock photo marketplaces
- Bulk scanning for media libraries

### Phase 3
- Real-time scanning during upload
- Blockchain-based rights verification
- Automated DMCA counter-notice generation
- Copyright education courses

---

## Success Metrics

**Protection:**
- 0 copyright strikes for Tubey users
- 95%+ accuracy in detecting copyrighted content
- <1% false positive rate

**Performance:**
- Scan completion ≤ 30 seconds per media file
- 99.9% API uptime
- <5% scan failures

**User Satisfaction:**
- 90%+ users feel protected
- 80%+ understand copyright better
- <10% support tickets about copyright

---

## Conclusion

The Copyright Detection System is a critical component that protects users from legal issues, platform penalties, and channel termination. By scanning all media before video generation and educating users about copyright, we create a safe environment for content creation while maintaining the authenticity that true crime, historical, and documentary channels require.

**Remember:** It's better to block one legitimate upload than to allow one copyright violation that could terminate a user's channel.
