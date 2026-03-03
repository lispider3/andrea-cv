import '../src/style.css';

const ODDS_API_KEY = 'e67c22de5664471109480ba217a832c7';
const SPORT = 'soccer_italy_serie_a';
const API_BASE = 'https://api.the-odds-api.com/v4';
const TEAM = 'Juventus';

let oddsData = [];
let scoresData = [];
let eventsData = [];
let loading = true;
let error = null;
let standingsData = [];
let previewText = '';

// ── Team logos (populated dynamically from ESPN API) ──
const TEAM_LOGOS = {};
const getLogo = (name) => {
  if (TEAM_LOGOS[name]) return TEAM_LOGOS[name];
  // Fuzzy match
  const key = Object.keys(TEAM_LOGOS).find(k => name.includes(k) || k.includes(name));
  return key ? TEAM_LOGOS[key] : '';
};
const logoImg = (name, size = 24) => { const src = getLogo(name); return src ? `<img src="${src}" alt="${name}" width="${size}" height="${size}" style="border-radius:4px;object-fit:contain;" loading="lazy">` : ''; };


const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

const loadData = async () => {
  loading = true;
  render();
  try {
    // Fetch standings
    try {
      let sRes = await fetch('/api/standings');
      if (sRes.ok) {
        const ct = sRes.headers.get('content-type') || '';
        if (ct.includes('json')) {
          const sData = await sRes.json();
          standingsData = sData.standings || [];
        } else { throw new Error('Not JSON'); }
      } else { throw new Error('API failed'); }
    } catch(e) {
      try {
        const espn = await fetch('https://site.api.espn.com/apis/v2/sports/soccer/ita.1/standings');
        const d = await espn.json();
        const entries = d?.children?.[0]?.standings?.entries || [];
        const nameMap = { 'Internazionale': 'Inter', 'Hellas Verona FC': 'Hellas Verona', 'SSC Napoli': 'Napoli' };
        standingsData = entries.map(e => {
          const stats = {}; (e.stats||[]).forEach(s => stats[s.name] = s.value);
          const raw = e.team?.displayName || '?';
          const logo = e.team?.logos?.[0]?.href || '';
          const name = nameMap[raw]||raw;
          if (logo) TEAM_LOGOS[name] = logo;
          return { name, p: Math.round(stats.gamesPlayed||0), w: Math.round(stats.wins||0), d: Math.round(stats.ties||0), l: Math.round(stats.losses||0), gf: Math.round(stats.pointsFor||0), ga: Math.round(stats.pointsAgainst||0), pts: Math.round(stats.points||0) };
        }).sort((a,b) => b.pts - a.pts || (b.gf-b.ga)-(a.gf-a.ga));
      } catch(e2) {}
    }

    const [odds, scores, events] = await Promise.all([
      fetchJSON(`${API_BASE}/sports/${SPORT}/odds?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`).catch(() => []),
      fetchJSON(`${API_BASE}/sports/${SPORT}/scores?apiKey=${ODDS_API_KEY}&daysFrom=3`).catch(() => []),
      fetchJSON(`${API_BASE}/sports/${SPORT}/events?apiKey=${ODDS_API_KEY}`).catch(() => []),
    ]);
    oddsData = odds; scoresData = scores; eventsData = events;

    // Fetch AI preview
    const juveEvents = eventsData.filter(isJuve).filter(e => new Date(e.commence_time) > new Date()).sort((a,b) => new Date(a.commence_time)-new Date(b.commence_time));
    const nextEv = juveEvents[0] || oddsData.filter(isJuve)[0];
    if (nextEv) {
      try {
        const pRes = await fetch(`/api/preview?home=${encodeURIComponent(nextEv.home_team)}&away=${encodeURIComponent(nextEv.away_team)}`);
        const ct = pRes.headers.get('content-type') || '';
        if (pRes.ok && ct.includes('json')) {
          const pData = await pRes.json();
          previewText = pData.preview || '';
        } else { throw new Error('Not JSON'); }
      } catch(e) {
        previewText = generateClientPreview(nextEv.home_team, nextEv.away_team, standingsData);
      }
    }
    loading = false;
  } catch (e) {
    error = e.message;
    loading = false;
  }
  render();
};

