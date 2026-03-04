import '../src/style.css';
import { trackEvent } from '../src/tracker.js';

// FIFA World Cup Top 4 — 2002–2022
const tournaments = [
  { year: 2002, host: 'South Korea / Japan', teams: ['Brazil', 'Germany', 'Turkey', 'South Korea'] },
  { year: 2006, host: 'Germany', teams: ['Italy', 'France', 'Germany', 'Portugal'] },
  { year: 2010, host: 'South Africa', teams: ['Spain', 'Netherlands', 'Germany', 'Uruguay'] },
  { year: 2014, host: 'Brazil', teams: ['Germany', 'Argentina', 'Netherlands', 'Brazil'] },
  { year: 2018, host: 'Russia', teams: ['France', 'Croatia', 'Belgium', 'England'] },
  { year: 2022, host: 'Qatar', teams: ['Argentina', 'France', 'Croatia', 'Morocco'] },
];

const TOTAL = tournaments.length * 4; // 24 answers
const TIMER_SECONDS = 300; // 5 minutes

let found = {}; // { "year-pos": true }
let foundCount = 0;
let timerInterval = null;
let secondsLeft = TIMER_SECONDS;
let started = false;
let finished = false;

// Aliases
const aliasMap = {
  'holland': 'Netherlands', 'the netherlands': 'Netherlands', 'nederland': 'Netherlands',
  'south korea': 'South Korea', 'korea': 'South Korea', 'korea republic': 'South Korea',
  'deutschland': 'Germany', 'alemania': 'Germany',
  'brasil': 'Brazil', 'bresil': 'Brazil',
  'italia': 'Italy', 'italie': 'Italy',
  'espana': 'Spain', 'españa': 'Spain',
  'turquie': 'Turkey', 'turkiye': 'Turkey', 'türkiye': 'Turkey',
  'belgique': 'Belgium', 'belgie': 'Belgium',
  'angleterre': 'England',
  'croatie': 'Croatia', 'hrvatska': 'Croatia',
  'maroc': 'Morocco', 'marruecos': 'Morocco',
};

const flags = {
  'Brazil': '🇧🇷', 'Germany': '🇩🇪', 'Turkey': '🇹🇷', 'South Korea': '🇰🇷',
  'Italy': '🇮🇹', 'France': '🇫🇷', 'Portugal': '🇵🇹', 'Spain': '🇪🇸',
  'Netherlands': '🇳🇱', 'Uruguay': '��🇾', 'Argentina': '🇦🇷',
  'Croatia': '🇭🇷', 'Belgium': '🇧🇪', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Morocco': '🇲🇦',
};

const posLabels = ['🥇 Winner', '🥈 Runner-up', '🥉 Third', '4th Place'];
const posClasses = ['wc-pos--gold', 'wc-pos--silver', 'wc-pos--bronze', 'wc-pos--fourth'];

// Build lookup: normalized name → [{year, pos}]
const lookup = {};
tournaments.forEach(t => {
  t.teams.forEach((team, pos) => {
    const key = team.toLowerCase();
    if (!lookup[key]) lookup[key] = [];
    lookup[key].push({ year: t.year, pos });
  });
});
// Add aliases
Object.entries(aliasMap).forEach(([alias, canonical]) => {
  const entries = lookup[canonical.toLowerCase()];
  if (entries && !lookup[alias]) lookup[alias] = entries;
});

const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
const fKey = (year, pos) => `${year}-${pos}`;

