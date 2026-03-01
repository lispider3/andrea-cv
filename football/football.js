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

let recentResultsData = [];


const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

const loadData = async () => {
  loading = true;
  render();
  try {
    // Fetch standings: try Vercel API first, fallback to ESPN directly
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
          return { name: nameMap[raw]||raw, p: Math.round(stats.gamesPlayed||0), w: Math.round(stats.wins||0), d: Math.round(stats.ties||0), l: Math.round(stats.losses||0), gf: Math.round(stats.pointsFor||0), ga: Math.round(stats.pointsAgainst||0), pts: Math.round(stats.points||0) };
        }).sort((a,b) => b.pts - a.pts || (b.gf-b.ga)-(a.gf-a.ga));
      } catch(e2) {}
    }


    // Fetch recent Juventus results: try Vercel API, fallback to ESPN directly
    try {
      let rRes = await fetch('/api/results');
      const rCt = rRes.headers.get('content-type') || '';
      if (rRes.ok && rCt.includes('json')) {
        const rData = await rRes.json();
        recentResultsData = rData.results || [];
      } else { throw new Error('Not JSON'); }
    } catch(e) {
      try {
        const espnR = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/teams/111/schedule');
        const rd = await espnR.json();
        const nameMap = { 'Internazionale': 'Inter', 'Hellas Verona FC': 'Hellas Verona', 'SSC Napoli': 'Napoli' };
        recentResultsData = (rd.events || [])
          .filter(e => e.competitions?.[0]?.status?.type?.completed)
          .map(e => {
            const comp = e.competitions[0];
            const h = comp.competitors?.find(c => c.homeAway === 'home');
            const a = comp.competitors?.find(c => c.homeAway === 'away');
            const hn = h?.team?.displayName || '?';
            const an = a?.team?.displayName || '?';
            return { date: e.date, home: nameMap[hn]||hn, away: nameMap[an]||an, hs: parseInt(h?.score?.displayValue||h?.score||'0'), as: parseInt(a?.score?.displayValue||a?.score||'0'), comp: 'Serie A' };
          })
          .sort((a,b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
      } catch(e2) {}
    }
    const [odds, scores, events] = await Promise.all([
      fetchJSON(`${API_BASE}/sports/${SPORT}/odds?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`).catch(() => []),
      fetchJSON(`${API_BASE}/sports/${SPORT}/scores?apiKey=${ODDS_API_KEY}&daysFrom=3`).catch(() => []),
      fetchJSON(`${API_BASE}/sports/${SPORT}/events?apiKey=${ODDS_API_KEY}`).catch(() => []),
    ]);
    oddsData = odds;
    scoresData = scores;
    eventsData = events;

    // Fetch AI preview for next Juve match
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
        // Client-side fallback: generate from standings data
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
const impliedProb = (odds) => ((1 / odds) * 100).toFixed(0);

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


// Client-side preview generator (fallback when API unavailable)
const generateClientPreview = (home, away, standings) => {
  const find = (name) => standings.find(t => t.name === name || name.includes(t.name));
  const hs = find(home);
  const as = find(away);
  if (!hs || !as) return `${home} host ${away} in a key Serie A showdown. Both teams will be looking to secure vital points in the race for European places.`;

  const homeGD = hs.gf - hs.ga;
  const ord = n => { const s=['th','st','nd','rd']; const v=n%100; return s[(v-20)%10]||s[v]||s[0]; };
  const lines = [];

  if (Math.abs(hs.pts - as.pts) <= 8) {
    lines.push(`A pivotal clash as ${home} (${hs.pts}pts) host ${away} (${as.pts}pts) with just ${Math.abs(hs.pts-as.pts)} points between them.`);
  } else {
    lines.push(`${home} (${hs.pts}pts) welcome ${away} (${as.pts}pts) to their home ground.`);
  }

  if (hs.w > hs.l) lines.push(`The hosts have been solid with ${hs.w} wins from ${hs.p} games and a GD of ${homeGD > 0 ? '+':''}${homeGD}.`);
  if (as.d >= 6) lines.push(`${away} have drawn ${as.d} times this season, hinting at another tight encounter.`);
  else if (as.w > as.l) lines.push(`${away} arrive with ${as.w} wins and ${as.gf} goals scored this campaign.`);

  if (Math.abs(hs.pts - as.pts) <= 5) lines.push(`Expect a cagey contest with both sides eyeing Champions League qualification.`);

  return lines.join(' ');
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
  const juveScores = scoresData.filter(isJuve).filter(e => e.completed).sort((a, b) => new Date(b.commence_time) - new Date(a.commence_time));
  const juveUpcoming = eventsData.filter(isJuve).filter(e => new Date(e.commence_time) > new Date()).sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time));

  const nextMatch = juveOdds.length ? juveOdds[0] : (juveUpcoming.length ? juveUpcoming[0] : null);
  const recentResults = recentResultsData;
  const upcomingFixtures = juveUpcoming.slice(nextMatch && juveOdds.length ? 1 : 0, 6).slice(0, 5);

  app.innerHTML = `
    <section class="fb-section">
      <div class="fb-container">
        <div class="fb-header">
          <div class="fb-badge"><span>SERIE A INFO</span></div>
          <h1 class="fb-title">JUVENTUS<br><span>DASHBOARD</span></h1>
        </div>

        ${nextMatch ? renderNextMatch(nextMatch) : '<p class="fb-empty">No upcoming Juventus matches found.</p>'}

        ${recentResults.length ? renderRecentResults(recentResults) : ''}

        ${upcomingFixtures.length ? renderUpcoming(upcomingFixtures) : ''}

        ${standingsData.length ? renderStandings(standingsData) : ''}
      </div>
    </section>

    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links"><a href="/">← Back to Portfolio</a></div>
        <p class="footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>
  `;
};

