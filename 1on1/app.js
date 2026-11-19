(function () {
  var groupsEl = document.getElementById('groups');
  var peopleEl = document.querySelector('.people');
  var viewer = document.querySelector('.viewer');
  var stage = viewer.querySelector('.stage');
  var caption = viewer.querySelector('.caption');
  var statusEl = document.querySelector('.status');
  var KIND = { video: 'Video', images: 'Images', link: 'Live site' };

  // Build the page from data.js; ?person=tram shows one person's pieces only
  var only = new URLSearchParams(location.search).get('person');
  if (only) document.body.classList.add('single');
  GROUPS.filter(function (g) { return !only || g.id === only; }).forEach(function (g) {
    var a = document.createElement('a'); a.href = '#' + g.id; a.textContent = g.name; peopleEl.appendChild(a);
    var sec = document.createElement('section'); sec.className = 'group'; sec.id = g.id;
    sec.innerHTML = '<h2>' + g.name + '</h2>' + (g.note ? '<p class="note">' + g.note + '</p>' : '') + '<div class="cards"></div>';
    var cards = sec.querySelector('.cards');
    g.pieces.forEach(function (p) {
      var b = document.createElement('button'); b.className = 'card';
      b.innerHTML = '<div class="thumb" style="background-image:url(' + p.thumb + ')"><span class="kind">' + KIND[p.type] + '</span></div>' +
        '<div class="text"><div class="title">' + p.title + '</div>' + (p.sub ? '<div class="sub">' + p.sub + '</div>' : '') + '</div>';
      b.onclick = function () { open(p); };
      cards.appendChild(b);
    });
    groupsEl.appendChild(sec);
  });

  function mark() {
    var id = location.hash.slice(1);
    peopleEl.querySelectorAll('a').forEach(function (a) { a.classList.toggle('on', a.hash === '#' + id); });
  }
  addEventListener('hashchange', mark); mark();

  // Full-screen viewer
  function open(p) {
    stage.innerHTML = ''; caption.innerHTML = '';
    if (p.type === 'video') {
      var v = document.createElement('video');
      v.src = p.src; v.controls = true; v.playsInline = true; v.autoplay = true; v.preload = 'auto';
      if (p.poster) v.poster = p.poster;
      stage.appendChild(v);
      caption.innerHTML = '<span>' + p.title + '</span>';
    } else if (p.type === 'images') {
      var gal = document.createElement('div'); gal.className = 'gallery';
      // A slide is an image path, or { video: path, poster: path } for a clip inside the sequence
      p.images.forEach(function (it) {
        var f = document.createElement('figure');
        if (typeof it === 'string') f.innerHTML = '<img alt="" src="' + it + '">';
        else f.innerHTML = '<video src="' + it.video + '" poster="' + (it.poster || '') + '" playsinline controls preload="auto"></video>';
        gal.appendChild(f);
      });
      stage.appendChild(gal);
      var count = function () {
        var i = gal.clientWidth ? Math.round(gal.scrollLeft / gal.clientWidth) : 0;
        caption.innerHTML = '<span>' + p.title + '</span><span class="count">' + (i + 1) + ' / ' + p.images.length + '</span>';
        gal.querySelectorAll('video').forEach(function (v, k) { var on = v.parentNode === gal.children[i]; if (on && v.paused) v.play().catch(function () {}); if (!on) v.pause(); });
      };
      gal.addEventListener('scroll', count); requestAnimationFrame(count);
      gal.addEventListener('click', function (e) {
        if (e.target.tagName === 'VIDEO') return;
        var r = gal.getBoundingClientRect(), dir = e.clientX > r.left + r.width / 2 ? 1 : -1;
        gal.scrollBy({ left: dir * gal.clientWidth, behavior: 'smooth' });
      });
    } else if (p.type === 'link') {
      if (navigator.onLine) { window.open(p.href, '_blank', 'noopener'); return; }
      stage.innerHTML = '<div class="offline-note">' + (p.fallback ? '<img alt="" src="' + p.fallback + '">' : '') + 'This one needs internet: ' + p.href.replace(/^https?:\/\//, '') + '</div>';
      caption.innerHTML = '<span>' + p.title + '</span>';
    }
    viewer.hidden = false;
    history.pushState({ viewer: 1 }, '');
  }
  function close() {
    var v = stage.querySelector('video'); if (v) v.pause();
    stage.innerHTML = ''; viewer.hidden = true;
  }
  viewer.querySelector('.close').onclick = function () { history.back(); };
  addEventListener('popstate', function () { if (!viewer.hidden) close(); });
  addEventListener('keydown', function (e) {
    if (viewer.hidden) return;
    if (e.key === 'Escape') history.back();
    var gal = stage.querySelector('.gallery');
    if (gal && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) gal.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * gal.clientWidth, behavior: 'smooth' });
  });

  // Offline copy: the service worker saves everything, and reports back here
  function say(t, ok) { statusEl.textContent = t; statusEl.classList.toggle('ok', !!ok); }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', function (e) {
      var d = e.data || {};
      if (d.type === 'progress') say('Saving for offline… ' + d.done + ' / ' + d.total);
      if (d.type === 'ready') say('Saved for offline. Works without internet on this device.', true);
      if (d.type === 'error') say('Offline copy incomplete. Reload on wifi to finish.');
    });
    navigator.serviceWorker.register('sw.js').then(function () {
      return navigator.serviceWorker.ready;
    }).then(function (reg) { reg.active && reg.active.postMessage({ type: 'check' }); })
      .catch(function () { say('Offline copy unavailable in this browser.'); });
  } else say('Offline copy unavailable in this browser.');
})();
