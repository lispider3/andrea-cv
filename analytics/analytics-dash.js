import '../src/style.css';

// Handle self-exclusion
if (new URLSearchParams(location.search).get('exclude') === 'true') {
  try { localStorage.setItem('_exclude', '1'); } catch {}
  alert('You are now excluded from analytics tracking on this device.');
}

const app = document.getElementById('analytics-app');
let password = sessionStorage.getItem('_analytics_pw') || '';

// ── SVG Icons (inline, consistent with site design) ──
const ico = {
  eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  game: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>',
  trophy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V8a4 4 0 0 0-4-4H6v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4h-4a4 4 0 0 0-4 4"/></svg>',
  dice: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="16" r="1"/><circle cx="12" cy="12" r="1"/></svg>',
  link: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  book: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  chart: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  page: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  referrer: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  bolt: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  monitor: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  phone: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
};

// ── Helpers ──
const fmt = n => Number(n || 0).toLocaleString();
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;
const relTime = ts => {
  if (!ts) return '—';
  const d = Date.now() - ts;
  if (d < 60000) return 'just now';
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
  return `${Math.floor(d / 86400000)}d ago`;
};
const eventLabel = e => ({
  pageview: `${ico.eye} Page View`,
  cv_download: `${ico.download} CV Download`,
  quiz_start: `${ico.game} Quiz Start`,
  quiz_complete: `${ico.trophy} Quiz Complete`,
  cpo_start: `${ico.dice} CPO Start`,
  cpo_complete: `${ico.trophy} CPO Complete`,
  cta_click: `${ico.link} CTA Click`,
  book_modal: `${ico.book} Book Modal`,
}[e] || e);

// ── Login ──
function renderLogin() {
  app.innerHTML = `
    <section class="an-section">
      <div class="an-container" style="max-width:400px;padding-top:120px">
        <div class="an-card" style="text-align:center">
          <div class="an-card-label">${ico.lock} ANALYTICS</div>
          <input type="password" id="an-pw" class="an-input" placeholder="Password" autocomplete="off" style="margin:16px 0" />
          <button id="an-login" class="an-btn">Unlock</button>
          <div id="an-err" style="color:#ef4444;font-size:0.7rem;margin-top:8px;display:none">Wrong password</div>
        </div>
      </div>
    </section>`;
  const inp = document.getElementById('an-pw');
  const btn = document.getElementById('an-login');
  const err = document.getElementById('an-err');
  const attempt = async () => {
    password = inp.value;
    try {
      const r = await fetch('/api/analytics', { headers: { Authorization: `Bearer ${password}` } });
      if (r.status === 401) { err.style.display = 'block'; return; }
      sessionStorage.setItem('_analytics_pw', password);
      renderDashboard(await r.json());
    } catch (e) { err.textContent = e.message; err.style.display = 'block'; }
  };
  btn.addEventListener('click', attempt);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
  inp.focus();
}

