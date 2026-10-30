// body · A body for the abstract: Muse arrives, then runs (cut from Meta's launch video) on "Meta gave the AI thing a body";
// then the three jobs a body does that a logo can't. Hover a job to bring it forward.
const JOBS = [
  ['explains', 'Explains', 'People understand “a helper” long before they understand “an agent.”'],
  ['invites', 'Invites', 'A character makes people ask what it is.'],
  ['accumulates', 'Accumulates', 'The same face in every launch builds on the last.'],
];

export default {
  mount(root, { asset }) {
    root.innerHTML = `
      <div class="sbody">
        <div class="fig">
          <div class="glow"></div>
          <img src="${asset('s05/muse.png')}" alt="The Muse character">
        </div>
        <img class="clip" src="${asset('body/muse-run.webp')}" alt="Muse running">
        <div class="col">
          <p class="kick">A body does three jobs a logo can’t</p>
          ${JOBS.map(([k, h, d]) => `<div class="job" data-k="${k}"><h3>${h}</h3><p>${d}</p></div>`).join('')}
        </div>
      </div>`;
  },
  enter({ root, at, atWord }) {
    const s = root.querySelector('.sbody');
    s.className = 'sbody snap'; void s.offsetWidth; s.classList.remove('snap');
    s.querySelectorAll('.job').forEach(j => j.classList.remove('on'));
    at(0.2, () => s.classList.add('in'));                    // "Muse appeared with a fuzzy, rosy-cheeked character"
    atWord('gave', () => s.classList.add('moving'));        // "Meta gave the “AI” thing a body."
    atWord('feels', () => s.classList.add('warm'));          // "It changed how the category feels."
    atWord('three', () => s.classList.add('jobs'));          // "A body does three jobs a logo can't."
    JOBS.forEach(([k]) => atWord(k, () => s.querySelector(`[data-k="${k}"]`).classList.add('on')));
  },
};

const css = `
[data-scene="body"] .sbody { position:absolute; inset:0; display:grid; grid-template-columns:1fr 1fr; align-items:center; gap:4vw; padding:0 8vw; }
.sbody.snap * { transition:none !important; }
.sbody .fig { position:relative; justify-self:center; height:min(56vh,480px); }
.sbody .fig img { position:relative; height:100%; width:auto; filter:drop-shadow(0 30px 40px rgba(0,0,0,.6));
  opacity:0; transform:translateY(24px) scale(.96); transition:opacity .9s var(--ease), transform 1.1s var(--ease); }
.sbody.in .fig img { opacity:1; transform:none; }
.sbody .glow { position:absolute; left:50%; top:55%; width:170%; aspect-ratio:1.4; transform:translate(-50%,-50%) scale(.7); opacity:0;
  background:radial-gradient(closest-side, rgba(255,214,180,.22), rgba(255,190,160,.06) 55%, transparent 75%); transition:all 1.4s var(--ease); }
.sbody.in .glow { opacity:.7; transform:translate(-50%,-50%) scale(.9); }
.sbody.warm .glow { opacity:1; transform:translate(-50%,-50%) scale(1.1); }
.sbody .fig { grid-column:1; grid-row:1; }
.sbody .col, .sbody .clip { grid-column:2; grid-row:1; }        /* the clip and the jobs share a place; one shows at a time */
.sbody .clip { justify-self:center; height:min(46vh,400px); width:auto; max-width:100%; filter:drop-shadow(0 26px 34px rgba(0,0,0,.6));
  opacity:0; transform:translateX(-24px); pointer-events:none; transition:opacity .8s var(--ease), transform 1s var(--ease); }
.sbody.moving .clip { opacity:1; transform:none; }
.sbody.jobs .clip { opacity:0; }
.sbody .col { display:grid; gap:clamp(18px,3vh,30px); max-width:460px; }
.sbody .kick { margin:0; font:500 12px var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--mute);
  opacity:0; transition:opacity .8s var(--ease); }
.sbody.jobs .kick { opacity:1; }
.sbody .job { opacity:0; transform:translateY(14px); transition:opacity .7s var(--ease), transform .7s var(--ease); }
.sbody .job.on { opacity:1; transform:none; }
.sbody .job h3 { margin:0 0 6px; font-weight:500; font-size:clamp(28px,3.2vw,46px); letter-spacing:-.03em; line-height:1; }
.sbody .job p { margin:0; color:var(--mute); font-size:clamp(15px,1.25vw,18px); line-height:1.45; }
.sbody .job.on:hover h3 { background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent; }
@media (max-aspect-ratio: 1/1), (max-width: 900px) {
  [data-scene="body"] .sbody { grid-template-columns:1fr; grid-template-rows:auto auto; align-content:center; gap:3vh; padding:0 6vw; }
  .sbody .fig { height:min(30vh,300px); }
  .sbody .col, .sbody .clip { grid-column:1; grid-row:2; }
  .sbody .clip { height:min(24vh,240px); }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
