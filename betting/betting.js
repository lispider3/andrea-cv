import '../src/style.css';
import { trackEvent } from '../src/tracker.js';

const STAKE = 10;
let currentLesson = null;

// ═══════════════ SHARED UTILS ═══════════════
function combinations(arr, k) {
  const r = [];
  (function h(s, c) { if (c.length === k) { r.push([...c]); return; } for (let i = s; i < arr.length; i++) { c.push(arr[i]); h(i+1, c); c.pop(); } })(0, []);
  return r;
}

// ═══════════════ LESSON PICKER ═══════════════
const lessons = [
  { id: 'system-bets', title: 'System Bets', sub: 'The Art of Winning Even When You Lose', tag: 'LESSON 1', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>' },
  { id: 'handicaps', title: 'Handicap Betting', sub: 'Probably Created to Annoy People', tag: 'LESSON 2', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>' },
  { id: 'payback', title: 'Paybacks', sub: 'The Juice to Make Money', tag: 'LESSON 3', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  { id: 'cashout', title: 'Cash Out', sub: 'Take the Money and Run', tag: 'LESSON 4', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
  { id: 'betbuilder', title: 'Bet Builder', sub: 'Why the Odds Are Never What They Seem', tag: 'LESSON 5', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' },
  { id: 'combitax', title: 'The Combi Tax', sub: 'Why Your 10-Legger is a Gift to the Bookie', tag: 'LESSON 6', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>' },
];

function renderPicker() {
  return `
    <section class="sb-hero sb-hero--centered">
      <div class="sb-container">
        <span class="sb-tag">BETTING EDUCATION</span>
        <h1 class="sb-hero-title">Sportsbook<br><span>Masterclass</span></h1>
        <p class="sb-hero-sub">Interactive lessons on betting mechanics — from system bets to bet builders.</p>
      </div>
    </section>
    <section class="sb-section">
      <div class="sb-container">
        <div class="sb-lesson-grid">
          ${lessons.map(l => `
            <button class="sb-lesson-card" data-lesson="${l.id}">
              <div class="sb-lesson-icon">${l.icon}</div>
              <span class="sb-lesson-tag">${l.tag}</span>
              <h3 class="sb-lesson-title">${l.title}</h3>
              <p class="sb-lesson-sub">${l.sub}</p>
              <span class="sb-lesson-cta">Start Lesson <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
            </button>
          `).join('')}
        </div>
      </div>
    </section>`;
}

// ═══════════════ LESSON 1: SYSTEM BETS ═══════════════
const sim23 = [
  { team: 'Man Utd', odds: 2.10, won: null },
  { team: 'Liverpool', odds: 1.75, won: null },
  { team: 'Chelsea', odds: 2.40, won: null },
];
const sim56 = [
  { team: 'Real Madrid', odds: 1.45, won: null },
  { team: 'Bayern Munich', odds: 1.60, won: null },
  { team: 'PSG', odds: 1.90, won: null },
  { team: 'Juventus', odds: 2.20, won: null },
  { team: 'Arsenal', odds: 2.50, won: null },
  { team: 'Dortmund', odds: 3.10, won: null },
];
const sims = { sim23, sim56 };

function calcCombo(picks, legs, label) {
  const allD = legs.every(i => picks[i].won !== null);
  const won = legs.every(i => picks[i].won === true);
  const odds = legs.reduce((a, i) => a * picks[i].odds, 1);
  return { label, combinedOdds: odds.toFixed(2), payout: won ? (STAKE * odds).toFixed(2) : '0.00', won: allD ? won : null, teams: legs.map(i => picks[i].team) };
}

function renderSim(picks, comboSize, id) {
  const comboLegs = combinations(picks.map((_, i) => i), comboSize);
  const combos = comboLegs.map((l, i) => calcCombo(picks, l, 'Bet '+(i+1)));
  const totalStake = (STAKE * combos.length).toFixed(2);
  const totalReturn = combos.reduce((s, c) => s + parseFloat(c.payout), 0).toFixed(2);
  const allD = picks.every(p => p.won !== null);
  const profit = (totalReturn - totalStake).toFixed(2);
  const foldLabel = comboSize === 2 ? 'Double' : comboSize === 5 ? 'Five-Fold' : comboSize+'-Fold';

  return '<div class="sb-sim-card">'
    + '<div class="sb-sim-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> OUTCOME SIMULATOR \u2014 '+combos.length+' COMBINATIONS \u2014 \u20ac'+totalStake+' TOTAL STAKE</div>'
    + '<h4 class="sb-sim-heading">Your '+picks.length+' Picks</h4>'
    + '<div class="sb-picks sb-picks--'+picks.length+'">'
    + picks.map((p,i) => '<div class="sb-pick '+(p.won===true?'sb-pick--won':'')+(p.won===false?' sb-pick--lost':'')+'">'
      + '<div class="sb-pick-team">'+p.team+'</div><div class="sb-pick-odds">@ '+p.odds.toFixed(2)+'</div>'
      + '<div class="sb-pick-btns"><button class="sb-pick-btn sb-pick-btn--win '+(p.won===true?'active':'')+'" data-sim="'+id+'" data-pick="'+i+'" data-result="win">Win</button>'
      + '<button class="sb-pick-btn sb-pick-btn--lose '+(p.won===false?'active':'')+'" data-sim="'+id+'" data-pick="'+i+'" data-result="lose">Lose</button></div></div>').join('')
    + '</div>'
    + '<h4 class="sb-sim-heading">'+combos.length+' '+foldLabel+'-Bet Combinations</h4>'
    + '<div class="sb-combos-wrap"><table class="sb-combos"><thead><tr><th></th><th>Legs</th><th>Combined Odds</th><th>Stake</th><th>Payout</th><th>Result</th></tr></thead><tbody>'
    + combos.map(c => '<tr class="'+(c.won===true?'sb-combo--won':'')+(c.won===false?' sb-combo--lost':'')+'">'
      + '<td class="sb-combo-label">'+c.label+'</td><td>'+c.teams.join(' + ')+'</td><td>'+c.combinedOdds+'</td><td>\u20ac'+STAKE.toFixed(2)+'</td>'
      + '<td class="sb-combo-payout">'+(c.won===true?'\u20ac'+c.payout:c.won===false?'\u20ac0.00':'\u2014')+'</td>'
      + '<td>'+(c.won===true?'<span class="sb-result-badge sb-result-badge--win">WIN</span>':c.won===false?'<span class="sb-result-badge sb-result-badge--lose">LOSE</span>':'<span class="sb-result-badge">\u2014</span>')+'</td></tr>').join('')
    + '</tbody></table></div>'
    + (allD ? '<div class="sb-sim-summary '+(parseFloat(profit)>=0?'sb-sim-summary--profit':'sb-sim-summary--loss')+'">'
      + '<div class="sb-sim-summary-row"><span>Total Stake ('+combos.length+' \u00d7 \u20ac'+STAKE+')</span><span>\u20ac'+totalStake+'</span></div>'
      + '<div class="sb-sim-summary-row"><span>Total Return</span><span>\u20ac'+totalReturn+'</span></div>'
      + '<div class="sb-sim-summary-row sb-sim-summary-total"><span>Profit / Loss</span><span>'+(parseFloat(profit)>=0?'+':'')+'\u20ac'+profit+'</span></div>'
      + (parseFloat(profit)>0?'<p class="sb-sim-note">The system absorbed the loss and still delivered a profit.</p>':'')
      + '</div>' : '<p class="sb-sim-hint">Toggle each pick\'s result to see how the '+comboSize+'/'+picks.length+' system pays out.</p>')
    + (allD ? '<button class="sb-reset-btn sb-btn sb-btn--ghost" data-sim="'+id+'" style="margin-top:16px">Reset</button>' : '')
    + '</div>';
}

function renderSystemBets() {
  return `
    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <span class="sb-section-tag">THE HIERARCHY</span>
        <h2 class="sb-section-title">Not All Bets Are Created Equal</h2>
        <p class="sb-section-sub">The evolution from singles to systems, in three steps.</p>
        <div class="sb-hierarchy">
          <div class="sb-hier-card"><div class="sb-hier-num">01</div><h3>Single Bets</h3><p>One pick, one outcome. Straightforward and unglamorous.</p><div class="sb-hier-tag sb-hier-tag--green">Low Risk</div></div>
          <div class="sb-hier-arrow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
          <div class="sb-hier-card"><div class="sb-hier-num">02</div><h3>Combi / Acca Bets</h3><p>Multiple picks, one bet. The odds multiply \u2014 but <em>every leg must win.</em> Miss one and you get nothing.</p><div class="sb-hier-tag sb-hier-tag--amber">High Risk</div></div>
          <div class="sb-hier-arrow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
          <div class="sb-hier-card sb-hier-card--highlight"><div class="sb-hier-num">03</div><h3>System Bets</h3><p>A mixture of accumulators that lets you <strong>lose a leg and still profit</strong>.</p><div class="sb-hier-tag sb-hier-tag--gold">Smart Risk</div></div>
        </div>
      </div>
    </section>
    <section class="sb-section" id="sim-23"><div class="sb-container">
      <span class="sb-section-tag">INTERACTIVE DEEP DIVE</span>
      <h2 class="sb-section-title">The 2/3 System \u2014 Deconstructed</h2>
      <p class="sb-section-sub">3 picks create 3 double-bets. At least 2 must win. Try it.</p>
      ${renderSim(sim23, 2, 'sim23')}
    </div></section>
    <section class="sb-section sb-section--alt" id="sim-56"><div class="sb-container">
      <span class="sb-section-tag">SCALING UP</span>
      <h2 class="sb-section-title">The 5/6 System \u2014 More Picks, More Safety</h2>
      <p class="sb-section-sub">6 picks, 6 five-fold combinations. Lose one and every combo still wins.</p>
      ${renderSim(sim56, 5, 'sim56')}
    </div></section>

    <section class="sb-section">
      <div class="sb-container">
        <span class="sb-section-tag">SYSTEM BET TYPES</span>
        <h2 class="sb-section-title">The Full Menu</h2>
        <p class="sb-section-sub">System bets come in different sizes. Some are simple. Some include every possible sub-combination.</p>

        <div class="sb-sys-types">
          <div class="sb-sys-type">
            <div class="sb-sys-type-header">
              <h4>2/3 (Trixie)</h4>
              <span class="sb-sys-type-badge">3 picks</span>
            </div>
            <div class="sb-sys-type-combos">
              <div class="sb-sys-type-row"><span class="sb-sys-type-k">3 \u00d7 doubles</span></div>
            </div>
            <p class="sb-sys-type-note">The simplest system. 2 out of 3 must win.</p>
          </div>

          <div class="sb-sys-type">
            <div class="sb-sys-type-header">
              <h4>2/4 (Yankee)</h4>
              <span class="sb-sys-type-badge">4 picks</span>
            </div>
            <div class="sb-sys-type-combos">
              <div class="sb-sys-type-row"><span class="sb-sys-type-k">6 \u00d7 doubles</span><span class="sb-sys-type-k">4 \u00d7 trebles</span><span class="sb-sys-type-k">1 \u00d7 four-fold</span></div>
            </div>
            <p class="sb-sys-type-note">11 bets total. The more legs that win, the more combos pay out.</p>
          </div>

          <div class="sb-sys-type">
            <div class="sb-sys-type-header">
              <h4>2/5 (Canadian / Super Yankee)</h4>
              <span class="sb-sys-type-badge">5 picks</span>
            </div>
            <div class="sb-sys-type-combos">
              <div class="sb-sys-type-row"><span class="sb-sys-type-k">10 \u00d7 doubles</span><span class="sb-sys-type-k">10 \u00d7 trebles</span><span class="sb-sys-type-k">5 \u00d7 four-folds</span><span class="sb-sys-type-k">1 \u00d7 five-fold</span></div>
            </div>
            <p class="sb-sys-type-note">26 bets total. Can return a profit if only 2 of 5 win.</p>
          </div>

          <div class="sb-sys-type">
            <div class="sb-sys-type-header">
              <h4>2/6 (Heinz)</h4>
              <span class="sb-sys-type-badge">6 picks</span>
            </div>
            <div class="sb-sys-type-combos">
              <div class="sb-sys-type-row"><span class="sb-sys-type-k">15 \u00d7 doubles</span><span class="sb-sys-type-k">20 \u00d7 trebles</span><span class="sb-sys-type-k">15 \u00d7 four-folds</span><span class="sb-sys-type-k">6 \u00d7 five-folds</span><span class="sb-sys-type-k">1 \u00d7 six-fold</span></div>
            </div>
            <p class="sb-sys-type-note">57 bets total (yes, like the ketchup). Named after the Heinz 57 varieties.</p>
          </div>

          <div class="sb-sys-type">
            <div class="sb-sys-type-header">
              <h4>2/7 (Super Heinz)</h4>
              <span class="sb-sys-type-badge">7 picks</span>
            </div>
            <div class="sb-sys-type-combos">
              <div class="sb-sys-type-row"><span class="sb-sys-type-k">21 \u00d7 doubles</span><span class="sb-sys-type-k">35 \u00d7 trebles</span><span class="sb-sys-type-k">35 \u00d7 four-folds</span><span class="sb-sys-type-k">21 \u00d7 five-folds</span><span class="sb-sys-type-k">7 \u00d7 six-folds</span><span class="sb-sys-type-k">1 \u00d7 seven-fold</span></div>
            </div>
            <p class="sb-sys-type-note">120 bets. Your stake is multiplied by 120. High coverage, high cost.</p>
          </div>

          <div class="sb-sys-type">
            <div class="sb-sys-type-header">
              <h4>2/8 (Goliath)</h4>
              <span class="sb-sys-type-badge sb-sys-type-badge--big">8 picks</span>
            </div>
            <div class="sb-sys-type-combos">
              <div class="sb-sys-type-row"><span class="sb-sys-type-k">28 \u00d7 doubles</span><span class="sb-sys-type-k">56 \u00d7 trebles</span><span class="sb-sys-type-k">70 \u00d7 four-folds</span><span class="sb-sys-type-k">56 \u00d7 five-folds</span><span class="sb-sys-type-k">28 \u00d7 six-folds</span><span class="sb-sys-type-k">8 \u00d7 seven-folds</span><span class="sb-sys-type-k">1 \u00d7 eight-fold</span></div>
            </div>
            <p class="sb-sys-type-note">247 bets. The largest standard system. A \u20ac1 unit stake = \u20ac247 total wager.</p>
          </div>
        </div>

        <div class="sb-banker-card" style="margin-top:24px">
          <div class="sb-banker-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
          <div>
            <h3 class="sb-banker-title">Simple vs Full Systems</h3>
            <p>A <strong>5/6</strong> is just 6 five-fold combos. But a <strong>full system 2/6 (Heinz)</strong> includes <em>every</em> possible combination from doubles up \u2014 57 bets from just 6 picks.</p>
            <p style="margin-top:8px">The more sub-combinations included, the more safety net you have, but the higher your total stake. Choose based on your risk appetite.</p>
          </div>
        </div>
      </div>
    </section>`;
}

// ═══════════════ LESSON 2: HANDICAPS ═══════════════
let hcLine = '-1.25';
let hcHomeGoals = 2;
let hcAwayGoals = 1;

function calcAsianHandicap(line, homeG, awayG) {
  const diff = homeG - awayG;
  const l = parseFloat(line);
  // Quarter lines: split into two bets
  const frac = Math.abs(l) - Math.floor(Math.abs(l));
  if (frac === 0.25 || frac === 0.75) {
    const sign = l < 0 ? -1 : 1;
    const base = Math.floor(Math.abs(l));
    const l1 = sign * base;
    const l2 = sign * (base + 0.5);
    if (frac === 0.75) { /* e.g. -1.75 -> -1.5 and -2 */ }
    const r1 = calcHalfLine(l < 0 ? -(base) : base, diff);
    const r2 = calcHalfLine(l < 0 ? -(base + 0.5) : (base + 0.5), diff);
    // For -1.25 -> half on -1, half on -1.5
    // For -1.75 -> half on -1.5, half on -2
    const lines = frac === 0.25
      ? [sign * base, sign * (base + 0.5)]
      : [sign * (base + 0.5), sign * (base + 1)];
    const results = lines.map(ll => calcHalfLine(ll, diff));
    return { split: true, lines, results, overall: mergeResults(results) };
  }
  // Half lines: no draw possible
  if (frac === 0.5) {
    const adj = diff + l;
    return { split: false, result: adj > 0 ? 'WIN' : 'LOSE' };
  }
  // Full lines: refund possible
  const adj = diff + l;
  return { split: false, result: adj > 0 ? 'WIN' : adj === 0 ? 'VOID' : 'LOSE' };
}

function calcHalfLine(line, diff) {
  const adj = diff + line;
  if (adj > 0) return 'WIN';
  if (adj === 0) return 'VOID';
  return 'LOSE';
}

function mergeResults(r) {
  if (r[0] === 'WIN' && r[1] === 'WIN') return 'WIN';
  if (r[0] === 'LOSE' && r[1] === 'LOSE') return 'LOSE';
  if (r[0] === 'WIN' && r[1] === 'VOID') return 'HALF WIN';
  if (r[0] === 'VOID' && r[1] === 'WIN') return 'HALF WIN';
  if (r[0] === 'LOSE' && r[1] === 'VOID') return 'HALF LOSE';
  if (r[0] === 'VOID' && r[1] === 'LOSE') return 'HALF LOSE';
  if (r[0] === 'WIN' && r[1] === 'LOSE') return 'HALF WIN';
  if (r[0] === 'LOSE' && r[1] === 'WIN') return 'HALF WIN';
  if (r[0] === 'VOID' && r[1] === 'VOID') return 'VOID';
  return r[0];
}

function resultClass(r) {
  if (r === 'WIN') return 'sb-result-badge--win';
  if (r === 'HALF WIN') return 'sb-result-badge--halfwin';
  if (r === 'VOID') return 'sb-result-badge--void';
  if (r === 'HALF LOSE') return 'sb-result-badge--halflose';
  return 'sb-result-badge--lose';
}

const hcLines = ['-2.5', '-2.25', '-2', '-1.75', '-1.5', '-1.25', '-1', '-0.75', '-0.5', '-0.25', '0', '+0.25', '+0.5', '+0.75', '+1', '+1.25', '+1.5', '+1.75', '+2', '+2.25', '+2.5'];

function renderHandicaps() {
  const res = calcAsianHandicap(hcLine, hcHomeGoals, hcAwayGoals);

  return `

    <section class="sb-section">
      <div class="sb-container">
        <span class="sb-section-tag">EUROPEAN HANDICAPS</span>
        <h2 class="sb-section-title">The 3-Way (1X2)</h2>
        <p class="sb-section-sub">Uses whole integers. Includes the draw. Three possible outcomes.</p>

        <div class="sb-hc-examples">
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">Home -3</div>
            <p>Home must win by <strong>4+ goals</strong>. A 3-goal win? That's a <em>Handicap Draw</em> \u2014 and your bet loses.</p>
          </div>
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">Away +2</div>
            <p>Away wins if they win outright, draw, or lose by only 1 goal. Lose by exactly 2? Handicap Draw.</p>
          </div>
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">Handicap Draw</div>
            <p>Wins only on the <em>exact</em> margin. Home -2 Draw wins if Home wins 2-0, 3-1, 4-2, etc.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <span class="sb-section-tag">ASIAN HANDICAPS</span>
        <h2 class="sb-section-title">The 2-Way (No Draw)</h2>
        <p class="sb-section-sub">Eliminates the draw with half and quarter lines. Quarter lines split your stake across two lines.</p>

        <div class="sb-hc-examples">
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">-1.25</div>
            <p>Half stake on <strong>-1</strong>, half on <strong>-1.5</strong>. Win by 1? You win half (the -1 is void), lose the other half. Net: <em>Half Lose</em>.</p>
          </div>
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">-1.75</div>
            <p>Half on <strong>-1.5</strong>, half on <strong>-2</strong>. Win by 2? You win the -1.5 half, the -2 is void. Net: <em>Half Win</em>.</p>
          </div>
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">-2.5</div>
            <p>Full line. Simple: win by 3+, you win. Win by 2 or less, you lose. No splits, no refunds.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sb-section">
      <div class="sb-container">
        <span class="sb-section-tag">RESULT SIMULATOR</span>
        <h2 class="sb-section-title">Try It Yourself</h2>
        <p class="sb-section-sub">Pick a handicap line and a final score to see if you Win, Lose, Half-Win, Half-Lose, or Void.</p>


        <div class="sb-hc-legend">
          <div class="sb-hc-legend-item"><span class="sb-result-badge sb-result-badge--win">WIN</span><span>You win the full payout.</span></div>
          <div class="sb-hc-legend-item"><span class="sb-result-badge sb-result-badge--halfwin">HALF WIN</span><span>Half your stake wins, the other half is refunded.</span></div>
          <div class="sb-hc-legend-item"><span class="sb-result-badge sb-result-badge--void">VOID</span><span>Your full stake is returned \u2014 as if the bet never happened.</span></div>
          <div class="sb-hc-legend-item"><span class="sb-result-badge sb-result-badge--halflose">HALF LOSE</span><span>You lose half your stake; the other half is refunded.</span></div>
          <div class="sb-hc-legend-item"><span class="sb-result-badge sb-result-badge--lose">LOSE</span><span>You lose the entire stake. Better luck next time.</span></div>
        </div>

        <div class="sb-sim-card">
          <div class="sb-sim-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> ASIAN HANDICAP SIMULATOR \u2014 BRAZIL (HOME) PERSPECTIVE</div>

          <h4 class="sb-sim-heading">Handicap Line</h4>
          <div class="sb-hc-lines">
            ${hcLines.map(l => { const cls = parseFloat(l) < 0 ? 'sb-hc-line-btn--neg' : parseFloat(l) > 0 ? 'sb-hc-line-btn--pos' : 'sb-hc-line-btn--zero'; return '<button class="sb-hc-line-btn '+cls+' '+(l===hcLine?'active':'')+'" data-line="'+l+'">'+l+'</button>'; }).join('')}
          </div>

          <h4 class="sb-sim-heading">Final Score</h4>
          <div class="sb-hc-score">
            <div class="sb-hc-score-team">
              <div class="sb-hc-crest"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
              <span class="sb-hc-score-label">Brazil</span>
              <div class="sb-hc-score-ctrl">
                <button class="sb-hc-score-btn" data-team="home" data-dir="-1">\u2212</button>
                <span class="sb-hc-score-val" id="hc-home">${hcHomeGoals}</span>
                <button class="sb-hc-score-btn" data-team="home" data-dir="1">+</button>
              </div>
            </div>
            <span class="sb-hc-score-vs">vs</span>
            <div class="sb-hc-score-team">
              <div class="sb-hc-crest"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
              <span class="sb-hc-score-label">Malta</span>
              <div class="sb-hc-score-ctrl">
                <button class="sb-hc-score-btn" data-team="away" data-dir="-1">\u2212</button>
                <span class="sb-hc-score-val" id="hc-away">${hcAwayGoals}</span>
                <button class="sb-hc-score-btn" data-team="away" data-dir="1">+</button>
              </div>
            </div>
          </div>

          <div class="sb-hc-result">
            ${res.split ? `
              <div class="sb-hc-result-split">
                <div class="sb-hc-result-half"><span class="sb-hc-result-line">${res.lines[0] > 0 ? '+' : ''}${res.lines[0]}</span><span class="sb-result-badge ${resultClass(res.results[0])}">${res.results[0]}</span></div>
                <div class="sb-hc-result-half"><span class="sb-hc-result-line">${res.lines[1] > 0 ? '+' : ''}${res.lines[1]}</span><span class="sb-result-badge ${resultClass(res.results[1])}">${res.results[1]}</span></div>
              </div>
              <div class="sb-hc-result-overall"><span>Overall:</span> <span class="sb-result-badge ${resultClass(res.overall)}">${res.overall}</span></div>
            ` : `
              <div class="sb-hc-result-overall sb-hc-result-overall--single"><span>Result:</span> <span class="sb-result-badge ${resultClass(res.result)}">${res.result}</span></div>
            `}
          </div>
        </div>
      </div>
    </section>

    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <span class="sb-section-tag">COMPARISON</span>
        <h2 class="sb-section-title">European vs Asian</h2>
        <div class="sb-combos-wrap">
          <table class="sb-combos">
            <thead><tr><th></th><th>European Handicap</th><th>Asian Handicap</th></tr></thead>
            <tbody>
              <tr><td class="sb-combo-label">Outcomes</td><td>3-way (Win / Draw / Lose)</td><td>2-way (Win / Lose)</td></tr>
              <tr><td class="sb-combo-label">Line Types</td><td>Whole numbers only</td><td>Half, quarter, and whole</td></tr>
              <tr><td class="sb-combo-label">Draw</td><td>Possible (Handicap Draw)</td><td>Eliminated</td></tr>
              <tr><td class="sb-combo-label">Void / Refund</td><td>No</td><td>Yes (on whole lines)</td></tr>
              <tr><td class="sb-combo-label">Split Stakes</td><td>No</td><td>Yes (quarter lines)</td></tr>
              <tr><td class="sb-combo-label">Half Win/Lose</td><td>No</td><td>Yes</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>`;
}


// ═══════════════ LESSON 3: PAYBACKS ═══════════════
let coinFair = true;
let pbOdds1 = '2.10';
let pbOddsX = '3.40';
let pbOdds2 = '3.50';
let pb2OddsA = '1.90';
let pb2OddsB = '1.95';

function calcPayback2(oA, oB) {
  const sum = (1/oA) + (1/oB);
  const payback = (1/sum) * 100;
  const overround = (sum - 1) * 100;
  return { payback: payback.toFixed(1), overround: overround.toFixed(1) };
}

function calcPayback(o1, ox, o2) {
  const sum = (1/o1) + (1/ox) + (1/o2);
  const payback = (1/sum) * 100;
  const overround = (sum - 1) * 100;
  return { payback: payback.toFixed(1), overround: overround.toFixed(1), sum: sum.toFixed(4) };
}

function renderPayback() {
  const o1 = parseFloat(pbOdds1) || 2;
  const ox = parseFloat(pbOddsX) || 3;
  const o2 = parseFloat(pbOdds2) || 3;
  const pb = calcPayback(o1, ox, o2);
  const a = parseFloat(pb2OddsA) || 1.9;
  const b = parseFloat(pb2OddsB) || 1.95;
  const pb2 = calcPayback2(a, b);

  // Coin toss math
  const fairPayout = 200;
  const bookiePayout = 190;
  const fairProfit = 0;
  const bookieProfit = 10;

  return `
    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <span class="sb-section-tag">WHAT IS A PAYBACK?</span>
        <h2 class="sb-section-title">Two Definitions</h2>
        <p class="sb-section-sub">Context matters.</p>

        <div class="sb-hc-examples" style="margin-top:24px">
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">Definition 1</div>
            <p><strong>Profit from investment.</strong> The percentage of total money wagered that a bookmaker returns to bettors as winnings.</p>
          </div>
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">Definition 2</div>
            <p><strong>An act of revenge.</strong> What you\u2019ll want after understanding Definition 1.</p>
          </div>
          <div class="sb-hc-ex-card sb-hier-card--highlight">
            <div class="sb-hc-ex-line">The Takeaway</div>
            <p>The payback tells you how much of the money pool goes back to punters. The rest is the bookmaker\u2019s <em>margin</em> \u2014 their cut.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sb-section">
      <div class="sb-container">
        <span class="sb-section-tag">THE MILK ANALOGY</span>
        <h2 class="sb-section-title">Think of It Like a Shop</h2>
        <p class="sb-section-sub">A shop buys milk for \u20ac0.80 and sells it for \u20ac1.00. The customer gets 80% of the value back \u2014 the shop keeps 20%.</p>

        <div class="sb-sim-card" style="margin-top:24px">
          <div class="sb-pb-milk">
            <div class="sb-pb-milk-bar">
              <div class="sb-pb-milk-fill" style="width:80%">
                <span>80% \u2192 Customer</span>
              </div>
              <div class="sb-pb-milk-margin">
                <span>20% Margin</span>
              </div>
            </div>
            <p class="sb-sim-note" style="margin-top:16px">Bookmakers work the same way. A 95% payback means for every \u20ac100 wagered, \u20ac95 goes back to bettors and \u20ac5 is the bookie\u2019s margin. The lower the payback, the worse the deal for you.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <span class="sb-section-tag">INTERACTIVE</span>
        <h2 class="sb-section-title">The Coin Toss</h2>
        <p class="sb-section-sub">A fair coin. Two bettors. \u20ac100 each. Watch how the bookie\u2019s margin appears.</p>

        <div class="sb-sim-card" style="margin-top:24px">
          <div class="sb-sim-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> COIN TOSS SIMULATOR</div>

          <div class="sb-pb-toggle">
            <button class="sb-pb-toggle-btn ${coinFair ? 'active' : ''}" data-fair="true">Fair Odds (2.00)</button>
            <button class="sb-pb-toggle-btn ${!coinFair ? 'active' : ''}" data-fair="false">Bookie Odds (1.90)</button>
          </div>

          <div class="sb-pb-coin-grid">
            <div class="sb-pb-coin-col">
              <div class="sb-hc-crest"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M6 12h12"/></svg></div>
              <span class="sb-pb-coin-label">Bettor A</span>
              <span class="sb-pb-coin-stake">Stakes \u20ac100</span>
              <span class="sb-pb-coin-odds">@ ${coinFair ? '2.00' : '1.90'}</span>
              <span class="sb-pb-coin-win">Wins \u20ac${coinFair ? '200' : '190'}</span>
            </div>
            <div class="sb-pb-coin-col sb-pb-coin-col--vs">
              <span class="sb-hc-score-vs">vs</span>
            </div>
            <div class="sb-pb-coin-col">
              <div class="sb-hc-crest"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg></div>
              <span class="sb-pb-coin-label">Bettor B</span>
              <span class="sb-pb-coin-stake">Stakes \u20ac100</span>
              <span class="sb-pb-coin-odds">@ ${coinFair ? '2.00' : '1.90'}</span>
              <span class="sb-pb-coin-win">Wins \u20ac${coinFair ? '200' : '190'}</span>
            </div>
          </div>

          <div class="sb-pb-coin-summary ${coinFair ? '' : 'sb-pb-coin-summary--profit'}">
            <div class="sb-sim-summary-row"><span>Total Pool</span><span>\u20ac200</span></div>
            <div class="sb-sim-summary-row"><span>Winner Payout</span><span>\u20ac${coinFair ? '200' : '190'}</span></div>
            <div class="sb-sim-summary-row sb-sim-summary-total"><span>Bookie Profit</span><span class="${coinFair ? '' : 'sb-pb-profit-val'}">\u20ac${coinFair ? '0' : '10'}</span></div>
            ${!coinFair ? '<p class="sb-sim-note">That \u20ac10 is the overround. The bookie collects \u20ac200 but only pays out \u20ac190. A 5% margin on every coin toss, regardless who wins.</p>' : '<p class="sb-sim-note">Fair odds = no margin. The bookie is just holding the money. This never happens in practice.</p>'}
          </div>
        </div>
      </div>
    </section>

    <section class="sb-section">
      <div class="sb-container">
        <span class="sb-section-tag">THE FORMULA LAB</span>
        <h2 class="sb-section-title">How Payback Is Calculated</h2>
        <p class="sb-section-sub">One formula to rule them all.</p>

        <div class="sb-sim-card" style="margin-top:24px">
          <div class="sb-pb-formula">
            <span class="sb-pb-formula-label">Payback %</span>
            <span class="sb-pb-formula-eq">= 1 \u00f7 ( 1/Odds\u2081 + 1/Odds\u2082 + \u2026 + 1/Odds\u2099 ) \u00d7 100</span>
          </div>
        </div>

        <div class="sb-hc-examples" style="margin-top:24px">
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">3-Way Market</div>
            <p>Home / Draw / Away. Three outcomes.<br>Example: 2.10 / 3.40 / 3.50<br><em>Payback: \u2248 95.7%</em></p>
          </div>
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">2-Way Market</div>
            <p>Over / Under, or Asian Handicap. Two outcomes.<br>Example: 1.90 / 1.95<br><em>Payback: \u2248 96.1%</em></p>
          </div>
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">X-Way (Correct Score)</div>
            <p>Dozens of outcomes. The more outcomes, the lower the payback typically is.<br><em>Often 85\u201390%</em></p>
          </div>
        </div>
      </div>
    </section>

    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <span class="sb-section-tag">PAYBACK CALCULATOR</span>
        <h2 class="sb-section-title">Try It Yourself</h2>
        <p class="sb-section-sub">Enter odds and see the payback percentage and the bookmaker\u2019s overround.</p>

        <div class="sb-sim-card" style="margin-top:24px">
          <div class="sb-sim-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> 3-WAY MARKET CALCULATOR</div>

          <div class="sb-pb-calc-inputs">
            <div class="sb-pb-calc-field">
              <label>Home (1)</label>
              <input type="number" step="0.01" min="1" class="sb-pb-input" data-odds="1" value="${pbOdds1}" />
            </div>
            <div class="sb-pb-calc-field">
              <label>Draw (X)</label>
              <input type="number" step="0.01" min="1" class="sb-pb-input" data-odds="X" value="${pbOddsX}" />
            </div>
            <div class="sb-pb-calc-field">
              <label>Away (2)</label>
              <input type="number" step="0.01" min="1" class="sb-pb-input" data-odds="2" value="${pbOdds2}" />
            </div>
          </div>

          <div class="sb-pb-calc-result">
            <div class="sb-pb-calc-metric">
              <span class="sb-pb-calc-metric-label">Payback</span>
              <span class="sb-pb-calc-metric-val ${parseFloat(pb.payback) >= 95 ? 'sb-pb-val--good' : parseFloat(pb.payback) >= 90 ? 'sb-pb-val--ok' : 'sb-pb-val--bad'}">${pb.payback}%</span>
            </div>
            <div class="sb-pb-calc-metric">
              <span class="sb-pb-calc-metric-label">Overround</span>
              <span class="sb-pb-calc-metric-val sb-pb-val--neutral">${pb.overround}%</span>
            </div>
          </div>
          <div class="sb-pb-bar-wrap">
            <div class="sb-pb-bar">
              <div class="sb-pb-bar-fill" style="width:${Math.min(100, parseFloat(pb.payback))}%"></div>
            </div>
            <div class="sb-pb-bar-labels"><span>\u20ac0</span><span>Payback: \u20ac${(parseFloat(pb.payback)).toFixed(0)} per \u20ac100</span><span>\u20ac100</span></div>
          </div>
        </div>

        <div class="sb-sim-card" style="margin-top:16px">
          <div class="sb-sim-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> 2-WAY MARKET CALCULATOR</div>

          <div class="sb-pb-calc-inputs sb-pb-calc-inputs--2way">
            <div class="sb-pb-calc-field">
              <label>Over / Home</label>
              <input type="number" step="0.01" min="1" class="sb-pb-input sb-pb2-input" data-odds="A" value="${pb2OddsA}" />
            </div>
            <div class="sb-pb-calc-field">
              <label>Under / Away</label>
              <input type="number" step="0.01" min="1" class="sb-pb-input sb-pb2-input" data-odds="B" value="${pb2OddsB}" />
            </div>
          </div>

          <div class="sb-pb-calc-result">
            <div class="sb-pb-calc-metric">
              <span class="sb-pb-calc-metric-label">Payback</span>
              <span class="sb-pb-calc-metric-val ${parseFloat(pb2.payback) >= 95 ? 'sb-pb-val--good' : parseFloat(pb2.payback) >= 90 ? 'sb-pb-val--ok' : 'sb-pb-val--bad'}">${pb2.payback}%</span>
            </div>
            <div class="sb-pb-calc-metric">
              <span class="sb-pb-calc-metric-label">Overround</span>
              <span class="sb-pb-calc-metric-val sb-pb-val--neutral">${pb2.overround}%</span>
            </div>
          </div>
          <div class="sb-pb-bar-wrap">
            <div class="sb-pb-bar">
              <div class="sb-pb-bar-fill" style="width:${Math.min(100, parseFloat(pb2.payback))}%"></div>
            </div>
            <div class="sb-pb-bar-labels"><span>\u20ac0</span><span>Payback: \u20ac${(parseFloat(pb2.payback)).toFixed(0)} per \u20ac100</span><span>\u20ac100</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="sb-section">
      <div class="sb-container">
        <div class="sb-banker-card">
          <div class="sb-banker-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
          <div>
            <h3 class="sb-banker-title">The Long Game</h3>
            <p>Day to day, scores and results create wild swings. But zoom out \u2014 over hundreds of bets, the bookmaker\u2019s margin is a constant gravity. <em>The graph always smooths out.</em></p>
            <p style="margin-top:8px">This is why payback matters more than any single result. It\u2019s the one number that tells you the real cost of playing.</p>
          </div>
        </div>
      </div>
    </section>`;
}



// ═══════════════ LESSON 4: CASH OUT ═══════════════
let cashoutChoice = null; // null, 'cashout', 'ride'

function renderCashout() {
  const choiceHTML = cashoutChoice === 'cashout'
    ? '<div class="sb-co-verdict sb-co-verdict--cashout"><div class="sb-co-verdict-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><h4>Smart Move.</h4><p>\u20ac15 secured. No stress, no stoppage-time drama. You locked in a 50% profit on your \u20ac10 stake. Not glamorous, but profitable.</p></div>'
    : cashoutChoice === 'ride'
    ? '<div class="sb-co-verdict sb-co-verdict--ride"><div class="sb-co-verdict-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div><h4>Diamond Hands.</h4><p>You believe in the process. If Arsenal holds on, you collect \u20ac20 \u2014 double your stake. If they concede... well, at least you have a story.</p></div>'
    : '';

  return `
    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <span class="sb-section-tag">WHAT IS IT?</span>
        <h2 class="sb-section-title">The Panic Button (But Make It Strategic)</h2>
        <p class="sb-section-sub">Cash Out lets you settle a bet before the event finishes. Lock in profit when things look good, or save part of your stake when they don\u2019t.</p>

        <div class="sb-hc-examples" style="margin-top:24px">
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">Lock In Profit</div>
            <p>Your bet is winning. The bookie offers you guaranteed money <em>right now</em>. Less than the full payout, but risk-free.</p>
          </div>
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">Cut Your Losses</div>
            <p>Your bet is losing. Cash out to recover a fraction of your stake instead of watching it go to zero.</p>
          </div>
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">The Catch</div>
            <p>The bookie\u2019s cash-out offer always has a <em>margin built in</em>. You\u2019re paying a premium for certainty.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sb-section">
      <div class="sb-container">
        <span class="sb-section-tag">THE SCENARIO</span>
        <h2 class="sb-section-title">The 80th Minute Dilemma</h2>
        <p class="sb-section-sub">You placed a bet. It\u2019s almost over. But \u201calmost\u201d is the most dangerous word in football.</p>

        <div class="sb-sim-card" style="margin-top:24px">
          <div class="sb-sim-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> LIVE SCENARIO</div>

          <div class="sb-co-match">
            <div class="sb-co-teams">
              <div class="sb-co-team">
                <div class="sb-hc-crest"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                <span class="sb-co-team-name">Arsenal</span>
              </div>
              <div class="sb-co-score">1 - 0</div>
              <div class="sb-co-team">
                <div class="sb-hc-crest"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></div>
                <span class="sb-co-team-name">Opponent</span>
              </div>
            </div>

            <div class="sb-co-progress">
              <div class="sb-co-progress-bar">
                <div class="sb-co-progress-fill" style="width:89%"></div>
                <div class="sb-co-progress-marker" style="left:89%"><span>85\u2032</span></div>
              </div>
              <div class="sb-co-progress-labels"><span>0\u2032</span><span>45\u2032</span><span>90\u2032</span></div>
            </div>

            <div class="sb-co-context">
              <p>\u26a0\ufe0f 82\u2032 \u2014 Opponent just hit the post. The momentum is shifting.</p>
            </div>
          </div>

          <div class="sb-co-bet-info">
            <div class="sb-sim-summary-row"><span>Your Stake</span><span>\u20ac10</span></div>
            <div class="sb-sim-summary-row"><span>Full Payout (if Arsenal wins)</span><span style="color:#34d399">\u20ac20</span></div>
            <div class="sb-sim-summary-row sb-sim-summary-total"><span>Cash Out Offer</span><span style="color:var(--accent)">\u20ac15</span></div>
          </div>

          <h4 class="sb-sim-heading" style="text-align:center;margin-top:24px">What Do You Do?</h4>
          <div class="sb-co-buttons">
            <button class="sb-co-btn sb-co-btn--cashout ${cashoutChoice === 'cashout' ? 'active' : ''}" data-choice="cashout">Cash Out (\u20ac15)</button>
            <button class="sb-co-btn sb-co-btn--ride ${cashoutChoice === 'ride' ? 'active' : ''}" data-choice="ride">Ride It Out (\u20ac20)</button>
          </div>
          ${choiceHTML}
          ${cashoutChoice ? '<button class="sb-reset-btn sb-btn sb-btn--ghost" data-sim="cashout" style="margin-top:12px;display:block;margin-left:auto;margin-right:auto">Try Again</button>' : ''}
        </div>
      </div>
    </section>

    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <div class="sb-banker-card">
          <div class="sb-banker-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
          <div>
            <h3 class="sb-banker-title">When to Cash Out</h3>
            <p>There\u2019s no universal rule. But ask yourself: <em>\u201cWould I place this bet again at these odds right now?\u201d</em></p>
            <p style="margin-top:8px">If the answer is no, take the money. If yes, let it ride. Either way, it\u2019s about discipline \u2014 not luck.</p>
          </div>
        </div>
      </div>
    </section>`;
}



// ═══════════════ LESSON 5: BET BUILDER ═══════════════
const bbMarkets = [
  { id: 'mcwin',   label: 'Man City to Win',           odds: 1.45, cat: 'result',    group: 'Result' },
  { id: 'draw',    label: 'Draw',                      odds: 4.20, cat: 'result',    group: 'Result' },
  { id: 'btts',    label: 'Both Teams to Score',       odds: 1.72, cat: 'goals',     group: 'Goals' },
  { id: 'ov25',    label: 'Over 2.5 Goals',            odds: 1.65, cat: 'goals',     group: 'Goals' },
  { id: 'un25',    label: 'Under 2.5 Goals',           odds: 2.25, cat: 'goals',     group: 'Goals' },
  { id: 'haaland', label: 'Haaland to Score Anytime',  odds: 1.80, cat: 'scorer',    group: 'Goalscorer' },
  { id: 'vini',    label: 'Vinicius to Score Anytime', odds: 3.10, cat: 'scorer',    group: 'Goalscorer' },
  { id: 'ov10c',   label: 'Over 10.5 Corners',         odds: 2.10, cat: 'corners',   group: 'Corners' },
  { id: 'mc15c',   label: 'Man City Over 5.5 Corners', odds: 2.00, cat: 'corners',   group: 'Corners' },
  { id: 'ov3card', label: 'Over 3.5 Cards',            odds: 1.85, cat: 'cards',     group: 'Cards' },
];
const bbActive = new Set();

// Correlation factors: pairs that overlap. Higher = more correlated (1 = fully overlapping, 0 = independent)
const correlations = {
  'mcwin+haaland':  { factor: 0.30, reason: 'If City win, Haaland is more likely to have scored.' },
  'mcwin+ov25':     { factor: 0.25, reason: 'City winning usually involves goals \u2014 the "over" becomes more likely.' },
  'mcwin+btts':     { factor: 0.10, reason: 'City winning doesn\u2019t strongly predict conceding, but attacking play increases chances.' },
  'mcwin+un25':     { factor: 0.20, reason: 'Conflicting: City winning AND few goals is possible (1-0), but less common.' },
  'mcwin+mc15c':    { factor: 0.20, reason: 'A dominant City means more attacking play and more corners.' },
  'draw+un25':      { factor: 0.25, reason: 'Draws are often low-scoring. These overlap significantly.' },
  'draw+btts':      { factor: 0.15, reason: 'A draw with both teams scoring (1-1, 2-2) is a specific subset.' },
  'btts+ov25':      { factor: 0.35, reason: 'If both teams score, you already have 2+ goals. Strong overlap.' },
  'btts+haaland':   { factor: 0.20, reason: 'Both teams scoring raises the chance any individual player scores.' },
  'btts+vini':      { factor: 0.20, reason: 'Same logic: more goals = more chances for individual scorers.' },
  'ov25+haaland':   { factor: 0.20, reason: 'More goals in the match = higher chance Haaland is among the scorers.' },
  'ov25+vini':      { factor: 0.20, reason: 'More goals = more chances for Vinicius too.' },
  'ov25+un25':      { factor: 1.00, reason: 'These are mutually exclusive. You cannot have both.' },
  'haaland+vini':   { factor: 0.05, reason: 'Largely independent \u2014 different teams, different roles.' },
  'ov10c+mc15c':    { factor: 0.40, reason: 'City\u2019s corners are a subset of total corners. High overlap.' },
  'ov10c+ov25':     { factor: 0.15, reason: 'High-scoring games tend to have more corners, but the link is moderate.' },
  'un25+haaland':   { factor: 0.15, reason: 'Fewer goals means less chance for any scorer. Mild negative.' },
  'un25+vini':      { factor: 0.15, reason: 'Same: fewer goals = fewer scoring chances.' },
};

function getCorrelation(id1, id2) {
  const key1 = id1 + '+' + id2;
  const key2 = id2 + '+' + id1;
  return correlations[key1] || correlations[key2] || null;
}

function calcBBOdds() {
  const active = bbMarkets.filter(m => bbActive.has(m.id));
  if (active.length === 0) return { naive: 0, adjusted: 0, pairs: [] };
  
  const naive = active.reduce((acc, m) => acc * m.odds, 1);
  
  // Find all correlated pairs among active selections
  const pairs = [];
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const cor = getCorrelation(active[i].id, active[j].id);
      if (cor) pairs.push({ a: active[i], b: active[j], ...cor });
    }
  }
  
  // Apply correlation penalty: reduce odds for each correlated pair
  // This is a simplified educational model, not real pricing
  let penalty = 1;
  pairs.forEach(p => {
    penalty *= (1 - p.factor * 0.3); // Each correlation reduces odds
  });
  
  const adjusted = naive * penalty;
  return { naive, adjusted, pairs, active };
}

function renderBetBuilder() {
  const result = calcBBOdds();
  const stake = 10;
  const groups = [...new Set(bbMarkets.map(m => m.group))];
  const hasMutualExclusive = result.pairs.some(p => p.factor >= 1.0);

  return `
    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <span class="sb-section-tag">WHAT IS IT?</span>
        <h2 class="sb-section-title">A Game Within a Game</h2>
        <p class="sb-section-sub">A Bet Builder combines multiple predictions from a <em>single match</em> into one bet. But here\u2019s the twist: the odds aren\u2019t as simple as just multiplying them together.</p>

        <div class="sb-hc-examples" style="margin-top:24px">
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">The Promise</div>
            <p>Combine match result, goalscorers, corners, cards \u2014 whatever you fancy. The more legs, the bigger the payout.</p>
          </div>
          <div class="sb-hc-ex-card">
            <div class="sb-hc-ex-line">The Catch</div>
            <p><strong>All legs must win.</strong> And because events in the same match are linked, the bookmaker adjusts the odds downward.</p>
          </div>
          <div class="sb-hc-ex-card sb-hier-card--highlight">
            <div class="sb-hc-ex-line">The Correlation</div>
            <p>If City win, Haaland probably scored. If there are lots of goals, there are probably lots of corners. <em>These events overlap.</em></p>
          </div>
        </div>
      </div>
    </section>

    <section class="sb-section">
      <div class="sb-container">
        <span class="sb-section-tag">MARKET BUILDER</span>
        <h2 class="sb-section-title">Man City vs Real Madrid</h2>
        <p class="sb-section-sub">Select markets to build your bet. Watch how correlations affect the real odds.</p>

        <div class="sb-sim-card" style="margin-top:24px">
          <div class="sb-sim-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> SELECT YOUR MARKETS</div>

          ${groups.map(g => `
            <h4 class="sb-sim-heading" style="margin-top:16px">${g}</h4>
            <div class="sb-bb-legs">
              ${bbMarkets.filter(m => m.group === g).map(m => `
                <button class="sb-bb-leg ${bbActive.has(m.id) ? 'sb-bb-leg--active' : ''} ${hasMutualExclusive && bbActive.has(m.id) && result.pairs.some(p => p.factor >= 1.0 && (p.a.id === m.id || p.b.id === m.id)) ? 'sb-bb-leg--conflict' : ''}" data-leg="${m.id}">
                  <div class="sb-bb-leg-check"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
                  <div class="sb-bb-leg-info">
                    <span class="sb-bb-leg-label">${m.label}</span>
                    <span class="sb-bb-leg-odds">@ ${m.odds.toFixed(2)}</span>
                  </div>
                </button>
              `).join('')}
            </div>
          `).join('')}

          ${result.active && result.active.length > 0 ? `
            <div class="sb-bb-slip" style="margin-top:20px">
              <div class="sb-bb-slip-header">
                <span>Bet Slip</span>
                <span>${result.active.length} leg${result.active.length > 1 ? 's' : ''}</span>
              </div>

              ${result.active.length > 1 ? `
                <div class="sb-bb-odds-compare">
                  <div class="sb-bb-odds-col">
                    <span class="sb-bb-odds-label">Na\u00efve Odds</span>
                    <span class="sb-bb-odds-val sb-bb-odds-val--naive">${result.naive.toFixed(2)}</span>
                    <span class="sb-bb-odds-note">Simple multiplication</span>
                  </div>
                  <div class="sb-bb-odds-arrow">\u2192</div>
                  <div class="sb-bb-odds-col">
                    <span class="sb-bb-odds-label">Adjusted Odds</span>
                    <span class="sb-bb-odds-val sb-bb-odds-val--adjusted">${result.adjusted.toFixed(2)}</span>
                    <span class="sb-bb-odds-note">After correlation</span>
                  </div>
                  ${result.naive > result.adjusted ? `<div class="sb-bb-odds-diff">\u2212${((1 - result.adjusted / result.naive) * 100).toFixed(0)}% reduction</div>` : ''}
                </div>
              ` : `
                <div class="sb-bb-slip-odds" style="text-align:center">
                  <div class="sb-bb-slip-calc">Combined Odds: <strong>${result.naive.toFixed(2)}</strong></div>
                </div>
              `}

              <div class="sb-sim-summary-row"><span>Stake</span><span>\u20ac${stake.toFixed(2)}</span></div>
              <div class="sb-sim-summary-row sb-sim-summary-total"><span>Potential Payout</span><span style="color:#34d399">\u20ac${(stake * result.adjusted).toFixed(2)}</span></div>
            </div>

            ${result.pairs.length > 0 ? `
              <div class="sb-bb-correlations" style="margin-top:16px">
                <h4 class="sb-sim-heading">Why the odds dropped</h4>
                ${result.pairs.map(p => `
                  <div class="sb-bb-cor-item ${p.factor >= 1.0 ? 'sb-bb-cor-item--conflict' : p.factor >= 0.3 ? 'sb-bb-cor-item--high' : p.factor >= 0.15 ? 'sb-bb-cor-item--med' : 'sb-bb-cor-item--low'}">
                    <div class="sb-bb-cor-header">
                      <span class="sb-bb-cor-pair">${p.a.label} + ${p.b.label}</span>
                      <span class="sb-bb-cor-level">${p.factor >= 1.0 ? '\u26d4 CONFLICT' : p.factor >= 0.3 ? 'HIGH' : p.factor >= 0.15 ? 'MEDIUM' : 'LOW'}</span>
                    </div>
                    <p class="sb-bb-cor-reason">${p.reason}</p>
                  </div>
                `).join('')}
              </div>
            ` : '<p class="sb-sim-hint" style="margin-top:12px">These selections have no known correlation \u2014 the na\u00efve odds are close to accurate.</p>'}
          ` : '<p class="sb-sim-hint" style="margin-top:20px">Select at least one market to start building your bet.</p>'}
        </div>
      </div>
    </section>

    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <div class="sb-banker-card" style="border-color:rgba(239,68,68,0.2);background:rgba(239,68,68,0.02)">
          <div class="sb-banker-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
          <div>
            <h3 class="sb-banker-title" style="color:#ef4444">The Real Cost</h3>
            <p>The bookmaker calculates these correlations automatically and builds them into the price. On top of that, they add their own margin. Bet Builders typically carry <em>much higher margins</em> than standard singles.</p>
            <p style="margin-top:8px">High payouts look exciting. But the house edge on a 5-leg Bet Builder can be 25%+ compared to 5% on a simple single. Choose wisely.</p>
          </div>
        </div>
      </div>
    </section>`;
}



// ═══════════════ LESSON 6: THE COMBI TAX ═══════════════
let ctLegs = 5;
let ctPaybackBase = 95;

function renderCombiTax() {
  const pb = ctPaybackBase / 100;
  const steps = [1, 2, 3, 5, 7, 10, 12];
  const currentVal = Math.pow(pb, ctLegs) * 100;
  const bookieEdge = 100 - currentVal;

  return `
    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <span class="sb-section-tag">THE MULTIPLICATION RULE</span>
        <h2 class="sb-section-title">Margin Compounds. Fast.</h2>
        <p class="sb-section-sub">A single bet at 95% payback keeps 5% for the bookie. Sounds fair. But in a combi, that 5% compounds with every leg you add.</p><p class="sb-section-sub" style="margin-top:8px"><em>New to payback? <a href="#" class="sb-link-lesson" data-lesson="payback">Start with Lesson 3: Paybacks</a> first.</em></p>

        <div class="sb-sim-card" style="margin-top:24px">
          <div class="sb-pb-formula">
            <span class="sb-pb-formula-label">Combi Payback</span>
            <span class="sb-pb-formula-eq">= (Single Payback)&#x207F; = ${ctPaybackBase}%&#x207F;</span>
          </div>
        </div>
      </div>
    </section>

    <section class="sb-section">
      <div class="sb-container">
        <span class="sb-section-tag">THE VALUE LEAK</span>
        <h2 class="sb-section-title">Watch Your Value Disappear</h2>
        <p class="sb-section-sub">Each leg you add silently drains more value from your bet.</p>

        <div class="sb-ct-steps">
          ${steps.map(n => {
            const val = (Math.pow(pb, n) * 100).toFixed(1);
            const lost = (100 - parseFloat(val)).toFixed(1);
            return `<div class="sb-ct-step ${n === ctLegs ? 'sb-ct-step--active' : ''} ${parseFloat(val) < 70 ? 'sb-ct-step--danger' : parseFloat(val) < 85 ? 'sb-ct-step--warn' : ''}">
              <div class="sb-ct-step-n">${n} leg${n > 1 ? 's' : ''}</div>
              <div class="sb-ct-step-bar-wrap">
                <div class="sb-ct-step-bar">
                  <div class="sb-ct-step-fill" style="width:${val}%"></div>
                </div>
              </div>
              <div class="sb-ct-step-vals">
                <span class="sb-ct-step-val">${val}%</span>
                <span class="sb-ct-step-lost">\u2212${lost}%</span>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </section>

    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <span class="sb-section-tag">VALUE SLICER</span>
        <h2 class="sb-section-title">Try It Yourself</h2>
        <p class="sb-section-sub">Slide to see how many legs it takes to give the bookie half your value.</p>

        <div class="sb-sim-card" style="margin-top:24px">
          <div class="sb-sim-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> COMBI PAYBACK SIMULATOR</div>

          <div class="sb-ct-base-row">
            <span class="sb-ct-base-label">Base Payback</span>
            <div class="sb-ct-base-btns">
              ${[90, 92, 95, 97].map(v => `<button class="sb-ct-base-btn ${v === ctPaybackBase ? 'active' : ''}" data-base="${v}">${v}%</button>`).join('')}
            </div>
          </div>

          <div class="sb-ct-slider-wrap">
            <label class="sb-ct-slider-label">Number of Legs: <strong>${ctLegs}</strong></label>
            <input type="range" min="1" max="12" value="${ctLegs}" class="sb-ct-slider" id="ct-slider" />
            <div class="sb-ct-slider-ticks">${Array.from({length:12},(_,i)=>'<span class="'+(i+1===ctLegs?'sb-ct-tick--active':'')+'">'+(i+1)+'</span>').join('')}</div>
          </div>

          <div class="sb-ct-result">
            <div class="sb-ct-donut">
              <svg viewBox="0 0 120 120" class="sb-ct-donut-svg">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(239,68,68,0.15)" stroke-width="12"/>
                <circle cx="60" cy="60" r="52" fill="none" stroke="${currentVal >= 80 ? '#34d399' : currentVal >= 60 ? '#fbbf24' : '#ef4444'}" stroke-width="12" 
                  stroke-dasharray="${(currentVal / 100) * 326.7} ${326.7 - (currentVal / 100) * 326.7}" 
                  stroke-dashoffset="81.7" stroke-linecap="round" class="sb-ct-donut-fill"/>
              </svg>
              <div class="sb-ct-donut-text">
                <span class="sb-ct-donut-val" style="color:${currentVal >= 80 ? '#34d399' : currentVal >= 60 ? '#fbbf24' : '#ef4444'}">${currentVal.toFixed(1)}%</span>
                <span class="sb-ct-donut-label">Value Left</span>
              </div>
            </div>

            <div class="sb-ct-result-details">
              <div class="sb-sim-summary-row"><span>Your Value</span><span style="color:${currentVal >= 80 ? '#34d399' : currentVal >= 60 ? '#fbbf24' : '#ef4444'}">${currentVal.toFixed(1)}%</span></div>
              <div class="sb-sim-summary-row"><span>Bookie\u2019s Edge</span><span style="color:#ef4444">${bookieEdge.toFixed(1)}%</span></div>
              <div class="sb-sim-summary-row sb-sim-summary-total"><span>On a \u20ac100 bet</span><span>You lose <span style="color:#ef4444">\u20ac${bookieEdge.toFixed(0)}</span> to margin</span></div>
            </div>
          </div>

          ${ctLegs >= 8 ? '<p class="sb-sim-note" style="color:#ef4444">At '+ctLegs+' legs, the bookie is keeping \u20ac'+bookieEdge.toFixed(0)+' of every \u20ac100 before the match even starts. This is why they offer Acca Insurance \u2014 they want you adding more legs.</p>' : ''}
        </div>
      </div>
    </section>

    <section class="sb-section">
      <div class="sb-container">
        <div class="sb-banker-card">
          <div class="sb-banker-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
          <div>
            <h3 class="sb-banker-title">Why Bookies Love Accas</h3>
            <p>Acca Insurance, bonus boosts, \u201cfree bet if one leg loses\u201d \u2014 these aren\u2019t acts of generosity. They\u2019re calculated incentives to get you adding more legs, because the math is <em>heavily</em> in their favour.</p>
            <p style="margin-top:8px;color:var(--text-muted);font-size:0.78rem">Still want to place that 12-fold? At least now you know the cost.</p>
          </div>
        </div>
      </div>
    </section>`;
}


// ═══════════════ MAIN RENDER ═══════════════
function renderPage() {
  const app = document.getElementById('betting-app');
  const lesson = lessons.find(l => l.id === currentLesson);

  // Back button + lesson header + content
  const backBtn = '<div class="sb-container" style="padding-top:80px"><button id="sb-back" class="sb-btn sb-btn--ghost" style="margin-bottom:16px">\u2190 All Lessons</button></div>';
  const lessonHero = lesson ? `<section class="sb-hero sb-hero--centered" style="padding-bottom:40px"><div class="sb-container"><span class="sb-tag">${lesson.tag}</span><h1 class="sb-hero-title">${lesson.title}:<br><span>${lesson.sub}</span></h1></div></section>` : '';

  if (!currentLesson) {
    app.innerHTML = renderPicker();
  } else if (currentLesson === 'system-bets') {
    app.innerHTML = backBtn + lessonHero + renderSystemBets();
  } else if (currentLesson === 'handicaps') {
    app.innerHTML = backBtn + lessonHero + renderHandicaps();
  } else if (currentLesson === 'payback') {
    app.innerHTML = backBtn + lessonHero + renderPayback();
  } else if (currentLesson === 'cashout') {
    app.innerHTML = backBtn + lessonHero + renderCashout();
  } else if (currentLesson === 'betbuilder') {
    app.innerHTML = backBtn + lessonHero + renderBetBuilder();
  } else if (currentLesson === 'combitax') {
    app.innerHTML = backBtn + lessonHero + renderCombiTax();
  }

  bindEvents();
}

function bindEvents() {
  // Lesson picker
  document.querySelectorAll('.sb-lesson-card').forEach(c => {
    c.addEventListener('click', () => { currentLesson = c.dataset.lesson; renderPage(); window.scrollTo(0, 0); });
  });
  // Back
  document.getElementById('sb-back')?.addEventListener('click', () => { currentLesson = null; renderPage(); window.scrollTo(0, 0); });

  // System bet simulators
  document.querySelectorAll('.sb-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = sims[btn.dataset.sim]; const i = parseInt(btn.dataset.pick); const r = btn.dataset.result === 'win';
      p[i].won = p[i].won === r ? null : r; renderPage();
    });
  });
  document.querySelectorAll('.sb-reset-btn').forEach(btn => {
    btn.addEventListener('click', () => { sims[btn.dataset.sim].forEach(p => p.won = null); renderPage(); });
  });

  // Handicap simulator
  document.querySelectorAll('.sb-hc-line-btn').forEach(btn => {
    btn.addEventListener('click', () => { hcLine = btn.dataset.line; renderPage(); });
  });
  document.querySelectorAll('.sb-hc-score-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = parseInt(btn.dataset.dir);
      if (btn.dataset.team === 'home') hcHomeGoals = Math.max(0, hcHomeGoals + d);
      else hcAwayGoals = Math.max(0, hcAwayGoals + d);
      renderPage();
    });
  });

  // Payback lesson
  document.querySelectorAll('.sb-pb-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => { coinFair = btn.dataset.fair === 'true'; renderPage(); });
  });
  document.querySelectorAll('.sb-pb-input:not(.sb-pb2-input)').forEach(inp => {
    inp.addEventListener('input', () => {
      if (inp.dataset.odds === '1') pbOdds1 = inp.value;
      else if (inp.dataset.odds === 'X') pbOddsX = inp.value;
      else pbOdds2 = inp.value;
      renderPage();
      const el = document.querySelector('.sb-pb-input:not(.sb-pb2-input)[data-odds="'+inp.dataset.odds+'"]');
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    });
  });
  // Cash out
  document.querySelectorAll('.sb-co-btn').forEach(btn => {
    btn.addEventListener('click', () => { cashoutChoice = btn.dataset.choice; renderPage(); });
  });
  // Bet builder legs
  document.querySelectorAll('.sb-bb-leg').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.leg;
      if (bbActive.has(id)) bbActive.delete(id); else bbActive.add(id);
      renderPage();
    });
  });

  // Cross-lesson links
  document.querySelectorAll('.sb-link-lesson').forEach(a => {
    a.addEventListener('click', (e) => { e.preventDefault(); currentLesson = a.dataset.lesson; renderPage(); window.scrollTo(0, 0); });
  });

  // Combi tax
  document.getElementById('ct-slider')?.addEventListener('input', (e) => {
    ctLegs = parseInt(e.target.value);
    renderPage();
    document.getElementById('ct-slider')?.focus();
  });
  document.querySelectorAll('.sb-ct-base-btn').forEach(btn => {
    btn.addEventListener('click', () => { ctPaybackBase = parseInt(btn.dataset.base); renderPage(); });
  });

  // Cash out reset
  document.querySelectorAll('.sb-reset-btn[data-sim="cashout"]').forEach(btn => {
    btn.addEventListener('click', () => { cashoutChoice = null; renderPage(); });
  });

  document.querySelectorAll('.sb-pb2-input').forEach(inp => {
    inp.addEventListener('input', () => {
      if (inp.dataset.odds === 'A') pb2OddsA = inp.value;
      else pb2OddsB = inp.value;
      renderPage();
      const el = document.querySelector('.sb-pb2-input[data-odds="'+inp.dataset.odds+'"]');
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    });
  });
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Check URL hash for direct lesson link
if (location.hash) {
  const id = location.hash.slice(1);
  if (lessons.find(l => l.id === id)) currentLesson = id;
}

renderPage();
trackEvent('pageview');
