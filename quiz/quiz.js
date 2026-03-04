import '../src/style.css';
import { trackEvent } from '../src/tracker.js';

const quizzes = [
  { id: 'f1', title: 'Formula 1', sub: 'How well do you know the fastest sport on earth?', href: '/f1-quiz/', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>' },
  { id: 'football', title: 'Football', sub: 'Test your knowledge of the beautiful game.', href: '/football/', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>' },
  { id: 'capitals', title: 'World Capitals', sub: 'Can you name every capital city?', href: '/capitals/', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' },
];

function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <nav class="navbar" id="navbar" aria-label="Main navigation">
      <div class="nav-brand">
        <a href="/" class="nav-logo" aria-label="Andrea Spiteri — Home"><span class="logo-a">A</span><span class="logo-s">S</span></a>
      </div>
      <div class="nav-links" id="nav-links" role="navigation">
        <a href="/">Portfolio</a>
      </div>
    </nav>

    <section class="sb-section" style="padding-top:120px;text-align:center">
      <div class="sb-container">
        <span class="sb-section-tag">INTERACTIVE</span>
        <h1 class="hero-title" style="font-size:clamp(2rem,5vw,3.5rem)">Quiz Hub</h1>
        <p class="sb-section-sub" style="margin-top:8px">Test your knowledge across three topics. No sign-ups, no timers, just fun.</p>
      </div>
    </section>

    <section class="sb-section">
      <div class="sb-container">
        <div class="sb-picker-grid">
          ${quizzes.map(q => `
            <a href="${q.href}" class="sb-picker-card" style="text-decoration:none">
              <div class="sb-picker-icon">${q.icon}</div>
              <span class="sb-picker-tag" style="font-size:0.5rem;letter-spacing:2px;color:var(--text-muted);font-family:var(--font-mono);text-transform:uppercase">QUIZ</span>
              <h3 class="sb-picker-title">${q.title}</h3>
              <p class="sb-picker-sub">${q.sub}</p>
              <span class="sb-picker-cta">START QUIZ <span style="margin-left:4px">›</span></span>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

render();
trackEvent('pageview');
