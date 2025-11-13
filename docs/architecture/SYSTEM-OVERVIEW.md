# 🏗️ Tubey System Architecture

**Last Updated:** November 13, 2025  
**Version:** 1.0.0

---

## 🎯 System Purpose

Tubey is an AI-powered video automation platform that transforms tagged media libraries into professionally-produced YouTube videos with zero manual editing. Built specifically for daily horse racing nostalgia content creation.

---

## 🧩 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                             │
│                     (React + Tailwind CSS)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  Dashboard   │  │ Media Library│  │ Video Editor │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS/REST API
┌────────────────────────────┴────────────────────────────────────────┐
│                        API GATEWAY LAYER                            │
│                      (Express.js + Auth)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Auth Routes  │  │ Media Routes │  │ Video Routes │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└────────────────────────────┬────────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                           │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    GPT-5 INTELLIGENCE HUB                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │  │
│  │  │Script Engine │  │ Tag Matcher  │  │Scene Director│     │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │Video Service │  │YouTube Service│ │Storage Service│            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└────────────────────────────┬────────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────────┐
│                      DATA & PROCESSING LAYER                        │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  Supabase DB │  │ File Storage │  │ Redis Queue  │            │
│  │ (PostgreSQL) │  │  (Supabase)  │  │    (Bull)    │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              VIDEO PROCESSING PIPELINE                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │  FFmpeg  │→ │   TTS    │→ │Compositor│→ │ Encoder  │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────────┐
│                      EXTERNAL SERVICES                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  OpenAI API  │  │ YouTube API  │  │ElevenLabs API│            │
│  │    (GPT-5)   │  │   (Upload)   │  │    (TTS)     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Core Workflows

### Workflow 1: Video Creation (Happy Path)

```
User Action                 System Response                 GPT-5 Decision
─────────────────────────────────────────────────────────────────────────
1. Upload media files   →   Store in Supabase Storage
2. Add tags to media    →   Save tags to database
3. Set video title      →   Create project record
4. Click "Generate"     →   Queue video job
                        ↓
5. Job starts           →   Fetch project + media       →  Analyze media library
                        ↓                                   - Count images/videos
6. Script generation    ←   Request script              ←  - Identify themes
                        ↓                                   - Structure narrative
7. Script created       →   Save to database            →  Generate compelling script
                        ↓                                   - Match tags to story
8. Media matching       →   Parse script for tags       →  - Decide scene order
                        ↓                                   - Calculate timing
9. Scene planning       →   Create scene timeline       →  - Select best media
                        ↓                                   - Plan transitions
10. TTS generation      →   Generate voiceover audio
                        ↓
11. Video assembly      →   FFmpeg: Combine media
                        ↓   - Add transitions
                        ↓   - Sync audio
                        ↓   - Add captions
12. Encoding            →   Compress final video
                        ↓
13. Thumbnail gen       →   Extract key frame           →  Select most compelling image
                        ↓
14. YouTube upload      →   Upload with metadata
                        ↓
15. Publish             →   Set video public
                        ↓
16. Notify user         →   Send completion email
```

### Workflow 2: Error Handling

```
Error Scenario              Detection                   Recovery Action
─────────────────────────────────────────────────────────────────────────
Missing media for tag   →   Tag parser finds no match   →  GPT-5 suggests alternatives
                                                            or generic footage

Script too long         →   Duration calculator         →  GPT-5 condenses script
                            exceeds target                  to fit duration

TTS API failure         →   HTTP error response         →  Retry 3x, then use
                                                            fallback TTS service

FFmpeg crash            →   Process exit code != 0      →  Log error, retry with
                                                            lower quality settings

YouTube quota exceeded  →   API returns 403             →  Queue for next day,
                                                            notify user

Insufficient storage    →   Storage check fails         →  Clean old temp files,
                                                            compress media
```

---

## 🧠 GPT-5 Intelligence Layer

### Core Responsibilities

**1. Script Generation**
- Input: Project title, tagged media inventory, target duration
- Process: Analyze available media, create narrative structure
- Output: Timestamped script with tag references

**2. Tag Matching**
- Input: Generated script, media library with tags
- Process: Parse script for tag mentions, rank media by relevance
- Output: Scene-by-scene media assignments

**3. Scene Direction**
- Input: Matched media, script timing
- Process: Calculate optimal scene duration, plan transitions
- Output: Detailed scene timeline with media + timing

**4. Metadata Generation**
- Input: Final video content, script
- Process: Generate SEO-optimized title, description, tags
- Output: YouTube-ready metadata

### GPT-5 Prompt Architecture

```javascript
// Script Generation Prompt Template
const scriptPrompt = `
You are a professional video scriptwriter specializing in horse racing nostalgia content.

PROJECT DETAILS:
- Title: ${projectTitle}
- Target Duration: ${targetDuration} seconds
- Tone: Nostalgic, emotional, respectful

AVAILABLE MEDIA:
${mediaInventory.map(m => `- ${m.tags.join(', ')} (${m.type})`).join('\n')}

TASK:
Create a compelling script that:
1. Tells a cohesive story about ${projectTitle}
2. References available media naturally (use exact tag names)
3. Fits within ${targetDuration} seconds when narrated
4. Includes emotional moments and factual information
5. Ends with a memorable conclusion

FORMAT:
[00:00-00:15] Introduction
Script: "Welcome to Horse Racing Nostalgia..."
Tags: [intro-footage]

