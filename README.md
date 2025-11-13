# 🎬 Tubey AI Video Automation

**AI-Powered Horse Racing Nostalgia Video Creator**

Tubey transforms your tagged media library into compelling, professionally-produced YouTube videos using GPT-5 intelligence. Built for daily content creation with zero manual editing.

---

## 🎯 Vision

Create stunning horse racing nostalgia videos daily by simply uploading tagged images/videos. GPT-5 handles the storytelling, video assembly, and YouTube publishing automatically.

**Example Workflow:**
1. Upload 20 photos + 5 race clips of "Gloria Victis"
2. Tag them: "Gloria Victis Horse", "Gloria Victis Trainer Martin Pipe", "Gloria Victis Winning"
3. Set title: "UK's Most Tragic Horses"
4. Click Generate
5. AI creates script, assembles video, publishes to YouTube

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     TUBEY SYSTEM                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐ │
│  │   Frontend   │─────▶│   Backend    │─────▶│  GPT-5   │ │
│  │  (React UI)  │      │  (Node.js)   │      │  Brain   │ │
│  └──────────────┘      └──────────────┘      └──────────┘ │
│         │                      │                    │      │
│         │                      ▼                    │      │
│         │              ┌──────────────┐             │      │
│         │              │   Database   │             │      │
│         │              │  (Supabase)  │             │      │
│         │              └──────────────┘             │      │
│         │                      │                    │      │
│         ▼                      ▼                    ▼      │
│  ┌──────────────────────────────────────────────────────┐ │
│  │            Video Processing Pipeline                 │ │
│  │  1. Media Tagging  2. Script Gen  3. Video Assembly │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│                  ┌──────────────┐                          │
│                  │   YouTube    │                          │
│                  │  Auto-Upload │                          │
│                  └──────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 GPT-5 Intelligence Layer

GPT-5 powers every critical decision:

### 1. **Script Generation**
- Analyzes tagged media library
- Creates compelling narratives matching available footage
- Structures content for optimal pacing (5-45 min videos)
- Generates emotional, nostalgic storytelling

### 2. **Smart Media Matching**
- Parses script to identify tag mentions
- Intelligently selects best media for each moment
- Balances image/video usage for visual variety
- Handles missing media gracefully

### 3. **Scene Timing & Pacing**
- Calculates optimal scene duration based on content type
- Prioritizes action footage (races) over static images
- Creates natural transitions between segments
- Syncs media with voiceover timing

### 4. **Metadata Generation**
- Auto-generates YouTube titles, descriptions, tags
- Creates SEO-optimized content
- Generates compelling thumbnails
- Adds calls-to-action

---

## 🚀 Development Phases

### **Phase 1: Foundation (Gateway 1)** ✅
- [x] Repository setup
- [ ] Project structure
- [ ] Database schema design
- [ ] API architecture documentation
- **Gateway Test:** Architecture review & approval

### **Phase 2: Frontend Core (Gateway 2)**
- [ ] React app with purple/black theme
- [ ] Glowing button components
- [ ] Project dashboard
- [ ] Media upload interface with tagging
- **Gateway Test:** UI/UX review, theme validation

### **Phase 3: Backend Core (Gateway 3)**
- [ ] Node.js API server
- [ ] Supabase integration
- [ ] File storage system
- [ ] Authentication
- **Gateway Test:** API endpoints functional, database connected

### **Phase 4: GPT-5 Integration (Gateway 4)**
- [ ] OpenAI GPT-5 API setup
- [ ] Script generation engine
- [ ] Tag parsing & matching algorithm
- [ ] Context management for media library
- **Gateway Test:** GPT-5 generates quality scripts from tagged media

### **Phase 5: Video Processing (Gateway 5)**
- [ ] FFmpeg integration
- [ ] Video assembly engine
- [ ] Scene compositor
- [ ] Transition effects
- [ ] Voiceover synthesis (TTS)
- **Gateway Test:** Generate 1-minute test video successfully

### **Phase 6: YouTube Integration (Gateway 6)**
- [ ] YouTube Data API v3 setup
- [ ] Auto-upload functionality
- [ ] Metadata injection
- [ ] Thumbnail generation & upload
- **Gateway Test:** Successfully publish test video to YouTube

### **Phase 7: Automation & Polish (Gateway 7)**
- [ ] Scheduled video generation
- [ ] Queue system for rendering
- [ ] Error handling & retry logic
- [ ] Analytics dashboard
- **Gateway Test:** Generate & publish video end-to-end without manual intervention

---

## 🎨 Design System

### **Color Palette**
```css
Primary Purple:   #8B5CF6 (Violet-500)
Deep Purple:      #6D28D9 (Violet-700)
Accent Purple:    #A78BFA (Violet-400)
Background Black: #0F0F0F
Card Black:       #1A1A1A
Border Purple:    #4C1D95 (Violet-900)
Glow Effect:      0 0 20px rgba(139, 92, 246, 0.6)
```

