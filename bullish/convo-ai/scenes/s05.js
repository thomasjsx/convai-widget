// s05 · It comes from culture: Labubu arrives beside the Muse character, a Tamagotchi beside the Charm.
// Then the verdict: "Not because it's cute. Because it's current."
// Hover a pair to bring it forward (the two objects lean in to each other).
const PAIRS = [
  { k: 'a', items: [
    { k: 'labubu', kind: 'Culture', name: 'Labubu', src: 's05/labubu.png', alt: 'A Labubu plush on a keyring' },
    { k: 'muse', kind: 'Meta', name: 'Muse', src: 's05/muse.png', alt: 'The Muse character' },
  ] },
  { k: 'b', items: [
    { k: 'charm', kind: 'Meta', name: 'Charm', src: 's05/charm.png', alt: 'The Charm, held in a hand, with the Muse character on its screen' },
    { k: 'tama', kind: 'Culture', name: 'Tamagotchi', src: 's05/tamagotchi.png', alt: 'A Tamagotchi' },
  ] },
];

const item = (it, asset) => `
  <figure class="obj ${it.k} ${it.kind === 'Culture' ? 'culture' : 'meta'}">
    <div class="art"><img src="${asset(it.src)}" alt="${it.alt}"></div>
    <figcaption><i>${it.kind}</i>${it.name}</figcaption>
  </figure>`;

export default {
  mount(root, { asset }) {
    root.innerHTML = `
      <div class="s05">
        <div class="stage">
          ${PAIRS.map((p, i) => `
            ${i ? '<div class="rule"></div>' : ''}
            <div class="pair ${p.k}" tabindex="0">
              ${item(p.items[0], asset)}
              <span class="eq" aria-hidden="true">≈</span>
              ${item(p.items[1], asset)}
            </div>`).join('')}
        </div>
        <div class="type" aria-hidden="true">
          <p class="l1">Not because it's <span class="cute">cute</span>.</p>
          <p class="l2">Because it's <span class="cur">current</span>.</p>
        </div>
      </div>`;
  },
  enter({ root, at, atWord }) {
    const s = root.querySelector('.s05');
    s.className = 's05';
    at(0.15, () => s.classList.add('on'));                 // the Muse character and the Charm, already ours
    atWord('labubu', () => s.classList.add('a-in'));
    atWord('tamagotchi', () => s.classList.add('b-in'));
    atWord('not', () => s.classList.add('verdict'));        // "Not because it's cute."
    atWord('cute', () => s.classList.add('struck'));
    atWord('because', () => s.classList.add('l2'), 2);      // "Because it's current."
    atWord('current', () => s.classList.add('current'));
  },
};

