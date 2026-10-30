// s06 · Why step outside: Meta's Hyperion site, large and cold. 71% of Americans oppose a data center near them;
// Meta is building a $50B+ one. Then the little guy stands in front of it.
// Hover a figure or a source chip to see what it counts; click the Muse character for a hop.
const FIGURE = '<svg viewBox="0 0 12 24" aria-hidden="true"><circle cx="6" cy="4.2" r="3.3"/><path d="M1 23.4V14.2a5 5 0 0 1 10 0v9.2z"/></svg>';
const corners = '<i></i><i></i><i></i><i></i>';

export default {
  mount(root, { asset }) {
    const people = Array.from({ length: 10 }, (_, i) => i < 7
      ? `<span class="p on" style="--i:${i}" data-tip="Oppose · 71%">${FIGURE}</span>`
      : `<span class="p" style="--i:${i}" data-tip="Everyone else · 29%">${FIGURE}</span>`).join('');
    root.innerHTML = `
      <div class="s06">
        <div class="view">
          <div class="frame">
            <div class="plate">
              <img src="${asset('s06/hyperion-cold.jpg')}" alt="Rendering of Meta's Hyperion AI data center campus in Louisiana">
              <div class="site" aria-hidden="true">${corners}</div>
            </div>
            <span class="tag">Rendering</span>
          </div>
          <button class="muse" aria-label="The Muse character">
            <span class="warm"></span>
            <span class="mark" aria-hidden="true">${corners}<b>Muse</b></span>
            <span class="body"><img src="${asset('s05/muse.png')}" alt="The Muse character"></span>
          </button>
        </div>
        <div class="data">
          <div class="stat poll">
            <div class="people" role="img" aria-label="Seven in ten figures filled">${people}</div>
            <div class="num" aria-label="71 percent"><span class="n n71"><span class="v">71</span></span><small>%</small></div>
            <div class="foot">
              <p class="lbl">Oppose an AI data center near them</p>
              <button class="chip"><b>Gallup</b> · March 2026</button>
            </div>
          </div>
          <div class="stat cost">
            <div class="num" aria-label="More than 50 billion dollars"><small class="pre">$</small><span class="n n50"><span class="v">50</span></span><small>B+</small></div>
            <div class="foot">
              <p class="lbl">One AI data center</p>
              <button class="chip"><b>Meta</b> · Hyperion, Louisiana</button>
            </div>
          </div>
        </div>
      </div>`;
    const muse = root.querySelector('.muse');
    muse.onclick = () => { muse.classList.remove('hop'); void muse.offsetWidth; muse.classList.add('hop'); };
  },
  enter({ root, at, atWord }) {
    const s = root.querySelector('.s06');
    s.className = 's06';
    root.querySelector('.muse').classList.remove('hop');
    at(0.1, () => s.classList.add('on'));                     // "Why would Meta do this?" — the site, cold
    atWord('seven', () => s.classList.add('split', 'seven')); // the frame yields; seven of ten figures fill, count to 71
    atWord('oppose', () => s.classList.add('src1'));
    atWord('building', () => s.classList.add('lock'));        // lock on to the campus
    atWord('fifty-billion-dollar', () => s.classList.add('fifty'));
    atWord('faceless', () => s.classList.add('fear'));
    atWord('little', () => s.classList.add('guy'));           // "the little guy"
  },
};

