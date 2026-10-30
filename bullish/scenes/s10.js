// s10 · With the team: two open prompts hold first (the team answers before Thomas does),
// then the four brief questions are dealt as cards, each lighting up as it is asked.
// Click (or tap) a card to turn it over to Muse's answer.
const PROMPTS = [
  'What is Muse?',
  'What did Meta get that it couldn’t any other way?',
];

const CARDS = [
  ['How should it feel?', 'Warm. Not cute.'],
  ['What lens would nobody else choose?', 'A body for something abstract.'],
  ['Do the name and the body agree?', 'Nobody knew what a muse looked like. Now we do.'],
  ['Muse or siren?', 'Warmth opens a door. It never hides what’s behind it.'],
];

export default {
  mount(root, { asset }) {
    root.innerHTML = `
      <div class="s10">
        <div class="shelf" aria-hidden="true">
          ${['labubu', 'tamagotchi', 'charm'].map((f, i) => `<figure style="--i:${i}"><img src="${asset(`s05/${f}.png`)}" alt=""><figcaption>Week ${i + 1}</figcaption></figure>`).join('')}
        </div>
        <div class="ask">
          <span class="kick">Ask the team first</span>
          ${PROMPTS.map((p, i) => `
            <div class="q q${i + 1}">
              <h3>${p}</h3>
              <span class="line" aria-hidden="true"><b class="caret"></b><em>Your answer</em></span>
            </div>`).join('')}
        </div>
        <div class="brief">
          <span class="kick">Four questions · every brief</span>
          <div class="cards">
            ${CARDS.map(([q, a], i) => `
              <button class="card" data-i="${i}" style="--k:${3 - i};--r:${[0, -3, 2.5, -5][i]}deg;z-index:${4 - i}" aria-label="${q} Turn for Muse’s answer">
                <span class="inner">
                  <span class="face front">
                    <span class="top"><span class="n">0${i + 1}</span><span class="of">/ 04</span></span>
                    <b class="txt">${q}</b>
                    <i class="rule"></i>
                  </span>
                  <span class="face back">
                    <span class="top"><span class="who"><img src="${asset('brand/muse-m.svg')}" alt="">Muse</span><span class="n">0${i + 1}</span></span>
                    <b class="txt">${a}</b>
                  </span>
                </span>
              </button>`).join('')}
          </div>
          <span class="hint">Turn a card for Muse’s answer</span>
        </div>
      </div>`;
    root.querySelectorAll('.card').forEach(c => c.onclick = () => {
      c.classList.add('on');
      c.classList.toggle('flipped');
    });
  },
  enter({ root, at, atWord, scene }) {
    const s = root.querySelector('.s10');
    const cards = [...s.querySelectorAll('.card')];
    s.className = 's10';
    if (scene.id === 'c10') {                                // "Each designer brings one piece of culture every week."
      atWord('culture', () => s.classList.add('shelf-on'));
      atWord('first', () => s.classList.add('shelf-first'));   // "Thomas goes first."
    }
    cards.forEach(c => c.classList.remove('on', 'cur', 'flipped'));
    const light = i => () => {
      cards.forEach((c, j) => c.classList.toggle('cur', j === i));
      cards[i].classList.add('on');
    };
    atWord('four', () => s.classList.add('p2', 'deal')); // "Then four questions go on every brief." (the ask-first prompts now live in the team scene)
    atWord('how', light(0));                            // "How should it feel?"
    atWord('feel', () => s.classList.add('hinted'));
    atWord('what', light(1), 1);                        // "What lens would nobody else choose?"
    atWord('do', light(2));                             // "Do the name and the body agree?"
    atWord('muse', light(3), 1);                        // "Muse or siren?"
  },
};

