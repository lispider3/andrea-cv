import '../src/style.css';

// ══════════════════════════════════════════════
//  CPO SIMULATOR — Chief Product Officer Game
// ══════════════════════════════════════════════

const SCENARIOS = [
  // ── TECHNICAL ──
  {
    type: 'technical',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
    tag: 'SYSTEM ALERT',
    title: 'Critical API Failure in the Sportsbook Feed',
    desc: 'The main odds feed is down. Live markets are showing stale prices. Customer complaints are flooding in. Engineering says it\'s a 4-hour fix minimum.',
    optionA: { label: 'Fix Now', desc: 'Pull the entire engineering team to fix it immediately. Revenue takes a hit but stability is restored.', revenue: -15, morale: +5, stability: +10 },
    optionB: { label: 'Patch & Monitor', desc: 'Apply a temporary patch and schedule the real fix for tonight. Keeps revenue flowing but risks cascade failures.', revenue: +5, morale: -5, stability: -20 },
  },
  {
    type: 'technical',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>`,
    tag: 'TECH DEBT',
    title: 'Legacy Database Migration Deadline',
    desc: 'The old database is reaching capacity. Engineering wants 3 sprints to migrate. Sales just closed a deal that requires the old system for 2 more months.',
    optionA: { label: 'Migrate Now', desc: 'Prioritize the migration. Short-term pain for long-term stability. The new client waits.', revenue: -10, morale: +5, stability: +15 },
    optionB: { label: 'Delay Migration', desc: 'Keep the legacy system alive. Serve the client, but the ticking bomb gets louder.', revenue: +10, morale: -10, stability: -15 },
  },
  // ── PEOPLE ──
  {
    type: 'people',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    tag: 'PEOPLE CRISIS',
    title: 'Your Lead Developer Is Being Headhunted',
    desc: 'Your best engineer just got an offer from a FAANG company. They\'re worth 3x their salary in institutional knowledge. They haven\'t decided yet.',
    optionA: { label: 'Counter-Offer', desc: 'Match the offer and promote them to Staff Engineer. Expensive, but you keep the knowledge.', revenue: -10, morale: +15, stability: +5 },
    optionB: { label: 'Wish Them Well', desc: 'Let them go gracefully. Save the budget, but lose critical tribal knowledge.', revenue: +5, morale: -20, stability: -10 },
  },
  {
    type: 'people',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    tag: 'TEAM DYNAMICS',
    title: 'Two Senior PMs Are in Open Conflict',
    desc: 'Your best product managers disagree fundamentally on roadmap priorities. The tension is spilling into standups and the team is taking sides.',
    optionA: { label: 'Mediate Directly', desc: 'Block your afternoon, get them in a room, and resolve it. Your calendar takes the hit.', revenue: -5, morale: +20, stability: +5 },
    optionB: { label: 'Let Them Work It Out', desc: 'They\'re senior professionals. Give them space. But the tension might spread.', revenue: +5, morale: -15, stability: -5 },
  },
  // ── STRATEGIC ──
  {
    type: 'strategic',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
    tag: 'GROWTH OPPORTUNITY',
    title: 'Opportunity to Launch in a New LATAM Market',
    desc: 'Business development has found a regulatory window in Brazil. First-mover advantage, but the product isn\'t localized yet. Competitors are circling.',
    optionA: { label: 'Fast-Track Launch', desc: 'Ship an MVP to Brazil in 6 weeks. High risk, massive upside potential.', revenue: +25, morale: -5, stability: -15 },
    optionB: { label: 'Slow & Steady', desc: 'Take 6 months to localize properly. Lower risk, but you might lose the window.', revenue: -5, morale: +5, stability: +10 },
  },
  {
    type: 'strategic',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
    tag: 'BOARD REQUEST',
    title: 'CEO Wants AI Features in the Next Release',
    desc: 'The board saw a competitor demo AI-powered bet suggestions. The CEO wants "something with AI" in the product within 4 weeks. Your team has no ML experience.',
    optionA: { label: 'Build It', desc: 'Hire contractors, pull engineers off current work, and ship an AI feature fast.', revenue: +15, morale: -15, stability: -10 },
    optionB: { label: 'Push Back', desc: 'Present a proper AI roadmap for Q2 instead. The CEO won\'t love it, but the product stays solid.', revenue: -10, morale: +10, stability: +15 },
  },
];

// ── CPO Archetypes ──
const getArchetype = (revenue, morale, stability) => {
  const max = Math.max(revenue, morale, stability);
  const total = revenue + morale + stability;

  if (total >= 240) return {
    title: 'The Unicorn CPO',
    emoji: '🦄',
    desc: 'You balanced growth, people, and stability like a seasoned executive. Boards fight over leaders like you. This is a rare outcome — most CPOs sacrifice at least one dimension.',
    color: '#C9A96E',
  };
  if (revenue >= 90 && morale < 50) return {
    title: 'The Growth Mercenary',
    emoji: '📈',
    desc: 'Revenue is king in your world. You hit every target, but your team is quietly updating their LinkedIn profiles. Sustainable? Probably not. But the numbers look great in the board deck.',
    color: '#22c55e',
  };
  if (morale >= 90 && revenue < 50) return {
    title: 'The People Champion',
    emoji: '💛',
    desc: 'Your team would follow you anywhere. Retention is 100% and Glassdoor reviews are glowing. But the CFO keeps asking awkward questions about burn rate and ROI.',
    color: '#f59e0b',
  };
  if (stability >= 90 && revenue < 50) return {
    title: 'The Technical Purist',
    emoji: '🔧',
    desc: 'Your architecture is a work of art. Zero downtime, perfect CI/CD pipelines, and comprehensive test coverage. But the business is wondering why nothing new ever ships.',
    color: '#3b82f6',
  };
  if (revenue === max) return {
    title: 'The Growth Hunter',
    emoji: '🎯',
    desc: 'You lean into opportunity and aren\'t afraid to break things in pursuit of growth. Your investors love you. Your engineering team... has opinions.',
    color: '#22c55e',
  };
  if (morale === max) return {
    title: 'The Servant Leader',
    emoji: '🤝',
    desc: 'People are your product. You invest in culture, mentorship, and psychological safety. Teams under your leadership consistently punch above their weight.',
    color: '#f59e0b',
  };
  if (stability === max) return {
    title: 'The Technical Stabilizer',
    emoji: '🛡️',
    desc: 'You know that a stable platform is the foundation of everything. You pay down tech debt before it compounds and your on-call engineers actually sleep at night.',
    color: '#3b82f6',
  };
  return {
    title: 'The Balanced Operator',
    emoji: '⚖️',
    desc: 'You didn\'t let any one dimension dominate your decisions. This measured approach shows real maturity — or perhaps an inability to commit. Only time will tell.',
    color: '#C9A96E',
  };
};

// ── Game State ──
let state = 'intro'; // intro | playing | review
let revenue = 70, morale = 70, stability = 70;
let round = 0;
const TOTAL_ROUNDS = 3;
let usedScenarios = [];
let decisions = [];
let currentScenario = null;

const app = document.getElementById('cpo-app');

const clamp = (v) => Math.max(0, Math.min(100, v));

const pickScenario = () => {
  // Try to pick from different types
  const types = ['technical', 'people', 'strategic'];
  const targetType = types[round % 3];
  const available = SCENARIOS.filter((s, i) => !usedScenarios.includes(i) && s.type === targetType);
  if (available.length > 0) {
    const picked = available[Math.floor(Math.random() * available.length)];
    usedScenarios.push(SCENARIOS.indexOf(picked));
    return picked;
  }
  // Fallback: any unused
  const fallback = SCENARIOS.filter((s, i) => !usedScenarios.includes(i));
  const picked = fallback[Math.floor(Math.random() * fallback.length)];
  usedScenarios.push(SCENARIOS.indexOf(picked));
  return picked;
};

const applyDecision = (option) => {
  revenue = clamp(revenue + option.revenue);
  morale = clamp(morale + option.morale);
  stability = clamp(stability + option.stability);
  decisions.push({ scenario: currentScenario, choice: option });
  round++;
  if (round >= TOTAL_ROUNDS) {
    state = 'review';
  }
  render();
  // Animate metrics after render
  setTimeout(() => {
    document.querySelectorAll('.cpo-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 50);
};

const startGame = () => {
  state = 'playing';
  revenue = 70; morale = 70; stability = 70;
  round = 0; usedScenarios = []; decisions = [];
  render();
  setTimeout(() => {
    document.querySelectorAll('.cpo-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 50);
};

// ── Metric bar color ──
const barColor = (val) => {
  if (val >= 70) return '#22c55e';
  if (val >= 40) return '#f59e0b';
  return '#ef4444';
};

// ── Metric Icons ──
const revenueIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
const moraleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
const stabilityIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>`;

// ── Render Metrics Bar ──
const renderMetrics = () => `
  <div class="cpo-metrics">
    <div class="cpo-metric">
      <div class="cpo-metric-header">
        <span class="cpo-metric-icon" style="color:#22c55e">${revenueIcon}</span>
        <span class="cpo-metric-label">Revenue</span>
        <span class="cpo-metric-value" style="color:${barColor(revenue)}">${revenue}%</span>
      </div>
      <div class="cpo-bar"><div class="cpo-bar-fill" data-target="${revenue}" style="width:0%;background:${barColor(revenue)}"></div></div>
    </div>
    <div class="cpo-metric">
      <div class="cpo-metric-header">
        <span class="cpo-metric-icon" style="color:#f59e0b">${moraleIcon}</span>
        <span class="cpo-metric-label">Team Morale</span>
        <span class="cpo-metric-value" style="color:${barColor(morale)}">${morale}%</span>
      </div>
      <div class="cpo-bar"><div class="cpo-bar-fill" data-target="${morale}" style="width:0%;background:${barColor(morale)}"></div></div>
    </div>
    <div class="cpo-metric">
      <div class="cpo-metric-header">
        <span class="cpo-metric-icon" style="color:#3b82f6">${stabilityIcon}</span>
        <span class="cpo-metric-label">Product Stability</span>
        <span class="cpo-metric-value" style="color:${barColor(stability)}">${stability}%</span>
      </div>
      <div class="cpo-bar"><div class="cpo-bar-fill" data-target="${stability}" style="width:0%;background:${barColor(stability)}"></div></div>
    </div>
  </div>
`;

// ── Format delta ──
const fmtDelta = (val, label) => {
  if (val === 0) return '';
  const sign = val > 0 ? '+' : '';
  const color = val > 0 ? '#22c55e' : '#ef4444';
  return `<span class="cpo-delta" style="color:${color}">${sign}${val}% ${label}</span>`;
};

// ── Render ──
const render = () => {
  if (!app) return;

  if (state === 'intro') {
    app.innerHTML = `
      <section class="cpo-section">
        <div class="cpo-container">
          <div class="cpo-intro">
            <div class="cpo-badge"><span>SIMULATION</span></div>
            <h1 class="cpo-title">CPO<br><span>SIMULATOR</span></h1>
            <p class="cpo-subtitle">Can you survive a quarter as Chief Product Officer?<br>3 rapid-fire decisions. 3 metrics to balance. Your leadership style revealed.</p>
            <div class="cpo-intro-metrics">
              <div class="cpo-intro-stat"><span class="cpo-intro-stat-icon" style="color:#22c55e">${revenueIcon}</span> Revenue</div>
              <div class="cpo-intro-stat"><span class="cpo-intro-stat-icon" style="color:#f59e0b">${moraleIcon}</span> Morale</div>
              <div class="cpo-intro-stat"><span class="cpo-intro-stat-icon" style="color:#3b82f6">${stabilityIcon}</span> Stability</div>
            </div>
            <button class="cpo-start-btn" id="cpo-start">Start Simulation</button>
            <p class="cpo-start-hint">All metrics start at 70%. Every decision has trade-offs.</p>
          </div>
        </div>
      </section>
      <footer class="footer" role="contentinfo">
        <div class="container">
          <div class="footer-links"><a href="/">← Back to Portfolio</a></div>
          <p class="footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
        </div>
      </footer>`;
    document.getElementById('cpo-start')?.addEventListener('click', startGame);
    return;
  }

  if (state === 'playing') {
    currentScenario = pickScenario();
    const s = currentScenario;
    const typeColors = { technical: '#3b82f6', people: '#f59e0b', strategic: '#22c55e' };
    const tagColor = typeColors[s.type] || '#C9A96E';

    app.innerHTML = `
      <section class="cpo-section cpo-section--playing">
        <div class="cpo-container">
          ${renderMetrics()}

          <div class="cpo-round-indicator">
            <span class="cpo-round-label">Decision ${round + 1} of ${TOTAL_ROUNDS}</span>
            <div class="cpo-round-dots">
              ${Array.from({ length: TOTAL_ROUNDS }, (_, i) =>
                `<div class="cpo-round-dot ${i < round ? 'cpo-dot--done' : ''} ${i === round ? 'cpo-dot--active' : ''}"></div>`
              ).join('')}
            </div>
          </div>

          <div class="cpo-scenario cpo-animate-in">
            <div class="cpo-scenario-tag" style="color:${tagColor};border-color:${tagColor}30;background:${tagColor}10">
              <span class="cpo-scenario-icon">${s.icon}</span>
              ${s.tag}
            </div>
            <h2 class="cpo-scenario-title">${s.title}</h2>
            <p class="cpo-scenario-desc">${s.desc}</p>

            <div class="cpo-options">
              <button class="cpo-option" id="cpo-opt-a">
                <div class="cpo-option-label">${s.optionA.label}</div>
                <div class="cpo-option-desc">${s.optionA.desc}</div>
                <div class="cpo-option-deltas">
                  ${fmtDelta(s.optionA.revenue, 'Rev')}
                  ${fmtDelta(s.optionA.morale, 'Morale')}
                  ${fmtDelta(s.optionA.stability, 'Stability')}
                </div>
              </button>
              <button class="cpo-option" id="cpo-opt-b">
                <div class="cpo-option-label">${s.optionB.label}</div>
                <div class="cpo-option-desc">${s.optionB.desc}</div>
                <div class="cpo-option-deltas">
                  ${fmtDelta(s.optionB.revenue, 'Rev')}
                  ${fmtDelta(s.optionB.morale, 'Morale')}
                  ${fmtDelta(s.optionB.stability, 'Stability')}
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>`;

    document.getElementById('cpo-opt-a')?.addEventListener('click', () => applyDecision(s.optionA));
    document.getElementById('cpo-opt-b')?.addEventListener('click', () => applyDecision(s.optionB));
    setTimeout(() => {
      document.querySelectorAll('.cpo-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    }, 50);
    return;
  }

  // ── REVIEW STATE ──
  const archetype = getArchetype(revenue, morale, stability);
  const total = revenue + morale + stability;

  app.innerHTML = `
    <section class="cpo-section">
      <div class="cpo-container">
        <div class="cpo-review cpo-animate-in">
          <div class="cpo-review-badge">QUARTERLY REVIEW</div>
          <div class="cpo-review-emoji">${archetype.emoji}</div>
          <h1 class="cpo-review-title" style="color:${archetype.color}">${archetype.title}</h1>
          <p class="cpo-review-desc">${archetype.desc}</p>

          ${renderMetrics()}

          <div class="cpo-review-score">
            <div class="cpo-review-score-value">${total}</div>
            <div class="cpo-review-score-label">COMBINED SCORE / 300</div>
          </div>

          <div class="cpo-review-decisions">
            <div class="cpo-review-decisions-label">YOUR DECISIONS</div>
            ${decisions.map((d, i) => `
              <div class="cpo-review-decision">
                <div class="cpo-review-decision-num">${i + 1}</div>
                <div class="cpo-review-decision-body">
                  <div class="cpo-review-decision-title">${d.scenario.title}</div>
                  <div class="cpo-review-decision-choice">→ ${d.choice.label}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <button class="cpo-start-btn" id="cpo-restart">Play Again</button>
        </div>
      </div>
    </section>
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links"><a href="/">← Back to Portfolio</a></div>
        <p class="footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>`;

  document.getElementById('cpo-restart')?.addEventListener('click', startGame);
  setTimeout(() => {
    document.querySelectorAll('.cpo-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 100);
};

// Nav scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

render();
