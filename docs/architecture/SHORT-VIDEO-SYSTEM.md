# 🎬 Short Video Generation System

**Last Updated:** November 13, 2025

---

## Overview

The **Short Video System** automatically generates platform-optimized short-form content (TikTok, Instagram Reels, YouTube Shorts) from long-form videos. After GPT-5 creates the full documentary-style video, it intelligently extracts the most engaging moments and reformats them for short-form platforms.

### Key Capabilities
- **Automatic Extraction** - GPT-5 identifies viral-worthy moments from long video
- **Multi-Platform Output** - TikTok (15-60s), Reels (15-90s), Shorts (15-60s)
- **Intelligent Reformatting** - Vertical format (9:16), optimized pacing, platform-specific hooks
- **Batch Generation** - Create 3-10 shorts from a single long video
- **Channel Style Consistency** - Maintains your brand across all formats
- **Zero Extra Work** - Same media library, automatic generation

---

## The Problem

Content creators need to be on **multiple platforms** but face challenges:
- **Time-Consuming** - Manually editing shorts from long videos takes hours
- **Different Formats** - Vertical vs horizontal, different aspect ratios
- **Platform Optimization** - Each platform has different best practices
- **Engagement Patterns** - Shorts need different hooks and pacing than long videos
- **Content Repurposing** - Same story, different format requirements

**Current Solutions:**
- Tools like OpusClip, Vizard, Klap extract shorts from long videos
- But they don't understand your channel's style or maintain brand consistency

---

## The Solution

**Tubey's Short Video System:**
1. GPT-5 creates your long-form video (20-45 minutes)
2. GPT-5 analyzes the video and identifies **viral moments**
3. Extracts 3-10 short clips (15-90 seconds each)
4. Reformats to vertical (9:16) with smart cropping
5. Adds platform-specific hooks and captions
6. Maintains your channel's style and tone
7. Auto-publishes to TikTok, Instagram, YouTube Shorts

---

## How It Works

### Step 1: Long Video Generation
User generates a 24-minute true crime documentary about Jack the Ripper using Tubey's standard workflow.

### Step 2: Enable Short Video Generation
**During video generation:**
- ☑️ Generate short videos from this content
- Platform targets: TikTok, Instagram Reels, YouTube Shorts
- Number of shorts: 5 clips
- Duration preference: 30-60 seconds

### Step 3: GPT-5 Analyzes Long Video
GPT-5 reviews the full video script and identifies:
- **Hook Moments** - Questions, shocking reveals, cliffhangers
- **Emotional Peaks** - Tension, mystery, resolution
- **Visual Interest** - Compelling imagery, expert interviews
- **Story Completeness** - Self-contained narrative arcs
- **Viral Potential** - Engagement triggers, shareability

**Example Analysis:**
```
Long Video: "The Untold Story of Jack the Ripper's First Victim" (24 min)

GPT-5 Identifies 5 Viral Moments:
1. "The Evidence Police Missed" (45s) - Crime scene revelation
2. "Who Was Mary Ann Nichols?" (38s) - Victim's untold story  
3. "The Suspect They Ignored" (52s) - New theory reveal
4. "Victorian London's Dark Secret" (41s) - Historical context
5. "Why This Case Still Matters" (35s) - Modern relevance
```

### Step 4: Intelligent Extraction
For each identified moment, GPT-5:
1. **Selects Timeline** - Identifies exact start/end timestamps
2. **Analyzes Composition** - Determines best crop for vertical format
3. **Rewrites Hook** - Creates platform-specific opening (3-5 seconds)
4. **Adjusts Pacing** - Speeds up or tightens for short-form attention
5. **Optimizes Captions** - Larger text, keyword emphasis, emoji support
6. **Selects Music** - Higher energy background music for shorts

### Step 5: Format Conversion
**Technical Processing:**
- **Aspect Ratio:** 16:9 → 9:16 (vertical)
- **Resolution:** 1080x1920 (portrait)
- **Smart Cropping:** AI-powered face/subject tracking
- **Frame Rate:** 30fps or 60fps (platform optimized)
- **Bitrate:** Higher quality for mobile viewing

**Cropping Intelligence:**
- Detects faces and keeps them centered
- Tracks movement across frames
- Zooms in on key visual elements
- Maintains subject focus throughout clip

