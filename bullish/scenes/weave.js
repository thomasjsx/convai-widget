// weave · Drawn by hand once, scaled with a Weave tool: one input in, consistent work out, run by people who aren't designers.
// Hover an output to light its wire.
const OUT = [
  ['london', 'Comms', 'London', '1 / 1'],
  ['hong', 'Sales', 'Hong Kong', '16 / 9'],
  ['grand', 'Events', 'Grand Cayman', '9 / 16'],
];
// a loose, hand-drawn face: the "body", drawn once
const SKETCH = 'M50 12 C 74 10, 90 30, 88 54 C 87 78, 70 92, 49 91 C 27 90, 11 74, 12 52 C 13 29, 28 13, 50 12 Z M37 47 l0.5 3 M63 47 l0.5 3 M38 64 C 45 71, 56 71, 63 63';

const sketch = cls => `<svg class="${cls}" viewBox="0 0 100 100" fill="none" aria-hidden="true">
  <path d="${SKETCH}" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>`;

export default {
  mount(root) {
    root.innerHTML = `
      <div class="sweave">
        <div class="in-hand">
          <p class="kick">Drawn by hand, once</p>
          <div class="paper">${sketch('draw')}</div>
        </div>
        <svg class="wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path class="w0" d="M0 50 L38 50"/>
          ${OUT.map(([k], i) => `<path class="w-${k}" d="M62 50 C 80 50, 80 ${18 + i * 32}, 100 ${18 + i * 32}"/>`).join('')}
        </svg>
        <div class="tool">
          <p class="kick">Figma Weave</p>
          <b>One tool</b>
          <span>Any input in. Consistent work out.</span>
        </div>
        <div class="outs">
          ${OUT.map(([k, who, where, ar]) => `
            <div class="out" data-k="${k}">
              <div class="frame" style="aspect-ratio:${ar}">${sketch('copy')}</div>
              <p><b>${who}</b> · ${where}</p>
            </div>`).join('')}
        </div>
      </div>`;
    root.querySelectorAll('.out').forEach(o => {
      o.onmouseenter = () => root.querySelector(`.w-${o.dataset.k}`).classList.add('hot');
      o.onmouseleave = () => root.querySelector(`.w-${o.dataset.k}`).classList.remove('hot');
    });
  },
  enter({ root, at, atWord, kind }) {
    const s = root.querySelector('.sweave');
    s.className = 'sweave snap'; void s.offsetWidth; s.classList.remove('snap');
    s.querySelectorAll('.out').forEach(o => o.classList.remove('on'));
    at(0.2, () => s.classList.add('a'));                       // "Most of it happens in-house."
    if (kind === 'clip') { s.classList.add('drawn', 'tool-on', 'wired', 'same'); s.querySelectorAll('[data-k]').forEach(o => o.classList.add('on')); }
    atWord('hand', () => s.classList.add('drawn'));            // "The body gets drawn by hand, once."
    atWord('weave', () => s.classList.add('tool-on'));         // "Figma Weave does the volume."
    atWord('tool', () => s.classList.add('wired'));            // "a designer can build a tool"
    OUT.forEach(([k]) => atWord(k, () => s.querySelector(`[data-k="${k}"]`).classList.add('on')));
    atWord('brand', () => s.classList.add('same'));            // "…and the work still looks on brand."
  },
};

const css = `
[data-scene="weave"] .sweave { position:absolute; inset:0; display:grid; grid-template-columns:1fr .2fr 1fr .2fr 1.2fr; align-items:center; padding:0 6vw; }
.sweave.snap * { transition:none !important; }
.sweave .kick { margin:0 0 14px; font:500 12px var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--mute); }
.sweave .in-hand { grid-column:1; opacity:0; transition:opacity .8s var(--ease); }
.sweave.a .in-hand { opacity:1; }
.sweave .paper { width:min(22vw,240px); aspect-ratio:1; border-radius:6px; background:#f3efe6; color:#1a1a1a; display:grid; place-items:center; }
.sweave .paper svg { width:72%; }
.sweave svg.draw path { stroke-dasharray:1; stroke-dashoffset:1; transition:stroke-dashoffset 1.6s cubic-bezier(.5,0,.2,1); }
.sweave.drawn svg.draw path { stroke-dashoffset:0; }
.sweave .wires { position:absolute; left:6vw; right:6vw; top:0; bottom:0; width:calc(100% - 12vw); height:100%; pointer-events:none; }
.sweave .wires path { fill:none; stroke:rgba(203,208,219,.22); stroke-width:.25; vector-effect:non-scaling-stroke; opacity:0; transition:opacity .6s, stroke .3s; }
.sweave.tool-on .wires .w0, .sweave.wired .wires path { opacity:1; }
.sweave .wires path.hot { stroke:var(--green); }
.sweave .tool { grid-column:3; justify-self:center; padding:22px 26px; border-radius:14px; border:1px solid rgba(203,208,219,.25); background:#0d0f0e;
  display:grid; gap:6px; min-width:min(22vw,260px); opacity:0; transform:scale(.96); transition:opacity .7s var(--ease), transform .7s var(--ease), border-color .5s; }
.sweave.tool-on .tool { opacity:1; transform:none; }
.sweave.wired .tool { border-color:var(--green); }
.sweave .tool .kick { margin:0; }
.sweave .tool b { font-weight:500; font-size:clamp(22px,2vw,30px); letter-spacing:-.02em; }
.sweave .tool span { color:var(--mute); font-size:14px; }
.sweave .outs { grid-column:5; display:grid; gap:18px; justify-items:start; }
.sweave .out { display:flex; gap:14px; align-items:center; opacity:0; transform:translateX(10px); transition:opacity .6s var(--ease), transform .6s var(--ease); }
.sweave .out.on { opacity:1; transform:none; }
.sweave .frame { height:clamp(54px,9vh,92px); max-width:100%; border-radius:6px; background:#f3efe6; color:#1a1a1a; display:grid; place-items:center; }
.sweave .frame svg { height:62%; }
.sweave .out p { margin:0; color:var(--mute); font-size:14px; } .sweave .out p b { color:var(--ink); font-weight:500; }
.sweave.same .frame { box-shadow:0 0 0 2px var(--green); }
@media (max-aspect-ratio: 1/1), (max-width: 900px) {
  [data-scene="weave"] .sweave { grid-template-columns:1fr; grid-template-rows:auto auto auto; justify-items:center; align-content:center; gap:4vh; }
  .sweave .in-hand, .sweave .tool, .sweave .outs { grid-column:1; }
  .sweave .wires { display:none; }
  .sweave .paper { width:min(40vw,180px); }
  .sweave .tool { min-width:0; }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
