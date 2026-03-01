import '../src/style.css';

// ── 197 Countries & Capitals ──
const COUNTRIES = [
  {c:'Afghanistan',k:'Kabul'},{c:'Albania',k:'Tirana'},{c:'Algeria',k:'Algiers'},{c:'Andorra',k:'Andorra la Vella'},
  {c:'Angola',k:'Luanda'},{c:'Antigua and Barbuda',k:'St. John\'s'},{c:'Argentina',k:'Buenos Aires'},{c:'Armenia',k:'Yerevan'},
  {c:'Australia',k:'Canberra'},{c:'Austria',k:'Vienna'},{c:'Azerbaijan',k:'Baku'},{c:'Bahamas',k:'Nassau'},
  {c:'Bahrain',k:'Manama'},{c:'Bangladesh',k:'Dhaka'},{c:'Barbados',k:'Bridgetown'},{c:'Belarus',k:'Minsk'},
  {c:'Belgium',k:'Brussels'},{c:'Belize',k:'Belmopan'},{c:'Benin',k:'Porto-Novo'},{c:'Bhutan',k:'Thimphu'},
  {c:'Bolivia',k:'Sucre'},{c:'Bosnia and Herzegovina',k:'Sarajevo'},{c:'Botswana',k:'Gaborone'},{c:'Brazil',k:'Brasilia'},
  {c:'Brunei',k:'Bandar Seri Begawan'},{c:'Bulgaria',k:'Sofia'},{c:'Burkina Faso',k:'Ouagadougou'},{c:'Burundi',k:'Gitega'},
  {c:'Cabo Verde',k:'Praia'},{c:'Cambodia',k:'Phnom Penh'},{c:'Cameroon',k:'Yaounde'},{c:'Canada',k:'Ottawa'},
  {c:'Central African Republic',k:'Bangui'},{c:'Chad',k:'N\'Djamena'},{c:'Chile',k:'Santiago'},{c:'China',k:'Beijing'},
  {c:'Colombia',k:'Bogota'},{c:'Comoros',k:'Moroni'},{c:'Congo (DRC)',k:'Kinshasa'},{c:'Congo (Republic)',k:'Brazzaville'},
  {c:'Costa Rica',k:'San Jose'},{c:'Croatia',k:'Zagreb'},{c:'Cuba',k:'Havana'},{c:'Cyprus',k:'Nicosia'},
  {c:'Czech Republic',k:'Prague'},{c:'Denmark',k:'Copenhagen'},{c:'Djibouti',k:'Djibouti'},{c:'Dominica',k:'Roseau'},
  {c:'Dominican Republic',k:'Santo Domingo'},{c:'East Timor',k:'Dili'},{c:'Ecuador',k:'Quito'},{c:'Egypt',k:'Cairo'},
  {c:'El Salvador',k:'San Salvador'},{c:'Equatorial Guinea',k:'Malabo'},{c:'Eritrea',k:'Asmara'},{c:'Estonia',k:'Tallinn'},
  {c:'Eswatini',k:'Mbabane'},{c:'Ethiopia',k:'Addis Ababa'},{c:'Fiji',k:'Suva'},{c:'Finland',k:'Helsinki'},
  {c:'France',k:'Paris'},{c:'Gabon',k:'Libreville'},{c:'Gambia',k:'Banjul'},{c:'Georgia',k:'Tbilisi'},
  {c:'Germany',k:'Berlin'},{c:'Ghana',k:'Accra'},{c:'Greece',k:'Athens'},{c:'Grenada',k:'St. George\'s'},
  {c:'Guatemala',k:'Guatemala City'},{c:'Guinea',k:'Conakry'},{c:'Guinea-Bissau',k:'Bissau'},{c:'Guyana',k:'Georgetown'},
  {c:'Haiti',k:'Port-au-Prince'},{c:'Honduras',k:'Tegucigalpa'},{c:'Hungary',k:'Budapest'},{c:'Iceland',k:'Reykjavik'},
  {c:'India',k:'New Delhi'},{c:'Indonesia',k:'Jakarta'},{c:'Iran',k:'Tehran'},{c:'Iraq',k:'Baghdad'},
  {c:'Ireland',k:'Dublin'},{c:'Israel',k:'Jerusalem'},{c:'Italy',k:'Rome'},{c:'Ivory Coast',k:'Yamoussoukro'},
  {c:'Jamaica',k:'Kingston'},{c:'Japan',k:'Tokyo'},{c:'Jordan',k:'Amman'},{c:'Kazakhstan',k:'Astana'},
  {c:'Kenya',k:'Nairobi'},{c:'Kiribati',k:'Tarawa'},{c:'Kosovo',k:'Pristina'},{c:'Kuwait',k:'Kuwait City'},
  {c:'Kyrgyzstan',k:'Bishkek'},{c:'Laos',k:'Vientiane'},{c:'Latvia',k:'Riga'},{c:'Lebanon',k:'Beirut'},
  {c:'Lesotho',k:'Maseru'},{c:'Liberia',k:'Monrovia'},{c:'Libya',k:'Tripoli'},{c:'Liechtenstein',k:'Vaduz'},
  {c:'Lithuania',k:'Vilnius'},{c:'Luxembourg',k:'Luxembourg City'},{c:'Madagascar',k:'Antananarivo'},{c:'Malawi',k:'Lilongwe'},
  {c:'Malaysia',k:'Kuala Lumpur'},{c:'Maldives',k:'Male'},{c:'Mali',k:'Bamako'},{c:'Malta',k:'Valletta'},
  {c:'Marshall Islands',k:'Majuro'},{c:'Mauritania',k:'Nouakchott'},{c:'Mauritius',k:'Port Louis'},{c:'Mexico',k:'Mexico City'},
  {c:'Micronesia',k:'Palikir'},{c:'Moldova',k:'Chisinau'},{c:'Monaco',k:'Monaco'},{c:'Mongolia',k:'Ulaanbaatar'},
  {c:'Montenegro',k:'Podgorica'},{c:'Morocco',k:'Rabat'},{c:'Mozambique',k:'Maputo'},{c:'Myanmar',k:'Naypyidaw'},
  {c:'Namibia',k:'Windhoek'},{c:'Nauru',k:'Yaren'},{c:'Nepal',k:'Kathmandu'},{c:'Netherlands',k:'Amsterdam'},
  {c:'New Zealand',k:'Wellington'},{c:'Nicaragua',k:'Managua'},{c:'Niger',k:'Niamey'},{c:'Nigeria',k:'Abuja'},
  {c:'North Korea',k:'Pyongyang'},{c:'North Macedonia',k:'Skopje'},{c:'Norway',k:'Oslo'},{c:'Oman',k:'Muscat'},
  {c:'Pakistan',k:'Islamabad'},{c:'Palau',k:'Ngerulmud'},{c:'Palestine',k:'Ramallah'},{c:'Panama',k:'Panama City'},
  {c:'Papua New Guinea',k:'Port Moresby'},{c:'Paraguay',k:'Asuncion'},{c:'Peru',k:'Lima'},{c:'Philippines',k:'Manila'},
  {c:'Poland',k:'Warsaw'},{c:'Portugal',k:'Lisbon'},{c:'Qatar',k:'Doha'},{c:'Romania',k:'Bucharest'},
  {c:'Russia',k:'Moscow'},{c:'Rwanda',k:'Kigali'},{c:'Saint Kitts and Nevis',k:'Basseterre'},{c:'Saint Lucia',k:'Castries'},
  {c:'Saint Vincent',k:'Kingstown'},{c:'Samoa',k:'Apia'},{c:'San Marino',k:'San Marino'},{c:'Sao Tome and Principe',k:'Sao Tome'},
  {c:'Saudi Arabia',k:'Riyadh'},{c:'Senegal',k:'Dakar'},{c:'Serbia',k:'Belgrade'},{c:'Seychelles',k:'Victoria'},
  {c:'Sierra Leone',k:'Freetown'},{c:'Singapore',k:'Singapore'},{c:'Slovakia',k:'Bratislava'},{c:'Slovenia',k:'Ljubljana'},
  {c:'Solomon Islands',k:'Honiara'},{c:'Somalia',k:'Mogadishu'},{c:'South Africa',k:'Pretoria'},{c:'South Korea',k:'Seoul'},
  {c:'South Sudan',k:'Juba'},{c:'Spain',k:'Madrid'},{c:'Sri Lanka',k:'Colombo'},{c:'Sudan',k:'Khartoum'},
  {c:'Suriname',k:'Paramaribo'},{c:'Sweden',k:'Stockholm'},{c:'Switzerland',k:'Bern'},{c:'Syria',k:'Damascus'},
  {c:'Taiwan',k:'Taipei'},{c:'Tajikistan',k:'Dushanbe'},{c:'Tanzania',k:'Dodoma'},{c:'Thailand',k:'Bangkok'},
  {c:'Togo',k:'Lome'},{c:'Tonga',k:'Nuku\'alofa'},{c:'Trinidad and Tobago',k:'Port of Spain'},{c:'Tunisia',k:'Tunis'},
  {c:'Turkey',k:'Ankara'},{c:'Turkmenistan',k:'Ashgabat'},{c:'Tuvalu',k:'Funafuti'},{c:'Uganda',k:'Kampala'},
  {c:'Ukraine',k:'Kyiv'},{c:'United Arab Emirates',k:'Abu Dhabi'},{c:'United Kingdom',k:'London'},{c:'United States',k:'Washington D.C.'},
  {c:'Uruguay',k:'Montevideo'},{c:'Uzbekistan',k:'Tashkent'},{c:'Vanuatu',k:'Port Vila'},{c:'Vatican City',k:'Vatican City'},
  {c:'Venezuela',k:'Caracas'},{c:'Vietnam',k:'Hanoi'},{c:'Yemen',k:'Sanaa'},{c:'Zambia',k:'Lusaka'},{c:'Zimbabwe',k:'Harare'},
];

