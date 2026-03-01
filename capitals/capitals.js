import '../src/style.css';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

// ── 197 Countries → Capitals + ISO numeric codes for map ──
const DATA = [
  {c:'Afghanistan',k:'Kabul',id:'004'},{c:'Albania',k:'Tirana',id:'008'},{c:'Algeria',k:'Algiers',id:'012'},{c:'Andorra',k:'Andorra la Vella',id:'020'},
  {c:'Angola',k:'Luanda',id:'024'},{c:'Antigua and Barbuda',k:"St. John's",id:'028'},{c:'Argentina',k:'Buenos Aires',id:'032'},{c:'Armenia',k:'Yerevan',id:'051'},
  {c:'Australia',k:'Canberra',id:'036'},{c:'Austria',k:'Vienna',id:'040'},{c:'Azerbaijan',k:'Baku',id:'031'},{c:'Bahamas',k:'Nassau',id:'044'},
  {c:'Bahrain',k:'Manama',id:'048'},{c:'Bangladesh',k:'Dhaka',id:'050'},{c:'Barbados',k:'Bridgetown',id:'052'},{c:'Belarus',k:'Minsk',id:'112'},
  {c:'Belgium',k:'Brussels',id:'056'},{c:'Belize',k:'Belmopan',id:'084'},{c:'Benin',k:'Porto-Novo',id:'204'},{c:'Bhutan',k:'Thimphu',id:'064'},
  {c:'Bolivia',k:'Sucre',id:'068'},{c:'Bosnia and Herzegovina',k:'Sarajevo',id:'070'},{c:'Botswana',k:'Gaborone',id:'072'},{c:'Brazil',k:'Brasilia',id:'076'},
  {c:'Brunei',k:'Bandar Seri Begawan',id:'096'},{c:'Bulgaria',k:'Sofia',id:'100'},{c:'Burkina Faso',k:'Ouagadougou',id:'854'},{c:'Burundi',k:'Gitega',id:'108'},
  {c:'Cabo Verde',k:'Praia',id:'132'},{c:'Cambodia',k:'Phnom Penh',id:'116'},{c:'Cameroon',k:'Yaounde',id:'120'},{c:'Canada',k:'Ottawa',id:'124'},
  {c:'Central African Republic',k:'Bangui',id:'140'},{c:'Chad',k:"N'Djamena",id:'148'},{c:'Chile',k:'Santiago',id:'152'},{c:'China',k:'Beijing',id:'156'},
  {c:'Colombia',k:'Bogota',id:'170'},{c:'Comoros',k:'Moroni',id:'174'},{c:'Congo (DRC)',k:'Kinshasa',id:'180'},{c:'Congo (Republic)',k:'Brazzaville',id:'178'},
  {c:'Costa Rica',k:'San Jose',id:'188'},{c:'Croatia',k:'Zagreb',id:'191'},{c:'Cuba',k:'Havana',id:'192'},{c:'Cyprus',k:'Nicosia',id:'196'},
  {c:'Czech Republic',k:'Prague',id:'203'},{c:'Denmark',k:'Copenhagen',id:'208'},{c:'Djibouti',k:'Djibouti',id:'262'},{c:'Dominica',k:'Roseau',id:'212'},
  {c:'Dominican Republic',k:'Santo Domingo',id:'214'},{c:'East Timor',k:'Dili',id:'626'},{c:'Ecuador',k:'Quito',id:'218'},{c:'Egypt',k:'Cairo',id:'818'},
  {c:'El Salvador',k:'San Salvador',id:'222'},{c:'Equatorial Guinea',k:'Malabo',id:'226'},{c:'Eritrea',k:'Eritrea',id:'232'},{c:'Estonia',k:'Tallinn',id:'233'},
  {c:'Eswatini',k:'Mbabane',id:'748'},{c:'Ethiopia',k:'Addis Ababa',id:'231'},{c:'Fiji',k:'Suva',id:'242'},{c:'Finland',k:'Helsinki',id:'246'},
  {c:'France',k:'Paris',id:'250'},{c:'Gabon',k:'Libreville',id:'266'},{c:'Gambia',k:'Banjul',id:'270'},{c:'Georgia',k:'Tbilisi',id:'268'},
  {c:'Germany',k:'Berlin',id:'276'},{c:'Ghana',k:'Accra',id:'288'},{c:'Greece',k:'Athens',id:'300'},{c:'Grenada',k:"St. George's",id:'308'},
  {c:'Guatemala',k:'Guatemala City',id:'320'},{c:'Guinea',k:'Conakry',id:'324'},{c:'Guinea-Bissau',k:'Bissau',id:'624'},{c:'Guyana',k:'Georgetown',id:'328'},
  {c:'Haiti',k:'Port-au-Prince',id:'332'},{c:'Honduras',k:'Tegucigalpa',id:'340'},{c:'Hungary',k:'Budapest',id:'348'},{c:'Iceland',k:'Reykjavik',id:'352'},
  {c:'India',k:'New Delhi',id:'356'},{c:'Indonesia',k:'Jakarta',id:'360'},{c:'Iran',k:'Tehran',id:'364'},{c:'Iraq',k:'Baghdad',id:'368'},
  {c:'Ireland',k:'Dublin',id:'372'},{c:'Israel',k:'Jerusalem',id:'376'},{c:'Italy',k:'Rome',id:'380'},{c:'Ivory Coast',k:'Yamoussoukro',id:'384'},
  {c:'Jamaica',k:'Kingston',id:'388'},{c:'Japan',k:'Tokyo',id:'392'},{c:'Jordan',k:'Amman',id:'400'},{c:'Kazakhstan',k:'Astana',id:'398'},
  {c:'Kenya',k:'Nairobi',id:'404'},{c:'Kiribati',k:'Tarawa',id:'296'},{c:'Kosovo',k:'Pristina',id:'-99'},{c:'Kuwait',k:'Kuwait City',id:'414'},
  {c:'Kyrgyzstan',k:'Bishkek',id:'417'},{c:'Laos',k:'Vientiane',id:'418'},{c:'Latvia',k:'Riga',id:'428'},{c:'Lebanon',k:'Beirut',id:'422'},
  {c:'Lesotho',k:'Maseru',id:'426'},{c:'Liberia',k:'Monrovia',id:'430'},{c:'Libya',k:'Tripoli',id:'434'},{c:'Liechtenstein',k:'Vaduz',id:'438'},
  {c:'Lithuania',k:'Vilnius',id:'440'},{c:'Luxembourg',k:'Luxembourg City',id:'442'},{c:'Madagascar',k:'Antananarivo',id:'450'},{c:'Malawi',k:'Lilongwe',id:'454'},
  {c:'Malaysia',k:'Kuala Lumpur',id:'458'},{c:'Maldives',k:'Male',id:'462'},{c:'Mali',k:'Bamako',id:'466'},{c:'Malta',k:'Valletta',id:'470'},
  {c:'Marshall Islands',k:'Majuro',id:'584'},{c:'Mauritania',k:'Nouakchott',id:'478'},{c:'Mauritius',k:'Port Louis',id:'480'},{c:'Mexico',k:'Mexico City',id:'484'},
  {c:'Micronesia',k:'Palikir',id:'583'},{c:'Moldova',k:'Chisinau',id:'498'},{c:'Monaco',k:'Monaco',id:'492'},{c:'Mongolia',k:'Ulaanbaatar',id:'496'},
  {c:'Montenegro',k:'Podgorica',id:'499'},{c:'Morocco',k:'Rabat',id:'504'},{c:'Mozambique',k:'Maputo',id:'508'},{c:'Myanmar',k:'Naypyidaw',id:'104'},
  {c:'Namibia',k:'Windhoek',id:'516'},{c:'Nauru',k:'Yaren',id:'520'},{c:'Nepal',k:'Kathmandu',id:'524'},{c:'Netherlands',k:'Amsterdam',id:'528'},
  {c:'New Zealand',k:'Wellington',id:'554'},{c:'Nicaragua',k:'Managua',id:'558'},{c:'Niger',k:'Niamey',id:'562'},{c:'Nigeria',k:'Abuja',id:'566'},
  {c:'North Korea',k:'Pyongyang',id:'408'},{c:'North Macedonia',k:'Skopje',id:'807'},{c:'Norway',k:'Oslo',id:'578'},{c:'Oman',k:'Muscat',id:'512'},
  {c:'Pakistan',k:'Islamabad',id:'586'},{c:'Palau',k:'Ngerulmud',id:'585'},{c:'Palestine',k:'Ramallah',id:'275'},{c:'Panama',k:'Panama City',id:'591'},
  {c:'Papua New Guinea',k:'Port Moresby',id:'598'},{c:'Paraguay',k:'Asuncion',id:'600'},{c:'Peru',k:'Lima',id:'604'},{c:'Philippines',k:'Manila',id:'608'},
  {c:'Poland',k:'Warsaw',id:'616'},{c:'Portugal',k:'Lisbon',id:'620'},{c:'Qatar',k:'Doha',id:'634'},{c:'Romania',k:'Bucharest',id:'642'},
  {c:'Russia',k:'Moscow',id:'643'},{c:'Rwanda',k:'Kigali',id:'646'},{c:'Saint Kitts and Nevis',k:'Basseterre',id:'659'},{c:'Saint Lucia',k:'Castries',id:'662'},
  {c:'Saint Vincent',k:'Kingstown',id:'670'},{c:'Samoa',k:'Apia',id:'882'},{c:'San Marino',k:'San Marino',id:'674'},{c:'Sao Tome and Principe',k:'Sao Tome',id:'678'},
  {c:'Saudi Arabia',k:'Riyadh',id:'682'},{c:'Senegal',k:'Dakar',id:'686'},{c:'Serbia',k:'Belgrade',id:'688'},{c:'Seychelles',k:'Victoria',id:'690'},
  {c:'Sierra Leone',k:'Freetown',id:'694'},{c:'Singapore',k:'Singapore',id:'702'},{c:'Slovakia',k:'Bratislava',id:'703'},{c:'Slovenia',k:'Ljubljana',id:'705'},
  {c:'Solomon Islands',k:'Honiara',id:'090'},{c:'Somalia',k:'Mogadishu',id:'706'},{c:'South Africa',k:'Pretoria',id:'710'},{c:'South Korea',k:'Seoul',id:'410'},
  {c:'South Sudan',k:'Juba',id:'728'},{c:'Spain',k:'Madrid',id:'724'},{c:'Sri Lanka',k:'Colombo',id:'144'},{c:'Sudan',k:'Khartoum',id:'729'},
  {c:'Suriname',k:'Paramaribo',id:'740'},{c:'Sweden',k:'Stockholm',id:'752'},{c:'Switzerland',k:'Bern',id:'756'},{c:'Syria',k:'Damascus',id:'760'},
  {c:'Taiwan',k:'Taipei',id:'158'},{c:'Tajikistan',k:'Dushanbe',id:'762'},{c:'Tanzania',k:'Dodoma',id:'834'},{c:'Thailand',k:'Bangkok',id:'764'},
  {c:'Togo',k:'Lome',id:'768'},{c:'Tonga',k:"Nuku'alofa",id:'776'},{c:'Trinidad and Tobago',k:'Port of Spain',id:'780'},{c:'Tunisia',k:'Tunis',id:'788'},
  {c:'Turkey',k:'Ankara',id:'792'},{c:'Turkmenistan',k:'Ashgabat',id:'795'},{c:'Tuvalu',k:'Funafuti',id:'798'},{c:'Uganda',k:'Kampala',id:'800'},
  {c:'Ukraine',k:'Kyiv',id:'804'},{c:'United Arab Emirates',k:'Abu Dhabi',id:'784'},{c:'United Kingdom',k:'London',id:'826'},{c:'United States',k:'Washington D.C.',id:'840'},
  {c:'Uruguay',k:'Montevideo',id:'858'},{c:'Uzbekistan',k:'Tashkent',id:'860'},{c:'Vanuatu',k:'Port Vila',id:'548'},{c:'Vatican City',k:'Vatican City',id:'336'},
  {c:'Venezuela',k:'Caracas',id:'862'},{c:'Vietnam',k:'Hanoi',id:'704'},{c:'Yemen',k:'Sanaa',id:'887'},{c:'Zambia',k:'Lusaka',id:'894'},{c:'Zimbabwe',k:'Harare',id:'716'},
];

