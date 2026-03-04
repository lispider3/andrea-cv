import '../src/style.css';
import { trackEvent } from '../src/tracker.js';

// ══════════════════════════════════════════════
//  CPO SIMULATOR — Chief Product Officer Game
// ══════════════════════════════════════════════

// ── Icons ──
const ICO = {
  gear: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  chart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
  revenue: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  morale: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  stability: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>`,
};

// ══════════════════════════════════════════════
//  3 SCENARIO SETS — 5 scenarios each
//  Each playthrough picks one set at random
// ══════════════════════════════════════════════
const SCENARIO_SETS = [
  // ── SET A ──
  [
    { type:'technical', icon:ICO.gear, tag:'SYSTEM ALERT',
      title:'Critical API Failure in the Sportsbook Feed',
      desc:'The main odds feed is down. Live markets are showing stale prices. Customer complaints are flooding in. Engineering says it\'s a 4-hour fix minimum.',
      optionA:{label:'Fix Now',desc:'Pull the entire engineering team to fix it immediately. Revenue takes a hit but stability is restored.',revenue:-15,morale:+5,stability:+10},
      optionB:{label:'Patch & Monitor',desc:'Apply a temporary patch and schedule the real fix for tonight. Keeps revenue flowing but risks cascade failures.',revenue:+5,morale:-5,stability:-20}},
    { type:'people', icon:ICO.users, tag:'PEOPLE CRISIS',
      title:'Your Lead Developer Is Being Headhunted',
      desc:'Your best engineer just got an offer from a FAANG company. They\'re worth 3x their salary in institutional knowledge. They haven\'t decided yet.',
      optionA:{label:'Counter-Offer',desc:'Match the offer and promote them to Staff Engineer. Expensive, but you keep the knowledge.',revenue:-10,morale:+15,stability:+5},
      optionB:{label:'Wish Them Well',desc:'Let them go gracefully. Save the budget, but lose critical tribal knowledge.',revenue:+5,morale:-20,stability:-10}},
    { type:'strategic', icon:ICO.chart, tag:'GROWTH OPPORTUNITY',
      title:'Opportunity to Launch in a New LATAM Market',
      desc:'Business development has found a regulatory window in Brazil. First-mover advantage, but the product isn\'t localized yet. Competitors are circling.',
      optionA:{label:'Fast-Track Launch',desc:'Ship an MVP to Brazil in 6 weeks. High risk, massive upside potential.',revenue:+25,morale:-5,stability:-15},
      optionB:{label:'Slow & Steady',desc:'Take 6 months to localize properly. Lower risk, but you might lose the window.',revenue:-5,morale:+5,stability:+10}},
    { type:'people', icon:ICO.users, tag:'TEAM DYNAMICS',
      title:'Two Senior PMs Are in Open Conflict',
      desc:'Your best product managers disagree fundamentally on roadmap priorities. The tension is spilling into standups and the team is taking sides.',
      optionA:{label:'Mediate Directly',desc:'Block your afternoon, get them in a room, and resolve it. Your calendar takes the hit.',revenue:-5,morale:+20,stability:+5},
      optionB:{label:'Let Them Work It Out',desc:'They\'re senior professionals. Give them space. But the tension might spread.',revenue:+5,morale:-15,stability:-5}},
    { type:'technical', icon:ICO.gear, tag:'BOARD REQUEST',
      title:'CEO Wants AI Features in the Next Release',
      desc:'The board saw a competitor demo AI-powered bet suggestions. The CEO wants "something with AI" in 4 weeks. Your team has no ML experience.',
      optionA:{label:'Build It',desc:'Hire contractors, pull engineers off current work, and ship an AI feature fast.',revenue:+15,morale:-15,stability:-10},
      optionB:{label:'Push Back',desc:'Present a proper AI roadmap for Q2 instead. The CEO won\'t love it, but the product stays solid.',revenue:-10,morale:+10,stability:+15}},
  ],
  // ── SET B ──
  [
    { type:'strategic', icon:ICO.chart, tag:'ACQUISITION',
      title:'Opportunity to Acquire a Competitor\'s Tech Stack',
      desc:'A struggling competitor is selling their real-time data engine for a fraction of build cost. Due diligence is tight — decision needed this week.',
      optionA:{label:'Acquire Now',desc:'Buy the tech. Integration will be painful but it leapfrogs your roadmap by 18 months.',revenue:-20,morale:-5,stability:+20},
      optionB:{label:'Build In-House',desc:'Pass on the deal. Build it yourself over 2 quarters. Slower, but no integration headaches.',revenue:-5,morale:+10,stability:+5}},
    { type:'people', icon:ICO.users, tag:'CULTURE SHIFT',
      title:'Remote Team Wants Full Return-to-Office',
      desc:'The exec team is pushing for 5 days in-office. Your product team (mostly remote hires) is threatening to quit. You have to pick a side.',
      optionA:{label:'Defend Remote',desc:'Push back on the exec team. Your team stays, but you spend political capital.',revenue:-5,morale:+20,stability:0},
      optionB:{label:'Enforce RTO',desc:'Align with leadership. You keep your political standing, but expect 30% turnover.',revenue:+10,morale:-25,stability:+5}},
    { type:'technical', icon:ICO.gear, tag:'SECURITY INCIDENT',
      title:'Data Breach Detected in User Authentication',
      desc:'Security found a vulnerability that exposed 50K user sessions. No evidence of exploitation yet, but disclosure clock is ticking.',
      optionA:{label:'Full Disclosure',desc:'Notify users, reset sessions, and fix publicly. Transparent but costly.',revenue:-15,morale:+10,stability:+15},
      optionB:{label:'Silent Fix',desc:'Patch quietly and monitor. If nobody noticed, no need to create panic. Risky if it leaks.',revenue:+5,morale:-10,stability:-10}},
    { type:'strategic', icon:ICO.chart, tag:'PIVOT OR PERSIST',
      title:'Core Product Metrics Are Declining',
      desc:'Monthly active users dropped 15% over 2 months. The data suggests your newest feature is cannibalizing the core experience. The team is proud of the feature.',
      optionA:{label:'Kill the Feature',desc:'Rip it out based on data. The team will be demoralized but the product recovers.',revenue:+10,morale:-20,stability:+15},
      optionB:{label:'Double Down',desc:'Invest more in the feature. Trust the vision over short-term metrics.',revenue:-10,morale:+10,stability:-15}},
    { type:'people', icon:ICO.users, tag:'HIRING',
      title:'Star Candidate Wants 2x Your Budget',
      desc:'You found the perfect VP of Engineering. They\'ll transform your team, but their salary demands blow your hiring budget for the quarter.',
      optionA:{label:'Pay the Premium',desc:'Hire them at their ask. Transform the team, but sacrifice 2 other hires.',revenue:-15,morale:+15,stability:+10},
      optionB:{label:'Walk Away',desc:'Stick to budget. Hire 3 solid seniors instead. Less upside, more stability.',revenue:+5,morale:0,stability:+5}},
  ],
  // ── SET C ──
  [
    { type:'technical', icon:ICO.gear, tag:'INFRASTRUCTURE',
      title:'Cloud Costs Doubled Overnight',
      desc:'An auto-scaling misconfiguration caused your AWS bill to spike 100%. Finance is panicking. Engineering says fixing it properly takes 2 weeks.',
      optionA:{label:'Emergency Shutdown',desc:'Kill non-critical services immediately. Costs drop, but so does feature availability.',revenue:-10,morale:+5,stability:-15},
      optionB:{label:'Absorb & Fix',desc:'Pay the bill this month and fix it properly. Expensive but maintains service quality.',revenue:-20,morale:+10,stability:+15}},
    { type:'strategic', icon:ICO.chart, tag:'PARTNERSHIP',
      title:'Major Client Wants a Custom Integration',
      desc:'Your biggest client (30% of revenue) demands a custom API integration in 3 weeks. It will pull your team off the public roadmap entirely.',
      optionA:{label:'Build Custom',desc:'Give the whale client what they want. Revenue secured, but your product vision bends.',revenue:+20,morale:-10,stability:-10},
      optionB:{label:'Offer Standard',desc:'Push them toward your standard API. Risk losing them, but protect the product roadmap.',revenue:-15,morale:+5,stability:+15}},
    { type:'people', icon:ICO.users, tag:'BURNOUT ALERT',
      title:'Engineering Team Is Showing Signs of Burnout',
      desc:'Velocity dropped 40%. Two engineers are on sick leave. The team shipped 3 consecutive crunch sprints for the last release. Morale is at rock bottom.',
      optionA:{label:'Recovery Sprint',desc:'Cancel next sprint. Give everyone a week to recover, learn, and recharge. Roadmap slips.',revenue:-15,morale:+25,stability:+5},
      optionB:{label:'Push Through',desc:'We\'re almost at the finish line. One more sprint and we can rest after launch.',revenue:+10,morale:-20,stability:-10}},
    { type:'technical', icon:ICO.gear, tag:'COMPLIANCE',
      title:'New Gambling Regulation Requires Platform Changes',
      desc:'A regulatory body just mandated new responsible gaming features within 60 days. Non-compliance means losing your license in your top market.',
      optionA:{label:'Full Compliance',desc:'Drop everything and build it. Expensive but keeps the license. Other projects stall.',revenue:-10,morale:+5,stability:+20},
      optionB:{label:'Minimum Viable',desc:'Build the bare minimum to pass inspection. Fast and cheap, but it might not hold up to audit.',revenue:+5,morale:-5,stability:-10}},
    { type:'strategic', icon:ICO.chart, tag:'INNOVATION',
      title:'Competitor Just Launched a Feature You Had Planned',
      desc:'Your biggest competitor shipped the exact feature you\'ve been building for 3 months. Your version is 80% done but now it looks like a copycat.',
      optionA:{label:'Ship Anyway',desc:'Launch your version with differentiators. Move fast and own the narrative.',revenue:+15,morale:+5,stability:-15},
      optionB:{label:'Pivot Direction',desc:'Scrap it and redirect the team to something entirely new. Painful, but original.',revenue:-10,morale:-15,stability:+10}},
  ],
];

// ── 5 CPO Archetypes ──
const getArchetype = (revenue, morale, stability) => {
  const total = revenue + morale + stability;
  const max = Math.max(revenue, morale, stability);
  const min = Math.min(revenue, morale, stability);
  const spread = max - min;

  // 1. Unicorn: All high
  if (total >= 250 && min >= 60) return {
    title: 'The Unicorn CPO', emoji: '*',
    desc: 'You balanced growth, people, and stability like a seasoned executive. Boards fight over leaders like you. This is a rare outcome — most CPOs sacrifice at least one dimension. Your ability to navigate trade-offs without extremes is what separates good operators from great ones.',
    color: '#C9A96E',
  };
  // 2. Growth Hunter: Revenue dominant
  if (revenue === max && revenue >= morale + 15 && revenue >= stability + 15) return {
    title: 'The Growth Hunter', emoji: '◎',
    desc: 'Revenue is king in your world. You lean into opportunity and aren\'t afraid to break things in pursuit of growth. Your investors love you. Your engineering team... has opinions. This style works in hypergrowth but watch for the cracks forming beneath the surface.',
    color: '#22c55e',
  };
  // 3. People Champion: Morale dominant
  if (morale === max && morale >= revenue + 15 && morale >= stability + 15) return {
    title: 'The People Champion', emoji: '+',
    desc: 'Your team would follow you anywhere. Retention is 100% and Glassdoor reviews are glowing. You know that great products come from great people. But the CFO keeps asking awkward questions about ROI, and the board wants to see more aggressive numbers next quarter.',
    color: '#f59e0b',
  };
  // 4. Technical Stabilizer: Stability dominant
  if (stability === max && stability >= revenue + 15 && stability >= morale + 15) return {
    title: 'The Technical Stabilizer', emoji: '▣',
    desc: 'You know that a stable platform is the foundation of everything. Zero downtime, comprehensive test coverage, and on-call engineers who actually sleep at night. Your architecture is a work of art. But the commercial team is wondering why nothing new ever ships.',
    color: '#3b82f6',
  };
  // 5. Balanced Operator: No dominant dimension
  return {
    title: 'The Balanced Operator', emoji: '≋',
    desc: 'You didn\'t let any one dimension dominate your decisions. Every choice was weighed against its impact on growth, people, and systems. This measured approach shows real leadership maturity — the kind that builds sustainable companies, not just fast ones.',
    color: '#a78bfa',
  };
};

// ── Game State ──
const TOTAL_ROUNDS = 5;
let state = 'intro';
let revenue = 70, morale = 70, stability = 70;
let round = 0;
let currentSet = [];
let decisions = [];
let currentScenario = null;

const app = document.getElementById('cpo-app');
const clamp = (v) => Math.max(0, Math.min(100, v));

const applyDecision = (option) => {
  revenue = clamp(revenue + option.revenue);
  morale = clamp(morale + option.morale);
  stability = clamp(stability + option.stability);
  decisions.push({ scenario: currentScenario, choice: option });
  round++;
  if (round >= TOTAL_ROUNDS) state = 'review';
  render();
  setTimeout(() => {
    document.querySelectorAll('.cpo-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 50);
};

const startGame = () => {
  state = 'playing';
  revenue = 70; morale = 70; stability = 70;
  round = 0; decisions = [];
  // Pick a random set
  currentSet = [...SCENARIO_SETS[Math.floor(Math.random() * SCENARIO_SETS.length)]];
  // Shuffle the set
  for (let i = currentSet.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentSet[i], currentSet[j]] = [currentSet[j], currentSet[i]];
  }
  render();
  setTimeout(() => {
    document.querySelectorAll('.cpo-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 50);
};

// ── Helpers ──
const barColor = (val) => val >= 70 ? '#22c55e' : val >= 40 ? '#f59e0b' : '#ef4444';
const fmtDelta = (val, label) => {
  if (val === 0) return '';
  const sign = val > 0 ? '+' : '';
  const color = val > 0 ? '#22c55e' : '#ef4444';
  return `<span class="cpo-delta" style="color:${color}">${sign}${val}% ${label}</span>`;
};

const renderMetrics = () => `
  <div class="cpo-metrics">
    <div class="cpo-metric">
      <div class="cpo-metric-header">
        <span class="cpo-metric-icon" style="color:#22c55e">${ICO.revenue}</span>
        <span class="cpo-metric-label">Revenue</span>
        <span class="cpo-metric-value" style="color:${barColor(revenue)}">${revenue}%</span>
      </div>
      <div class="cpo-bar"><div class="cpo-bar-fill" data-target="${revenue}" style="width:0%;background:${barColor(revenue)}"></div></div>
    </div>
    <div class="cpo-metric">
      <div class="cpo-metric-header">
        <span class="cpo-metric-icon" style="color:#f59e0b">${ICO.morale}</span>
        <span class="cpo-metric-label">Team Morale</span>
        <span class="cpo-metric-value" style="color:${barColor(morale)}">${morale}%</span>
      </div>
      <div class="cpo-bar"><div class="cpo-bar-fill" data-target="${morale}" style="width:0%;background:${barColor(morale)}"></div></div>
    </div>
    <div class="cpo-metric">
      <div class="cpo-metric-header">
        <span class="cpo-metric-icon" style="color:#3b82f6">${ICO.stability}</span>
        <span class="cpo-metric-label">Product Stability</span>
        <span class="cpo-metric-value" style="color:${barColor(stability)}">${stability}%</span>
      </div>
      <div class="cpo-bar"><div class="cpo-bar-fill" data-target="${stability}" style="width:0%;background:${barColor(stability)}"></div></div>
    </div>
  </div>`;

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
            <p class="cpo-subtitle">Can you survive a quarter as Chief Product Officer?<br>5 rapid-fire decisions. 3 metrics to balance. Your leadership style revealed.</p>
            <div class="cpo-intro-metrics">
              <div class="cpo-intro-stat"><span class="cpo-intro-stat-icon" style="color:#22c55e">${ICO.revenue}</span> Revenue</div>
              <div class="cpo-intro-stat"><span class="cpo-intro-stat-icon" style="color:#f59e0b">${ICO.morale}</span> Morale</div>
              <div class="cpo-intro-stat"><span class="cpo-intro-stat-icon" style="color:#3b82f6">${ICO.stability}</span> Stability</div>
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
    currentScenario = currentSet[round];
    const s = currentScenario;
    const typeColors = { technical:'#3b82f6', people:'#f59e0b', strategic:'#22c55e' };
    const tagColor = typeColors[s.type] || '#C9A96E';

    app.innerHTML = `
      <section class="cpo-section cpo-section--playing">
        <div class="cpo-container">
          ${renderMetrics()}
          <div class="cpo-round-indicator">
            <span class="cpo-round-label">Decision ${round + 1} of ${TOTAL_ROUNDS}</span>
            <div class="cpo-round-dots">
              ${Array.from({length:TOTAL_ROUNDS},(_,i) =>
                `<div class="cpo-round-dot ${i<round?'cpo-dot--done':''} ${i===round?'cpo-dot--active':''}"></div>`
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
                  ${fmtDelta(s.optionA.revenue,'Rev')}
                  ${fmtDelta(s.optionA.morale,'Morale')}
                  ${fmtDelta(s.optionA.stability,'Stability')}
                </div>
              </button>
              <button class="cpo-option" id="cpo-opt-b">
                <div class="cpo-option-label">${s.optionB.label}</div>
                <div class="cpo-option-desc">${s.optionB.desc}</div>
                <div class="cpo-option-deltas">
                  ${fmtDelta(s.optionB.revenue,'Rev')}
                  ${fmtDelta(s.optionB.morale,'Morale')}
                  ${fmtDelta(s.optionB.stability,'Stability')}
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>`;

    document.getElementById('cpo-opt-a')?.addEventListener('click', () => applyDecision(s.optionA));
    document.getElementById('cpo-opt-b')?.addEventListener('click', () => applyDecision(s.optionB));
    setTimeout(() => {
      document.querySelectorAll('.cpo-bar-fill').forEach(bar => { bar.style.width = bar.dataset.target + '%'; });
    }, 50);
    return;
  }

  // ── REVIEW ──
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
    document.querySelectorAll('.cpo-bar-fill').forEach(bar => { bar.style.width = bar.dataset.target + '%'; });
  }, 100);
};

// Nav scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

render();