[00:15-00:45] Main content
Script: "Our first horse is Gloria Victis..."
Tags: [Gloria Victis Horse, Gloria Victis Trainer Martin Pipe]

...continue for full duration
`;
```

---

## 📊 Data Models

### Project
```typescript
interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDuration: number; // seconds
  status: 'draft' | 'processing' | 'completed' | 'failed';
  script?: string;
  videoUrl?: string;
  youtubeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### MediaAsset
```typescript
interface MediaAsset {
  id: string;
  projectId: string;
  fileUrl: string;
  fileType: 'image' | 'video';
  fileSize: number;
  duration?: number; // for videos
  tags: string[];
  metadata?: {
    width: number;
    height: number;
    format: string;
  };
  createdAt: Date;
}
```

### VideoRender
```typescript
interface VideoRender {
  id: string;
  projectId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  errorMessage?: string;
  outputUrl?: string;
  duration?: number;
  fileSize?: number;
  processingStartedAt?: Date;
  completedAt?: Date;
}
```

### Scene
```typescript
interface Scene {
  id: string;
  renderId: string;
  startTime: number; // seconds
  endTime: number;
  mediaAssetId: string;
  transitionType: 'fade' | 'cut' | 'dissolve';
  transitionDuration: number; // seconds
  scriptText: string;
  order: number;
}
```

---

## 🔐 Security Architecture

### Authentication Flow
```
1. User visits app → Supabase Auth checks session
2. No session → Redirect to login
3. Login with email/password → Supabase creates session
4. Session token stored in httpOnly cookie
5. All API requests include session token
6. Backend validates token with Supabase
7. User ID extracted for authorization
```

### Authorization Rules
- Users can only access their own projects
- Media assets scoped to project owner
- YouTube credentials encrypted at rest
- API keys stored in environment variables (never in code)

### Data Protection
- All API communication over HTTPS
- Database connections encrypted (TLS)
- File uploads scanned for malware (future)
- Rate limiting on all endpoints
- Input validation on all user data

---

## 🚀 Deployment Architecture

### Frontend (Vercel)
```
GitHub Push → Vercel Build → Deploy to CDN
- Automatic HTTPS
- Global CDN distribution
- Preview deployments for PRs
- Environment variables managed in Vercel dashboard
```

### Backend (Railway)
```
GitHub Push → Railway Build → Deploy to Container
- Automatic HTTPS
- Health check monitoring
- Auto-restart on failure
- Environment variables managed in Railway dashboard
```

### Database (Supabase)
```
Hosted PostgreSQL with:
- Automatic backups (daily)
- Connection pooling
- Row-level security
- Real-time subscriptions (future feature)
```

---

## 📈 Scalability Considerations

### Current Architecture (MVP)
- **Concurrent Users:** 1 (you)
- **Videos/Day:** 1-5
- **Storage:** ~10GB (free tier)
- **Processing:** Sequential (one video at a time)

### Future Scaling (Multi-User)
- **Concurrent Users:** 100+
- **Videos/Day:** 500+
- **Storage:** 1TB+ (paid tier)
- **Processing:** Parallel (worker pool)

### Scaling Strategy
1. **Phase 1 (Now):** Single-user, free tiers
2. **Phase 2:** Add user authentication, keep free tiers
3. **Phase 3:** Implement queue system for multiple users
4. **Phase 4:** Move video processing to dedicated workers
5. **Phase 5:** Add CDN for video delivery

---

## 🔧 Technology Decisions

### Why React?
- ✅ Large ecosystem, familiar to developer
- ✅ Component reusability
- ✅ Strong TypeScript support
- ❌ Bundle size (mitigated with code splitting)

### Why Node.js Backend?
- ✅ JavaScript everywhere (shared types)
- ✅ Excellent FFmpeg bindings
- ✅ Async I/O perfect for video processing
- ❌ Single-threaded (mitigated with worker threads)

### Why Supabase?
- ✅ Generous free tier (500MB DB, 1GB storage)
- ✅ Built-in auth and storage
- ✅ PostgreSQL (robust, familiar)
- ❌ Vendor lock-in (acceptable for MVP)

### Why GPT-5?
- ✅ Best-in-class language understanding
- ✅ Consistent, creative output
- ✅ Handles complex context (media inventory)
- ❌ Cost per request (acceptable for daily use)

### Why FFmpeg?
- ✅ Industry standard, battle-tested
- ✅ Supports all video formats
- ✅ Powerful CLI, good Node.js bindings
- ❌ Complex syntax (mitigated with wrapper library)

---

## 📊 Performance Targets

### Response Times
- **Page Load:** <2 seconds
- **API Requests:** <500ms
- **File Upload:** <5 seconds per 100MB
- **Video Generation:** <10 minutes for 10-minute video

### Resource Usage
- **Frontend Bundle:** <500KB gzipped
- **Backend Memory:** <512MB per process
- **Database Queries:** <100ms average
- **Storage:** <1GB per project

---

## 🔍 Monitoring & Observability

### Metrics to Track
- Video generation success rate
- Average processing time
- API error rates
- Storage usage trends
- YouTube upload success rate

### Logging Strategy
- **Info:** User actions, job starts/completions
- **Warn:** Retries, fallback activations
- **Error:** Failures, exceptions, crashes
- **Debug:** Detailed processing steps (dev only)

### Alerting (Future)
- Email on video generation failure
- Slack notification on YouTube upload success
- Dashboard for daily statistics

---

**Next:** [Data Flow Documentation](./DATA-FLOW.md)
