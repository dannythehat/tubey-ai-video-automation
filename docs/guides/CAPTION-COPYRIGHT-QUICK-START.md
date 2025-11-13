# 🚀 Caption & Copyright Detection - Quick Start Guide

**For Developers Implementing These Systems**

---

## 📋 Prerequisites

Before implementing these systems, ensure you have:

- [x] Supabase project set up
- [x] Database migrations run
- [x] API keys for external services
- [x] Basic media upload working

---

## 🔑 Required API Keys

### Caption System
```bash
# .env
OPENAI_API_KEY=sk-...                    # Whisper API (primary)
ASSEMBLYAI_API_KEY=...                   # Fallback transcription
GOOGLE_SPEECH_TO_TEXT_KEY=...            # Fallback transcription
```

### Copyright Detection
```bash
# .env
GOOGLE_VISION_API_KEY=...                # Image reverse search
TINEYE_API_KEY=...                       # Image matching
YOUTUBE_API_KEY=...                      # Content ID
ACRCLOUD_ACCESS_KEY=...                  # Music recognition
ACRCLOUD_ACCESS_SECRET=...               # Music recognition
```

---

## 📦 Installation

### 1. Install Dependencies

```bash
npm install @google-cloud/vision
npm install openai
npm install acrcloud
npm install axios
npm install form-data
```

### 2. Run Database Migrations

```sql
-- Migration 002: Caption System
psql -h your-db-host -U postgres -d tubey < migrations/002_caption_system.sql

-- Migration 003: Copyright Detection
psql -h your-db-host -U postgres -d tubey < migrations/003_copyright_detection.sql
```

---

## 🎬 Caption System Implementation

### Step 1: Channel Caption Analysis

```typescript
// lib/captions/analyzeChannelCaptions.ts

import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function analyzeChannelCaptions(channelId: string) {
  // 1. Fetch sample videos from channel
  const videos = await fetchChannelVideos(channelId, 10);
  
  // 2. Download and analyze captions
  const captionStyles = [];
  for (const video of videos) {
    const captions = await downloadCaptions(video.id);
    if (captions) {
      const style = await extractCaptionStyle(captions);
      captionStyles.push(style);
    }
  }
  
  // 3. Generate Caption DNA
  const captionDNA = await generateCaptionDNA(captionStyles);
  
  // 4. Store in database
  await supabase
    .from('channel_caption_styles')
    .upsert({
      channel_id: channelId,
      caption_dna: captionDNA,
      confidence_score: calculateConfidence(captionStyles),
      sample_size: captionStyles.length,
      last_analyzed_at: new Date().toISOString()
    });
  
  return captionDNA;
}
```

### Step 2: Generate Captions

```typescript
// lib/captions/generateCaptions.ts

import { openai } from '@/lib/openai';

export async function generateCaptions(
  videoId: string,
  audioUrl: string,
  options: {
    languages: string[];
    captionType: 'full' | 'keywords' | 'descriptions';
    useChannelStyle: boolean;
  }
) {
  // 1. Transcribe audio with Whisper
  const transcription = await openai.audio.transcriptions.create({
    file: await fetch(audioUrl).then(r => r.blob()),
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word", "segment"]
  });
  
  // 2. Get channel caption style
  let captionStyle = null;
  if (options.useChannelStyle) {
    captionStyle = await getChannelCaptionStyle(videoId);
  }
  
  // 3. Format captions
  const captions = await formatCaptions(
    transcription,
    options.captionType,
    captionStyle
  );
  
  // 4. Generate multiple languages
  const allCaptions = [];
  for (const lang of options.languages) {
    const translated = lang === 'en' 
      ? captions 
      : await translateCaptions(captions, lang);
    
    // 5. Save to database
    const { data } = await supabase
      .from('video_captions')
      .insert({
        video_id: videoId,
        language: lang,
        caption_type: options.captionType,
        format: 'srt',
        content: translated,
        transcription_api: 'whisper',
        confidence_score: transcription.confidence || 0.95
      })
      .select()
      .single();
    
    allCaptions.push(data);
  }
  
  return allCaptions;
}
```

### Step 3: API Endpoint

