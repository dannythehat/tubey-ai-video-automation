# 🔌 API Design Specification

**Version:** 1.0.0  
**Base URL:** `http://localhost:3001/api/v1` (development)  
**Production URL:** `https://tubey-api.railway.app/api/v1`

---

## 🎯 Design Principles

1. **RESTful:** Standard HTTP methods (GET, POST, PUT, DELETE)
2. **JSON:** All requests and responses use JSON
3. **Stateless:** Each request contains all necessary information
4. **Versioned:** API version in URL path (`/api/v1`)
5. **Secure:** Authentication required for all endpoints
6. **Consistent:** Standardized response format

---

## 🔐 Authentication

All API requests require authentication via Supabase session token.

### Headers
```http
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

### Authentication Flow
```
1. User logs in via Supabase Auth
2. Frontend receives access_token
3. Frontend includes token in Authorization header
4. Backend validates token with Supabase
5. Backend extracts user_id from token
6. Request proceeds with user context
```

---

## 📊 Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    "timestamp": "2025-11-13T12:00:00Z",
    "requestId": "req_abc123"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid project title",
    "details": {
      "field": "title",
      "constraint": "minLength"
    }
  },
  "meta": {
    "timestamp": "2025-11-13T12:00:00Z",
    "requestId": "req_abc123"
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🛣️ API Endpoints

### Projects

#### `GET /projects`
Get all projects for authenticated user

**Query Parameters:**
- `page` (number, default: 1)
- `perPage` (number, default: 20, max: 100)
- `status` (string, optional): Filter by status
- `sortBy` (string, default: 'created_at'): Sort field
- `sortOrder` (string, default: 'desc'): 'asc' or 'desc'

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "UK's Most Tragic Horses",
      "description": "A tribute...",
      "targetDuration": 600,
      "status": "completed",
      "videoUrl": "https://...",
      "youtubeUrl": "https://youtube.com/watch?v=...",
      "mediaCount": 25,
      "createdAt": "2025-11-13T10:00:00Z",
      "updatedAt": "2025-11-13T12:00:00Z"
    }
  ],
  "pagination": {...}
}
```

---

#### `POST /projects`
Create a new project

**Request Body:**
```json
{
  "title": "UK's Most Tragic Horses",
  "description": "A tribute to brave horses",
  "targetDuration": 600
}
```

**Validation:**
- `title`: Required, 3-200 characters
- `description`: Optional, max 1000 characters
- `targetDuration`: Required, 60-2700 seconds

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "UK's Most Tragic Horses",
    "status": "draft",
    "createdAt": "2025-11-13T12:00:00Z"
  }
}
```

---

#### `GET /projects/:id`
Get single project details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "UK's Most Tragic Horses",
    "description": "...",
    "targetDuration": 600,
    "status": "completed",
    "script": "Welcome to Horse Racing Nostalgia...",
    "videoUrl": "https://...",
    "youtubeUrl": "https://...",
    "youtubeVideoId": "abc123",
    "mediaAssets": [
      {
        "id": "uuid",
        "fileUrl": "https://...",
        "fileType": "image",
        "tags": ["Gloria Victis Horse"]
      }
    ],
    "renders": [
      {
        "id": "uuid",
        "status": "completed",
        "progress": 100,
        "completedAt": "2025-11-13T12:30:00Z"
      }
    ],
    "createdAt": "2025-11-13T10:00:00Z"
  }
}
```

---

#### `PUT /projects/:id`
Update project details

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "targetDuration": 720
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Updated Title",
    "updatedAt": "2025-11-13T12:45:00Z"
  }
}
```

---

#### `DELETE /projects/:id`
Delete a project (and all associated media)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Project deleted successfully",
    "deletedMediaCount": 25
  }
}
```

---

### Media Assets

#### `POST /projects/:projectId/media`
Upload media file with tags

**Request:** `multipart/form-data`
```
file: <binary>
tags: ["Gloria Victis Horse", "Gloria Victis Portrait"]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "fileUrl": "https://supabase.co/storage/...",
    "fileName": "gloria-victis.jpg",
    "fileType": "image",
    "fileSize": 2048576,
    "tags": ["Gloria Victis Horse", "Gloria Victis Portrait"],
    "width": 1920,
    "height": 1080,
    "createdAt": "2025-11-13T12:00:00Z"
  }
}
```

---

#### `GET /projects/:projectId/media`
Get all media for a project

