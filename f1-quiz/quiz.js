import '../src/style.css';

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
const TIMER_SECONDS = 600; // 10 minutes

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
  // Also add without diacritics
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

const render = () => {
  document.getElementById('quiz-app').innerHTML = `
    <section class="quiz-section">
      <div class="quiz-container">
        <div class="quiz-header">
          <div class="quiz-tag"><span>🏆 CHAMPIONS QUIZ</span></div>
          <h1 class="quiz-title">NAME THE F1<br>WORLD CHAMPIONS</h1>
          <p class="quiz-subtitle">Type any part of a champion's last name — every title they won is revealed at once.<br>1950–2025 · ${TOTAL} titles · 10 minutes.</p>
        </div>

        <div class="quiz-controls">
          <div class="quiz-timer" id="quiz-timer">${formatTime(secondsLeft)}</div>
          <input
            type="text"
            id="quiz-input"
            class="quiz-input"
            placeholder="Type a driver's last name..."
            autocomplete="off"
            ${!started || finished ? 'disabled' : ''}
          />
          <div class="quiz-score"><span id="quiz-found">${found.size}</span> / ${TOTAL}</div>
        </div>

        ${!started && !finished ? `
          <div class="quiz-start-wrap">
            <button id="quiz-start-btn" class="quiz-start-btn">▶ START QUIZ</button>
          </div>
        ` : ''}


        ${started && !finished ? `
          <div class="quiz-start-wrap">
            <button id="quiz-giveup-btn" class="quiz-giveup-btn">GIVE UP</button>
          </div>
        ` : ''}

        ${finished ? `
          <div class="quiz-result">
            <div class="quiz-result-score">${found.size} / ${TOTAL}</div>
            <div class="quiz-result-label">${found.size === TOTAL ? 'PERFECT SCORE! 🏆' : found.size > 60 ? 'INCREDIBLE!' : found.size > 40 ? 'GREAT JOB!' : found.size > 20 ? 'NOT BAD!' : 'KEEP PRACTICING!'}</div>
            <button id="quiz-restart-btn" class="quiz-start-btn" style="margin-top:16px;">↻ PLAY AGAIN</button>
          </div>
        ` : ''}

        <div class="quiz-grid">
          ${champions.map((c, i) => `
            <div class="quiz-cell ${found.has(i) ? 'quiz-cell--found' : ''}">
              <div class="quiz-cell-year">${c.year}</div>
              <div class="quiz-cell-name">${found.has(i) ? c.driver.split(' ').pop().toUpperCase() : ''}</div>
            </div>
          `).join('')}
        </div>

        ${finished ? `
          <div class="quiz-reveal">
            <h3>Full List</h3>
            <div class="quiz-grid quiz-grid--reveal">
              ${champions.map((c, i) => `
                <div class="quiz-cell ${found.has(i) ? 'quiz-cell--found' : 'quiz-cell--missed'}">
                  <div class="quiz-cell-year">${c.year}</div>
                  <div class="quiz-cell-name">${c.driver.split(' ').pop().toUpperCase()}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </section>

    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links">
          <a href="/">← Back to Portfolio</a>
        </div>
        <p class="footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>
  `;

  // Bind events
  const startBtn = document.getElementById('quiz-start-btn');
  const restartBtn = document.getElementById('quiz-restart-btn');
  const input = document.getElementById('quiz-input');

  if (startBtn) startBtn.addEventListener('click', startQuiz);
  if (restartBtn) restartBtn.addEventListener('click', restartQuiz);
  const giveupBtn = document.getElementById('quiz-giveup-btn');
  if (giveupBtn) giveupBtn.addEventListener('click', giveUp);

  if (input && started && !finished) {
    input.addEventListener('input', onInput);
    input.focus();
  }
};

const giveUp = () => {
  clearInterval(timerInterval);
  finished = true;
  render();
};

const startQuiz = () => {
  started = true;
  secondsLeft = TIMER_SECONDS;
  found = new Set();
  finished = false;
  render();
  timerInterval = setInterval(() => {
    secondsLeft--;
    const timerEl = document.getElementById('quiz-timer');
    if (timerEl) {
      timerEl.textContent = formatTime(secondsLeft);
      if (secondsLeft <= 60) timerEl.classList.add('quiz-timer--danger');
    }
    if (secondsLeft <= 0) endQuiz();
  }, 1000);
};

const endQuiz = () => {
  clearInterval(timerInterval);
  finished = true;
  render();
};

const restartQuiz = () => {
  clearInterval(timerInterval);
  found = new Set();
  started = false;
  finished = false;
  secondsLeft = TIMER_SECONDS;
  render();
};

const onInput = (e) => {
  const val = e.target.value.trim().toLowerCase();
  if (val.length < 2) return;

  const matches = lookup[val];
  if (matches && matches.length > 0) {
    let newFound = false;
    matches.forEach(i => {
      if (!found.has(i)) {
        found.add(i);
        newFound = true;
      }
    });
    if (newFound) {
      e.target.value = '';
      // Update DOM without full re-render
      document.getElementById('quiz-found').textContent = found.size;
      matches.forEach(i => {
        const cells = document.querySelectorAll('.quiz-cell');
        const cell = cells[i];
        if (cell) {
          cell.classList.add('quiz-cell--found');
          cell.querySelector('.quiz-cell-name').textContent = champions[i].driver.split(' ').pop().toUpperCase();
        }
      });
      if (found.size === TOTAL) endQuiz();
    }
  }
};

// Init navbar scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

render();