const css = `
.s10 .shelf { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap:clamp(24px,5vw,80px); pointer-events:none; }
.s10 .shelf figure { margin:0; display:grid; justify-items:center; gap:16px; opacity:0; transform:translateY(24px);
  transition:opacity .7s var(--ease) calc(var(--i) * .25s), transform .9s var(--ease) calc(var(--i) * .25s); }
.s10 .shelf img { height:min(34vh,300px); width:auto; filter:drop-shadow(0 24px 34px rgba(0,0,0,.6)); }
.s10 .shelf figcaption { font:500 12px var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--mute); }
.s10.shelf-on .shelf figure { opacity:1; transform:none; }
.s10.shelf-first .shelf figure:not(:first-child) { opacity:.35; }
.s10.shelf-first .shelf figure:first-child figcaption { color:var(--green); }
[data-scene="s10"] .s10 { position:absolute; inset:0; container-type:size; --pad:clamp(20px,7vw,120px); }
.s10 .kick { display:block; font:500 11px/1 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--green); }

/* ---------- the two open prompts: big and holding, then they settle into a header */
.s10 .ask { position:absolute; left:var(--pad); right:var(--pad); top:50%; transform:translateY(-50%);
  transition:top 1s var(--ease), transform 1s var(--ease); }
.s10 .ask .kick { opacity:0; transform:translateY(8px); transition:opacity .8s var(--ease), transform .8s var(--ease), color .8s; margin-bottom:clamp(22px,4vh,40px); }
.s10.asking .ask .kick { opacity:1; transform:none; }
.s10 .q { opacity:0; transform:translateY(18px); transition:opacity .9s var(--ease), transform .9s var(--ease), margin .9s var(--ease); }
.s10 .q + .q { margin-top:clamp(26px,5vh,48px); }
.s10.p1 .q1, .s10.p2 .q2 { opacity:1; transform:none; }
.s10 .q h3 { margin:0; max-width:18ch; text-wrap:balance; font-weight:500; font-size:clamp(30px,3.7vw,58px); line-height:1.06; letter-spacing:-.03em;
  transition:font-size 1s var(--ease), color 1s var(--ease), max-width 1s var(--ease); }
.s10 .q2 h3 { max-width:20ch; }
.s10 .line { position:relative; display:flex; align-items:center; gap:12px; margin-top:clamp(14px,2.2vh,22px); width:min(520px,62vw);
  padding-bottom:10px; border-bottom:1px solid rgba(203,208,219,.2); overflow:hidden; max-height:60px;
  transition:opacity .6s var(--ease), max-height .9s var(--ease), margin .9s var(--ease), padding .9s var(--ease); }
.s10 .line em { font:400 12px/1 var(--mono); font-style:normal; letter-spacing:.1em; text-transform:uppercase; color:rgba(203,208,219,.38); }
.s10 .caret { width:2px; height:20px; background:var(--green); opacity:0; }
.s10.p1:not(.p2) .q1 .caret, .s10.p2:not(.deal) .q2 .caret { opacity:1; animation:s10blink 1.1s steps(1) infinite; }
@keyframes s10blink { 50% { opacity:0 } }

.s10.deal .ask { top:clamp(70px,11.5cqh,104px); transform:none; }
.s10.deal .ask .kick { margin-bottom:14px; color:var(--mute); }
.s10.deal .q h3 { font-size:clamp(16px,1.45vw,21px); color:var(--mute); max-width:none; }
.s10.deal .q + .q { margin-top:6px; }
.s10.deal .line { opacity:0; max-height:0; margin-top:0; padding-bottom:0; border-color:transparent; }

/* ---------- the four cards */
.s10 .brief { position:absolute; left:var(--pad); right:var(--pad); top:25cqh; bottom:3cqh; display:flex; flex-direction:column;
  justify-content:center; gap:18px; pointer-events:none; }
.s10.deal .brief { pointer-events:auto; }
.s10 .brief .kick { opacity:0; transition:opacity .8s var(--ease) .2s; }
.s10.deal .brief .kick { opacity:1; }
.s10 .cards { --gap:clamp(12px,1.6vw,24px); --cw:min(calc((100cqw - 2 * var(--pad) - 3 * var(--gap)) / 4), 310px, calc((72cqh - 100px) * .8));
  display:grid; grid-template-columns:repeat(4, var(--cw)); gap:var(--gap); }
/* the four cards wait as a deck on the right while the prompts hold, then deal out on "four" */
.s10 .card { position:relative; width:var(--cw); aspect-ratio:4/5; padding:0; perspective:1400px; text-align:left; opacity:0;
  transform:translateX(calc(var(--k) * (var(--cw) + var(--gap)) + 70px)) rotate(var(--r));
  transition:opacity .9s var(--ease), transform 1s var(--ease); }
.s10.p2 .card { opacity:1; transform:translateX(calc(var(--k) * (var(--cw) + var(--gap)))) rotate(var(--r)); }
.s10.deal .card { opacity:1; transform:none; transition-delay:calc(.12s + var(--k) * .07s); }
.s10.deal .card:hover { transition-delay:0s; }
.s10 .inner { position:absolute; inset:0; transform-style:preserve-3d; transition:transform .9s cubic-bezier(.3,.7,.1,1); }
.s10 .card.flipped .inner { transform:rotateY(180deg); }
.s10 .face { position:absolute; inset:0; container-type:inline-size; display:flex; flex-direction:column; justify-content:space-between;
  padding:clamp(14px,8cqw,26px); border-radius:16px; backface-visibility:hidden; -webkit-backface-visibility:hidden; overflow:hidden; }
.s10 .top { display:flex; justify-content:space-between; align-items:center; font:500 max(10px,4.2cqw)/1 var(--mono); letter-spacing:.12em; text-transform:uppercase; }
.s10 .txt { font-weight:500; letter-spacing:-.025em; line-height:1.08; text-wrap:balance; }

.s10 .front { background:linear-gradient(180deg,#131313,#0a0a0a); border:1px solid rgba(203,208,219,.1);
  transition:border-color .6s var(--ease), box-shadow .8s var(--ease); }
.s10 .front .n { color:rgba(203,208,219,.4); transition:color .6s; }
.s10 .front .of { color:rgba(203,208,219,.22); }
.s10 .front .txt { font-size:max(15px,13cqw); color:var(--ink); opacity:0; transform:translateY(10px); transition:opacity .7s var(--ease), transform .7s var(--ease); }
.s10 .front .rule { position:absolute; left:0; right:0; top:0; height:2px; background:var(--grad); transform:scaleX(0); transform-origin:left;
  transition:transform .9s var(--ease); }
.s10 .card.on .front { border-color:rgba(203,208,219,.24); }
.s10 .card.on .front .n { color:var(--green); }
.s10 .card.on .front .txt { opacity:1; transform:none; }
.s10 .card.on .front .rule { transform:scaleX(1); }
.s10 .card.cur .front { border-color:rgba(24,229,137,.45); box-shadow:0 0 0 1px rgba(24,229,137,.12), 0 30px 70px -20px rgba(24,229,137,.22); }
.s10 .card.on:hover .front { border-color:rgba(203,208,219,.45); }
.s10 .card:hover { transform:translateY(-6px); }
.s10 .card:focus-visible { outline:1px solid var(--green); outline-offset:6px; border-radius:16px; }

/* the answer side borrows Muse's warmth (the same peach glow the character walked in with) */
.s10 .back { transform:rotateY(180deg); color:#fff1e4; border:1px solid rgba(255,214,180,.3);
  background:radial-gradient(130% 90% at 20% 0%, rgba(255,214,180,.24), rgba(255,190,160,.07) 55%, transparent 80%), #120e0b; }
.s10 .back .who { display:flex; align-items:center; gap:9px; color:#ffd9bb; }
.s10 .back .who img { width:max(18px,9cqw); height:auto; }
.s10 .back .n { color:rgba(255,214,180,.45); }
.s10 .back .txt { font-size:max(14px,11.6cqw); line-height:1.08; }

.s10 .hint { font:500 11px/1 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:rgba(203,208,219,.5); opacity:0; transition:opacity .8s var(--ease); }
.s10.hinted .hint { opacity:1; }

/* tall or narrow screens: the prompts stay stacked, cards go two by two */
@media (max-aspect-ratio: 1/1), (max-width: 900px) {
  [data-scene="s10"] .s10 { --pad:max(20px, 6vw); }
  .s10 .q h3 { font-size:clamp(28px,7vw,52px); }
  .s10.deal .ask { top:clamp(58px,9cqh,96px); }
  .s10.deal .q h3 { font-size:clamp(15px,2.4vw,20px); }
  .s10 .brief { top:24cqh; gap:14px; }
  .s10 .cards { --gap:12px; --cw:min(calc((100cqw - 2 * var(--pad) - var(--gap)) / 2), calc((73cqh - 80px) / 2), 360px);
    grid-template-columns:repeat(2, var(--cw)); }
  .s10 .card { aspect-ratio:1; }
  .s10 .face { border-radius:14px; }
  /* no room for the deck beside the prompts: the cards rise in on "four" */
  .s10 .card, .s10.p2 .card { opacity:0; transform:translateY(26px); }
  .s10.deal .card { opacity:1; transform:none; transition-delay:calc(.36s - var(--k) * .08s); }
}
/* phones: square cards, and keep clear of the caption block, which runs taller than its band here */
@media (max-width: 600px) and (max-aspect-ratio: 1/1) {
  .s10 .brief { top:21cqh; bottom:13cqh; justify-content:flex-start; }
  .s10 .cards { --cw:min(calc((100cqw - 2 * var(--pad) - var(--gap)) / 2), calc((66cqh - 90px) / 2)); }
  .s10 .face { padding:13px; }
  .s10 .front .txt { font-size:max(15px,11.4cqw); }
  .s10 .back .txt { font-size:max(13px,10cqw); }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

// the ask-first prompts moved to the team scene; this scene is the four questions only
document.head.insertAdjacentHTML('beforeend', '<style>.s10 .ask{display:none}</style>');
