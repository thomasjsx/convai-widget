// s01 · AI is faceless: the category's marks tile into one cold, orderly wall.
// Sparks, then gradients, then the abstract rest arrive in colour, drain to grey, and Copilot is singled out.
// Hover any mark to see it in colour, with its name.
const MARKS = [
  // [name, file, group, mono colour (null = draw the file as is)]
  ['Claude',     'marks/claude-symbol.svg',         'sparks',    null],
  ['OpenAI',     'marks/openai-symbol.svg',         'abstract',  '#fff'],
  ['Meta AI',    'marks/meta-ai-ring.svg',          'gradients', null],
  ['Copilot',    'marks/copilot-2026-icon.svg',     'gradients', null],
  ['Gemini',     's01/gemini-spark.svg',            'sparks',    null],
  ['xAI',        'marks/xai-logo.svg',              'abstract',  '#fff'],
  ['Mistral',    'marks/mistral-logo.svg',          'gradients', null],
  ['Perplexity', 's01/perplexity-symbol.svg',       'sparks',    null],
  ['DeepSeek',   's01/deepseek-whale.svg',          'abstract',  null],
  ['Copilot',    'marks/copilot-icon-one-color.svg','abstract',  '#fff'],
  ['Grok',       's01/grok-symbol.svg',             'abstract',  '#fff'],
];
const HERO = 3;                       // the Copilot 2026 colour mark sits in the centre cell
const COLS = 13, ROWS = 15, CC = 6, CR = 7;

// a fixed scatter, so every run (and every review still) looks the same
const rand = (r, c) => { const x = Math.sin(r * 127.1 + c * 311.7) * 43758.5453; return x - Math.floor(x); };

export default {
  mount(root, { asset }) {
    let cells = '';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const i = (((c - CC) + 3 * (r - CR) + HERO) % MARKS.length + MARKS.length) % MARKS.length;
      const [name, file, group, mono] = MARKS[i];
      const src = asset(file);
      const hero = r === CR && c === CC;
      const dist = Math.hypot(c - CC, r - CR);
      const colour = mono
        ? `<i class="c m" style="--src:url('${src}');--col:${mono}"></i>`
        : `<img class="c" src="${src}" alt="">`;
      cells += `<div class="cell${hero ? ' hero' : ''}" data-g="${group}" role="img" aria-label="${name}"
        style="--d:${(rand(r, c) * .42).toFixed(3)}s;--w:${(dist * .045).toFixed(3)}s">
        ${colour}<i class="g" style="--src:url('${src}')"></i><span class="nm">${name}</span></div>`;
    }
    root.innerHTML = `
      <div class="s01">
        <div class="wall">${cells}</div>
        <div class="tag"><b>Copilot</b> · redrawn 2026</div>
      </div>`;
  },
  enter({ root, at, atWord }) {
    const s = root.querySelector('.s01');
    s.className = 's01 snap';                               // reset without playing transitions backwards
    void s.offsetWidth;
    s.classList.remove('snap');
    at(0.12, () => s.classList.add('in'));                   // "Look at AI:" the empty grid
    atWord('sparks', () => s.classList.add('sparks'));
    atWord('gradients', () => s.classList.add('gradients'));
    atWord('abstract', () => s.classList.add('abstract'));
    atWord('marks', () => s.classList.add('cold'));         // the colour drains: a faceless wall
    atWord('copilot', () => s.classList.add('iso'));
    atWord('same', () => s.classList.add('same'));          // redrawn, still the same idea
    atWord('less', () => s.classList.add('less'));          // it settles back into the wall
  },
};

