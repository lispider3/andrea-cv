import '../src/style.css';
import { trackEvent } from '../src/tracker.js';

// ── 45 Countries of Europe (Sporcle standard) ──
// [name, iso2 code, aliases]
const COUNTRIES = [
  ['Albania', 'al', ['shqipëri','shqiperi']],
  ['Andorra', 'ad', []],
  ['Austria', 'at', ['österreich','osterreich']],
  ['Belarus', 'by', ['byelorussia']],
  ['Belgium', 'be', ['belgique','belgie','belgië']],
  ['Bosnia and Herzegovina', 'ba', ['bosnia','bih','bosna']],
  ['Bulgaria', 'bg', []],
  ['Croatia', 'hr', ['hrvatska']],
  ['Cyprus', 'cy', ['kypros','kibris']],
  ['Czech Republic', 'cz', ['czechia','česko','cesko']],
  ['Denmark', 'dk', ['danmark']],
  ['Estonia', 'ee', ['eesti']],
  ['Finland', 'fi', ['suomi']],
  ['France', 'fr', []],
  ['Germany', 'de', ['deutschland','alemania']],
  ['Greece', 'gr', ['hellas','ellada','ελλάδα']],
  ['Hungary', 'hu', ['magyarország','magyarorszag']],
  ['Iceland', 'is', ['ísland','island']],
  ['Ireland', 'ie', ['eire','éire']],
  ['Italy', 'it', ['italia']],
  ['Kosovo', 'xk', ['kosovë','kosova']],
  ['Latvia', 'lv', ['latvija']],
  ['Liechtenstein', 'li', []],
  ['Lithuania', 'lt', ['lietuva']],
  ['Luxembourg', 'lu', ['lëtzebuerg','letzebuerg']],
  ['Malta', 'mt', []],
  ['Moldova', 'md', []],
  ['Monaco', 'mc', []],
  ['Montenegro', 'me', ['crna gora']],
  ['Netherlands', 'nl', ['holland','nederland']],
  ['North Macedonia', 'mk', ['macedonia','makedonija']],
  ['Norway', 'no', ['norge','noreg']],
  ['Poland', 'pl', ['polska']],
  ['Portugal', 'pt', []],
  ['Romania', 'ro', ['românia','romania']],
  ['Russia', 'ru', ['rossiya','россия']],
  ['San Marino', 'sm', []],
  ['Serbia', 'rs', ['srbija']],
  ['Slovakia', 'sk', ['slovensko']],
  ['Slovenia', 'si', ['slovenija']],
  ['Spain', 'es', ['españa','espana','espanha']],
  ['Sweden', 'se', ['sverige']],
  ['Switzerland', 'ch', ['schweiz','suisse','svizzera']],
  ['Ukraine', 'ua', ['україна','ukraina']],
  ['United Kingdom', 'gb', ['uk','great britain','britain','england']],
  ['Vatican City', 'va', ['vatican','holy see']],
];

const TOTAL = COUNTRIES.length;
const TIMER_SECONDS = 300; // 5 minutes

const flagImg = (iso) => iso
  ? `<img src="https://flagcdn.com/w20/${iso}.png" alt="" width="20" height="15" class="quiz-flag" loading="lazy">`
  : '';

let found = new Set();
let timerInterval = null;
let secondsLeft = TIMER_SECONDS;
let started = false;
let finished = false;

// Normalize for matching
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z ]/g, '').trim();

// Build lookup: normalized name → index
const lookup = {};
COUNTRIES.forEach(([name, iso, aliases], i) => {
  lookup[norm(name)] = i;
  aliases.forEach(a => { lookup[norm(a)] = i; });
});

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

// Sort countries alphabetically for the grid
const sortedIndices = COUNTRIES.map((_, i) => i).sort((a, b) =>
  COUNTRIES[a][0].localeCompare(COUNTRIES[b][0])
);

