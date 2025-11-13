# 🎬 Stock Footage Filler System

**Feature:** Intelligent B-roll and transition footage using free stock APIs  
**Status:** Phase 2 Feature (Post-MVP)  
**Default:** OFF (User must enable)

---

## 🎯 Purpose

Allow GPT-5 to intelligently add short stock footage clips as transitions and B-roll between user's primary content, enhancing production value while maintaining authenticity.

---

## 🏗️ Architecture

### System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  STOCK FOOTAGE PIPELINE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User Enables Feature                                   │
│     └─> "Enhance with stock footage" toggle ON            │
│                                                             │
│  2. GPT-5 Analyzes Script                                  │
│     └─> Identifies transition points                       │
│     └─> Generates search queries                           │
│     └─> Determines clip duration (2-4 seconds)             │
│                                                             │
│  3. Stock API Manager                                      │
│     └─> Queries Pexels/Pixabay/Unsplash                   │
│     └─> Downloads clips                                     │
│     └─> Caches for reuse                                    │
│                                                             │
│  4. Video Assembly                                         │
│     └─> Inserts stock clips at designated points           │
│     └─> Adds subtle watermark (optional)                   │
│     └─> Tracks which clips are stock vs user               │
│                                                             │
│  5. Preview & Approval                                     │
│     └─> Shows user what stock was added                    │
│     └─> "Remove all stock" or "Remove specific clips"     │
│     └─> Final render after approval                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 GPT-5 Prompting Strategy

### Critical: GPT-5 Must Understand Its Job

GPT-5 needs **crystal clear instructions** on when, why, and how to use stock footage. Here's the comprehensive prompt system:

### Master Prompt Template

