<div align="center">

# 🗳️ ElectED — AI-Powered Election Process Education Assistant

**Chosen Vertical: Civic Education & Democratic Participation**

[![React 18](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Cloud Run](https://img.shields.io/badge/Cloud_Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**[🚀 Live Demo](https://elected-site-600508364176.us-central1.run.app)** | **[📦 Repository](https://github.com/GauravTupe0/Promt-wars-mark-2)**

</div>

---

## 📌 Chosen Vertical

**ElectED** is built around the **Civic Education** vertical — an AI-powered assistant platform that guides citizens through the Indian democratic election process. The assistant persona is a knowledgeable, neutral civic guide that helps voters understand their rights, locate polling stations, and learn about the democratic process in an engaging, gamified way.

---

## 🎯 Approach & Logic

### The Problem
Millions of first-time voters in India are unsure how elections work — from voter registration to the EVM (Electronic Voting Machine) process, Lok Sabha structure, and ECI (Election Commission of India) timelines. This information gap leads to low voter turnout and disenfranchisement.

### The Solution
ElectED acts as a **smart, context-aware civic assistant** that:

1. **Adapts to user context** — Detects the user's language preference and adapts content accordingly (via Google Translate integration).
2. **Makes logical decisions** — The AI chat assistant responds intelligently to common civic questions, providing accurate, concise answers without political bias.
3. **Uses real-world data** — The polling station locator uses the Google Maps JavaScript API with live geolocation to show the nearest booths with routes, distance, and travel time.
4. **Gamifies learning** — A quiz engine with a Firebase-backed global leaderboard rewards civic knowledge, encouraging repeat engagement.

---

## 🏗️ How the Solution Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     User Browser                        │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌────────┐   │
│  │   Hero   │  │ Timeline │  │Poll Map │  │  Quiz  │   │
│  └────┬─────┘  └────┬─────┘  └────┬────┘  └───┬────┘   │
└───────┼─────────────┼─────────────┼────────────┼────────┘
        │             │             │            │
        ▼             ▼             ▼            ▼
   React 18 + TypeScript (Vite) — Lazy-loaded feature modules
        │             │             │            │
        ▼             ▼             ▼            ▼
   ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌────────┐
   │ Google   │  │  Google  │  │ Google  │  │Firebase│
   │Translate │  │  Gemini  │  │  Maps   │  │   DB   │
   └──────────┘  └──────────┘  └─────────┘  └────────┘
                                    │
                             ┌──────────────┐
                             │ Cloud Run    │
                             │ (Deployment) │
                             └──────────────┘
```

### Feature Modules

| Feature | Description | Google Service Used |
|---|---|---|
| 🗺️ **Poll Station Locator** | Real-time map with route + travel time to nearest booths | Google Maps JS API (Places, Routes) |
| 🤖 **AI Civic Assistant** | Chat bot that answers voter questions | Google Gemini API |
| 🌐 **Multi-language** | Translate entire page content | Google Translate Widget |
| 🏆 **Quiz Leaderboard** | Gamified election knowledge test | Firebase Realtime Database |
| ☁️ **Deployment** | Containerized, scalable hosting | Google Cloud Run |

### Data Flow

1. **User opens app** → React 18 loads feature sections lazily via `React.Suspense`
2. **Map section** → Browser geolocation API fires → `@googlemaps/js-api-loader` loads Maps SDK → Markers rendered for nearby polling stations with routes
3. **AI Chat** → User types question → Request sent to Gemini API → Response streamed back and rendered
4. **Quiz** → User completes quiz → Score written to Firebase Realtime DB → Global leaderboard fetched and ranked
5. **Translation** → Google Translate widget injected into DOM → Entire page translated on-demand

---

## 🛠️ Technology Stack

### Frontend
- **React 18** — Functional components, Hooks (`useState`, `useEffect`, `useMemo`), `Suspense` for code-splitting
- **TypeScript (Strict Mode)** — Full type safety with custom interfaces and generics
- **Vite** — Sub-second HMR, optimized production builds with tree-shaking
- **Vanilla CSS3** — Zero-framework styling using CSS Custom Properties (Design Tokens), Flexbox, CSS Grid

### State Management
- **Zustand** — Lightweight global state (user preferences, language settings)
- **React Query** — Server state, caching, and background sync for leaderboard data

### Google Services (Core Integration)
- **Google Maps JavaScript API** — Interactive map, Places library, Routes library for directions
- **Firebase Realtime Database** — Quiz leaderboard persistence and real-time rankings
- **Google Translate Widget** — Multilingual support for diverse user base
- **Google Gemini API** — AI-powered civic Q&A assistant
- **Google Cloud Run** — Containerized deployment with automatic scaling and HTTPS

### Testing & Quality
- **Vitest + React Testing Library** — Unit and component tests
- **Playwright** — End-to-end user flow testing
- **ESLint** — Code quality enforcement
- **TypeScript strict mode** — Compile-time error prevention

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/GauravTupe0/Promt-wars-mark-2.git
cd Promt-wars-mark-2

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env file in the root directory:
```

```env
# Google Maps Platform
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key
```

```bash
# 4. Start development server
npm run dev
# → App running at http://localhost:5173
```

### Running Tests

```bash
npm run test:unit       # Unit tests (Vitest)
npm run test:coverage   # Coverage report
npm run test:e2e        # End-to-end tests (Playwright)
```

---

## 📁 Project Structure

```
src/
├── components/          # Shared UI components (Navbar, Footer, etc.)
├── constants/           # App-wide constants and configuration
├── features/            # Feature-based modules (collocated tests)
│   ├── chat/            # AI Civic Assistant
│   ├── core/            # CTA, Glossary, HowItWorks
│   ├── hero/            # Landing hero section
│   ├── map/             # Polling station locator (Google Maps)
│   ├── quiz/            # Election knowledge quiz + leaderboard
│   ├── stats/           # India election statistics
│   └── timeline/        # Interactive election timeline
├── hooks/               # Custom React hooks (useScrollReveal, useAnalytics, etc.)
├── services/            # API service layer (geocode, leaderboard, weather)
├── firebase.ts          # Firebase initialization
└── App.tsx              # Root application with lazy loading
```

---

## 🧠 Assumptions Made

1. **India-specific focus**: All content, terminology (EVM, ECI, Lok Sabha, EPIC), and polling data is tailored to the Indian electoral system.
2. **Polling station data**: The map uses simulated nearby polling booths as a demonstration since a real national polling station API is not publicly available. In production, this would connect to the ECI's official database.
3. **AI assistant scope**: The Gemini-powered assistant is designed for civic queries only. Off-topic questions are gracefully redirected.
4. **Geolocation consent**: The map feature requires the user to grant browser location permission; a manual search fallback is provided.
5. **Anonymous leaderboard**: Quiz scores are saved anonymously with a user-provided display name; no authentication is required to reduce friction.

---

## 🛡️ Security & Accessibility

- **Input Sanitization**: All user inputs (quiz name entry, AI chat) are sanitized via DOMPurify to prevent XSS.
- **WCAG AA Compliance**: Semantic HTML5, ARIA labels, focus traps on modals, skip-to-content links, and keyboard navigation throughout.
- **No secrets in code**: All API keys are environment variables, never hardcoded.
- **Content Security Policy**: Enforced via Nginx configuration in the Docker deployment.
- **Screen reader support**: All interactive elements have descriptive `aria-label` attributes.

---

## ☁️ Deployment

The application is deployed as a containerized service on **Google Cloud Run**:

```
Service URL: https://elected-site-600508364176.us-central1.run.app
```

The Dockerfile uses a multi-stage build:
1. **Build stage**: Node 20 Alpine builds the Vite production bundle with all `VITE_*` env vars baked in at compile time.
2. **Serve stage**: Nginx Alpine serves the static assets with a production-hardened config.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <p>Built with ❤️ for the Prompt Wars Challenge — <strong>Civic Education Vertical</strong></p>
</div>
