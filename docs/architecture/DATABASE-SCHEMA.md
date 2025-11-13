# 🗄️ Database Schema Design

**Database:** PostgreSQL (via Supabase)  
**Version:** 2.0.0  
**Last Updated:** November 13, 2025

---

## 📊 Entity Relationship Diagram

```
┌─────────────────┐
│     users       │
│  (Supabase Auth)│
└────────┬────────┘
         │
         │ 1:N
         │
┌────────┴────────┐         ┌──────────────────┐
│    channels     │         │    projects      │◄──────────┐
└────────┬────────┘         └────────┬─────────┘           │
         │                           │                     │
         │ 1:1                       │ 1:N                 │ N:1
         │                           │                     │
┌────────┴────────────┐      ┌───────┴────────┐    ┌──────┴──────┐
│channel_caption_     │      │  media_assets  │    │video_renders│
│     styles          │      └───────┬────────┘    └──────┬──────┘
└─────────────────────┘              │                    │
                                     │ 1:N                │ 1:N
                                     │                    │
                              ┌──────┴──────┐      ┌──────┴──────┐
                              │  copyright  │      │   scenes    │
                              │   _scans    │      └──────┬──────┘
                              └─────────────┘             │
                                                          │ 1:N
                                                          │
                                                   ┌──────┴──────┐
                                                   │video_captions│
                                                   └──────┬──────┘
                                                          │ 1:N
                                                          │
                                                   ┌──────┴──────┐
                                                   │caption_     │
                                                   │ segments    │
                                                   └─────────────┘
```

---

## 📋 Table Definitions

### 1. users (Managed by Supabase Auth)
```sql
-- This table is automatically created by Supabase
-- We reference it via foreign keys but don't modify it directly

-- Key fields we use:
-- id: UUID (primary key)
-- email: TEXT
-- created_at: TIMESTAMP
```

---

### 2. channels

**Purpose:** Stores connected channel information for multi-channel support

```sql
CREATE TABLE channels (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Channel Details
  platform VARCHAR(50) NOT NULL, -- 'youtube', 'tiktok', 'instagram'
  channel_id TEXT NOT NULL, -- Platform-specific channel ID
  channel_name TEXT NOT NULL,
  channel_url TEXT,
  subscriber_count INTEGER,
  
  -- OAuth Tokens
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Channel DNA (learned style)
  channel_dna JSONB, -- Stores learned style preferences
  last_analyzed_at TIMESTAMPTZ,
  videos_analyzed INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_platform CHECK (platform IN ('youtube', 'tiktok', 'instagram')),
  UNIQUE(user_id, platform, channel_id)
);

-- Indexes
CREATE INDEX idx_channels_user ON channels(user_id);
CREATE INDEX idx_channels_platform ON channels(platform);
CREATE INDEX idx_channels_active ON channels(is_active);
```

---

### 3. projects

**Purpose:** Stores video project metadata and configuration

```sql
CREATE TABLE projects (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE SET NULL,
  
  -- Project Details
  title TEXT NOT NULL,
  description TEXT,
  target_duration INTEGER NOT NULL DEFAULT 600, -- seconds (10 min default)
  
  -- Status Tracking
  status TEXT NOT NULL DEFAULT 'draft',
  -- Possible values: 'draft', 'processing', 'completed', 'failed'
  
  -- Generated Content
  script TEXT, -- GPT-5 generated script
  script_generated_at TIMESTAMP,
  
  -- Output URLs
  video_url TEXT, -- Final video file URL
  thumbnail_url TEXT, -- Generated thumbnail URL
  youtube_url TEXT, -- Published YouTube video URL
  youtube_video_id TEXT, -- YouTube video ID
  
  -- Metadata
  youtube_title TEXT,
  youtube_description TEXT,
  youtube_tags TEXT[], -- Array of tags
  
  -- Options
  use_stock_footage BOOLEAN DEFAULT FALSE,
  use_channel_style BOOLEAN DEFAULT TRUE,
  enable_captions BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
  CONSTRAINT valid_duration CHECK (target_duration >= 60 AND target_duration <= 2700)
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_channel_id ON projects(channel_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
```