```
You are the Video Director AI for Tubey AI. Your job is to create compelling 
video narratives using ONLY the media provided by the user, with optional 
stock footage enhancements.

=== YOUR PRIMARY RESPONSIBILITIES ===

1. SCRIPT GENERATION
   - Analyze all user-provided media and their tags
   - Create a compelling narrative that uses ONLY available media
   - Never reference media that doesn't exist
   - Structure: Introduction → Main Content → Conclusion
   - Target length: 5-45 minutes based on available media

2. MEDIA MATCHING
   - Match script segments to specific user media by tag
   - Prioritize video clips over static images
   - Balance visual variety (don't overuse same media)
   - If media is missing for a segment, adjust script accordingly

3. STOCK FOOTAGE ENHANCEMENT (if enabled by user)
   - ONLY use stock footage for transitions and B-roll
   - NEVER replace user's primary content with stock
   - Maximum 15% of total video duration
   - Each stock clip: 2-4 seconds maximum
   - Must be contextually relevant and enhance flow

=== STOCK FOOTAGE RULES ===

WHEN TO ADD STOCK FOOTAGE:
✅ Transitions between major segments
✅ Establishing shots (location, time period, atmosphere)
✅ Visual metaphors (e.g., ticking clock for time passing)
✅ B-roll during voiceover-heavy segments
✅ Scene-setting before user's primary media

WHEN NOT TO ADD STOCK FOOTAGE:
❌ Never as primary content (user media always takes priority)
❌ Not during critical moments (reveals, key information)
❌ Not if user has relevant media already
❌ Not if it would feel disconnected or generic
❌ Not if total stock footage exceeds 15% of video

STOCK FOOTAGE SEARCH QUERIES:
- Keep queries simple and generic
- Focus on: locations, weather, objects, textures, time periods
- Examples: "london street night", "old newspaper", "rain window", 
  "victorian architecture", "foggy alley", "clock ticking"
- Avoid: people's faces, specific events, branded content

=== OUTPUT FORMAT ===

You must output a structured JSON response:

{
  "script": {
    "title": "Video title",
    "description": "YouTube description",
    "tags": ["tag1", "tag2"],
    "totalDuration": 1200,
    "scenes": [
      {
        "sceneNumber": 1,
        "duration": 5,
        "type": "user_media",
        "mediaId": "abc123",
        "mediaTag": "Jack the Ripper victim photo",
        "voiceover": "In 1888, London's East End was gripped by terror...",
        "transition": "fade"
      },
      {
        "sceneNumber": 2,
        "duration": 3,
        "type": "stock_footage",
        "searchQuery": "victorian london street foggy",
        "purpose": "Establishing shot - sets time period and atmosphere",
        "voiceover": null,
        "transition": "crossfade"
      },
      {
        "sceneNumber": 3,
        "duration": 15,
        "type": "user_media",
        "mediaId": "def456",
        "mediaTag": "Detective Jim Smith interview",
        "voiceover": null,
        "transition": "cut"
      }
    ]
  },
  "stockFootageUsed": {
    "totalClips": 3,
    "totalDuration": 8,
    "percentageOfVideo": 6.7,
    "clips": [
      {
        "sceneNumber": 2,
        "searchQuery": "victorian london street foggy",
        "duration": 3,
        "purpose": "Establishing shot"
      }
    ]
  },
  "userMediaUsed": {
    "totalClips": 18,
    "totalDuration": 1192,
    "percentageOfVideo": 93.3
  }
}

=== QUALITY CHECKS ===

Before finalizing, verify:
1. Every scene has either user media OR stock footage (never empty)
2. Stock footage is ≤15% of total duration
3. User's primary media is featured prominently
4. Script flows naturally with available media
5. No references to non-existent media
6. Transitions are appropriate for content type
7. Voiceover timing matches scene duration

=== CONTEXT AWARENESS ===

Content Type: {content_type} (e.g., "true crime", "historical documentary")
User Preference: Stock footage {enabled/disabled}
Available Media: {media_count} items
Total Media Duration: {total_user_media_duration} seconds
Target Video Length: {target_length} minutes

=== EXAMPLES ===

GOOD STOCK USAGE:
- 2-second foggy alley between crime scene photo and detective interview
- 3-second old newspaper texture during narration about historical context
- 4-second victorian street establishing shot before location-specific content

BAD STOCK USAGE:
- 30-second generic city footage replacing user's specific location video
- Stock footage of random person when user has actual subject photos
- Irrelevant nature scenes in urban crime documentary

=== YOUR GOAL ===

Create a professional, engaging video that:
1. Tells a compelling story using the user's authentic media
2. Enhances (not replaces) with subtle stock footage transitions
3. Maintains authenticity and credibility
4. Feels professionally produced
5. Respects the user's content and vision

Now, analyze the provided media library and create the video structure.
```

---

## 🔧 Technical Implementation

### Stock API Integration

