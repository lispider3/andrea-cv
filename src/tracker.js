// Lightweight analytics tracker — ~30 lines, non-blocking
// Self-excludes when localStorage._exclude is set

const ENDPOINT = '/api/track';
const isExcluded = () => { try { return localStorage.getItem('_exclude') === '1'; } catch { return false; } };

export function excludeMe() {
  try { localStorage.setItem('_exclude', '1'); } catch {}
}

export function trackEvent(name, data = {}) {
  if (isExcluded()) return;
  // Lightweight fingerprint (no cookies, no external libs)
  const fp = [
    screen.width + 'x' + screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    navigator.language || '',
    navigator.platform || '',
    navigator.hardwareConcurrency || '',
  ].join('|');

  const payload = {
    e: name,
    p: location.pathname,
    r: document.referrer || '',
    t: Date.now(),
    ua: navigator.userAgent || '',
    fp,
    ...data,
  };
  try {
    navigator.sendBeacon(ENDPOINT, JSON.stringify(payload));
  } catch {
    // Silently fail — analytics should never break the site
  }
}

// Auto-track pageview on import
const _sessionStart = Date.now();
if (!isExcluded()) {
  setTimeout(() => trackEvent('pageview'), 100);

  // Send session duration when visitor leaves
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const dur = Math.round((Date.now() - _sessionStart) / 1000);
      if (dur > 1) trackEvent('session_end', { dur });
    }
  });
}