### **Component Style Guide**
- **Buttons:** Purple gradient with animated glow on hover
- **Cards:** Black background with purple border, subtle shadow
- **Inputs:** Dark with purple focus ring
- **Typography:** White primary, purple accents
- **Animations:** Smooth 300ms transitions, glow pulses

---

## 📁 Project Structure

```
tubey-ai-video-automation/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── styles/          # Global styles & theme
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/     # Business logic
│   │   ├── services/        # Core services
│   │   │   ├── gpt5/        # GPT-5 integration
│   │   │   ├── video/       # Video processing
│   │   │   ├── youtube/     # YouTube API
│   │   │   └── storage/     # File management
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── docs/                     # Documentation
│   ├── architecture/        # System design docs
│   ├── api/                 # API documentation
│   ├── gateways/            # Gateway test criteria
│   └── guides/              # Development guides
│
├── scripts/                  # Utility scripts
│   ├── setup/               # Setup automation
│   └── deploy/              # Deployment scripts
│
└── tests/                    # Test suites
    ├── unit/                # Unit tests
    ├── integration/         # Integration tests
    └── e2e/                 # End-to-end tests
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS (purple/black custom theme)
- **State:** React Query + Zustand
- **UI Components:** Custom components with glow effects
- **Routing:** React Router v6

### **Backend**
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (media files)
- **Queue:** Bull (video processing jobs)

### **AI & Processing**
- **Brain:** OpenAI GPT-5 API
- **Video:** FFmpeg (assembly & encoding)
- **TTS:** ElevenLabs or OpenAI TTS
- **Image Processing:** Sharp

### **Integrations**
- **YouTube:** YouTube Data API v3
- **Auth:** Supabase Auth
- **Hosting:** Vercel (frontend) + Railway (backend) - Free tiers

---

## 🔐 Environment Variables

```env
# OpenAI GPT-5
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5

# Supabase
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...

# YouTube
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REFRESH_TOKEN=...

# TTS (Optional)
ELEVENLABS_API_KEY=...

# App Config
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

## 📊 Database Schema

### **Projects**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  target_duration INTEGER, -- seconds
  status TEXT DEFAULT 'draft', -- draft, processing, completed, failed
  script TEXT,
  video_url TEXT,
  youtube_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Media Assets**
```sql
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- image, video
  file_size INTEGER,
  duration INTEGER, -- for videos, in seconds
  tags TEXT[], -- array of tags
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Video Renders**
```sql
CREATE TABLE video_renders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'queued', -- queued, processing, completed, failed
  progress INTEGER DEFAULT 0, -- 0-100
  error_message TEXT,
  output_url TEXT,
  duration INTEGER,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

---

## 🧪 Gateway Tests

Each phase has specific criteria that must pass before proceeding:

### **Gateway 1: Foundation**
- [ ] Repository structure approved
- [ ] Database schema validated
- [ ] API architecture documented
- [ ] Tech stack confirmed

### **Gateway 2: Frontend Core**
- [ ] Purple/black theme implemented correctly
- [ ] Glowing buttons functional
- [ ] All core pages render
- [ ] Responsive design works

### **Gateway 3: Backend Core**
- [ ] All API endpoints respond
- [ ] Database CRUD operations work
- [ ] File upload/download functional
- [ ] Authentication working

### **Gateway 4: GPT-5 Integration**
- [ ] GPT-5 API connected
- [ ] Script generation produces quality output
- [ ] Tag matching algorithm accurate
- [ ] Context management efficient

### **Gateway 5: Video Processing**
- [ ] FFmpeg generates valid video files
- [ ] Scene transitions smooth
- [ ] Audio sync perfect
- [ ] Output quality acceptable

### **Gateway 6: YouTube Integration**
- [ ] Video uploads successfully
- [ ] Metadata applied correctly
- [ ] Thumbnails generated & uploaded
- [ ] Published videos accessible

### **Gateway 7: End-to-End**
- [ ] Complete workflow works without errors
- [ ] Video quality meets standards
- [ ] Processing time acceptable
- [ ] System handles errors gracefully

---

## 🚦 Getting Started (Tomorrow)

When you're ready to continue:

1. **Review this README** - Ensure architecture aligns with vision
2. **Approve Gateway 1** - Confirm we proceed to Phase 2
3. **Set up environment** - Get API keys ready (OpenAI, YouTube)
4. **Choose hosting** - Confirm Vercel + Railway free tiers

---

## 📝 Notes

- **GPT-5 at the core:** Every decision flows through GPT-5 intelligence
- **Gateway-driven:** No phase starts until previous gateway passes
- **Purple/black aesthetic:** Consistent throughout entire app
- **Built for scale:** Architecture supports future multi-user expansion
- **Real media only:** AI organizes authentic footage, never generates fake content

---

## 🎯 Success Criteria

**Tubey is successful when:**
- You upload media in the morning
- Click "Generate Video"
- Go to work
- Come home to a published YouTube video
- Repeat daily with zero manual editing

---

**Built with 💜 for Horse Racing Nostalgia**

*Repository created: November 13, 2025*
*Ready for Phase 2 development*
