import '../src/style.css';
import { trackEvent } from '../src/tracker.js';

// ── 2/3 Simulator State ──
const picks = [
  { team: 'Man Utd', odds: 2.10, won: null },
  { team: 'Liverpool', odds: 1.75, won: null },
  { team: 'Chelsea', odds: 2.40, won: null },
];
const STAKE_PER_COMBO = 10;

function getCombos() {
  return [
    { label: 'Bet 1', legs: [0, 1] },
    { label: 'Bet 2', legs: [1, 2] },
    { label: 'Bet 3', legs: [0, 2] },
  ];
}

function calcCombo(combo) {
  const allDecided = combo.legs.every(i => picks[i].won !== null);
  const won = combo.legs.every(i => picks[i].won === true);
  const combinedOdds = combo.legs.reduce((acc, i) => acc * picks[i].odds, 1);
  return {
    ...combo,
    combinedOdds: combinedOdds.toFixed(2),
    payout: won ? (STAKE_PER_COMBO * combinedOdds).toFixed(2) : '0.00',
    won: allDecided ? won : null,
    teams: combo.legs.map(i => picks[i].team),
  };
}

function renderPage() {
  const app = document.getElementById('betting-app');
  const combos = getCombos().map(calcCombo);
  const totalStake = (STAKE_PER_COMBO * 3).toFixed(2);
  const totalReturn = combos.reduce((s, c) => s + parseFloat(c.payout), 0).toFixed(2);
  const allDecided = picks.every(p => p.won !== null);
  const profit = (totalReturn - totalStake).toFixed(2);

  app.innerHTML = `
    <!-- ══ HERO ══ -->
    <section class="sb-hero">
      <div class="sb-container">
        <div class="sb-hero-grid">
          <div class="sb-hero-text">
            <span class="sb-tag">BETTING EDUCATION</span>
            <h1 class="sb-hero-title">System Bets:<br><span>The Art of Winning<br>Even When You Lose</span></h1>
            <p class="sb-hero-sub">Almost winning is a tragedy.<br>System bets make it a strategy.</p>
            <a href="#the-why" class="sb-btn sb-btn--primary">Start Learning</a>
          </div>
          <div class="sb-hero-img">
            <img src="/hero-clock.png" alt="3D alarm clock illustration" loading="eager" />
          </div>
        </div>
      </div>
    </section>

    <!-- ══ THE WHY ══ -->
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

    <!-- ══ 2/3 SYSTEM INTERACTIVE ══ -->
    <section class="sb-section sb-section--alt" id="simulator">
      <div class="sb-container">
        <span class="sb-section-tag">INTERACTIVE DEEP DIVE</span>
        <h2 class="sb-section-title">The 2/3 System — Deconstructed</h2>
        <p class="sb-section-sub">You pick 3 teams. The system creates 3 separate double-bets. You need at least 2 to win to get a payout. Try it yourself.</p>

        <div class="sb-sim-card">
          <div class="sb-sim-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> OUTCOME SIMULATOR — €${totalStake} TOTAL STAKE</div>

          <!-- Picks -->
          <h4 class="sb-sim-heading">Your 3 Picks</h4>
          <div class="sb-picks">
            ${picks.map((p, i) => `
              <div class="sb-pick ${p.won === true ? 'sb-pick--won' : ''} ${p.won === false ? 'sb-pick--lost' : ''}">
                <div class="sb-pick-team">${p.team}</div>
                <div class="sb-pick-odds">@ ${p.odds.toFixed(2)}</div>
                <div class="sb-pick-btns">
                  <button class="sb-pick-btn sb-pick-btn--win ${p.won === true ? 'active' : ''}" data-pick="${i}" data-result="win">Win</button>
                  <button class="sb-pick-btn sb-pick-btn--lose ${p.won === false ? 'active' : ''}" data-pick="${i}" data-result="lose">Lose</button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Combinations Table -->
          <h4 class="sb-sim-heading">3 Double-Bet Combinations</h4>
          <div class="sb-combos-wrap">
            <table class="sb-combos">
              <thead>
                <tr><th></th><th>Legs</th><th>Combined Odds</th><th>Stake</th><th>Payout</th><th>Result</th></tr>
              </thead>
              <tbody>
                ${combos.map(c => `
                  <tr class="${c.won === true ? 'sb-combo--won' : ''} ${c.won === false ? 'sb-combo--lost' : ''}">
                    <td class="sb-combo-label">${c.label}</td>
                    <td>${c.teams.join(' + ')}</td>
                    <td>${c.combinedOdds}</td>
                    <td>€${STAKE_PER_COMBO.toFixed(2)}</td>
                    <td class="sb-combo-payout">${c.won === true ? '€' + c.payout : c.won === false ? '€0.00' : '—'}</td>
                    <td>${c.won === true ? '<span class="sb-result-badge sb-result-badge--win">WIN</span>' : c.won === false ? '<span class="sb-result-badge sb-result-badge--lose">LOSE</span>' : '<span class="sb-result-badge">—</span>'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          ${allDecided ? `
            <div class="sb-sim-summary ${parseFloat(profit) >= 0 ? 'sb-sim-summary--profit' : 'sb-sim-summary--loss'}">
              <div class="sb-sim-summary-row"><span>Total Stake</span><span>€${totalStake}</span></div>
              <div class="sb-sim-summary-row"><span>Total Return</span><span>€${totalReturn}</span></div>
              <div class="sb-sim-summary-row sb-sim-summary-total"><span>Profit / Loss</span><span>${parseFloat(profit) >= 0 ? '+' : ''}€${profit}</span></div>
              ${parseFloat(profit) > 0 ? '<p class="sb-sim-note">Even with a loss, the system still pays out. That\'s the power.</p>' : ''}
            </div>
          ` : '<p class="sb-sim-hint">Toggle each pick\'s result to see how the system pays out.</p>'}

          ${allDecided ? '<button id="sb-reset" class="sb-btn sb-btn--ghost" style="margin-top:16px">Reset Simulator</button>' : ''}
        </div>
      </div>
    </section>

    <!-- ══ INTERMISSION ══ -->
    <section class="sb-section sb-section--mascot">
      <div class="sb-container" style="text-align:center">
        <span class="sb-section-tag">A BRIEF INTERMISSION</span>
        <h2 class="sb-section-title" style="font-size:1.4rem">Take a breath. Here are 2 dogs and a cat.</h2>
        <p class="sb-section-sub">For absolutely no reason whatsoever. You've earned it.</p>
        <img src="/mascot-pets.png" alt="Two dogs and a cat" class="sb-mascot-img" loading="lazy" />
        <p class="sb-mascot-caption">The only trio that wins every time.</p>
      </div>
    </section>

    <!-- ══ ADVANCED CONCEPTS ══ -->
    <section class="sb-section" id="advanced">
      <div class="sb-container">
        <span class="sb-section-tag">ADVANCED CONCEPTS</span>
        <h2 class="sb-section-title">The Banker & The Glossary</h2>

        <!-- Banker -->
        <div class="sb-banker-card">
          <div class="sb-banker-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
          <div>
            <h3 class="sb-banker-title">The Banker</h3>
            <p>A Banker is your "safe bet" — the selection you're most confident about. It's included in <em>every</em> combination in the system.</p>
            <div class="sb-banker-rules">
              <div class="sb-banker-rule sb-banker-rule--danger"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> If the Banker <strong>loses</strong>, the entire system bet is lost.</div>
              <div class="sb-banker-rule sb-banker-rule--success"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> If the Banker <strong>wins</strong>, it boosts every combination it's in.</div>
            </div>
          </div>
        </div>

        <!-- Glossary -->
        <h3 class="sb-gloss-title">The Glossary</h3>
        <div class="sb-glossary">
          <div class="sb-gloss-card">
            <div class="sb-gloss-name">Trixie</div>
            <div class="sb-gloss-formula">3 picks → 4 bets</div>
            <p>3 doubles + 1 treble. Like a 2/3 system but with a bonus accumulator on top. Need at least 2 to win.</p>
          </div>
          <div class="sb-gloss-card">
            <div class="sb-gloss-name">Patent</div>
            <div class="sb-gloss-formula">3 picks → 7 bets</div>
            <p>A Trixie + 3 singles. Full coverage — even one correct pick returns something. The safety-first approach.</p>
          </div>
          <div class="sb-gloss-card">
            <div class="sb-gloss-name">Yankee</div>
            <div class="sb-gloss-formula">4 picks → 11 bets</div>
            <p>6 doubles + 4 trebles + 1 fourfold. Serious firepower. Need at least 2 of 4 to win. Higher stakes, bigger potential.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ QUESTIONS FOOTER ══ -->
    <footer class="sb-footer">
      <div class="sb-container" style="text-align:center">
        <h2 class="sb-footer-title">Questions?</h2>
        <p class="sb-footer-sub">Betting should be fun and informed, never reckless. Reach out if anything's unclear.</p>
        <a href="mailto:andreaspiteri@outlook.com" class="sb-btn sb-btn--primary">Get In Touch</a>
        <p class="sb-footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>
  `;

  // ── Bind events ──
  document.querySelectorAll('.sb-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.pick);
      const result = btn.dataset.result === 'win';
      picks[idx].won = picks[idx].won === result ? null : result;
      renderPage();
    });
  });
  document.getElementById('sb-reset')?.addEventListener('click', () => {
    picks.forEach(p => p.won = null);
    renderPage();
  });

  // Smooth scroll for anchor links
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
