# 🎙️ Voiceover System Architecture

**Last Updated:** November 13, 2025  
**Version:** 1.0.0

---

## 🎯 System Purpose

The Voiceover System provides professional AI-generated narration for videos using ElevenLabs Text-to-Speech API. Users can browse, preview, and select voices that match their channel's personality, with intelligent recommendations from GPT-5 based on channel DNA analysis.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    VOICEOVER SYSTEM FLOW                        │
└─────────────────────────────────────────────────────────────────┘

SETUP PHASE (One-time per channel):
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ User connects│───▶│ GPT-5 analyzes│──▶│ Recommends   │
│   channel    │    │  channel DNA  │   │ 3-5 voices   │
└──────────────┘    └──────────────┘    └──────┬───────┘
                                               │
                    ┌──────────────────────────┘
                    ▼
         ┌──────────────────────┐
         │ User browses voice   │
         │ library (ElevenLabs) │
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────┐
         │ Preview voices with  │
         │   sample script      │
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────┐
         │ Select default voice │
         │ + adjust settings    │
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────┐
         │ Save to channel      │
         │     profile          │
         └──────────────────────┘

VIDEO GENERATION PHASE:
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ User creates │───▶│ Load channel │───▶│ User can     │
│   project    │    │ default voice│    │ override     │
└──────────────┘    └──────────────┘    └──────┬───────┘
                                               │
                    ┌──────────────────────────┘
                    ▼
         ┌──────────────────────┐
         │ GPT-5 generates      │
         │ timestamped script   │
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────┐
         │ Send script to       │
         │ ElevenLabs API       │
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────┐
         │ Receive audio file   │
         │ + duration data      │
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────┐
         │ Store in Supabase    │
         │ Storage              │
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────┐
         │ Sync with video in   │
         │ FFmpeg pipeline      │
         └──────────────────────┘
```

---

## 🗄️ Database Schema

### **Channels Table Updates**

```sql
-- Add voice configuration to channels table
ALTER TABLE channels ADD COLUMN voice_id VARCHAR(255);
ALTER TABLE channels ADD COLUMN voice_name VARCHAR(255);
ALTER TABLE channels ADD COLUMN voice_provider VARCHAR(50) DEFAULT 'elevenlabs';
ALTER TABLE channels ADD COLUMN voice_settings JSONB DEFAULT '{
  "stability": 0.75,
  "similarity_boost": 0.75,
  "style": 0.0,
  "use_speaker_boost": true
}'::jsonb;
ALTER TABLE channels ADD COLUMN voice_preview_url TEXT;
ALTER TABLE channels ADD COLUMN voice_selected_at TIMESTAMP;

-- Index for voice lookups
CREATE INDEX idx_channels_voice_id ON channels(voice_id);
```

### **Projects Table Updates**

```sql
-- Add voiceover data to projects table
ALTER TABLE projects ADD COLUMN voice_id VARCHAR(255); -- override channel default
ALTER TABLE projects ADD COLUMN voice_name VARCHAR(255);
ALTER TABLE projects ADD COLUMN voice_settings JSONB;
ALTER TABLE projects ADD COLUMN voiceover_url TEXT;
ALTER TABLE projects ADD COLUMN voiceover_duration INTEGER; -- milliseconds
ALTER TABLE projects ADD COLUMN voiceover_file_size BIGINT; -- bytes
ALTER TABLE projects ADD COLUMN voiceover_generated_at TIMESTAMP;
ALTER TABLE projects ADD COLUMN voiceover_cost DECIMAL(10,4); -- track API costs

-- Index for voiceover lookups
CREATE INDEX idx_projects_voiceover_url ON projects(voiceover_url);
CREATE INDEX idx_projects_voice_id ON projects(voice_id);
```

### **New Table: Voice Cache**

```sql
-- Cache ElevenLabs voice library to reduce API calls
CREATE TABLE voice_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_id VARCHAR(255) UNIQUE NOT NULL,
  voice_name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- narrative, conversational, characters, cloned
  description TEXT,
  preview_url TEXT,
  labels JSONB, -- ["american", "young", "female", "calm"]
  available_for_tiers JSONB DEFAULT '["free", "creator", "pro", "enterprise"]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_voice_cache_category ON voice_cache(category);
