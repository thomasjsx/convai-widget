// Saves the whole meeting kit on first visit so it opens with no internet.
// Bump VERSION whenever a file changes.
importScripts('files.js');
var VERSION = 'v2';
var CACHE = 'bullish-1on1-' + VERSION;

function tell(msg) {
  self.clients.matchAll({ includeUncontrolled: true }).then(function (cs) { cs.forEach(function (c) { c.postMessage(msg); }); });
}

async function saveAll() {
  var cache = await caches.open(CACHE), done = 0, failed = 0;
  for (var i = 0; i < FILES.length; i++) {
    var url = new URL(FILES[i], self.registration.scope).href;
    if (!(await cache.match(url))) {
      try { var res = await fetch(url, { cache: 'reload' }); if (!res.ok) throw 0; await cache.put(url, res); }
      catch (e) { failed++; }
    }
    done++;
    tell({ type: 'progress', done: done, total: FILES.length });
  }
  tell(failed ? { type: 'error', failed: failed } : { type: 'ready' });
  return !failed;
}

self.addEventListener('install', function (e) { self.skipWaiting(); e.waitUntil(saveAll().catch(function () {})); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('bullish-1on1-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('message', function (e) { if (e.data && e.data.type === 'check') saveAll(); });

// Videos on iPhone ask for byte ranges, so cached files are sliced to match
async function ranged(req, res) {
  var m = /bytes=(\d+)-(\d*)/.exec(req.headers.get('range') || '');
  if (!m) return res;
  var buf = await res.arrayBuffer(), start = +m[1], end = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), { status: 206, headers: {
    'Content-Type': res.headers.get('Content-Type') || 'video/mp4', 'Content-Range': 'bytes ' + start + '-' + end + '/' + buf.byteLength,
    'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
}

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url); url.hash = '';
  e.respondWith((async function () {
    var cache = await caches.open(CACHE);
    var hit = await cache.match(url.href, { ignoreSearch: true });
    if (hit) return ranged(e.request, hit);
    try { return await fetch(e.request); }
    catch (err) {
      if (e.request.mode === 'navigate') return (await cache.match(new URL('index.html', self.registration.scope).href)) || Response.error();
      return Response.error();
    }
  })());
});