// ── Helpers ──
const isJuve = (ev) => ev.home_team === TEAM || ev.away_team === TEAM;
const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const getAvgOdds = (event) => {
  const h2hMarkets = [];
  (event.bookmakers || []).forEach(b => {
    const m = b.markets.find(m => m.key === 'h2h');
    if (m) h2hMarkets.push(m.outcomes);
  });
  if (!h2hMarkets.length) return null;
  const teams = {};
  h2hMarkets.forEach(outcomes => {
    outcomes.forEach(o => {
      if (!teams[o.name]) teams[o.name] = [];
      teams[o.name].push(o.price);
    });
  });
  const avg = {};
  Object.keys(teams).forEach(name => {
    avg[name] = (teams[name].reduce((a, b) => a + b, 0) / teams[name].length).toFixed(2);
  });
  return avg;
};

const generateClientPreview = (home, away, standings) => {
  const find = (name) => standings.find(t => t.name === name || name.includes(t.name));
  const hs = find(home); const as = find(away);
  if (!hs || !as) return `${home} host ${away} in a key Serie A showdown.`;
  const homeGD = hs.gf - hs.ga;
  const lines = [];
  if (Math.abs(hs.pts - as.pts) <= 8) lines.push(`A pivotal clash as ${home} (${hs.pts}pts) host ${away} (${as.pts}pts) with just ${Math.abs(hs.pts-as.pts)} points between them.`);
  else lines.push(`${home} (${hs.pts}pts) welcome ${away} (${as.pts}pts) to their home ground.`);
  if (hs.w > hs.l) lines.push(`The hosts have been solid with ${hs.w} wins from ${hs.p} games and a GD of ${homeGD > 0 ? '+':''}${homeGD}.`);
  if (as.d >= 6) lines.push(`${away} have drawn ${as.d} times this season, hinting at another tight encounter.`);
  else if (as.w > as.l) lines.push(`${away} arrive with ${as.w} wins and ${as.gf} goals scored this campaign.`);
  return lines.join(' ');
};

