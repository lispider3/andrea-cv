import '../src/style.css';
import { trackEvent } from '../src/tracker.js';
import { flagImg, formatTime, initNavScroll } from '../src/shared.js';

// ── Ferrari F1 Drivers 2000–2024 ──
// Each entry: [year, driver, country_iso2]
const FERRARI_DRIVERS = [
  [2000, 'Michael Schumacher', 'de'],
  [2000, 'Rubens Barrichello', 'br'],
  [2001, 'Michael Schumacher', 'de'],
  [2001, 'Rubens Barrichello', 'br'],
  [2002, 'Michael Schumacher', 'de'],
  [2002, 'Rubens Barrichello', 'br'],
  [2003, 'Michael Schumacher', 'de'],
  [2003, 'Rubens Barrichello', 'br'],
  [2004, 'Michael Schumacher', 'de'],
  [2004, 'Rubens Barrichello', 'br'],
  [2005, 'Michael Schumacher', 'de'],
  [2005, 'Rubens Barrichello', 'br'],
  [2006, 'Michael Schumacher', 'de'],
  [2006, 'Felipe Massa', 'br'],
  [2007, 'Kimi Räikkönen', 'fi'],
  [2007, 'Felipe Massa', 'br'],
  [2008, 'Kimi Räikkönen', 'fi'],
  [2008, 'Felipe Massa', 'br'],
  [2009, 'Kimi Räikkönen', 'fi'],
  [2009, 'Felipe Massa', 'br'],
  [2009, 'Luca Badoer', 'it'],
  [2009, 'Giancarlo Fisichella', 'it'],
  [2010, 'Fernando Alonso', 'es'],
  [2010, 'Felipe Massa', 'br'],
  [2011, 'Fernando Alonso', 'es'],
  [2011, 'Felipe Massa', 'br'],
  [2012, 'Fernando Alonso', 'es'],
  [2012, 'Felipe Massa', 'br'],
  [2013, 'Fernando Alonso', 'es'],
  [2013, 'Felipe Massa', 'br'],
  [2014, 'Fernando Alonso', 'es'],
  [2014, 'Kimi Räikkönen', 'fi'],
  [2015, 'Sebastian Vettel', 'de'],
  [2015, 'Kimi Räikkönen', 'fi'],
  [2016, 'Sebastian Vettel', 'de'],
  [2016, 'Kimi Räikkönen', 'fi'],
  [2017, 'Sebastian Vettel', 'de'],
  [2017, 'Kimi Räikkönen', 'fi'],
  [2018, 'Sebastian Vettel', 'de'],
  [2018, 'Kimi Räikkönen', 'fi'],
  [2019, 'Sebastian Vettel', 'de'],
  [2019, 'Charles Leclerc', 'mc'],
  [2020, 'Sebastian Vettel', 'de'],
  [2020, 'Charles Leclerc', 'mc'],
  [2021, 'Charles Leclerc', 'mc'],
  [2021, 'Carlos Sainz Jr.', 'es'],
  [2022, 'Charles Leclerc', 'mc'],
  [2022, 'Carlos Sainz Jr.', 'es'],
  [2023, 'Charles Leclerc', 'mc'],
  [2023, 'Carlos Sainz Jr.', 'es'],
  [2024, 'Charles Leclerc', 'mc'],
  [2024, 'Carlos Sainz Jr.', 'es'],
  [2024, 'Oliver Bearman', 'gb'],
];

const TOTAL = FERRARI_DRIVERS.length;
const TIMER_SECONDS = 300; // 5 minutes


let found = new Set();
let timerInterval = null;
let secondsLeft = TIMER_SECONDS;
let started = false;
let finished = false;

// Normalize for matching
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z ]/g, '').trim();

// Build lookup: normalized last name → list of indices
const lookup = {};
// Also support full name matching
FERRARI_DRIVERS.forEach(([year, driver, iso], i) => {
  const parts = driver.split(' ');
  const lastName = norm(parts[parts.length - 1]);
  if (!lookup[lastName]) lookup[lastName] = [];
  lookup[lastName].push(i);
  // Full name
  const full = norm(driver);
  if (!lookup[full]) lookup[full] = [];
  if (!lookup[full].includes(i)) lookup[full].push(i);
  // Without Jr./Sr.
  const noSuffix = norm(driver.replace(/\s*(jr\.?|sr\.?|iii?)/gi, ''));
  if (noSuffix !== full) {
    if (!lookup[noSuffix]) lookup[noSuffix] = [];
    if (!lookup[noSuffix].includes(i)) lookup[noSuffix].push(i);
  }
});
// Aliases
const aliases = {
  'schumi': 'schumacher', 'msc': 'schumacher', 'michael': 'schumacher',
  'rubinho': 'barrichello', 'rubens': 'barrichello',
  'kimi': 'raikkonen', 'iceman': 'raikkonen',
  'massa': 'massa', 'felipe': 'massa',
  'alonso': 'alonso', 'fernando': 'alonso', 'nando': 'alonso',
  'vettel': 'vettel', 'seb': 'vettel',
  'leclerc': 'leclerc', 'charles': 'leclerc',
  'sainz': 'sainz', 'carlos': 'sainz',
  'bearman': 'bearman', 'ollie': 'bearman',
  'badoer': 'badoer', 'luca': 'badoer',
  'fisichella': 'fisichella', 'fisico': 'fisichella', 'giancarlo': 'fisichella',
};
Object.entries(aliases).forEach(([alias, canonical]) => {
  if (lookup[canonical] && !lookup[alias]) {
    lookup[alias] = lookup[canonical];
  }
});


