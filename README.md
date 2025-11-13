# 🎬 Tubey AI Video Automation

**AI-Powered Video Creator for Real Content Channels**

Tubey transforms your tagged media library into compelling, professionally-produced YouTube videos using GPT-5 intelligence. Built for content creators who need **real footage and images** - not AI-generated content.

---

## 🎯 Vision

**The Problem:** Content creators running true crime, missing persons, historical documentary, and real-event channels spend hours manually editing videos, matching footage to narratives, and assembling content.

**The Solution:** Upload your real images and footage with tags, set a title, optionally enhance with stock footage transitions, and let GPT-5 handle the storytelling, video assembly, and YouTube publishing automatically.

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

4. **Enable Enhancements (Optional):**
   - ☑️ Enhance with stock footage transitions
   - Adds professional B-roll between your primary content

5. **Click Generate:**
   - GPT-5 analyzes all your tagged media
   - Creates a compelling narrative script
   - Intelligently selects which media to show when
   - Optionally adds stock footage transitions (max 15%)
   - Determines optimal scene order and timing
   - Assembles video with transitions
   - Generates voiceover narration
   - Creates YouTube metadata (title, description, tags, thumbnail)

6. **Preview & Approve:**
   - See exactly what stock footage was added (if enabled)
   - Remove any or all stock clips if desired
   - Full transparency and control

7. **Auto-Publish to YouTube:**
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

### 3. **Stock Footage Enhancement (Optional)**
- Identifies natural transition points in script
- Generates search queries for relevant stock footage
- Fetches clips from free APIs (Pexels, Pixabay, Unsplash)
- Adds 2-4 second clips as B-roll and transitions
- **Limited to 15% of total video duration**
- User can preview and remove before final render

### 4. **Scene Timing & Pacing**
- Calculates optimal scene duration based on content type
- Prioritizes action footage over static images
- Creates natural transitions between segments
- Syncs media with voiceover timing

### 5. **Metadata Generation**
- Auto-generates YouTube titles, descriptions, tags
- Creates SEO-optimized content
- Generates compelling thumbnails from your media
- Adds calls-to-action

---

## 🎬 Real-World Use Cases

### True Crime Channel
**Upload:** Crime scene photos, suspect images, detective interviews, location footage  
**Stock Enhancement:** Foggy alley transitions, old newspaper B-roll  
**Title:** "The Zodiac Killer's Hidden Message Finally Decoded"  
**Result:** 25-minute documentary-style video with expert commentary

### Missing Persons Channel
**Upload:** Photos of missing person, family interviews, last known location footage  
**Stock Enhancement:** Rain on window, clock ticking (time passing)  
**Title:** "Help Find Sarah: Missing Since 2019"  
**Result:** Awareness video with timeline and call-to-action

### Historical Documentary
**Upload:** Archival photos, war footage, historian interviews, maps  
**Stock Enhancement:** Period-appropriate establishing shots  
**Title:** "D-Day: The Untold Stories of Omaha Beach"  
**Result:** Educational documentary with historical context

### Sports Nostalgia (Original Example)
**Upload:** Race clips, horse photos, jockey interviews, vintage footage  
**Stock Enhancement:** Slow-motion grass, vintage film grain transitions  
**Title:** "UK's Most Tragic Horses: Gloria Victis Story"  
**Result:** Emotional tribute video with race highlights

---

## 🎨 Stock Footage System

### How It Works
1. **User Enables** - Toggle "Enhance with stock footage" (default: OFF)
2. **GPT-5 Analyzes** - Identifies transition points in narrative
3. **Smart Selection** - Generates contextually relevant search queries
4. **API Integration** - Fetches from Pexels, Pixabay, Unsplash (all free)
5. **Strategic Insertion** - Adds 2-4 second clips at natural break points
6. **User Preview** - Shows exactly what was added with removal options
7. **Final Render** - Assembles with approved enhancements

### Rules & Limits
- **Maximum:** 15% of total video duration
- **Purpose:** Transitions, B-roll, establishing shots only
- **Priority:** Your media ALWAYS takes precedence
- **Transparency:** All stock footage clearly labeled in preview
- **Control:** Remove any or all stock clips before render
- **Quality:** Only contextually relevant, professional footage