// ══════════════════════════════════════════════
// JUVENTUS TOP-5 SCORERS QUIZ (1992/93 — 2024/25)
// ══════════════════════════════════════════════
const JUVE_SEASONS = [
  {s:'92/93',p:[['Roberto Baggio',21],['Andreas Möller',10],['Gianluca Vialli',6],['Fabrizio Ravanelli',5],['David Platt',3],['Paolo Di Canio',3]]},
  {s:'93/94',p:[['Roberto Baggio',17],['Andreas Möller',9],['Fabrizio Ravanelli',9],['Alessandro Del Piero',5],['Gianluca Vialli',4],['Antonio Conte',4]]},
  {s:'94/95',p:[['Gianluca Vialli',17],['Fabrizio Ravanelli',10],['Alessandro Del Piero',8],['Roberto Baggio',8],['Didier Deschamps',3]]},
  {s:'95/96',p:[['Alessandro Del Piero',16],['Gianluca Vialli',12],['Fabrizio Ravanelli',10],['Alen Bokšić',7],['Attilio Lombardo',4]]},
  {s:'96/97',p:[['Alen Bokšić',13],['Alessandro Del Piero',8],['Christian Vieri',6],['Nicola Amoruso',5],['Zinédine Zidane',5]]},
  {s:'97/98',p:[['Alessandro Del Piero',21],['Filippo Inzaghi',18],['Zinédine Zidane',7],['Antonio Conte',4],['Daniel Fonseca',4]]},
  {s:'98/99',p:[['Filippo Inzaghi',13],['Alessandro Del Piero',9],['Zinédine Zidane',4],['Darko Kovačević',4],['Antonio Conte',3]]},
  {s:'99/00',p:[['Alessandro Del Piero',9],['Filippo Inzaghi',9],['Zinédine Zidane',4],['Darko Kovačević',4],['Edgar Davids',3]]},
  {s:'00/01',p:[['David Trézéguet',9],['Alessandro Del Piero',8],['Zinédine Zidane',6],['Filippo Inzaghi',6],['Gianluca Zambrotta',4]]},
  {s:'01/02',p:[['David Trézéguet',24],['Alessandro Del Piero',16],['Pavel Nedvěd',4],['Igor Tudor',4],['Ciro Ferrara',3]]},
  {s:'02/03',p:[['David Trézéguet',15],['Alessandro Del Piero',13],['Marcelo Salas',7],['Pavel Nedvěd',5],['Enzo Maresca',3]]},
  {s:'03/04',p:[['David Trézéguet',16],['Alessandro Del Piero',14],['Pavel Nedvěd',4],['Mauro Camoranesi',4],['Zlatan Ibrahimović',3]]},
  {s:'04/05',p:[['David Trézéguet',17],['Alessandro Del Piero',14],['Zlatan Ibrahimović',8],['Pavel Nedvěd',5],['Mauro Camoranesi',3]]},
  {s:'05/06',p:[['David Trézéguet',18],['Zlatan Ibrahimović',7],['Alessandro Del Piero',6],['Pavel Nedvěd',5],['Adrian Mutu',5]]},
  {s:'06/07*',p:[['Alessandro Del Piero',20],['David Trézéguet',15],['Pavel Nedvěd',11],['Raffaele Palladino',8],['Valeri Bojinov',5]]},
  {s:'07/08',p:[['Alessandro Del Piero',21],['David Trézéguet',12],['Vincenzo Iaquinta',8],['Mauro Camoranesi',6],['Pavel Nedvěd',4]]},
  {s:'08/09',p:[['Alessandro Del Piero',13],['Vincenzo Iaquinta',8],['Amauri',8],['David Trézéguet',7],['Hasan Salihamidžić',3]]},
  {s:'09/10',p:[['Amauri',7],['Alessandro Del Piero',7],['David Trézéguet',6],['Diego',5],['Vincenzo Iaquinta',4]]},
  {s:'10/11',p:[['Alessandro Matri',10],['Fabio Quagliarella',8],['Felipe Melo',5],['Alessandro Del Piero',4],['Claudio Marchisio',3]]},
  {s:'11/12',p:[['Alessandro Matri',10],['Fabio Quagliarella',7],['Claudio Marchisio',5],['Mirko Vučinić',5],['Arturo Vidal',5]]},
  {s:'12/13',p:[['Arturo Vidal',10],['Fabio Quagliarella',8],['Mirko Vučinić',7],['Sebastian Giovinco',7],['Alessandro Matri',6]]},
  {s:'13/14',p:[['Carlos Tévez',19],['Fernando Llorente',14],['Paul Pogba',7],['Arturo Vidal',6],['Claudio Marchisio',5]]},
  {s:'14/15',p:[['Carlos Tévez',20],['Álvaro Morata',7],['Paul Pogba',7],['Arturo Vidal',4],['Leonardo Bonucci',3]]},
  {s:'15/16',p:[['Paulo Dybala',19],['Álvaro Morata',7],['Paul Pogba',7],['Gonzalo Higuaín',5],['Mario Mandžukić',3]]},
  {s:'16/17',p:[['Gonzalo Higuaín',24],['Paulo Dybala',11],['Mario Mandžukić',10],['Miralem Pjanić',5],['Juan Cuadrado',4]]},
  {s:'17/18',p:[['Gonzalo Higuaín',16],['Paulo Dybala',14],['Douglas Costa',4],['Blaise Matuidi',4],['Miralem Pjanić',4]]},
  {s:'18/19',p:[['Cristiano Ronaldo',21],['Mario Mandžukić',9],['Moise Kean',6],['Paulo Dybala',5],['Emre Can',4]]},
  {s:'19/20',p:[['Cristiano Ronaldo',31],['Paulo Dybala',11],['Gonzalo Higuaín',8],['Matthijs de Ligt',4],['Leonardo Bonucci',4]]},
  {s:'20/21',p:[['Cristiano Ronaldo',29],['Álvaro Morata',11],['Federico Chiesa',8],['Juan Cuadrado',4],['Adrien Rabiot',4]]},
  {s:'21/22',p:[['Dušan Vlahović',9],['Álvaro Morata',8],['Paulo Dybala',7],['Moise Kean',5],['Juan Cuadrado',4]]},
  {s:'22/23',p:[['Dušan Vlahović',10],['Arkadiusz Milik',6],['Adrien Rabiot',6],['Federico Chiesa',5],['Ángel Di María',4]]},
  {s:'23/24',p:[['Dušan Vlahović',16],['Federico Chiesa',9],['Arkadiusz Milik',5],['Timothy Weah',4],['Andrea Cambiaso',3]]},
  {s:'24/25',p:[['Dušan Vlahović',10],['Randal Kolo Muani',8],['Kenan Yıldız',7],['Timothy Weah',5],['Kephren Thuram',4]]},
];

