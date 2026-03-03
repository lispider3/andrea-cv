import '../src/style.css';
import { trackEvent } from '../src/tracker.js';

const STAKE_PER_COMBO = 10;

function combinations(arr, k) {
  const result = [];
  function helper(start, combo) {
    if (combo.length === k) { result.push([...combo]); return; }
    for (let i = start; i < arr.length; i++) { combo.push(arr[i]); helper(i + 1, combo); combo.pop(); }
  }
  helper(0, []);
  return result;
}

function calcCombo(picks, legs, label) {
  const allDecided = legs.every(i => picks[i].won !== null);
  const won = legs.every(i => picks[i].won === true);
  const combinedOdds = legs.reduce((acc, i) => acc * picks[i].odds, 1);
  return { label, legs, combinedOdds: combinedOdds.toFixed(2), payout: won ? (STAKE_PER_COMBO * combinedOdds).toFixed(2) : '0.00', won: allDecided ? won : null, teams: legs.map(i => picks[i].team) };
}

function renderSimulator(picks, comboSize, id) {
  const indices = picks.map((_, i) => i);
  const comboLegs = combinations(indices, comboSize);
  const combos = comboLegs.map((legs, i) => calcCombo(picks, legs, 'Bet ' + (i + 1)));
  const totalStake = (STAKE_PER_COMBO * combos.length).toFixed(2);
  const totalReturn = combos.reduce((s, c) => s + parseFloat(c.payout), 0).toFixed(2);
  const allDecided = picks.every(p => p.won !== null);
  const profit = (totalReturn - totalStake).toFixed(2);
  const totalPicks = picks.length;
  const foldLabel = comboSize === 2 ? 'Double' : comboSize === 3 ? 'Treble' : comboSize === 4 ? 'Four-Fold' : comboSize === 5 ? 'Five-Fold' : comboSize + '-Fold';

  return '<div class="sb-sim-card">'
    + '<div class="sb-sim-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> OUTCOME SIMULATOR \u2014 ' + combos.length + ' COMBINATIONS \u2014 \u20ac' + totalStake + ' TOTAL STAKE</div>'
    + '<h4 class="sb-sim-heading">Your ' + totalPicks + ' Picks</h4>'
    + '<div class="sb-picks sb-picks--' + totalPicks + '">'
    + picks.map((p, i) =>
      '<div class="sb-pick ' + (p.won === true ? 'sb-pick--won' : '') + ' ' + (p.won === false ? 'sb-pick--lost' : '') + '">'
      + '<div class="sb-pick-team">' + p.team + '</div>'
      + '<div class="sb-pick-odds">@ ' + p.odds.toFixed(2) + '</div>'
      + '<div class="sb-pick-btns">'
      + '<button class="sb-pick-btn sb-pick-btn--win ' + (p.won === true ? 'active' : '') + '" data-sim="' + id + '" data-pick="' + i + '" data-result="win">Win</button>'
      + '<button class="sb-pick-btn sb-pick-btn--lose ' + (p.won === false ? 'active' : '') + '" data-sim="' + id + '" data-pick="' + i + '" data-result="lose">Lose</button>'
      + '</div></div>'
    ).join('')
    + '</div>'
    + '<h4 class="sb-sim-heading">' + combos.length + ' ' + foldLabel + '-Bet Combinations</h4>'
    + '<div class="sb-combos-wrap"><table class="sb-combos"><thead><tr><th></th><th>Legs</th><th>Combined Odds</th><th>Stake</th><th>Payout</th><th>Result</th></tr></thead><tbody>'
    + combos.map(c =>
      '<tr class="' + (c.won === true ? 'sb-combo--won' : '') + ' ' + (c.won === false ? 'sb-combo--lost' : '') + '">'
      + '<td class="sb-combo-label">' + c.label + '</td>'
      + '<td>' + c.teams.join(' + ') + '</td>'
      + '<td>' + c.combinedOdds + '</td>'
      + '<td>\u20ac' + STAKE_PER_COMBO.toFixed(2) + '</td>'
      + '<td class="sb-combo-payout">' + (c.won === true ? '\u20ac' + c.payout : c.won === false ? '\u20ac0.00' : '\u2014') + '</td>'
      + '<td>' + (c.won === true ? '<span class="sb-result-badge sb-result-badge--win">WIN</span>' : c.won === false ? '<span class="sb-result-badge sb-result-badge--lose">LOSE</span>' : '<span class="sb-result-badge">\u2014</span>') + '</td></tr>'
    ).join('')
    + '</tbody></table></div>'
    + (allDecided ?
      '<div class="sb-sim-summary ' + (parseFloat(profit) >= 0 ? 'sb-sim-summary--profit' : 'sb-sim-summary--loss') + '">'
      + '<div class="sb-sim-summary-row"><span>Total Stake (' + combos.length + ' \u00d7 \u20ac' + STAKE_PER_COMBO + ')</span><span>\u20ac' + totalStake + '</span></div>'
      + '<div class="sb-sim-summary-row"><span>Total Return</span><span>\u20ac' + totalReturn + '</span></div>'
      + '<div class="sb-sim-summary-row sb-sim-summary-total"><span>Profit / Loss</span><span>' + (parseFloat(profit) >= 0 ? '+' : '') + '\u20ac' + profit + '</span></div>'
      + (parseFloat(profit) > 0 ? '<p class="sb-sim-note">The system absorbed the loss' + (picks.filter(p => !p.won).length > 1 ? 'es' : '') + ' and still delivered a profit.</p>' : '')
      + '</div>'
      : '<p class="sb-sim-hint">Toggle each pick\'s result to see how the ' + comboSize + '/' + totalPicks + ' system pays out.</p>')
    + (allDecided ? '<button class="sb-reset-btn sb-btn sb-btn--ghost" data-sim="' + id + '" style="margin-top:16px">Reset</button>' : '')
    + '</div>';
}

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

