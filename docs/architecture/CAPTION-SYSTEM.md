# 🎬 Caption System Architecture

**Last Updated:** November 13, 2025

---

## Overview

The Caption System automatically generates, customizes, and applies captions/subtitles to videos while learning and matching each channel's unique caption style. This ensures brand consistency and improves accessibility across all generated content.

---

## Core Features

### 1. **Auto-Generated Captions**
- Transcribe voiceover audio to text
- Generate accurate timestamps
- Support multiple caption formats (SRT, VTT, ASS)
- Multi-language support

### 2. **Channel Style Learning**
- Analyze existing channel videos for caption patterns
- Learn font, size, color, positioning preferences
- Detect animation styles (fade, pop, typewriter, slide)
- Identify keyword highlighting patterns
- Track emoji and formatting usage

### 3. **Caption Types**
- **Full Transcription** - Every spoken word
- **Keyword Highlights** - Important phrases only
- **Scene Descriptions** - Accessibility descriptions
- **Bilingual Captions** - Multiple languages simultaneously
- **Custom Styles** - User-defined formatting

### 4. **Accessibility Features**
- WCAG 2.1 AA compliance
- Speaker identification
- Sound effect descriptions
- Music/audio cues
- Color contrast validation

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPTION SYSTEM                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. CHANNEL CAPTION ANALYSIS                         │  │
│  │                                                      │  │
│  │  Input: Connected channel videos                    │  │
│  │  Process:                                            │  │
│  │    - Download sample videos with captions           │  │
│  │    - Extract caption files (SRT/VTT)                │  │
│  │    - Analyze visual caption rendering               │  │
│  │    - Detect patterns and preferences                │  │
│  │  Output: Channel Caption DNA                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  2. VOICEOVER TRANSCRIPTION                          │  │
│  │                                                      │  │
│  │  Input: Generated voiceover audio file              │  │
│  │  APIs:                                               │  │
│  │    - Primary: OpenAI Whisper API                    │  │
│  │    - Fallback: AssemblyAI                           │  │
│  │    - Fallback: Google Speech-to-Text                │  │
│  │  Process:                                            │  │
│  │    - Upload audio to transcription API              │  │
│  │    - Receive timestamped transcript                 │  │
│  │    - Validate accuracy (confidence scores)          │  │
│  │  Output: Raw transcript with timestamps             │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  3. CAPTION GENERATION                               │  │
│  │                                                      │  │
│  │  Input: Transcript + Channel Caption DNA            │  │
│  │  Process:                                            │  │
│  │    - Apply channel's caption style                  │  │
│  │    - Format according to type (full/keywords)       │  │
│  │    - Add speaker labels if multi-speaker            │  │
│  │    - Insert sound effect descriptions               │  │
│  │    - Apply keyword highlighting                     │  │
│  │    - Generate multiple language versions            │  │
│  │  Output: Styled caption files (SRT/VTT/ASS)         │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  4. CAPTION RENDERING                                │  │
│  │                                                      │  │
│  │  Input: Video + Caption files + Style settings      │  │
│  │  Process:                                            │  │
│  │    - Burn captions into video (hardcoded)           │  │
│  │    - OR attach as separate subtitle track           │  │
│  │    - Apply visual styling (font, color, position)   │  │
│  │    - Add animations (fade, pop, typewriter)         │  │
│  │    - Ensure readability (contrast, sizing)          │  │
│  │  Output: Final video with captions                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Channel Caption DNA

### What We Learn From Existing Videos

