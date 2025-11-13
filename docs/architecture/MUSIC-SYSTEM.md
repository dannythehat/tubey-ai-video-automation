# 🎵 Music System Architecture

**Last Updated:** November 13, 2025

---

## Overview

The Music System intelligently adds copyright-free background music to scenes while **never adding music over user-uploaded videos**. GPT-5 analyzes scene emotion and selects appropriate music that matches both the scene and the channel's learned style.

---

## Core Requirements

### 1. Smart Detection
- **NEVER** add music over user-uploaded videos with audio
- Preserve original audio from user videos at 100% volume
- Only add music to image-based scenes or silent video clips

### 2. Scene Matching
- GPT-5 analyzes each scene's emotion (tense, sad, mysterious, dramatic, uplifting)
- Matches music intensity to scene intensity (0-10 scale)
- Considers pacing (slow, moderate, fast)

### 3. Copyright-Free Sources
- YouTube Audio Library (primary) - 1000+ tracks, no attribution
- Pixabay Music (secondary) - 10,000+ tracks, no attribution
- Free Music Archive (tertiary) - 100,000+ tracks, some require attribution
- Incompetech (fallback) - 2,000+ tracks, attribution required

### 4. Channel Learning
- Analyze existing channel videos to learn music preferences
- Extract: preferred moods, genres, instruments, volume levels
- Maintain consistency with channel's established style

### 5. User Control
- Preview all music selections before publishing
- Change or remove music from any scene
- Adjust volume levels globally or per-scene

---

## Copyright-Free Music Sources

### YouTube Audio Library (Primary)
- **Library Size:** 1000+ tracks
- **License:** 100% free, no attribution required
- **API:** YouTube Audio Library API
- **Categories:** Mood, genre, instrument, duration
- **Quality:** High (320kbps MP3)
- **Cost:** FREE

### Pixabay Music (Secondary)
- **Library Size:** 10,000+ tracks
- **License:** Free, no attribution required
- **API:** `https://pixabay.com/api/docs/`
- **Categories:** Mood, genre, tempo
- **Quality:** High (320kbps MP3)
- **Cost:** FREE

### Free Music Archive (Tertiary)
- **Library Size:** 100,000+ tracks
- **License:** Creative Commons (various)
- **API:** `https://freemusicarchive.org/api`
- **Categories:** Genre, mood, instrument
- **Quality:** Variable
- **Cost:** FREE (attribution required for some)

### Incompetech (Fallback)
- **Library Size:** 2,000+ tracks
- **License:** Royalty-free with attribution
- **API:** Custom scraping or manual download
- **Categories:** Genre, mood, feel
- **Quality:** High
- **Cost:** FREE (attribution required)

---

## GPT-5 Music Intelligence

### Scene Analysis Process

**Step 1: Media Type Detection**
```
IF scene.mediaType === "video" AND scene.hasAudio:
  → Skip music (preserve original audio)
  
IF scene.mediaType === "image":
  → Analyze emotion and add music
  
IF scene.mediaType === "video" AND scene.hasAudio === false:
  → Analyze emotion and add music (higher volume)
```

**Step 2: Emotion Analysis**
GPT-5 analyzes each scene:
- **Emotion:** Tense, sad, mysterious, dramatic, uplifting, neutral, suspenseful
- **Intensity:** 0-10 scale (0=calm, 10=extreme)
- **Pacing:** Slow, moderate, fast
- **Context:** Crime scene, interview, location, evidence, victim

**Step 3: Music Selection**
Match music to scene based on:
- Scene emotion + intensity
- Channel's learned music preferences
- Scene duration (select appropriate length)
- Previous scene's music (avoid repetition)

**Example:**
```
Scene 1: Image of crime scene
├─ Emotion: Tense
├─ Intensity: 7/10
├─ Pacing: Moderate
└─ Music: "Dark Ambient Tension" (YouTube Audio Library)

Scene 2: Video of detective interview
├─ Has Audio: YES
└─ Music: NONE (preserve interview audio)

Scene 3: Image of victim photo
├─ Emotion: Sad
├─ Intensity: 8/10
├─ Pacing: Slow
└─ Music: "Somber Piano" (Pixabay Music)

Scene 4: Video of location footage
├─ Has Audio: YES
└─ Music: NONE (preserve location audio)
```

---

## Channel Music Learning

### What GPT-5 Learns