### Example Stock Queries
- "victorian london street foggy"
- "old newspaper texture"
- "rain window night"
- "clock ticking close up"
- "dark alley cobblestone"

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
│  │  1. Media Tagging  2. Script Gen  3. Stock Footage  │ │
│  │  4. Video Assembly  5. YouTube Upload               │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│                  ┌──────────────┐                          │
│                  │ Stock APIs   │                          │
│                  │ Pexels/Pixabay                          │
│                  └──────────────┘                          │
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
- [x] Project structure
- [x] Database schema design
- [x] API architecture documentation
- [x] Stock footage system design
- **Gateway Test:** Architecture review & approval

### **Phase 2: Frontend Core (Gateway 2)**
- [ ] React app with purple/black theme
- [ ] Glowing button components
- [ ] Project dashboard
- [ ] Media upload interface with tagging
- [ ] Stock footage toggle and settings
- **Gateway Test:** UI/UX review, theme validation

### **Phase 3: Backend Core (Gateway 3)**
- [ ] Node.js API server
- [ ] Supabase integration
- [ ] File storage system
- [ ] Authentication
- [ ] Stock footage API integration
- **Gateway Test:** API endpoints functional, database connected

### **Phase 4: GPT-5 Integration (Gateway 4)**
- [ ] OpenAI GPT-5 API setup
- [ ] Script generation engine
- [ ] Tag parsing & matching algorithm
- [ ] Stock footage query generation
- [ ] Context management for media library
- **Gateway Test:** GPT-5 generates quality scripts from tagged media

### **Phase 5: Video Processing (Gateway 5)**
- [ ] FFmpeg integration
- [ ] Video assembly engine
- [ ] Scene compositor
- [ ] Stock footage insertion
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
- [ ] Stock footage preview & approval UI
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
│   │   │   ├── stock/       # Stock footage manager
│   │   │   ├── youtube/     # YouTube API
│   │   │   └── storage/     # File management
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── docs/                     # Documentation
│   ├── architecture/        # System design docs
│   │   └── STOCK-FOOTAGE-SYSTEM.md
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
- **Stock Footage:** Pexels, Pixabay, Unsplash (all free)
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

# Stock Footage APIs (Free)
PEXELS_API_KEY=...
PIXABAY_API_KEY=...
UNSPLASH_API_KEY=...

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
- **Free Tier:** 2 videos/month, watermark, no stock footage
- **Creator Plan:** $29/month - 10 videos, no watermark, stock footage enabled
- **Pro Plan:** $79/month - Unlimited videos, priority processing, advanced features
- **Enterprise:** Custom pricing for agencies/networks

### Key Differentiator
**Real content with optional professional enhancement** - No AI-generated images/videos. Perfect for channels that need authenticity with the option for professional polish.

---

## 🎯 Success Metrics

### MVP Goals
- Generate 5-minute video from 20 tagged media items
- Script quality: Coherent, engaging, factually grounded
- Video quality: Smooth transitions, proper pacing
- Stock footage: 5-15% when enabled, contextually relevant
- YouTube upload: Successful with metadata
- User satisfaction: 90%+ rating

### Post-Launch Goals
- 100 active users in first 3 months
- 1,000 videos generated in first 6 months
- 90% user satisfaction rating
- 85%+ stock footage approval rate
- <5% video rejection rate

---

## 📝 Development Notes

### Key Principles
1. **Real Media Priority** - User's content is always primary
2. **User Control** - Full transparency and approval system
3. **Optional Enhancement** - Stock footage is opt-in, not required
4. **Quality Over Speed** - Better to take time than produce poor content
5. **Ethical Use** - Respect copyright, privacy, and sensitivity

### GPT-5 Programming Requirements
GPT-5 needs comprehensive prompting to understand:
- When to use stock footage (transitions only, never primary content)
- How to generate effective search queries
- Strict 15% duration limit
- User media always takes priority
- Quality validation and relevance checks

See `docs/architecture/STOCK-FOOTAGE-SYSTEM.md` for complete GPT-5 prompting strategy.

### Future Enhancements
- Multi-language support
- Custom voiceover uploads
- Advanced editing controls
- Collaboration features
- Analytics dashboard
- Template library
- Music integration

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

This is currently a solo project. Contributions welcome after MVP launch.

---

**Built with ❤️ for content creators who value authenticity and professional quality**