```json
{
  "channelId": "uuid",
  "captionDNA": {
    "visual": {
      "font": {
        "family": "Arial Bold",
        "size": 48,
        "weight": "bold",
        "color": "#FFFFFF",
        "outlineColor": "#000000",
        "outlineWidth": 2,
        "shadowEnabled": true,
        "shadowColor": "#000000",
        "shadowOffset": { "x": 2, "y": 2 }
      },
      "positioning": {
        "vertical": "bottom",
        "horizontal": "center",
        "marginBottom": 80,
        "maxWidth": "80%"
      },
      "background": {
        "enabled": true,
        "color": "#000000",
        "opacity": 0.7,
        "padding": 10,
        "borderRadius": 5
      }
    },
    "animation": {
      "type": "fade",
      "duration": 0.3,
      "easing": "ease-in-out"
    },
    "formatting": {
      "maxCharsPerLine": 42,
      "maxLines": 2,
      "lineBreakStrategy": "natural",
      "capitalization": "sentence",
      "punctuation": true
    },
    "highlighting": {
      "enabled": true,
      "keywords": ["evidence", "suspect", "victim", "detective"],
      "highlightColor": "#FFD700",
      "highlightStyle": "bold"
    },
    "accessibility": {
      "speakerLabels": true,
      "soundEffects": true,
      "musicCues": true
    },
    "languages": ["en"],
    "defaultType": "full"
  }
}
```

---

## Caption Types

### 1. Full Transcription
**Use Case:** Complete accessibility, educational content, detailed narratives

**Example:**
```
1
00:00:00,000 --> 00:00:03,500
On the night of August 31st, 1888,
something terrible happened in London.

2
00:00:03,500 --> 00:00:07,200
Mary Ann Nichols became the first victim
of the infamous Jack the Ripper.
```

### 2. Keyword Highlights
**Use Case:** Social media, fast-paced content, emphasis on key points

**Example:**
```
1
00:00:00,000 --> 00:00:03,500
AUGUST 31ST, 1888

2
00:00:03,500 --> 00:00:07,200
FIRST VICTIM: MARY ANN NICHOLS
```

### 3. Scene Descriptions
**Use Case:** Accessibility for deaf/hard-of-hearing viewers

**Example:**
```
1
00:00:00,000 --> 00:00:03,500
[Ominous music playing]
[Image: Dark Victorian London street]

2
00:00:03,500 --> 00:00:07,200
[Narrator speaking solemnly]
Mary Ann Nichols became the first victim...
```

### 4. Bilingual Captions
**Use Case:** International audiences, educational content

**Example:**
```
1
00:00:00,000 --> 00:00:03,500
On the night of August 31st, 1888...
En la noche del 31 de agosto de 1888...

2
00:00:03,500 --> 00:00:07,200
Mary Ann Nichols became the first victim...
Mary Ann Nichols se convirtió en la primera víctima...
```

---

## Transcription APIs

### Primary: OpenAI Whisper API

**Pros:**
- Highest accuracy (95%+)
- Multi-language support (99 languages)
- Automatic punctuation and capitalization
- Speaker diarization
- Timestamp precision

**Pricing:**
- $0.006 per minute
- 20-minute video = $0.12

**Implementation:**
```javascript
const transcription = await openai.audio.transcriptions.create({
  file: audioFile,
  model: "whisper-1",
  response_format: "verbose_json",
  timestamp_granularities: ["word", "segment"]
});
```

### Fallback 1: AssemblyAI

**Pros:**
- Excellent accuracy (94%+)
- Real-time transcription
- Auto-chapters and summaries
- Content moderation

**Pricing:**
- $0.00025 per second
- 20-minute video = $0.30

### Fallback 2: Google Speech-to-Text

**Pros:**
- Reliable and fast
- Good multi-language support
- Integration with Google Cloud

**Pricing:**
- $0.006 per 15 seconds
- 20-minute video = $0.48

---

## Caption Formats

### SRT (SubRip)
**Most Common Format**
```
1
00:00:00,000 --> 00:00:03,500
On the night of August 31st, 1888,
something terrible happened in London.
```

### VTT (WebVTT)
**Web Standard**
```
WEBVTT

00:00:00.000 --> 00:00:03.500
On the night of August 31st, 1888,
something terrible happened in London.
```

### ASS (Advanced SubStation Alpha)
**Advanced Styling**
```
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, Bold
Style: Default,Arial,48,&H00FFFFFF,1

[Events]
Format: Start, End, Style, Text
Dialogue: 0:00:00.00,0:00:03.50,Default,On the night of August 31st...
```

---

## Database Schema

### Tables

