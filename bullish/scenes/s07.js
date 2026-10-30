// s07 · Some people hate it: a wall of real hostile headlines, buried by the App Store #1,
// then the push-back, then one line held alone. Hover any headline to pull it out of the wall.
const WALL = [
  ['nbc', 'NBC News', 'It’s cute. It’s cuddly. <mark>And it wants your data.</mark>'],
  ['bloq', 'Creative Bloq', 'Meta’s new AI avatar is making me feel infantilised'],
  ['futurism', 'Futurism', 'Meta Desperately Wants People to Lust After Its Muse Mascot, But It’s Just Not Happening'],
  ['aiweekly', 'AI Weekly', 'Meta’s Muse Ships an 18+ AI Agent <mark>Behind a <span class="nb">Kids-Toy</span> Mascot</mark>'],
  ['fortune', 'Fortune', 'A&nbsp;Clippy marketing moment with Muse'],
];

export default {
  mount(root, { asset }) {
    root.innerHTML = `
      <div class="s07">
        <div class="wall"><p>${WALL.map(([k, src, line], i) => {
          // the outlet never strands at a line end: bind it to the headline's first word
          const [first, ...rest] = line.split(' ');
          return `<span class="h" data-k="${k}" style="--i:${i}"><span class="nb"><b class="src">${src}</b>“${first}</span> ${rest.join(' ')}”</span>`;
        }).join(' ')}</p></div>
        <div class="signal">
          <div class="df">
            <b class="src">Daring Fireball</b>
            <q>Meta’s New Muse AI Agent App Overtakes ChatGPT as Top iPhone App</q>
          </div>
          <figure class="phone">
            <img src="${asset('s07/app-store-no1.png')}" alt="Muse from Meta at number one in the App Store's Top Downloaded free apps">
            <i class="ring"></i>
          </figure>
        </div>
        <p class="coda"><span class="a">A muse,</span> <span class="b">not a siren.</span></p>
      </div>`;
    const s = root.querySelector('.s07');
    // touch: tap a headline to pull it out of the wall (hover does it on desktop)
    s.querySelectorAll('.h').forEach(h => h.onclick = () => h.classList.toggle('pick'));
  },
  enter({ root, at, atWord }) {
    const s = root.querySelector('.s07');
    s.className = 's07 snap'; void s.offsetWidth; s.classList.remove('snap');   // reset without animating backwards
    s.querySelectorAll('.h').forEach(h => h.classList.remove('pick'));
    at(0.1, () => s.classList.add('in'));                // "Some people hate it."
    atWord('talk', () => s.classList.add('signal-on'));   // "...a character people talk about."
    atWord('push', () => s.classList.add('push'));        // "Thomas would push back in one place."
    atWord('hide', () => s.classList.add('hide'));        // "never hide what's behind it."
    atWord('behind', () => s.classList.add('behind'));
    atWord('muse', () => s.classList.add('coda-on'));     // "A muse,"
    atWord('siren', () => s.classList.add('siren'));      // "not a siren."
  },
};