const TOTAL = COUNTRIES.length;
const TIMER_MINUTES = 15;

let state = 'idle'; // idle | playing | done
let score = 0;
let answered = new Set();
let timerInterval = null;
let timeLeft = TIMER_MINUTES * 60;

const app = document.getElementById('quiz-app');

// ── Normalize for matching ──
const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '');

// ── Timer ──
const fmtTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

const startTimer = () => {
  timeLeft = TIMER_MINUTES * 60;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('cq-timer').textContent = fmtTime(timeLeft);
    if (timeLeft <= 0) endGame();
  }, 1000);
};

const endGame = () => {
  state = 'done';
  clearInterval(timerInterval);
  render();
};

const startGame = () => {
  state = 'playing';
  score = 0;
  answered = new Set();
  render();
  startTimer();
  setTimeout(() => document.getElementById('cq-input')?.focus(), 100);
};

const giveUp = () => endGame();

// ── Check answer ──
const checkAnswer = (val) => {
  const n = norm(val);
  if (!n) return;
  for (let i = 0; i < COUNTRIES.length; i++) {
    if (answered.has(i)) continue;
    if (norm(COUNTRIES[i].k) === n) {
      answered.add(i);
      score++;
      document.getElementById('cq-input').value = '';
      document.getElementById('cq-score').textContent = `${score} / ${TOTAL}`;
      // Mark the row
      const row = document.getElementById(`cq-row-${i}`);
      if (row) {
        row.classList.add('cq-found');
        row.querySelector('.cq-capital').textContent = COUNTRIES[i].k;
      }
      // Flash effect
      const flash = document.getElementById('cq-flash');
      if (flash) { flash.classList.add('cq-flash-show'); setTimeout(() => flash.classList.remove('cq-flash-show'), 300); }
      if (score === TOTAL) endGame();
      return;
    }
  }
};