---

### 4. media_assets

**Purpose:** Stores uploaded images and videos with tags for matching

```sql
CREATE TABLE media_assets (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- File Information
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image' or 'video'
  file_size INTEGER NOT NULL, -- bytes
  mime_type TEXT NOT NULL, -- e.g., 'image/jpeg', 'video/mp4'
  
  -- Media Properties
  duration INTEGER, -- seconds (for videos only)
  width INTEGER,
  height INTEGER,
  aspect_ratio TEXT, -- e.g., '16:9', '4:3'
  
  -- Tagging System
  tags TEXT[] NOT NULL DEFAULT '{}', -- Array of tags for matching
  
  -- Usage Tracking
  usage_count INTEGER DEFAULT 0, -- How many times used in videos
  last_used_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_file_type CHECK (file_type IN ('image', 'video', 'audio')),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 524288000), -- 500MB max
  CONSTRAINT video_has_duration CHECK (
    (file_type = 'video' AND duration IS NOT NULL) OR 
    (file_type != 'video')
  )
);

-- Indexes for performance
CREATE INDEX idx_media_assets_project_id ON media_assets(project_id);
CREATE INDEX idx_media_assets_file_type ON media_assets(file_type);
CREATE INDEX idx_media_assets_tags ON media_assets USING GIN(tags); -- GIN index for array search
CREATE INDEX idx_media_assets_created_at ON media_assets(created_at DESC);
```

---

### 5. copyright_scans

**Purpose:** Tracks copyright detection scans for uploaded media

```sql
CREATE TABLE copyright_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID REFERENCES media_assets(id) ON DELETE CASCADE,
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
  completed_at TIMESTAMPTZ,
  
  CONSTRAINT valid_scan_type CHECK (scan_type IN ('image', 'video', 'audio')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'scanning', 'completed', 'failed')),
  CONSTRAINT valid_risk_level CHECK (risk_level IN ('low', 'medium', 'high')),
  CONSTRAINT valid_risk_score CHECK (risk_score >= 0 AND risk_score <= 100)
);

CREATE INDEX idx_copyright_scans_media ON copyright_scans(media_id);
CREATE INDEX idx_copyright_scans_risk ON copyright_scans(risk_level);
CREATE INDEX idx_copyright_scans_status ON copyright_scans(status);
```

---

### 6. copyright_matches

**Purpose:** Individual copyright matches found during scans

```sql
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

CREATE INDEX idx_copyright_matches_scan ON copyright_matches(copyright_scan_id);
CREATE INDEX idx_copyright_matches_type ON copyright_matches(match_type);
```

---

### 7. copyright_acknowledgments

**Purpose:** User acknowledgments of copyright risks

```sql
CREATE TABLE copyright_acknowledgments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  media_id UUID REFERENCES media_assets(id) ON DELETE CASCADE,
  copyright_scan_id UUID REFERENCES copyright_scans(id),
  risk_level VARCHAR(20) NOT NULL,
  risk_score INTEGER NOT NULL,
  user_confirmed BOOLEAN DEFAULT FALSE,
  confirmation_text TEXT, -- What user agreed to
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_copyright_acknowledgments_user ON copyright_acknowledgments(user_id);
CREATE INDEX idx_copyright_acknowledgments_media ON copyright_acknowledgments(media_id);
```

---

### 8. stock_footage_licenses

**Purpose:** Track stock footage licenses for compliance

```sql
CREATE TABLE stock_footage_licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID REFERENCES media_assets(id) ON DELETE CASCADE,
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

CREATE INDEX idx_stock_licenses_media ON stock_footage_licenses(media_id);
CREATE INDEX idx_stock_licenses_source ON stock_footage_licenses(source_api, source_id);
```

---

### 9. copyrighted_content_blocklist

**Purpose:** Known copyrighted content database (blocklist)

```sql
CREATE TABLE copyrighted_content_blocklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'audio'
  identifier TEXT NOT NULL, -- Hash, fingerprint, or unique ID
  identifier_type VARCHAR(50) NOT NULL, -- 'perceptual_hash', 'content_id', etc.
  copyright_holder VARCHAR(255) NOT NULL,
  source_name VARCHAR(255),
  reason TEXT,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(identifier, identifier_type)
);

CREATE INDEX idx_blocklist_identifier ON copyrighted_content_blocklist(identifier, identifier_type);
```