// Build lookup for quiz
const jNorm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
const JUVE_LOOKUP = {};
JUVE_SEASONS.forEach((season, si) => {
  season.p.forEach((entry, pi) => {
    const key = jNorm(entry[0]);
    if (!JUVE_LOOKUP[key]) JUVE_LOOKUP[key] = [];
    JUVE_LOOKUP[key].push({ si, pi });
    // Also add last name only
    const parts = entry[0].split(' ');
    if (parts.length > 1) {
      const lastName = jNorm(parts[parts.length - 1]);
      if (!JUVE_LOOKUP[lastName]) JUVE_LOOKUP[lastName] = [];
      JUVE_LOOKUP[lastName].push({ si, pi });
    }
  });
});

let quizState = 'idle'; // idle | playing | done
let quizAnswered = new Set(); // "si-pi" keys
let quizTotal = JUVE_SEASONS.reduce((s, season) => s + season.p.length, 0);
let quizTimerInterval = null;
let quizTimeLeft = 900; // 15 minutes

const startQuiz = () => {
  quizState = 'playing';
  quizAnswered = new Set();
  quizTimeLeft = 900;
  render();
  const inp = document.getElementById('juve-quiz-input');
  if (inp) inp.focus();
  quizTimerInterval = setInterval(() => {
    quizTimeLeft--;
    const el = document.getElementById('juve-timer');
    if (el) el.textContent = `${Math.floor(quizTimeLeft/60)}:${(quizTimeLeft%60).toString().padStart(2,'0')}`;
    if (quizTimeLeft <= 0) { endQuiz(); }
  }, 1000);
};

const endQuiz = () => {
  quizState = 'done';
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  render();
};

const checkJuveAnswer = (val) => {
  const n = jNorm(val);
  if (!n || n.length < 2) return false;
  const matches = JUVE_LOOKUP[n];
  if (!matches) return false;
  let found = false;
  matches.forEach(({si, pi}) => {
    const key = `${si}-${pi}`;
    if (!quizAnswered.has(key)) {
      quizAnswered.add(key);
      found = true;
    }
  });
  if (found) {
    render();
    if (quizAnswered.size >= quizTotal) endQuiz();
  }
  return found;
};

