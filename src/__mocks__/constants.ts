export const APP_NAME = 'ElectED';
export const APP_TAGLINE = 'Election Process Education';
export const NAV_LINKS = [
  { href: '#hero',     label: 'Home',       aria: 'Home section',                  sectionId: 'hero' },
  { href: '#timeline', label: 'Timeline',   aria: 'Election Timeline section',     sectionId: 'timeline' },
  { href: '#how',      label: 'Steps',      aria: 'How it Works section',          sectionId: 'how' },
  { href: '#pollmap',  label: 'Find Polls', aria: 'Find Polling Station section',  sectionId: 'pollmap' },
  { href: '#quiz',     label: 'Quiz',       aria: 'Knowledge Quiz section',        sectionId: 'quiz' },
  { href: '#glossary', label: 'Glossary',   aria: 'Election Glossary section',     sectionId: 'glossary' },
];
export const SECTION_IDS = NAV_LINKS.map((l) => l.sectionId);
export const LANGUAGES = [
  { code: 'hi', gtCode: 'hi',    label: 'हिन्दी',      flag: '🇮🇳' },
  { code: 'en', gtCode: 'en',    label: 'English',   flag: '🇺🇸' },
];
export const POLL_OFFSETS = [
  { name: 'City Hall',             delta: [0.006,  0.008],  type: 'Main Station',   id: 'p1' },
  { name: 'Community Center',      delta: [-0.009, 0.004],  type: 'Secondary',      id: 'p2' },
];
export const MAPS_API_KEY = 'test-key';
export const MAPS_CONFIGURED = true;
export const MAP_STYLES = [];
export const WEATHER_CODE_MAP = {};
export const QUIZ_LETTERS = ['A', 'B', 'C', 'D'];
export const QUIZ_LEADERBOARD_LIMIT = 5;
export const QUIZ_MESSAGES = { perfect: 'MsgPerfect', great: 'MsgGreat', keep: 'MsgKeep' };
export const QUIZ_TITLES = { perfect: 'TitlePerfect', great: 'TitleGreat', keep: 'TitleKeep' };
export const WEATHER_API_BASE = '';
export const GEOCODE_API_BASE = '';
export const SKIP_LINK_TARGET = 'main-content';
export const INTERSECTION_THRESHOLD = 0.12;
export const SEARCH_DEBOUNCE_MS = 300;
export const STORAGE_KEYS = { THEME: 'elected_theme', LANGUAGE: 'elected_language' };
export const ARIA_LABELS = { 
  SKIP_LINK: 'Skip to main content', 
  MAIN_NAV: 'Main navigation',
  LANGUAGE: 'Select language — powered by Google Translate'
};