const renderCell = (i) => {
  const [name, iso] = COUNTRIES[i];
  const show = found.has(i) || finished;
  const cls = `f1q-cell ${found.has(i) ? 'f1q-cell--found' : ''} ${finished && !found.has(i) ? 'f1q-cell--missed' : ''}`;
  return `<div class="${cls}" style="min-width:180px">
    ${show ? flagImg(iso) : ''}
    <span class="f1q-cell-name" style="font-size:11px">${show ? name : '?'}</span>
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
            <div class="f1q-badge" style="border-color:rgba(59,130,246,0.3)"><span style="color:#3b82f6">GEOGRAPHY QUIZ</span></div>
            <h1 class="f1q-title">COUNTRIES OF<br><span style="color:#3b82f6">EUROPE</span></h1>
            <p class="f1q-subtitle">Can you name all ${TOTAL} countries of Europe?<br>5 minutes on the clock.</p>
            <button id="f1q-start" class="f1q-btn f1q-btn--primary" style="background:#3b82f6;border-color:#3b82f6">Start Quiz</button>
          </div>
        ` : ''}

        ${started ? `
          <div class="f1q-card">
            <div class="f1q-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> <span style="color:#3b82f6">COUNTRIES OF EUROPE</span> · ${TOTAL} TO NAME</div>

            ${!finished ? `
              <div class="f1q-toolbar">
                <div class="f1q-toolbar-left">
                  <input type="text" id="f1q-input" class="f1q-input" placeholder="Type a country name..." autocomplete="off" autocapitalize="none" spellcheck="false" />
                </div>
                <div class="f1q-toolbar-right">
                  <span class="f1q-stat-label">FOUND</span>
                  <span class="f1q-stat-value" id="f1q-score">${found.size} / ${TOTAL}</span>
                  <span class="f1q-stat-label">TIME</span>
                  <span class="f1q-stat-value f1q-timer" id="f1q-timer">${formatTime(secondsLeft)}</span>
                  <button class="f1q-btn f1q-btn--ghost" id="f1q-giveup">Give Up</button>
                </div>
              </div>
            ` : `
              <div class="f1q-result">
                <div class="f1q-result-score">${found.size} / ${TOTAL}</div>
                <div class="f1q-result-label">${found.size === TOTAL ? 'PERFECT SCORE!' : found.size >= 40 ? 'INCREDIBLE!' : found.size >= 30 ? 'GREAT JOB!' : found.size >= 20 ? 'NOT BAD!' : 'KEEP PRACTICING!'}</div>
                <button id="f1q-restart" class="f1q-btn f1q-btn--primary" style="background:#3b82f6;border-color:#3b82f6;margin-top:16px">Play Again</button>
              </div>
            `}

            <div class="f1q-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">
              ${sortedIndices.map(i => renderCell(i)).join('')}
            </div>

            <div class="f1q-progress">
              <div class="f1q-progress-fill" style="background:linear-gradient(90deg,#3b82f6,#60a5fa);width:${(found.size/TOTAL)*100}%"></div>
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

const giveUp = () => { clearInterval(timerInterval); finished = true; trackEvent('quiz_complete', { quiz: 'europe', score: `${found.size}/${TOTAL}` }); render(); };
const startQuiz = () => {
  started = true; secondsLeft = TIMER_SECONDS; found = new Set(); finished = false;
  trackEvent('quiz_start', { quiz: 'europe' });
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
  const idx = lookup[val];
  if (idx !== undefined && !found.has(idx)) {
    found.add(idx);
    e.target.value = '';
    document.getElementById('f1q-score').textContent = `${found.size} / ${TOTAL}`;
    const fill = document.querySelector('.f1q-progress-fill');
    if (fill) fill.style.width = `${(found.size/TOTAL)*100}%`;
    // Update the specific cell
    const cells = document.querySelectorAll('.f1q-cell');
    const sortedPos = sortedIndices.indexOf(idx);
    const cell = cells[sortedPos];
    if (cell) {
      cell.classList.add('f1q-cell--found');
      const [name, iso] = COUNTRIES[idx];
      cell.innerHTML = `${flagImg(iso)}<span class="f1q-cell-name" style="font-size:11px">${name}</span>`;
    }
    if (found.size === TOTAL) { clearInterval(timerInterval); finished = true; render(); }
  }
};

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

render();
