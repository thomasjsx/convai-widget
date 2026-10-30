// s02 · Muse walks in: the character lands centre stage, named, with its App Store #1.
// Click the character for a hop.
export default {
  mount(root, { asset }) {
    root.innerHTML = `
      <div class="s02">
        <div class="glow"></div>
        <div class="name">
          <img class="m" src="${asset('brand/muse-m.svg')}" alt="">
          <h2>Muse</h2>
          <span class="from">from Meta · Sept 2026</span>
        </div>
        <button class="char" aria-label="Muse">
          <img src="${asset('s05/muse.png')}" alt="The Muse character">
          <i class="shadow"></i>
        </button>
        <div class="chip"><b>#1</b> App Store · Free apps</div>
      </div>`;
    const btn = root.querySelector('.char');
    btn.onclick = () => { btn.classList.remove('hop'); void btn.offsetWidth; btn.classList.add('hop'); };
  },
  enter({ root, at, atWord }) {
    const s = root.querySelector('.s02');
    s.className = 's02';
    at(0.1, () => s.classList.add('named'));
    atWord('muse', () => s.classList.add('in'));          // "The work he loves is Muse"
    atWord('accessible', () => s.classList.add('feels'));
  },
};

const css = `
[data-scene="s02"] .s02 { position:absolute; inset:0; display:grid; place-items:center; }
.s02 .glow { position:absolute; left:50%; top:52%; width:min(70vw,900px); aspect-ratio:1.6; transform:translate(-50%,-50%) scale(.6);
  background:radial-gradient(closest-side, rgba(255,214,180,.20), rgba(255,190,160,.06) 55%, transparent 75%); opacity:0;
  transition:opacity 1.2s var(--ease), transform 1.6s var(--ease); }
.s02.in .glow { opacity:1; transform:translate(-50%,-50%) scale(1); }
.s02.feels .glow { transform:translate(-50%,-50%) scale(1.18); background:radial-gradient(closest-side, rgba(255,214,180,.30), rgba(255,190,160,.09) 55%, transparent 75%); }
.s02 .char { position:relative; padding:0; height:min(50vh,430px); transform:translateY(-120vh); }
.s02 .char img { height:100%; width:auto; filter:drop-shadow(0 30px 40px rgba(0,0,0,.6)); }
.s02 .shadow { position:absolute; left:50%; bottom:-2%; width:70%; height:7%; transform:translateX(-50%); border-radius:50%;
  background:radial-gradient(closest-side, rgba(0,0,0,.7), transparent); opacity:0; }
.s02.in .char { animation:s02drop 1.1s cubic-bezier(.3,.7,.2,1) forwards; }
.s02.in .shadow { animation:s02shadow 1.1s ease forwards; }
@keyframes s02drop { 0%{transform:translateY(-120vh)} 62%{transform:translateY(0) scale(1.06,.9)} 78%{transform:translateY(-3%) scale(.98,1.03)} 100%{transform:translateY(0) scale(1)} }
@keyframes s02shadow { 0%,40%{opacity:0} 62%{opacity:1} 100%{opacity:.8} }
.s02 .char.hop { animation:s02hop .6s cubic-bezier(.3,.7,.2,1); transform:none; }
@keyframes s02hop { 0%{transform:none} 35%{transform:translateY(-10%) rotate(-3deg)} 70%{transform:translateY(0) scale(1.04,.95)} 100%{transform:none} }
.s02 .name { position:absolute; left:8vw; top:50%; transform:translate(-20px,-50%); opacity:0; transition:all .9s var(--ease); }
.s02.named .name { opacity:1; transform:translate(0,-50%); }
.s02 .name .m { width:64px; margin-bottom:18px; }
.s02 .name h2 { margin:0; font-weight:700; font-size:clamp(48px,6vw,92px); letter-spacing:-.04em; line-height:.9; }
.s02 .name .from { display:block; margin-top:14px; font:500 12px var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--mute); }
.s02 .chip { position:absolute; right:8vw; top:50%; transform:translate(20px,-50%); opacity:0; transition:all .8s var(--ease);
  padding:12px 18px; border-radius:999px; border:1px solid rgba(203,208,219,.25); font:500 13px var(--mono); letter-spacing:.08em; color:var(--mute); }
.s02 .chip b { color:var(--green); font-weight:500; margin-right:6px; }
.s02.ranked .chip { opacity:1; transform:translate(0,-50%); }
/* tall or narrow screens: name above the character, chip below */
@media (max-aspect-ratio: 1/1), (max-width: 900px) {
  .s02 .char { height:min(40vh, 70vw, 430px); }
  .s02 .name { left:50%; top:9%; transform:translate(-50%,-12px); text-align:center; }
  .s02.named .name { transform:translate(-50%,0); }
  .s02 .name .m { margin:0 auto 12px; width:48px; }
  .s02 .chip { right:auto; left:50%; top:auto; bottom:6%; transform:translate(-50%,12px); }
  .s02.ranked .chip { transform:translate(-50%,0); }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
