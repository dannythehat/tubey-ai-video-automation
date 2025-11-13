# 🎬 Tubey AI Video Automation

**AI-Powered Video Creator for Real Content Channels**

Tubey transforms your tagged media library into compelling, professionally-produced YouTube videos using GPT-5 intelligence. Built for content creators who need **real footage and images** - not AI-generated content.

---

## 🎯 Vision

**The Problem:** Content creators running true crime, missing persons, historical documentary, and real-event channels spend hours manually editing videos, matching footage to narratives, and assembling content.

**The Solution:** Upload your real images and footage with tags, set a title, and let GPT-5 handle the storytelling, video assembly, and YouTube publishing automatically.

### Target Users:
- **True Crime Channels** - Jack the Ripper, unsolved mysteries, cold cases
- **Missing Persons Channels** - Real cases, awareness campaigns
- **Historical Documentary Channels** - Wars, events, biographies
- **Real Event Channels** - Disasters, tragedies, historical moments
- **Nostalgia Channels** - Sports history, cultural moments, vintage content
- **Any channel requiring authentic footage** - Not AI-generated content

---

## 💡 How It Works

**Example: True Crime Video**

1. **Upload Real Media:**
   - Image: "Jack the Ripper first victim - Mary Ann Nichols"
   - Image: "London Whitechapel area 1888"
   - Image: "Crime scene sketch - Buck's Row"
   - Video: "Crime detective Jim Smith discussing suspects"
   - Video: "Victorian London street footage"

2. **Tag Everything:**
   - Tags describe what's in each image/video
   - Tags can reference people, places, events, experts, evidence
   - No strict format - natural language tags

3. **Set Video Title:**
   - "The Untold Story of Jack the Ripper's First Victim"

4. **Click Generate:**
   - GPT-5 analyzes all your tagged media
   - Creates a compelling narrative script
   - Intelligently selects which media to show when
   - Determines optimal scene order and timing
   - Assembles video with transitions
   - Generates voiceover narration
   - Creates YouTube metadata (title, description, tags, thumbnail)

5. **Auto-Publish to YouTube:**
   - Video goes live automatically
   - Or save as draft for review

---

## 🧠 GPT-5 Intelligence Layer

GPT-5 powers every critical decision:

### 1. **Script Generation**
- Analyzes your entire tagged media library
- Creates compelling narratives that match available footage
- Structures content for optimal pacing (5-45 min videos)
- Generates emotional, engaging storytelling
- **Uses only the media you provide** - no hallucination

### 2. **Smart Media Matching**
- Parses script to identify which tags are mentioned
- Intelligently selects best media for each moment
- Balances image/video usage for visual variety
- Handles missing media gracefully (adjusts script)
- **Orders media in the most compelling sequence**

### 3. **Scene Timing & Pacing**
- Calculates optimal scene duration based on content type
- Prioritizes action footage over static images
- Creates natural transitions between segments
- Syncs media with voiceover timing

### 4. **Metadata Generation**
- Auto-generates YouTube titles, descriptions, tags
- Creates SEO-optimized content
- Generates compelling thumbnails from your media
- Adds calls-to-action

---

## 🎬 Real-World Use Cases

### True Crime Channel
**Upload:** Crime scene photos, suspect images, detective interviews, location footage  
**Title:** "The Zodiac Killer's Hidden Message Finally Decoded"  
**Result:** 25-minute documentary-style video with expert commentary

### Missing Persons Channel
**Upload:** Photos of missing person, family interviews, last known location footage  
**Title:** "Help Find Sarah: Missing Since 2019"  
**Result:** Awareness video with timeline and call-to-action

### Historical Documentary
**Upload:** Archival photos, war footage, historian interviews, maps  
**Title:** "D-Day: The Untold Stories of Omaha Beach"  
**Result:** Educational documentary with historical context

### Sports Nostalgia (Original Example)
**Upload:** Race clips, horse photos, jockey interviews, vintage footage  
**Title:** "UK's Most Tragic Horses: Gloria Victis Story"  
**Result:** Emotional tribute video with race highlights

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
- **Hosting:** Vercel (frontend) + Railway (backend)

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
YOUTUBE_REDIRECT_URI=...

# TTS (Optional)
ELEVENLABS_API_KEY=...

# App Config
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

## 💰 Business Model

### Target Market
- **True Crime Creators** - High demand, consistent content needs
- **Documentary Channels** - Educational content, archival footage
- **Nostalgia Channels** - Sports, music, cultural history
- **News/Current Events** - Breaking stories, analysis

### Pricing Strategy (Future)
- **Free Tier:** 2 videos/month, watermark
- **Creator Plan:** $29/month - 10 videos, no watermark
- **Pro Plan:** $79/month - Unlimited videos, priority processing
- **Enterprise:** Custom pricing for agencies/networks

### Key Differentiator
**Real content only** - No AI-generated images/videos. Perfect for channels that need authenticity and credibility.

---

## 🎯 Success Metrics

### MVP Goals
- Generate 5-minute video from 20 tagged media items
- Script quality: Coherent, engaging, factually grounded
- Video quality: Smooth transitions, proper pacing
- YouTube upload: Successful with metadata

### Post-Launch Goals
- 100 active users in first 3 months
- 1,000 videos generated in first 6 months
- 90% user satisfaction rating
- <5% video rejection rate

---

## 📝 Development Notes

### Key Principles
1. **Real Media Only** - Never generate fake content
2. **User Control** - Users provide all media, AI organizes it
3. **Transparency** - Show which media is used where
4. **Quality Over Speed** - Better to take time than produce poor content
5. **Ethical Use** - Respect copyright, privacy, and sensitivity

### Future Enhancements
- Multi-language support
- Custom voiceover uploads
- Advanced editing controls
- Collaboration features
- Analytics dashboard
- Template library

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

This is currently a solo project. Contributions welcome after MVP launch.

---

**Built with ❤️ for content creators who value authenticity**