### Step 6: Platform Optimization

**TikTok (15-60s):**
- Fast-paced cuts (2-4 second scenes)
- Bold captions with keywords
- Trending music integration
- Hook in first 2 seconds
- Strong CTA at end

**Instagram Reels (15-90s):**
- Slightly slower pacing (3-5 second scenes)
- Aesthetic caption styling
- Music that fits brand
- Visual consistency
- Swipe-up prompts

**YouTube Shorts (15-60s):**
- YouTube-style thumbnails
- Longer hook (3-5 seconds)
- Subscribe reminders
- Link to full video
- End screen elements

### Step 7: Channel Style Consistency
Each short maintains your channel's learned style:
- **Tone** - Serious, investigative (not clickbait)
- **Voice** - Same phrases and language
- **Captions** - Matching font and style
- **Branding** - Logo, colors, intro/outro
- **Music** - Consistent with channel preferences

### Step 8: Preview & Approve
User sees all generated shorts:
```
Short Video Preview Dashboard:

1. "The Evidence Police Missed" (45s)
   Platform: TikTok, Reels, Shorts
   Hook: "Police overlooked THIS crucial detail..."
   Engagement Score: 94/100
   [Preview] [Edit] [Remove]

2. "Who Was Mary Ann Nichols?" (38s)
   Platform: TikTok, Reels, Shorts
   Hook: "Before she became a victim, she was..."
   Engagement Score: 89/100
   [Preview] [Edit] [Remove]

[Approve All] [Customize] [Regenerate]
```

### Step 9: Auto-Publish
- Shorts published to selected platforms
- Optimized metadata for each platform
- Links back to full video on YouTube
- Scheduled posting for maximum reach

---

## GPT-5 Intelligence

### Moment Identification Algorithm
GPT-5 analyzes the long video script and scores each segment:

**Scoring Criteria (0-100):**
1. **Hook Strength** (25 points) - Does it grab attention immediately?
2. **Emotional Impact** (20 points) - Does it evoke strong emotion?
3. **Visual Interest** (20 points) - Is it visually compelling?
4. **Story Completeness** (20 points) - Is it self-contained?
5. **Viral Potential** (15 points) - Is it shareable/engaging?

**Example Scoring:**
```
Segment: "The Evidence Police Missed" (Timestamp: 8:32-9:17)

Hook Strength: 24/25 - Opens with shocking question
Emotional Impact: 18/20 - Creates tension and curiosity
Visual Interest: 19/20 - Crime scene photos + detective interview
Story Completeness: 17/20 - Reveals one key piece of evidence
Viral Potential: 14/15 - Highly shareable, comment-worthy

TOTAL SCORE: 92/100 ✅ Selected for Short Video
```

### Smart Cropping AI
**Face Detection & Tracking:**
- Identifies all faces in frame
- Prioritizes speaker/main subject
- Maintains face in center third of vertical frame
- Smooth tracking across camera movements

**Subject Focus:**
- Detects text overlays and keeps them visible
- Identifies key visual elements (evidence, photos, maps)
- Zooms in on important details
- Maintains visual hierarchy

**Motion Compensation:**
- Predicts subject movement
- Adjusts crop dynamically
- Prevents jarring jumps
- Smooth transitions between scenes

### Platform-Specific Hooks
GPT-5 rewrites the opening for each platform:

**Original Long Video Hook:**
"What really happened on that dark London night in 1888?"

**TikTok Hook (2s):**
"Police missed THIS detail 😱"

**Instagram Reels Hook (3s):**
"The evidence that could have solved the case..."

**YouTube Shorts Hook (4s):**
"In 1888, police overlooked one crucial piece of evidence that could have caught Jack the Ripper."

### Caption Optimization
**Long Video Captions:**
- Smaller text (5% of screen height)
- Bottom third placement
- Full sentences
- Subtle styling

**Short Video Captions:**
- Larger text (8-10% of screen height)
- Center placement for mobile
- Keyword emphasis (bold, color)
- Emoji integration 🔍⚠️
- Word-by-word animation

---

## Technical Architecture

