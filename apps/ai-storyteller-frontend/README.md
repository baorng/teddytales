# 🎨 TeddyTales Frontend

The React-based frontend for TeddyTales - Stories that grow with your child.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Live Demo

**Production**: [https://teddytales.vercel.app/](https://teddytales.vercel.app/)

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Deployment**: Vercel

## 📂 Project Structure

```
src/
├── components/
│   ├── AudioPlayer.tsx          # Audio playback controls
│   ├── BackgroundMusic.tsx      # Background music component
│   ├── ChoiceButtons.tsx        # Interactive story choices
│   ├── Decorations.tsx          # Visual decorative elements
│   ├── LoadingAnimation.tsx     # Loading states
│   ├── StoryCreationForm.tsx    # Story input form
│   ├── StoryDisplay.tsx         # Story text display
│   └── StoryEnding.tsx          # Story conclusion screen
├── utils/
│   └── api.ts                   # API client for backend
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
└── index.css                    # Global styles
```

## 🔌 API Integration

The frontend connects to the TeddyTales backend API:

```typescript
// src/utils/api.ts
const API_BASE = "https://ai-storyteller.01kc54r6ayz240zq9k7z4c7yxh.lmapp.run";

export const StoryAPI = {
  async createStory(request: StoryRequest): Promise<StoryResponse> {
    const response = await fetch(`${API_BASE}/start-story`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return response.json();
  },
  
  async continueStory(
    segmentId: number,
    choice: string,
    segmentOrder: number
  ): Promise<StoryResponse> {
    const response = await fetch(`${API_BASE}/continue-story`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ segment_id: segmentId, audio_blob: choice, segment_order: segmentOrder }),
    });
    return response.json();
  },
};
```

## 🎨 Design System

### Color Palette
- **Cream**: `#FEF3C7` - Warm background
- **Brown**: `#78350F` - Text and borders
- **Sage**: `#10B981` - Success/nature themes
- **Sunset**: `#F59E0B` - Primary actions
- **Sky**: `#3B82F6` - Interactive elements

### Typography
- **Story Text**: Crimson Text (serif)
- **UI Labels**: Quicksand (sans-serif)
- **Headings**: Caveat (handwritten)
- **Decorative**: Patrick Hand (casual)

### Animations
- Page transitions with Framer Motion
- Loading spinners and pulses
- Button hover effects
- Smooth entry/exit animations

## 🧩 Key Components

### StoryCreationForm
Collects child information and story preferences:
- Child's name (required)
- Age (3-12 years)
- Theme selection (adventure, fantasy, etc.)
- English level (optional)
- Lesson of the day (optional)

### StoryDisplay
Shows the generated story with:
- Formatted story text
- AI-generated illustration
- Audio player for narration
- Choice buttons for interaction

### AudioPlayer
Custom audio controls:
- Play/pause functionality
- Progress bar
- Volume control
- Stylized UI matching storybook theme

### ChoiceButtons
Interactive decision points:
- Visual feedback on hover
- Disabled state during loading
- Animated selection
- Clear choice text

## 📱 Responsive Design

The app is fully responsive across devices:
- **Desktop**: Full-width story display with sidebar
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Single-column layout, optimized for reading

## 🔧 Development

### Environment Variables
```bash
# .env.local (optional)
VITE_API_BASE_URL=http://localhost:8787  # For local development
```

### Available Scripts
- `npm run dev` - Start dev server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code (if configured)

### Hot Module Replacement
Vite provides instant HMR - changes appear immediately without full reload.

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
npx vercel --prod
```

The `vercel.json` configuration handles:
- Framework detection (Vite)
- Build commands
- SPA routing (rewrites to index.html)
- Static asset caching

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [other static files]
```

## 🐛 Common Issues

### API Connection Errors
- Verify backend URL in `src/utils/api.ts`
- Check CORS configuration on backend
- Ensure backend is running and accessible

### Audio Playback Issues
- Check browser console for errors
- Verify audio URL format
- Ensure proper MIME type from backend (`audio/mpeg`)

### Image Loading Delays
- Images are generated on-demand from Pollinations.ai
- First load may take 2-3 seconds
- Subsequent loads are cached

## 📚 Additional Documentation

- **Main README**: See `/README.md` for project overview
- **API Documentation**: See `/apps/ai-storyteller/API.md`
- **Technology Stack**: See `/TECHNOLOGY.md` for detailed tech info
- **Contributing**: See `/CONTRIBUTING.md` for contribution guidelines
- **Submission Info**: See `/SUBMISSION.md` for hackathon details

## 🎯 Features

### Current Features
- ✅ Story creation with personalization
- ✅ Professional audio narration
- ✅ AI-generated illustrations
- ✅ Interactive story choices
- ✅ Beautiful storybook-themed UI
- ✅ Responsive design
- ✅ Loading states and error handling

### Planned Features
- [ ] Story history and bookmarks
- [ ] Multiple voice options
- [ ] Printable story pages
- [ ] Story sharing functionality
- [ ] Parent dashboard
- [ ] Multi-language support

## 🙏 Credits

Built with:
- React team for the excellent framework
- Vite team for the blazing-fast build tool
- Tailwind CSS for the utility-first styling
- Framer Motion for smooth animations
- Pollinations.ai for image generation

## 📄 License

This project is part of TeddyTales and is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

**Part of TeddyTales** - Stories that grow with your child 🎭📚✨
