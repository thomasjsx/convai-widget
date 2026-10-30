// agent · What Muse does under the character, in Meta's own launch footage: errands, then a delayed flight rebooked.
// The paragraph picks the clip (script.json "video"); a few seconds of it, then the screen settles back on Muse.
// It holds still while the walk-through is paused.
export default {
  mount(root, { asset }) {
    root.innerHTML = `<div class="sagent"><video muted playsinline preload="auto"></video><img class="muse" src="${asset('s05/muse.png')}" alt=""></div>`;
    this.asset = asset;
    const v = root.querySelector('video');
    v.onended = () => root.querySelector('.sagent').classList.add('done');
    new MutationObserver(() => { if (root.classList.contains('active')) document.body.classList.contains('paused') ? v.pause() : v.play().catch(() => {}); })
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
  },
  enter({ root, scene }) {
    const s = root.querySelector('.sagent'), v = s.querySelector('video');
    const src = this.asset(scene.video);
    if (!v.src.endsWith(src)) v.src = src;
    v.currentTime = 0;
    s.classList.remove('in', 'done'); void s.offsetWidth; s.classList.add('in');
    if (!document.body.classList.contains('paused')) v.play().catch(() => {});
  },
  exit({ root }) { root.querySelector('video').pause(); },
};

const css = `
[data-scene="agent"] .sagent { position:absolute; inset:0; display:grid; place-items:center; padding:0 6vw; }
.sagent video { width:min(100%, calc((100vh - var(--caption-h) - 120px) * 16 / 9)); aspect-ratio:16/9; border-radius:18px; background:#f4f6fa;
  box-shadow:0 40px 80px rgba(0,0,0,.55); opacity:0; transform:scale(.97); transition:opacity .7s var(--ease), transform .9s var(--ease); }
.sagent.in video { opacity:1; transform:none; }
.sagent .muse { position:absolute; left:50%; top:50%; height:min(52vh,460px); transform:translate(-50%,-46%); opacity:0;
  filter:drop-shadow(0 30px 40px rgba(0,0,0,.6)); transition:opacity .8s var(--ease), transform 1s var(--ease); }
.sagent.done video { opacity:0; transform:scale(.97); }
.sagent.done .muse { opacity:1; transform:translate(-50%,-50%); }
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