### Processing Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                   SHORT VIDEO PIPELINE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. LONG VIDEO GENERATED                                    │
│     ├─ Full 24-minute video rendered                        │
│     ├─ Script with timestamps                               │
│     └─ Media library with all assets                        │
│                                                              │
│  2. GPT-5 MOMENT ANALYSIS                                   │
│     ├─ Parse script into segments                           │
│     ├─ Score each segment (0-100)                           │
│     ├─ Select top N moments (user preference)               │
│     └─ Generate platform-specific hooks                     │
│                                                              │
│  3. VIDEO EXTRACTION                                        │
│     ├─ FFmpeg extracts timestamp ranges                     │
│     ├─ Preserves audio sync                                 │
│     ├─ Maintains quality (no re-encoding)                   │
│     └─ Creates temporary clips                              │
│                                                              │
│  4. FORMAT CONVERSION                                       │
│     ├─ AI-powered smart cropping (16:9 → 9:16)             │
│     ├─ Face detection & tracking                            │
│     ├─ Resolution upscale (1080x1920)                       │
│     └─ Frame rate optimization                              │
│                                                              │
│  5. PLATFORM OPTIMIZATION                                   │
│     ├─ Add platform-specific hooks (2-5s)                   │
│     ├─ Optimize captions (size, position, style)            │
│     ├─ Adjust music volume/energy                           │
│     ├─ Add branding elements                                │
│     └─ Generate metadata                                    │
│                                                              │
│  6. QUALITY ASSURANCE                                       │
│     ├─ Verify audio sync                                    │
│     ├─ Check caption readability                            │
│     ├─ Validate aspect ratio                                │
│     └─ Test on mobile preview                               │
│                                                              │
│  7. USER PREVIEW                                            │
│     ├─ Show all generated shorts                            │
│     ├─ Display engagement scores                            │
│     ├─ Allow edits/removal                                  │
│     └─ Mobile preview simulation                            │
│                                                              │
│  8. PUBLISH                                                 │
│     ├─ Upload to TikTok API                                 │
│     ├─ Upload to Instagram Graph API                        │
│     ├─ Upload to YouTube Shorts API                         │
│     └─ Schedule for optimal posting times                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### FFmpeg Commands

**Extract Clip:**
```bash
ffmpeg -i long_video.mp4 \
  -ss 00:08:32 \
  -to 00:09:17 \
  -c copy \
  extracted_clip.mp4
```

**Convert to Vertical (Smart Crop):**
```bash
ffmpeg -i extracted_clip.mp4 \
  -vf "crop=ih*9/16:ih,scale=1080:1920" \
  -c:v libx264 \
  -preset slow \
  -crf 18 \
  -c:a copy \
  vertical_clip.mp4
```

**AI-Powered Smart Crop (with face tracking):**
```bash
ffmpeg -i extracted_clip.mp4 \
  -vf "crop=ih*9/16:ih:iw/2-ih*9/32:0,scale=1080:1920" \
  -c:v libx264 \
  -preset slow \
  -crf 18 \
  vertical_smart.mp4
```

### Database Schema

**New Table: `short_videos`**
```sql
CREATE TABLE short_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  long_video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  
  -- Clip Details
  title TEXT NOT NULL,
  duration INTEGER NOT NULL, -- seconds
  start_timestamp INTEGER NOT NULL, -- seconds in long video
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
  hook_text TEXT, -- Platform-specific hook
  caption_style JSONB, -- Platform-specific caption styling
  
  -- Processing
  status TEXT DEFAULT 'pending', -- pending, processing, ready, published, failed
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

---

## User Interface

### Generation Settings

**During Video Creation:**
```
┌─────────────────────────────────────────────────────────┐
│  Generate Video                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Title: The Untold Story of Jack the Ripper's First... │
│  Target Channel: True Crime Daily                      │
│                                                         │
│  ☑️ Generate short videos from this content            │
│                                                         │
│  Platform Targets:                                      │
│  ☑️ TikTok (15-60s)                                     │
│  ☑️ Instagram Reels (15-90s)                            │
│  ☑️ YouTube Shorts (15-60s)                             │
│                                                         │
│  Number of shorts: [5] ▼                                │
│  Duration preference: [30-60 seconds] ▼                 │
│                                                         │
│  ⚡ AI will automatically identify the most engaging    │
│     moments from your long video                        │
│                                                         │
│  [Generate Video + Shorts]                              │
└─────────────────────────────────────────────────────────┘
```

### Preview Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  Short Videos Generated (5)                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 1. "The Evidence Police Missed"                 │   │
│  │    Duration: 45s | Score: 94/100                │   │
│  │    ┌─────────┐                                  │   │
│  │    │ [THUMB] │  Hook: "Police overlooked THIS   │   │
│  │    │  9:16   │  crucial detail..."              │   │
│  │    └─────────┘                                  │   │
│  │    Platforms: 📱 TikTok | 📷 Reels | ▶️ Shorts  │   │
│  │    [Preview] [Edit Hook] [Remove]               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 2. "Who Was Mary Ann Nichols?"                  │   │
│  │    Duration: 38s | Score: 89/100                │   │
│  │    ┌─────────┐                                  │   │
│  │    │ [THUMB] │  Hook: "Before she became a      │   │
│  │    │  9:16   │  victim, she was..."             │   │
│  │    └─────────┘                                  │   │
│  │    Platforms: 📱 TikTok | 📷 Reels | ▶️ Shorts  │   │
│  │    [Preview] [Edit Hook] [Remove]               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Approve All] [Regenerate] [Customize]                │
└─────────────────────────────────────────────────────────┘
```