**Query Parameters:**
- `fileType` (string, optional): Filter by 'image' or 'video'
- `tags` (string, optional): Comma-separated tags to filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "fileUrl": "https://...",
      "fileName": "gloria-victis.jpg",
      "fileType": "image",
      "fileSize": 2048576,
      "tags": ["Gloria Victis Horse"],
      "width": 1920,
      "height": 1080,
      "usageCount": 3,
      "createdAt": "2025-11-13T10:00:00Z"
    }
  ]
}
```

---

#### `PUT /projects/:projectId/media/:mediaId`
Update media tags

**Request Body:**
```json
{
  "tags": ["Gloria Victis Horse", "Gloria Victis Winning", "Cheltenham"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tags": ["Gloria Victis Horse", "Gloria Victis Winning", "Cheltenham"],
    "updatedAt": "2025-11-13T12:30:00Z"
  }
}
```

---

#### `DELETE /projects/:projectId/media/:mediaId`
Delete a media file

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Media deleted successfully"
  }
}
```

---

### Video Generation

#### `POST /projects/:projectId/generate`
Start video generation process

**Request Body:**
```json
{
  "autoPublish": false,
  "youtubeTitle": "UK's Most Tragic Horses - Horse Racing Nostalgia",
  "youtubeDescription": "A tribute to...",
  "youtubeTags": ["horse racing", "nostalgia", "UK racing"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "renderId": "uuid",
    "status": "queued",
    "estimatedTime": 600,
    "message": "Video generation started"
  }
}
```

---

#### `GET /renders/:renderId`
Get render status and progress

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "status": "processing",
    "progress": 45,
    "currentStep": "Assembling video scenes",
    "startedAt": "2025-11-13T12:00:00Z",
    "estimatedCompletion": "2025-11-13T12:10:00Z"
  }
}
```

---

#### `GET /renders/:renderId/scenes`
Get scene timeline for a render

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "sceneOrder": 1,
      "startTime": 0.0,
      "endTime": 15.5,
      "duration": 15.5,
      "scriptText": "Welcome to Horse Racing Nostalgia...",
      "mediaAsset": {
        "id": "uuid",
        "fileUrl": "https://...",
        "fileType": "image",
        "tags": ["Intro"]
      },
      "transitionType": "fade",
      "transitionDuration": 0.5
    }
  ]
}
```

---

### GPT-5 Integration

#### `POST /gpt/generate-script`
Generate script from project data

**Request Body:**
```json
{
  "projectId": "uuid",
  "tone": "nostalgic",
  "includeIntro": true,
  "includeOutro": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "script": "[00:00-00:15] Welcome to Horse Racing Nostalgia...",
    "tokensUsed": 1250,
    "estimatedDuration": 595,
    "tagReferences": [
      {
        "tag": "Gloria Victis Horse",
        "mentions": 3,
        "timestamps": ["00:15", "02:30", "05:45"]
      }
    ]
  }
}
```

---

#### `POST /gpt/match-media`
Match script to media assets

**Request Body:**
```json
{
  "projectId": "uuid",
  "script": "Welcome to Horse Racing Nostalgia..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scenes": [
      {
        "startTime": 0.0,
        "endTime": 15.5,
        "scriptText": "Welcome to Horse Racing Nostalgia...",
        "suggestedMedia": [
          {
            "mediaId": "uuid",
            "confidence": 0.95,
            "reason": "Tag 'Intro' matches scene context"
          }
        ]
      }
    ],
    "unmatchedTags": ["Some Tag"],
    "warnings": ["No media found for 'Some Tag'"]
  }
}
```

---

### YouTube Integration

#### `POST /youtube/upload`
Upload video to YouTube

**Request Body:**
```json
{
  "renderId": "uuid",
  "title": "UK's Most Tragic Horses",
  "description": "A tribute...",
  "tags": ["horse racing", "nostalgia"],
  "privacyStatus": "public",
  "categoryId": "17"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "abc123",
    "url": "https://youtube.com/watch?v=abc123",
    "uploadedAt": "2025-11-13T12:30:00Z"
  }
}
```

---

#### `GET /youtube/quota`
Check YouTube API quota usage

**Response:**
```json
{
  "success": true,
  "data": {
    "quotaUsed": 1600,
    "quotaLimit": 10000,
    "quotaRemaining": 8400,
    "resetsAt": "2025-11-14T00:00:00Z"
  }
}
```

---

## ⚠️ Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | User doesn't have access |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | External service down |

---

## 🔄 Webhooks (Future)

### Video Generation Complete
```http
POST https://your-app.com/webhooks/video-complete
Content-Type: application/json

{
  "event": "video.generation.completed",
  "data": {
    "renderId": "uuid",
    "projectId": "uuid",
    "videoUrl": "https://...",
    "duration": 598,
    "completedAt": "2025-11-13T12:30:00Z"
  }
}
```

---

## 📊 Rate Limiting

**Limits:**
- 100 requests per 15 minutes per user
- 10 video generations per day per user
- 50 media uploads per hour per user

**Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699876800
```

---

## 🧪 Testing Endpoints

### Health Check
```http
GET /health

Response:
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 3600,
  "services": {
    "database": "connected",
    "storage": "connected",
    "openai": "connected",
    "youtube": "connected"
  }
}
```

---

**Next:** [Setup Guide](../guides/SETUP.md)