const css = `
.s07.snap, .s07.snap * { transition:none !important; }
[data-scene="s07"] .s07 { position:absolute; inset:0; overflow:hidden; }
.s07 q { quotes:'“' '”'; }
.s07 .nb { white-space:nowrap; }
.s07 .src { font:500 max(10px,.24em)/1 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--mute);
  display:inline-block; vertical-align:.95em; margin-right:.9em; white-space:nowrap; }

/* the wall: one continuous broadsheet of headlines */
.s07 .wall { position:absolute; inset:0; display:grid; place-items:center; padding:clamp(72px,10vh,110px) 6vw 2vh;
  transform:scale(1); transform-origin:50% 45%; transition:opacity .9s var(--ease), filter .9s var(--ease); }
.s07.in .wall { transform:scale(1.035); transition:transform 12s linear, opacity .9s var(--ease), filter .9s var(--ease); }
.s07 .wall p { margin:0; max-width:1240px; font-weight:500; font-size:clamp(22px,3.7vw,60px); line-height:1.12; letter-spacing:-.03em; text-wrap:pretty; }
.s07 .h { color:#fff; opacity:0; transition:opacity .5s var(--ease), color .5s var(--ease); transition-delay:calc(var(--i) * .26s); cursor:default; }
.s07 .h .src { transition:color .4s; }
.s07.in .h { opacity:1; }
.s07 .h mark { color:inherit; background:linear-gradient(transparent 64%, rgba(24,229,137,.42) 64%, rgba(24,229,137,.42) 92%, transparent 92%) no-repeat 0 0 / 0% 100%;
  transition:background-size .9s var(--ease); }

/* "talk": the signal buries the noise */
.s07.signal-on .h { color:rgba(203,208,219,.1); transition-delay:0s; }
.s07.signal-on .h .src { color:rgba(203,208,219,.14); }
.s07.signal-on .wall { filter:blur(2.5px); }
.s07 .signal { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap:clamp(32px,6vw,110px);
  padding:clamp(72px,10vh,110px) 6vw 3vh; pointer-events:none; }
.s07 .df { max-width:min(560px,44vw); opacity:0; transform:translateY(16px); transition:opacity .8s var(--ease) .25s, transform .9s var(--ease) .25s; }
.s07 .df .src { display:block; margin:0 0 22px; font-size:12px; vertical-align:0; color:var(--green); }
.s07 .df q { display:block; font-weight:500; font-size:clamp(28px,3.3vw,54px); line-height:1.08; letter-spacing:-.03em; text-wrap:balance; }
.s07 .phone { position:relative; margin:0; height:min(64vh, calc(100vh - var(--caption-h) - 150px), 560px); aspect-ratio:340/708;
  opacity:0; transform:translateY(60vh) rotate(4deg); transition:transform 1.1s cubic-bezier(.2,.8,.2,1), opacity .5s; pointer-events:auto; }
.s07 .phone img { width:100%; height:100%; filter:drop-shadow(0 40px 60px rgba(0,0,0,.75)); }
.s07 .ring { position:absolute; left:5%; top:21.4%; width:90%; height:9.2%; border-radius:14px; box-shadow:0 0 0 2px var(--green), 0 0 32px rgba(24,229,137,.45);
  opacity:0; transform:scale(1.08); transition:opacity .5s var(--ease) 1.1s, transform .6s var(--ease) 1.1s; }
.s07.signal-on .df { opacity:1; transform:none; }
.s07.signal-on .phone { opacity:1; transform:none; }
.s07.signal-on .ring { opacity:1; transform:none; }
.s07 .phone:hover .ring { box-shadow:0 0 0 2px var(--green), 0 0 56px rgba(24,229,137,.75); transition-delay:0s; }

/* "push-back": the signal steps aside, and the fair criticism comes forward */
.s07.push .df, .s07.push .phone { opacity:0; transition-delay:0s; }
.s07.push .phone { transform:translateY(20px); }
.s07.push .wall { filter:none; }
.s07.push .h { color:rgba(203,208,219,.2); }
.s07.push .h[data-k="nbc"], .s07.push .h[data-k="aiweekly"] { color:#fff; }
.s07.push .h[data-k="nbc"] .src, .s07.push .h[data-k="aiweekly"] .src { color:var(--mute); }
.s07.hide .h[data-k="aiweekly"] mark, .s07.behind .h[data-k="nbc"] mark { background-size:100% 100%; }

/* curiosity: any headline can be pulled out of the wall */
.s07 .h:hover, .s07 .h.pick { color:#fff !important; }
.s07 .h:hover .src, .s07 .h.pick .src { color:var(--green) !important; }

/* "A muse, not a siren." holds alone */
.s07.coda-on .wall { opacity:0; filter:blur(6px); }
.s07 .coda { position:absolute; inset:0; margin:0; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;
  font-weight:500; font-size:clamp(44px,7.4vw,118px); line-height:1; letter-spacing:-.045em; pointer-events:none; }
.s07 .coda span { display:block; opacity:0; transform:translateY(14px); transition:opacity .9s var(--ease), transform .9s var(--ease); }
.s07 .coda .b { color:rgba(203,208,219,.46); margin-top:.06em; }
.s07.coda-on .coda .a, .s07.siren .coda .b { opacity:1; transform:none; }

@media (max-aspect-ratio: 1/1), (max-width: 900px) {
  .s07 .wall { padding:clamp(64px,9vh,120px) max(24px,6vw) 2vh; }
  .s07 .wall p { font-size:clamp(20px,6.4vw,46px); line-height:1.14; }
  .s07 .signal { flex-direction:column; justify-content:center; gap:clamp(22px,4vh,48px); padding:clamp(60px,8vh,110px) 22px 6vh; }
  .s07 .df { max-width:min(640px,100%); text-align:center; }
  .s07 .df .src { margin-bottom:14px; }
  .s07 .df q { font-size:clamp(22px,6vw,48px); }
  .s07 .phone { height:min(46vh, calc(100vh - var(--caption-h) - 380px), 600px); }
  .s07 .coda { font-size:clamp(40px,12vw,104px); }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