// ── Section 1: Next Match ──
const renderNextMatch = (match) => {
  const avg = getAvgOdds(match);
  const isLive = new Date(match.commence_time) <= new Date();
  const home = match.home_team;
  const away = match.away_team;

  return `
    <div class="fb-card fb-next-match">
      <div class="fb-card-label">${isLive ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49"/><path d="M7.76 16.24a6 6 0 0 1 0-8.49"/></svg> LIVE' : '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> NEXT MATCH'}</div>
      <div class="fb-match-header">
        <div class="fb-team ${home === TEAM ? 'fb-team--juve' : ''}">
          <div class="fb-team-name">${home}</div>
          
        </div>
        <div class="fb-match-info">
          <div class="fb-match-date">${formatDate(match.commence_time)}</div>
          <div class="fb-match-time">${formatTime(match.commence_time)}</div>
          <div class="fb-match-vs">VS</div>
        </div>
        <div class="fb-team ${away === TEAM ? 'fb-team--juve' : ''}">
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

// ── Section 2: Last 5 Results ──
const renderRecentResults = (results) => {
  return `
    <div class="fb-card">
      <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> LAST ${results.length} RESULTS</div>
      <div class="fb-form-grid">
        ${results.map(r => {
          const isHome = r.home === TEAM;
          const opponent = isHome ? r.away : r.home;
          const js = isHome ? r.hs : r.as;
          const os = isHome ? r.as : r.hs;
          const result = js > os ? 'W' : js < os ? 'L' : 'D';
          const cls = result === 'W' ? 'fb-result--win' : result === 'L' ? 'fb-result--loss' : 'fb-result--draw';
          return `
            <div class="fb-form-item">
              <div class="fb-form-result ${cls}">${result}</div>
              <div class="fb-form-detail">
                <div class="fb-form-score">${r.home} ${r.hs} – ${r.as} ${r.away}${r.note ? ' (' + r.note + ')' : ''}</div>
                <div class="fb-form-date">${formatDate(r.date)}${r.comp !== 'Serie A' ? ' · ' + r.comp : ''}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};

// ── Section 3: Next 5 Fixtures ──
const renderUpcoming = (fixtures) => {
  return `
    <div class="fb-card">
      <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> NEXT ${fixtures.length} FIXTURES</div>
      <div class="fb-fixtures">
        ${fixtures.map(f => {
          const isHome = f.home_team === TEAM;
          const opponent = isHome ? f.away_team : f.home_team;
          return `
            <div class="fb-fixture-row">
              <div class="fb-fixture-date">${formatDate(f.commence_time)}</div>
              <div class="fb-fixture-time">${formatTime(f.commence_time)}</div>
              <div class="fb-fixture-match">
                <span class="fb-fixture-opp">${f.home_team} vs ${f.away_team}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};


// ── Section 4: Standings (Juve ± 2, expandable) ──
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
      <td class="fb-table-team">${t.name}</td>
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