function renderPage() {
  const app = document.getElementById('betting-app');

  app.innerHTML = `
    <section class="sb-hero sb-hero--centered">
      <div class="sb-container">
        <span class="sb-tag">BETTING EDUCATION</span>
        <h1 class="sb-hero-title">System Bets:<br><span>The Art of Winning<br>Even When You Lose</span></h1>
        <p class="sb-hero-sub">Almost winning is a tragedy. System bets make it a strategy.</p>
        <a href="#the-why" class="sb-btn sb-btn--primary">Start Learning</a>
      </div>
    </section>

    <section class="sb-section" id="the-why">
      <div class="sb-container">
        <span class="sb-section-tag">THE HIERARCHY</span>
        <h2 class="sb-section-title">Not All Bets Are Created Equal</h2>
        <p class="sb-section-sub">To understand system bets, you first need to understand what came before them — and why they exist.</p>
        <div class="sb-hierarchy">
          <div class="sb-hier-card">
            <div class="sb-hier-num">01</div>
            <h3>Single Bets</h3>
            <p>One outcome. One result. You pick a winner, it wins, you get paid. Straightforward, honest, unglamorous.</p>
            <div class="sb-hier-tag sb-hier-tag--green">Low Risk</div>
          </div>
          <div class="sb-hier-arrow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
          <div class="sb-hier-card">
            <div class="sb-hier-num">02</div>
            <h3>Combi / Acca Bets</h3>
            <p>Multiple picks, one bet. The odds multiply — and so does the heartbreak. <em>Every single leg must win.</em> Miss one and you get nothing.</p>
            <div class="sb-hier-tag sb-hier-tag--amber">High Risk</div>
          </div>
          <div class="sb-hier-arrow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
          <div class="sb-hier-card sb-hier-card--highlight">
            <div class="sb-hier-num">03</div>
            <h3>System Bets</h3>
            <p>The safety net. A system bet is a mixture of several accumulator bets that lets you <strong>lose one or more legs and still win</strong> part of your stake back.</p>
            <div class="sb-hier-tag sb-hier-tag--gold">Smart Risk</div>
          </div>
        </div>
      </div>
    </section>

    <section class="sb-section sb-section--alt" id="simulator">
      <div class="sb-container">
        <span class="sb-section-tag">INTERACTIVE DEEP DIVE</span>
        <h2 class="sb-section-title">The 2/3 System — Deconstructed</h2>
        <p class="sb-section-sub">You pick 3 teams. The system creates 3 separate double-bets. You need at least 2 to win to get a payout. Try it yourself.</p>
        ${renderSimulator(sim23, 2, 'sim23')}
      </div>
    </section>

    <section class="sb-section" id="simulator-56">
      <div class="sb-container">
        <span class="sb-section-tag">SCALING UP</span>
        <h2 class="sb-section-title">The 5/6 System — More Picks, More Safety</h2>
        <p class="sb-section-sub">6 picks generate 6 five-fold combinations. Lose one pick and every combo still wins. Lose two and some combos still pay out. The math is on your side.</p>
        ${renderSimulator(sim56, 5, 'sim56')}
      </div>
    </section>

    <footer class="sb-footer">
      <div class="sb-container" style="text-align:center">
        <h2 class="sb-footer-title">Questions?</h2>
        <p class="sb-footer-sub">Betting should be fun and informed, never reckless. Reach out if anything's unclear.</p>
        <a href="mailto:andreaspiteri@outlook.com" class="sb-btn sb-btn--primary">Get In Touch</a>
        <p class="sb-footer-copy">\u00a9 ${new Date().getFullYear()} Andrea Spiteri \u2014 All rights reserved</p>
      </div>
    </footer>
  `;

  document.querySelectorAll('.sb-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const simPicks = sims[btn.dataset.sim];
      const idx = parseInt(btn.dataset.pick);
      const result = btn.dataset.result === 'win';
      simPicks[idx].won = simPicks[idx].won === result ? null : result;
      renderPage();
    });
  });

  document.querySelectorAll('.sb-reset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sims[btn.dataset.sim].forEach(p => p.won = null);
      renderPage();
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

renderPage();
trackEvent('pageview');
