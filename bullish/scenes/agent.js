// agent · What Muse does under the character, in Meta's own launch footage: errands, then a delayed flight rebooked.
// The paragraph picks the clip (script.json "video"); it holds still while the walk-through is paused.
export default {
  mount(root, { asset }) {
    root.innerHTML = `<div class="sagent"><video muted playsinline preload="auto"></video></div>`;
    this.asset = asset;
    const v = root.querySelector('video');
    new MutationObserver(() => { if (root.classList.contains('active')) document.body.classList.contains('paused') ? v.pause() : v.play().catch(() => {}); })
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
  },
  enter({ root, scene }) {
    const s = root.querySelector('.sagent'), v = s.querySelector('video');
    const src = this.asset(scene.video);
    if (!v.src.endsWith(src)) v.src = src;
    v.currentTime = 0;
    s.classList.remove('in'); void s.offsetWidth; s.classList.add('in');
    if (!document.body.classList.contains('paused')) v.play().catch(() => {});
  },
  exit({ root }) { root.querySelector('video').pause(); },
};

const css = `
[data-scene="agent"] .sagent { position:absolute; inset:0; display:grid; place-items:center; padding:0 6vw; }
.sagent video { width:min(100%, calc((100vh - var(--caption-h) - 120px) * 16 / 9)); aspect-ratio:16/9; border-radius:18px; background:#f4f6fa;
  box-shadow:0 40px 80px rgba(0,0,0,.55); opacity:0; transform:scale(.97); transition:opacity .7s var(--ease), transform .9s var(--ease); }
.sagent.in video { opacity:1; transform:none; }
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