// Get unique drivers for the count
const uniqueDrivers = [...new Set(FERRARI_DRIVERS.map(d => d[1]))];

const renderCell = (entry, i) => {
  const [year, driver, iso] = entry;
  const show = found.has(i) || finished;
  const cls = `f1q-cell ${found.has(i) ? 'f1q-cell--found' : ''} ${finished && !found.has(i) ? 'f1q-cell--missed' : ''}`;
  const lastName = driver.split(' ').pop().replace(/Jr\./g, '').trim().toUpperCase();
  return `<div class="${cls}">
    <span class="quiz-team-dot" style="background:#DC0000" title="Ferrari"></span>
    <span class="f1q-cell-year">${year}</span>
    ${show ? flagImg(iso, 14) : ''}
    <span class="f1q-cell-name">${show ? lastName : ''}</span>
  </div>`;
};

const render = () => {
  const app = document.getElementById('quiz-app');
  if (!app) return;

  app.innerHTML = `
    <section class="f1q-section">
      <div class="f1q-container">

        ${!started ? `
          <div class="f1q-intro">
            <div class="f1q-badge"><span>FERRARI QUIZ</span></div>
            <h1 class="f1q-title">NAME EVERY<br><span>FERRARI F1 DRIVER</span></h1>
            <p class="f1q-subtitle">Can you name every driver who raced for Scuderia Ferrari since 2000?<br>${uniqueDrivers.length} drivers · ${TOTAL} entries · 2000–2024 · 5 minutes.</p>
            <button id="f1q-start" class="f1q-btn f1q-btn--primary">Start Quiz</button>
          </div>
        ` : ''}

        ${started ? `
          <div class="f1q-card">
            <div class="f1q-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> <span style="color:#DC0000">SCUDERIA FERRARI</span> · F1 DRIVERS SINCE 2000</div>

            ${!finished ? `
              <div class="f1q-toolbar">
                <div class="f1q-toolbar-left">
                  <input type="text" id="f1q-input" class="f1q-input" placeholder="Type a driver's name..." autocomplete="off" autocapitalize="none" spellcheck="false" />
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
                <div class="f1q-result-label">${found.size === TOTAL ? 'PERFECT SCORE!' : found.size > 40 ? 'INCREDIBLE!' : found.size > 30 ? 'GREAT JOB!' : found.size > 15 ? 'NOT BAD!' : 'KEEP PRACTICING!'}</div>
                <button id="f1q-restart" class="f1q-btn f1q-btn--primary" style="background:#DC0000;border-color:#DC0000;margin-top:16px">Play Again</button>
              </div>
            `}

            <div class="f1q-grid">
              ${FERRARI_DRIVERS.map((entry, i) => renderCell(entry, i)).join('')}
            </div>

            <div class="f1q-progress">
              <div class="f1q-progress-fill" style="background:linear-gradient(90deg,#DC0000,#FF2800);width:${(found.size / TOTAL) * 100}%"></div>
            </div>
          </div>
        ` : ''}

      </div>
    </section>

    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links"><a href="/quiz/">← Back to Quiz Hub</a></div>
        <p class="footer-copy">&copy; ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
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

const giveUp = () => { clearInterval(timerInterval); finished = true; trackEvent('quiz_complete', { quiz: 'ferrari', score: `${found.size}/${TOTAL}` }); render(); };
const startQuiz = () => {
  started = true; secondsLeft = TIMER_SECONDS; found = new Set(); finished = false;
  trackEvent('quiz_start', { quiz: 'ferrari' });
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
  const val = norm(e.target.value);
  if (val.length < 2) return;
  const matches = lookup[val];
  if (matches && matches.length > 0) {
    let newFound = false;
    matches.forEach(i => { if (!found.has(i)) { found.add(i); newFound = true; } });
    if (newFound) {
      e.target.value = '';
      document.getElementById('f1q-score').textContent = `${found.size} / ${TOTAL}`;
      const fill = document.querySelector('.f1q-progress-fill');
      if (fill) fill.style.width = `${(found.size / TOTAL) * 100}%`;
      matches.forEach(i => {
        const cells = document.querySelectorAll('.f1q-cell');
        const cell = cells[i];
        if (cell) {
          cell.classList.add('f1q-cell--found');
          const [year, driver, iso] = FERRARI_DRIVERS[i];
          const lastName = driver.split(' ').pop().replace(/Jr\./g, '').trim().toUpperCase();
          cell.innerHTML = `
            <span class="quiz-team-dot" style="background:#DC0000" title="Ferrari"></span>
            <span class="f1q-cell-year">${year}</span>
            ${flagImg(iso, 14)}
            <span class="f1q-cell-name">${lastName}</span>
          `;
        }
      });
      if (found.size === TOTAL) { clearInterval(timerInterval); finished = true; render(); }
    }
  }
};

initNavScroll();

render();
