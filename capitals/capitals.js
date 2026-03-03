import '../src/style.css';
import { trackEvent } from '../src/tracker.js';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

// ── 197 Countries → Capitals + ISO numeric codes for map ──
const DATA = [
  {c:'Afghanistan',k:'Kabul',id:'004',ct:'Asia',a:652},{c:'Albania',k:'Tirana',id:'008',ct:'Europe',a:29},{c:'Algeria',k:'Algiers',id:'012',ct:'Africa',a:2382},{c:'Andorra',k:'Andorra la Vella',id:'020',ct:'Europe',a:0.5},
  {c:'Angola',k:'Luanda',id:'024',ct:'Africa',a:1247},{c:'Antigua and Barbuda',k:"St. John's",id:'028',ct:'N. America',a:0.4},{c:'Argentina',k:'Buenos Aires',id:'032',ct:'S. America',a:2780},{c:'Armenia',k:'Yerevan',id:'051',ct:'Asia',a:30},
  {c:'Australia',k:'Canberra',id:'036',ct:'Oceania',a:7692},{c:'Austria',k:'Vienna',id:'040',ct:'Europe',a:84},{c:'Azerbaijan',k:'Baku',id:'031',ct:'Asia',a:87},{c:'Bahamas',k:'Nassau',id:'044',ct:'N. America',a:14},
  {c:'Bahrain',k:'Manama',id:'048',ct:'Asia',a:1},{c:'Bangladesh',k:'Dhaka',id:'050',ct:'Asia',a:148},{c:'Barbados',k:'Bridgetown',id:'052',ct:'N. America',a:0.4},{c:'Belarus',k:'Minsk',id:'112',ct:'Europe',a:208},
  {c:'Belgium',k:'Brussels',id:'056',ct:'Europe',a:31},{c:'Belize',k:'Belmopan',id:'084',ct:'N. America',a:23},{c:'Benin',k:'Porto-Novo',id:'204',ct:'Africa',a:115},{c:'Bhutan',k:'Thimphu',id:'064',ct:'Asia',a:38},
  {c:'Bolivia',k:'Sucre',id:'068',ct:'S. America',a:1099},{c:'Bosnia and Herzegovina',k:'Sarajevo',id:'070',ct:'Europe',a:51},{c:'Botswana',k:'Gaborone',id:'072',ct:'Africa',a:582},{c:'Brazil',k:'Brasilia',id:'076',ct:'S. America',a:8516},
  {c:'Brunei',k:'Bandar Seri Begawan',id:'096',ct:'Asia',a:6},{c:'Bulgaria',k:'Sofia',id:'100',ct:'Europe',a:111},{c:'Burkina Faso',k:'Ouagadougou',id:'854',ct:'Africa',a:274},{c:'Burundi',k:'Gitega',id:'108',ct:'Africa',a:28},
  {c:'Cabo Verde',k:'Praia',id:'132',ct:'Africa',a:4},{c:'Cambodia',k:'Phnom Penh',id:'116',ct:'Asia',a:181},{c:'Cameroon',k:'Yaounde',id:'120',ct:'Africa',a:475},{c:'Canada',k:'Ottawa',id:'124',ct:'N. America',a:9985},
  {c:'Central African Republic',k:'Bangui',id:'140',ct:'Africa',a:623},{c:'Chad',k:"N'Djamena",id:'148',ct:'Africa',a:1284},{c:'Chile',k:'Santiago',id:'152',ct:'S. America',a:756},{c:'China',k:'Beijing',id:'156',ct:'Asia',a:9597},
  {c:'Colombia',k:'Bogota',id:'170',ct:'S. America',a:1142},{c:'Comoros',k:'Moroni',id:'174',ct:'Africa',a:2},{c:'Congo (DRC)',k:'Kinshasa',id:'180',ct:'Africa',a:2345},{c:'Congo (Republic)',k:'Brazzaville',id:'178',ct:'Africa',a:342},
  {c:'Costa Rica',k:'San Jose',id:'188',ct:'N. America',a:51},{c:'Croatia',k:'Zagreb',id:'191',ct:'Europe',a:57},{c:'Cuba',k:'Havana',id:'192',ct:'N. America',a:110},{c:'Cyprus',k:'Nicosia',id:'196',ct:'Europe',a:10},
  {c:'Czech Republic',k:'Prague',id:'203',ct:'Europe',a:79},{c:'Denmark',k:'Copenhagen',id:'208',ct:'Europe',a:43},{c:'Djibouti',k:'Djibouti',id:'262',ct:'Africa',a:23},{c:'Dominica',k:'Roseau',id:'212',ct:'N. America',a:1},
  {c:'Dominican Republic',k:'Santo Domingo',id:'214',ct:'N. America',a:49},{c:'East Timor',k:'Dili',id:'626',ct:'Asia',a:15},{c:'Ecuador',k:'Quito',id:'218',ct:'S. America',a:284},{c:'Egypt',k:'Cairo',id:'818',ct:'Africa',a:1001},
  {c:'El Salvador',k:'San Salvador',id:'222',ct:'N. America',a:21},{c:'Equatorial Guinea',k:'Malabo',id:'226',ct:'Africa',a:28},{c:'Eritrea',k:'Asmara',id:'232',ct:'Africa',a:118},{c:'Estonia',k:'Tallinn',id:'233',ct:'Europe',a:45},
  {c:'Eswatini',k:'Mbabane',id:'748',ct:'Africa',a:17},{c:'Ethiopia',k:'Addis Ababa',id:'231',ct:'Africa',a:1104},{c:'Fiji',k:'Suva',id:'242',ct:'Oceania',a:18},{c:'Finland',k:'Helsinki',id:'246',ct:'Europe',a:338},
  {c:'France',k:'Paris',id:'250',ct:'Europe',a:641},{c:'Gabon',k:'Libreville',id:'266',ct:'Africa',a:268},{c:'Gambia',k:'Banjul',id:'270',ct:'Africa',a:11},{c:'Georgia',k:'Tbilisi',id:'268',ct:'Asia',a:70},
  {c:'Germany',k:'Berlin',id:'276',ct:'Europe',a:357},{c:'Ghana',k:'Accra',id:'288',ct:'Africa',a:239},{c:'Greece',k:'Athens',id:'300',ct:'Europe',a:132},{c:'Grenada',k:"St. George's",id:'308',ct:'N. America',a:0.3},
  {c:'Guatemala',k:'Guatemala City',id:'320',ct:'N. America',a:109},{c:'Guinea',k:'Conakry',id:'324',ct:'Africa',a:246},{c:'Guinea-Bissau',k:'Bissau',id:'624',ct:'Africa',a:36},{c:'Guyana',k:'Georgetown',id:'328',ct:'S. America',a:215},
  {c:'Haiti',k:'Port-au-Prince',id:'332',ct:'N. America',a:28},{c:'Honduras',k:'Tegucigalpa',id:'340',ct:'N. America',a:112},{c:'Hungary',k:'Budapest',id:'348',ct:'Europe',a:93},{c:'Iceland',k:'Reykjavik',id:'352',ct:'Europe',a:103},
  {c:'India',k:'New Delhi',id:'356',ct:'Asia',a:3287},{c:'Indonesia',k:'Jakarta',id:'360',ct:'Asia',a:1905},{c:'Iran',k:'Tehran',id:'364',ct:'Asia',a:1648},{c:'Iraq',k:'Baghdad',id:'368',ct:'Asia',a:438},
  {c:'Ireland',k:'Dublin',id:'372',ct:'Europe',a:70},{c:'Israel',k:'Jerusalem',id:'376',ct:'Asia',a:22},{c:'Italy',k:'Rome',id:'380',ct:'Europe',a:301},{c:'Ivory Coast',k:'Yamoussoukro',id:'384',ct:'Africa',a:322},
  {c:'Jamaica',k:'Kingston',id:'388',ct:'N. America',a:11},{c:'Japan',k:'Tokyo',id:'392',ct:'Asia',a:378},{c:'Jordan',k:'Amman',id:'400',ct:'Asia',a:89},{c:'Kazakhstan',k:'Astana',id:'398',ct:'Asia',a:2725},
  {c:'Kenya',k:'Nairobi',id:'404',ct:'Africa',a:580},{c:'Kiribati',k:'Tarawa',id:'296',ct:'Oceania',a:1},{c:'Kosovo',k:'Pristina',id:'-99',ct:'Europe',a:11},{c:'Kuwait',k:'Kuwait City',id:'414',ct:'Asia',a:18},
  {c:'Kyrgyzstan',k:'Bishkek',id:'417',ct:'Asia',a:200},{c:'Laos',k:'Vientiane',id:'418',ct:'Asia',a:237},{c:'Latvia',k:'Riga',id:'428',ct:'Europe',a:65},{c:'Lebanon',k:'Beirut',id:'422',ct:'Asia',a:10},
  {c:'Lesotho',k:'Maseru',id:'426',ct:'Africa',a:30},{c:'Liberia',k:'Monrovia',id:'430',ct:'Africa',a:111},{c:'Libya',k:'Tripoli',id:'434',ct:'Africa',a:1760},{c:'Liechtenstein',k:'Vaduz',id:'438',ct:'Europe',a:0.2},
  {c:'Lithuania',k:'Vilnius',id:'440',ct:'Europe',a:65},{c:'Luxembourg',k:'Luxembourg City',id:'442',ct:'Europe',a:3},{c:'Madagascar',k:'Antananarivo',id:'450',ct:'Africa',a:587},{c:'Malawi',k:'Lilongwe',id:'454',ct:'Africa',a:118},
  {c:'Malaysia',k:'Kuala Lumpur',id:'458',ct:'Asia',a:330},{c:'Maldives',k:'Male',id:'462',ct:'Asia',a:0.3},{c:'Mali',k:'Bamako',id:'466',ct:'Africa',a:1240},{c:'Malta',k:'Valletta',id:'470',ct:'Europe',a:0.3},
  {c:'Marshall Islands',k:'Majuro',id:'584',ct:'Oceania',a:0.2},{c:'Mauritania',k:'Nouakchott',id:'478',ct:'Africa',a:1031},{c:'Mauritius',k:'Port Louis',id:'480',ct:'Africa',a:2},{c:'Mexico',k:'Mexico City',id:'484',ct:'N. America',a:1964},
  {c:'Micronesia',k:'Palikir',id:'583',ct:'Oceania',a:1},{c:'Moldova',k:'Chisinau',id:'498',ct:'Europe',a:34},{c:'Monaco',k:'Monaco',id:'492',ct:'Europe',a:0.002},{c:'Mongolia',k:'Ulaanbaatar',id:'496',ct:'Asia',a:1564},
  {c:'Montenegro',k:'Podgorica',id:'499',ct:'Europe',a:14},{c:'Morocco',k:'Rabat',id:'504',ct:'Africa',a:447},{c:'Mozambique',k:'Maputo',id:'508',ct:'Africa',a:802},{c:'Myanmar',k:'Naypyidaw',id:'104',ct:'Asia',a:677},
  {c:'Namibia',k:'Windhoek',id:'516',ct:'Africa',a:824},{c:'Nauru',k:'Yaren',id:'520',ct:'Oceania',a:0.02},{c:'Nepal',k:'Kathmandu',id:'524',ct:'Asia',a:147},{c:'Netherlands',k:'Amsterdam',id:'528',ct:'Europe',a:42},
  {c:'New Zealand',k:'Wellington',id:'554',ct:'Oceania',a:268},{c:'Nicaragua',k:'Managua',id:'558',ct:'N. America',a:130},{c:'Niger',k:'Niamey',id:'562',ct:'Africa',a:1267},{c:'Nigeria',k:'Abuja',id:'566',ct:'Africa',a:924},
  {c:'North Korea',k:'Pyongyang',id:'408',ct:'Asia',a:121},{c:'North Macedonia',k:'Skopje',id:'807',ct:'Europe',a:26},{c:'Norway',k:'Oslo',id:'578',ct:'Europe',a:385},{c:'Oman',k:'Muscat',id:'512',ct:'Asia',a:310},
  {c:'Pakistan',k:'Islamabad',id:'586',ct:'Asia',a:881},{c:'Palau',k:'Ngerulmud',id:'585',ct:'Oceania',a:0.5},{c:'Palestine',k:'Ramallah',id:'275',ct:'Asia',a:6},{c:'Panama',k:'Panama City',id:'591',ct:'N. America',a:76},
  {c:'Papua New Guinea',k:'Port Moresby',id:'598',ct:'Oceania',a:463},{c:'Paraguay',k:'Asuncion',id:'600',ct:'S. America',a:407},{c:'Peru',k:'Lima',id:'604',ct:'S. America',a:1285},{c:'Philippines',k:'Manila',id:'608',ct:'Asia',a:300},
  {c:'Poland',k:'Warsaw',id:'616',ct:'Europe',a:313},{c:'Portugal',k:'Lisbon',id:'620',ct:'Europe',a:92},{c:'Qatar',k:'Doha',id:'634',ct:'Asia',a:12},{c:'Romania',k:'Bucharest',id:'642',ct:'Europe',a:238},
  {c:'Russia',k:'Moscow',id:'643',ct:'Europe',a:17098},{c:'Rwanda',k:'Kigali',id:'646',ct:'Africa',a:26},{c:'Saint Kitts and Nevis',k:'Basseterre',id:'659',ct:'N. America',a:0.3},{c:'Saint Lucia',k:'Castries',id:'662',ct:'N. America',a:0.6},
  {c:'Saint Vincent',k:'Kingstown',id:'670',ct:'N. America',a:0.4},{c:'Samoa',k:'Apia',id:'882',ct:'Oceania',a:3},{c:'San Marino',k:'San Marino',id:'674',ct:'Europe',a:0.06},{c:'Sao Tome and Principe',k:'Sao Tome',id:'678',ct:'Africa',a:1},
  {c:'Saudi Arabia',k:'Riyadh',id:'682',ct:'Asia',a:2150},{c:'Senegal',k:'Dakar',id:'686',ct:'Africa',a:197},{c:'Serbia',k:'Belgrade',id:'688',ct:'Europe',a:88},{c:'Seychelles',k:'Victoria',id:'690',ct:'Africa',a:0.5},
  {c:'Sierra Leone',k:'Freetown',id:'694',ct:'Africa',a:72},{c:'Singapore',k:'Singapore',id:'702',ct:'Asia',a:1},{c:'Slovakia',k:'Bratislava',id:'703',ct:'Europe',a:49},{c:'Slovenia',k:'Ljubljana',id:'705',ct:'Europe',a:21},
  {c:'Solomon Islands',k:'Honiara',id:'090',ct:'Oceania',a:29},{c:'Somalia',k:'Mogadishu',id:'706',ct:'Africa',a:638},{c:'South Africa',k:'Pretoria',id:'710',ct:'Africa',a:1219},{c:'South Korea',k:'Seoul',id:'410',ct:'Asia',a:100},
  {c:'South Sudan',k:'Juba',id:'728',ct:'Africa',a:619},{c:'Spain',k:'Madrid',id:'724',ct:'Europe',a:506},{c:'Sri Lanka',k:'Colombo',id:'144',ct:'Asia',a:66},{c:'Sudan',k:'Khartoum',id:'729',ct:'Africa',a:1886},
  {c:'Suriname',k:'Paramaribo',id:'740',ct:'S. America',a:164},{c:'Sweden',k:'Stockholm',id:'752',ct:'Europe',a:450},{c:'Switzerland',k:'Bern',id:'756',ct:'Europe',a:41},{c:'Syria',k:'Damascus',id:'760',ct:'Asia',a:185},
  {c:'Taiwan',k:'Taipei',id:'158',ct:'Asia',a:36},{c:'Tajikistan',k:'Dushanbe',id:'762',ct:'Asia',a:143},{c:'Tanzania',k:'Dodoma',id:'834',ct:'Africa',a:945},{c:'Thailand',k:'Bangkok',id:'764',ct:'Asia',a:513},
  {c:'Togo',k:'Lome',id:'768',ct:'Africa',a:57},{c:'Tonga',k:"Nuku'alofa",id:'776',ct:'Oceania',a:1},{c:'Trinidad and Tobago',k:'Port of Spain',id:'780',ct:'N. America',a:5},{c:'Tunisia',k:'Tunis',id:'788',ct:'Africa',a:164},
  {c:'Turkey',k:'Ankara',id:'792',ct:'Asia',a:784},{c:'Turkmenistan',k:'Ashgabat',id:'795',ct:'Asia',a:488},{c:'Tuvalu',k:'Funafuti',id:'798',ct:'Oceania',a:0.03},{c:'Uganda',k:'Kampala',id:'800',ct:'Africa',a:242},
  {c:'Ukraine',k:'Kyiv',id:'804',ct:'Europe',a:604},{c:'United Arab Emirates',k:'Abu Dhabi',id:'784',ct:'Asia',a:84},{c:'United Kingdom',k:'London',id:'826',ct:'Europe',a:243},{c:'United States',k:'Washington D.C.',id:'840',ct:'N. America',a:9834},
  {c:'Uruguay',k:'Montevideo',id:'858',ct:'S. America',a:176},{c:'Uzbekistan',k:'Tashkent',id:'860',ct:'Asia',a:449},{c:'Vanuatu',k:'Port Vila',id:'548',ct:'Oceania',a:12},{c:'Vatican City',k:'Vatican City',id:'336',ct:'Europe',a:0.0004},
  {c:'Venezuela',k:'Caracas',id:'862',ct:'S. America',a:916},{c:'Vietnam',k:'Hanoi',id:'704',ct:'Asia',a:331},{c:'Yemen',k:'Sanaa',id:'887',ct:'Asia',a:528},{c:'Zambia',k:'Lusaka',id:'894',ct:'Africa',a:753},{c:'Zimbabwe',k:'Harare',id:'716',ct:'Africa',a:391},
];