const css = `
@property --s06a { syntax:'<integer>'; inherits:false; initial-value:0; }
@property --s06b { syntax:'<integer>'; inherits:false; initial-value:0; }
[data-scene="s06"] .s06 { position:absolute; inset:0; --split:clamp(400px, 36vw, 560px); --top:max(84px, 10vh); --bot:clamp(24px, 4.2vh, 44px); }

/* ---------- the site: framed large, graded cold, slowly pushing in */
.s06 .view { position:absolute; top:var(--top); right:40px; bottom:var(--bot); left:40px; transition:left 1.1s var(--ease), top 1.1s var(--ease); }
.s06.split .view { left:var(--split); }
.s06 .frame { position:absolute; inset:0; overflow:hidden; border-radius:3px; container-type:size; background:#05080d;
  opacity:0; transition:opacity 1.4s var(--ease); }
.s06.on .frame { opacity:1; }
.s06 .frame::after { content:''; position:absolute; inset:0; pointer-events:none; border-radius:inherit;
  box-shadow:inset 0 0 0 1px rgba(203,208,219,.14);
  background:radial-gradient(130% 100% at 50% 42%, transparent 50%, rgba(0,0,0,.55)), linear-gradient(180deg, rgba(0,0,0,.28), transparent 26%, transparent 72%, rgba(0,0,0,.5)); }
.s06 .plate { position:absolute; left:50%; top:50%; width:max(100cqw, 200cqh); aspect-ratio:2/1; translate:-50% -50%; transform-origin:50% 45%; }
.s06.on .plate { animation:s06push 18s linear both; }
@keyframes s06push { from { scale:1 } to { scale:1.07 } }
.s06 .plate img { width:100%; height:100%; transition:filter 1.4s var(--ease); }
.s06.fear .plate img { filter:brightness(.78) contrast(1.06); }
.s06 .tag { position:absolute; right:14px; top:14px; padding:6px 10px; border-radius:999px; border:1px solid rgba(203,208,219,.2);
  background:rgba(0,0,0,.35); font:500 10px/1 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:rgba(203,208,219,.7); }

/* corner brackets: a lock-on, large for the campus, tiny for the little guy */
.s06 .site, .s06 .mark { position:absolute; }
.s06 .site i, .s06 .mark i { position:absolute; width:var(--c); aspect-ratio:1; border:0 solid var(--ink); }
.s06 .site i:nth-child(1), .s06 .mark i:nth-child(1) { left:0; top:0; border-width:1.5px 0 0 1.5px; }
.s06 .site i:nth-child(2), .s06 .mark i:nth-child(2) { right:0; top:0; border-width:1.5px 1.5px 0 0; }
.s06 .site i:nth-child(3), .s06 .mark i:nth-child(3) { right:0; bottom:0; border-width:0 1.5px 1.5px 0; }
.s06 .site i:nth-child(4), .s06 .mark i:nth-child(4) { left:0; bottom:0; border-width:0 0 1.5px 1.5px; }
.s06 .site { --c:clamp(14px, 1.6vw, 26px);
  left:max(19%, calc(50% - 44cqw)); right:max(18%, calc(50% - 44cqw)); top:max(22%, calc(50% - 42cqh)); bottom:max(35%, calc(50% - 42cqh));
  opacity:0; scale:1.1; box-shadow:0 0 0 200vmax rgba(2,5,10,0);
  transition:opacity .5s var(--ease), scale 1s cubic-bezier(.2,.8,.2,1), box-shadow 1s var(--ease); }
.s06.lock .site { opacity:1; scale:1; box-shadow:0 0 0 200vmax rgba(2,5,10,.42); }

/* ---------- the numbers */
.s06 .data { position:absolute; left:40px; top:var(--top); bottom:var(--bot); width:calc(var(--split) - 96px);
  display:flex; flex-direction:column; justify-content:center; gap:clamp(28px, 7vh, 72px); transition:opacity .9s var(--ease); }
.s06 .stat { transition:opacity .5s var(--ease); }
.s06 .people { display:flex; gap:clamp(4px, .5vw, 8px); margin-bottom:clamp(14px, 2.2vh, 22px); }
.s06 .p { position:relative; width:clamp(12px, 1.3vw, 19px); opacity:0; translate:0 8px;
  transition:opacity .5s var(--ease) calc(var(--i) * 55ms), translate .6s var(--ease) calc(var(--i) * 55ms), filter .3s; }
.s06 .p svg { width:100%; height:auto; overflow:visible; }
.s06 .p svg * { fill:transparent; stroke:rgba(203,208,219,.42); stroke-width:1; transition:fill .35s var(--ease), stroke .35s var(--ease); }
.s06.seven .p { opacity:1; translate:0 0; }
.s06.seven .p.on svg * { fill:var(--ink); stroke:var(--ink); transition-delay:calc(.3s + var(--i) * .2s); }
.s06 .num { font-weight:700; font-size:clamp(64px, 9.4vw, 148px); line-height:.86; letter-spacing:-.05em; font-variant-numeric:tabular-nums;
  white-space:nowrap; color:var(--ink); }
.s06 .num small { font-size:.4em; font-weight:500; letter-spacing:-.02em; color:var(--mute); vertical-align:top; position:relative; top:.1em; margin-left:.06em; }
.s06 .num small.pre { margin:0 .04em 0 0; }
/* the count runs in ::after over the real (transparent) figure, which holds the layout; when the count lands,
   the real figure takes over. Transitions, not keyframes, so a paused or frozen pitch still ends on the true number. */
.s06 .n { position:relative; display:inline-block; }
.s06 .n .v { color:transparent; }
.s06 .n::after { position:absolute; left:0; top:0; }
.s06 .n71 { counter-reset:s06a var(--s06a); }
.s06 .n71::after { content:counter(s06a); }
.s06 .n50 { counter-reset:s06b var(--s06b); }
.s06 .n50::after { content:counter(s06b); }
.s06.seven .n71 { --s06a:71; transition:--s06a 1.7s cubic-bezier(.3,.6,.2,1) .3s; }
.s06.fifty .n50 { --s06b:50; transition:--s06b 1.3s cubic-bezier(.3,.6,.2,1) .1s; }
.s06.seven .n71 .v { color:inherit; transition:color 0s 2s; }
.s06.seven .n71::after { opacity:0; transition:opacity 0s 2s; }
.s06.fifty .n50 .v { color:inherit; transition:color 0s 1.4s; }
.s06.fifty .n50::after { opacity:0; transition:opacity 0s 1.4s; }
.s06 .poll .num { opacity:0; transition:opacity .5s var(--ease); }
.s06.seven .poll .num { opacity:1; }
.s06 .cost { opacity:0; translate:0 14px; transition:opacity .7s var(--ease), translate .8s var(--ease); }
.s06.fifty .cost { opacity:1; translate:0 0; }
.s06 .foot { margin-top:clamp(12px, 2vh, 20px); display:flex; flex-direction:column; align-items:flex-start; gap:14px; }
.s06 .lbl { margin:0; font-size:clamp(14px, 1.1vw, 17px); line-height:1.35; color:var(--mute); }
.s06 .chip { padding:9px 14px; border-radius:999px; border:1px solid rgba(203,208,219,.25); font:500 12px/1 var(--mono); letter-spacing:.06em;
  color:var(--mute); white-space:nowrap; transition:border-color .3s, color .3s, background .3s; }
.s06 .chip b { font-weight:500; color:var(--ink); }
.s06 .poll .foot { opacity:0; translate:0 8px; transition:opacity .6s var(--ease), translate .7s var(--ease); }
.s06.src1 .poll .foot { opacity:1; translate:0 0; }

/* ---------- interaction: figures say what they count, chips light up what they source */
.s06 .p::after { content:attr(data-tip); position:absolute; left:50%; bottom:calc(100% + 10px); translate:-50% 4px; opacity:0; pointer-events:none;
  padding:6px 9px; border-radius:6px; background:var(--ink); color:#000; font:500 11px/1 var(--mono); letter-spacing:.04em; white-space:nowrap;
  transition:opacity .2s, translate .2s; }
.s06 .p:hover::after { opacity:1; translate:-50% 0; }
.s06 .people:has(.p.on:hover) .p:not(.on), .s06 .people:has(.p:not(.on):hover) .p.on { filter:opacity(.25); }
.s06 .people:has(.p:not(.on):hover) .p:not(.on) svg * { stroke:var(--ink); }
.s06 .chip:hover, .s06 .chip:focus-visible { border-color:var(--ink); color:var(--ink); background:rgba(255,255,255,.06); outline:none; }
.s06:has(.poll .chip:hover) .cost, .s06:has(.cost .chip:hover) .poll { opacity:.22; }
.s06:has(.cost .chip:hover) .site { opacity:1; scale:1; box-shadow:0 0 0 200vmax rgba(2,5,10,.7); }
.s06.fear .data { opacity:.5; }
.s06.fear .data:hover { opacity:1; }

/* ---------- the little guy */
.s06 .muse { position:absolute; left:58%; bottom:4.5%; height:clamp(44px, 8.4vh, 86px); aspect-ratio:247/365; padding:0; translate:-50% 0; pointer-events:none; }
.s06.guy .muse { pointer-events:auto; }
.s06 .body { position:absolute; inset:0; display:block; transform-origin:50% 100%; opacity:0; transform:translateY(45%) scale(.4);
  transition:opacity .3s var(--ease), transform .9s cubic-bezier(.3,.9,.3,1.45); }
.s06 .body img { width:100%; height:100%; filter:drop-shadow(0 6px 8px rgba(0,0,0,.7)); }
.s06 .warm { position:absolute; left:50%; bottom:-12%; width:600%; aspect-ratio:2; translate:-50% 0; pointer-events:none; opacity:0;
  background:radial-gradient(closest-side, rgba(255,206,168,.34), rgba(255,180,140,.1) 50%, transparent 76%); transition:opacity 1.2s var(--ease); }
.s06 .mark { --c:7px; inset:-16% -30% -10%; opacity:0; scale:1.5; transition:opacity .4s var(--ease) .35s, scale .7s cubic-bezier(.2,.8,.2,1) .35s; }
.s06 .mark b { position:absolute; left:0; bottom:calc(100% + 6px); font:500 9px/1 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--ink); }
.s06.guy .body { opacity:1; transform:none; }
.s06.guy .warm { opacity:1; }
.s06.guy .mark { opacity:1; scale:1; }
.s06 .muse.hop .body { animation:s06hop .6s cubic-bezier(.3,.7,.2,1); }
@keyframes s06hop { 0% { transform:none } 35% { transform:translateY(-30%) rotate(-4deg) } 70% { transform:translateY(0) scale(1.06,.92) } 100% { transform:none } }

/* tall or narrow screens: the numbers sit on top, the site below */
@media (max-aspect-ratio: 1/1), (max-width: 900px) {
  [data-scene="s06"] .s06 { --top:max(64px, 7vh); --split-y:max(42%, 300px); --bot:24px; }
  .s06 .view { left:16px; right:16px; }
  .s06.split .view { left:16px; top:var(--split-y); }
  .s06 .data { left:16px; right:16px; width:auto; bottom:auto; height:calc(var(--split-y) - var(--top) - 22px);
    flex-direction:row; align-items:flex-end; justify-content:space-between; gap:20px; padding-bottom:2vh; }
  .s06 .stat { flex:1 1 0; min-width:0; }
  .s06 .num { font-size:clamp(46px, 12vw, 112px); }
  .s06 .p { width:clamp(11px, 2.6vw, 20px); }
  .s06 .muse { left:50%; height:clamp(40px, 7vh, 80px); }
}
@media (max-width: 560px) {
  [data-scene="s06"] .s06 { --bot:58px; }   /* this scene's line runs to five caption lines on a phone */
  .s06 .data { display:grid; grid-template-columns:auto 1fr; align-content:center; column-gap:16px; row-gap:22px; padding-bottom:0; }
  .s06 .stat { display:grid; grid-column:1 / -1; grid-template-columns:subgrid; align-items:end; }
  .s06 .people { grid-column:1 / -1; margin-bottom:10px; }
  .s06 .num { font-size:clamp(44px, 13vw, 64px); }
  .s06 .foot { margin:0 0 2px; gap:8px; }
  .s06 .lbl { font-size:13px; }
  .s06 .chip { padding:7px 10px; font-size:10px; letter-spacing:.04em; }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
