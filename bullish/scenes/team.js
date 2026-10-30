// team · Ask the team first: the two big-why questions, the thinking underneath, then "we're containers too".
// Hover a container to bring it forward.
const THINKING = [
  ['decide', 'Decide how it should feel'],
  ['choose', 'Choose a lens nobody else would'],
  ['borrow', 'Borrow it from culture'],
  ['honest', 'Stay honest'],
];
const CONTAINERS = [
  ['Bullish', 'a venue for other people’s trades'],
  ['CoinDesk', 'carries other people’s news'],
  ['Consensus', 'a room for other people’s deals'],
];

// the right half while the team is asked: the case (Muse), the faceless industry it disarms, then Bullish's own brands
const FACELESS = ['openai-symbol', 'claude-symbol', 'meta-ai-ring', 'copilot-2026-icon', 'xai-logo', 'mistral-logo'];
const BRANDS = [['bullish.png', 'Bullish'], ['coindesk.svg', 'CoinDesk'], ['consensus.svg', 'Consensus']];

export default {
  mount(root, { asset }) {
    root.innerHTML = `
      <div class="steam">
        <section class="ask">
        </section>
        <figure class="tfig" aria-hidden="true">
          <div class="faceless">${FACELESS.map(f => `<img src="${asset(`marks/${f}.svg`)}" alt="">`).join('')}</div>
          <img class="muse" src="${asset('s05/muse.png')}" alt="">
          <div class="brands">${BRANDS.map(([f, n]) => `<span><img src="${asset(`brand/${f}`)}" alt=""><b>${n}</b></span>`).join('')}</div>
        </figure>
        <section class="think">
          <p class="kick">The thinking, not the bear</p>
          <ol>${THINKING.map(([k, t]) => `<li data-k="${k}">${t}</li>`).join('')}</ol>
        </section>
        <section class="box">
          <p class="kick">We’re containers too</p>
          <ul>${CONTAINERS.map(([n, d]) => `<li><b>${n}</b><span>${d}</span></li>`).join('')}</ul>
          <h2 class="q q3">What happens when a container shows a character of its own?</h2>
        </section>
      </div>`;
  },
  enter({ root, at, atWord, scene }) {
    const s = root.querySelector('.steam');
    s.className = 'steam snap'; void s.offsetWidth; s.classList.remove('snap');
    if (scene.id === 'b5') at(0.3, () => s.classList.add('f-muse', 'f-center'));  // the case on the table, alone in the middle
    if (scene.id === 'c7') {
      at(0.2, () => s.classList.add('f-muse'));
      atWord('faceless', () => s.classList.add('f-faceless'));                    // "…angry at a faceless industry"
    }
    if (scene.id === 'c8') at(0.3, () => s.classList.add('f-brands'));          // "What would that look like for Bullish?"
    s.querySelectorAll('[data-k]').forEach(li => li.classList.remove('on'));
    at(0.2, () => s.classList.add('a0'));                         // "a case study, not a mood board"
    atWord('what', () => s.classList.add('a1'), 1);                // "What do you think this is?"
    atWord('what', () => s.classList.add('a2'), 2);                // "What did Meta get…"
    atWord('teddy', () => s.classList.add('b0'));                  // "The thinking isn't a teddy bear…"
    THINKING.forEach(([k]) => atWord(k, () => s.querySelector(`[data-k="${k}"]`).classList.add('on')));
    atWord('containers', () => s.classList.add('c0'));             // "And we're containers too."
    atWord('happens', () => s.classList.add('c1'));                // "What happens when a container…"
  },
};

