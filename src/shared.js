// ── Shared Utilities ──
// Common helpers used across quiz and dashboard pages.
// Centralised here to avoid duplication.

/**
 * Render a flag image from an ISO 3166-1 alpha-2 code.
 * @param {string} iso  Two-letter country code (e.g. 'gb', 'it')
 * @returns {string}    HTML img tag, or empty string if iso is falsy
 */
export const flagImg = (iso) =>
    iso
        ? `<img src="https://flagcdn.com/w20/${iso}.png" alt="" width="20" height="15" class="quiz-flag" loading="lazy">`
        : '';

/**
 * Map of nationality strings (from Ergast API) → ISO codes.
 * Used by the F1 dashboard and F1 preview.
 */
export const NATIONALITY_TO_ISO = {
    'Dutch': 'nl', 'British': 'gb', 'Monegasque': 'mc', 'Spanish': 'es',
    'Australian': 'au', 'German': 'de', 'Finnish': 'fi', 'Canadian': 'ca',
    'Mexican': 'mx', 'French': 'fr', 'Japanese': 'jp', 'Thai': 'th',
    'Danish': 'dk', 'Chinese': 'cn', 'American': 'us', 'Italian': 'it',
    'Brazilian': 'br', 'New Zealander': 'nz', 'Argentine': 'ar',
    'Swiss': 'ch', 'Austrian': 'at', 'Swedish': 'se', 'Belgian': 'be',
    'Polish': 'pl', 'Russian': 'ru', 'Indian': 'in', 'Indonesian': 'id',
};

/**
 * Render a flag image from a nationality string (e.g. 'British').
 * @param {string} nationality  Nationality string from the Ergast API
 * @returns {string}            HTML img tag, or empty string
 */
export const natFlagImg = (nationality) => flagImg(NATIONALITY_TO_ISO[nationality]);

/**
 * Format seconds into mm:ss display string.
 * @param {number} s  Total seconds
 * @returns {string}  Formatted time (e.g. '05:00', '14:32')
 */
export const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

/**
 * Initialise the navbar scroll-toggle behaviour.
 * Adds a passive scroll listener that toggles the 'scrolled' class
 * on the #navbar element when the page scrolls past 40px.
 */
export const initNavScroll = () => {
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
};