const renderQuiz = () => {
  if (quizState === 'idle') {
    return `
      <div class="fb-card fb-quiz-intro">
        <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> JUVENTUS QUIZ</div>
        <h3 class="jq-title">Top-5 Scorers<br><span>Since 1992/93</span></h3>
        <p class="jq-subtitle">Name every player who finished in Juventus' top 5 Serie A scorers across 33 seasons. ${quizTotal} answers. 15 minutes.</p>
        <button class="fb-btn jq-start" id="juve-quiz-start">Start Quiz</button>
      </div>
    `;
  }

  const fmtTime = `${Math.floor(quizTimeLeft/60)}:${(quizTimeLeft%60).toString().padStart(2,'0')}`;
  const grid = JUVE_SEASONS.map((season, si) => {
    const rows = season.p.map(([name, goals], pi) => {
      const key = `${si}-${pi}`;
      const found = quizAnswered.has(key);
      return `<div class="jq-cell ${found ? 'jq-cell--found' : ''} ${quizState==='done' && !found ? 'jq-cell--missed' : ''}">
        <span class="jq-goals">${goals}</span>
        <span class="jq-name">${found || quizState==='done' ? name : ''}</span>
      </div>`;
    }).join('');
    return `<div class="jq-col"><div class="jq-season">${season.s}</div>${rows}</div>`;
  }).join('');

  return `
    <div class="fb-card fb-quiz-active">
      <div class="jq-header">
        <div class="jq-header-left">
          ${quizState === 'playing' ? `<input type="text" id="juve-quiz-input" class="jq-input" placeholder="Type a player name..." autocomplete="off" autocapitalize="off" spellcheck="false">` : ''}
        </div>
        <div class="jq-header-right">
          <span class="jq-score-lbl">SCORE</span>
          <span class="jq-score">${quizAnswered.size} / ${quizTotal}</span>
          <span class="jq-time-lbl">TIME</span>
          <span class="jq-time" id="juve-timer">${fmtTime}</span>
          ${quizState === 'playing' ? `<button class="fb-btn jq-giveup" id="juve-quiz-end">Give Up</button>` : `<button class="fb-btn jq-giveup" id="juve-quiz-restart">Play Again</button>`}
        </div>
      </div>
      <div class="jq-grid" id="juve-quiz-grid">${grid}</div>
    </div>
  `;
};


// ── Render ──
const render = () => {
  const app = document.getElementById('football-app');
  if (!app) return;

  if (loading) {
    app.innerHTML = `<section class="fb-section"><div class="fb-container">
      <div class="fb-loading"><div class="fb-spinner"></div><p>Loading live data...</p></div>
    </div></section>`;
    return;
  }

  if (error) {
    app.innerHTML = `<section class="fb-section"><div class="fb-container">
      <div class="fb-error"><p>⚠ ${error}</p><button onclick="location.reload()" class="fb-btn">Retry</button></div>
    </div></section>`;
    return;
  }

  const juveOdds = oddsData.filter(isJuve);
  const juveUpcoming = eventsData.filter(isJuve).filter(e => new Date(e.commence_time) > new Date()).sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time));
  const nextMatch = juveOdds.length ? juveOdds[0] : (juveUpcoming.length ? juveUpcoming[0] : null);

  app.innerHTML = `
    <section class="fb-section">
      <div class="fb-container">
        <div class="fb-header">
          <div class="fb-badge"><span>SERIE A INFO</span></div>
          <h1 class="fb-title">JUVENTUS<br><span>DASHBOARD</span></h1>
        </div>

        ${nextMatch ? renderNextMatch(nextMatch) : '<p class="fb-empty">No upcoming Juventus matches found.</p>'}

        ${standingsData.length ? renderStandings(standingsData) : ''}

        ${renderQuiz()}
      </div>
    </section>

    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links"><a href="/">← Back to Portfolio</a></div>
        <p class="footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>
  `;

  // Bind quiz events
  document.getElementById('juve-quiz-start')?.addEventListener('click', startQuiz);
  document.getElementById('juve-quiz-end')?.addEventListener('click', endQuiz);
  document.getElementById('juve-quiz-restart')?.addEventListener('click', startQuiz);
  const inp = document.getElementById('juve-quiz-input');
  if (inp) {
    inp.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val.length >= 2 && checkJuveAnswer(val)) {
        inp.value = '';
      }
    });
    inp.focus();
  }
};