const TOTAL = DATA.length;
const TOTAL_WORLD_AREA = DATA.reduce((s, d) => s + d.a, 0);
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
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
const fmtTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

// Build lookup: numericISO → quiz index
const idToIdx = {};
DATA.forEach((d, i) => { if (d.id) idToIdx[d.id] = i; });

// Build alternate accepted answers → index in DATA
// Each key is a normalized alternate spelling; value is the DATA index it maps to
const ALTS = {};
const altEntries = [
  // Bolivia: La Paz is the seat of government; Sucre is the constitutional capital — both should count
  ['La Paz', 'Sucre'],
  // Short forms for "City" capitals
  ['Washington', 'Washington D.C.'], ['Washington DC', 'Washington D.C.'], ['Washington D.C', 'Washington D.C.'],
  ['Mexico', 'Mexico City'], ['Ciudad de Mexico', 'Mexico City'], ['Mexico DF', 'Mexico City'],
  ['Kuwait', 'Kuwait City'], ['Luxembourg', 'Luxembourg City'], ['Guatemala', 'Guatemala City'],
  ['Panama', 'Panama City'], ['Vatican', 'Vatican City'],
  // Diacritics / transliterations
  ['Brasília', 'Brasilia'], ['Yaoundé', 'Yaounde'], ['Lomé', 'Lome'], ['Bogotá', 'Bogota'],
  ['Asunción', 'Asuncion'], ['Chișinău', 'Chisinau'], ['Kishinev', 'Chisinau'],
  ['São Tomé', 'Sao Tome'], ['São Tome', 'Sao Tome'],
  ['Malé', 'Male'], ['Reykjavík', 'Reykjavik'],
  // Historic / alternate names
  ['Kiev', 'Kyiv'], ['Ulan Bator', 'Ulaanbaatar'], ['Ulan Baatar', 'Ulaanbaatar'],
  ['Peking', 'Beijing'], ['Djakarta', 'Jakarta'], ['Bombay', 'New Delhi'], ['Delhi', 'New Delhi'],
  ['Tananarivo', 'Antananarivo'], ['Tananarive', 'Antananarivo'],
  ['Nur-Sultan', 'Astana'], ['Nur Sultan', 'Astana'],
  ['Prishtina', 'Pristina'], ['Prishtine', 'Pristina'],
  ['Rangoon', 'Naypyidaw'], ['Lefkosia', 'Nicosia'],
  ['Abu Dabi', 'Abu Dhabi'], ['Taipeh', 'Taipei'],
  ['Addis Abeba', 'Addis Ababa'],
  // Apostrophe / punctuation variants
  ['Nukualofa', "Nuku\'alofa"], ['Nuku alofa', "Nuku\'alofa"],
  ['NDjamena', "N\'Djamena"], ['Ndjamena', "N\'Djamena"], ['N Djamena', "N\'Djamena"],
  ['Port au Prince', 'Port-au-Prince'], ['Porto Novo', 'Porto-Novo'],
  ['St Johns', "St. John\'s"], ['Saint Johns', "St. John\'s"],
  ['St Georges', "St. George\'s"], ['Saint Georges', "St. George\'s"],
  ['Saint George', "St. George\'s"], ['St George', "St. George\'s"],
  // Other common variants
  ['Bandar Seri Begwan', 'Bandar Seri Begawan'],
  ['Sri Jayawardenepura Kotte', 'Colombo'], ['Kotte', 'Colombo'],
  ['Pretoria', 'Pretoria'], ['Cape Town', 'Pretoria'], ['Bloemfontein', 'Pretoria'],
  ['Pnom Penh', 'Phnom Penh'], ['Phnom Pen', 'Phnom Penh'],
  ['Andorra La Vella', 'Andorra la Vella'],
  ['Funafuti Atoll', 'Funafuti'], ['South Tarawa', 'Tarawa'], ['Tarawa Atoll', 'Tarawa'],
  ['Sana a', 'Sanaa'], ['San a', 'Sanaa'], ["Sana\'a", 'Sanaa'],
];
// Build lookup: find the DATA index for each canonical capital, then map alternates
const capitalToIdx = {};
DATA.forEach((d, i) => { capitalToIdx[norm(d.k)] = i; });
altEntries.forEach(([alt, canonical]) => {
  const idx = capitalToIdx[norm(canonical)];
  if (idx !== undefined) ALTS[norm(alt)] = idx;
});


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
  trackEvent('quiz_start', { quiz: 'capitals' });
  render(); startTimer();
  if (window.innerWidth > 768) {
    setTimeout(() => document.getElementById('cq-input')?.focus(), 100);
  }
};