const css = `
[data-scene="s05"] .s05 { position:absolute; inset:0; --u:min(calc((100vh - var(--caption-h)) * .37), 19.5vw, 320px); }
.s05 .stage { position:absolute; inset:max(76px, 9vh) 4vw 3vh; display:grid; grid-template-columns:1fr auto 1fr;
  align-content:center; align-items:end; justify-items:center; column-gap:clamp(24px, 4vw, 72px); }

/* a pair: culture object and Meta object on one baseline, a quiet ≈ between their captions */
.s05 .pair { position:relative; display:flex; align-items:flex-end; gap:clamp(10px, 1.6vw, 28px); outline:none;
  transition:filter .6s var(--ease), opacity .6s var(--ease), transform .7s var(--ease); }
.s05 .obj { margin:0; display:flex; flex-direction:column; align-items:center; }
.s05 .art { display:flex; align-items:flex-end; justify-content:center; transition:transform .7s var(--ease); }
.s05 .art img { width:auto; filter:drop-shadow(0 26px 34px rgba(0,0,0,.65)); }
.s05 .labubu img { height:calc(var(--u) * 1.6); }      /* the plush body matches Muse; its keyring rides above */
.s05 .muse img   { height:var(--u); }
.s05 .charm img  { height:calc(var(--u) * 1.22); }
.s05 .tama img   { height:calc(var(--u) * .8); }
.s05 figcaption { margin-top:clamp(14px, 2.2vh, 22px); display:flex; flex-direction:column; align-items:center; gap:7px;
  font:500 12px/1 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--mute); white-space:nowrap; }
.s05 figcaption i { font-style:normal; font-size:10px; color:rgba(203,208,219,.42); }
.s05 .culture figcaption i { color:var(--green); opacity:.85; }
.s05 .eq { align-self:flex-end; margin-bottom:6px; font:400 18px/1 var(--mono); color:rgba(203,208,219,.5); opacity:0; transition:opacity .6s var(--ease) .35s; }

/* the centre rule between the pairs */
.s05 .rule { align-self:stretch; width:1px; background:linear-gradient(transparent, rgba(203,208,219,.22) 30%, rgba(203,208,219,.22) 70%, transparent);
  transform:scaleY(0); transition:transform 1.2s var(--ease); }
.s05.on .rule { transform:scaleY(1); }

/* entrances: ours first, then culture slides in from the outside edge */
.s05 .meta { opacity:0; transform:translateY(18px); transition:opacity .9s var(--ease), transform .9s var(--ease); }
.s05.on .meta { opacity:1; transform:none; }
.s05 .culture { opacity:0; transition:opacity .7s var(--ease), transform 1s cubic-bezier(.25,.8,.2,1.08); }
.s05 .labubu { transform:translateX(-7vw); }
.s05 .tama { transform:translateX(7vw); }
.s05.a-in .labubu, .s05.b-in .tama { opacity:1; transform:none; }
.s05.a-in .a .eq, .s05.b-in .b .eq { opacity:1; }

/* hover: bring a pair forward, the other steps back, the two objects lean in */
.s05 .pair:hover, .s05 .pair:focus-visible { z-index:2; transform:scale(1.035); }
.s05 .stage:has(.pair:hover) .pair:not(:hover) { filter:brightness(.42) saturate(.6); }
.s05 .pair:hover .obj:first-child .art { transform:rotate(3deg) translateX(4px); }
.s05 .pair:hover .obj:last-child .art { transform:rotate(-3deg) translateX(-4px); }
.s05 .pair:hover .eq { color:var(--ink); }

/* the verdict: the objects step back, the type comes forward */
.s05.verdict .pair { filter:brightness(.26) saturate(.55); transform:scale(.97); transition-delay:0s; }
.s05.verdict .rule { opacity:.35; }
.s05.verdict .pair:hover { filter:brightness(.7) saturate(.9); transform:scale(1); }
.s05.verdict .stage:has(.pair:hover) .pair:not(:hover) { filter:brightness(.18) saturate(.5); }
.s05 figcaption { transition:opacity .6s var(--ease); }
.s05.verdict .pair:not(:hover) figcaption, .s05.verdict .pair:not(:hover) .eq { opacity:0; }
.s05 .type { position:absolute; inset:0; display:grid; place-content:center; text-align:center; gap:clamp(6px, 1.4vh, 14px);
  pointer-events:none; padding:0 6vw; }
.s05 .type p { margin:0; opacity:0; transform:translateY(14px); transition:opacity .8s var(--ease), transform .9s var(--ease); }
.s05 .l1 { font-weight:500; font-size:clamp(26px, 3.3vw, 50px); letter-spacing:-.02em; color:var(--mute); }
.s05 .l2 { font-weight:700; font-size:clamp(44px, 7vw, 112px); line-height:.95; letter-spacing:-.045em; color:var(--ink); }
.s05.verdict .l1, .s05.l2 .l2 { opacity:1; transform:none; }
.s05 .cute { position:relative; display:inline-block; transition:color .5s var(--ease); }
.s05 .cute::after { content:''; position:absolute; left:-3%; right:-1%; top:54%; height:max(2px, .07em); background:var(--ink);
  transform:scaleX(0); transform-origin:left center; transition:transform .45s cubic-bezier(.6,0,.2,1); }
.s05.struck .cute { color:rgba(203,208,219,.4); }
.s05.struck .cute::after { transform:scaleX(1); }
.s05 .cur { transition:color .6s var(--ease); }
.s05.current .cur { color:var(--green); }

/* tall or narrow screens: the pairs stack, the rule lies down */
@media (max-aspect-ratio: 1/1), (max-width: 900px) {
  [data-scene="s05"] .s05 { --u:min(calc((100vh - var(--caption-h) - 190px) / 3.45), 36vw, 270px); }
  .s05 .stage { inset:max(64px, 7vh) 16px 2vh; grid-template-columns:1fr; grid-template-rows:auto auto auto; row-gap:clamp(18px, 3vh, 40px); }
  .s05 .rule { width:min(60vw, 420px); height:1px; align-self:center; background:linear-gradient(90deg, transparent, rgba(203,208,219,.22) 30%, rgba(203,208,219,.22) 70%, transparent);
    transform:scaleX(0); }
  .s05.on .rule { transform:scaleX(1); }
  .s05 figcaption { margin-top:12px; font-size:11px; gap:6px; }
  .s05 figcaption i { font-size:9px; }
  .s05 .l1 { font-size:clamp(20px, 5vw, 44px); }
  .s05 .l2 { font-size:clamp(34px, 9.2vw, 92px); }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
