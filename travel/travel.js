import '../src/style.css';
import { trackEvent } from '../src/tracker.js';
import { initNavScroll } from '../src/shared.js';

// Photos are dropped in as they're supplied — see public/travel/*.jpg.
// Each slot renders a real <img> once PHOTOS[slot] is set to a path that exists.
const PHOTOS = {
  beach: { src: '/travel/beach.jpg', alt: 'Beach in Halkidiki', label: 'Beaches' },
  food: { src: '/travel/food.jpg', alt: 'Local Greek food in Halkidiki', label: 'Local Food' },
  coffee: { src: '/travel/coffee.jpg', alt: 'Greek coffee in Halkidiki', label: 'Greek Coffee' },
  coast: { src: '/travel/coast.jpg', alt: 'Halkidiki coastline', label: 'Coastline' },
};

const PLACEHOLDER_ICONS = {
  beach: '<path d="M2 22h20"/><path d="M8.5 22v-9.5a4.5 4.5 0 0 1 9 0V22"/><path d="M12 4v3"/><path d="m9 6 3-2 3 2"/>',
  food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M17 2a5 5 0 0 0-5 5v6h5"/><path d="M17 13v9"/>',
  coffee: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 0 1 0 8h-1"/><path d="M6 19h12"/>',
  coast: '<path d="M2 12h20"/><path d="M5 12a7 7 0 0 1 14 0"/><path d="M2 20h20"/><path d="M4 16h16"/>',
};

const renderPhoto = (slot) => {
  const p = PHOTOS[slot];
  return `
    <div class="travel-photo">
      <img src="${p.src}" alt="${p.alt}" loading="lazy" onerror="this.closest('.travel-photo').classList.add('travel-photo--empty')">
      <div class="travel-photo-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${PLACEHOLDER_ICONS[slot]}</svg>
      </div>
      <div class="travel-photo-label">${p.label}</div>
    </div>
  `;
};

const render = () => {
  const app = document.getElementById('travel-app');
  if (!app) return;

  app.innerHTML = `
    <section class="fb-section">
      <div class="fb-container">
        <div class="fb-card f1-hero">
          <div class="f1-hero-badge">TRAVEL</div>
          <h1 class="f1-hero-title">Malta <span>& Halkidiki</span></h1>
          <p class="f1-hero-subtitle">When I'm not home in Malta, you'll find me in Halkidiki, Greece — my second home.</p>
        </div>

        <div class="fb-card">
          <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg> WHERE IS HALKIDIKI</div>
          <p class="travel-text">Halkidiki is a peninsula in Northern Greece that splits into three smaller "legs" — Kassandra, Sithonia, and Mount Athos — reaching out into the Aegean Sea. It's where I go to slow down: long lunches by the water, quiet beaches, and strong Greek coffee.</p>
          <div class="travel-map-wrap">
            <iframe
              src="https://www.google.com/maps?q=Halkidiki,Greece&output=embed"
              width="100%" height="320" style="border:0;" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Map showing Halkidiki, Greece"></iframe>
          </div>
        </div>

        <div class="fb-card">
          <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> HALKIDIKI IN PICTURES</div>
          <div class="travel-photo-grid">
            ${renderPhoto('beach')}
            ${renderPhoto('food')}
            ${renderPhoto('coffee')}
            ${renderPhoto('coast')}
          </div>
        </div>
      </div>
    </section>

    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links"><a href="/">← Back to Portfolio</a></div>
        <p class="footer-copy">&copy; ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>
  `;
};

initNavScroll();
render();
trackEvent('pageview', { page: 'travel' });
