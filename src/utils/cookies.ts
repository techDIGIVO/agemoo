/**
 * Cookie utility functions for setting, getting, and managing browser cookies.
 * These implement real cookie tracking for analytics, preferences, and sessions.
 */

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preference: boolean;
  timestamp: string;
}

// --- Low-level cookie helpers ---

export function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

// --- Consent management ---

const CONSENT_KEY = 'agemoo_cookie_consent';

export function getConsent(): CookieConsent | null {
  const raw = getCookie(CONSENT_KEY);
  if (!raw) {
    // Fallback: check localStorage (from existing Cookies page)
    try {
      const ls = localStorage.getItem('cookieConsent');
      if (ls) return JSON.parse(ls) as CookieConsent;
    } catch { /* ignore */ }
    return null;
  }
  try {
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

export function saveConsent(consent: CookieConsent) {
  const payload = JSON.stringify(consent);
  // Store in a cookie (persists 365 days)
  setCookie(CONSENT_KEY, payload, 365);
  // Also mirror to localStorage for the Cookies settings page
  localStorage.setItem('cookieConsent', payload);
}

export function hasConsentBeenGiven(): boolean {
  return getConsent() !== null;
}

// --- Real tracking cookies ---

/** Generate or retrieve a persistent session/visitor ID */
function getOrCreateVisitorId(): string {
  const existing = getCookie('agemoo_vid');
  if (existing) return existing;
  const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
  setCookie('agemoo_vid', id, 365);
  return id;
}

/** Set a session cookie that expires when the browser closes */
function setSessionCookie() {
  if (!getCookie('agemoo_sid')) {
    const sid = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
    // Session cookie — no expires/max-age means it disappears when browser closes
    document.cookie = `agemoo_sid=${sid}; path=/; SameSite=Lax`;
  }
}

/** Track a page view (stored as a cookie for recency, and logged to console in dev) */
function trackPageView() {
  setCookie('agemoo_last_page', window.location.pathname, 1);
  setCookie('agemoo_last_visit', new Date().toISOString(), 30);

  // Increment page view count
  const views = parseInt(getCookie('agemoo_page_views') || '0', 10) + 1;
  setCookie('agemoo_page_views', String(views), 30);
}

/** Store user preference cookies (theme, language, etc.) */
function setPreferenceCookies() {
  // Language preference from localStorage
  const lang = localStorage.getItem('preferredLanguage');
  if (lang) setCookie('agemoo_lang', lang, 365);

  // Theme preference
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  setCookie('agemoo_theme', theme, 365);
}

/**
 * Apply cookies based on the current consent.
 * Call this after consent is given or on app load when consent already exists.
 */
export function applyCookies(consent: CookieConsent) {
  // Essential cookies are always set
  setSessionCookie();

  if (consent.analytics) {
    getOrCreateVisitorId();
    trackPageView();
  }

  if (consent.preference) {
    setPreferenceCookies();
  }

  // Marketing cookies would integrate with third-party ad pixels.
  // Currently a placeholder — no third-party scripts are injected.
  if (consent.marketing) {
    setCookie('agemoo_marketing_ok', 'true', 365);
  } else {
    deleteCookie('agemoo_marketing_ok');
  }
}

/**
 * Remove all non-essential cookies (called when user rejects).
 */
export function removeNonEssentialCookies() {
  deleteCookie('agemoo_vid');
  deleteCookie('agemoo_last_page');
  deleteCookie('agemoo_last_visit');
  deleteCookie('agemoo_page_views');
  deleteCookie('agemoo_lang');
  deleteCookie('agemoo_theme');
  deleteCookie('agemoo_marketing_ok');
}
