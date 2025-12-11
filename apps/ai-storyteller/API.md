# 📡 AI Storyteller API Documentation

Complete API reference for frontend development.

## 🔗 Base URL
```
https://ai-storyteller.01kc3c918xkfv1z281re82g2sz.lmapp.run
```

## 📋 Endpoints

### 🏥 Health & Status

#### `GET /health`
Basic health check
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T09:35:22.123Z"
}
```

#### `GET /health/services`
Detailed service status
```json
{
  "status": "healthy",
  "services": {
    "raindrop_services": {
      "smartsql": "Available",
      "smartmemory": "Available", 
      "bucket_storage": "Available",
      "ai_interface": "Available"
    },
    "external_integrations": {
      "elevenlabs_tts": {
        "configured": true,
        "voice_id": "EXAVITQu4vr4xnSDxMaL"
      }
    }
  }
}
```

#### `GET /`
Application dashboard
Returns comprehensive status information.

---

### 🎭 Story Creation

#### `POST /start-story`
Create new personalized story with audio

**Request:**
```json
{
  "child_name": "Emma",
  "age": 5,
  "theme": "adventure",
  "lesson_of_day": "be brave"  // optional
}
```

**Response:**
```json
{
  "story_id": 0,
  "segment_id": 0,
  "segment_text": "Emma loved going on adventures with her friends...",
  "audio_url": "/get-audio/story-0-segment-0.mp3",
  "choice_question": "Should Emma go to the CANDY CAVE or the SECRET GARDEN?",
  "segment_order": 0,
  "is_conclusion": false
}
```

**Parameters:**
- `child_name` (string, required): Child's name for personalization
- `age` (number, required): Child's age (1-12 recommended)
- `theme` (string, optional): Story theme (adventure, space, magic, animals, etc.)
- `lesson_of_day` (string, optional): Moral or lesson to include

---

### 🎵 Audio Operations

#### `GET /get-audio/:audioKey`
Download/stream audio narration

**Parameters:**
- `audioKey` (string): Audio file identifier (e.g., "story-0-segment-0.mp3")

**Headers:**
```
Content-Type: audio/mpeg
Content-Length: 522911
Cache-Control: public, max-age=3600
```

**Response:** Binary MP3 audio file

**Example Usage:**
```bash
# Direct download
curl https://ai-storyteller.01kc3c918xkfv1z281re82g2sz.lmapp.run/get-audio/story-0-segment-0.mp3

# HTML audio element
<audio controls>
  <source src="https://ai-storyteller.01kc3c918xkfv1z281re82g2sz.lmapp.run/get-audio/story-0-segment-0.mp3" type="audio/mpeg">
</audio>
```

---

### 🧪 Testing Endpoints

#### `GET /test-ai`
Test AI story generation
```json
{
  "status": "AI Working!",
  "ai_response": "Here is a short children's story...",
  "model": "llama-3-8b-instruct",
  "timestamp": "2025-12-11T09:15:22.819Z"
}
```

#### `GET /test-tts`
Test ElevenLabs TTS
```json
{
  "success": true,
  "message": "ElevenLabs TTS working!",
  "audio_size_bytes": 719770,
  "voice_used": "EXAVITQu4vr4xnSDxMaL"
}
```

#### `GET /test-voices`
List available voices
```json
{
  "success": true,
  "popular_options": [
    {
      "voice_id": "EXAVITQu4vr4xnSDxMaL",
      "name": "Sarah",
      "gender": "female",
      "description": "Young adult woman with a confident and warm, mature quality"
    }
  ]
}
```

---

## 🎨 Frontend Integration

### 📦 Required Dependencies
```bash
npm install axios @types/node
```

### 🔧 API Client

```typescript
// api.ts
const API_BASE = 'https://ai-storyteller.01kc3c918xkfv1z281re82g2sz.lmapp.run';

export interface StoryRequest {
  child_name: string;
  age: number;
  theme?: string;
  lesson_of_day?: string;
}

export interface StoryResponse {
  story_id: number;
  segment_id: number;
  segment_text: string;
  audio_url: string;
  choice_question: string;
  segment_order: number;
  is_conclusion: boolean;
}

export class StoryAPI {
  static async createStory(request: StoryRequest): Promise<StoryResponse> {
    const response = await fetch(`${API_BASE}/start-story`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    return response.json();
  }

  static getAudioUrl(audioKey: string): string {
    return `${API_BASE}/get-audio/${audioKey}`;
  }

  static async checkHealth() {
    const response = await fetch(`${API_BASE}/health/services`);
    return response.json();
  }
}
```

### 🎵 Audio Component

```typescript
interface AudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        autoPlay={autoPlay}
      />
      <button onClick={togglePlay}>
        {isPlaying ? '⏸️ Pause' : '▶️ Play Story'}
      </button>
    </div>
  );
};
```

### 📝 Story Creation Form

```typescript
const StoryCreator: React.FC = () => {
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [theme, setTheme] = useState('adventure');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<StoryResponse | null>(null);

  const themes = ['adventure', 'space', 'magic', 'animals', 'friendship', 'mystery'];

  const createStory = async () => {
    if (!childName || !age) return;

    setLoading(true);
    try {
      const response = await StoryAPI.createStory({
        child_name: childName,
        age: parseInt(age),
        theme: theme
      });
      setStory(response);
    } catch (error) {
      console.error('Failed to create story:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="story-creator">
      <h2>Create Your Magical Story! ✨</h2>
      
      <input 
        type="text" 
        value={childName} 
        onChange={(e) => setChildName(e.target.value)}
        placeholder="Enter your name"
      />

      <input 
        type="number" 
        value={age} 
        onChange={(e) => setAge(e.target.value)}
        placeholder="Your age"
        min="3"
        max="12"
      />

      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        {themes.map(t => (
          <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
        ))}
      </select>

      <button 
        onClick={createStory} 
        disabled={loading || !childName || !age}
      >
        {loading ? '🪄 Creating Magic...' : '🎭 Start My Story!'}
      </button>

      {story && (
        <div className="story-result">
          <h3>📖 Your Story!</h3>
          <p>{story.segment_text}</p>
          <AudioPlayer audioUrl={StoryAPI.getAudioUrl(story.audio_url.split('/').pop() || '')} />
          
          {story.choice_question && (
            <div className="choice-section">
              <h4>{story.choice_question}</h4>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

---

## 🔧 Error Handling

### Expected Errors

#### Validation Errors (400)
```json
{
  "error": "Failed to start story",
  "details": "Invalid input data"
}
```

#### Service Errors (500)
```json
{
  "error": "Failed to start story", 
  "details": "AI model returned invalid response"
}
```

#### Audio Not Found (404)
```json
{
  "error": "Audio not found",
  "audioKey": "story-999-segment-0.mp3"
}
```

---

## 🎯 Best Practices

- ✅ Always validate input before API calls
- ✅ Show loading states during AI generation
- ✅ Handle audio loading with fallbacks
- ✅ Cache audio responses for 1 hour
- ✅ Use large, touch-friendly buttons for kids
- ✅ Include audio controls with play/pause
- ✅ Add delightful animations and transitions

---

## 🚀 Ready to Build!

All endpoints are tested and working perfectly. Start building that magical frontend! 🌟