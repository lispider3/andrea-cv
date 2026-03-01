import '../src/style.css';

const ODDS_API_KEY = 'e67c22de5664471109480ba217a832c7';
const SPORT = 'soccer_italy_serie_a';
const API_BASE = 'https://api.the-odds-api.com/v4';
const TEAM = 'Juventus';

// ── State ──
let oddsData = [];
let scoresData = [];
let eventsData = [];
let loading = true;
let error = null;

// ── Fetch helpers ──
const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

const loadData = async () => {
  loading = true;
  render();
  try {
    const [odds, scores, events] = await Promise.all([
      fetchJSON(`${API_BASE}/sports/${SPORT}/odds?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`).catch(() => []),
      fetchJSON(`${API_BASE}/sports/${SPORT}/scores?apiKey=${ODDS_API_KEY}&daysFrom=3`).catch(() => []),
      fetchJSON(`${API_BASE}/sports/${SPORT}/events?apiKey=${ODDS_API_KEY}`).catch(() => []),
    ]);
    oddsData = odds;
    scoresData = scores;
    eventsData = events;
    loading = false;
  } catch (e) {
    error = e.message;
    loading = false;
  }
  render();
};

// ── Helpers ──
const isJuve = (ev) => ev.home_team === TEAM || ev.away_team === TEAM;
const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
};
const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};
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

const getBestOdds = (event) => {
  const best = {};
  (event.bookmakers || []).forEach(b => {
    const m = b.markets.find(m => m.key === 'h2h');
    if (!m) return;
    m.outcomes.forEach(o => {
      if (!best[o.name] || o.price > best[o.name].price) {
        best[o.name] = { price: o.price, bookmaker: b.title };
      }
    });
  });
  return best;
};

