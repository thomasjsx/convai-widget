// What makes a good brand campaign? — conversation engine.
// script.json has short "beats" (the walk-through) and "clips" (answers to questions people can tap).
// After a beat with questions, it stops and waits: tap a question to hear the answer, or Continue.
// Each visual module in scenes/<id>.js exports { mount(root, ctx), enter(ctx), exit?(ctx) };
// ctx.atWord(word, fn) cues a visual on a spoken word of whatever is playing over it.
// ?scene=s03&t=12 freezes a visual at 12 s for review stills.

const params = new URLSearchParams(location.search);
const only = params.get('scene');

const { beats, clips, chapters, v } = await (await fetch(`script.json?t=${Date.now()}`, { cache: 'no-store' })).json();   // never a cached copy (GitHub's CDN holds files 10 min), so text and voice always come from the same version
const clipById = Object.fromEntries(clips.map(c => [c.id, c]));
const order = beats.flatMap(b => [b.id, ...(b.chips ?? []).map(c => c.clip)]);   // the full walk-through, answers included
// sections are the chapters (the opening is its own): one plays straight through, answers and all, and it stops only between them
const section = {};
{ let s = 0; for (const id of order) { if (chapters.some(c => c.start === id)) s++; section[id] = s; } }
const stage = document.getElementById('stage');
const captions = document.getElementById('captions');
const progress = document.getElementById('progress');
const chapterNav = document.getElementById('chapters');
const chipsEl = document.getElementById('chips');
const audio = new Audio();
const askedEl = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'asked', hidden: true }));

const asset = p => `assets/${p}`;

function placeholder(id) {
  return { mount(root) { root.innerHTML = `<div class="placeholder"><b>${id}</b></div>`; }, enter() {} };
}

// one module per visual, shared by every beat or answer that plays over it
const visualIds = [...new Set([...beats, ...clips].map(x => x.scene))];
const load = id => import(`./scenes/${id}.js?v=${v}`).catch(() => import(`./scenes/${id}.js?v=${v}&retry`));
const mods = {}, roots = {};
await Promise.all(visualIds.map(async id => {
  mods[id] = await load(id).then(m => m.default).catch(() => placeholder(id));
}));
for (const id of visualIds) {
  const root = document.createElement('section');
  root.className = 'scene'; root.dataset.scene = id;
  stage.appendChild(root);
  try { mods[id].mount(root, { asset }); }
  catch (e) { console.error(id, e); mods[id] = placeholder(id); mods[id].mount(root); }
  roots[id] = root;
}

