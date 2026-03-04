import '../src/style.css';
import { trackEvent } from '../src/tracker.js';

const quizzes = [
  { id: 'f1', title: 'Formula 1', sub: 'How well do you know the fastest sport on earth?', href: '/f1-quiz/', tag: 'QUIZ 1', topic: 'f1', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>' },
  { id: 'football', title: 'Juventus Goalscorers', sub: 'Name every Serie A top scorer since 1992.', href: '/football/', tag: 'QUIZ 2', topic: 'football', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>' },
  { id: 'capitals', title: 'World Capitals', sub: 'Can you name every capital city?', href: '/capitals/', tag: 'QUIZ 3', topic: 'travel', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' },
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

    <section class="sb-hero sb-hero--centered">
      <div class="sb-container">
        <span class="sb-tag">INTERACTIVE</span>
        <h1 class="sb-hero-title">Quiz<br><span>Hub</span></h1>
        <p class="sb-hero-sub">Test your knowledge across three topics. No sign-ups, just fun.</p>
      </div>
    </section>

    <section class="sb-section">
      <div class="sb-container">
        <div class="sb-lesson-grid">
          ${quizzes.map(q => `
            <a href="${q.href}" class="sb-lesson-card" style="text-decoration:none;color:inherit">
              <div class="sb-lesson-icon">${q.icon}</div>
              <span class="sb-lesson-tag">${q.tag}</span>
              <h3 class="sb-lesson-title">${q.title}</h3>
              <p class="sb-lesson-sub">${q.sub}</p>
              <span class="sb-quiz-topic sb-quiz-topic--${q.topic}">${q.topic === 'f1' ? '🏎️ F1' : q.topic === 'football' ? '⚽ Football' : '✈️ Travel'}</span>
              <span class="sb-lesson-cta">Start Quiz <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
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