// ── Dashboard ──
function renderDashboard(data) {
  const { totals: t, daily, pages, quizStarts, quizCompletions, ctaTargets, referrers, recent, myFingerprints } = data;
  const myFPs = new Set(myFingerprints || []);

  // Count how many recent events are mine
  const myCount = recent.filter(ev => myFPs.has(ev.fp)).length;

  const topPages = Object.entries(pages || {}).sort((a, b) => b[1] - a[1]).slice(0, 15);
  const topReferrers = Object.entries(referrers || {}).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Line chart — last 7 days
  const week = daily.slice(0, 7).reverse();
  const maxV = Math.max(...week.map(d => d.pageviews), 1);
  const W = 700, H = 180, padX = 50, padY = 24, padB = 32;
  const chartW = W - padX * 2, chartH = H - padY - padB;
  const pts = week.map((d, i) => {
    const x = padX + (i / Math.max(week.length - 1, 1)) * chartW;
    const y = padY + chartH - (d.pageviews / maxV) * chartH;
    return { x, y, ...d };
  });
  const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
  const area = line + ' L' + pts[pts.length-1].x.toFixed(1) + ',' + (padY+chartH) + ' L' + pts[0].x.toFixed(1) + ',' + (padY+chartH) + ' Z';
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => {
    const y = padY + chartH - f * chartH;
    const val = Math.round(f * maxV);
    return `<line x1="${padX}" y1="${y}" x2="${W-padX}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/><text x="${padX-8}" y="${y+3}" fill="rgba(255,255,255,0.3)" font-size="9" text-anchor="end" font-family="var(--font-mono)">${val}</text>`;
  }).join('');
  const chartSVG = `<svg class="an-line-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${gridLines}<path d="${area}" fill="url(#anGrad)" /><path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${pts.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="var(--accent)" stroke="var(--bg)" stroke-width="2"/><text x="${p.x.toFixed(1)}" y="${p.y-10}" fill="var(--accent)" font-size="10" text-anchor="middle" font-family="var(--font-mono)" font-weight="700">${p.pageviews}</text>`).join('')}${pts.map(p => `<text x="${p.x.toFixed(1)}" y="${H-8}" fill="rgba(255,255,255,0.4)" font-size="9" text-anchor="middle" font-family="var(--font-mono)">${p.date.slice(5)}</text>`).join('')}<defs><linearGradient id="anGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent)" stop-opacity="0.2"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0.01"/></linearGradient></defs></svg>`;

  const metrics = [
    [ico.eye, 'Page Views', t.pageviews],
    [ico.download, 'CV Downloads', t.cv_downloads],
    [ico.game, 'Quizzes Played', t.quiz_starts],
    [ico.trophy, 'Completed', t.quiz_completions],
    [ico.dice, 'CPO Sims', t.cpo_starts],
    [ico.link, 'CTA Clicks', t.cta_clicks],
    [ico.book, 'Book Views', t.book_modals],
  ];

  app.innerHTML = `
    <section class="an-section">
      <div class="an-container">
        <div class="an-header">
          <h1 class="an-title">Analytics</h1>
          <div style="display:flex;gap:8px">
            <button id="an-refresh" class="an-btn an-btn--ghost">↻ Refresh</button>
            <button id="an-clear" class="an-btn an-btn--ghost" style="color:#ef4444;border-color:rgba(239,68,68,0.3)">Clear All</button>
          </div>
        </div>

        <div class="an-metrics">
          ${metrics.map(([icon, label, val]) => `
            <div class="an-metric">
              <span class="an-metric-icon">${icon}</span>
              <span class="an-metric-value">${fmt(val)}</span>
              <span class="an-metric-label">${label}</span>
            </div>
          `).join('')}
        </div>

        <div class="an-card">
          <div class="an-card-label">${ico.chart} DAILY PAGEVIEWS — LAST 7 DAYS</div>
          ${chartSVG}
        </div>

        <div class="an-grid-2">
          <div class="an-card">
            <div class="an-card-label">${ico.page} TOP PAGES</div>
            <table class="an-table">
              <thead><tr><th>Page</th><th>Views</th></tr></thead>
              <tbody>${topPages.map(([p, c]) => `<tr><td class="an-page-path">${p}</td><td>${fmt(c)}</td></tr>`).join('') || '<tr><td colspan="2" style="opacity:0.5">No data yet</td></tr>'}</tbody>
            </table>
          </div>
          <div class="an-card">
            <div class="an-card-label">${ico.referrer} TOP REFERRERS</div>
            <table class="an-table">
              <thead><tr><th>Source</th><th>Visits</th></tr></thead>
              <tbody>${topReferrers.map(([r, c]) => `<tr><td>${r}</td><td>${fmt(c)}</td></tr>`).join('') || '<tr><td colspan="2" style="opacity:0.5">No referrers yet</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        <div class="an-grid-2">
          <div class="an-card">
            <div class="an-card-label">${ico.bolt} QUIZ BREAKDOWN</div>
            <table class="an-table">
              <thead><tr><th>Quiz</th><th>Starts</th><th>Done</th></tr></thead>
              <tbody>${Object.keys({ ...quizStarts, ...quizCompletions }).map(q => `<tr><td>${q}</td><td>${fmt(quizStarts?.[q])}</td><td>${fmt(quizCompletions?.[q])}</td></tr>`).join('') || '<tr><td colspan="3" style="opacity:0.5">No data yet</td></tr>'}</tbody>
            </table>
          </div>
          <div class="an-card">
            <div class="an-card-label">${ico.link} CTA CLICKS</div>
            <table class="an-table">
              <thead><tr><th>Target</th><th>Clicks</th></tr></thead>
              <tbody>${Object.entries(ctaTargets || {}).sort((a,b) => b[1]-a[1]).map(([t, c]) => `<tr><td>${t}</td><td>${fmt(c)}</td></tr>`).join('') || '<tr><td colspan="2" style="opacity:0.5">No data yet</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        <div class="an-card">
          <div class="an-card-label">${ico.clock} RECENT ACTIVITY</div>
          <div class="an-recent">
            ${recent.slice(0, 50).map((ev, idx) => {
              const isMine = myFPs.has(ev.fp);
              return `
              <div class="an-event ${isMine ? 'an-event--mine' : ''}">
                <span class="an-event-type">${eventLabel(ev.e)}</span>
                <span class="an-event-page">${ev.p || ''}</span>
                ${ev.quiz ? `<span class="an-event-extra">${ev.quiz}</span>` : ''}
                ${ev.target ? `<span class="an-event-extra">${ev.target}</span>` : ''}
                ${ev.score !== undefined ? `<span class="an-event-extra">Score: ${ev.score}</span>` : ''}
                <span class="an-event-device">${ev.mobile ? ico.phone : ico.monitor} ${ev.device || ''}</span>
                ${ev.ip ? `<span class="an-event-ip">${ev.ip}</span>` : ''}
                ${isMine
                  ? '<span class="an-badge an-badge--you">YOU</span>'
                  : ev.fp ? `<button class="an-flag-btn" data-fp="${ev.fp}" title="Flag as my session">Flag</button>` : ''}
                <span class="an-event-time">${relTime(ev.t)}</span>
              </div>`;
            }).join('') || '<div style="opacity:0.5;padding:16px;text-align:center">No events yet</div>'}
          </div>
        </div>

        <p style="text-align:center;font-family:var(--font-mono);font-size:0.5rem;color:var(--text-muted);margin-top:24px;letter-spacing:1px">Generated ${new Date(data.generated).toLocaleString()}</p>
      </div>
    </section>`;

  // Flag-as-mine buttons
  document.querySelectorAll('.an-flag-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const fp = btn.dataset.fp;
      try {
        const r = await fetch('/api/analytics', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + password, 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'flag', fp }),
        });
        if (r.ok) {
          const r2 = await fetch('/api/analytics', { headers: { Authorization: 'Bearer ' + password } });
          if (r2.ok) renderDashboard(await r2.json());
        }
      } catch {}
    });
  });

  document.getElementById('an-clear')?.addEventListener('click', async () => {
    if (!confirm('Clear ALL analytics data? This cannot be undone.')) return;
    try {
      const r = await fetch('/api/clear-analytics', { method: 'DELETE', headers: { Authorization: 'Bearer ' + password } });
      if (r.ok) { alert('Data cleared!'); location.reload(); }
    } catch {}
  });
  document.getElementById('an-refresh')?.addEventListener('click', async () => {
    try {
      const r = await fetch('/api/analytics', { headers: { Authorization: `Bearer ${password}` } });
      if (r.ok) renderDashboard(await r.json());
    } catch {}
  });
}

// ── Init ──
async function init() {
  if (password) {
    try {
      const r = await fetch('/api/analytics', { headers: { Authorization: `Bearer ${password}` } });
      if (r.ok) { renderDashboard(await r.json()); return; }
    } catch {}
  }
  renderLogin();
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

init();
