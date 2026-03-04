import '../src/style.css';
import { trackEvent } from '../src/tracker.js';

// ── F1 World Champions 1950–2025 ──
const champions = [
  { year: 1950, driver: "Nino Farina", team: "Alfa Romeo" },
  { year: 1951, driver: "Juan Manuel Fangio", team: "Alfa Romeo" },
  { year: 1952, driver: "Alberto Ascari", team: "Ferrari" },
  { year: 1953, driver: "Alberto Ascari", team: "Ferrari" },
  { year: 1954, driver: "Juan Manuel Fangio", team: "Maserati/Mercedes" },
  { year: 1955, driver: "Juan Manuel Fangio", team: "Mercedes" },
  { year: 1956, driver: "Juan Manuel Fangio", team: "Ferrari" },
  { year: 1957, driver: "Juan Manuel Fangio", team: "Maserati" },
  { year: 1958, driver: "Mike Hawthorn", team: "Ferrari" },
  { year: 1959, driver: "Jack Brabham", team: "Cooper" },
  { year: 1960, driver: "Jack Brabham", team: "Cooper" },
  { year: 1961, driver: "Phil Hill", team: "Ferrari" },
  { year: 1962, driver: "Graham Hill", team: "BRM" },
  { year: 1963, driver: "Jim Clark", team: "Lotus" },
  { year: 1964, driver: "John Surtees", team: "Ferrari" },
  { year: 1965, driver: "Jim Clark", team: "Lotus" },
  { year: 1966, driver: "Jack Brabham", team: "Brabham" },
  { year: 1967, driver: "Denny Hulme", team: "Brabham" },
  { year: 1968, driver: "Graham Hill", team: "Lotus" },
  { year: 1969, driver: "Jackie Stewart", team: "Matra" },
  { year: 1970, driver: "Jochen Rindt", team: "Lotus" },
  { year: 1971, driver: "Jackie Stewart", team: "Tyrrell" },
  { year: 1972, driver: "Emerson Fittipaldi", team: "Lotus" },
  { year: 1973, driver: "Jackie Stewart", team: "Tyrrell" },
  { year: 1974, driver: "Emerson Fittipaldi", team: "McLaren" },
  { year: 1975, driver: "Niki Lauda", team: "Ferrari" },
  { year: 1976, driver: "James Hunt", team: "McLaren" },
  { year: 1977, driver: "Niki Lauda", team: "Ferrari" },
  { year: 1978, driver: "Mario Andretti", team: "Lotus" },
  { year: 1979, driver: "Jody Scheckter", team: "Ferrari" },
  { year: 1980, driver: "Alan Jones", team: "Williams" },
  { year: 1981, driver: "Nelson Piquet", team: "Brabham" },
  { year: 1982, driver: "Keke Rosberg", team: "Williams" },
  { year: 1983, driver: "Nelson Piquet", team: "Brabham" },
  { year: 1984, driver: "Niki Lauda", team: "McLaren" },
  { year: 1985, driver: "Alain Prost", team: "McLaren" },
  { year: 1986, driver: "Alain Prost", team: "McLaren" },
  { year: 1987, driver: "Nelson Piquet", team: "Williams" },
  { year: 1988, driver: "Ayrton Senna", team: "McLaren" },
  { year: 1989, driver: "Alain Prost", team: "McLaren" },
  { year: 1990, driver: "Ayrton Senna", team: "McLaren" },
  { year: 1991, driver: "Ayrton Senna", team: "McLaren" },
  { year: 1992, driver: "Nigel Mansell", team: "Williams" },
  { year: 1993, driver: "Alain Prost", team: "Williams" },
  { year: 1994, driver: "Michael Schumacher", team: "Benetton" },
  { year: 1995, driver: "Michael Schumacher", team: "Benetton" },
  { year: 1996, driver: "Damon Hill", team: "Williams" },
  { year: 1997, driver: "Jacques Villeneuve", team: "Williams" },
  { year: 1998, driver: "Mika Häkkinen", team: "McLaren" },
  { year: 1999, driver: "Mika Häkkinen", team: "McLaren" },
  { year: 2000, driver: "Michael Schumacher", team: "Ferrari" },
  { year: 2001, driver: "Michael Schumacher", team: "Ferrari" },
  { year: 2002, driver: "Michael Schumacher", team: "Ferrari" },
  { year: 2003, driver: "Michael Schumacher", team: "Ferrari" },
  { year: 2004, driver: "Michael Schumacher", team: "Ferrari" },
  { year: 2005, driver: "Fernando Alonso", team: "Renault" },
  { year: 2006, driver: "Fernando Alonso", team: "Renault" },
  { year: 2007, driver: "Kimi Räikkönen", team: "Ferrari" },
  { year: 2008, driver: "Lewis Hamilton", team: "McLaren" },
  { year: 2009, driver: "Jenson Button", team: "Brawn" },
  { year: 2010, driver: "Sebastian Vettel", team: "Red Bull" },
  { year: 2011, driver: "Sebastian Vettel", team: "Red Bull" },
  { year: 2012, driver: "Sebastian Vettel", team: "Red Bull" },
  { year: 2013, driver: "Sebastian Vettel", team: "Red Bull" },
  { year: 2014, driver: "Lewis Hamilton", team: "Mercedes" },
  { year: 2015, driver: "Lewis Hamilton", team: "Mercedes" },
  { year: 2016, driver: "Nico Rosberg", team: "Mercedes" },
  { year: 2017, driver: "Lewis Hamilton", team: "Mercedes" },
  { year: 2018, driver: "Lewis Hamilton", team: "Mercedes" },
  { year: 2019, driver: "Lewis Hamilton", team: "Mercedes" },
  { year: 2020, driver: "Lewis Hamilton", team: "Mercedes" },
  { year: 2021, driver: "Max Verstappen", team: "Red Bull" },
  { year: 2022, driver: "Max Verstappen", team: "Red Bull" },
  { year: 2023, driver: "Max Verstappen", team: "Red Bull" },
  { year: 2024, driver: "Max Verstappen", team: "Red Bull" },
  { year: 2025, driver: "Lando Norris", team: "McLaren" },
];