CREATE INDEX idx_voice_cache_active ON voice_cache(is_active);
CREATE INDEX idx_voice_cache_labels ON voice_cache USING GIN(labels);

-- Sample data structure
INSERT INTO voice_cache (voice_id, voice_name, category, description, labels) VALUES
('21m00Tcm4TlvDq8ikWAM', 'Rachel', 'narrative', 'Calm, warm, empathetic female voice', '["american", "young", "female", "calm", "narrative"]'),
('pNInz6obpgDQGcFmaJgB', 'Adam', 'narrative', 'Deep, authoritative male voice', '["american", "middle-aged", "male", "deep", "authoritative"]'),
('EXAVITQu4vr4xnSDxMaL', 'Bella', 'narrative', 'Soft, gentle female voice', '["american", "young", "female", "soft", "gentle"]');
```

### **New Table: Voiceover Generation Log**

```sql
-- Track all voiceover generations for analytics and cost tracking
CREATE TABLE voiceover_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  voice_id VARCHAR(255) NOT NULL,
  voice_name VARCHAR(255),
  character_count INTEGER NOT NULL,
  duration_ms INTEGER,
  file_size_bytes BIGINT,
  cost DECIMAL(10,4),
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  error_message TEXT,
  api_request_id VARCHAR(255), -- ElevenLabs request ID
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_voiceover_gen_project ON voiceover_generations(project_id);
CREATE INDEX idx_voiceover_gen_user ON voiceover_generations(user_id);
CREATE INDEX idx_voiceover_gen_status ON voiceover_generations(status);
CREATE INDEX idx_voiceover_gen_created ON voiceover_generations(created_at DESC);
```

---

## 🔌 API Endpoints

### **Voice Library Management**

#### **GET /api/voices**
Fetch all available voices from cache (refreshed daily from ElevenLabs)

**Query Parameters:**
- `category` (optional): Filter by category (narrative, conversational, characters, cloned)
- `search` (optional): Search by name or description
- `labels` (optional): Filter by labels (comma-separated)

**Response:**
```json
{
  "success": true,
  "data": {
    "voices": [
      {
        "id": "21m00Tcm4TlvDq8ikWAM",
        "name": "Rachel",
        "category": "narrative",
        "description": "Calm, warm, empathetic female voice",
        "preview_url": "https://storage.googleapis.com/...",
        "labels": ["american", "young", "female", "calm", "narrative"],
        "recommended": false
      }
    ],
    "total": 45,
    "categories": {
      "narrative": 15,
      "conversational": 12,
      "characters": 10,
      "cloned": 8
    }
  }
}
```

---

#### **POST /api/voices/preview**
Generate a preview of a voice with custom text

**Request Body:**
```json
{
  "voice_id": "21m00Tcm4TlvDq8ikWAM",
  "sample_text": "Welcome to True Crime Daily. Today we're diving into the evidence that police missed in the Jack the Ripper case.",
  "settings": {
    "stability": 0.75,
    "similarity_boost": 0.75,
    "style": 0.0,
    "use_speaker_boost": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "audio_url": "https://supabase-storage.../preview-abc123.mp3",
    "duration_ms": 8500,
    "character_count": 142,
    "expires_at": "2025-11-13T12:00:00Z"
  }
}
```

---

#### **GET /api/voices/recommendations/:channelId**
Get GPT-5 recommended voices based on channel DNA

**Response:**
```json
{
  "success": true,
  "data": {
    "channel_id": "ch_abc123",
    "channel_name": "True Crime Daily",
    "analysis": {
      "tone": "serious, investigative, empathetic",
      "pacing": "moderate",
      "target_audience": "adults 25-54"
    },
    "recommended_voices": [
      {
        "id": "21m00Tcm4TlvDq8ikWAM",
        "name": "Rachel",
        "match_score": 95,
        "reason": "Warm and empathetic tone matches your channel's investigative yet compassionate style",
        "preview_url": "https://..."
      },
      {
        "id": "pNInz6obpgDQGcFmaJgB",
        "name": "Adam",
        "match_score": 88,
        "reason": "Deep, authoritative voice suits serious crime documentary format",
        "preview_url": "https://..."
      }
    ]
  }
}
```

---

### **Channel Voice Configuration**

#### **PUT /api/channels/:channelId/voice**
Set or update the default voice for a channel

**Request Body:**
```json
{
  "voice_id": "21m00Tcm4TlvDq8ikWAM",
  "voice_name": "Rachel",
  "settings": {
    "stability": 0.80,
    "similarity_boost": 0.75,
    "style": 0.0,
    "use_speaker_boost": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "channel_id": "ch_abc123",
    "voice_id": "21m00Tcm4TlvDq8ikWAM",
    "voice_name": "Rachel",
    "voice_settings": { ... },
    "updated_at": "2025-11-13T06:30:00Z"
  }
}
```

---

#### **GET /api/channels/:channelId/voice**
Get the current voice configuration for a channel

**Response:**
```json
{
  "success": true,
  "data": {
    "channel_id": "ch_abc123",
    "voice_id": "21m00Tcm4TlvDq8ikWAM",
    "voice_name": "Rachel",
    "voice_settings": {
      "stability": 0.80,
      "similarity_boost": 0.75,
      "style": 0.0,
      "use_speaker_boost": true
    },
    "voice_preview_url": "https://...",
    "selected_at": "2025-11-10T14:20:00Z"
  }
}
```

---

### **Project Voiceover Generation**

#### **POST /api/projects/:projectId/generate-voiceover**
Generate voiceover for a project using script

**Request Body:**
```json
{
  "voice_id": "21m00Tcm4TlvDq8ikWAM", // optional override
  "voice_settings": { ... }, // optional override
  "script": "Full timestamped script text...",
  "optimize_streaming": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "project_id": "proj_abc123",
    "voiceover_url": "https://supabase-storage.../voiceover-abc123.mp3",
    "duration_ms": 145000,
    "file_size_bytes": 2340000,
    "character_count": 2450,
    "cost": 0.0245,
    "voice_used": {
      "id": "21m00Tcm4TlvDq8ikWAM",
      "name": "Rachel"
    },
    "generated_at": "2025-11-13T06:35:00Z"
  }
}
```

---

#### **GET /api/projects/:projectId/voiceover**
Get voiceover details for a project

**Response:**
```json
{
  "success": true,
  "data": {
    "project_id": "proj_abc123",
    "voiceover_url": "https://...",
    "duration_ms": 145000,
    "file_size_bytes": 2340000,
    "voice_id": "21m00Tcm4TlvDq8ikWAM",
    "voice_name": "Rachel",
    "generated_at": "2025-11-13T06:35:00Z",
    "status": "completed"
  }
}
```

---

#### **DELETE /api/projects/:projectId/voiceover**
Delete voiceover and regenerate (useful for voice changes)

**Response:**
```json
{
  "success": true,
  "message": "Voiceover deleted successfully. Generate new voiceover to continue."
}
```

---

## 🎨 UI Components

### **1. Voice Selection Modal**

**Location:** Channel setup flow, project generation page

**Features:**
- Search and filter voices
- Category tabs (Narrative, Conversational, Characters, Cloned)
- Voice preview with play button
- Recommended voices highlighted
- Voice settings sliders
- Save as channel default option

**Component Structure:**
```
VoiceSelectionModal
├── SearchBar (filter by name/description)
├── CategoryTabs (Narrative, Conversational, etc.)
├── RecommendedSection (GPT-5 suggestions)
│   └── VoiceCard (with match score badge)
├── VoiceGrid
│   └── VoiceCard[]
│       ├── VoiceInfo (name, description, labels)
│       ├── PreviewButton (play 10-second sample)
│       └── SelectButton
└── VoiceSettingsPanel
    ├── StabilitySlider (0-100%)
    ├── ClaritySlider (0-100%)
    ├── StyleSlider (0-100%)
    └── SpeakerBoostToggle