// ── Render ──
const render = () => {
  if (!app) return;

  if (state === 'idle') {
    app.innerHTML = `
      <section class="cq-section">
        <div class="cq-container">
          <div class="cq-header">
            <div class="cq-badge"><span>GEOGRAPHY</span></div>
            <h1 class="cq-title">WORLD CAPITALS<br><span>QUIZ</span></h1>
            <p class="cq-subtitle">Can you name the capital city of every country in the world?<br>You have ${TIMER_MINUTES} minutes to name all ${TOTAL}.</p>
            <button class="cq-start-btn" onclick="window.__startQuiz()">Start Quiz</button>
          </div>
        </div>
      </section>
      <footer class="footer" role="contentinfo">
        <div class="container">
          <div class="footer-links"><a href="/">← Back to Portfolio</a></div>
          <p class="footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
        </div>
      </footer>`;
    return;
  }

  if (state === 'playing') {
    app.innerHTML = `
      <section class="cq-section">
        <div class="cq-container">
          <div class="cq-toolbar">
            <div class="cq-toolbar-left">
              <input type="text" id="cq-input" class="cq-input" placeholder="Type a capital city..." autocomplete="off" spellcheck="false" />
            </div>
            <div class="cq-toolbar-right">
              <div class="cq-stat"><span class="cq-stat-label">Score</span><span class="cq-stat-value" id="cq-score">${score} / ${TOTAL}</span></div>
              <div class="cq-stat"><span class="cq-stat-label">Time</span><span class="cq-stat-value" id="cq-timer">${fmtTime(timeLeft)}</span></div>
              <button class="cq-give-up" onclick="window.__giveUp()">Give Up</button>
            </div>
          </div>
          <div id="cq-flash" class="cq-flash"></div>
          <div class="cq-grid">
            ${COUNTRIES.map((item, i) => `
              <div class="cq-row ${answered.has(i) ? 'cq-found' : ''}" id="cq-row-${i}">
                <span class="cq-country">${item.c}</span>
                <span class="cq-capital">${answered.has(i) ? item.k : ''}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>`;

    const inp = document.getElementById('cq-input');
    inp.addEventListener('input', (e) => checkAnswer(e.target.value));
    inp.focus();
    return;
  }

  // Done
  const pct = Math.round((score / TOTAL) * 100);
  const missed = COUNTRIES.filter((_, i) => !answered.has(i));
  const grade = pct === 100 ? 'PERFECT!' : pct >= 80 ? 'EXCELLENT' : pct >= 60 ? 'GREAT JOB' : pct >= 40 ? 'GOOD EFFORT' : 'KEEP PRACTICING';

  app.innerHTML = `
    <section class="cq-section">
      <div class="cq-container">
        <div class="cq-header">
          <h1 class="cq-title">${grade}</h1>
          <p class="cq-subtitle">You named <strong>${score}</strong> of <strong>${TOTAL}</strong> capitals (${pct}%)</p>
          <button class="cq-start-btn" onclick="window.__startQuiz()">Play Again</button>
        </div>
        ${missed.length > 0 && missed.length <= 50 ? `
          <div class="cq-missed">
            <div class="cq-missed-label">Missed Capitals</div>
            <div class="cq-grid cq-grid--result">
              ${missed.map(item => `
                <div class="cq-row cq-missed-row">
                  <span class="cq-country">${item.c}</span>
                  <span class="cq-capital cq-capital--missed">${item.k}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : missed.length > 50 ? `
          <div class="cq-missed">
            <div class="cq-missed-label">${missed.length} capitals missed</div>
          </div>
        ` : ''}
      </div>
    </section>
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links"><a href="/">← Back to Portfolio</a></div>
        <p class="footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>`;
};

// Expose for onclick
window.__startQuiz = startGame;
window.__giveUp = giveUp;

// Nav scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

render();