```javascript
// Stock API Manager
class StockFootageManager {
  constructor() {
    this.apis = {
      pexels: {
        key: process.env.PEXELS_API_KEY,
        rateLimit: 200, // per hour
        endpoint: 'https://api.pexels.com/videos/search'
      },
      pixabay: {
        key: process.env.PIXABAY_API_KEY,
        rateLimit: 'unlimited',
        endpoint: 'https://pixabay.com/api/videos/'
      },
      unsplash: {
        key: process.env.UNSPLASH_API_KEY,
        rateLimit: 50, // per hour
        endpoint: 'https://api.unsplash.com/search/photos'
      }
    };
    this.cache = new Map(); // Cache downloaded clips
  }

  async searchStockFootage(query, duration = 3) {
    // Check cache first
    const cacheKey = `${query}_${duration}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Try APIs in order: Pexels → Pixabay → Unsplash
    let result = await this.searchPexels(query, duration);
    if (!result) result = await this.searchPixabay(query, duration);
    if (!result) result = await this.searchUnsplash(query);

    // Cache result
    if (result) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  async searchPexels(query, duration) {
    // Implementation: Search Pexels video API
    // Filter by duration, quality, relevance
    // Return best match
  }

  async downloadAndCache(url, filename) {
    // Download video clip
    // Store in Supabase Storage
    // Return local path
  }
}
```

### GPT-5 Integration

```javascript
// GPT-5 Video Director Service
class GPT5VideoDirector {
  async generateVideoStructure(userMedia, options) {
    const prompt = this.buildMasterPrompt({
      contentType: options.contentType,
      stockFootageEnabled: options.enableStockFootage,
      mediaLibrary: userMedia,
      targetLength: options.targetLength,
      videoTitle: options.title
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: this.formatMediaLibrary(userMedia) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const videoStructure = JSON.parse(response.choices[0].message.content);

    // Validate structure
    this.validateVideoStructure(videoStructure, options);

    return videoStructure;
  }

  validateVideoStructure(structure, options) {
    // Check stock footage doesn't exceed 15%
    if (structure.stockFootageUsed.percentageOfVideo > 15) {
      throw new Error('Stock footage exceeds 15% limit');
    }

    // Check all user media is accounted for
    // Check scene durations are reasonable
    // Check transitions are valid
  }
}
```

### Video Assembly with Stock Footage

```javascript
// Video Assembly Engine
class VideoAssembler {
  async assembleVideo(videoStructure, userMedia, stockFootage) {
    const scenes = [];

    for (const scene of videoStructure.script.scenes) {
      if (scene.type === 'user_media') {
        // Use user's media
        const media = userMedia.find(m => m.id === scene.mediaId);
        scenes.push({
          file: media.path,
          duration: scene.duration,
          type: 'user',
          transition: scene.transition
        });
      } else if (scene.type === 'stock_footage') {
        // Fetch stock footage
        const stock = await this.stockManager.searchStockFootage(
          scene.searchQuery,
          scene.duration
        );
        scenes.push({
          file: stock.path,
          duration: scene.duration,
          type: 'stock',
          watermark: true, // Optional subtle watermark
          transition: scene.transition
        });
      }
    }

    // Assemble with FFmpeg
    return await this.ffmpegAssemble(scenes, videoStructure);
  }
}
```

---

## 🎨 User Interface

### Settings Toggle

```
┌─────────────────────────────────────────────────────────┐
│  Video Generation Settings                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ☐ Enhance with stock footage transitions              │
│     Add professional B-roll and transitions using       │
│     free stock footage APIs (Pexels, Pixabay)          │
│                                                         │
│     ⚠️ Stock footage will be clearly labeled and       │
│        limited to 15% of total video duration          │
│                                                         │
│  [Advanced Options ▼]                                   │
│    • Max stock footage: 15% (default)                  │
│    • Watermark stock clips: Yes                        │
│    • Preview before render: Yes                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Preview Screen

```
┌─────────────────────────────────────────────────────────┐
│  Video Preview - "Jack the Ripper's First Victim"      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 Video Stats:                                        │
│     Total Duration: 24:32                              │
│     Your Media: 22:47 (92.8%)                          │
│     Stock Footage: 1:45 (7.2%)                         │
│                                                         │
│  🎬 Stock Footage Added (5 clips):                     │
│     1. Victorian London street (3s) - Scene 2          │
│     2. Foggy alley (2s) - Scene 7                      │
│     3. Old newspaper (3s) - Scene 12                   │
│     4. Rain on window (4s) - Scene 18                  │
│     5. Clock ticking (2s) - Scene 23                   │
│                                                         │
│  [Remove All Stock] [Remove Specific] [Approve & Render]│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema Updates

### Add to `projects` table:

```sql
ALTER TABLE projects ADD COLUMN enable_stock_footage BOOLEAN DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN max_stock_percentage INTEGER DEFAULT 15;
ALTER TABLE projects ADD COLUMN watermark_stock BOOLEAN DEFAULT TRUE;
```

### New `stock_footage_cache` table:

```sql
CREATE TABLE stock_footage_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  search_query TEXT NOT NULL,
  duration INTEGER NOT NULL,
  source TEXT NOT NULL, -- 'pexels', 'pixabay', 'unsplash'
  file_url TEXT NOT NULL,
  file_path TEXT,
  thumbnail_url TEXT,
  metadata JSONB,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stock_cache_query ON stock_footage_cache(search_query);
```

### New `video_stock_usage` table:

```sql
CREATE TABLE video_stock_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id),
  stock_footage_id UUID REFERENCES stock_footage_cache(id),
  scene_number INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  purpose TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚨 Safety & Quality Controls

### GPT-5 Validation Rules

1. **Stock Footage Limit:** Hard cap at 15% of total duration
2. **Relevance Check:** Each stock clip must have clear purpose
3. **User Media Priority:** Never replace user's primary content
4. **Transition Logic:** Stock only at natural break points
5. **Content Appropriateness:** No controversial/sensitive stock footage

### API Rate Limiting

```javascript
class RateLimiter {
  constructor() {
    this.limits = {
      pexels: { max: 200, window: 3600000, current: 0 },
      pixabay: { max: 999999, window: 3600000, current: 0 },
      unsplash: { max: 50, window: 3600000, current: 0 }
    };
  }

  async checkLimit(api) {
    // Check if within rate limit
    // If exceeded, wait or switch to different API
  }
}
```

---

## 💰 Cost Analysis

### Free Tier Limits

| API | Free Limit | Cost After |
|-----|-----------|------------|
| Pexels | 200 req/hour | Free forever |
| Pixabay | Unlimited | Free forever (attribution) |
| Unsplash | 50 req/hour | $19/month for 10K |

### Storage Costs

- Average stock clip: 5-10 MB
- 5 clips per video: 25-50 MB
- Cache for reuse: Reduces downloads by ~60%
- Estimated cost: $0.02 per video (Supabase storage)

---

## 🎯 Success Metrics

### Quality Indicators

- Stock footage usage: 5-15% of video (sweet spot: 8-10%)
- User approval rate: >85% keep stock footage
- Relevance score: GPT-5 self-rates each stock clip (>7/10)
- Render time impact: <20% increase

### User Feedback

- "Does stock footage enhance your video?" (Yes/No)
- "Were stock clips relevant?" (1-5 rating)
- "Would you use this feature again?" (Yes/No)

---

## 🚀 Rollout Plan

### Phase 2A: Foundation (Week 1-2)
- Integrate Pexels API
- Build stock footage manager
- Create caching system
- Test API rate limits

### Phase 2B: GPT-5 Integration (Week 3-4)
- Develop master prompt system
- Train GPT-5 with examples
- Build validation logic
- Test with sample projects

### Phase 2C: User Interface (Week 5)
- Add settings toggle
- Build preview screen
- Create approval workflow
- Add analytics tracking

### Phase 2D: Testing & Refinement (Week 6)
- Beta test with 10 users
- Gather feedback
- Refine GPT-5 prompts
- Optimize performance

---

## 📝 Documentation for Users

### Help Article: "Enhancing Videos with Stock Footage"

**What is stock footage enhancement?**
Tubey can automatically add short clips from free stock footage libraries (Pexels, Pixabay) as transitions and B-roll between your primary content.

**When should I use it?**
- You have limited media for certain segments
- You want professional transitions
- You need establishing shots or atmosphere

**When should I NOT use it?**
- You have all the media you need
- You want 100% your own content
- Your audience expects only authentic footage

**How much stock footage is added?**
Maximum 15% of your video, typically 5-10%. Your content always takes priority.

**Can I remove it?**
Yes! Before final render, you'll see exactly what stock was added and can remove any or all clips.

---

## ✅ Ready to Implement

This system gives GPT-5 clear guidelines while maintaining user control and authenticity. The hybrid approach ensures:

1. **User Choice:** Feature is optional, default OFF
2. **Transparency:** Users see exactly what's added
3. **Quality Control:** GPT-5 has strict rules and validation
4. **Cost Effective:** Free APIs with generous limits
5. **Authentic:** Real stock footage, not AI-generated

**Next Step:** Add this to Gateway 1 documentation and proceed with approval?