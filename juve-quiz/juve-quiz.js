import '../src/style.css';
import { trackEvent } from '../src/tracker.js';
import { initNavScroll } from '../src/shared.js';

// ── Player nationalities (ISO 2-letter codes for flagcdn.com) ──
const PLAYER_FLAGS = {
  'Roberto Baggio': 'it', 'Andreas Möller': 'de', 'Gianluca Vialli': 'it', 'Fabrizio Ravanelli': 'it',
  'David Platt': 'gb-eng', 'Paolo Di Canio': 'it', 'Alessandro Del Piero': 'it', 'Antonio Conte': 'it',
  'Didier Deschamps': 'fr', 'Alen Bokšić': 'hr', 'Attilio Lombardo': 'it',
  'Christian Vieri': 'it', 'Nicola Amoruso': 'it', 'Zinédine Zidane': 'fr',
  'Filippo Inzaghi': 'it', 'Daniel Fonseca': 'uy', 'Darko Kovačević': 'rs',
  'Edgar Davids': 'nl', 'David Trézéguet': 'fr', 'Gianluca Zambrotta': 'it',
  'Pavel Nedvěd': 'cz', 'Igor Tudor': 'hr', 'Ciro Ferrara': 'it',
  'Marcelo Salas': 'cl', 'Enzo Maresca': 'it', 'Mauro Camoranesi': 'it',
  'Zlatan Ibrahimović': 'se', 'Adrian Mutu': 'ro', 'Raffaele Palladino': 'it',
  'Valeri Bojinov': 'bg', 'Vincenzo Iaquinta': 'it', 'Amauri': 'br',
  'Hasan Salihamidžić': 'ba', 'Diego': 'br', 'Alessandro Matri': 'it',
  'Fabio Quagliarella': 'it', 'Felipe Melo': 'br', 'Claudio Marchisio': 'it',
  'Mirko Vučinić': 'me', 'Arturo Vidal': 'cl', 'Sebastian Giovinco': 'it',
  'Carlos Tévez': 'ar', 'Fernando Llorente': 'es', 'Paul Pogba': 'fr',
  'Leonardo Bonucci': 'it', 'Paulo Dybala': 'ar', 'Álvaro Morata': 'es',
  'Gonzalo Higuaín': 'ar', 'Mario Mandžukić': 'hr', 'Miralem Pjanić': 'ba',
  'Juan Cuadrado': 'co', 'Douglas Costa': 'br', 'Blaise Matuidi': 'fr',
  'Cristiano Ronaldo': 'pt', 'Moise Kean': 'it', 'Emre Can': 'de',
  'Matthijs de Ligt': 'nl', 'Adrien Rabiot': 'fr', 'Federico Chiesa': 'it',
  'Dušan Vlahović': 'rs', 'Arkadiusz Milik': 'pl', 'Ángel Di María': 'ar',
  'Timothy Weah': 'us', 'Andrea Cambiaso': 'it', 'Randal Kolo Muani': 'fr',
  'Kenan Yıldız': 'tr', 'Kephren Thuram': 'fr',
};

const pflagImg = (name, size = 14) => {
  const iso = PLAYER_FLAGS[name];
  if (!iso) return '';
  return `<img src="https://flagcdn.com/w20/${iso}.png" alt="" width="20" height="15" class="quiz-flag" loading="lazy">`;
};

