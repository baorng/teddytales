# 🎨 Frontend Development Guide

Complete setup guide for building the beautiful, children-friendly AI Storyteller frontend.

## 🚀 Quick Start

### **1. Create React Project**
```bash
cd ../apps
npm create vite@latest ai-storyteller-frontend -- --template react-ts
cd ai-storyteller-frontend
npm install
```

### **2. Install Dependencies**
```bash
npm install axios framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
npx tailwindcss init -p
```

### **3. Configure Tailwind CSS**

**tailwind.config.js:**
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          pink: '#EC4899',
          yellow: '#F59E0B',
          green: '#10B981',
        },
        storybook: {
          bg: '#FEF3C7',
          accent: '#F59E0B',
          text: '#92400E'
        }
      },
      fontFamily: {
        'story': ['Comic Neue', 'cursive'],
        'child': ['Fredoka One', 'cursive']
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Fredoka+One&display=swap');

@keyframes wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

.story-text {
  font-family: 'Comic Neue', cursive;
  font-size: 1.25rem;
  line-height: 1.8;
  color: #1F2937;
}

.playful-button {
  @apply px-8 py-4 text-lg font-bold rounded-full transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg;
}
```

### **4. Environment Configuration**

**.env:**
```env
VITE_API_BASE_URL=https://ai-storyteller.01kc3c918xkfv1z281re82g2sz.lmapp.run
```

### **5. Start Development**
```bash
npm run dev
```

---

## 🎨 Project Structure

```
ai-storyteller-frontend/
├── src/
│   ├── components/
│   │   ├── AudioPlayer.tsx
│   │   ├── StoryCard.tsx
│   │   ├── CharacterSelector.tsx
│   │   ├── LoadingAnimation.tsx
│   │   └── ChoiceButton.tsx
│   ├── pages/
│   │   ├── WelcomePage.tsx
│   │   ├── StoryCreationPage.tsx
│   │   └── StoryDisplayPage.tsx
│   ├── hooks/
│   │   ├── useStoryCreation.ts
│   │   └── useAudioPlayback.ts
│   ├── utils/
│   │   ├── api.ts
│   │   └── types.ts
│   └── styles/
│       └── animations.css
└── public/
    └── favicon.ico
```

---

## 🛠️ API Client Setup

### **API Client** (`src/utils/api.ts`)
```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
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

---

## 🎭 Core Components

### **Audio Player** (`src/components/AudioPlayer.tsx`)
```typescript
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl, 
  autoPlay = false, 
  className = "" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  return (
    <div className={`audio-player bg-white rounded-2xl shadow-lg p-6 border-4 border-primary-yellow ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        autoPlay={autoPlay}
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-6 h-6 text-primary-purple" />
          <span className="text-sm font-medium text-gray-700">Story Narration</span>
        </div>
        
        <button
          onClick={togglePlay}
          className="playful-button bg-gradient-to-r from-primary-purple to-primary-pink text-white"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          {isPlaying ? 'Pause Story' : 'Play Story'}
        </button>
      </div>

      <div className="bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="bg-gradient-to-r from-primary-purple to-primary-pink h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
};
```

### **Story Creation Form** (`src/components/StoryCreationForm.tsx`)
```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StoryRequest, StoryAPI } from '../utils/api';

const themes = [
  { id: 'adventure', name: 'Adventure', emoji: '🗺️', color: 'bg-primary-blue' },
  { id: 'space', name: 'Space', emoji: '🚀', color: 'bg-primary-purple' },
  { id: 'magic', name: 'Magic', emoji: '✨', color: 'bg-primary-pink' },
  { id: 'animals', name: 'Animals', emoji: '🦁', color: 'bg-primary-green' },
  { id: 'friendship', name: 'Friendship', emoji: '👫', color: 'bg-primary-yellow' }
];