---

### 10. video_renders

**Purpose:** Tracks video generation jobs and their progress

```sql
CREATE TABLE video_renders (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Job Status
  status TEXT NOT NULL DEFAULT 'queued',
  -- Possible values: 'queued', 'processing', 'completed', 'failed'
  
  progress INTEGER NOT NULL DEFAULT 0, -- 0-100
  current_step TEXT, -- e.g., 'Generating script', 'Assembling video'
  
  -- Error Handling
  error_message TEXT,
  error_stack TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Output Information
  output_url TEXT, -- Final video URL
  output_file_size INTEGER, -- bytes
  output_duration INTEGER, -- seconds
  output_resolution TEXT, -- e.g., '1920x1080'
  
  -- Processing Metadata
  script_tokens_used INTEGER, -- GPT-5 tokens for script generation
  tts_characters_used INTEGER, -- TTS API character count
  processing_time_seconds INTEGER, -- Total processing time
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  CONSTRAINT valid_progress CHECK (progress >= 0 AND progress <= 100)
);

-- Indexes for performance
CREATE INDEX idx_video_renders_project_id ON video_renders(project_id);
CREATE INDEX idx_video_renders_status ON video_renders(status);
CREATE INDEX idx_video_renders_created_at ON video_renders(created_at DESC);
```

---

### 11. scenes

**Purpose:** Stores the timeline of scenes for each video render

```sql
CREATE TABLE scenes (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  render_id UUID NOT NULL REFERENCES video_renders(id) ON DELETE CASCADE,
  media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE RESTRICT,
  
  -- Scene Timing
  start_time DECIMAL(10, 3) NOT NULL, -- seconds with millisecond precision
  end_time DECIMAL(10, 3) NOT NULL,
  duration DECIMAL(10, 3) GENERATED ALWAYS AS (end_time - start_time) STORED,
  
  -- Scene Order
  scene_order INTEGER NOT NULL, -- 1, 2, 3, etc.
  
  -- Script Content
  script_text TEXT NOT NULL, -- Narration for this scene
  
  -- Visual Effects
  transition_type TEXT NOT NULL DEFAULT 'fade',
  -- Possible values: 'fade', 'cut', 'dissolve', 'wipe'
  transition_duration DECIMAL(5, 3) DEFAULT 0.5, -- seconds
  
  -- Audio
  voiceover_url TEXT, -- TTS audio file for this scene
  voiceover_duration DECIMAL(10, 3),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_timing CHECK (end_time > start_time),
  CONSTRAINT valid_transition CHECK (transition_type IN ('fade', 'cut', 'dissolve', 'wipe')),
  CONSTRAINT valid_order CHECK (scene_order > 0)
);

-- Indexes for performance
CREATE INDEX idx_scenes_render_id ON scenes(render_id);
CREATE INDEX idx_scenes_media_asset_id ON scenes(media_asset_id);
CREATE INDEX idx_scenes_order ON scenes(render_id, scene_order);
```

---

### 12. channel_caption_styles

**Purpose:** Learned caption styles from channel analysis

```sql
CREATE TABLE channel_caption_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  caption_dna JSONB NOT NULL, -- Full style configuration
  confidence_score DECIMAL(3,2), -- 0.00-1.00
  sample_size INTEGER, -- Number of videos analyzed
  last_analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_confidence CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

CREATE INDEX idx_channel_caption_styles_channel ON channel_caption_styles(channel_id);
```

---

### 13. video_captions

**Purpose:** Generated captions for videos