### Mobile Preview

```
┌─────────────────┐
│   📱 Preview    │
├─────────────────┤
│                 │
│   ┌─────────┐   │
│   │         │   │
│   │  VIDEO  │   │
│   │  9:16   │   │
│   │         │   │
│   │ POLICE  │   │
│   │ MISSED  │   │
│   │  THIS   │   │
│   │ DETAIL  │   │
│   │   😱    │   │
│   │         │   │
│   └─────────┘   │
│                 │
│  [◀️ Prev] [Next ▶️] │
└─────────────────┘
```

---

## API Endpoints

### Generate Short Videos
```http
POST /api/projects/:projectId/shorts/generate
```

**Request:**
```json
{
  "long_video_id": "uuid",
  "platforms": ["tiktok", "reels", "shorts"],
  "count": 5,
  "duration_range": {
    "min": 30,
    "max": 60
  },
  "auto_publish": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job_id": "uuid",
    "status": "processing",
    "estimated_time": 180,
    "shorts_count": 5
  }
}
```

### List Short Videos
```http
GET /api/projects/:projectId/shorts
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shorts": [
      {
        "id": "uuid",
        "title": "The Evidence Police Missed",
        "duration": 45,
        "engagement_score": 94,
        "hook_text": "Police overlooked THIS crucial detail...",
        "platforms": ["tiktok", "reels", "shorts"],
        "status": "ready",
        "file_url": "https://...",
        "thumbnail_url": "https://..."
      }
    ],
    "total": 5
  }
}
```

### Publish Short Video
```http
POST /api/shorts/:shortId/publish
```

**Request:**
```json
{
  "platforms": ["tiktok", "reels"],
  "schedule": "2025-11-14T18:00:00Z",
  "metadata": {
    "tiktok": {
      "caption": "Police missed this detail 😱 #truecrime #mystery",
      "hashtags": ["truecrime", "mystery", "unsolved"]
    },
    "reels": {
      "caption": "The evidence that could have solved the case...",
      "location": "London, UK"
    }
  }
}
```

---

## Cost Analysis

### Processing Costs

**Per Short Video (45 seconds):**
- GPT-5 Analysis: $0.02 (moment identification + hook generation)
- FFmpeg Processing: $0.00 (self-hosted)
- Smart Cropping AI: $0.03 (face detection + tracking)
- Storage (3 months): $0.01
- **Total per short: $0.06**

**Per Long Video (5 shorts generated):**
- Total: $0.30 (5 shorts × $0.06)

### Platform API Costs
- TikTok API: Free (standard rate limits)
- Instagram Graph API: Free (standard rate limits)
- YouTube Data API: Free (10,000 quota/day)

### Total Cost Example
**True Crime Channel (1 video/week):**
- Long video generation: $2.50
- 5 short videos: $0.30
- **Total per video: $2.80**
- **Monthly (4 videos): $11.20**

---

## Competitive Analysis

### Existing Tools

**OpusClip:**
- ✅ Auto-generates shorts from long videos
- ✅ AI-powered moment detection
- ❌ Doesn't learn your channel style
- ❌ Generic hooks and captions
- ❌ No brand consistency
- 💰 $29/month