**From Existing Videos:**
1. **Preferred Moods** - Dark, tense, mysterious, uplifting, neutral
2. **Preferred Genres** - Ambient, orchestral, electronic, piano, strings
3. **Preferred Instruments** - Piano, strings, synth, percussion
4. **Music Frequency** - Every scene, key moments only, minimal
5. **Volume Levels** - Background (-20dB), moderate (-15dB), prominent (-10dB)
6. **Transition Style** - Crossfade, hard cut, fade out

**Analysis Method:**
- Download 30-50 videos from channel
- Extract audio tracks
- Identify background music segments
- Analyze music characteristics (mood, genre, tempo)
- Detect volume levels and mixing patterns
- Store as "Channel Music DNA"

**Example: True Crime Channel**
```json
{
  "channelId": "true-crime-daily",
  "musicPreferences": {
    "preferredMoods": ["dark", "tense", "mysterious", "somber"],
    "preferredGenres": ["ambient", "orchestral", "piano"],
    "preferredInstruments": ["piano", "strings", "synth"],
    "musicFrequency": "key_moments",
    "averageVolumeDb": -20,
    "transitionStyle": "crossfade",
    "avoidedMoods": ["upbeat", "cheerful", "comedic"]
  }
}
```

---

## Audio Mixing Rules

### Priority System
1. **User Video Audio** - 100% volume (ALWAYS preserved)
2. **Voiceover** - Primary audio (-3dB)
3. **Background Music** - Secondary audio (-18dB to -25dB)

### Volume Levels
- **Background Music (default):** -20dB
- **Voiceover:** -3dB
- **User Video Audio:** 0dB (original volume)

### Smart Ducking
When voiceover plays over background music:
- Music volume: -25dB (ducked down)
- Voiceover volume: -3dB (clear and prominent)
- Transition: 1-2 second smooth fade

### Fade In/Out
- **Fade In:** 2 seconds at scene start
- **Fade Out:** 2 seconds at scene end
- **Crossfade:** 1 second overlap between tracks

---

## Database Schema

### music_library Table
```sql
CREATE TABLE music_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT,
  source TEXT NOT NULL, -- 'youtube_audio_library', 'pixabay', 'fma', 'incompetech'
  source_id TEXT,
  file_url TEXT NOT NULL,
  duration INTEGER NOT NULL, -- seconds
  
  -- Categorization
  mood TEXT[], -- ['tense', 'dark', 'mysterious']
  genre TEXT[], -- ['ambient', 'orchestral', 'electronic']
  instruments TEXT[], -- ['piano', 'strings', 'synth']
  intensity INTEGER CHECK (intensity BETWEEN 0 AND 10),
  tempo TEXT, -- 'slow', 'medium', 'fast'
  
  -- Licensing
  license_type TEXT NOT NULL, -- 'public_domain', 'cc0', 'cc_by'
  attribution_required BOOLEAN DEFAULT false,
  attribution_text TEXT,
  
  -- Metadata
  file_size INTEGER,
  format TEXT DEFAULT 'mp3',
  sample_rate INTEGER DEFAULT 44100,
  bitrate INTEGER DEFAULT 320,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_music_mood ON music_library USING GIN(mood);
CREATE INDEX idx_music_genre ON music_library USING GIN(genre);
CREATE INDEX idx_music_intensity ON music_library(intensity);
CREATE INDEX idx_music_source ON music_library(source);
```

### channel_music_preferences Table
```sql
CREATE TABLE channel_music_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  
  -- Learned preferences
  preferred_moods TEXT[],
  preferred_genres TEXT[],
  preferred_instruments TEXT[],
  
  -- Usage patterns
  music_frequency TEXT, -- 'every_scene', 'key_moments', 'minimal'
  average_volume_db INTEGER DEFAULT -20,
  transition_style TEXT DEFAULT 'crossfade',
  
  -- Avoid patterns
  avoided_moods TEXT[],
  avoided_genres TEXT[],
  
  -- Analysis metadata
  analyzed_videos_count INTEGER DEFAULT 0,
  last_analysis_at TIMESTAMPTZ,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(channel_id)
);

CREATE INDEX idx_channel_music_prefs ON channel_music_preferences(channel_id);
```

### video_music_tracks Table
```sql
CREATE TABLE video_music_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  music_id UUID REFERENCES music_library(id),
  
  -- Usage details
  start_time DECIMAL NOT NULL, -- seconds into video
  end_time DECIMAL NOT NULL,
  volume_db INTEGER DEFAULT -20,
  fade_in_duration DECIMAL DEFAULT 2.0,
  fade_out_duration DECIMAL DEFAULT 2.0,
  
  -- Scene context
  scene_number INTEGER,
  scene_emotion TEXT,
  scene_intensity INTEGER,
  
  -- User modifications
  user_modified BOOLEAN DEFAULT false,
  user_removed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_video_music_video ON video_music_tracks(video_id);
CREATE INDEX idx_video_music_track ON video_music_tracks(music_id);
```