```sql
CREATE TABLE video_captions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES video_renders(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL, -- 'en', 'es', 'fr', etc.
  caption_type VARCHAR(50) NOT NULL, -- 'full', 'keywords', 'descriptions', 'bilingual'
  format VARCHAR(10) NOT NULL, -- 'srt', 'vtt', 'ass'
  content TEXT NOT NULL, -- Caption file content
  file_url TEXT, -- Storage URL for caption file
  transcription_api VARCHAR(50), -- 'whisper', 'assemblyai', 'google'
  confidence_score DECIMAL(3,2), -- Transcription accuracy
  word_count INTEGER,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(video_id, language, caption_type),
  
  CONSTRAINT valid_caption_type CHECK (caption_type IN ('full', 'keywords', 'descriptions', 'bilingual')),
  CONSTRAINT valid_format CHECK (format IN ('srt', 'vtt', 'ass')),
  CONSTRAINT valid_confidence CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

CREATE INDEX idx_video_captions_video ON video_captions(video_id);
CREATE INDEX idx_video_captions_language ON video_captions(language);
```

---

### 14. caption_segments

**Purpose:** Individual caption segments with timestamps

```sql
CREATE TABLE caption_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_caption_id UUID REFERENCES video_captions(id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL,
  start_time DECIMAL(10,3) NOT NULL, -- Seconds with milliseconds
  end_time DECIMAL(10,3) NOT NULL,
  text TEXT NOT NULL,
  speaker_label VARCHAR(100), -- For multi-speaker content
  is_sound_effect BOOLEAN DEFAULT FALSE,
  is_music_cue BOOLEAN DEFAULT FALSE,
  keywords TEXT[], -- Highlighted keywords in this segment
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_timing CHECK (end_time > start_time),
  CONSTRAINT valid_confidence CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

CREATE INDEX idx_caption_segments_video_caption ON caption_segments(video_caption_id);
CREATE INDEX idx_caption_segments_time ON caption_segments(start_time, end_time);
```

---

### 15. transcription_jobs

**Purpose:** Track transcription API jobs

```sql
CREATE TABLE transcription_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES video_renders(id) ON DELETE CASCADE,
  audio_file_url TEXT NOT NULL,
  api_provider VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'pending', 'processing', 'completed', 'failed'
  job_id TEXT, -- External API job ID
  error_message TEXT,
  processing_time_seconds INTEGER,
  cost_usd DECIMAL(10,4),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

CREATE INDEX idx_transcription_jobs_video ON transcription_jobs(video_id);
CREATE INDEX idx_transcription_jobs_status ON transcription_jobs(status);
```

---

## 🔐 Row Level Security (RLS) Policies

Supabase uses PostgreSQL's Row Level Security for authorization:

### projects table
```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can only see their own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own projects
CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own projects
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);
```

### media_assets table
```sql
-- Enable RLS
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Users can only see media from their own projects
CREATE POLICY "Users can view own media"
  ON media_assets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = media_assets.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Similar policies for INSERT, UPDATE, DELETE
CREATE POLICY "Users can create own media"
  ON media_assets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = media_assets.project_id
      AND projects.user_id = auth.uid()
    )
  );
```

### channels table
```sql
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own channels"
  ON channels FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own channels"
  ON channels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own channels"
  ON channels FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own channels"
  ON channels FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 📈 Database Migrations

### Migration 001: Initial Schema
```sql
-- File: migrations/001_initial_schema.sql

-- Create projects table
CREATE TABLE projects (...);

-- Create media_assets table
CREATE TABLE media_assets (...);

-- Create video_renders table
CREATE TABLE video_renders (...);

-- Create scenes table
CREATE TABLE scenes (...);

-- Create indexes
CREATE INDEX ...;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ... (all RLS policies)
```

### Migration 002: Add Channels and Caption System
```sql
-- File: migrations/002_add_channels_captions.sql

CREATE TABLE channels (...);
CREATE TABLE channel_caption_styles (...);
CREATE TABLE video_captions (...);
CREATE TABLE caption_segments (...);
CREATE TABLE transcription_jobs (...);

-- Add channel_id to projects
ALTER TABLE projects ADD COLUMN channel_id UUID REFERENCES channels(id);
```

### Migration 003: Add Copyright Detection System
```sql
-- File: migrations/003_add_copyright_detection.sql

