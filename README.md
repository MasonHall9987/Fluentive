This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup

1. Create `.env.local` in project root. Fill in:
   - `AZURE_SPEECH_REGION`
   - `AZURE_SPEECH_KEY`
   - EITHER standard OpenAI
     - `OPENAI_API_KEY`
     - Optional: `OPENAI_MODEL` (defaults to `gpt-3.5-turbo`)
   - OR Azure OpenAI
     - `AZURE_OPENAI_ENDPOINT` (e.g., `https://your-resource.openai.azure.com`)
     - `AZURE_OPENAI_API_KEY`
     - `AZURE_OPENAI_DEPLOYMENT` (deployment name of your chat model)
     - Optional: `AZURE_OPENAI_API_VERSION` (default `2024-02-15-preview`)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

## Features

- **AI-Generated Sentences**: OpenAI generates contextual sentences with grammar constraints and topic focus
- **Audio Synthesis**: Azure TTS generates audio for Spanish sentences with in-memory caching
- **Speech Recognition**: Azure Speech Services for pronunciation assessment and transcription
- **Translation Validation**: AI-powered translation grading with nuanced feedback
- **Background Processing**: Sentences pre-generated for smooth user experience
- **Modern UI**: Glass morphism design with gradients, animations, and responsive layout
- **Grammar Topics**: 80+ grammar topics with verb type selection (irregular, regular, reflexive)
- **Multiple Modes**: Spanish→English (listening + translation), English→Spanish (translation only), Mixed
- **Progress Tracking**: Timer, sentence counter, and session management
- **Interactive Learning**: Hoverable definitions, follow-up Q&A, skip/retry functionality

## Architecture Overview

### Frontend (React/Next.js)
- **Component-Based**: Modular UI components with custom hooks for logic separation
- **State Management**: React hooks with optimized re-rendering and stale closure prevention
- **Real-Time Audio**: Browser audio playback with playback rate control
- **Responsive Design**: Mobile-first approach with Tailwind CSS and custom animations

### Backend (Next.js API Routes)
- **Serverless Functions**: Each API endpoint is a separate serverless function
- **AI Integration**: OpenAI for content generation, Azure for speech services
- **In-Memory Caching**: Audio files cached temporarily for performance
- **Type Safety**: Full TypeScript implementation with shared interfaces

## Backend API Reference

### Core Endpoints

#### `POST /api/sentence-batch`
**Purpose**: Generate a new batch of sentences with audio
- **Input**: Topic, grammar topics, direction, verb types
- **Process**: OpenAI generation → Definition mapping → Azure TTS → Audio caching
- **Output**: Sentence batch with text, translation, definitions, and audio URLs
- **File**: `app/api/sentence-batch/route.ts`

#### `POST /api/validate`
**Purpose**: Validate transcriptions and translations
- **Types**: `transcription` (exact match) or `translation` (AI grading)
- **Features**: Nuanced feedback, natural vs correct distinction, spelling tolerance
- **File**: `app/api/validate/route.ts`

#### `GET /api/stt/token`
**Purpose**: Generate Azure Speech Services authentication tokens
- **Security**: Temporary tokens for client-side speech recognition
- **File**: `app/api/stt/token/route.ts`

#### `GET /api/audio/[id]`
**Purpose**: Serve cached TTS audio files
- **Caching**: 10-minute TTL with automatic cleanup
- **File**: `app/api/audio/[id]/route.ts`

#### `POST /api/followup`
**Purpose**: Handle follow-up questions about translation mistakes
- **Context**: Maintains sentence, translation, and error context for deeper explanations
- **File**: `app/api/followup/route.ts`

## File Structure & Developer Guide

### Where to Make Changes

#### **UI Components** (`app/components/`)
- `GrammarTopicSelector.tsx` - Topic selection with search and verb types
- `LessonHeader.tsx` - Stats dashboard, timer, audio controls, exit button
- `TranscriptionPhase.tsx` - Speech-to-text exercise interface
- `TranslationPhase.tsx` - Translation input with AI feedback and follow-up Q&A
- `SetupForm.tsx` - Initial lesson configuration (topic, grammar, mode)