// ── Check answer ──
const checkAnswer = (val) => {
  const n = norm(val);
  if (!n) return;
  for (let i = 0; i < DATA.length; i++) {
    if (answered.has(i)) continue;
    if (norm(DATA[i].k) === n || (ALTS[n] === i)) {
      answered.add(i);
      score++;
      lastAnswered = `${DATA[i].k} — ${DATA[i].c}`;
      document.getElementById('cq-input').value = '';
      document.getElementById('cq-input').focus();
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


// ── AI Performance Analysis ──
const generateAnalysis = (score, total, pct, contStats, areaPct, answered) => {
  const timeUsed = (TIMER_MINUTES * 60) - timeLeft;
  const pacePerMin = timeUsed > 0 ? Math.round(score / (timeUsed / 60) * 10) / 10 : 0;

  // Determine overall level
  let level, emoji;
  if (pct >= 95) { level = 'exceptional'; emoji = 'Outstanding'; }
  else if (pct >= 80) { level = 'excellent'; emoji = 'Excellent'; }
  else if (pct >= 60) { level = 'good'; emoji = 'Good'; }
  else if (pct >= 40) { level = 'average'; emoji = 'Average'; }
  else if (pct >= 20) { level = 'below average'; emoji = 'Below Average'; }
  else { level = 'beginner'; emoji = 'Beginner'; }

  // Find strongest and weakest continents
  const sorted = [...contStats].sort((a, b) => b.pct - a.pct);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  // Build analysis paragraphs
  let analysis = '';

  // Opening assessment
  if (pct === 100) {
    analysis += `A perfect score — you named every single capital in the world. This is a rare and exceptional achievement that demonstrates comprehensive geographical knowledge. Truly impressive.`;
  } else if (pct >= 80) {
    analysis += `An ${emoji.toLowerCase()} result. Naming ${score} out of ${total} capitals (${pct}%) shows a strong command of world geography. Your knowledge covered ${areaPct}% of the world\'s land area, which is remarkable.`;
  } else if (pct >= 60) {
    analysis += `A ${emoji.toLowerCase()} result. You named ${score} out of ${total} capitals (${pct}%), demonstrating solid geographical knowledge. Your answers covered ${areaPct}% of the world\'s territory.`;
  } else if (pct >= 40) {
    analysis += `You named ${score} out of ${total} capitals (${pct}%), which is an ${emoji.toLowerCase()} score. Your answers covered ${areaPct}% of the world\'s territory. There\'s room to grow, especially in some regions.`;
  } else if (pct >= 20) {
    analysis += `You named ${score} out of ${total} capitals (${pct}%). This is a ${emoji.toLowerCase()} result, but geography is a vast subject and every answer counts. Your answers covered ${areaPct}% of the world\'s territory.`;
  } else {
    analysis += `You named ${score} out of ${total} capitals (${pct}%). This quiz covers a lot of ground — 197 countries across 6 continents. Every capital you learn is progress.`;
  }

  // Continental breakdown
  if (best && best.pct > 0) {
    analysis += ` Your strongest continent was ${best.ct} at ${best.pct}% (${best.got}/${best.total}).`;
  }
  if (worst && worst.pct < best.pct) {
    analysis += ` ${worst.ct} was your most challenging region at ${worst.pct}% (${worst.got}/${worst.total}).`;
  }

  // Specific observations
  const europeStats = contStats.find(c => c.ct === 'Europe');
  const africaStats = contStats.find(c => c.ct === 'Africa');
  const asiaStats = contStats.find(c => c.ct === 'Asia');
  const oceaniaStats = contStats.find(c => c.ct === 'Oceania');

  if (africaStats && africaStats.pct < 20 && pct >= 40) {
    analysis += ` African capitals are notoriously tricky — they tend to be the most commonly missed globally, so don\'t be discouraged.`;
  }
  if (oceaniaStats && oceaniaStats.pct < 30 && pct >= 30) {
    analysis += ` Oceania\'s small island nations are among the hardest capitals to recall.`;
  }
  if (europeStats && europeStats.pct >= 80) {
    analysis += ` Your European geography is particularly strong.`;
  }

  // Pace
  if (pacePerMin >= 3) {
    analysis += ` Your pace of ${pacePerMin} answers per minute shows confident recall.`;
  }

  // Encouragement
  if (pct < 60 && pct >= 20) {
    analysis += ` To improve, try focusing on one continent at a time — it makes 197 countries much more manageable.`;
  }

  return { level: emoji, analysis };
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
          <div class="fb-card-label" style="margin-bottom:12px;padding:0 0 12px;border-bottom:1px solid rgba(255,255,255,0.06)"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg> WORLD CAPITALS QUIZ</div>
          <div class="cq-toolbar">
            <div class="cq-toolbar-left">
              <input type="text" id="cq-input" class="cq-input" placeholder="Type a capital city..." autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" inputmode="text" />
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
    if (window.innerWidth > 768) document.getElementById('cq-input')?.focus();
    return;
  }

  // Done
  const pct = Math.round((score / TOTAL) * 100);
  const grade = pct === 100 ? 'PERFECT!' : pct >= 80 ? 'EXCELLENT' : pct >= 60 ? 'GREAT JOB' : pct >= 40 ? 'GOOD EFFORT' : 'KEEP PRACTICING';

  // Per-continent stats
  const continents = ['Africa','Asia','Europe','N. America','S. America','Oceania'];
  const contStats = continents.map(ct => {
    const total = DATA.filter(d => d.ct === ct).length;
    const got = DATA.filter((d, i) => d.ct === ct && answered.has(i)).length;
    return { ct, total, got, pct: total ? Math.round((got / total) * 100) : 0 };
  });

  // Territory coverage
  const answeredArea = DATA.filter((_, i) => answered.has(i)).reduce((s, d) => s + d.a, 0);
  const areaPct = Math.round((answeredArea / TOTAL_WORLD_AREA) * 100);

  // Full answer list sorted by continent then name
  const allAnswers = DATA.map((d, i) => ({ ...d, idx: i, got: answered.has(i) }))
    .sort((a, b) => a.ct.localeCompare(b.ct) || a.c.localeCompare(b.c));

  app.innerHTML = `
    <section class="cq-section">
      <div class="cq-container cq-container--wide">
        <div class="cq-header">
          <h1 class="cq-title">${grade}</h1>
          <p class="cq-subtitle">You named <strong>${score}</strong> of <strong>${TOTAL}</strong> capitals (${pct}%)</p>
        </div>

        <div class="cq-stats-row">
          <div class="cq-big-stat">
            <div class="cq-big-stat-value">${pct}%</div>
            <div class="cq-big-stat-label">Countries</div>
          </div>
          <div class="cq-big-stat">
            <div class="cq-big-stat-value">${areaPct}%</div>
            <div class="cq-big-stat-label">World Territory</div>
          </div>
        </div>

        <div class="cq-ai-analysis">
          <div class="cq-ai-analysis-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
            <span>PERFORMANCE ANALYSIS</span>
            <span class="cq-ai-level">${generateAnalysis(score, TOTAL, pct, contStats, areaPct, answered).level}</span>
          </div>
          <p class="cq-ai-text">${generateAnalysis(score, TOTAL, pct, contStats, areaPct, answered).analysis}</p>
        </div>

        <div class="cq-continent-stats">
          ${contStats.map(cs => `
            <div class="cq-cont-stat">
              <div class="cq-cont-header">
                <span class="cq-cont-name">${cs.ct}</span>
                <span class="cq-cont-score">${cs.got}/${cs.total}</span>
              </div>
              <div class="cq-cont-bar"><div class="cq-cont-fill" style="width:${cs.pct}%"></div></div>
            </div>
          `).join('')}
        </div>

        <div class="cq-map-container cq-map-container--result">
          ${renderMapSVG()}
        </div>

        <button class="cq-start-btn" id="cq-restart" style="margin-top:24px;">Play Again</button>

        <div class="cq-all-answers">
          <div class="cq-missed-label">All Answers</div>
          ${continents.map(ct => {
            const items = allAnswers.filter(a => a.ct === ct);
            if (!items.length) return '';
            return `
              <div class="cq-answer-continent">${ct}</div>
              <div class="cq-grid cq-grid--result">
                ${items.map(a => `
                  <div class="cq-row ${a.got ? 'cq-row--correct' : 'cq-row--missed'}">
                    <span class="cq-country">${a.c}</span>
                    <span class="cq-capital ${a.got ? '' : 'cq-capital--missed'}">${a.k}</span>
                  </div>
                `).join('')}
              </div>
            `;
          }).join('')}
        </div>
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