const TOTAL = DATA.length;
const TIMER_MINUTES = 15;
const ATLAS_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

let state = 'idle';
let score = 0;
let answered = new Set();
let timerInterval = null;
let timeLeft = TIMER_MINUTES * 60;
let worldData = null;
let lastAnswered = '';

const app = document.getElementById('quiz-app');
const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '');
const fmtTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

// Build lookup: numericISO → quiz index
const idToIdx = {};
DATA.forEach((d, i) => { if (d.id) idToIdx[d.id] = i; });

// ── Load world map data ──
const loadMap = async () => {
  if (worldData) return;
  const res = await fetch(ATLAS_URL);
  const topo = await res.json();
  worldData = feature(topo, topo.objects.countries);
};

// ── Timer ──
const startTimer = () => {
  timeLeft = TIMER_MINUTES * 60;
  timerInterval = setInterval(() => {
    timeLeft--;
    const t = document.getElementById('cq-timer');
    if (t) t.textContent = fmtTime(timeLeft);
    if (timeLeft <= 60) { if (t) t.style.color = '#e74c3c'; }
    if (timeLeft <= 0) endGame();
  }, 1000);
};

const endGame = () => { state = 'done'; clearInterval(timerInterval); render(); };
const startGame = async () => {
  await loadMap();
  state = 'playing'; score = 0; answered = new Set(); lastAnswered = '';
  render(); startTimer();
  setTimeout(() => document.getElementById('cq-input')?.focus(), 100);
};

