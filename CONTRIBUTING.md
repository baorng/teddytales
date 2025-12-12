# Contributing to TeddyTales

Thank you for your interest in contributing to TeddyTales! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm 
- Raindrop CLI (for backend work): `npm install -g @liquidmetal-ai/raindrop`
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/baorng/teddytales.git
   cd teddytales
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Backend setup**
   ```bash
   cd apps/ai-storyteller
   npm install
   
   # Set up environment variables
   raindrop build env set ELEVENLABS_API_KEY your_key
   raindrop build env set VULTR_INFERENCE_API_KEY your_key
   
   # Deploy locally
   raindrop build deploy --start
   ```

4. **Frontend setup**
   ```bash
   cd apps/ai-storyteller-frontend
   npm install
   npm run dev
   ```

## Project Structure

```
ai-storyteller/
├── apps/
│   ├── ai-storyteller/          # Backend (Raindrop + Hono.js)
│   │   ├── src/
│   │   │   ├── story-api/       # API routes and logic
│   │   │   ├── _app/            # App configuration
│   │   │   └── logger.ts        # Logging utilities
│   │   └── raindrop.manifest    # Raindrop configuration
│   │
│   └── ai-storyteller-frontend/ # Frontend (React + Vite)
│       ├── src/
│       │   ├── components/      # React components
│       │   ├── utils/           # Utilities (API client)
│       │   └── App.tsx          # Main app
│       └── vite.config.ts       # Vite configuration
│
├── db/                          # Database schemas
├── README.md                    # Project overview
├── SUBMISSION.md                # Hackathon submission
├── TECHNOLOGY.md                # Technical documentation
└── LICENSE                      # MIT License
```

## Development Workflow

### Backend Development

1. **Make changes** to files in `apps/ai-storyteller/src/`
2. **Test locally** with Raindrop:
   ```bash
   raindrop build deploy --amend
   ```
3. **Check logs**:
   ```bash
   raindrop build logs
   ```

### Frontend Development

1. **Make changes** to files in `apps/ai-storyteller-frontend/src/`
2. **Hot reload** is automatic with Vite
3. **Build for production**:
   ```bash
   npm run build
   npm run preview
   ```

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