// ---------- captions: one sentence at a time, words lighting up with the voice
let words = [], shownSentence = -1;
function setCaption(item) {
  const ws = item.vo.split(/\s+/);
  const weights = ws.map(w => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  const span = Math.max(item.duration - 1.0, 1);
  // with a real voice, each word carries its exact start time; otherwise estimate from length
  const exact = item.words?.length === ws.length ? item.words.map(([, t]) => t) : null;
  let acc = 0, sentence = 0;
  captions.innerHTML = '';
  return ws.map((w, i) => {
    const el = document.createElement('span');
    el.className = 'w'; el.textContent = w + ' ';
    captions.appendChild(el);
    const s = sentence;
    if (/[.?!:]["”’]?$/.test(w)) sentence++;
    const t = exact ? exact[i] : 0.25 + (acc / total) * span;
    acc += weights[i];
    return { el, t, sentence: s };
  });
}
const showSentence = n => { for (const w of words) w.el.hidden = w.sentence !== n; };

// ---------- playback
let beatIdx = -1, current = null, visual = null, ctx = null;
let clock = 0, last = performance.now(), paused = false, waiting = false, cues = [];
let returnTo = null;      // { i, t }: the line someone interrupted, picked up again after the answer
const heard = [];        // words the voice just said, with when, so the mic can tell them from the viewer
const used = new Set();
const norm = w => w.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9#%']/g, '');

function playItem(item, kind, from = 0) {
  if (ctx && visual) { mods[visual].exit?.(ctx); roots[visual].classList.remove('active'); }
  current = { item, kind }; visual = item.scene;
  clock = from; cues = []; waiting = false; hideChips();
  if (paused && !only) unpause();
  setMic('on');
  const asked = kind === 'clip' && item.heading !== false;   // some answers are plain paragraphs, with no question over them
  askedEl.hidden = !asked; askedEl.textContent = asked ? item.title : '';
  words = setCaption(item);
  ctx = {
    asset, scene: item, kind, root: roots[visual], duration: item.duration,
    at: (t, fn) => cues.push({ t, fn, done: false }),
    atWord: (word, fn, nth = 1) => {
      const hits = words.filter(w => norm(w.el.textContent) === norm(word));
      const hit = hits[nth - 1];
      if (hit) cues.push({ t: hit.t, fn, done: false });   // a word that isn't spoken (that many times) never fires, so the screen never shows a line the voice doesn't say
    },
  };
  shownSentence = -1; showSentence(0);
  document.body.dataset.scene = visual;
  roots[visual].classList.add('active');
  mods[visual].enter(ctx);
  if (item.audio) { audio.src = item.audio; audio.currentTime = from; if (!paused) audio.play().catch(() => {}); }
  else audio.removeAttribute('src');
}

function playBeat(i, from = 0) {
  beatIdx = i; returnTo = null;
  playItem(beats[i], 'beat', from);
  chapterNav.querySelectorAll('button').forEach((b, k, all) => {
    const from = beats.findIndex(x => x.id === b.dataset.start);
    const to = all[k + 1] ? beats.findIndex(x => x.id === all[k + 1].dataset.start) : beats.length;
    b.classList.toggle('on', from <= i && i < to);
  });
}

function playClip(id) {
  used.add(id);
  playItem(clipById[id], 'clip');
}

// what Continue plays next: back to an interrupted line, else this beat's next answer, else the next beat
function upcoming() {
  if (returnTo && current?.kind === 'clip') return beats[returnTo.i].id;
  const open = (beats[beatIdx]?.chips ?? []).filter(c => !used.has(c.clip));
  return open.length ? open[0].clip : beats[beatIdx + 1]?.id ?? null;
}
// after a beat or an answer: keep going inside a section; at the end of one, stop for questions, or Continue
function offer() {
  const following = upcoming();
  const back = returnTo && current?.kind === 'clip';                  // answered an interruption: straight back to the line
  if (following && (back || section[following] === section[current.item.id])) return only ? undefined : next();
  waiting = true;
  quietSince = performance.now(); setMic('ask');
  document.body.classList.add('waiting');
  if (!following) return;                                            // the close holds on its own buttons, still listening
  chipsEl.innerHTML = '';
  chipsEl.appendChild(chip('Continue →', next, 'go'));
  chipsEl.hidden = false;
  if (!paused && !only) startAutoContinue();
}
// nobody picks a question within 5 s: carry on, with the countdown shown on Continue
const AUTO_MS = 5000;
let autoTimer = null;
function startAutoContinue() {
  stopAutoContinue();
  const go = chipsEl.querySelector('.go');
  if (!go) return;
  go.style.setProperty('--auto', `${AUTO_MS}ms`);
  void go.offsetWidth; go.classList.add('timed');
  autoTimer = setTimeout(next, AUTO_MS);
}
function stopAutoContinue() {
  clearTimeout(autoTimer); autoTimer = null;
  chipsEl.querySelector('.go')?.classList.remove('timed');
}
function hideChips() { stopAutoContinue(); chipsEl.hidden = true; chipsEl.innerHTML = ''; document.body.classList.remove('waiting'); }
function next() {
  if (returnTo && current?.kind === 'clip') return playBeat(returnTo.i, returnTo.t);   // back to the line they interrupted
  const id = upcoming();                               // every answer in a section plays, in order, unless someone asked it first
  if (id) clipById[id] ? playClip(id) : playBeat(beats.findIndex(b => b.id === id));
}

function step() {
  // real elapsed time, so a throttled or background tab doesn't fall behind the voice
  const now = performance.now();
  const dt = Math.min((now - last) / 1000, 5); last = now;
  if (!current || paused || waiting) return;
  const item = current.item;
  clock = item.audio && !audio.paused ? audio.currentTime : clock + dt;
  for (const c of cues) if (!c.done && clock >= c.t) { c.done = true; c.fn(); }
  for (const w of words) {
    const said = clock >= w.t;
    w.el.classList.toggle('said', said);
    if (said && !w.heard) { w.heard = true; heard.push({ k: norm(w.el.textContent), at: now }); }
  }
  const cur = words.filter(w => clock >= w.t).pop() ?? words[0];
  if (cur && cur.sentence !== shownSentence) { shownSentence = cur.sentence; showSentence(shownSentence); }
  progress.style.width = `${((order.indexOf(item.id) + Math.min(clock / item.duration, 1)) / order.length) * 100}%`;
  if (clock >= item.duration + 0.4) {
    if (only) return;
    offer();
  }
}
const frame = () => { step(); requestAnimationFrame(frame); };
setInterval(step, 200);                             // keeps time when frames are suspended

function setPaused(p) {
  paused = p;
  if (p) quietSince = performance.now();
  document.body.classList.toggle('paused', p);
  document.getElementById('pause').textContent = p ? '▶' : '❚❚';
  if (waiting) p ? stopAutoContinue() : startAutoContinue();    // pausing holds the questions on screen
  else {
    if (!p) { hideChips(); setMic('on'); }                        // questions offered mid-line go away when it plays on
    if (current?.item.audio) p ? audio.pause() : audio.ended || audio.play().catch(() => {});   // never restart a line that has finished
  }
}
// start something new without restarting what was paused
function unpause() { paused = false; document.body.classList.remove('paused'); document.getElementById('pause').textContent = '❚❚'; }

// ---------- chrome
chapters.forEach(c => {
  const b = document.createElement('button');
  b.textContent = c.title; b.dataset.start = c.start;
  b.onclick = e => { e.currentTarget.blur(); setPaused(false); playBeat(beats.findIndex(x => x.id === c.start)); };
  chapterNav.appendChild(b);
});
document.getElementById('pause').onclick = e => { e.currentTarget.blur(); setPaused(!paused); };
addEventListener('keydown', e => {
  if (e.target.closest?.('button, a, input')) return;  // let focused controls have their keys
  if (!current || document.body.classList.contains('talking')) return;
  if (e.code === 'Space') { e.preventDefault(); setPaused(!paused); }
  if (e.code === 'ArrowRight') next();
  if (e.code === 'ArrowLeft' && beatIdx > 0) playBeat(beatIdx - 1);
});

// ---------- voice: say "pause" (or "wait", "hold on", "I have a question") and it stops to take a question.
// Ask one out loud, or say "continue". Chrome and Safari; elsewhere the buttons do the same.
const mic = document.getElementById('mic')            // a page cached from before this existed gets one made here
  ?? document.getElementById('controls').appendChild(Object.assign(document.createElement('p'), { id: 'mic', hidden: true, innerHTML: '<i></i><span></span>' }));
const STOP = /\b(pause|stop|wait|hold on|hang on|hold up|question)\b/g;
const GO = /\b(continue|keep going|go on|carry on|resume|go ahead)\b/g;
const SKIP = new Set(`a an the is are was it its it's does doesn't do don't did isn't what what's why how who where when would will
  you your me my i he his him they them their to of and or in on for at that this these about can could tell more so just like um uh`.split(/\s+/));
const stem = w => w.replace(/'s$/, '').replace(/^(\w{3,})s$/, '$1');
const keywords = s => (s.toLowerCase().replace(/[‘’]/g, "'").match(/[a-z']+/g) ?? []).filter(w => !SKIP.has(w)).map(stem);
let rec = null, listening = false, lastAct = 0;

const MIC = { on: 'Say “pause” to ask a question', ask: 'Listening · ask, or say “continue”', miss: 'No answer for that one · pick a question or say “continue”' };
function setMic(state) {
  if (!listening) return;
  mic.hidden = false; mic.dataset.state = state;
  mic.querySelector('span').textContent = MIC[state];
}

// the voice comes back through the mic too: a word it said in the last few seconds isn't the viewer talking
function recent() {
  const since = performance.now() - 5000;
  while (heard.length && heard[0].at < since) heard.shift();
  return new Set(heard.map(x => stem(x.k)));
}
const said = (word, r = recent()) => r.has(stem(word.split(' ')[0]));
// an echo is a run of its words; a viewer's question is short and mostly their own words
const echo = text => {
  const ws = text.split(/\s+/).map(w => stem(norm(w))).filter(Boolean), r = recent();
  return ws.length >= 3 && ws.filter(w => r.has(w)).length / ws.length >= 0.75;
};
let quietSince = 0;      // when the voice last stopped; its final words can still arrive from the mic just after

// a spoken question picks the answer whose question shares the most words with it; this chapter's questions first
function matchQuestion(text) {
  const asked = new Set(keywords(text));
  const offered = new Set((beats[beatIdx]?.chips ?? []).map(c => c.clip));
  let best = null, top = 0;
  for (const c of clips) {
    const want = keywords(c.title);
    const hits = want.filter(k => asked.has(k)).length;
    const score = hits && hits / want.length + (offered.has(c.id) ? 0.25 : 0);
    if (score > top) { top = score; best = c; }
  }
  return best;
}

// stopped mid-line: offer this chapter's questions, and Continue picks the line back up
function stopToAsk() {
  if (!current) return;
  if (!paused) setPaused(true);
  if (waiting) return setMic('ask');                 // the questions are already up; hold them
  chipsEl.innerHTML = '';
  const open = current.kind === 'beat' ? (beats[beatIdx].chips ?? []).filter(c => !used.has(c.clip)) : [];
  for (const c of open) chipsEl.appendChild(chip(c.label, () => answer(c.clip)));
  chipsEl.appendChild(chip('Continue →', carryOn, 'go'));
  chipsEl.hidden = false;
  document.body.classList.add('waiting');
  setMic('ask');
}
function chip(label, onclick, extra = '') {
  const b = document.createElement('button');
  b.className = `chip ${extra}`.trim(); b.textContent = label; b.onclick = onclick;
  return b;
}
function answer(id) {
  if (current.kind === 'beat' && (!waiting || beatIdx === beats.length - 1)) {   // interrupted mid-line, or at the close: come back to that sentence
    const cur = words.filter(w => clock >= w.t).pop();
    returnTo = { i: beatIdx, t: cur ? Math.max(0, words.find(w => w.sentence === cur.sentence).t - 0.15) : 0 };
  }
  playClip(id);
}
function carryOn() { if (waiting) next(); else setPaused(false); }

function hear(text, final) {
  const t = text.toLowerCase(), now = performance.now();
  if (!current || now - lastAct < 1500) return;
  const quiet = paused || waiting;                 // the voice isn't talking, so this is the viewer
  const tail = t.split(/\s+/).slice(-4).join(' ');   // a result keeps growing; only its newest words can be a command
  const stop = tail.match(STOP)?.[0], go = tail.match(GO)?.[0];
  if (stop && !(paused && chipsEl.childElementCount) && (quiet || !said(stop))) { lastAct = now; return stopToAsk(); }
  if (!quiet) return;
  if (go && !said(go)) { lastAct = now; return carryOn(); }
  if (echo(t) || now - quietSince < 1000) return;
  const q = t.replace(STOP, ' ').replace(GO, ' ');
  if (!keywords(q).length) return;
  if (waiting && !paused) stopAutoContinue();      // someone is asking: don't move on under them
  if (!final) return;
  const c = matchQuestion(q);
  if (c) { lastAct = now; return answer(c.id); }
  setMic('miss');
  if (waiting && !paused) startAutoContinue();
}

function listen() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition || only || rec) return;
  rec = new Recognition();
  rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US';
  rec.onstart = () => setMic(paused || waiting ? 'ask' : 'on');
  let fails = 0;
  rec.onresult = e => { fails = 0; for (let i = e.resultIndex; i < e.results.length; i++) hear(e.results[i][0].transcript, e.results[i].isFinal); };
  rec.onerror = e => {
    if (e.error === 'no-speech' || e.error === 'aborted') return;
    if (/not-allowed|service-not-allowed|audio-capture|language-not-supported/.test(e.error) || ++fails > 3) unlisten();
  };
  rec.onend = () => { if (listening) setTimeout(() => { try { rec?.start(); } catch {} }, 250); };   // browsers stop after a silence; keep listening
  listening = true;
  try { rec.start(); } catch { unlisten(); }
}
function unlisten() {
  listening = false; mic.hidden = true;
  const r = rec; rec = null;
  try { r?.abort(); } catch {}
}

const start = document.getElementById('start');
document.getElementById('play').onclick = e => { e.currentTarget.blur(); start.inert = true; start.classList.add('gone'); document.body.classList.add('playing'); listen(); playBeat(0); };

// freeze what's playing at t seconds with every cue fired and animations settled
function freezeAt(t) {
  clock = t; paused = true; document.body.classList.add('paused');
  audio.pause();
  for (const c of cues) if (c.t <= t) { c.done = true; c.fn(); }
  for (const w of words) w.el.classList.toggle('said', t >= w.t);
  const cur = words.filter(w => t >= w.t).pop();
  if (cur) { shownSentence = cur.sentence; showSentence(cur.sentence); }
  setTimeout(() => document.getAnimations().forEach(a => { try { a.finish(); } catch {} }), 60);
}

// first beat or answer that plays over a visual, for previews and the live agent
const itemFor = scene => {
  const b = beats.findIndex(x => x.scene === scene);
  if (b >= 0) return { kind: 'beat', i: b };
  const c = clips.find(x => x.scene === scene);
  return c ? { kind: 'clip', id: c.id } : null;
};
const showVisual = scene => {
  const f = itemFor(scene); if (!f) return false;
  if (f.kind === 'beat') playBeat(f.i); else { beatIdx = Math.max(beatIdx, 0); playItem(clipById[f.id], 'clip'); }
  freezeAt(current.item.duration);
  return true;
};

if (only) {
  document.body.classList.add('preview');
  start.classList.add('gone');
  const f = params.get('clip') ? { kind: 'clip', id: params.get('clip') } : itemFor(only);
  if (f?.kind === 'beat') playBeat(f.i); else if (f) { beatIdx = 0; playClip(f.id); }
  const t = Number(params.get('t'));
  if (t) freezeAt(t);
  if (params.has('offer')) offer();                 // ?offer shows the questions that follow this beat
}

// ---------- talk back: an ElevenLabs agent answers questions and puts the matching visual on stage
const agent = await fetch('agent.json').then(r => r.ok ? r.json() : null).catch(() => null);
const talk = document.getElementById('talk');
if (agent?.agent_id) {
  document.body.classList.add('can-talk');
  let session = null, resumeAt = null;
  const label = talk.querySelector('span');
  const setState = (state, text) => { talk.dataset.state = state; label.textContent = text; };
  const showAnswer = text => {
    captions.innerHTML = '';
    const el = document.createElement('span');
    el.className = 'w said'; el.textContent = text;
    captions.appendChild(el);
  };
  const finish = async () => {
    const s = session; session = null;
    if (s) await s.endSession().catch(() => {});
    document.body.classList.remove('talking');
    setState('idle', 'Ask a question');
    listen();
    if (resumeAt != null) { setPaused(false); playBeat(resumeAt); resumeAt = null; }   // back where they left off
  };
  let connecting = false;
  talk.onclick = async () => {
    if (session) return finish();
    if (connecting) return;
    connecting = true;
    unlisten();
    resumeAt = Math.max(beatIdx, 0);
    if (beatIdx >= 0) setPaused(true);
    document.body.classList.add('talking', 'playing');
    start.classList.add('gone');
    setState('connecting', 'Connecting…');
    try {
      const { Conversation } = await import('https://esm.sh/@elevenlabs/client@latest');
      session = await Conversation.startSession({
        agentId: agent.agent_id,
        clientTools: {
          show_scene: async ({ scene }) => showVisual(scene) ? `Now showing ${scene}.` : `No visual called ${scene}.`,
        },
        onConnect: () => setState('listening', 'Listening… tap to return'),
        onModeChange: ({ mode }) => setState(mode, mode === 'speaking' ? 'Answering… tap to return' : 'Listening… tap to return'),
        onMessage: ({ message, source }) => { if (source === 'ai') showAnswer(message); },
        onDisconnect: () => { if (session) finish(); },
        onError: e => { console.error(e); setState('idle', 'Ask a question'); },
      });
    } catch (e) {
      console.error(e);
      session = null;
      document.body.classList.remove('talking');
      setState('idle', 'Microphone needed to ask');
      listen();
      if (resumeAt != null) { setPaused(false); resumeAt = null; }
    } finally { connecting = false; }
  };
}
requestAnimationFrame(frame);