```

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│  🎙️ Select Voice for "True Crime Daily"               │
├─────────────────────────────────────────────────────────┤
│  🔍 [Search voices...]                    [✨ Recommended] │
│                                                         │
│  📁 [Narrative] [Conversational] [Characters] [Cloned] │
│                                                         │
│  ⭐ Recommended for Your Channel                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🎙️ Rachel                          Match: 95%   │  │
│  │ Calm, warm, empathetic female voice             │  │
│  │ 🏷️ american • young • female • narrative        │  │
│  │ [▶️ Preview] [Select Voice] ✅                   │  │
│  │ "Warm tone matches your investigative style"    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  All Voices                                             │
│  ┌────────────────┐ ┌────────────────┐ ┌─────────────┐│
│  │ 🎙️ Adam       │ │ 🎙️ Bella      │ │ 🎙️ Charlie ││
│  │ Deep, author. │ │ Soft, gentle  │ │ Casual, fri.││
│  │ [▶️] [Select] │ │ [▶️] [Select] │ │ [▶️] [Select]││
│  └────────────────┘ └────────────────┘ └─────────────┘│
│                                                         │
│  ⚙️ Voice Settings                                      │
│  Stability:        ████████░░ 80%                      │
│  Clarity:          ██████████ 100%                     │
│  Style:            ████░░░░░░ 40%                      │
│  Speaker Boost:    ☑️ Enabled                          │
│                                                         │
│  [Cancel]  [Save as Channel Default]                   │
└─────────────────────────────────────────────────────────┘
```