// ── Check answer ──
const checkAnswer = (val) => {
  const n = norm(val);
  if (!n) return;
  for (let i = 0; i < DATA.length; i++) {
    if (answered.has(i)) continue;
    if (norm(DATA[i].k) === n) {
      answered.add(i);
      score++;
      lastAnswered = `${DATA[i].k} — ${DATA[i].c}`;
      document.getElementById('cq-input').value = '';
      document.getElementById('cq-score').textContent = `${score} / ${TOTAL}`;
      const fb = document.getElementById('cq-feedback');
      if (fb) { fb.textContent = lastAnswered; fb.classList.add('cq-fb-show'); setTimeout(() => fb.classList.remove('cq-fb-show'), 1500); }

      // Color the country on the map
      const path = document.getElementById(`country-${DATA[i].id}`);
      if (path) {
        path.setAttribute('class', 'cq-map-found');
        // Add label
        const bbox = path.getBBox();
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', bbox.x + bbox.width / 2);
        label.setAttribute('y', bbox.y + bbox.height / 2);
        label.setAttribute('class', 'cq-map-label');
        label.textContent = DATA[i].k;
        path.parentNode.appendChild(label);
      }

      if (score === TOTAL) endGame();
      return;
    }
  }
};

// ── Render Map SVG ──
const renderMapSVG = () => {
  if (!worldData) return '<div class="cq-map-loading">Loading map...</div>';

  const width = 960;
  const height = 500;
  const projection = geoNaturalEarth1().fitSize([width, height], worldData);
  const pathGen = geoPath(projection);

  const paths = worldData.features.map(f => {
    const numId = f.id || f.properties?.id;
    const idx = idToIdx[numId];
    const isFound = idx !== undefined && answered.has(idx);
    return `<path id="country-${numId}" d="${pathGen(f)}" class="${isFound ? 'cq-map-found' : 'cq-map-country'}" />`;
  }).join('');

  return `<svg viewBox="0 0 ${width} ${height}" class="cq-map-svg">${paths}</svg>`;
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
            <p class="cq-subtitle">Can you name the capital city of every country in the world?<br>You have ${TIMER_MINUTES} minutes to name all ${TOTAL}. Countries light up on the map as you answer.</p>
            <button class="cq-start-btn" id="cq-start">Start Quiz</button>
          </div>
        </div>
      </section>
      <footer class="footer" role="contentinfo">
        <div class="container">
          <div class="footer-links"><a href="/">← Back to Portfolio</a></div>
          <p class="footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
        </div>
      </footer>`;
    document.getElementById('cq-start')?.addEventListener('click', startGame);
    return;
  }

  if (state === 'playing') {
    app.innerHTML = `
      <section class="cq-section cq-section--playing">
        <div class="cq-container cq-container--wide">
          <div class="cq-toolbar">
            <div class="cq-toolbar-left">
              <input type="text" id="cq-input" class="cq-input" placeholder="Type a capital city..." autocomplete="off" spellcheck="false" />
            </div>
            <div class="cq-toolbar-right">
              <div id="cq-feedback" class="cq-feedback"></div>
              <div class="cq-stat"><span class="cq-stat-label">Score</span><span class="cq-stat-value" id="cq-score">${score} / ${TOTAL}</span></div>
              <div class="cq-stat"><span class="cq-stat-label">Time</span><span class="cq-stat-value" id="cq-timer">${fmtTime(timeLeft)}</span></div>
              <button class="cq-give-up" id="cq-giveup">Give Up</button>
            </div>
          </div>
          <div class="cq-map-container">
            ${renderMapSVG()}
          </div>
          <div class="cq-progress-bar">
            <div class="cq-progress-fill" style="width: ${(score/TOTAL)*100}%"></div>
          </div>
        </div>
      </section>`;

    document.getElementById('cq-input')?.addEventListener('input', e => checkAnswer(e.target.value));
    document.getElementById('cq-giveup')?.addEventListener('click', endGame);
    document.getElementById('cq-input')?.focus();
    return;
  }

  // Done
  const pct = Math.round((score / TOTAL) * 100);
  const missed = DATA.filter((_, i) => !answered.has(i));
  const grade = pct === 100 ? 'PERFECT!' : pct >= 80 ? 'EXCELLENT' : pct >= 60 ? 'GREAT JOB' : pct >= 40 ? 'GOOD EFFORT' : 'KEEP PRACTICING';

  app.innerHTML = `
    <section class="cq-section">
      <div class="cq-container cq-container--wide">
        <div class="cq-header">
          <h1 class="cq-title">${grade}</h1>
          <p class="cq-subtitle">You named <strong>${score}</strong> of <strong>${TOTAL}</strong> capitals (${pct}%)</p>
          <div class="cq-map-container cq-map-container--result">
            ${renderMapSVG()}
          </div>
          <button class="cq-start-btn" id="cq-restart" style="margin-top:24px;">Play Again</button>
        </div>
        ${missed.length > 0 && missed.length <= 80 ? `
          <div class="cq-missed">
            <div class="cq-missed-label">Missed Capitals (${missed.length})</div>
            <div class="cq-grid cq-grid--result">
              ${missed.map(item => `
                <div class="cq-row cq-missed-row">
                  <span class="cq-country">${item.c}</span>
                  <span class="cq-capital cq-capital--missed">${item.k}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : missed.length > 80 ? `<div class="cq-missed"><div class="cq-missed-label">${missed.length} capitals missed</div></div>` : ''}
      </div>
    </section>
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links"><a href="/">← Back to Portfolio</a></div>
        <p class="footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>`;
  document.getElementById('cq-restart')?.addEventListener('click', startGame);
};

// Nav scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

render();
