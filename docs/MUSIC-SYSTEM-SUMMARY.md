# 🎵 Music System - Quick Summary

**Added:** November 13, 2025

---

## What It Does

Adds **copyright-free background music** to image scenes to enhance drama and emotion, while **NEVER adding music over user-uploaded videos** (preserves original audio).

---

## Key Features

### Smart Detection
- Detects if scene has user video with audio → **NO MUSIC** (preserves original)
- Detects if scene is image → **ADDS MUSIC** (enhances emotion)
- GPT-5 analyzes scene emotion and selects matching music

### Copyright-Free Sources (ALL FREE)
1. **YouTube Audio Library** - 1000+ tracks, no attribution
2. **Pixabay Music** - 10,000+ tracks, no attribution  
3. **Free Music Archive** - 100,000+ tracks, some attribution
4. **Incompetech** - 2,000+ tracks, attribution required

### Channel Learning
- Learns your channel's music preferences from existing videos
- Matches music style to your brand (dark/tense for true crime, etc.)
- Maintains consistency across all generated videos

### User Control
- Preview all music selections before publishing
- Change or remove music from any scene
- Adjust volume levels globally or per-scene

---

## How It Works

**Example: True Crime Video**

```
Scene 1: Crime scene photo (image)
├─ GPT-5 detects: Tense emotion, intensity 7/10
├─ Selects: "Dark Ambient Tension" (YouTube Audio Library)
└─ Volume: -20dB (background, doesn't overpower voiceover)

Scene 2: Detective interview (video with audio)
├─ GPT-5 detects: Has original audio
└─ Music: NONE (preserves interview audio at 100%)

Scene 3: Victim photo (image)
├─ GPT-5 detects: Sad emotion, intensity 8/10
├─ Selects: "Somber Piano" (Pixabay Music)
└─ Volume: -20dB (background)

Scene 4: Location footage (video with audio)
├─ GPT-5 detects: Has original audio
└─ Music: NONE (preserves location audio)
```

---

## Audio Mixing

**Priority System:**
1. **User Video Audio** - 100% volume (ALWAYS preserved)
2. **Voiceover** - -3dB (clear and prominent)
3. **Background Music** - -20dB (subtle background)

**Smart Ducking:**
- When voiceover plays, music ducks to -25dB
- Smooth 1-2 second transitions
- Music fades in/out at scene boundaries (2 seconds)

---

## Cost

**Music Acquisition:** $0/month (all free sources)  
**Storage:** ~$0.02/month (100 tracks)  
**Total:** ~$0.02/month

---

## Database Tables Added

1. **music_library** - Stores copyright-free music tracks
2. **channel_music_preferences** - Learned music style per channel
3. **video_music_tracks** - Tracks which music was used in each video

---

## Documentation

Full details: `docs/architecture/MUSIC-SYSTEM.md`

---

**Result:** Videos have professional background music that enhances emotion without interfering with user content or causing copyright issues.
