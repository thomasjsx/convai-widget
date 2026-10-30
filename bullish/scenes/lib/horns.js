// The Bullish horns, alive — Thomas's motion study (slide 28). Shared by the scenes that show it.
//   const h = horns(container, { width: '40vw' });
//   h.draw()   draws the outline on, then fills (about 1.6 s)
//   h.alive()  breathing, a slow head-tilt and a green-to-blue glow that swells with each breath
//   h.reset()  back to blank
const PATH = 'M27.345 9.78929C23.4576 6.64662 19.348 5.18664 14.1269 4.45418C9.43443 3.79595 6.59916 2.85562 2.48456 0L0 3.70687C3.68486 6.45361 7.13756 7.81461 11.8153 8.62626C15.1247 9.20035 17.713 9.23995 21.1558 11.0711C20.4791 11.952 19.8617 13.2487 19.4863 14.1296C17.7673 13.1101 15.2334 12.3282 11.8498 12.2935V16.7081C13.4947 16.7774 14.9716 16.9803 16.9622 17.8464C19.3875 18.9006 21.0768 20.4793 21.0768 20.4793C23.0131 13.6644 27.345 9.78929 27.345 9.78929ZM38.207 15.5649C34.6505 18.2126 32.4327 22.1868 31.835 26.5914H28.1847C30.1852 10.5712 44.8802 9.13107 47.671 8.73514C52.7093 8.02247 56.3201 6.45856 60 3.71182L57.5154 0.00494788C53.4008 2.86057 50.5656 3.8009 45.8731 4.45913C40.652 5.19159 36.3645 6.76045 32.4772 9.90312C26.4312 14.6839 23.5861 21.7116 23.5861 28.8136L23.591 31.0308H35.9694V28.8086C35.92 22.2907 40.82 19.1233 40.82 19.1233C42.5735 17.9355 45.2062 16.6042 48.1502 16.718V12.3034C44.8407 12.2688 41.4176 13.3229 38.207 15.5649Z';

let uid = 0;

export function horns(container, { width = '36vw' } = {}) {
  const id = `hg${++uid}`;
  container.insertAdjacentHTML('beforeend', `
    <div class="horns" style="width:${width}">
      <div class="horns-glow"></div>
      <svg viewBox="-1 -1 62 33.05" fill="none" aria-label="The Bullish horns">
        <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9fff4"/></linearGradient></defs>
        <path d="${PATH}" fill="url(#${id})" fill-opacity="0" stroke="#fff" stroke-width=".3" pathLength="1"
              stroke-dasharray="1" stroke-dashoffset="1"/>
      </svg>
    </div>`);
  const el = container.lastElementChild;
  const svg = el.querySelector('svg');
  const path = el.querySelector('path');
  const glow = el.querySelector('.horns-glow');
  let loops = [];

  return {
    el,
    draw() {
      path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1100, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' });
      path.animate([{ fillOpacity: 0 }, { fillOpacity: 1 }], { duration: 600, delay: 900, easing: 'ease-out', fill: 'forwards' });
      glow.animate([{ opacity: 0 }, { opacity: .6 }], { duration: 900, delay: 1000, fill: 'forwards' });
    },
    alive() {
      path.style.strokeDashoffset = 0; path.style.fillOpacity = 1;
      loops.forEach(a => a.cancel());
      loops = [
        // a slow breath: the horns lift and widen a touch, the glow swells
        svg.animate([{ transform: 'translateY(0) scale(1,1)' }, { transform: 'translateY(-2.5%) scale(1.025,.985)' }, { transform: 'translateY(0) scale(1,1)' }],
          { duration: 3600, iterations: Infinity, easing: 'ease-in-out' }),
        svg.animate([{ rotate: '0deg' }, { rotate: '-2.2deg' }, { rotate: '0deg' }, { rotate: '1.6deg' }, { rotate: '0deg' }],
          { duration: 9000, iterations: Infinity, easing: 'ease-in-out' }),
        glow.animate([{ opacity: .45, transform: 'translate(-50%,-50%) scale(.9)' }, { opacity: .9, transform: 'translate(-50%,-50%) scale(1.08)' }, { opacity: .45, transform: 'translate(-50%,-50%) scale(.9)' }],
          { duration: 3600, iterations: Infinity, easing: 'ease-in-out' }),
      ];
    },
    reset() {
      loops.forEach(a => a.cancel()); loops = [];
      path.getAnimations().forEach(a => a.cancel()); glow.getAnimations().forEach(a => a.cancel());
      path.style.strokeDashoffset = ''; path.style.fillOpacity = '';
    },
  };
}

document.head.insertAdjacentHTML('beforeend', `<style>
.horns { position:relative; }
.horns svg { position:relative; width:100%; height:auto; overflow:visible; transform-origin:50% 90%; }
.horns-glow { position:absolute; left:50%; top:62%; width:150%; aspect-ratio:2.2; transform:translate(-50%,-50%); opacity:0;
  background:radial-gradient(closest-side, rgba(24,229,137,.38), rgba(33,140,255,.2) 55%, transparent 76%); filter:blur(22px); pointer-events:none; }
</style>`);