const TOTAL = champions.length;
const TIMER_SECONDS = 600;

let found = new Set();
let timerInterval = null;
let secondsLeft = TIMER_SECONDS;
let started = false;
let finished = false;

const getLastName = (fullName) => {
  const parts = fullName.split(' ');
  return parts[parts.length - 1].toLowerCase();
};

// Build lookup: last name → list of year indices
const lookup = {};
champions.forEach((c, i) => {
  const lastName = getLastName(c.driver);
  if (!lookup[lastName]) lookup[lastName] = [];
  lookup[lastName].push(i);
  const clean = lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (clean !== lastName) {
    if (!lookup[clean]) lookup[clean] = [];
    lookup[clean].push(i);
  }
});

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

// Group champions by decade for the grid
const decades = [];
for (let d = 1950; d <= 2020; d += 10) {
  const end = Math.min(d + 9, 2025);
  const items = champions.filter(c => c.year >= d && c.year <= end);
  if (items.length) decades.push({ label: `${d}s`, start: d, items });
}

const render = () => {
  const app = document.getElementById('quiz-app');
  if (!app) return;

  app.innerHTML = `
    <section class="f1q-section">
      <div class="f1q-container">

        ${!started ? `
          <div class="f1q-intro">
            <div class="f1q-badge"><span>CHAMPIONS QUIZ</span></div>
            <h1 class="f1q-title">NAME THE F1<br><span>WORLD CHAMPIONS</span></h1>
            <p class="f1q-subtitle">Type any part of a champion's last name — every title they won is revealed at once.<br>${TOTAL} titles · 1950–2025 · 10 minutes.</p>
            <button id="f1q-start" class="f1q-btn f1q-btn--primary">Start Quiz</button>
          </div>
        ` : ''}

        ${started ? `
          <div class="f1q-card">
            <div class="f1q-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> F1 WORLD CHAMPIONS · 1950–2025</div>

            ${!finished ? `
              <div class="f1q-toolbar">
                <div class="f1q-toolbar-left">
                  <input type="text" id="f1q-input" class="f1q-input" placeholder="Type a driver's last name..." autocomplete="off" autocapitalize="none" spellcheck="false" />
                </div>
                <div class="f1q-toolbar-right">
                  <span class="f1q-stat-label">SCORE</span>
                  <span class="f1q-stat-value" id="f1q-score">${found.size} / ${TOTAL}</span>
                  <span class="f1q-stat-label">TIME</span>
                  <span class="f1q-stat-value f1q-timer" id="f1q-timer">${formatTime(secondsLeft)}</span>
                  <button class="f1q-btn f1q-btn--ghost" id="f1q-giveup">Give Up</button>
                </div>
              </div>
            ` : `
              <div class="f1q-result">
                <div class="f1q-result-score">${found.size} / ${TOTAL}</div>
                <div class="f1q-result-label">${found.size === TOTAL ? 'PERFECT SCORE!' : found.size > 60 ? 'INCREDIBLE!' : found.size > 40 ? 'GREAT JOB!' : found.size > 20 ? 'NOT BAD!' : 'KEEP PRACTICING!'}</div>
                <button id="f1q-restart" class="f1q-btn f1q-btn--primary" style="margin-top:16px">Play Again</button>
              </div>
            `}

            <div class="f1q-grid">
              ${champions.map((c, i) => `
                <div class="f1q-cell ${found.has(i) ? 'f1q-cell--found' : ''} ${finished && !found.has(i) ? 'f1q-cell--missed' : ''}">
                  <span class="f1q-cell-year">${c.year}</span>
                  <span class="f1q-cell-name">${found.has(i) || finished ? c.driver.split(' ').pop().toUpperCase() : ''}</span>
                </div>
              `).join('')}
            </div>

            <div class="f1q-progress">
              <div class="f1q-progress-fill" style="width:${(found.size/TOTAL)*100}%"></div>
            </div>
          </div>
        ` : ''}

      </div>
    </section>

    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links"><a href="/">← Back to Portfolio</a></div>
        <p class="footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>
  `;

  // Bind events
  document.getElementById('f1q-start')?.addEventListener('click', startQuiz);
  document.getElementById('f1q-restart')?.addEventListener('click', restartQuiz);
  document.getElementById('f1q-giveup')?.addEventListener('click', giveUp);

  const input = document.getElementById('f1q-input');
  if (input && started && !finished) {
    input.addEventListener('input', onInput);
    input.focus();
  }
};

