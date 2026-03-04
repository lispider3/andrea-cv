import '../src/style.css';
import { trackEvent } from '../src/tracker.js';

const API = 'https://api.jolpi.ca/ergast/f1/current';
let loading = true;
let error = null;
let driverStandings = [];
let constructorStandings = [];
let nextRace = null;
let lastRace = null;
let previewText = '';
let previewPhase = '';

const flagImg = (nat) => {
  const map = {
    'Dutch': 'nl', 'British': 'gb', 'Monegasque': 'mc', 'Spanish': 'es',
    'Australian': 'au', 'German': 'de', 'Finnish': 'fi', 'Canadian': 'ca',
    'Mexican': 'mx', 'French': 'fr', 'Japanese': 'jp', 'Thai': 'th',
    'Danish': 'dk', 'Chinese': 'cn', 'American': 'us', 'Italian': 'it',
    'Brazilian': 'br', 'New Zealander': 'nz', 'Argentine': 'ar',
    'Swiss': 'ch', 'Austrian': 'at', 'Swedish': 'se', 'Belgian': 'be',
    'Polish': 'pl', 'Russian': 'ru', 'Indian': 'in', 'Indonesian': 'id',
  };
  const iso = map[nat];
  return iso ? `<img src="https://flagcdn.com/w20/${iso}.png" alt="" width="20" height="15" class="quiz-flag" loading="lazy">` : '';
};



const loadData = async () => {
  loading = true;
  render();
  try {
    const [dRes, cRes, nRes, lRes] = await Promise.all([
      fetch(`${API}/driverStandings.json`).then(r => r.json()),
      fetch(`${API}/constructorStandings.json`).then(r => r.json()),
      fetch('https://api.jolpi.ca/ergast/f1/current/next.json').then(r => r.json()).catch(() => null),
      fetch(`${API}/last/results.json`).then(r => r.json()).catch(() => null),
    ]);

    const dTable = dRes?.MRData?.StandingsTable?.StandingsLists?.[0];
    driverStandings = dTable?.DriverStandings || [];

    const cTable = cRes?.MRData?.StandingsTable?.StandingsLists?.[0];
    constructorStandings = cTable?.ConstructorStandings || [];

    const nRaces = nRes?.MRData?.RaceTable?.Races;
    nextRace = nRaces?.length ? nRaces[0] : null;

    const lRaces = lRes?.MRData?.RaceTable?.Races;
    lastRace = lRaces?.length ? lRaces[0] : null;

    loading = false;

    // Fetch AI preview (non-blocking — render first, update after)
    try {
      const pRes = await fetch('/api/f1-preview');
      const ct = pRes.headers.get('content-type') || '';
      if (pRes.ok && ct.includes('json')) {
        const pData = await pRes.json();
        previewText = pData.preview || '';
        previewPhase = pData.phase || '';
      }
    } catch (e) {
      // Generate a simple client-side fallback
      if (nextRace) {
        const circuit = nextRace.Circuit?.circuitName || '';
        const country = nextRace.Circuit?.Location?.country || '';
        previewText = `The ${nextRace.raceName} at ${circuit} in ${country} is next on the calendar.`;
        if (driverStandings.length >= 2) {
          const p1 = driverStandings[0], p2 = driverStandings[1];
          const gap = parseInt(p1.points) - parseInt(p2.points);
          if (parseInt(p1.points) === 0) {
            previewText += ` The ${new Date().getFullYear()} season is yet to begin — all eyes on the season opener.`;
          } else {
            previewText += ` ${p1.Driver.familyName} leads the championship by ${gap} points over ${p2.Driver.familyName}.`;
          }
        }
      }
    }
  } catch (e) {
    error = e.message;
    loading = false;
  }
  render();
};