export const StoryCreationForm: React.FC<{
  onStoryCreated: (story: any) => void;
}> = ({ onStoryCreated }) => {
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('adventure');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !age) return;

    setLoading(true);
    try {
      const request: StoryRequest = {
        child_name: childName,
        age: parseInt(age),
        theme: selectedTheme
      };
      
      const story = await StoryAPI.createStory(request);
      onStoryCreated(story);
    } catch (error) {
      console.error('Failed to create story:', error);
      alert('Oops! Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-storybook-bg to-white rounded-3xl shadow-xl border-4 border-storybook-accent"
    >
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800" style={{ fontFamily: 'Fredoka One, cursive' }}>
        🎭 Create Your Magical Story! ✨
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xl font-bold text-gray-700 mb-2">
            👋 What's your name?
          </label>
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Enter your magical name..."
            className="w-full px-6 py-4 text-lg rounded-2xl border-4 border-primary-yellow focus:outline-none focus:ring-4 focus:ring-primary-yellow/50"
            required
          />
        </div>

        <div>
          <label className="block text-xl font-bold text-gray-700 mb-2">
            🎂 How old are you?
          </label>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-6 py-4 text-lg rounded-2xl border-4 border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/50"
            required
          >
            <option value="">Select your age...</option>
            {Array.from({ length: 10 }, (_, i) => i + 3).map(a => (
              <option key={a} value={a}>{a} years old</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xl font-bold text-gray-700 mb-4">
            🌟 Choose your adventure!
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <motion.button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-2xl border-4 transition-all ${
                  selectedTheme === theme.id
                    ? `${theme.color} text-white border-white scale-105`
                    : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-2">{theme.emoji}</div>
                <div className="font-bold">{theme.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading || !childName || !age}
          className="w-full playful-button bg-gradient-to-r from-primary-blue via-primary-purple to-primary-pink text-white text-xl disabled:opacity-50"
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              🪄 Creating Magic...
            </span>
          ) : (
            '🎭 Start My Story!'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};
```

### **Loading Animation** (`src/components/LoadingAnimation.tsx`)
```typescript
import React from 'react';
import { motion } from 'framer-motion';

export const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <motion.div
          className="w-24 h-24 border-8 border-primary-purple/20 border-t-primary-purple rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ✨
        </motion.div>
      </div>
      
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Creating Your Story...</h3>
        <p className="text-gray-600">The magic is happening! ✨</p>
      </motion.div>
    </div>
  );
};
```

---

## 🎨 Design Guidelines

### **🌈 Color Palette**
```css
--primary-blue: #3B82F6;
--primary-purple: #8B5CF6;
--primary-pink: #EC4899;
--primary-yellow: #F59E0B;
--primary-green: #10B981;
--storybook-bg: #FEF3C7;
```

### **🎭 Typography**
- **Headers**: Fredoka One (playful, bold)
- **Body Text**: Comic Neue (friendly, readable)
- **Buttons**: Large, rounded, colorful
- **Story Text**: Large, high contrast

### **✨ Animations**
- **Buttons**: Scale and color change on hover
- **Loading**: Sparkles and rotation
- **Story Reveal**: Fade in with bounce
- **Choices**: Wiggle and glow effects

---

## 🎯 Demo Features

### **🎭 Core Flow**
1. **Welcome Screen** - Character selection with emojis
2. **Story Creation** - Magical form with theme selection
3. **Loading Animation** - Fun loading with sparkles
4. **Story Display** - Beautiful typography with audio
5. **Interactive Choices** - Engaging decision making

### **🌟 Wow Factors**
- **Real AI Integration** - Stories generated instantly
- **Professional Audio** - High-quality narration
- **Beautiful Design** - Playful, colorful, engaging
- **Smooth Animations** - Delightful micro-interactions
- **Mobile Responsive** - Works on tablets and phones

---

## 🚀 Development Workflow

### **Start Development**
```bash
npm run dev
```

### **Build for Production**
```bash
npm run build
npm run preview
```

### **Deploy Options**
- **Netlify**: Drag and drop dist folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Use gh-pages branch

---

## 🎉 Ready to Build!

All setup instructions are complete. You have:
✅ Live API ready for integration
✅ Component examples to copy/paste
✅ Design system ready to use
✅ Project structure organized
✅ Animation patterns included

**Let's build that magical frontend!** 🌟🎭🚀