```typescript
// app/api/videos/[videoId]/captions/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateCaptions } from '@/lib/captions/generateCaptions';

export async function POST(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const body = await req.json();
    const { languages, captionType, useChannelStyle } = body;
    
    // Get video audio URL
    const video = await getVideo(params.videoId);
    
    // Generate captions
    const captions = await generateCaptions(
      params.videoId,
      video.audioUrl,
      { languages, captionType, useChannelStyle }
    );
    
    return NextResponse.json({
      success: true,
      data: { captions }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: { message: error.message }
    }, { status: 500 });
  }
}
```

---

## ⚖️ Copyright Detection Implementation

### Step 1: Image Scanner

```typescript
// lib/copyright/scanImage.ts

import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient();

export async function scanImage(imageUrl: string) {
  // 1. Reverse image search
  const [result] = await client.webDetection(imageUrl);
  const webDetection = result.webDetection;
  
  // 2. Check for watermarks
  const [logoResult] = await client.logoDetection(imageUrl);
  const watermarks = logoResult.logoAnnotations || [];
  
  // 3. Calculate risk score
  let riskScore = 0;
  const riskFactors = [];
  
  // Check for stock photo sites
  const stockSites = ['gettyimages', 'shutterstock', 'istockphoto', 'adobe'];
  const foundOnStock = webDetection.pagesWithMatchingImages?.some(page =>
    stockSites.some(site => page.url.includes(site))
  );
  
  if (foundOnStock) {
    riskScore += 30;
    riskFactors.push('Found on stock photo sites');
  }
  
  // Check for watermarks
  if (watermarks.length > 0) {
    riskScore += 40;
    riskFactors.push('Watermark detected');
  }
  
  // Check distribution
  const matchCount = webDetection.fullMatchingImages?.length || 0;
  if (matchCount > 10) {
    riskScore += 20;
    riskFactors.push('Widely distributed online');
  }
  
  // 4. Determine risk level
  const riskLevel = 
    riskScore <= 30 ? 'low' :
    riskScore <= 70 ? 'medium' : 'high';
  
  return {
    riskScore,
    riskLevel,
    riskFactors,
    matches: webDetection.pagesWithMatchingImages || [],
    watermarks
  };
}
```

### Step 2: Audio Scanner

```typescript
// lib/copyright/scanAudio.ts

import acrcloud from 'acrcloud';

export async function scanAudio(audioUrl: string) {
  // 1. Download audio buffer
  const response = await fetch(audioUrl);
  const audioBuffer = await response.arrayBuffer();
  
  // 2. Recognize music
  const result = await acrcloud.recognize({
    host: 'identify-us-west-2.acrcloud.com',
    access_key: process.env.ACRCLOUD_ACCESS_KEY,
    access_secret: process.env.ACRCLOUD_ACCESS_SECRET,
    data: Buffer.from(audioBuffer),
    data_type: 'audio'
  });
  
  // 3. Check for copyrighted music
  const music = result.metadata?.music || [];
  
  let riskScore = 0;
  const riskFactors = [];
  
  if (music.length > 0) {
    riskScore = 40;
    riskFactors.push('Copyrighted music detected');
  }
  
  const riskLevel = 
    riskScore <= 30 ? 'low' :
    riskScore <= 70 ? 'medium' : 'high';
  
  return {
    riskScore,
    riskLevel,
    riskFactors,
    matches: music.map(m => ({
      title: m.title,
      artist: m.artists?.[0]?.name,
      album: m.album?.name,
      label: m.label
    }))
  };
}
```

### Step 3: Main Scanner