**Vizard:**
- ✅ Extracts viral moments
- ✅ Multi-platform export
- ❌ No channel learning
- ❌ Manual editing required
- ❌ Separate from video creation
- 💰 $39/month

**Klap:**
- ✅ Fast processing
- ✅ Auto-captions
- ❌ No style consistency
- ❌ Limited customization
- ❌ Standalone tool
- 💰 $29/month

### Tubey's Advantage

**Integrated Workflow:**
- ✅ Generate long + short videos together
- ✅ Same media library, zero extra work
- ✅ Maintains channel style across all formats
- ✅ GPT-5 understands your brand
- ✅ One platform for everything
- 💰 Included in Tubey subscription

**Channel Learning:**
- ✅ Shorts match your long video style
- ✅ Consistent tone and voice
- ✅ Brand-appropriate hooks
- ✅ Platform-optimized but on-brand

**Quality:**
- ✅ Professional smart cropping
- ✅ AI-powered face tracking
- ✅ High-quality vertical conversion
- ✅ Platform-specific optimization

---

## Implementation Phases

### Phase 1: Core Extraction (Gateway 5.5)
- [ ] GPT-5 moment analysis algorithm
- [ ] Engagement scoring system
- [ ] FFmpeg clip extraction
- [ ] Basic vertical conversion
- **Gateway Test:** Extract 3 shorts from test video

### Phase 2: Smart Cropping (Gateway 5.6)
- [ ] Face detection integration
- [ ] Subject tracking algorithm
- [ ] Dynamic crop adjustment
- [ ] Motion compensation
- **Gateway Test:** Smart crop maintains subject focus

### Phase 3: Platform Optimization (Gateway 5.7)
- [ ] Platform-specific hook generation
- [ ] Caption style optimization
- [ ] Music energy adjustment
- [ ] Branding elements
- **Gateway Test:** Generate shorts for all 3 platforms

### Phase 4: Publishing (Gateway 5.8)
- [ ] TikTok API integration
- [ ] Instagram Graph API integration
- [ ] YouTube Shorts API integration
- [ ] Scheduled posting
- **Gateway Test:** Auto-publish to all platforms

---

## Success Metrics

### Quality Metrics
- **Engagement Score Accuracy:** 85%+ correlation with actual performance
- **Smart Crop Quality:** 95%+ subject retention
- **Audio Sync:** 100% perfect sync
- **Processing Speed:** <3 minutes per short

### User Metrics
- **Adoption Rate:** 70%+ of users enable short generation
- **Approval Rate:** 80%+ of generated shorts approved
- **Time Saved:** 2-3 hours per video (vs manual editing)
- **Platform Reach:** 3x more platforms with same effort

### Business Metrics
- **Conversion:** 40% increase in Pro plan upgrades
- **Retention:** 25% improvement in user retention
- **Satisfaction:** 90%+ satisfaction with short video quality

---

## Future Enhancements

### Phase 2 Features
- **A/B Testing:** Generate multiple hook variations
- **Trend Integration:** Auto-add trending sounds/effects
- **Series Creation:** Link shorts into multi-part series
- **Analytics:** Track performance across platforms
- **Auto-Optimization:** Learn which moments perform best

### Advanced Features
- **Live Shorts:** Generate shorts from live streams
- **Compilation Shorts:** Combine moments from multiple videos
- **Interactive Elements:** Polls, questions, CTAs
- **Localization:** Generate shorts in multiple languages
- **Custom Templates:** User-defined short video templates

---

## Conclusion

The **Short Video System** transforms Tubey from a long-form video creator into a **complete multi-platform content engine**. By automatically generating platform-optimized shorts from long videos, creators can:

- **Maximize Reach:** Be on TikTok, Reels, and Shorts with zero extra work
- **Save Time:** 2-3 hours saved per video
- **Maintain Brand:** Consistent style across all platforms
- **Increase Engagement:** Viral moments drive traffic to long videos
- **Grow Faster:** 3x more content with same effort

**Key Differentiator:** Unlike standalone tools, Tubey's short generation is **integrated, intelligent, and brand-consistent** - powered by the same GPT-5 that learned your channel's unique style.