```sql
-- Channel caption preferences learned from analysis
CREATE TABLE channel_caption_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  caption_dna JSONB NOT NULL, -- Full style configuration
  confidence_score DECIMAL(3,2), -- 0.00-1.00
  sample_size INTEGER, -- Number of videos analyzed
  last_analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated captions for videos
CREATE TABLE video_captions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
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
  UNIQUE(video_id, language, caption_type)
);

-- Individual caption segments with timestamps
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transcription jobs tracking
CREATE TABLE transcription_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  audio_file_url TEXT NOT NULL,
  api_provider VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'pending', 'processing', 'completed', 'failed'
  job_id TEXT, -- External API job ID
  error_message TEXT,
  processing_time_seconds INTEGER,
  cost_usd DECIMAL(10,4),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_channel_caption_styles_channel ON channel_caption_styles(channel_id);
CREATE INDEX idx_video_captions_video ON video_captions(video_id);
CREATE INDEX idx_video_captions_language ON video_captions(language);
CREATE INDEX idx_caption_segments_video_caption ON caption_segments(video_caption_id);
CREATE INDEX idx_caption_segments_time ON caption_segments(start_time, end_time);
CREATE INDEX idx_transcription_jobs_video ON transcription_jobs(video_id);
CREATE INDEX idx_transcription_jobs_status ON transcription_jobs(status);
```

---

## API Endpoints

### Channel Caption Analysis

```
POST /api/channels/:channelId/analyze-captions
Description: Analyze channel's existing videos to learn caption style
Request Body:
{
  "sampleSize": 10, // Number of videos to analyze
  "forceRefresh": false
}
Response:
{
  "channelId": "uuid",
  "captionDNA": { /* style configuration */ },
  "confidenceScore": 0.95,
  "videosAnalyzed": 10,
  "analyzedAt": "2025-11-13T06:00:00Z"
}
```

### Generate Captions

```
POST /api/videos/:videoId/captions/generate
Description: Generate captions for a video
Request Body:
{
  "languages": ["en", "es"],
  "captionType": "full", // 'full', 'keywords', 'descriptions', 'bilingual'
  "useChannelStyle": true,
  "customStyle": { /* optional override */ }
}
Response:
{
  "videoId": "uuid",
  "captions": [
    {
      "id": "uuid",
      "language": "en",
      "type": "full",
      "format": "srt",
      "fileUrl": "https://storage/captions/video-en.srt",
      "wordCount": 1250,
      "duration": 1200,
      "confidenceScore": 0.96
    }
  ],
  "transcriptionCost": 0.12,
  "processingTime": 45
}
```

### Get Captions

```
GET /api/videos/:videoId/captions
Description: Get all captions for a video
Query Parameters:
  - language: Filter by language (optional)
  - type: Filter by caption type (optional)
Response:
{
  "videoId": "uuid",
  "captions": [
    {
      "id": "uuid",
      "language": "en",
      "type": "full",
      "format": "srt",
      "fileUrl": "https://storage/captions/video-en.srt",
      "downloadUrl": "https://api/captions/uuid/download"
    }
  ]
}
```

### Download Caption File

```
GET /api/captions/:captionId/download
Description: Download caption file in specified format
Query Parameters:
  - format: 'srt', 'vtt', 'ass' (optional, defaults to stored format)
Response: Caption file content with appropriate Content-Type header
```

### Update Caption Style

```
PUT /api/channels/:channelId/caption-style
Description: Update or override channel's caption style
Request Body:
{
  "captionDNA": { /* style configuration */ }
}
Response:
{
  "channelId": "uuid",
  "captionDNA": { /* updated style */ },
  "updatedAt": "2025-11-13T06:00:00Z"
}
```

### Get Caption Segments

```
GET /api/captions/:captionId/segments
Description: Get individual caption segments with timestamps
Query Parameters:
  - startTime: Filter segments after this time (seconds)
  - endTime: Filter segments before this time (seconds)
Response:
{
  "captionId": "uuid",
  "segments": [
    {
      "id": "uuid",
      "sequence": 1,
      "startTime": 0.0,
      "endTime": 3.5,
      "text": "On the night of August 31st, 1888...",
      "keywords": ["August 31st", "1888"],
      "confidenceScore": 0.98
    }
  ]
}
```

