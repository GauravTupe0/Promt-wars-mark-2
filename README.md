<div align="center">
  <h1>🗳️ ElectED — Election Process Education</h1>
  <p>A non-partisan, interactive, and accessible web platform designed to educate citizens about the democratic election process.</p>

  <p>
    <a href="https://react.dev/" target="_blank">
      <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 18" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
    <a href="https://vitejs.dev/" target="_blank">
      <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    </a>
    <a href="https://firebase.google.com/" target="_blank">
      <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
    </a>
  </p>
</div>

<br />

ElectED provides a structured, interactive guide to how democracy works—from candidacy declaration to official certification. By blending real-world data with gamified learning, the platform empowers voters with the knowledge they need to participate confidently in the civic process.

---

## 🌟 Key Features

- 🗺️ **Civic Tooling & Smart Maps**: Find your nearest polling station with our real-time interactive locator, fully integrated with Google Maps routes, local weather, and travel data.
- 🎓 **Gamified Educational Quiz**: Test your knowledge of the Indian electoral process, climb the Firebase-powered global leaderboard, and track your learning progress!
- ⏳ **Interactive Election Timeline**: Experience a visually rich, step-by-step guide through the entire lifecycle of an election (EVM, Lok Sabha, ECI processes).
- 🤖 **AI Voting Assistant**: Quickly get answers to your most pressing voting and civic duty questions via an intelligent integrated chat interface.
- ♿ **Accessibility First**: Meticulously designed to be WCAG AA/AAA compliant. Features full keyboard navigation, screen reader compatibility, high contrast modes, and "skip to content" links.
- 📱 **Fully Responsive Layout**: Enjoy a flawless, application-like experience on desktops, tablets, and mobile devices—featuring a modern responsive grid architecture and fluid typography.
- 🌐 **Multi-language Support**: Accessible in multiple languages to break down barriers and support diverse communities.

---

## 🏗️ Architecture & Tech Stack

**Frontend Framework**
* **React 18** (Functional Components, Hooks, Suspense)
* **TypeScript** (Strict Mode, Interface-driven Development)
* **Vite** (Lightning-fast HMR and optimized production builds)

**State & Data Management**
* **Zustand**: Lightweight global state management for UI and user preferences.
* **React Query**: Robust server state management, caching, and data synchronization.

**Backend & APIs**
* **Firebase**: Secure Realtime Database integration for the global quiz leaderboard.
* **Google Maps Platform**: Advanced Maps JS API (Places, Routes) for the interactive polling locator.
* **OpenWeather API**: Contextual weather data for polling day preparation.

**Styling & UI**
* **Vanilla CSS3**: Highly optimized, zero-dependency styling using CSS variables (Design Tokens), Flexbox, and CSS Grid.
* **Lucide React**: Beautiful, consistent vector icons.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn**
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GauravTupe0/Promt-wars-mark-2.git
   cd Promt-wars-mark-2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and configure your API keys:
   ```env
   # Firebase Database Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   
   # Google Maps Platform
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   # Generative AI (Optional)
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the Development Server

Start the Vite development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🧪 Testing Strategy

The project maintains high reliability through comprehensive testing.

- **Unit Testing**: Run fast, isolated tests on components and utilities.
  ```bash
  npm run test:unit
  ```
- **Coverage Report**: Generate an HTML report of code coverage.
  ```bash
  npm run test:coverage
  ```
- **End-to-End (E2E) Testing**: Run critical user journey flows via Playwright.
  ```bash
  npm run test:e2e
  ```

---

## 🛡️ Security & Performance Standards

- **Strict Sanitization**: All rich-text inputs and dynamic content are rigorously sanitized using DOMPurify to prevent XSS attacks.
- **Content Security Policy (CSP)**: Hardened headers configured for production deployment.
- **Lighthouse Optimized**: Built to achieve 90+ scores across Performance, Accessibility, Best Practices, and SEO.

---

## 📄 License

This project is open-source and licensed under the **MIT License**. Feel free to fork, modify, and use it to help educate citizens worldwide!
