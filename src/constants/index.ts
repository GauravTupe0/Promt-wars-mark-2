/**
 * Global constants for the ElectED application.
 * Centralized configuration for branding, navigation, mapping, and external APIs.
 */

// ── App Metadata ─────────────────────────────────────────────────────────────
export const APP_NAME: string = 'ElectED';
export const APP_TAGLINE: string = 'Indian Election Education';
export const APP_DESCRIPTION: string =
  'A free, non-partisan guide to understanding Indian elections — from ECI nomination process to EVM counting. Know your rights, find your booth, and vote with confidence.';
export const APP_VERSION: string = '2.0.0';

// ── Navigation ────────────────────────────────────────────────────────────────
interface NavLink {
  href: string;
  label: string;
  aria: string;
  sectionId: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: '#hero',     label: 'Home',       aria: 'Home section',                  sectionId: 'hero' },
  { href: '#timeline', label: 'Timeline',   aria: 'Election Timeline section',     sectionId: 'timeline' },
  { href: '#how',      label: 'Steps',      aria: 'How it Works section',          sectionId: 'how' },
  { href: '#pollmap',  label: 'Find Polls', aria: 'Find Polling Station section',  sectionId: 'pollmap' },
  { href: '#quiz',     label: 'Quiz',       aria: 'Knowledge Quiz section',        sectionId: 'quiz' },
  { href: '#glossary', label: 'Glossary',   aria: 'Election Glossary section',     sectionId: 'glossary' },
];

export const SECTION_IDS: string[] = NAV_LINKS.map((l) => l.sectionId);

// ── Language Options ──────────────────────────────────────────────────────────
interface Language {
  code: string;
  gtCode: string;
  label: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'hi', gtCode: 'hi',    label: 'हिन्दी',      flag: '🇮🇳' },
  { code: 'en', gtCode: 'en',    label: 'English',   flag: '🇬🇧' },
  { code: 'bn', gtCode: 'bn',    label: 'বাংলা',      flag: '🏳️' },
  { code: 'te', gtCode: 'te',    label: 'తెలుగు',     flag: '🏳️' },
  { code: 'mr', gtCode: 'mr',    label: 'मराठी',      flag: '🏳️' },
  { code: 'ta', gtCode: 'ta',    label: 'தமிழ்',      flag: '🏳️' },
  { code: 'gu', gtCode: 'gu',    label: 'ગુજરાતી',    flag: '🏳️' },
  { code: 'kn', gtCode: 'kn',    label: 'ಕನ್ನಡ',     flag: '🏳️' },
  { code: 'pa', gtCode: 'pa',    label: 'ਪੰਜਾਬੀ',     flag: '🏳️' },
  { code: 'ur', gtCode: 'ur',    label: 'اردو',       flag: '🏳️' },
];

// ── Map Config ────────────────────────────────────────────────────────────────
export const MAPS_API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
export const MAPS_CONFIGURED: boolean =
  Boolean(MAPS_API_KEY) && !MAPS_API_KEY.includes('YOUR_');


export const POLL_OFFSETS = [
  { name: 'Gram Panchayat Office',    delta: [0.006,  0.008],  type: 'Government Building', id: 'p1' },
  { name: 'Government Primary School',delta: [-0.009, 0.004],  type: 'School / College',    id: 'p2' },
  { name: 'Community Hall',           delta: [0.004, -0.010],  type: 'Community Centre',    id: 'p3' },
  { name: 'Municipal Corporation Office', delta: [-0.006, -0.007], type: 'Government Building', id: 'p4' },
  { name: 'Anganwadi Centre',         delta: [0.010,  0.002],  type: 'Government Centre',   id: 'p5' },
];