---

## Implementation Workflow

### Phase 1: Channel Analysis (One-Time)
1. User connects channel
2. System downloads 10 sample videos
3. Extract existing captions (if available)
4. Analyze visual caption rendering
5. Generate Channel Caption DNA
6. Store in database

### Phase 2: Video Generation (Per Video)
1. User creates video with Tubey
2. Voiceover audio generated
3. Audio sent to Whisper API for transcription
4. Transcript processed and formatted
5. Channel Caption DNA applied
6. Caption files generated (SRT/VTT/ASS)
7. Captions burned into video OR attached as separate track
8. User previews video with captions
9. User can adjust caption style if needed
10. Final video rendered with approved captions

### Phase 3: Multi-Language Support (Optional)
1. User selects additional languages
2. Transcript translated via GPT-5
3. Translated captions generated
4. Multiple caption tracks attached to video
5. User can select language in video player

---

## Caption Rendering Options

### Option 1: Hardcoded Captions (Burned-In)
**Pros:**
- Always visible, no player support needed
- Consistent across all platforms
- Matches channel style perfectly

**Cons:**
- Cannot be disabled by viewer
- Increases render time
- Cannot change after publish

**Use Case:** Social media (TikTok, Instagram), where captions are expected

### Option 2: Soft Subtitles (Separate Track)
**Pros:**
- Viewer can enable/disable
- Multiple language options
- Faster rendering
- Can update after publish

**Cons:**
- Requires player support
- May not match channel style exactly
- Platform-dependent styling

**Use Case:** YouTube, where viewers prefer control

### Option 3: Hybrid Approach
- Hardcode keyword highlights
- Attach full transcript as soft subtitle
- Best of both worlds

---

## Cost Analysis

### Per 20-Minute Video

**Transcription:**
- Whisper API: $0.12
- Storage (caption files): $0.001
- Processing: $0.02

**Total per video:** ~$0.14

**Monthly (100 videos):** ~$14

**Yearly (1,200 videos):** ~$168

---

## Accessibility Compliance

### WCAG 2.1 AA Standards

**Requirements:**
- ✅ Captions for all audio content
- ✅ Color contrast ratio ≥ 4.5:1
- ✅ Resizable text (up to 200%)
- ✅ Speaker identification
- ✅ Sound effect descriptions
- ✅ Keyboard navigation support

**Implementation:**
- Auto-validate contrast ratios
- Provide multiple caption sizes
- Include [Speaker] labels
- Add [Sound Effect] descriptions
- Support keyboard shortcuts for caption control

---

## Future Enhancements

### Phase 2 Features
- Real-time caption editing interface
- AI-powered caption timing optimization
- Automatic keyword detection and highlighting
- Caption style A/B testing
- Viewer engagement analytics (caption interaction)

### Phase 3 Features
- Live caption generation for streaming
- Collaborative caption editing
- Community-contributed translations
- Caption quality scoring
- Auto-correction based on viewer feedback

---

## Testing Strategy

### Unit Tests
- Caption format conversion (SRT ↔ VTT ↔ ASS)
- Timestamp validation
- Text formatting and line breaking
- Keyword highlighting logic

### Integration Tests
- Whisper API integration
- Caption file storage and retrieval
- Multi-language generation
- Style application accuracy

### Quality Assurance
- Manual review of sample captions
- Accuracy comparison with human transcription
- Style consistency validation
- Accessibility compliance testing

---

## Success Metrics

**Accuracy:**
- Transcription accuracy ≥ 95%
- Timestamp precision ≤ 100ms error

**Performance:**
- Caption generation ≤ 60 seconds per video
- API response time ≤ 2 seconds

**Quality:**
- Style match confidence ≥ 90%
- User satisfaction ≥ 4.5/5 stars

**Adoption:**
- 80%+ of videos use auto-captions
- 50%+ enable multi-language captions

---

## Conclusion

The Caption System ensures every Tubey-generated video includes professional, accessible, and brand-consistent captions that match each channel's unique style. By learning from existing content and leveraging state-of-the-art transcription APIs, we provide a seamless captioning experience that enhances viewer engagement and accessibility.