---

### **2. Channel Voice Settings Page**

**Location:** Channel settings → Voice tab

**Features:**
- Current voice display
- Change voice button
- Voice settings adjustment
- Preview with channel's typical script
- Voice usage statistics

**Component Structure:**
```
ChannelVoiceSettings
├── CurrentVoiceCard
│   ├── VoiceInfo
│   ├── PreviewButton
│   └── ChangeVoiceButton
├── VoiceSettingsPanel
│   ├── StabilitySlider
│   ├── ClaritySlider
│   ├── StyleSlider
│   └── SpeakerBoostToggle
├── TestWithScriptSection
│   ├── ScriptInput (sample from channel)
│   └── GeneratePreviewButton
└── UsageStats
    ├── TotalVoiceovers
    ├── TotalDuration
    └── EstimatedCost
```

---

### **3. Project Generation - Voice Section**

**Location:** Video generation page

**Features:**
- Display channel default voice
- Override option
- Quick preview
- Settings adjustment

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│  🎙️ Voiceover                                          │
├─────────────────────────────────────────────────────────┤
│  Voice: Rachel (Channel Default)        [Change Voice] │
│  Settings: Stability 80% • Clarity 100% • Style 40%    │
│                                                         │
│  [▶️ Preview with First 30 Seconds]  [⚙️ Adjust]       │
│                                                         │
│  ℹ️ Estimated duration: 2 min 25 sec                   │
│  ℹ️ Estimated cost: $0.024                             │
└─────────────────────────────────────────────────────────┘
```

---

### **4. Voice Preview Player**

**Component:** Reusable audio player for voice previews

**Features:**
- Play/pause button
- Progress bar
- Duration display
- Volume control
- Download option

**Visual Design:**
```
┌─────────────────────────────────────────┐
│  🎙️ Rachel - Preview                   │
│  [▶️] ████████░░░░░░░░░░ 0:08 / 0:10   │
│  🔊 ████████░░                          │
└─────────────────────────────────────────┘
```

---

## 🧠 GPT-5 Voice Recommendation System

### **Analysis Process**

**Input:** Channel DNA document

**Analysis Factors:**
1. **Tone Analysis**
   - Serious → Deep, authoritative voices
   - Casual → Conversational, friendly voices
   - Educational → Clear, articulate voices
   - Emotional → Warm, empathetic voices

2. **Content Type**
   - True Crime → Serious, investigative voices
   - Documentary → Authoritative, narrative voices
   - Tutorial → Clear, instructional voices
   - Entertainment → Energetic, engaging voices

3. **Target Audience**
   - Young adults → Modern, relatable voices
   - Middle-aged → Professional, mature voices
   - General → Versatile, neutral voices

4. **Pacing**
   - Fast-paced → Energetic voices
   - Moderate → Balanced voices
   - Slow → Calm, deliberate voices

5. **Gender Preference**
   - Analyze existing videos for narrator gender
   - Suggest matching gender or offer alternatives

**Output:** 3-5 recommended voices with match scores and reasoning

### **GPT-5 Prompt Template**

```javascript
const voiceRecommendationPrompt = `
You are a voice casting director for video content.

CHANNEL DNA:
${JSON.stringify(channelDNA, null, 2)}

AVAILABLE VOICES:
${voices.map(v => `- ${v.name}: ${v.description} [${v.labels.join(', ')}]`).join('\n')}

TASK:
Analyze the channel's DNA and recommend 3-5 voices that best match the channel's style.

For each recommendation, provide:
1. Voice ID and name
2. Match score (0-100)
3. Specific reason why this voice matches the channel
4. What aspects of the channel it complements

Consider:
- Content tone (serious, casual, educational, emotional)
- Target audience demographics
- Pacing and energy level
- Existing narrator style (if detected)
- Content type and subject matter

FORMAT YOUR RESPONSE AS JSON:
{
  "recommendations": [
    {
      "voice_id": "...",
      "voice_name": "...",
      "match_score": 95,
      "reason": "Specific reason based on channel DNA"
    }
  ]
}
`;
```

---

## 🔧 ElevenLabs Integration

### **API Configuration**

**Base URL:** `https://api.elevenlabs.io/v1`