const render = () => {
  const app = document.getElementById('quiz-app');
  if (!app) return;

  app.innerHTML = `
    <nav class="navbar" id="navbar" aria-label="Main navigation">
      <div class="nav-brand">
        <a href="/" class="nav-logo" aria-label="Andrea Spiteri — Home"><span class="logo-a">A</span><span class="logo-s">S</span></a>
      </div>
      <div class="nav-links" id="nav-links" role="navigation">
        <a href="/quiz/">← Quiz Hub</a>
      </div>
    </nav>

    <section class="f1q-section">
      <div class="f1q-container">

        ${!started ? `
          <div class="f1q-intro">
            <div class="f1q-badge"><span>WORLD CUP QUIZ</span></div>
            <h1 class="f1q-title">FIFA WORLD CUP<br><span>TOP 4</span></h1>
            <p class="f1q-subtitle">Name the top 4 teams from every World Cup since 2002.<br>${TOTAL} answers · 6 tournaments · 5 minutes.</p>
            <button id="f1q-start" class="f1q-btn f1q-btn--primary">Start Quiz</button>
          </div>
        ` : ''}

        ${started ? `
          <div class="f1q-card">
            <div class="f1q-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> WORLD CUP TOP 4 · 2002–2022</div>

            ${!finished ? `
              <div class="f1q-toolbar">
                <div class="f1q-toolbar-left">
                  <input type="text" id="f1q-input" class="f1q-input" placeholder="Type a country name..." autocomplete="off" autocapitalize="none" spellcheck="false" />
                </div>
                <div class="f1q-toolbar-right">
                  <span class="f1q-stat-label">SCORE</span>
                  <span class="f1q-stat-value" id="f1q-score">${foundCount} / ${TOTAL}</span>
                  <span class="f1q-stat-label">TIME</span>
                  <span class="f1q-stat-value f1q-timer" id="f1q-timer">${formatTime(secondsLeft)}</span>
                  <button class="f1q-btn f1q-btn--ghost" id="f1q-giveup">Give Up</button>
                </div>
              </div>
            ` : `
              <div class="f1q-result">
                <div class="f1q-result-score">${foundCount} / ${TOTAL}</div>
                <div class="f1q-result-label">${foundCount === TOTAL ? 'PERFECT SCORE! 🏆' : foundCount > 18 ? 'INCREDIBLE!' : foundCount > 12 ? 'GREAT JOB!' : foundCount > 6 ? 'NOT BAD!' : 'KEEP PRACTICING!'}</div>
                <button id="f1q-restart" class="f1q-btn f1q-btn--primary" style="margin-top:16px">Play Again</button>
              </div>
            `}

            <div class="wc-table">
              <div class="wc-table-header">
                <div class="wc-table-year-col">Year</div>
                ${posLabels.map(l => `<div class="wc-table-pos-col">${l}</div>`).join('')}
              </div>
              ${tournaments.map(t => `
                <div class="wc-table-row">
                  <div class="wc-table-year-col">
                    <span class="wc-table-year">${t.year}</span>
                    <span class="wc-table-host">${t.host}</span>
                  </div>
                  ${t.teams.map((team, pos) => {
                    const key = fKey(t.year, pos);
                    const isFound = found[key];
                    const show = isFound || finished;
                    return `<div class="wc-table-cell ${show ? posClasses[pos] : ''} ${finished && !isFound ? 'wc-cell--missed' : ''}">
                      ${show ? `<span class="wc-table-flag">${flags[team] || ''}</span><span class="wc-table-name">${team}</span>` : '<span class="wc-table-blank">?</span>'}
                    </div>`;
                  }).join('')}
                </div>
              `).join('')}
            </div>

            <div class="f1q-progress">
              <div class="f1q-progress-fill" style="width:${(foundCount/TOTAL)*100}%"></div>
            </div>
          </div>
        ` : ''}

      </div>
    </section>

    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links"><a href="/quiz/">← Back to Quiz Hub</a></div>
        <p class="footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>
  `;

  document.getElementById('f1q-start')?.addEventListener('click', startQuiz);
  document.getElementById('f1q-restart')?.addEventListener('click', restartQuiz);
  document.getElementById('f1q-giveup')?.addEventListener('click', giveUp);

  const input = document.getElementById('f1q-input');
  if (input && started && !finished) {
    input.addEventListener('input', onInput);
    input.focus();
  }
};

const giveUp = () => { finished = true; clearInterval(timerInterval); render(); };

const startQuiz = () => {
  found = {};
  foundCount = 0;
  secondsLeft = TIMER_SECONDS;
  started = true;
  finished = false;
  render();
  timerInterval = setInterval(() => {
    secondsLeft--;
    const el = document.getElementById('f1q-timer');
    if (el) {
      el.textContent = formatTime(secondsLeft);
      if (secondsLeft <= 30) el.classList.add('f1q-timer--danger');
    }
    if (secondsLeft <= 0) {
      finished = true;
      clearInterval(timerInterval);
      render();
    }
  }, 1000);
};

const restartQuiz = () => { clearInterval(timerInterval); startQuiz(); };

const onInput = (e) => {
  const val = e.target.value.trim().toLowerCase();
  if (val.length < 3) return;

  // Check direct or alias
  const check = lookup[val] || lookup[aliasMap[val]?.toLowerCase()];
  if (check) {
    let newFound = false;
    check.forEach(({ year, pos }) => {
      const key = fKey(year, pos);
      if (!found[key]) { found[key] = true; foundCount++; newFound = true; }
    });
    if (newFound) {
      e.target.value = '';
      if (foundCount === TOTAL) {
        finished = true;
        clearInterval(timerInterval);
      }
      render();
    }
  }
};

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

render();
trackEvent('pageview');