// ══════════════════════════════════════════════
// JUVENTUS TOP-5 SCORERS QUIZ (1992/93 — 2024/25)
// ══════════════════════════════════════════════
const JUVE_SEASONS = [
  {s:'92/93',p:[['Roberto Baggio',21],['Andreas Möller',10],['Gianluca Vialli',6],['Fabrizio Ravanelli',5],['David Platt',3],['Paolo Di Canio',3]]},
  {s:'93/94',p:[['Roberto Baggio',17],['Andreas Möller',9],['Fabrizio Ravanelli',9],['Alessandro Del Piero',5],['Gianluca Vialli',4],['Antonio Conte',4]]},
  {s:'94/95',p:[['Gianluca Vialli',17],['Fabrizio Ravanelli',10],['Alessandro Del Piero',8],['Roberto Baggio',8],['Didier Deschamps',3]]},
  {s:'95/96',p:[['Alessandro Del Piero',16],['Gianluca Vialli',12],['Fabrizio Ravanelli',10],['Alen Bokšić',7],['Attilio Lombardo',4]]},
  {s:'96/97',p:[['Alen Bokšić',13],['Alessandro Del Piero',8],['Christian Vieri',6],['Nicola Amoruso',5],['Zinédine Zidane',5]]},
  {s:'97/98',p:[['Alessandro Del Piero',21],['Filippo Inzaghi',18],['Zinédine Zidane',7],['Antonio Conte',4],['Daniel Fonseca',4]]},
  {s:'98/99',p:[['Filippo Inzaghi',13],['Alessandro Del Piero',9],['Zinédine Zidane',4],['Darko Kovačević',4],['Antonio Conte',3]]},
  {s:'99/00',p:[['Alessandro Del Piero',9],['Filippo Inzaghi',9],['Zinédine Zidane',4],['Darko Kovačević',4],['Edgar Davids',3]]},
  {s:'00/01',p:[['David Trézéguet',9],['Alessandro Del Piero',8],['Zinédine Zidane',6],['Filippo Inzaghi',6],['Gianluca Zambrotta',4]]},
  {s:'01/02',p:[['David Trézéguet',24],['Alessandro Del Piero',16],['Pavel Nedvěd',4],['Igor Tudor',4],['Ciro Ferrara',3]]},
  {s:'02/03',p:[['David Trézéguet',15],['Alessandro Del Piero',13],['Marcelo Salas',7],['Pavel Nedvěd',5],['Enzo Maresca',3]]},
  {s:'03/04',p:[['David Trézéguet',16],['Alessandro Del Piero',14],['Pavel Nedvěd',4],['Mauro Camoranesi',4],['Zlatan Ibrahimović',3]]},
  {s:'04/05',p:[['David Trézéguet',17],['Alessandro Del Piero',14],['Zlatan Ibrahimović',8],['Pavel Nedvěd',5],['Mauro Camoranesi',3]]},
  {s:'05/06',p:[['David Trézéguet',18],['Zlatan Ibrahimović',7],['Alessandro Del Piero',6],['Pavel Nedvěd',5],['Adrian Mutu',5]]},
  {s:'06/07*',p:[['Alessandro Del Piero',20],['David Trézéguet',15],['Pavel Nedvěd',11],['Raffaele Palladino',8],['Valeri Bojinov',5]]},
  {s:'07/08',p:[['Alessandro Del Piero',21],['David Trézéguet',12],['Vincenzo Iaquinta',8],['Mauro Camoranesi',6],['Pavel Nedvěd',4]]},
  {s:'08/09',p:[['Alessandro Del Piero',13],['Vincenzo Iaquinta',8],['Amauri',8],['David Trézéguet',7],['Hasan Salihamidžić',3]]},
  {s:'09/10',p:[['Amauri',7],['Alessandro Del Piero',7],['David Trézéguet',6],['Diego',5],['Vincenzo Iaquinta',4]]},
  {s:'10/11',p:[['Alessandro Matri',10],['Fabio Quagliarella',8],['Felipe Melo',5],['Alessandro Del Piero',4],['Claudio Marchisio',3]]},
  {s:'11/12',p:[['Alessandro Matri',10],['Fabio Quagliarella',7],['Claudio Marchisio',5],['Mirko Vučinić',5],['Arturo Vidal',5]]},
  {s:'12/13',p:[['Arturo Vidal',10],['Fabio Quagliarella',8],['Mirko Vučinić',7],['Sebastian Giovinco',7],['Alessandro Matri',6]]},
  {s:'13/14',p:[['Carlos Tévez',19],['Fernando Llorente',14],['Paul Pogba',7],['Arturo Vidal',6],['Claudio Marchisio',5]]},
  {s:'14/15',p:[['Carlos Tévez',20],['Álvaro Morata',7],['Paul Pogba',7],['Arturo Vidal',4],['Leonardo Bonucci',3]]},
  {s:'15/16',p:[['Paulo Dybala',19],['Álvaro Morata',7],['Paul Pogba',7],['Gonzalo Higuaín',5],['Mario Mandžukić',3]]},
  {s:'16/17',p:[['Gonzalo Higuaín',24],['Paulo Dybala',11],['Mario Mandžukić',10],['Miralem Pjanić',5],['Juan Cuadrado',4]]},
  {s:'17/18',p:[['Gonzalo Higuaín',16],['Paulo Dybala',14],['Douglas Costa',4],['Blaise Matuidi',4],['Miralem Pjanić',4]]},
  {s:'18/19',p:[['Cristiano Ronaldo',21],['Mario Mandžukić',9],['Moise Kean',6],['Paulo Dybala',5],['Emre Can',4]]},
  {s:'19/20',p:[['Cristiano Ronaldo',31],['Paulo Dybala',11],['Gonzalo Higuaín',8],['Matthijs de Ligt',4],['Leonardo Bonucci',4]]},
  {s:'20/21',p:[['Cristiano Ronaldo',29],['Álvaro Morata',11],['Federico Chiesa',8],['Juan Cuadrado',4],['Adrien Rabiot',4]]},
  {s:'21/22',p:[['Dušan Vlahović',9],['Álvaro Morata',8],['Paulo Dybala',7],['Moise Kean',5],['Juan Cuadrado',4]]},
  {s:'22/23',p:[['Dušan Vlahović',10],['Arkadiusz Milik',6],['Adrien Rabiot',6],['Federico Chiesa',5],['Ángel Di María',4]]},
  {s:'23/24',p:[['Dušan Vlahović',16],['Federico Chiesa',9],['Arkadiusz Milik',5],['Timothy Weah',4],['Andrea Cambiaso',3]]},
  {s:'24/25',p:[['Dušan Vlahović',10],['Randal Kolo Muani',8],['Kenan Yıldız',7],['Timothy Weah',5],['Kephren Thuram',4]]},
];