const giveUp = () => { clearInterval(timerInterval); finished = true; trackEvent('quiz_complete', { quiz: 'f1', score: `${found.size}/${TOTAL}` }); render(); };
const startQuiz = () => {
  started = true; secondsLeft = TIMER_SECONDS; found = new Set(); finished = false;
  trackEvent('quiz_start', { quiz: 'f1' });
  render();
  timerInterval = setInterval(() => {
    secondsLeft--;
    const el = document.getElementById('f1q-timer');
    if (el) {
      el.textContent = formatTime(secondsLeft);
      if (secondsLeft <= 60) el.classList.add('f1q-timer--danger');
    }
    if (secondsLeft <= 0) { clearInterval(timerInterval); finished = true; render(); }
  }, 1000);
};
const restartQuiz = () => { clearInterval(timerInterval); found = new Set(); started = false; finished = false; secondsLeft = TIMER_SECONDS; render(); };

const onInput = (e) => {
  const val = e.target.value.trim().toLowerCase();
  if (val.length < 2) return;
  const matches = lookup[val];
  if (matches && matches.length > 0) {
    let newFound = false;
    matches.forEach(i => { if (!found.has(i)) { found.add(i); newFound = true; } });
    if (newFound) {
      e.target.value = '';
      document.getElementById('f1q-score').textContent = `${found.size} / ${TOTAL}`;
      // Update progress bar
      const fill = document.querySelector('.f1q-progress-fill');
      if (fill) fill.style.width = `${(found.size/TOTAL)*100}%`;
      matches.forEach(i => {
        const cells = document.querySelectorAll('.f1q-cell');
        const cell = cells[i];
        if (cell) {
          cell.classList.add('f1q-cell--found');
          cell.querySelector('.f1q-cell-name').textContent = champions[i].driver.split(' ').pop().toUpperCase();
        }
      });
      if (found.size === TOTAL) { clearInterval(timerInterval); finished = true; render(); }
    }
  }
};

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

render();