```typescript
// lib/copyright/scanMedia.ts

import { scanImage } from './scanImage';
import { scanAudio } from './scanAudio';
import { supabase } from '@/lib/supabase';

export async function scanMedia(mediaId: string) {
  // 1. Get media details
  const { data: media } = await supabase
    .from('media_assets')
    .select('*')
    .eq('id', mediaId)
    .single();
  
  // 2. Create scan record
  const { data: scan } = await supabase
    .from('copyright_scans')
    .insert({
      media_id: mediaId,
      scan_type: media.file_type,
      status: 'scanning'
    })
    .select()
    .single();
  
  try {
    // 3. Run appropriate scanner
    let result;
    if (media.file_type === 'image') {
      result = await scanImage(media.file_url);
    } else if (media.file_type === 'audio') {
      result = await scanAudio(media.file_url);
    } else if (media.file_type === 'video') {
      // Scan both video and audio
      const videoResult = await scanVideo(media.file_url);
      const audioResult = await scanAudio(media.file_url);
      result = combineResults(videoResult, audioResult);
    }
    
    // 4. Update scan record
    await supabase
      .from('copyright_scans')
      .update({
        status: 'completed',
        risk_level: result.riskLevel,
        risk_score: result.riskScore,
        risk_factors: result.riskFactors,
        scan_results: result,
        completed_at: new Date().toISOString()
      })
      .eq('id', scan.id);
    
    // 5. Store matches
    for (const match of result.matches) {
      await supabase
        .from('copyright_matches')
        .insert({
          copyright_scan_id: scan.id,
          match_type: 'reverse_image',
          source_url: match.url,
          source_name: extractDomain(match.url),
          confidence_score: match.confidence || 0.8
        });
    }
    
    return { scanId: scan.id, ...result };
  } catch (error) {
    // Update scan as failed
    await supabase
      .from('copyright_scans')
      .update({
        status: 'failed',
        error_message: error.message
      })
      .eq('id', scan.id);
    
    throw error;
  }
}
```

### Step 4: API Endpoint

```typescript
// app/api/copyright/scan/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { scanMedia } from '@/lib/copyright/scanMedia';

export async function POST(req: NextRequest) {
  try {
    const { mediaId } = await req.json();
    
    // Start scan (async)
    const result = await scanMedia(mediaId);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: { message: error.message }
    }, { status: 500 });
  }
}
```

---

## 🔄 Combined Upload Flow

```typescript
// app/api/projects/[projectId]/media/upload-and-scan/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { uploadToStorage } from '@/lib/storage';
import { scanMedia } from '@/lib/copyright/scanMedia';

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const tags = JSON.parse(formData.get('tags') as string);
    const autoScan = formData.get('autoScan') === 'true';
    
    // 1. Upload to storage
    const fileUrl = await uploadToStorage(file);
    
    // 2. Create media record
    const { data: media } = await supabase
      .from('media_assets')
      .insert({
        project_id: params.projectId,
        file_url: fileUrl,
        file_name: file.name,
        file_type: getFileType(file.type),
        file_size: file.size,
        mime_type: file.type,
        tags
      })
      .select()
      .single();
    
    // 3. Auto-scan if enabled
    let copyrightScan = null;
    if (autoScan) {
      copyrightScan = await scanMedia(media.id);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        media,
        copyrightScan
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: { message: error.message }
    }, { status: 500 });
  }
}
```

---

## 🎨 UI Components

### Copyright Warning Modal

```tsx
// components/CopyrightWarningModal.tsx

export function CopyrightWarningModal({ scan, onConfirm, onRemove }) {
  return (
    <Modal>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          ⚠️ Copyright Warning
        </h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Risk Level: <span className={getRiskColor(scan.riskLevel)}>
              {scan.riskLevel.toUpperCase()}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Risk Score: {scan.riskScore}/100
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Issues Detected:</h3>
          <ul className="list-disc pl-5">
            {scan.riskFactors.map((factor, i) => (
              <li key={i}>{factor}</li>
            ))}
          </ul>
        </div>
        
        {scan.matches.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Matches Found:</h3>
            <ul className="list-disc pl-5">
              {scan.matches.map((match, i) => (
                <li key={i}>
                  {match.sourceName} ({Math.round(match.confidence * 100)}% match)
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
          <p className="text-sm">
            ⚠️ This content may be copyrighted. Only proceed if you have legal rights.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button onClick={onRemove} className="btn-secondary">
            Remove Media
          </button>
          <button onClick={onConfirm} className="btn-primary">
            I Have Rights
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

### Caption Preview

```tsx
// components/CaptionPreview.tsx