export const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry',                                  stylers: [{ color: '#0e1017' }] },
  { elementType: 'labels.text.stroke',                        stylers: [{ color: '#090a0f' }] },
  { elementType: 'labels.text.fill',                          stylers: [{ color: '#9ca3af' }] },
  { featureType: 'road',          elementType: 'geometry',    stylers: [{ color: '#1e2130' }] },
  { featureType: 'road.highway',  elementType: 'geometry',    stylers: [{ color: '#2a2f45' }] },
  { featureType: 'road',          elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { featureType: 'water',         elementType: 'geometry',    stylers: [{ color: '#0a1628' }] },
  { featureType: 'water',         elementType: 'labels.text.fill', stylers: [{ color: '#4b5563' }] },
  { featureType: 'landscape',     elementType: 'geometry',    stylers: [{ color: '#111827' }] },
  { featureType: 'poi',           elementType: 'geometry',    stylers: [{ color: '#131b2a' }] },
  { featureType: 'poi',           elementType: 'labels',      stylers: [{ visibility: 'off' }] },
  { featureType: 'transit',       elementType: 'geometry',    stylers: [{ color: '#1a2035' }] },
  { featureType: 'administrative',elementType: 'geometry.stroke', stylers: [{ color: '#2d3748' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
];

// ── Weather Codes ─────────────────────────────────────────────────────────────
interface WeatherInfo {
  label: string;
  icon: string;
}

export const WEATHER_CODE_MAP: Record<number, WeatherInfo> = {
  0:  { label: 'Clear Sky',        icon: '☀️' },
  1:  { label: 'Mainly Clear',     icon: '🌤️' },
  2:  { label: 'Partly Cloudy',    icon: '⛅' },
  3:  { label: 'Overcast',         icon: '☁️' },
  45: { label: 'Foggy',            icon: '🌫️' },
  48: { label: 'Icy Fog',          icon: '🌫️' },
  51: { label: 'Light Drizzle',    icon: '🌦️' },
  53: { label: 'Drizzle',          icon: '🌦️' },
  55: { label: 'Heavy Drizzle',    icon: '🌧️' },
  61: { label: 'Light Rain',       icon: '🌧️' },
  63: { label: 'Rain',             icon: '🌧️' },
  65: { label: 'Heavy Rain',       icon: '🌧️' },
  71: { label: 'Light Snow',       icon: '🌨️' },
  73: { label: 'Snow',             icon: '❄️' },
  75: { label: 'Heavy Snow',       icon: '❄️' },
  80: { label: 'Rain Showers',     icon: '🌦️' },
  81: { label: 'Heavy Showers',    icon: '🌧️' },
  82: { label: 'Violent Showers',  icon: '⛈️' },
  95: { label: 'Thunderstorm',     icon: '⛈️' },
  96: { label: 'Hail Storm',       icon: '⛈️' },
  99: { label: 'Heavy Hail Storm', icon: '⛈️' },
};

// ── Quiz Config ───────────────────────────────────────────────────────────────
export const QUIZ_LETTERS: string[] = ['A', 'B', 'C', 'D'];
export const QUIZ_LEADERBOARD_LIMIT: number = 5;

export const QUIZ_MESSAGES: Record<string, string> = {
  perfect: 'Outstanding! You have a strong understanding of the election process.',
  great:   'Great job! Review the timeline section to strengthen any gaps.',
  keep:    'No worries — revisit the guide above and try again.',
};

export const QUIZ_TITLES: Record<string, string> = {
  perfect: 'Perfect Score!',
  great:   'Well Done!',
  keep:    'Keep Learning!',
};

// ── API Endpoints ─────────────────────────────────────────────────────────────
export const WEATHER_API_BASE: string = 'https://api.open-meteo.com/v1/forecast';
export const GEOCODE_API_BASE: string = 'https://nominatim.openstreetmap.org/reverse';

// ── Accessibility ─────────────────────────────────────────────────────────────
export const SKIP_LINK_TARGET: string = 'main-content';
export const INTERSECTION_THRESHOLD: number = 0.12;
export const SCROLL_DEBOUNCE_MS: number = 150;
export const SEARCH_DEBOUNCE_MS: number = 300;

// ── Local Storage Keys ────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  THEME:    'elected_theme',
  LANGUAGE: 'elected_language',
} as const;

// ── ARIA Labels ───────────────────────────────────────────────────────────────
export const ARIA_LABELS = {
  MAIN_NAV:     'Main navigation',
  SKIP_LINK:    'Skip to main content',
  CLOSE_MODAL:  'Close modal',
  LANGUAGE:     'Select language — powered by Google Translate',
  QUIZ_REGION:  'Election knowledge quiz',
  QUIZ_PROGRESS:'Quiz progress',
  POLL_MAP:     'Google Map showing polling stations',
} as const;