// ── Render ──
const render = () => {
  const app = document.getElementById('football-app');
  if (!app) return;

  if (loading) {
    app.innerHTML = `
      <section class="fb-section">
        <div class="fb-container">
          <div class="fb-loading">
            <div class="fb-spinner"></div>
            <p>Loading live data...</p>
          </div>
        </div>
      </section>`;
    return;
  }

  if (error) {
    app.innerHTML = `
      <section class="fb-section">
        <div class="fb-container">
          <div class="fb-error">
            <p>⚠ ${error}</p>
            <button onclick="location.reload()" class="fb-btn">Retry</button>
          </div>
        </div>
      </section>`;
    return;
  }

  // Find Juventus data
  const juveOdds = oddsData.filter(isJuve);
  const juveScores = scoresData.filter(isJuve).filter(e => e.completed);
  const juveUpcoming = eventsData.filter(isJuve).filter(e => new Date(e.commence_time) > new Date()).sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time));
  const nextMatch = juveOdds.length ? juveOdds[0] : (juveUpcoming.length ? juveUpcoming[0] : null);
  const recentResults = juveScores.sort((a, b) => new Date(b.commence_time) - new Date(a.commence_time)).slice(0, 5);

  // All Serie A standings from scores (W/D/L table)
  const table = buildTable(scoresData.filter(e => e.completed));

  app.innerHTML = `
    <section class="fb-section">
      <div class="fb-container">
        <div class="fb-header">
          <div class="fb-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="1.5"/><path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="currentColor" opacity="0.2"/></svg>
            <span>SERIE A TRACKER</span>
          </div>
          <h1 class="fb-title">JUVENTUS<br><span>DASHBOARD</span></h1>
          <p class="fb-subtitle">Live odds, fixtures, and results — powered by real bookmaker data.</p>
        </div>

        ${nextMatch ? renderNextMatch(nextMatch) : '<p class="fb-empty">No upcoming Juventus matches found.</p>'}

        ${recentResults.length ? renderRecentForm(recentResults) : ''}

        ${juveUpcoming.length > 1 ? renderUpcoming(juveUpcoming.slice(nextMatch ? 1 : 0, 5)) : ''}

        ${table.length ? renderStandings(table) : ''}
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
};

// ── Next Match Card ──
const renderNextMatch = (match) => {
  const avg = getAvgOdds(match);
  const best = getBestOdds(match);
  const isLive = match.commence_time && new Date(match.commence_time) <= new Date();
  const home = match.home_team;
  const away = match.away_team;

  return `
    <div class="fb-card fb-next-match">
      <div class="fb-card-label">${isLive ? '🔴 LIVE' : '⚡ NEXT MATCH'}</div>
      <div class="fb-match-header">
        <div class="fb-team ${home === TEAM ? 'fb-team--juve' : ''}">
          <div class="fb-team-name">${home}</div>
          <div class="fb-team-tag">HOME</div>
        </div>
        <div class="fb-match-info">
          <div class="fb-match-date">${formatDate(match.commence_time)}</div>
          <div class="fb-match-time">${formatTime(match.commence_time)}</div>
          <div class="fb-match-vs">VS</div>
        </div>
        <div class="fb-team ${away === TEAM ? 'fb-team--juve' : ''}">
          <div class="fb-team-name">${away}</div>
          <div class="fb-team-tag">AWAY</div>
        </div>
      </div>

      ${avg ? `
        <div class="fb-odds-section">
          <div class="fb-odds-title">AVERAGE ODDS · ${match.bookmakers?.length || 0} BOOKMAKERS</div>
          <div class="fb-odds-grid">
            <div class="fb-odds-cell">
              <div class="fb-odds-label">${home}</div>
              <div class="fb-odds-value">${avg[home] || '—'}</div>
              <div class="fb-odds-prob">${avg[home] ? impliedProb(avg[home]) + '%' : ''}</div>
            </div>
            <div class="fb-odds-cell">
              <div class="fb-odds-label">Draw</div>
              <div class="fb-odds-value">${avg['Draw'] || '—'}</div>
              <div class="fb-odds-prob">${avg['Draw'] ? impliedProb(avg['Draw']) + '%' : ''}</div>
            </div>
            <div class="fb-odds-cell">
              <div class="fb-odds-label">${away}</div>
              <div class="fb-odds-value">${avg[away] || '—'}</div>
              <div class="fb-odds-prob">${avg[away] ? impliedProb(avg[away]) + '%' : ''}</div>
            </div>
          </div>
        </div>

        <div class="fb-prob-bar">
          <div class="fb-prob-seg fb-prob-home" style="width:${avg[home] ? impliedProb(avg[home]) : 33}%"><span>${home.split(' ').pop()}</span></div>
          <div class="fb-prob-seg fb-prob-draw" style="width:${avg['Draw'] ? impliedProb(avg['Draw']) : 33}%"><span>Draw</span></div>
          <div class="fb-prob-seg fb-prob-away" style="width:${avg[away] ? impliedProb(avg[away]) : 33}%"><span>${away.split(' ').pop()}</span></div>
        </div>

        ${best && Object.keys(best).length ? `
          <div class="fb-best-odds">
            <div class="fb-odds-title">BEST ODDS</div>
            <div class="fb-best-grid">
              ${Object.entries(best).map(([name, data]) => `
                <div class="fb-best-cell">
                  <span class="fb-best-name">${name}</span>
                  <span class="fb-best-value">${data.price.toFixed(2)}</span>
                  <span class="fb-best-bookie">${data.bookmaker}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      ` : '<div class="fb-odds-section"><div class="fb-odds-title">Odds not yet available</div></div>'}
    </div>
  `;
};

// ── Recent Form ──
const renderRecentForm = (results) => {
  return `
    <div class="fb-card">
      <div class="fb-card-label">📊 RECENT FORM</div>
      <div class="fb-form-grid">
        ${results.map(r => {
          const juveScore = r.scores?.find(s => s.name === TEAM);
          const oppScore = r.scores?.find(s => s.name !== TEAM);
          const opponent = r.home_team === TEAM ? r.away_team : r.home_team;
          const isHome = r.home_team === TEAM;
          const js = parseInt(juveScore?.score || '0');
          const os = parseInt(oppScore?.score || '0');
          const result = js > os ? 'W' : js < os ? 'L' : 'D';
          const cls = result === 'W' ? 'fb-result--win' : result === 'L' ? 'fb-result--loss' : 'fb-result--draw';
          return `
            <div class="fb-form-item">
              <div class="fb-form-result ${cls}">${result}</div>
              <div class="fb-form-detail">
                <div class="fb-form-opponent">${isHome ? 'vs' : '@'} ${opponent}</div>
                <div class="fb-form-score">${js} – ${os}</div>
                <div class="fb-form-date">${formatDate(r.commence_time)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};

// ── Upcoming Fixtures ──
const renderUpcoming = (fixtures) => {
  return `
    <div class="fb-card">
      <div class="fb-card-label">📅 UPCOMING FIXTURES</div>
      <div class="fb-fixtures">
        ${fixtures.map(f => {
          const isHome = f.home_team === TEAM;
          const opponent = isHome ? f.away_team : f.home_team;
          return `
            <div class="fb-fixture-row">
              <div class="fb-fixture-date">${formatDate(f.commence_time)}</div>
              <div class="fb-fixture-time">${formatTime(f.commence_time)}</div>
              <div class="fb-fixture-match">
                <span class="fb-fixture-ha">${isHome ? 'HOME' : 'AWAY'}</span>
                <span class="fb-fixture-opp">${isHome ? 'vs' : '@'} ${opponent}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};

// ── Standings Table ──
const buildTable = (completedMatches) => {
  const teams = {};
  completedMatches.forEach(m => {
    if (!m.scores || m.scores.length < 2) return;
    const homeScore = parseInt(m.scores.find(s => s.name === m.home_team)?.score || '0');
    const awayScore = parseInt(m.scores.find(s => s.name === m.away_team)?.score || '0');
    [m.home_team, m.away_team].forEach(t => {
      if (!teams[t]) teams[t] = { name: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
    });
    const h = teams[m.home_team];
    const a = teams[m.away_team];
    h.p++; a.p++;
    h.gf += homeScore; h.ga += awayScore;
    a.gf += awayScore; a.ga += homeScore;
    if (homeScore > awayScore) { h.w++; h.pts += 3; a.l++; }
    else if (homeScore < awayScore) { a.w++; a.pts += 3; h.l++; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  });
  return Object.values(teams).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
};

const renderStandings = (table) => {
  return `
    <div class="fb-card">
      <div class="fb-card-label">🏆 SERIE A TABLE <span class="fb-card-note">(from recent scores)</span></div>
      <div class="fb-table-wrap">
        <table class="fb-table">
          <thead>
            <tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
          </thead>
          <tbody>
            ${table.map((t, i) => `
              <tr class="${t.name === TEAM ? 'fb-table-juve' : ''}">
                <td>${i + 1}</td>
                <td class="fb-table-team">${t.name}</td>
                <td>${t.p}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td>
                <td>${t.gf}</td><td>${t.ga}</td><td>${t.gf - t.ga > 0 ? '+' : ''}${t.gf - t.ga}</td>
                <td class="fb-table-pts">${t.pts}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// ── Init ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

loadData();