**Authentication:** API Key in header
```
xi-api-key: your_api_key_here
```

### **Key Endpoints Used**

#### **1. Get Voices**
```
GET /voices
```

**Response:**
```json
{
  "voices": [
    {
      "voice_id": "21m00Tcm4TlvDq8ikWAM",
      "name": "Rachel",
      "category": "premade",
      "labels": {
        "accent": "american",
        "age": "young",
        "gender": "female",
        "use_case": "narration"
      },
      "preview_url": "https://..."
    }
  ]
}
```

---

#### **2. Text-to-Speech**
```
POST /text-to-speech/{voice_id}
```

**Request Body:**
```json
{
  "text": "Full script text here...",
  "model_id": "eleven_monolingual_v1",
  "voice_settings": {
    "stability": 0.75,
    "similarity_boost": 0.75,
    "style": 0.0,
    "use_speaker_boost": true
  }
}
```

**Response:** Audio file (MP3)

---

#### **3. Get Voice Settings**
```
GET /voices/{voice_id}/settings
```

**Response:**
```json
{
  "stability": 0.75,
  "similarity_boost": 0.75,
  "style": 0.0,
  "use_speaker_boost": true
}
```

---

### **Rate Limits & Quotas**

**Free Tier:**
- 10,000 characters/month
- ~10 minutes of audio
- Standard voices only

**Starter ($5/month):**
- 30,000 characters/month
- ~30 minutes of audio
- All standard voices

**Creator ($22/month):**
- 100,000 characters/month
- ~100 minutes of audio
- Voice cloning (3 voices)

**Pro ($99/month):**
- 500,000 characters/month
- ~500 minutes of audio
- Voice cloning (10 voices)
- Priority processing

**Enterprise (Custom):**
- Unlimited characters
- Unlimited voice cloning
- Dedicated support
- Custom models

---

## 💰 Cost Management

### **Cost Calculation**

**ElevenLabs Pricing:**
- $0.30 per 1,000 characters (Creator tier)
- $0.18 per 1,000 characters (Pro tier)
- $0.096 per 1,000 characters (Enterprise tier)

**Average Video Costs:**
- 5-minute video: ~750 words = ~4,500 chars = $1.35 (Creator)
- 10-minute video: ~1,500 words = ~9,000 chars = $2.70 (Creator)
- 20-minute video: ~3,000 words = ~18,000 chars = $5.40 (Creator)

### **Cost Tracking**

