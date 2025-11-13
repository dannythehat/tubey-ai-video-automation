# 🗄️ Database Schema Design

**Database:** PostgreSQL (via Supabase)  
**Version:** 1.0.0  
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
┌────────┴────────┐
│    projects     │◄──────────┐
└────────┬────────┘           │
         │                    │
         │ 1:N                │ N:1
         │                    │
┌────────┴────────┐    ┌──────┴──────┐
│  media_assets   │    │video_renders│
└────────┬────────┘    └──────┬──────┘
         │                    │
         │ 1:N                │ 1:N
         │                    │
         │             ┌──────┴──────┐
         │             │   scenes    │
         └─────────────┤             │
                  N:1  └─────────────┘
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

### 2. projects

**Purpose:** Stores video project metadata and configuration

```sql
CREATE TABLE projects (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
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
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
```

**Sample Data:**
```sql
INSERT INTO projects (user_id, title, description, target_duration, status)
VALUES (
  'user-uuid-here',
  'UK''s Most Tragic Horses',
  'A tribute to the brave horses who captured our hearts',
  600,
  'draft'
);
```

---

### 3. media_assets

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
  CONSTRAINT valid_file_type CHECK (file_type IN ('image', 'video')),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 524288000), -- 500MB max
  CONSTRAINT video_has_duration CHECK (
    (file_type = 'video' AND duration IS NOT NULL) OR 
    (file_type = 'image' AND duration IS NULL)
  )
);

-- Indexes for performance
CREATE INDEX idx_media_assets_project_id ON media_assets(project_id);
CREATE INDEX idx_media_assets_file_type ON media_assets(file_type);
CREATE INDEX idx_media_assets_tags ON media_assets USING GIN(tags); -- GIN index for array search
CREATE INDEX idx_media_assets_created_at ON media_assets(created_at DESC);
```

**Sample Data:**
```sql
INSERT INTO media_assets (project_id, file_url, file_name, file_type, file_size, mime_type, tags, width, height)
VALUES (
  'project-uuid-here',
  'https://supabase.co/storage/v1/object/public/media/gloria-victis.jpg',
  'gloria-victis.jpg',
  'image',
  2048576,
  'image/jpeg',
  ARRAY['Gloria Victis Horse', 'Gloria Victis Portrait'],
  1920,
  1080
);
```

---

### 4. video_renders

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

**Sample Data:**
```sql
INSERT INTO video_renders (project_id, status, progress, current_step)
VALUES (
  'project-uuid-here',
  'processing',
  45,
  'Assembling video scenes'
);
```

---

### 5. scenes

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
  
  -- Captions
  caption_text TEXT, -- Optional caption overlay
  caption_start DECIMAL(10, 3),
  caption_end DECIMAL(10, 3),
  
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

**Sample Data:**
```sql
INSERT INTO scenes (render_id, media_asset_id, start_time, end_time, scene_order, script_text, transition_type)
VALUES (
  'render-uuid-here',
  'media-uuid-here',
  0.0,
  15.5,
  1,
  'Welcome to Horse Racing Nostalgia. Today we remember Gloria Victis...',
  'fade'
);
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

### Migration 002: Add YouTube Fields (Future)
```sql
-- File: migrations/002_add_youtube_fields.sql

ALTER TABLE projects
ADD COLUMN youtube_playlist_id TEXT,
ADD COLUMN auto_publish BOOLEAN DEFAULT false;
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

### Get video render progress
```sql
SELECT 
  vr.*,
  p.title as project_title,
  COUNT(s.id) as scene_count
FROM video_renders vr
JOIN projects p ON p.id = vr.project_id
LEFT JOIN scenes s ON s.render_id = vr.id
WHERE vr.id = $1
GROUP BY vr.id, p.title;
```

### Get scene timeline for a render
```sql
SELECT 
  s.*,
  m.file_url,
  m.file_type,
  m.tags
FROM scenes s
JOIN media_assets m ON m.id = s.media_asset_id
WHERE s.render_id = $1
ORDER BY s.scene_order ASC;
```

---

## 📊 Storage Estimates

### Per Project
- **Project record:** ~1 KB
- **Media assets (20 files):** ~200 MB (avg 10MB per file)
- **Video render:** ~2 KB
- **Scenes (50 scenes):** ~50 KB
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