#### **Custom Hooks** (`app/hooks/`)
- `useBatchManagement.ts` - Sentence fetching, background loading, navigation
- `useSpeechToText.ts` - Azure Speech SDK integration, microphone management
- `useAudioPlayback.ts` - Audio player with rate control
- `useTranslationValidation.ts` - Translation checking and feedback
- `useFollowUpQuestions.ts` - Follow-up Q&A state management
- `useTimer.ts` - Session timing

#### **Core Logic** (`lib/`)
- `openai.ts` - **Sentence generation, seeding (`Date.now()`), definition mapping**
- `azureTTS.ts` - **Text-to-speech synthesis with voice selection**
- `openaiClient.ts` - **OpenAI client configuration and model selection**
- `inMemoryStore.ts` - **Audio caching with TTL management**
- `types.ts` - **TypeScript interfaces and type definitions**
- `batching.ts` - **Batch processing utilities**

#### ** Styling** (`app/globals.css`)
- **Custom color palette**: Mindaro, light green, emerald gradients
- **Component classes**: Button variants, cards, glass morphism effects
- **Animations**: Fade-in, slide-up, recording pulse effects

### Key Integration Points

#### **OpenAI Configuration**
```typescript
// lib/openaiClient.ts - Model and API setup
// lib/openai.ts - Prompt engineering and response parsing
```

#### **Azure Services**
```typescript
// lib/azureTTS.ts - Voice synthesis
// app/hooks/useSpeechToText.ts - Speech recognition
// app/api/stt/token/route.ts - Authentication
```

#### **State Management**
```typescript
// app/page.tsx - Main orchestration
// app/hooks/* - Isolated business logic
```

## Data Flow

### Lesson Flow
1. **Setup** → User selects topic, grammar, mode
2. **Generation** → API creates sentence batch with audio
3. **Background Loading** → Next sentence pre-generated
4. **Exercise Loop**:
   - **Audio Phase**: Play Spanish sentence
   - **Transcription**: Speech-to-text validation
   - **Translation**: AI-powered grading with feedback
   - **Navigation**: Smooth transition to next sentence

### Background Processing
- **Prefetching**: Next sentence generated during current exercise
- **Caching**: Audio stored in memory with 10-minute TTL
- **Smart Loading**: Queued batches for instant transitions

## Configuration

### Environment Variables
```bash
# Azure Speech Services
AZURE_SPEECH_REGION=eastus2
AZURE_SPEECH_KEY=your_key

# OpenAI (choose one)
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-3.5-turbo  # optional

# OR Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_DEPLOYMENT=your_deployment_name
AZURE_OPENAI_API_VERSION=2024-02-15-preview  # optional
```

### Customization Points
- **Grammar Topics**: Edit `GRAMMAR_TOPICS` array in `GrammarTopicSelector.tsx`
- **Voice Selection**: Modify `getDefaultVoiceForLanguage()` in `azureTTS.ts`
- **Batch Size**: Currently set to 1 sentence per batch in `openai.ts`
- **Caching Duration**: Adjust TTL in `inMemoryStore.ts` (default: 10 minutes)
- **AI Models**: Configure in `openaiClient.ts`

## Common Development Tasks

### Adding New Grammar Topics
1. Edit `GRAMMAR_TOPICS` in `app/components/GrammarTopicSelector.tsx`
2. Topics automatically appear in search/selection UI

### Modifying AI Behavior
1. **Sentence Generation**: Edit prompts in `lib/openai.ts`
2. **Translation Grading**: Modify system prompt in `app/api/validate/route.ts`
3. **Model Selection**: Update `lib/openaiClient.ts`

### Adding New Language Pairs
1. Update `Direction` type in `lib/types.ts`
2. Add voice mappings in `lib/azureTTS.ts`
3. Update language detection in API routes

### UI Customization
1. **Colors**: Modify CSS variables in `app/globals.css`
2. **Components**: Edit component files in `app/components/`
3. **Animations**: Adjust Tailwind classes or add CSS animations

### Debugging Speech Issues
1. Check browser console for SDK errors
2. Verify HTTPS (required for microphone access)
3. Test token generation at `/api/stt/token`
4. Review Azure Speech Services quotas

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