// Build lookup for quiz
const jNorm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
const JUVE_LOOKUP = {};
JUVE_SEASONS.forEach((season, si) => {
  season.p.forEach((entry, pi) => {
    const key = jNorm(entry[0]);
    if (!JUVE_LOOKUP[key]) JUVE_LOOKUP[key] = [];
    JUVE_LOOKUP[key].push({ si, pi });
    const parts = entry[0].split(' ');
    if (parts.length > 1) {
      const lastName = jNorm(parts[parts.length - 1]);
      if (!JUVE_LOOKUP[lastName]) JUVE_LOOKUP[lastName] = [];
      JUVE_LOOKUP[lastName].push({ si, pi });
    }
  });
});

let quizState = 'idle';
let quizAnswered = new Set();
let quizTotal = JUVE_SEASONS.reduce((s, season) => s + season.p.length, 0);
let quizTimerInterval = null;
let quizTimeLeft = 900;

const startQuiz = () => {
  quizState = 'playing';
  quizAnswered = new Set();
  quizTimeLeft = 900;
  render();
  const inp = document.getElementById('juve-quiz-input');
  if (inp) inp.focus();
  quizTimerInterval = setInterval(() => {
    quizTimeLeft--;
    const el = document.getElementById('juve-timer');
    if (el) el.textContent = `${Math.floor(quizTimeLeft/60)}:${(quizTimeLeft%60).toString().padStart(2,'0')}`;
    if (quizTimeLeft <= 0) { endQuiz(); }
  }, 1000);
};

const endQuiz = () => {
  quizState = 'done';
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  trackEvent('quiz_complete', { quiz: 'juve', score: `${quizAnswered.size}/${quizTotal}` });
  render();
};

