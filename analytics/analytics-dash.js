import '../src/style.css';

// Handle self-exclusion
if (new URLSearchParams(location.search).get('exclude') === 'true') {
  try { localStorage.setItem('_exclude', '1'); } catch {}
  alert('You are now excluded from analytics tracking on this device.');
}

const app = document.getElementById('analytics-app');
let password = sessionStorage.getItem('_analytics_pw') || '';

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
  pageview: '👁 Page View', cv_download: '📄 CV Download', quiz_start: '🎮 Quiz Start',
  quiz_complete: '🏆 Quiz Complete', cpo_start: '🎲 CPO Start', cpo_complete: '🏅 CPO Complete',
  cta_click: '🔗 CTA Click', book_modal: '📚 Book Modal',
}[e] || e);

// ── Login ──
function renderLogin() {
  app.innerHTML = `
    <section class="an-section">
      <div class="an-container" style="max-width:400px;padding-top:120px">
        <div class="an-card" style="text-align:center">
          <div class="an-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> ANALYTICS</div>
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
      const data = await r.json();
      renderDashboard(data);
    } catch (e) { err.textContent = e.message; err.style.display = 'block'; }
  };
  btn.addEventListener('click', attempt);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
  inp.focus();
}

// ── Dashboard ──
function renderDashboard(data) {
  const { totals: t, daily, pages, quizStarts, quizCompletions, ctaTargets, referrers, recent } = data;

  // Sort pages by count descending
  const topPages = Object.entries(pages || {}).sort((a, b) => b[1] - a[1]).slice(0, 15);
  const topReferrers = Object.entries(referrers || {}).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const maxDaily = Math.max(...daily.map(d => d.pageviews), 1);

  app.innerHTML = `
    <section class="an-section">
      <div class="an-container">
        <div class="an-header">
          <h1 class="an-title">Analytics</h1>
          <button id="an-refresh" class="an-btn an-btn--ghost">↻ Refresh</button>
        </div>

        <!-- Totals -->
        <div class="an-metrics">
          ${[
            ['👁', 'Page Views', t.pageviews],
            ['📄', 'CV Downloads', t.cv_downloads],
            ['🎮', 'Quizzes Played', t.quiz_starts],
            ['🏆', 'Quizzes Completed', t.quiz_completions],
            ['🎲', 'CPO Sims', t.cpo_starts],
            ['🔗', 'CTA Clicks', t.cta_clicks],
            ['📚', 'Book Modals', t.book_modals],
          ].map(([ico, label, val]) => `
            <div class="an-metric">
              <span class="an-metric-icon">${ico}</span>
              <span class="an-metric-value">${fmt(val)}</span>
              <span class="an-metric-label">${label}</span>
            </div>
          `).join('')}
        </div>

        <!-- Daily Chart -->
        <div class="an-card">
          <div class="an-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg> DAILY PAGEVIEWS (LAST 30 DAYS)</div>
          <div class="an-chart">
            ${daily.slice().reverse().map(d => `
              <div class="an-bar-col" title="${d.date}: ${d.pageviews} views">
                <div class="an-bar" style="height:${Math.max(pct(d.pageviews, maxDaily), 2)}%"></div>
                <span class="an-bar-label">${d.date.slice(5)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="an-grid-2">
          <!-- Top Pages -->
          <div class="an-card">
            <div class="an-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> TOP PAGES</div>
            <table class="an-table">
              <thead><tr><th>Page</th><th>Views</th></tr></thead>
              <tbody>${topPages.map(([p, c]) => `<tr><td class="an-page-path">${p}</td><td>${fmt(c)}</td></tr>`).join('')}</tbody>
            </table>
          </div>

          <!-- Referrers -->
          <div class="an-card">
            <div class="an-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> TOP REFERRERS</div>
            <table class="an-table">
              <thead><tr><th>Source</th><th>Visits</th></tr></thead>
              <tbody>${topReferrers.length ? topReferrers.map(([r, c]) => `<tr><td>${r}</td><td>${fmt(c)}</td></tr>`).join('') : '<tr><td colspan="2" style="opacity:0.5">No external referrers yet</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        <div class="an-grid-2">
          <!-- Quiz Breakdown -->
          <div class="an-card">
            <div class="an-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> QUIZ BREAKDOWN</div>
            <table class="an-table">
              <thead><tr><th>Quiz</th><th>Starts</th><th>Completions</th></tr></thead>
              <tbody>${Object.keys({ ...quizStarts, ...quizCompletions }).map(q => `<tr><td>${q}</td><td>${fmt(quizStarts?.[q])}</td><td>${fmt(quizCompletions?.[q])}</td></tr>`).join('') || '<tr><td colspan="3" style="opacity:0.5">No quiz data yet</td></tr>'}</tbody>
            </table>
          </div>

          <!-- CTA Breakdown -->
          <div class="an-card">
            <div class="an-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> CTA CLICKS</div>
            <table class="an-table">
              <thead><tr><th>Target</th><th>Clicks</th></tr></thead>
              <tbody>${Object.entries(ctaTargets || {}).sort((a,b) => b[1]-a[1]).map(([t, c]) => `<tr><td>${t}</td><td>${fmt(c)}</td></tr>`).join('') || '<tr><td colspan="2" style="opacity:0.5">No CTA clicks yet</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="an-card">
          <div class="an-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> RECENT ACTIVITY</div>
          <div class="an-recent">
            ${recent.slice(0, 50).map(ev => `
              <div class="an-event">
                <span class="an-event-type">${eventLabel(ev.e)}</span>
                <span class="an-event-page">${ev.p || ''}</span>
                ${ev.quiz ? `<span class="an-event-extra">${ev.quiz}</span>` : ''}
                ${ev.target ? `<span class="an-event-extra">${ev.target}</span>` : ''}
                ${ev.score !== undefined ? `<span class="an-event-extra">Score: ${ev.score}</span>` : ''}
                <span class="an-event-time">${relTime(ev.t)}</span>
              </div>
            `).join('') || '<div style="opacity:0.5;padding:16px;text-align:center">No events yet</div>'}
          </div>
        </div>

        <p style="text-align:center;font-size:0.6rem;color:var(--text-muted);margin-top:24px">Generated ${new Date(data.generated).toLocaleString()}</p>
      </div>
    </section>`;

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