---

## Video Generation Workflow

### Phase 1: Scene Analysis
1. GPT-5 receives all scenes with media
2. Detects media type (image vs video)
3. For videos: checks if audio exists
4. For images: analyzes emotion and intensity

### Phase 2: Music Selection
1. Load channel's music preferences
2. For each scene needing music:
   - Query music library by emotion + intensity
   - Filter by channel preferences
   - Select best match
   - Avoid repeating recent tracks

### Phase 3: Audio Assembly
1. Extract audio from user videos (preserve 100%)
2. Generate voiceover audio
3. Download selected music tracks
4. Mix using FFmpeg:
   - User video audio: 0dB
   - Voiceover: -3dB
   - Background music: -20dB with fades

### Phase 4: User Preview
1. Show music selections per scene
2. Allow changes/removal
3. Provide volume adjustment
4. Re-render if modified

---

## User Interface

### Music Settings (Video Generation)
```
┌─────────────────────────────────────┐
│ 🎵 Background Music                 │
├─────────────────────────────────────┤
│ ☑️ Enable background music          │
│ ☑️ Use channel's learned style      │
│                                     │
│ Music Intensity:                    │
│ ○ Minimal  ● Moderate  ○ Prominent │
│                                     │
│ Apply music to:                     │
│ ☑️ Image scenes only (recommended)  │
│ ☐ Silent video scenes               │
│                                     │
│ Learned Preferences:                │
│ Moods: Dark, Tense, Mysterious      │
│ Genres: Ambient, Orchestral         │
│                                     │
│ Volume: -20dB ▓▓▓▓▓░░░░░ Background │
└─────────────────────────────────────┘
```

### Scene Preview (Music)
```
Scene 1: Crime scene photo (8s)
├─ 🎵 "Dark Ambient Tension"
├─ 🔊 -20dB (background)
├─ 📁 YouTube Audio Library
└─ [Change] [Remove]

Scene 2: Detective interview (15s)
├─ 🎵 No music
└─ ✅ Original audio preserved

Scene 3: Victim photo (10s)
├─ 🎵 "Somber Piano"
├─ 🔊 -20dB (background)
├─ 📁 Pixabay Music
└─ [Change] [Remove]
```

---

## Cost Analysis

### Storage Costs
- Average track size: 3-5MB (320kbps MP3)
- Library size: 100 tracks = 500MB
- Storage cost: ~$0.02/month (Supabase)

### API Costs
- YouTube Audio Library: FREE
- Pixabay Music: FREE
- Free Music Archive: FREE
- Incompetech: FREE

### Total Cost
- **Music acquisition:** $0/month
- **Storage:** $0.02/month
- **Bandwidth:** ~$0.10/month (100 videos)
- **Total:** ~$0.12/month

---

## Attribution Requirements

### Tracks Requiring Attribution
- Free Music Archive (some tracks)
- Incompetech (all tracks)

### Attribution Format
Add to video description:
```
Music:
- "Track Name" by Artist Name (Source)
- "Dark Ambient Tension" by Kevin MacLeod (Incompetech)
- Licensed under Creative Commons: By Attribution 4.0
```

### Auto-Attribution
- System automatically detects tracks requiring attribution
- Appends to video description before YouTube upload
- User can review and edit before publishing

---

## Future Enhancements

### Phase 1 (MVP)
- YouTube Audio Library integration
- Pixabay Music integration
- Basic emotion matching
- Channel music learning

### Phase 2
- Free Music Archive integration
- Advanced emotion analysis
- Music crossfading between scenes
- User music uploads

### Phase 3
- Custom music library per user
- Music tempo matching to scene pacing
- Dynamic volume adjustment
- Music recommendation engine

---

## Success Metrics

### MVP Goals
- 90%+ music selections match scene emotion
- 95%+ user satisfaction with music choices
- 0% copyright strikes
- <5% music removal rate

### Quality Metrics
- Music enhances scene emotion
- Volume levels appropriate (not overpowering)
- Smooth transitions between tracks
- No music over user video audio

---

**Built to enhance drama and emotion while respecting user content and copyright law**