const css = `
[data-scene="s01"] .s01 { position:absolute; inset:0; overflow:hidden;
  --cell:clamp(78px, min(8.6vw, 15vh), 136px); --grey:rgba(203,208,219,.34);
  --fade:linear-gradient(to bottom, transparent, #000 16%, #000 80%, transparent),
         linear-gradient(to right, transparent, #000 14%, #000 86%, transparent);
  -webkit-mask-image:var(--fade); -webkit-mask-composite:source-in; mask-image:var(--fade); mask-composite:intersect; }
.s01.snap, .s01.snap * { transition:none !important; animation:none !important; }

.s01 .wall { position:absolute; left:50%; top:50%; display:grid; gap:1px;
  grid-template-columns:repeat(${COLS}, var(--cell)); grid-auto-rows:var(--cell);
  background:rgba(203,208,219,.1); transform:translate(-50%,-50%) scale(1.06); opacity:0;
  transition:opacity 1s var(--ease), background-color .8s var(--ease); }
.s01.in .wall { opacity:1; animation:s01push 9s cubic-bezier(.3,0,.3,1) forwards; }
@keyframes s01push { to { transform:translate(-50%,-50%) scale(1); } }

.s01 .cell { position:relative; background:#000; transition:transform .9s var(--ease), box-shadow .9s var(--ease); }
.s01 .c, .s01 .g { position:absolute; inset:31%; width:38%; height:38%; object-fit:contain; pointer-events:none; }
.s01 .m, .s01 .g { -webkit-mask:var(--src) center / contain no-repeat; mask:var(--src) center / contain no-repeat; }
.s01 .m { background:var(--col); }
.s01 .g { background:var(--grey); opacity:0; transition:opacity .7s var(--ease) var(--w); }
.s01 .c { opacity:0; transform:scale(.55); transition:opacity .45s var(--ease) var(--d), transform .6s cubic-bezier(.3,1.5,.4,1) var(--d); }
.s01.sparks .cell[data-g="sparks"] .c,
.s01.gradients .cell[data-g="gradients"] .c,
.s01.abstract .cell[data-g="abstract"] .c { opacity:1; transform:none; }

/* cold: every mark becomes the same grey shape, in a wave out from the centre */
.s01.cold .cell[data-g] .c { opacity:0; transform:none; transition:opacity .7s var(--ease) var(--w); }
.s01.cold .g { opacity:1; }

/* Copilot, singled out */
.s01.iso .wall { background:rgba(203,208,219,.045); }
.s01.iso .cell:not(.hero) .g { opacity:.13; transition-delay:0s; }
.s01.iso .hero { z-index:2; transform:scale(1.9); box-shadow:0 0 0 .5px rgba(203,208,219,.4), 0 30px 80px rgba(0,0,0,.9); }
.s01.iso .cell.hero .c { opacity:1; transition-delay:.15s; }
.s01.iso .hero .g { opacity:0; transition-delay:0s; }
.s01.iso.same .cell.hero .c { opacity:0; transition:opacity 1.1s var(--ease); }
.s01.same .hero .g { opacity:1; transition:opacity 1.1s var(--ease); }
.s01.less .wall { background:rgba(203,208,219,.1); }
.s01.less .cell:not(.hero) .g { opacity:1; transition:opacity 1.2s var(--ease) var(--w); }
.s01.less .hero { transform:none; box-shadow:none; transition:transform 1.1s var(--ease), box-shadow 1.1s var(--ease); }

.s01 .tag { position:absolute; left:50%; top:calc(50% + var(--cell) * .95 + 26px); transform:translate(-50%,8px);
  white-space:nowrap; font:500 12px var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--mute);
  opacity:0; transition:opacity .7s var(--ease), transform .7s var(--ease); pointer-events:none; }
.s01 .tag b { color:var(--ink); font-weight:500; }
.s01.iso .tag { opacity:1; transform:translate(-50%,0); transition-delay:.35s; }
.s01.less .tag { opacity:0; transition-delay:.3s; }

/* hover: the mark gets its colour back and its name */
.s01 .nm { position:absolute; left:0; right:0; bottom:9%; text-align:center; font:500 9px var(--mono); letter-spacing:.1em;
  text-transform:uppercase; color:var(--mute); opacity:0; transition:opacity .25s; pointer-events:none; }
.s01.in .cell:hover { z-index:3; }
.s01.in .cell[data-g]:hover .c { opacity:1; transform:none; transition:opacity .2s, transform .3s var(--ease); }
.s01.in .cell:hover .g { opacity:0; transition:opacity .2s; }
.s01.in .cell:hover .nm { opacity:1; }
.s01.iso .hero:hover .nm { opacity:0; }
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