// ── Section 1: Next Match (condensed with logos) ──
const renderNextMatch = (match) => {
  const avg = getAvgOdds(match);
  const isLive = new Date(match.commence_time) <= new Date();
  const home = match.home_team;
  const away = match.away_team;

  return `
    <div class="fb-card fb-next-match fb-next-match--compact">
      <div class="fb-card-label">${isLive ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49"/><path d="M7.76 16.24a6 6 0 0 1 0-8.49"/></svg> LIVE' : '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> NEXT MATCH'}</div>
      <div class="fb-match-header fb-match-header--compact">
        <div class="fb-team ${home === TEAM ? 'fb-team--juve' : ''}">
          ${logoImg(home, 36)}
          <div class="fb-team-name">${home}</div>
        </div>
        <div class="fb-match-info">
          <div class="fb-match-date">${formatDate(match.commence_time)}</div>
          <div class="fb-match-time">${formatTime(match.commence_time)}</div>
          <div class="fb-match-vs">VS</div>
        </div>
        <div class="fb-team ${away === TEAM ? 'fb-team--juve' : ''}">
          ${logoImg(away, 36)}
          <div class="fb-team-name">${away}</div>
        </div>
      </div>

      ${avg ? `
        <div class="fb-odds-section fb-odds-compact">
          <div class="fb-odds-grid">
            ${[home, 'Draw', away].map(name => `
              <div class="fb-odds-cell">
                <div class="fb-odds-label">${name}</div>
                <div class="fb-odds-value">${avg[name] || '—'}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : '<div class="fb-odds-section"><div class="fb-odds-title">Odds not yet available</div></div>'}

      ${previewText ? `
        <div class="fb-preview">
          <div class="fb-preview-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg> AI MATCH PREVIEW</div>
          <p class="fb-preview-text">${previewText}</p>
        </div>
      ` : ''}
    </div>
  `;
};


// ── Standings (with logos) ──
let _fullTableHTML = '';
let _snippetTableHTML = '';
window.toggleStandings = () => {
  const body = document.getElementById('standings-body');
  const btn = document.getElementById('expand-standings');
  if (btn.dataset.expanded === 'true') {
    body.innerHTML = _snippetTableHTML;
    btn.textContent = 'Show Full Table';
    btn.dataset.expanded = 'false';
  } else {
    body.innerHTML = _fullTableHTML;
    btn.textContent = 'Show Less';
    btn.dataset.expanded = 'true';
  }
};

const renderStandings = (table) => {
  const juveIdx = table.findIndex(t => t.name === TEAM || t.name === 'Juventus');
  if (juveIdx === -1) return '';
  const startIdx = Math.max(0, juveIdx - 2);
  const endIdx = Math.min(table.length, juveIdx + 3);
  const snippet = table.slice(startIdx, endIdx);

  const renderRow = (t, pos) => `
    <tr class="${t.name === TEAM || t.name === 'Juventus' ? 'fb-table-juve' : ''}">
      <td>${pos}</td>
      <td class="fb-table-team">${logoImg(t.name, 18)} ${t.name}</td>
      <td>${t.p}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td>
      <td>${t.gf}</td><td>${t.ga}</td><td>${(t.gf - t.ga) > 0 ? '+' : ''}${t.gf - t.ga}</td>
      <td class="fb-table-pts">${t.pts}</td>
    </tr>`;

  _snippetTableHTML = snippet.map((t, i) => renderRow(t, startIdx + i + 1)).join('');
  _fullTableHTML = table.map((t, i) => renderRow(t, i + 1)).join('');

  return `
    <div class="fb-card">
      <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> SERIE A TABLE</div>
      <div class="fb-table-wrap">
        <table class="fb-table">
          <thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead>
          <tbody id="standings-body">${_snippetTableHTML}</tbody>
        </table>
      </div>
      <button class="fb-expand-btn" id="expand-standings" data-expanded="false" onclick="toggleStandings()">Show Full Table</button>
    </div>
  `;
};

// ── Init ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

loadData();