**Database Fields:**
- `voiceover_generations.character_count` - Track characters used
- `voiceover_generations.cost` - Calculate and store cost
- `voiceover_generations.created_at` - Track monthly usage

**Monthly Cost Report:**
```sql
SELECT 
  user_id,
  COUNT(*) as total_voiceovers,
  SUM(character_count) as total_characters,
  SUM(cost) as total_cost,
  AVG(duration_ms) as avg_duration
FROM voiceover_generations
WHERE created_at >= DATE_TRUNC('month', NOW())
  AND status = 'completed'
GROUP BY user_id;
```

### **Plan-Based Limits**

**Free Plan:**
- Use OpenAI TTS (cheaper alternative)
- No ElevenLabs access
- Basic voice quality

**Creator Plan ($29/month):**
- 10 videos/month
- ElevenLabs included
- ~$13.50 in voiceover costs (10 x 5-min videos)

**Pro Plan ($79/month):**
- Unlimited videos
- ElevenLabs included
- First 30 videos included (~$40.50 value)
- Additional videos: $1.35 per 5-min video

**Enterprise:**
- Custom ElevenLabs tier
- Volume discounts
- Dedicated API key

---

## 🔄 Voiceover Generation Pipeline

### **Step-by-Step Process**

**1. Script Preparation**
```
Input: GPT-5 generated script with timestamps
Output: Clean text without timestamps
```

**2. Character Count Validation**
```
Check: Does character count fit within user's plan?
Action: If exceeds, prompt user to upgrade or shorten script
```

**3. Voice Selection**
```
Priority:
1. Project-level override (if set)
2. Channel default voice
3. Fallback to recommended voice
```

**4. API Request**
```
POST to ElevenLabs /text-to-speech/{voice_id}
Body: script text + voice settings
Headers: API key, content-type
```

**5. Audio Processing**
```
Receive: MP3 audio file
Validate: File size, duration, format
Convert: If needed (ensure MP3 format)
```

**6. Storage**
```
Upload to: Supabase Storage /voiceovers/{project_id}/
Generate: Public URL with expiration
Save: URL, duration, file size to database
```

**7. Cost Tracking**
```
Calculate: character_count * rate_per_1000_chars
Store: In voiceover_generations table
Update: User's monthly usage counter
```

**8. Sync with Video**
```
Pass to: FFmpeg video assembly pipeline
Ensure: Audio duration matches video duration
Adjust: Video pacing if needed
```

---

## 🚨 Error Handling

### **Common Errors & Solutions**

**1. API Key Invalid**
```
Error: 401 Unauthorized
Solution: Validate API key, prompt admin to update
Fallback: Use OpenAI TTS temporarily
```

**2. Quota Exceeded**
```
Error: 429 Too Many Requests
Solution: Check user's plan limits
Action: Prompt upgrade or wait for quota reset
Fallback: Queue for next billing cycle
```

**3. Voice Not Available**
```
Error: 404 Voice Not Found
Solution: Refresh voice cache from ElevenLabs
Action: Prompt user to select different voice
Fallback: Use default voice (Rachel)
```

**4. Text Too Long**
```
Error: 413 Payload Too Large
Solution: Split script into chunks
Action: Generate multiple audio files, concatenate
Limit: 5,000 characters per request
```

**5. Generation Failed**
```
Error: 500 Internal Server Error
Solution: Retry 3 times with exponential backoff
Action: If still fails, use fallback TTS
Notify: User of quality degradation
```

**6. Storage Upload Failed**
```
Error: Supabase storage error
Solution: Retry upload 3 times
Action: If fails, store temporarily locally
Notify: Admin of storage issues
```

---

## 🧪 Testing Strategy

### **Unit Tests**

**Voice Service Tests:**
- Fetch voices from cache
- Generate preview with custom text
- Calculate cost accurately
- Handle API errors gracefully

**Database Tests:**
- Save voice configuration to channel
- Override voice at project level
- Track voiceover generations
- Calculate monthly usage

### **Integration Tests**