export function CaptionPreview({ videoUrl, captions }) {
  return (
    <div className="relative">
      <video src={videoUrl} controls className="w-full" />
      
      <div className="absolute bottom-20 left-0 right-0 text-center">
        <div className="inline-block bg-black bg-opacity-70 px-4 py-2 rounded">
          <p className="text-white text-lg font-bold">
            {getCurrentCaption(captions)}
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Available Captions:</h3>
        <div className="flex gap-2">
          {captions.map(caption => (
            <button
              key={caption.id}
              className="btn-secondary"
              onClick={() => switchCaption(caption.language)}
            >
              {caption.language.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing

### Test Caption Generation

```typescript
// __tests__/captions.test.ts

import { generateCaptions } from '@/lib/captions/generateCaptions';

describe('Caption Generation', () => {
  it('should generate captions from audio', async () => {
    const captions = await generateCaptions(
      'test-video-id',
      'https://example.com/audio.mp3',
      {
        languages: ['en'],
        captionType: 'full',
        useChannelStyle: false
      }
    );
    
    expect(captions).toHaveLength(1);
    expect(captions[0].language).toBe('en');
    expect(captions[0].content).toBeTruthy();
  });
});
```

### Test Copyright Scanning

```typescript
// __tests__/copyright.test.ts

import { scanImage } from '@/lib/copyright/scanImage';

describe('Copyright Detection', () => {
  it('should detect high-risk images', async () => {
    const result = await scanImage('https://example.com/getty-image.jpg');
    
    expect(result.riskLevel).toBe('high');
    expect(result.riskScore).toBeGreaterThan(70);
    expect(result.riskFactors).toContain('Watermark detected');
  });
  
  it('should pass low-risk images', async () => {
    const result = await scanImage('https://example.com/original-photo.jpg');
    
    expect(result.riskLevel).toBe('low');
    expect(result.riskScore).toBeLessThan(30);
  });
});
```

---

## 📊 Monitoring

### Track API Costs

```typescript
// lib/monitoring/trackCosts.ts

export async function trackCopyrightScanCost(
  scanId: string,
  apiName: string,
  cost: number
) {
  await supabase
    .from('copyright_api_usage')
    .insert({
      api_name: apiName,
      cost_usd: cost,
      date: new Date().toISOString().split('T')[0]
    });
}
```

### Monitor Scan Success Rate

```typescript
// lib/monitoring/scanMetrics.ts

export async function getScanMetrics(startDate: string, endDate: string) {
  const { data } = await supabase
    .from('copyright_scans')
    .select('status, risk_level')
    .gte('created_at', startDate)
    .lte('created_at', endDate);
  
  const total = data.length;
  const completed = data.filter(s => s.status === 'completed').length;
  const failed = data.filter(s => s.status === 'failed').length;
  const highRisk = data.filter(s => s.risk_level === 'high').length;
  
  return {
    total,
    completed,
    failed,
    successRate: (completed / total) * 100,
    highRiskRate: (highRisk / total) * 100
  };
}
```

---

## 🚨 Error Handling

### Common Errors

```typescript
// lib/errors/copyrightErrors.ts

export class CopyrightScanError extends Error {
  constructor(message: string, public scanId: string) {
    super(message);
    this.name = 'CopyrightScanError';
  }
}

export class HighRiskBlockedError extends Error {
  constructor(public mediaId: string, public riskScore: number) {
    super(`Media blocked due to high copyright risk (score: ${riskScore})`);
    this.name = 'HighRiskBlockedError';
  }
}

// Usage
try {
  const result = await scanMedia(mediaId);
  if (result.riskLevel === 'high') {
    throw new HighRiskBlockedError(mediaId, result.riskScore);
  }
} catch (error) {
  if (error instanceof HighRiskBlockedError) {
    // Show blocking UI
  } else {
    // Generic error handling
  }
}
```

---

## 📚 Additional Resources

- [Caption System Architecture](../architecture/CAPTION-SYSTEM.md)
- [Copyright Detection Architecture](../architecture/COPYRIGHT-DETECTION-SYSTEM.md)
- [API Endpoints](../architecture/API-ENDPOINTS-CAPTIONS-COPYRIGHT.md)
- [Database Schema](../architecture/DATABASE-SCHEMA.md)

---

## ✅ Implementation Checklist

### Caption System
- [ ] Set up Whisper API credentials
- [ ] Implement channel caption analysis
- [ ] Create caption generation function
- [ ] Build caption formatting logic
- [ ] Add multi-language support
- [ ] Create API endpoints
- [ ] Build UI components
- [ ] Write tests
- [ ] Deploy and monitor

### Copyright Detection
- [ ] Set up all API credentials
- [ ] Implement image scanner
- [ ] Implement video scanner
- [ ] Implement audio scanner
- [ ] Create risk assessment logic
- [ ] Build blocklist system
- [ ] Create API endpoints
- [ ] Build warning modals
- [ ] Write tests
- [ ] Deploy and monitor

---

**Questions?** Check the full architecture docs or open an issue on GitHub.
