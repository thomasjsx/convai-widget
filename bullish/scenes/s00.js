// s00 · Hello: the opening thought set large on black, word by word as it is spoken.
// "feel" turns to the Bullish gradient.
// Move the pointer for a soft light that follows; hover "feel" and it glows.
const words = line => line.split(' ').map(w => `<span class="w" data-w="${w}">${w}</span>`).join(' ');

export default {
  mount(root) {
    root.innerHTML = `
      <div class="s00">
        <div class="light"></div>
        <div class="copy">
          <h2 class="say">
            <span class="l1"><span class="row"><span class="ch">${words('A good campaign')}</span> <span class="ch">${words('looks correct,')}</span></span>
              <span class="row"><span class="ch">${words('proper and expected.')}</span></span></span>
            <span class="l2">
              <span class="row"><span class="ch">${words('A memorable campaign')}</span> <span class="ch">${words('adds to that.')}</span></span>
              <span class="row"><span class="ch">${words('Those memorable campaigns')}</span> <span class="ch">${words('or products')}</span></span>
              <span class="row"><span class="ch">${words('can make people')}</span> <span class="ch"><span class="w feel" data-w="feel"><span class="glow" aria-hidden="true">feel</span><span class="t">feel</span></span> ${words('something.')}</span></span>
            </span>
          </h2>
        </div>
      </div>`;
    const s = root.querySelector('.s00');
    const light = s.querySelector('.light');
    const place = (e, snap) => {
      if (e.pointerType === 'touch') return;
      const r = s.getBoundingClientRect();
      if (snap) light.style.transition = 'none';
      light.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
      if (snap) { void light.offsetWidth; light.style.transition = ''; }
      light.classList.add('on');
    };
    s.addEventListener('pointerenter', e => place(e, true));
    s.addEventListener('pointermove', e => place(e, false));
    s.addEventListener('pointerleave', () => light.classList.remove('on'));
  },
  enter({ root, atWord, scene }) {
    const s = root.querySelector('.s00');
    const ws = [...s.querySelectorAll('.say .w')];
    // snap back to blank without playing the transitions in reverse (the scene loops in preview)
    s.className = 's00 reset';
    ws.forEach(w => w.classList.remove('on'));
    void s.offsetWidth;
    s.classList.remove('reset');

    // every word lands on its spoken word; count repeats, including any said before the thesis starts
    const norm = x => x.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z']/g, '');
    const spoken = scene.vo.split(/\s+/).map(norm);
    const before = spoken.slice(0, Math.max(0, spoken.indexOf('good') - 1));
    const seen = {};
    before.forEach(k => { seen[k] = (seen[k] || 0) + 1; });
    ws.forEach(w => {
      const k = norm(w.dataset.w);
      seen[k] = (seen[k] || 0) + 1;
      atWord(w.dataset.w, () => w.classList.add('on'), seen[k]);
    });
    const nth = k => before.filter(x => x === k).length + 1;   // the thesis's own word, not one said in the intro
    atWord('memorable', () => s.classList.add('dim'), nth('memorable'));   // the merely-right line steps back
    atWord('feel', () => s.classList.add('lit'));            // gradient wipes across "feel"
    atWord('difference', () => s.classList.add('pulse'));    // "feel" breathes once more
  },
};

const css = `
[data-scene="s00"] .s00 { position:absolute; inset:0; overflow:hidden; }
.s00.reset, .s00.reset * { transition:none !important; animation:none !important; }

/* a soft light that trails the pointer */
.s00 .light { position:absolute; left:0; top:0; width:64vmax; aspect-ratio:1; margin:-32vmax 0 0 -32vmax; border-radius:50%;
  background:radial-gradient(closest-side, rgba(24,229,137,.085), rgba(33,140,255,.045) 46%, transparent 74%);
  opacity:0; pointer-events:none; transition:transform 1.6s var(--ease), opacity 1.2s var(--ease); }
.s00 .light.on { opacity:1; }

.s00 .copy { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 8vw 2vh; }
.s00 .say { margin:0; font-weight:500; font-size:clamp(22px, min(4.6vw, calc((100vh - var(--caption-h) - 120px) / 8.5)), 76px); line-height:1.06; letter-spacing:-.035em; }
.s00 .l1, .s00 .l2, .s00 .row { display:block; }
.s00 .l2 { margin-top:.34em; }
.s00 .l1 { transition:color 1.4s var(--ease); }
.s00.dim .l1 { color:rgba(203,208,219,.3); }

/* each word arrives soft and settles */
.s00 .w { display:inline-block; opacity:0; transform:translateY(.16em); filter:blur(12px);
  transition:opacity .9s var(--ease), transform 1.2s var(--ease), filter 1s var(--ease); }
.s00 .w.on { opacity:1; transform:none; filter:blur(0); }

/* "feel": white, then the Bullish gradient wipes across it; a blurred copy behind is its glow */
.s00 .feel { position:relative; cursor:default; }
.s00 .feel .t { position:relative; color:transparent;
  background:linear-gradient(#fff, #fff) right / 100% 100% no-repeat, linear-gradient(90deg, #18e589, #218cff 50%, #18e589) 0 0 / 200% 100%;
  -webkit-background-clip:text; background-clip:text;
  transition:background-size 1.3s cubic-bezier(.6,0,.2,1) .15s, background-position 1.8s var(--ease); }
.s00 .feel .glow { position:absolute; left:0; top:0; color:transparent; pointer-events:none;
  background:linear-gradient(90deg, #18e589, #218cff); -webkit-background-clip:text; background-clip:text;
  filter:blur(.24em); opacity:0; transition:opacity 1.6s var(--ease); }
.s00.lit .feel .t { background-size:0% 100%, 200% 100%; }
.s00.lit .feel .glow { opacity:.5; transition-delay:.6s; }
.s00.pulse .feel .glow { animation:s00pulse 2.4s var(--ease); }
@keyframes s00pulse { 0%{opacity:.5} 40%{opacity:1} 100%{opacity:.5} }
.s00.lit .feel:hover .t { background-position:right, 100% 0; }
.s00.lit .feel:hover .glow { opacity:1; transition-delay:0s; }

/* tall or narrow screens: one phrase per line, set larger */
@media (max-aspect-ratio: 1/1), (max-width: 900px) {
  .s00 .copy { padding:0 max(24px, 8vw) 2vh; }
  .s00 .say { font-size:clamp(18px, min(8.6vw, calc((100vh - var(--caption-h) - 100px) / 11.5)), 72px); line-height:1.04; }
  .s00 .ch { display:block; }
}
@media (max-width: 720px) { .s00 .copy { padding:0 20px 2vh; } }
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
