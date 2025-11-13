# 🚀 Tubey Setup Guide

**Time Required:** 30-45 minutes  
**Difficulty:** Intermediate

---

## 📋 Prerequisites

### Required Accounts
- [x] GitHub account (you have this!)
- [ ] [Supabase](https://supabase.com) account (free tier)
- [ ] [OpenAI](https://platform.openai.com) account with GPT-5 access
- [ ] [YouTube](https://console.cloud.google.com) Google Cloud project
- [ ] [Vercel](https://vercel.com) account (free tier)
- [ ] [Railway](https://railway.app) account (free tier)

### Required Software
- [ ] Node.js 20+ ([Download](https://nodejs.org))
- [ ] Git ([Download](https://git-scm.com))
- [ ] Code editor (VS Code recommended)
- [ ] FFmpeg ([Download](https://ffmpeg.org))

---

## 🔧 Step 1: Clone Repository

```bash
# Clone the repo
git clone https://github.com/dannythehat/tubey-ai-video-automation.git
cd tubey-ai-video-automation

# Verify Node.js version
node --version  # Should be 20.x or higher
```

---

## 🗄️ Step 2: Set Up Supabase

### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: `tubey-production`
4. Database Password: Generate strong password (save it!)
5. Region: Choose closest to you
6. Click "Create new project" (takes ~2 minutes)

### 2.2 Get API Keys
1. Go to Project Settings → API
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep secret!)

### 2.3 Run Database Migrations
1. Go to SQL Editor in Supabase dashboard
2. Create new query
3. Copy and paste this schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_duration INTEGER NOT NULL DEFAULT 600,
  status TEXT NOT NULL DEFAULT 'draft',
  script TEXT,
  script_generated_at TIMESTAMP,
  video_url TEXT,
  thumbnail_url TEXT,
  youtube_url TEXT,
  youtube_video_id TEXT,
  youtube_title TEXT,
  youtube_description TEXT,
  youtube_tags TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
  CONSTRAINT valid_duration CHECK (target_duration >= 60 AND target_duration <= 2700)
);

-- Create media_assets table
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  duration INTEGER,
  width INTEGER,
  height INTEGER,
  aspect_ratio TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_file_type CHECK (file_type IN ('image', 'video')),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 524288000)
);

-- Create video_renders table
CREATE TABLE video_renders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'queued',
  progress INTEGER NOT NULL DEFAULT 0,
  current_step TEXT,
  error_message TEXT,
  error_stack TEXT,
  retry_count INTEGER DEFAULT 0,
  output_url TEXT,
  output_file_size INTEGER,
  output_duration INTEGER,
  output_resolution TEXT,
  script_tokens_used INTEGER,
  tts_characters_used INTEGER,
  processing_time_seconds INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  CONSTRAINT valid_progress CHECK (progress >= 0 AND progress <= 100)
);

-- Create scenes table
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  render_id UUID NOT NULL REFERENCES video_renders(id) ON DELETE CASCADE,
  media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE RESTRICT,
  start_time DECIMAL(10, 3) NOT NULL,
  end_time DECIMAL(10, 3) NOT NULL,
  duration DECIMAL(10, 3) GENERATED ALWAYS AS (end_time - start_time) STORED,
  scene_order INTEGER NOT NULL,
  script_text TEXT NOT NULL,
  transition_type TEXT NOT NULL DEFAULT 'fade',
  transition_duration DECIMAL(5, 3) DEFAULT 0.5,
  voiceover_url TEXT,
  voiceover_duration DECIMAL(10, 3),
  caption_text TEXT,
  caption_start DECIMAL(10, 3),
  caption_end DECIMAL(10, 3),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_timing CHECK (end_time > start_time),
  CONSTRAINT valid_transition CHECK (transition_type IN ('fade', 'cut', 'dissolve', 'wipe')),
  CONSTRAINT valid_order CHECK (scene_order > 0)
);

-- Create indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_media_assets_project_id ON media_assets(project_id);
CREATE INDEX idx_media_assets_file_type ON media_assets(file_type);
CREATE INDEX idx_media_assets_tags ON media_assets USING GIN(tags);
CREATE INDEX idx_media_assets_created_at ON media_assets(created_at DESC);
CREATE INDEX idx_video_renders_project_id ON video_renders(project_id);
CREATE INDEX idx_video_renders_status ON video_renders(status);
CREATE INDEX idx_video_renders_created_at ON video_renders(created_at DESC);
CREATE INDEX idx_scenes_render_id ON scenes(render_id);
CREATE INDEX idx_scenes_media_asset_id ON scenes(media_asset_id);
CREATE INDEX idx_scenes_order ON scenes(render_id, scene_order);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_renders ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for media_assets
CREATE POLICY "Users can view own media" ON media_assets FOR SELECT 
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = media_assets.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can create own media" ON media_assets FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = media_assets.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can update own media" ON media_assets FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = media_assets.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can delete own media" ON media_assets FOR DELETE 
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = media_assets.project_id AND projects.user_id = auth.uid()));

-- RLS Policies for video_renders
CREATE POLICY "Users can view own renders" ON video_renders FOR SELECT 
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = video_renders.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can create own renders" ON video_renders FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = video_renders.project_id AND projects.user_id = auth.uid()));

-- RLS Policies for scenes
CREATE POLICY "Users can view own scenes" ON scenes FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM video_renders vr 
    JOIN projects p ON p.id = vr.project_id 
    WHERE vr.id = scenes.render_id AND p.user_id = auth.uid()
  ));
```

4. Click "Run" to execute
5. Verify tables created: Go to Table Editor, you should see 4 tables

### 2.4 Set Up Storage
1. Go to Storage in Supabase dashboard
2. Click "New bucket"
3. Name: `media`
4. Public bucket: **Yes** (for video playback)
5. Click "Create bucket"
6. Click on `media` bucket → Policies → New Policy
7. Policy name: `Allow authenticated uploads`
8. Allowed operations: INSERT, SELECT, UPDATE, DELETE
9. Target roles: `authenticated`
10. Click "Save"

---

## 🤖 Step 3: Set Up OpenAI

### 3.1 Get API Key
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Name: `Tubey Production`
4. Copy the key (starts with `sk-proj-...`)
5. **Save it immediately** (you can't see it again!)

### 3.2 Verify GPT-5 Access
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY" \
  | grep "gpt-5"
```

If you don't see `gpt-5`, you may need to:
- Wait for access (GPT-5 is rolling out)
- Use `gpt-4-turbo` as fallback for now

---

## 📺 Step 4: Set Up YouTube API

### 4.1 Create Google Cloud Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click "New Project"
3. Name: `Tubey Video Automation`
4. Click "Create"

### 4.2 Enable YouTube Data API
1. Go to "APIs & Services" → "Library"
2. Search for "YouTube Data API v3"
3. Click "Enable"

### 4.3 Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: `Tubey Backend`
5. Authorized redirect URIs: `http://localhost:3001/auth/youtube/callback`
6. Click "Create"
7. Copy **Client ID** and **Client Secret**

### 4.4 Get Refresh Token
```bash
# We'll create a script for this in the backend
# For now, save your Client ID and Client Secret
```

---

## 🎨 Step 5: Configure Environment Variables

### 5.1 Create .env File
```bash
# In project root
cp .env.example .env
```

### 5.2 Fill in Values
Edit `.env` with your values:

```env
# OpenAI
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-5

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# YouTube
YOUTUBE_CLIENT_ID=your-client-id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your-client-secret
YOUTUBE_REDIRECT_URI=http://localhost:3001/auth/youtube/callback

# App Config
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

## 📦 Step 6: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## ✅ Step 7: Verify Setup

### 7.1 Test Database Connection
```bash
cd backend
npm run test:db
```

Expected output:
```
✓ Database connection successful
✓ All tables exist
✓ RLS policies active
```

### 7.2 Test OpenAI Connection
```bash
npm run test:openai
```

Expected output:
```
✓ OpenAI API key valid
✓ GPT-5 model accessible
```

### 7.3 Test FFmpeg
```bash
ffmpeg -version
```

Expected output:
```
ffmpeg version 6.x.x
```

---

## 🚀 Step 8: Run Development Servers

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Tubey API Server
📡 Listening on http://localhost:3001
✅ Database connected
✅ OpenAI connected
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 🎉 Step 9: First Login

1. Open browser: `http://localhost:3000`
2. Click "Sign Up"
3. Enter email and password
4. Check email for verification link
5. Click verification link
6. Log in to Tubey!

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check Supabase project is running
# Verify SUPABASE_URL and keys in .env
# Check internet connection
```

### FFmpeg Not Found
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=3002

# Or kill process using port
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## 📚 Next Steps

- [ ] Read [Development Guide](./DEVELOPMENT.md)
- [ ] Review [API Documentation](../architecture/API-DESIGN.md)
- [ ] Complete Gateway 1 approval
- [ ] Start Phase 2: Frontend development

---

**Setup Complete!** 🎉  
You're ready to build Tubey!