**End-to-End Voice Flow:**
1. User selects voice
2. System saves to channel
3. Project generation uses correct voice
4. ElevenLabs API called successfully
5. Audio file stored in Supabase
6. Cost tracked accurately

**Error Scenarios:**
- API key invalid
- Quota exceeded
- Voice not found
- Network timeout

### **Performance Tests**

**Load Testing:**
- 100 concurrent voiceover generations
- Response time < 30 seconds for 5-min video
- Storage upload < 5 seconds

**Cost Testing:**
- Verify cost calculations match actual bills
- Track monthly usage accurately
- Alert when approaching plan limits

---

## 📊 Analytics & Monitoring

### **Key Metrics**

**Usage Metrics:**
- Total voiceovers generated (daily/monthly)
- Average duration per voiceover
- Total characters processed
- Most popular voices

**Cost Metrics:**
- Total ElevenLabs costs (daily/monthly)
- Cost per user
- Cost per video
- Plan-based cost distribution

**Performance Metrics:**
- Average generation time
- API success rate
- Error rate by type
- Storage upload success rate

**User Behavior:**
- Voice selection patterns
- Settings adjustment frequency
- Preview usage
- Voice change frequency

### **Monitoring Dashboard**

**Real-Time Alerts:**
- API error rate > 5%
- Generation time > 60 seconds
- Storage failures
- Quota approaching limit (80%)

**Daily Reports:**
- Total voiceovers generated
- Total cost incurred
- Top voices used
- Error summary

---

## 🔐 Security Considerations

### **API Key Management**

**Storage:**
- Store ElevenLabs API key in environment variables
- Never expose in frontend code
- Rotate keys quarterly

**Access Control:**
- Only backend services can access API key
- Rate limit API calls per user
- Log all API requests for audit

### **User Data Protection**

**Script Content:**
- Scripts may contain sensitive information
- Encrypt in transit (HTTPS)
- Encrypt at rest in database
- Auto-delete after 90 days (configurable)

**Audio Files:**
- Store in private Supabase buckets
- Generate signed URLs with expiration
- Auto-delete after video published (optional)

**Cost Data:**
- Protect user cost information
- Only show to account owner
- Aggregate for analytics (anonymized)

---

## 🚀 Future Enhancements

### **Phase 1 (MVP)**
- ✅ ElevenLabs integration
- ✅ Voice selection UI
- ✅ Channel default voice
- ✅ Basic settings (stability, clarity)
- ✅ Cost tracking

### **Phase 2 (Post-Launch)**
- Voice cloning for enterprise users
- Multi-language support
- Emotion control (happy, sad, angry)
- Voice mixing (multiple narrators)
- Custom pronunciation dictionary

### **Phase 3 (Advanced)**
- Real-time voice preview while typing
- Voice A/B testing
- Audience preference learning
- Voice marketplace (custom voices)
- Voice analytics (engagement by voice)

---

## 📝 Implementation Checklist

### **Backend**
- [ ] Create voice cache table and populate
- [ ] Build ElevenLabs API service
- [ ] Implement voice recommendation algorithm
- [ ] Create API endpoints (voices, preview, generate)
- [ ] Add cost calculation and tracking
- [ ] Implement error handling and retries
- [ ] Set up monitoring and alerts

### **Frontend**
- [ ] Build voice selection modal
- [ ] Create voice preview player
- [ ] Add channel voice settings page
- [ ] Integrate voice section in project generation
- [ ] Display cost estimates
- [ ] Show usage statistics

### **Database**
- [ ] Run migration scripts
- [ ] Populate voice cache
- [ ] Set up indexes
- [ ] Configure RLS policies

### **Testing**
- [ ] Unit tests for voice service
- [ ] Integration tests for full flow
- [ ] Load testing for concurrent generations
- [ ] Cost calculation validation

### **Documentation**
- [ ] API documentation
- [ ] User guide for voice selection
- [ ] Admin guide for API key management
- [ ] Troubleshooting guide

---

**Status:** 📋 Ready for Implementation  
**Dependencies:** ElevenLabs API account, Supabase storage configured  
**Estimated Implementation Time:** 2-3 weeks