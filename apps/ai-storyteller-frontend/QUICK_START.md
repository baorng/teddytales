# 🚀 AI Storyteller Frontend - Quick Start

**Backend API**: https://ai-storyteller.01kc3c918xkfv1z281re82g2sz.lmapp.run

## ⚡ 5-Minute Setup

### 1. Create Project
```bash
npm create vite@latest . -- --template react-ts
npm install
```

### 2. Install Dependencies  
```bash
npm install axios framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
npx tailwindcss init -p
```

### 3. API Client
```typescript
// src/api.ts
const API_BASE = 'https://ai-storyteller.01kc3c918xkfv1z281re82g2sz.lmapp.run';

export const createStory = async (data: {
  child_name: string;
  age: number;
  theme?: string;
}) => {
  const response = await fetch(`${API_BASE}/start-story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### 4. Test It
```typescript
// App.tsx
import { createStory } from './api';

const testAPI = async () => {
  const story = await createStory({
    child_name: "Test Kid",
    age: 6,
    theme: "adventure"
  });
  console.log(story);
  // Will have: story_text, audio_url, choice_question
};

testAPI();
```

## 🎯 Demo Features to Build

1. **Story Form** - Name, age, theme selection
2. **Loading Animation** - While AI generates story  
3. **Story Display** - Beautiful text + audio player
4. **Choice Interface** - Interactive decision buttons
5. **Audio Controls** - Play/pause narration

## 🎨 Design Tips

- **Colors**: Bright, playful, kid-friendly
- **Buttons**: Large, rounded, colorful
- **Typography**: Comic Neue or similar playful fonts
- **Animations**: Bounce, wiggle, sparkle effects
- **Mobile**: Touch-friendly, responsive

## 🎵 Audio Integration

```typescript
const AudioPlayer = ({ audioUrl }: { audioUrl: string }) => (
  <audio controls src={`${API_BASE}${audioUrl}`}>
    Your browser does not support audio.
  </audio>
);
```

## 🚀 Start Building!

```bash
npm run dev
```

Backend is 100% ready - start creating that magical frontend! ✨🎭