// s12 · What's your Muse? The close: the horns draw on and come alive, the question lands, then two ways out.
// The horns lean toward the pointer; click them for a nod.
import { horns } from './lib/horns.js';

let h;

export default {
  mount(root) {
    root.innerHTML = `
      <div class="s12">
        <div class="mark"><div class="nod"></div></div>
        <h2 class="q">
          <span class="w" data-w="What's">What’s</span>
          <span class="w your" data-w="your"><span class="t">your</span></span><br class="pt">
          <span class="w" data-w="Muse?">Muse?</span>
        </h2>
        <div class="cta">
          <a class="talk" href="https://www.adcd.nyc" target="_blank" rel="noopener">Talk to Thomas
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9 9 3M4.2 3H9v4.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          <button class="again" type="button">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.8h-2.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Watch again</button>
        </div>
      </div>`;
    const s = root.querySelector('.s12');
    const mark = s.querySelector('.mark');
    const nod = s.querySelector('.nod');
    h = horns(nod, { width: 'var(--hw)' });

    s.querySelector('.again').onclick = () => location.reload();
    // the horns notice you: a slight lean toward the pointer, and a nod when clicked
    s.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const r = s.getBoundingClientRect();
      const dx = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width / 2)));
      const dy = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (r.height / 2)));
      mark.style.transform = `translate(${dx * 8}px, ${dy * 4}px) rotate(${dx * 5}deg)`;
    });
    s.addEventListener('pointerleave', () => { mark.style.transform = ''; });
    nod.onclick = () => { nod.classList.remove('go'); void nod.offsetWidth; nod.classList.add('go'); };
  },
  enter({ root, atWord }) {
    const s = root.querySelector('.s12');
    s.className = 's12 reset';
    s.querySelectorAll('.w').forEach(w => w.classList.remove('on'));
    s.querySelector('.nod').classList.remove('go');
    h.reset();
    void s.offsetWidth;
    s.classList.remove('reset');

    s.querySelectorAll('.w').forEach(w => atWord(w.dataset.w, () => w.classList.add('on')));
    atWord('your', () => s.classList.add('lit'));                    // gradient wipes across "your"
    atWord('Muse?', () => s.classList.add('done'));                  // then the two buttons
  },
};

const css = `
[data-scene="s12"] .s12 { --hw:clamp(64px, 7.4vw, 116px); position:absolute; inset:0; display:flex; flex-direction:column;
  align-items:center; justify-content:center; padding:0 24px 3vh; text-align:center; }
.s12.reset, .s12.reset * { transition:none !important; animation:none !important; }

.s12 .mark { transition:transform 1.4s var(--ease); }
.s12 .nod { cursor:pointer; transform-origin:50% 90%; }
.s12 .nod.go { animation:s12nod .9s cubic-bezier(.3,.7,.2,1); }
@keyframes s12nod { 0%{transform:none} 30%{transform:translateY(7%) rotate(-4deg)} 62%{transform:translateY(-3%) rotate(1.5deg)} 100%{transform:none} }

.s12 .q { margin:clamp(30px, 5.4vh, 52px) 0 clamp(38px, 7vh, 64px); font-weight:500; font-size:clamp(44px, 7.6vw, 124px);
  line-height:1; letter-spacing:-.042em; }
.s12 .q .pt { display:none; }
.s12 .w { display:inline-block; opacity:0; transform:translateY(.14em); filter:blur(12px);
  transition:opacity .9s var(--ease), transform 1.2s var(--ease), filter 1s var(--ease); }
.s12 .w.on { opacity:1; transform:none; filter:blur(0); }
/* "your": white, then the Bullish gradient wipes across it (the same move as "feel" in the opening) */
.s12 .your .t { color:transparent;
  background:linear-gradient(#fff, #fff) right / 100% 100% no-repeat, linear-gradient(90deg, #18e589, #218cff);
  -webkit-background-clip:text; background-clip:text; transition:background-size 1.3s cubic-bezier(.6,0,.2,1) .2s; }
.s12.lit .your .t { background-size:0% 100%, auto; }

.s12 .cta { display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:14px 26px;
  opacity:0; transform:translateY(12px); transition:opacity 1s var(--ease) .7s, transform 1.1s var(--ease) .7s; }
.s12.done .cta { opacity:1; transform:none; }
.s12 .cta a, .s12 .cta button { display:inline-flex; align-items:center; gap:10px; height:48px; font:500 16px/1 var(--sans);
  letter-spacing:-.005em; text-decoration:none; border-radius:999px; outline:none;
  transition:background-color .35s var(--ease), color .35s var(--ease), border-color .35s var(--ease), box-shadow .35s var(--ease); }
.s12 .cta svg { width:12px; height:12px; transition:transform .5s var(--ease); }
.s12 .talk { padding:0 22px 0 24px; color:var(--ink); border:1px solid rgba(203,208,219,.32); }
.s12 .talk:hover { background:var(--green); border-color:var(--green); color:#000; }
.s12 .talk:hover svg { transform:translate(2px, -2px); }
.s12 .again { padding:0 6px; color:var(--mute); }
.s12 .again svg { width:15px; height:15px; }
.s12 .again:hover { color:var(--green); }
.s12 .again:hover svg { transform:rotate(-200deg); }
.s12 .cta a:focus-visible, .s12 .cta button:focus-visible { box-shadow:0 0 0 2px #000, 0 0 0 4px var(--green); }
.s12 .again:focus-visible { color:var(--green); }

/* tall or narrow screens: the question breaks after "your" and sets larger */
@media (max-aspect-ratio: 1/1), (max-width: 900px) {
  [data-scene="s12"] .s12 { --hw:clamp(64px, 17vw, 120px); }
  .s12 .q { font-size:clamp(48px, 15vw, 116px); line-height:.98; }
  .s12 .q .pt { display:inline; }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

// the close is the question alone: no horns
document.head.insertAdjacentHTML('beforeend', '<style>.s12 .horns{display:none}</style>');