const formatRaceDate = (date, time) => {
  if (!date) return '';
  const d = new Date(`${date}T${time || '00:00:00Z'}`);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const formatRaceTime = (date, time) => {
  if (!time) return 'TBC';
  const d = new Date(`${date}T${time}`);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const renderNextRace = () => {
  if (!nextRace) return '';
  return `
    <div class="fb-card">
      <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> NEXT RACE</div>
      <div class="fb-match-header fb-match-header--compact" style="text-align:center;display:block;padding:16px 0">
        <div style="font-size:24px;font-weight:800;letter-spacing:-0.5px">${nextRace.raceName}</div>
        <div style="opacity:0.5;margin-top:4px;font-size:13px">${nextRace.Circuit?.circuitName || ''} — ${nextRace.Circuit?.Location?.locality || ''}, ${nextRace.Circuit?.Location?.country || ''}</div>
        <div style="margin-top:12px;display:flex;justify-content:center;gap:24px">
          <div>
            <div style="opacity:0.4;font-size:11px;text-transform:uppercase;letter-spacing:1px">Date</div>
            <div style="font-weight:600">${formatRaceDate(nextRace.date, nextRace.time)}</div>
          </div>
          <div>
            <div style="opacity:0.4;font-size:11px;text-transform:uppercase;letter-spacing:1px">Lights Out</div>
            <div style="font-weight:600">${formatRaceTime(nextRace.date, nextRace.time)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderLastRace = () => {
  if (!lastRace?.Results?.length) return '';
  const top10 = lastRace.Results.slice(0, 10);
  return `
    <div class="fb-card">
      <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V2h4v20"/></svg> LAST RACE — ${lastRace.raceName?.toUpperCase()}</div>
      <div class="fb-table-wrap">
        <table class="fb-table">
          <thead><tr><th>P</th><th>Driver</th><th>Team</th><th>Pts</th></tr></thead>
          <tbody>
            ${top10.map(r => {
    return `<tr>
                <td>${r.position}</td>
                <td>${flagImg(r.Driver?.nationality)} ${r.Driver?.givenName} ${r.Driver?.familyName}</td>
                <td>${r.Constructor?.name}</td>
                <td style="font-weight:600">${r.points}</td>
              </tr>`;
  }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

let _fullDriversHTML = '';
let _snippetDriversHTML = '';
window.toggleDriverStandings = () => {
  const body = document.getElementById('driver-standings-body');
  const btn = document.getElementById('expand-drivers');
  if (btn.dataset.expanded === 'true') {
    body.innerHTML = _snippetDriversHTML;
    btn.textContent = 'Show Full Standings';
    btn.dataset.expanded = 'false';
  } else {
    body.innerHTML = _fullDriversHTML;
    btn.textContent = 'Show Less';
    btn.dataset.expanded = 'true';
  }
};

const renderDriverStandings = () => {
  if (!driverStandings.length) return '';
  const snippet = driverStandings.slice(0, 6);

  const renderRow = (d) => {
    return `<tr>
      <td>${d.position}</td>
      <td>${flagImg(d.Driver?.nationality)} ${d.Driver?.givenName} ${d.Driver?.familyName}</td>
      <td>${d.Constructors?.[0]?.name}</td>
      <td>${d.wins}</td>
      <td class="fb-table-pts">${d.points}</td>
    </tr>`;
  };

  _snippetDriversHTML = snippet.map(d => renderRow(d)).join('');
  _fullDriversHTML = driverStandings.map(d => renderRow(d)).join('');

  return `
    <div class="fb-card">
      <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V2h4v20"/></svg> DRIVER STANDINGS</div>
      <div class="fb-table-wrap">
        <table class="fb-table">
          <thead><tr><th>#</th><th>Driver</th><th>Team</th><th>Wins</th><th>Pts</th></tr></thead>
          <tbody id="driver-standings-body">${_snippetDriversHTML}</tbody>
        </table>
      </div>
      <button class="fb-expand-btn" id="expand-drivers" data-expanded="false" onclick="toggleDriverStandings()">Show Full Standings</button>
    </div>
  `;
};

const renderConstructorStandings = () => {
  if (!constructorStandings.length) return '';
  return `
    <div class="fb-card">
      <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 12 2 2 4-4"/></svg> CONSTRUCTOR STANDINGS</div>
      <div class="fb-table-wrap">
        <table class="fb-table">
          <thead><tr><th>#</th><th>Constructor</th><th>Wins</th><th>Pts</th></tr></thead>
          <tbody>
            ${constructorStandings.map(c => {
    return `<tr>
                <td>${c.position}</td>
                <td>${c.Constructor?.name}</td>
                <td>${c.wins}</td>
                <td class="fb-table-pts">${c.points}</td>
              </tr>`;
  }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const renderPreview = () => {
  if (!previewText) return '';
  const phaseBadges = {
    'pre-race': 'PRE-RACE',
    'build-up': 'RACE WEEK',
    'race-week': 'RACE WEEK',
    'post-qualifying': 'POST-QUALIFYING',
    'race-day': 'RACE DAY',
    'off-season': 'OFF-SEASON',
  };
  const badge = phaseBadges[previewPhase] || 'PREVIEW';
  return `
    <div class="fb-card">
      <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg> AI RACE PREVIEW <span style="margin-left:8px;padding:2px 8px;background:rgba(255,255,255,0.08);border-radius:10px;font-size:10px;letter-spacing:1px;opacity:0.6">${badge}</span></div>
      <div class="fb-preview">
        <p class="fb-preview-text">${previewText}</p>
      </div>
    </div>
  `;
};

const render = () => {
  const app = document.getElementById('f1-app');
  if (!app) return;

  if (loading) {
    app.innerHTML = `<section class="fb-section"><div class="fb-container">
      <div class="fb-loading"><div class="fb-spinner"></div><p>Loading F1 data...</p></div>
    </div></section>`;
    return;
  }

  if (error) {
    app.innerHTML = `<section class="fb-section"><div class="fb-container">
      <div class="fb-error"><p>${error}</p><button onclick="location.reload()" class="fb-btn">Retry</button></div>
    </div></section>`;
    return;
  }

  const season = driverStandings.length ? new Date().getFullYear() : '';

  app.innerHTML = `
    <section class="fb-section">
      <div class="fb-container">
        <div class="fb-card" style="text-align:center;padding:32px 24px 24px">
          <div style="display:inline-block;padding:4px 14px;border:1px solid rgba(255,255,255,0.15);border-radius:20px;font-size:11px;letter-spacing:2px;color:var(--accent,#c9a84c);font-weight:600;margin-bottom:12px">FORMULA 1</div>
          <h1 style="font-size:clamp(28px,5vw,42px);font-weight:900;letter-spacing:-1px;margin:0">${season} <span style="opacity:0.4">Season</span></h1>
          <p style="opacity:0.5;margin-top:8px;font-size:14px">Live standings & race data from the Ergast API</p>
        </div>

        ${renderNextRace()}
        ${renderPreview()}
        ${renderDriverStandings()}
        ${renderConstructorStandings()}
        ${renderLastRace()}
      </div>
    </section>

    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links"><a href="/">← Back to Portfolio</a></div>
        <p class="footer-copy">&copy; ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>
  `;
};

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

loadData();
trackEvent('pageview', { page: 'f1-dashboard' });
