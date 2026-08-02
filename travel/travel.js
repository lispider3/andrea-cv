import '../src/style.css';
import { trackEvent } from '../src/tracker.js';
import { initNavScroll } from '../src/shared.js';

const GALLERIES = {
  beach: {
    label: 'BEACHES',
    icon: '<path d="M2 22h20"/><path d="M8.5 22v-9.5a4.5 4.5 0 0 1 9 0V22"/><path d="M12 4v3"/><path d="m9 6 3-2 3 2"/>',
    photos: [
      { src: '/travel/beach-1.jpg', alt: 'Clear turquoise water along a quiet Halkidiki beach' },
      { src: '/travel/beach-2.png', alt: 'Aerial view of a sandy spit stretching into the sea' },
      { src: '/travel/beach-3.jpg', alt: 'A quiet cove beach backed by pine trees' },
      { src: '/travel/beach-4.jpg', alt: 'Family time on the beach in Halkidiki' },
    ],
  },
  food: {
    label: 'LOCAL FOOD',
    icon: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M17 2a5 5 0 0 0-5 5v6h5"/><path d="M17 13v9"/>',
    photos: [
      { src: '/travel/food-1.jpg', alt: 'Fresh seafood pasta and mussels on the table' },
      { src: '/travel/food-2.webp', alt: 'A spread of Greek dishes — tzatziki, salad, and grilled meat' },
      { src: '/travel/food-3.webp', alt: 'Gyros and fries, a Greek fast-food favourite' },
      { src: '/travel/food-4.jpg', alt: 'Lunch by the sea with friends' },
    ],
  },
  coffee: {
    label: 'GREEK COFFEE',
    icon: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 0 1 0 8h-1"/><path d="M6 19h12"/>',
    photos: [
      { src: '/travel/coffee-1.jpg', alt: 'Iced Greek coffee by the harbour' },
      { src: '/travel/coffee-2.jpg', alt: 'Iced coffee overlooking the Aegean' },
      { src: '/travel/coffee-3.webp', alt: 'Coffee break at a local café' },
      { src: '/travel/coffee-4.jpg', alt: 'A relaxed coffee stop in a Halkidiki village' },
    ],
  },
};

const renderCarousel = (key) => {
  const g = GALLERIES[key];
  return `
    <div class="fb-card">
      <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${g.icon}</svg> ${g.label}</div>
      <div class="travel-carousel" data-carousel>
        <div class="travel-carousel-track">
          ${g.photos.map((p, i) => `
            <div class="travel-carousel-slide ${i === 0 ? 'active' : ''}">
              <img src="${p.src}" alt="${p.alt}" loading="lazy">
            </div>
          `).join('')}
        </div>
        <div class="travel-carousel-dots">
          ${g.photos.map((_, i) => `<button class="travel-carousel-dot ${i === 0 ? 'active' : ''}" aria-label="Show photo ${i + 1}"></button>`).join('')}
        </div>
      </div>
    </div>
  `;
};

const initCarousels = () => {
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('.travel-carousel-slide')];
    const dots = [...carousel.querySelectorAll('.travel-carousel-dot')];
    if (slides.length < 2) return;
    let current = 0;
    let timer;

    const goTo = (i) => {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = i;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    };

    const startAuto = () => { timer = setInterval(() => goTo((current + 1) % slides.length), 4500); };
    const stopAuto = () => clearInterval(timer);

    dots.forEach((dot, i) => dot.addEventListener('click', () => {
      goTo(i);
      stopAuto();
      startAuto();
    }));

    startAuto();
  });
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
          <p class="travel-text">Halkidiki is a peninsula in Northern Greece that splits into three smaller "legs" — Kassandra, Sithonia, and Mount Athos — reaching out into the Aegean Sea. Kassandra, the westernmost leg, is where we spend most of our time — it's where I go to slow down: long lunches by the water, quiet beaches, and strong Greek coffee.</p>
          <div class="travel-map-wrap">
            <iframe
              src="https://www.google.com/maps?q=Kassandra,+Chalkidiki,+Greece&output=embed"
              width="100%" height="320" style="border:0;" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Map showing Kassandra, Halkidiki"></iframe>
          </div>
        </div>

        ${renderCarousel('beach')}
        ${renderCarousel('food')}
        ${renderCarousel('coffee')}
      </div>
    </section>

    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links"><a href="/">← Back to Portfolio</a></div>
        <p class="footer-copy">&copy; ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>
  `;

  initCarousels();
};

initNavScroll();
render();
trackEvent('pageview', { page: 'travel' });