const checkJuveAnswer = (val) => {
  const n = jNorm(val);
  if (!n || n.length < 2) return false;
  const matches = JUVE_LOOKUP[n];
  if (!matches) return false;
  let found = false;
  matches.forEach(({si, pi}) => {
    const key = `${si}-${pi}`;
    if (!quizAnswered.has(key)) {
      quizAnswered.add(key);
      found = true;
    }
  });
  if (found) {
    render();
    if (quizAnswered.size >= quizTotal) endQuiz();
  }
  return found;
};

const render = () => {
  const app = document.getElementById('quiz-app');
  if (!app) return;

  if (quizState === 'idle') {
    app.innerHTML = `
      <section class="f1q-section">
        <div class="f1q-container">
          <div class="f1q-intro">
            <div class="f1q-badge"><span>JUVENTUS QUIZ</span></div>
            <h1 class="f1q-title">TOP-5 SCORERS<br><span>SINCE 1992/93</span></h1>
            <p class="f1q-subtitle">Name every player who finished in Juventus' top 5 Serie A scorers across 33 seasons.<br>${quizTotal} answers · 15 minutes.</p>
            <button id="juve-quiz-start" class="f1q-btn f1q-btn--primary">Start Quiz</button>
          </div>
        </div>
      </section>
      <footer class="footer" role="contentinfo">
        <div class="container">
          <div class="footer-links"><a href="/quiz/">← Back to Quiz Hub</a></div>
          <p class="footer-copy">&copy; ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
        </div>
      </footer>
    `;
    document.getElementById('juve-quiz-start')?.addEventListener('click', () => { trackEvent('quiz_start', { quiz: 'juve' }); startQuiz(); });
    return;
  }

  const fmtTime = `${Math.floor(quizTimeLeft/60)}:${(quizTimeLeft%60).toString().padStart(2,'0')}`;
  const grid = JUVE_SEASONS.map((season, si) => {
    const rows = season.p.map(([name, goals], pi) => {
      const key = `${si}-${pi}`;
      const found = quizAnswered.has(key);
      const show = found || quizState === 'done';
      return `<div class="jq-cell ${found ? 'jq-cell--found' : ''} ${quizState==='done' && !found ? 'jq-cell--missed' : ''}">
        <span class="jq-goals">${goals}</span>
        ${show ? pflagImg(name) : ''}<span class="jq-name">${show ? name : ''}</span>
      </div>`;
    }).join('');
    return `<div class="jq-col"><div class="jq-season">${season.s}</div>${rows}</div>`;
  }).join('');

  app.innerHTML = `
    <section class="fb-section">
      <div class="fb-container">
        <div class="fb-card fb-quiz-active">
          <div class="fb-card-label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> JUVENTUS TOP-5 SCORERS SINCE 1992/93</div>
          <div class="jq-header">
            <div class="jq-header-left">
              ${quizState === 'playing' ? `<input type="text" id="juve-quiz-input" class="jq-input" placeholder="Type a player name..." autocomplete="off" autocapitalize="off" spellcheck="false">` : ''}
            </div>
            <div class="jq-header-right">
              <span class="jq-score-lbl">SCORE</span>
              <span class="jq-score">${quizAnswered.size} / ${quizTotal}</span>
              <span class="jq-time-lbl">TIME</span>
              <span class="jq-time" id="juve-timer">${fmtTime}</span>
              ${quizState === 'playing' ? `<button class="fb-btn jq-giveup" id="juve-quiz-end">Give Up</button>` : `<button class="fb-btn jq-giveup" id="juve-quiz-restart">Play Again</button>`}
            </div>
          </div>
          <div class="jq-grid" id="juve-quiz-grid">${grid}</div>
        </div>
      </div>
    </section>

    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-links"><a href="/quiz/">← Back to Quiz Hub</a></div>
        <p class="footer-copy">&copy; ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
      </div>
    </footer>
  `;

  document.getElementById('juve-quiz-end')?.addEventListener('click', endQuiz);
  document.getElementById('juve-quiz-restart')?.addEventListener('click', startQuiz);
  const inp = document.getElementById('juve-quiz-input');
  if (inp) {
    inp.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val.length >= 2 && checkJuveAnswer(val)) {
        inp.value = '';
      }
    });
    inp.focus();
  }
};

initNavScroll();

render();
