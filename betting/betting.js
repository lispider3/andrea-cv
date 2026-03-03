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
];

function renderPicker() {
  return `
    <section class="sb-hero sb-hero--centered">
      <div class="sb-container">
        <span class="sb-tag">BETTING EDUCATION</span>
        <h1 class="sb-hero-title">Sportsbook<br><span>Masterclass</span></h1>
        <p class="sb-hero-sub">Interactive lessons on betting mechanics, from system bets to handicaps.</p>
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
    </div></section>`;
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

const hcLines = ['-2.5', '-2', '-1.75', '-1.5', '-1.25', '-1', '-0.75', '-0.5', '-0.25', '0', '+0.25', '+0.5', '+0.75', '+1', '+1.25', '+1.5'];

function renderHandicaps() {
  const res = calcAsianHandicap(hcLine, hcHomeGoals, hcAwayGoals);

  return `
    <section class="sb-section sb-section--alt">
      <div class="sb-container">
        <span class="sb-section-tag">THE HOOK</span>
        <h2 class="sb-section-title">Handicaps: Probably Created to Annoy People</h2>
        <p class="sb-section-sub">"A circumstance that makes progress or success difficult." Handicaps make lopsided matches \u2014 like Brazil vs Malta \u2014 worth betting on, by giving the stronger team a hurdle to clear.</p>
      </div>
    </section>

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
          <div class="sb-sim-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> ASIAN HANDICAP SIMULATOR \u2014 HOME TEAM PERSPECTIVE</div>

          <h4 class="sb-sim-heading">Handicap Line</h4>
          <div class="sb-hc-lines">
            ${hcLines.map(l => '<button class="sb-hc-line-btn '+(l===hcLine?'active':'')+'" data-line="'+l+'">'+l+'</button>').join('')}
          </div>

          <h4 class="sb-sim-heading">Final Score</h4>
          <div class="sb-hc-score">
            <div class="sb-hc-score-team">
              <span class="sb-hc-score-label">Home</span>
              <div class="sb-hc-score-ctrl">
                <button class="sb-hc-score-btn" data-team="home" data-dir="-1">\u2212</button>
                <span class="sb-hc-score-val" id="hc-home">${hcHomeGoals}</span>
                <button class="sb-hc-score-btn" data-team="home" data-dir="1">+</button>
              </div>
            </div>
            <span class="sb-hc-score-vs">vs</span>
            <div class="sb-hc-score-team">
              <span class="sb-hc-score-label">Away</span>
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