const css = `
[data-scene="team"] .steam { position:absolute; inset:0; display:grid; place-items:center; padding:0 8vw; }
.steam.snap * { transition:none !important; }
.steam section { position:absolute; left:8vw; right:8vw; top:50%; transform:translateY(-50%); max-width:980px;
  opacity:0; pointer-events:none; transition:opacity .7s var(--ease); }
.steam .kick { margin:0 0 22px; font:500 12px var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--mute); }
.steam .q { margin:0; font-weight:500; font-size:clamp(28px,3.4vw,52px); letter-spacing:-.03em; line-height:1.08; text-wrap:balance;
  opacity:0; transform:translateY(12px); transition:opacity .7s var(--ease), transform .7s var(--ease), color .6s; }
.steam .q + .q { margin-top:18px; }
/* beat 1: ask first */
.steam.a0:not(.b0) .ask { opacity:1; }
.steam.a1 .q1, .steam.a2 .q2 { opacity:1; transform:none; }
.steam.a2 .q1 { color:var(--mute); }
/* beat 2: the thinking underneath */
.steam.b0:not(.c0) .think { opacity:1; }
.steam .think ol { margin:0; padding:0; list-style:none; display:grid; gap:10px; }
.steam .think li { font-weight:500; font-size:clamp(24px,2.8vw,42px); letter-spacing:-.025em; color:rgba(255,255,255,.18); transition:color .6s var(--ease); }
.steam .think li.on { color:var(--ink); }
/* beat 3: containers */
.steam.c0 .box { opacity:1; pointer-events:auto; }
.steam .box ul { margin:0 0 34px; padding:0; list-style:none; display:grid; gap:4px; }
.steam .box li { display:flex; gap:18px; align-items:baseline; padding:10px 0; border-bottom:1px solid rgba(203,208,219,.14); transition:border-color .3s; }
.steam .box li b { min-width:7.5em; font-weight:500; font-size:clamp(20px,1.9vw,28px); }
.steam .box li span { color:var(--mute); font-size:clamp(15px,1.25vw,18px); }
.steam .box li:hover { border-color:var(--green); }
.steam.c1 .q3 { opacity:1; transform:none; }
/* the figure on the right; the words take the left half while it shows */
.steam .tfig { position:absolute; right:8vw; top:50%; width:38vw; height:min(60vh,560px); transform:translateY(-50%); margin:0;
  display:grid; place-items:center; pointer-events:none; }
.steam:is(.f-muse, .f-brands) .ask { right:50vw; }
.steam .tfig .muse { grid-area:1/1; height:100%; width:auto; filter:drop-shadow(0 30px 40px rgba(0,0,0,.6));
  opacity:0; transform:translateY(20px) scale(.97); transition:opacity .8s var(--ease), transform 1s var(--ease); }
.steam.f-muse .tfig .muse { opacity:1; transform:none; }
.steam.f-center .tfig { right:50%; transform:translate(50%,-50%); }
.steam .faceless { grid-area:1/1; align-self:end; display:flex; gap:clamp(14px,1.8vw,26px); margin-bottom:-8%; opacity:0; transition:opacity .9s var(--ease); }
.steam .faceless img { width:clamp(30px,3.2vw,48px); height:auto; filter:grayscale(1) brightness(1.6); opacity:.45; }
.steam.f-faceless .faceless { opacity:1; }
.steam.f-faceless .tfig .muse { transform:translateY(-6%) scale(.9); }
.steam .brands { grid-area:1/1; display:grid; gap:clamp(18px,3vh,30px); justify-items:start; opacity:0; transform:translateX(20px);
  transition:opacity .8s var(--ease), transform 1s var(--ease); }
.steam .brands span { display:flex; align-items:center; gap:18px; }
.steam .brands img { height:clamp(48px,7vh,76px); width:auto; max-width:16vw; object-fit:contain; border-radius:12px; }
.steam .brands b { font-weight:500; font-size:clamp(22px,2.2vw,34px); letter-spacing:-.02em; }
.steam .brands span:nth-child(2) b { display:none; }   /* CoinDesk's wordmark already says it */
.steam.f-brands .brands { opacity:1; transform:none; }
@media (max-aspect-ratio: 1/1), (max-width: 900px) {
  .steam .tfig { left:6vw; right:6vw; width:auto; top:auto; bottom:4vh; height:34vh; transform:none; }
  .steam:is(.f-muse, .f-brands) .ask { right:6vw; top:30%; }
  .steam section { left:6vw; right:6vw; }
  .steam .box li { flex-direction:column; gap:2px; }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
