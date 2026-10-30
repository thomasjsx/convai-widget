// s03 · The house stayed sober: three Meta apps in house style, then Muse steps out of its own phone.
// Click a phone to bring it forward; clicking the Muse phone brings the character out.
const PHONES = [
  ['facebook', 'Facebook'],
  ['meta-ai', 'Meta AI'],
  ['muse', 'Muse'],
];

export default {
  mount(root, { asset }) {
    root.innerHTML = `
      <div class="s03">
        <div class="row">
          <img class="char" src="${asset('s05/muse.png')}" alt="The Muse character">
          ${PHONES.map(([k, label]) => `
            <button class="phone" data-k="${k}">
              <img class="screen" src="${asset(`meta/${k}-ui.jpg`)}" alt="The ${label} app">
              <span class="label"><img src="${asset(`meta/${k}-icon.png`)}" alt="">${label}</span>
            </button>`).join('')}
        </div>
      </div>`;
    const s = root.querySelector('.s03');
    root.querySelectorAll('.phone').forEach(p => p.onclick = () => {
      s.querySelectorAll('.phone').forEach(q => q.classList.toggle('focus', q === p));
      s.classList.add('focused');
      s.classList.toggle('out', p.dataset.k === 'muse');
    });
  },
  enter({ root, at, atWord }) {
    const s = root.querySelector('.s03');
    s.className = 's03';
    s.querySelectorAll('.phone').forEach(p => p.classList.remove('focus'));
    at(0.3, () => s.classList.add('in'));            // "Look at the house it came from"
    atWord("didn't", () => {                        // "Meta didn't redesign the house"
      s.classList.add('focused');
      s.querySelector('[data-k="muse"]').classList.add('focus');
    });
    atWord('step', () => s.classList.add('out'));    // "It let one product step outside"
  },
};

const css = `
[data-scene="s03"] .s03 { position:absolute; inset:0; display:grid; place-items:center; }
.s03 .row { --w:min(26vw, calc((100vh - var(--caption-h) - 160px) * .46), 340px); position:relative; display:flex; gap:clamp(16px,3vw,48px); align-items:flex-end; }
.s03 .phone { padding:0; display:flex; flex-direction:column; align-items:center; gap:16px;
  opacity:0; transform:translateY(40px); transition:opacity .8s var(--ease), transform .8s var(--ease), filter .6s; }
.s03 .phone:nth-child(2){ transition-delay:.12s } .s03 .phone:nth-child(3){ transition-delay:.24s }
.s03.in .phone { opacity:1; transform:none; }
/* the app itself, full screen in a plain iPhone: no store headline, no frame-in-a-frame */
.s03 .screen { width:var(--w); aspect-ratio:9/19.5; height:auto; object-fit:cover; object-position:top; background:#fff;
  border:calc(var(--w) * .025) solid #0b0d10; border-radius:calc(var(--w) * .15);
  box-shadow:0 0 0 1px rgba(203,208,219,.16), 0 30px 70px rgba(0,0,0,.6); }
.s03 .label { display:flex; align-items:center; gap:10px; font:500 12px var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--mute); }
.s03 .label img { width:22px; height:22px; border-radius:6px; }
.s03 .phone:hover { transform:translateY(-8px); }
.s03.focused .phone { filter:brightness(.4) saturate(.5); transition-delay:0s; }
.s03.focused .phone.focus { filter:none; transform:translateY(-10px) scale(1.04); }
/* the character sits on the Muse column (the last phone) and rises out of its top */
.s03 .char { position:absolute; z-index:2; right:calc(var(--w) / 2); top:0; height:min(40vh, 46vw, 340px); width:auto;
  transform:translate(50%, 30%) scale(.55); opacity:0; pointer-events:none;
  filter:drop-shadow(0 30px 40px rgba(0,0,0,.7)); transition:transform 1.1s cubic-bezier(.3,.8,.2,1.15), opacity .5s; }
.s03.out .char { opacity:1; transform:translate(50%, -24%) scale(1); }
.s03.out .phone.focus { filter:brightness(.55); }
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