CREATE TABLE copyright_scans (...);
CREATE TABLE copyright_matches (...);
CREATE TABLE copyright_acknowledgments (...);
CREATE TABLE stock_footage_licenses (...);
CREATE TABLE copyrighted_content_blocklist (...);
```

---

## 🔍 Common Queries

### Get all projects for a user with media count
```sql
SELECT 
  p.*,
  COUNT(m.id) as media_count,
  SUM(CASE WHEN m.file_type = 'image' THEN 1 ELSE 0 END) as image_count,
  SUM(CASE WHEN m.file_type = 'video' THEN 1 ELSE 0 END) as video_count
FROM projects p
LEFT JOIN media_assets m ON m.project_id = p.id
WHERE p.user_id = $1
GROUP BY p.id
ORDER BY p.created_at DESC;
```

### Find media by tag
```sql
SELECT *
FROM media_assets
WHERE project_id = $1
AND $2 = ANY(tags); -- $2 is the tag to search for
```

### Get video render progress with copyright status
```sql
SELECT 
  vr.*,
  p.title as project_title,
  COUNT(s.id) as scene_count,
  COUNT(cs.id) as scanned_media,
  SUM(CASE WHEN cs.risk_level = 'high' THEN 1 ELSE 0 END) as high_risk_count
FROM video_renders vr
JOIN projects p ON p.id = vr.project_id
LEFT JOIN scenes s ON s.render_id = vr.id
LEFT JOIN media_assets m ON m.project_id = p.id
LEFT JOIN copyright_scans cs ON cs.media_id = m.id
WHERE vr.id = $1
GROUP BY vr.id, p.title;
```

### Get scene timeline with captions
```sql
SELECT 
  s.*,
  m.file_url,
  m.file_type,
  m.tags,
  cs.sequence_number,
  cs.text as caption_text,
  cs.start_time as caption_start,
  cs.end_time as caption_end
FROM scenes s
JOIN media_assets m ON m.id = s.media_asset_id
LEFT JOIN video_captions vc ON vc.video_id = s.render_id
LEFT JOIN caption_segments cs ON cs.video_caption_id = vc.id
  AND cs.start_time >= s.start_time 
  AND cs.end_time <= s.end_time
WHERE s.render_id = $1
ORDER BY s.scene_order ASC;
```

### Get copyright report for video
```sql
SELECT 
  p.id as project_id,
  p.title,
  COUNT(DISTINCT m.id) as total_media,
  COUNT(DISTINCT cs.id) as scanned_media,
  SUM(CASE WHEN cs.risk_level = 'low' THEN 1 ELSE 0 END) as low_risk,
  SUM(CASE WHEN cs.risk_level = 'medium' THEN 1 ELSE 0 END) as medium_risk,
  SUM(CASE WHEN cs.risk_level = 'high' THEN 1 ELSE 0 END) as high_risk
FROM projects p
JOIN media_assets m ON m.project_id = p.id
LEFT JOIN copyright_scans cs ON cs.media_id = m.id
WHERE p.id = $1
GROUP BY p.id, p.title;
```

---

## 📊 Storage Estimates

### Per Project
- **Project record:** ~1 KB
- **Media assets (20 files):** ~200 MB (avg 10MB per file)
- **Copyright scans (20 scans):** ~100 KB
- **Video render:** ~2 KB
- **Scenes (50 scenes):** ~50 KB
- **Captions:** ~50 KB
- **Generated video:** ~100 MB (10 min @ 1080p)

**Total per project:** ~300 MB

### Free Tier Limits (Supabase)
- **Database:** 500 MB (supports ~500 projects with metadata)
- **Storage:** 1 GB (supports ~3 complete projects with media)

**Recommendation:** Implement cleanup policy to delete old media after video is published.

---

## 🔄 Backup Strategy

### Automated Backups (Supabase)
- **Frequency:** Daily
- **Retention:** 7 days (free tier)
- **Scope:** Full database

### Manual Backups (Before Major Changes)
```bash
# Export database schema
pg_dump -h db.supabase.co -U postgres -s tubey > schema_backup.sql

# Export data
pg_dump -h db.supabase.co -U postgres -a tubey > data_backup.sql
```

---

**Next:** [API Design Documentation](./API-DESIGN.md)
