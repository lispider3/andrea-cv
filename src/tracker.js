// Lightweight analytics tracker — ~30 lines, non-blocking
// Self-excludes when localStorage._exclude is set

const ENDPOINT = '/api/track';
const isExcluded = () => { try { return localStorage.getItem('_exclude') === '1'; } catch { return false; } };

export function excludeMe() {
  try { localStorage.setItem('_exclude', '1'); } catch {}
}

export function trackEvent(name, data = {}) {
  if (isExcluded()) return;
  const payload = {
    e: name,
    p: location.pathname,
    r: document.referrer || '',
    t: Date.now(),
    ...data,
  };
  try {
    navigator.sendBeacon(ENDPOINT, JSON.stringify(payload));
  } catch {
    // Silently fail — analytics should never break the site
  }
}

// Auto-track pageview on import
if (!isExcluded()) {
  // Slight delay so it doesn't compete with critical resources
  setTimeout(() => trackEvent('pageview'), 100);
}
