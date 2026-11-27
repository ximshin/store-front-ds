// Store Front dev notes — panel injected by devnotes/plugin.ts into `npm run dev` pages only.
// Pick an element → tweak CSS live (token hints) → comment → optional screenshot → save to .tmp/devnotes/notes.json.
// Plain JS in a Shadow DOM so the app styles and the panel never leak into each other.
(() => {
  if (window.__devnotes) return;
  window.__devnotes = true;

  const API = '/__devnotes';
  const Z = 2147483000;

  // ---------- properties shown for a picked element + token prefixes suggested for each ----------
  const PROPS = [
    ['width', ['space', 'size']],
    ['height', ['space', 'size']],
    ['padding', ['space']],
    ['margin', ['space']],
    ['gap', ['space']],
    ['font', ['typo']],
    ['font-size', ['font']],
    ['font-weight', ['font']],
    ['line-height', ['font']],
    ['color', ['text', 'icon']],
    ['background-color', ['surface', 'bg']],
    ['border', ['border', 'stroke']],
    ['border-radius', ['radius']],
    ['opacity', []],
  ];
  const PREFIX_GUESS = [
    [/color$|^fill$|^stroke$/, ['text', 'icon', 'surface', 'bg', 'border', 'stroke']],
    [/radius/, ['radius']],
    [/^font$/, ['typo']],
    [/^font-|line-height|letter-spacing/, ['font']],
    [/border/, ['border', 'stroke', 'space']],
    [/padding|margin|gap|width|height|top|left|right|bottom|inset/, ['space', 'size']],
  ];

  // ---------- tokens from :root ----------
  function collectTokens() {
    const names = new Set();
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      for (const r of rules) {
        if (r.selectorText && /(^|,)\s*:root\b/.test(r.selectorText)) {
          for (const p of r.style) if (p.startsWith('--')) names.add(p);
        }
      }
    }
    const cs = getComputedStyle(document.documentElement);
    return [...names].sort().map((n) => ({ name: n, value: cs.getPropertyValue(n).trim() }));
  }
  let TOKENS = [];
  function tokensFor(prop) {
    let prefixes = (PROPS.find((p) => p[0] === prop) || [])[1];
    if (!prefixes) prefixes = (PREFIX_GUESS.find(([re]) => re.test(prop)) || [null, null])[1];
    if (!prefixes || !prefixes.length) return TOKENS;
    return TOKENS.filter((t) => prefixes.some((p) => t.name.startsWith('--' + p + '-')));
  }

  // ---------- element info ----------
  const isOurs = (el) => el && (el === host || el === hl || el === sel || el === line || host.contains(el));
  function vueChain(el) {
    let inst = null;
    for (let n = el; n && !inst; n = n.parentElement) inst = n.__vueParentComponent || null;
    const out = [];
    for (let i = inst; i && out.length < 8; i = i.parent) {
      const t = i.type || {};
      const name = t.__name || t.name || (t.__file ? t.__file.split('/').pop().replace(/\.vue$/, '') : 'Anonymous');
      if (/^(RouterView|RouterLink|Transition|TransitionGroup|BaseTransition|KeepAlive)$/.test(name)) continue;
      out.push({ name, file: t.__file ? t.__file.replace(/^.*?\/src\//, 'src/') : null });
    }
    return out;
  }
  const cleanClasses = (el) => [...el.classList].filter((c) => !c.startsWith('devnotes'));
  const scopeId = (el) => [...el.attributes].map((a) => a.name).find((n) => n.startsWith('data-v-')) || null;
  function selectorOf(el) {
    const parts = [];
    for (let n = el; n && n !== document.body && parts.length < 5; n = n.parentElement) {
      let s = n.tagName.toLowerCase();
      if (n.id) { parts.unshift(s + '#' + n.id); break; }
      const cls = cleanClasses(n).slice(0, 3);
      if (cls.length) s += '.' + cls.join('.');
      const sib = n.parentElement ? [...n.parentElement.children].filter((c) => c.tagName === n.tagName) : [];
      if (sib.length > 1 && !cls.length) s += `:nth-of-type(${sib.indexOf(n) + 1})`;
      parts.unshift(s);
    }
    return parts.join(' > ');
  }
  const shortLabel = (el) => {
    const c = cleanClasses(el)[0];
    return el.tagName.toLowerCase() + (c ? '.' + c : '');
  };
  const ownText = (el) => [...el.childNodes].every((n) => n.nodeType === 3) ? el.textContent : null;

  // ---------- DOM: highlight boxes + shadow host ----------
  const mkBox = (color, fill) => {
    const b = document.createElement('div');
    b.style.cssText = `position:fixed;pointer-events:none;z-index:${Z};border:2px solid ${color};background:${fill};display:none;box-sizing:border-box;border-radius:2px`;
    document.documentElement.appendChild(b);
    return b;
  };
  const hl = mkBox('#3b82f6', 'rgba(59,130,246,.12)');
  const sel = mkBox('#f97316', 'transparent');
  const line = mkBox('#22c55e', '#22c55e');
  const tag = document.createElement('div');
  tag.style.cssText = `position:fixed;pointer-events:none;z-index:${Z + 1};background:#111;color:#fff;font:12px/1.4 ui-monospace,Consolas,monospace;padding:2px 6px;border-radius:4px;display:none;white-space:nowrap`;
  document.documentElement.appendChild(tag);

  const host = document.createElement('div');
  host.style.cssText = `position:fixed;z-index:${Z + 2};inset:auto`;
  document.documentElement.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });

  root.innerHTML = `
<style>
  :host { all: initial; }
  * { box-sizing: border-box; font-family: Inter, system-ui, sans-serif; }
  .fab { position: fixed; left: 16px; bottom: 16px; height: 40px; padding: 0 14px; border-radius: 20px; border: 0;
    background: #111; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,.25);
    display: flex; align-items: center; gap: 8px; }
  .fab.on { background: #3b82f6; }
  .fab .n { background: #f97316; border-radius: 10px; padding: 0 7px; font-size: 12px; line-height: 20px; }
  .menu { position: fixed; left: 16px; bottom: 64px; background: #fff; border-radius: 12px; padding: 6px; display: none;
    box-shadow: 0 8px 32px rgba(0,0,0,.2); min-width: 220px; }
  .menu.open { display: block; }
  .menu button { display: block; width: 100%; text-align: left; border: 0; background: none; padding: 8px 10px; border-radius: 8px;
    font-size: 13px; cursor: pointer; color: #111; }
  .menu button:hover { background: #f1f1f1; }
  .menu .hint { font-size: 11px; color: #888; padding: 4px 10px 6px; }
  .panel { position: fixed; top: 16px; right: 16px; width: 380px; max-height: calc(100vh - 32px); overflow: auto;
    background: #fff; color: #111; border-radius: 14px; box-shadow: 0 12px 48px rgba(0,0,0,.28); display: none; font-size: 13px; }
  .panel.left { right: auto; left: 16px; }
  .panel.open { display: block; }
  .hd { position: sticky; top: 0; background: #fff; padding: 12px 14px 10px; border-bottom: 1px solid #eee; z-index: 1; }
  .row { display: flex; align-items: center; gap: 6px; }
  .title { font-weight: 700; font-size: 14px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ib { border: 1px solid #ddd; background: #fff; border-radius: 8px; height: 28px; min-width: 28px; padding: 0 8px; cursor: pointer;
    font-size: 12px; color: #111; }
  .ib:hover { background: #f5f5f5; }
  .ib.primary { background: #111; color: #fff; border-color: #111; }
  .ib.primary:hover { background: #333; }
  .ib:disabled { opacity: .4; cursor: default; }
  .meta { font: 11px/1.5 ui-monospace, Consolas, monospace; color: #666; margin-top: 6px; word-break: break-all; }
  .meta b { color: #111; font-weight: 600; }
  .sec { padding: 10px 14px; border-bottom: 1px solid #f0f0f0; }
  .sec h4 { margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #888; font-weight: 600; }
  .prop { display: grid; grid-template-columns: 112px 1fr 22px; gap: 6px; align-items: center; margin-bottom: 4px; }
  .prop label { font: 12px ui-monospace, Consolas, monospace; color: #444; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .prop.changed label { color: #f97316; font-weight: 700; }
  input, textarea { width: 100%; border: 1px solid #ddd; border-radius: 6px; padding: 5px 7px; font: 12px ui-monospace, Consolas, monospace;
    color: #111; background: #fff; }
  input:focus, textarea:focus { outline: 2px solid #3b82f6; outline-offset: -1px; border-color: transparent; }
  .prop.changed input { border-color: #f97316; background: #fff7ed; }
  .x { border: 0; background: none; cursor: pointer; color: #aaa; font-size: 14px; padding: 0; }
  .x:hover { color: #111; }
  textarea { font-family: Inter, system-ui, sans-serif; font-size: 13px; min-height: 72px; resize: vertical; }
  .shot { margin-top: 8px; position: relative; }
  .shot img { max-width: 100%; border: 1px solid #eee; border-radius: 6px; display: block; }
  .shot .x { position: absolute; top: 4px; right: 4px; background: #fff; border-radius: 50%; width: 22px; height: 22px; }
  .ft { position: sticky; bottom: 0; background: #fff; padding: 10px 14px; display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid #eee; }
  .muted { color: #888; font-size: 12px; }
  .note { border: 1px solid #eee; border-radius: 10px; padding: 8px 10px; margin-bottom: 8px; }
  .note .c { margin: 4px 0; white-space: pre-wrap; }
  .note img { max-width: 100%; max-height: 120px; border-radius: 6px; margin-top: 4px; }
  .note .chg { font: 11px ui-monospace, Consolas, monospace; color: #555; }
  .ib.on { background: #111; color: #fff; border-color: #111; }
  .sec .row { flex-wrap: wrap; }
  details.sec summary { cursor: pointer; list-style: none; }
  details.sec summary::-webkit-details-marker { display: none; }
  details.sec summary h4 { display: inline; margin: 0; }
  details.sec summary h4::before { content: '▸ '; }
  details.sec[open] summary h4::before { content: '▾ '; }
  details.sec[open] summary { margin-bottom: 8px; }
  .prop.mini { grid-template-columns: 22px 1fr 18px; gap: 4px; margin: 0; }
  .prop.mini label { text-align: center; color: #888; }
  .prop.mini.nolabel { grid-template-columns: 1fr 18px; }
  .prop.mini.nolabel label { display: none; }
  .lay { display: flex; gap: 12px; margin-top: 10px; align-items: flex-start; }
  .lay-f { flex: 1; display: flex; flex-direction: column; gap: 6px; }
  .lay-f .prop.mini { grid-template-columns: 34px 1fr 18px; }
  .align { display: grid; grid-template-columns: repeat(3, 22px); grid-template-rows: repeat(3, 22px); gap: 2px;
    background: #f3f3f3; border-radius: 8px; padding: 4px; flex: none; }
  .cell { border: 0; background: none; cursor: pointer; border-radius: 4px; position: relative; padding: 0; }
  .cell::after { content: ''; position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; margin: -2px; border-radius: 50%; background: #c4c4c4; }
  .cell:hover { background: #e6e6e6; }
  .cell.on::after { background: #3b82f6; width: 12px; height: 4px; margin: -2px -6px; border-radius: 2px; }
  .align.col .cell.on::after { width: 12px; height: 4px; margin: -2px -6px; }
  .align:not(.col) .cell.on::after { width: 4px; height: 12px; margin: -6px -2px; }
  .pad { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 8px; margin-top: 10px; }
  .szrow { display: grid; grid-template-columns: 16px auto 1fr; gap: 6px; align-items: center; margin-bottom: 6px; }
  .ax { font-weight: 700; color: #888; font-size: 12px; }
  .seg { display: flex; }
  .seg .ib { border-radius: 0; margin-left: -1px; padding: 0 7px; }
  .seg .ib:first-child { border-radius: 8px 0 0 8px; margin-left: 0; }
  .seg .ib:last-child { border-radius: 0 8px 8px 0; }
  .toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); background: #111; color: #fff; padding: 8px 14px;
    border-radius: 8px; font-size: 13px; display: none; }
</style>
<button class="fab" title="Design notes (Alt+N — выбрать элемент)">✎ Notes <span class="n" hidden></span></button>
<div class="menu">
  <button data-act="pick">🎯 Выбрать элемент <span class="muted">Alt+N</span></button>
  <button data-act="page">📝 Заметка к экрану</button>
  <button data-act="list">📋 Сохранённые заметки</button>
  <button data-act="stopcap" hidden>⏹ Остановить захват вкладки</button>
  <div class="hint">Esc — отмена. Alt+колесо — уровень выше/ниже (при выборе и при перетаскивании).</div>
</div>
<div class="panel"></div>
<div class="toast"></div>`;

  const $ = (s) => root.querySelector(s);
  const fab = $('.fab'), menu = $('.menu'), panel = $('.panel'), toastEl = $('.toast');
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  function toast(msg) {
    toastEl.textContent = msg; toastEl.style.display = 'block';
    clearTimeout(toast.t); toast.t = setTimeout(() => (toastEl.style.display = 'none'), 2200);
  }

  // ---------- state ----------
  let picking = false, hovered = null, target = null;
  let draft = null; // { target|null, changes: Map(prop -> {from,to,orig:{v,p}}), comment, screenshot, text }
  let dock = 'right';
  let pickBase = null, pickLevel = 0;
  let moving = false, dropBase = null, dropLevel = 0, dropAt = null, lastXY = [0, 0];

  // ---------- open notes counter ----------
  async function refreshCount() {
    try {
      const notes = await (await fetch(API + '/notes')).json();
      const n = notes.filter((x) => x.status === 'open').length;
      const badge = $('.fab .n');
      badge.hidden = !n; badge.textContent = n;
      return notes;
    } catch { return []; }
  }

  // ---------- highlight helpers ----------
  function place(box, el) {
    if (!el || !el.isConnected) { box.style.display = 'none'; return; }
    const r = el.getBoundingClientRect();
    Object.assign(box.style, { display: 'block', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  }
  function placeTag(el) {
    if (!el) { tag.style.display = 'none'; return; }
    const r = el.getBoundingClientRect();
    const comp = vueChain(el)[0];
    tag.textContent = `${comp ? comp.name + ' · ' : ''}${shortLabel(el)} · ${Math.round(r.width)}×${Math.round(r.height)}`;
    tag.style.display = 'block';
    const top = r.top > 24 ? r.top - 22 : r.bottom + 4;
    tag.style.top = top + 'px';
    tag.style.left = Math.max(4, Math.min(r.left, innerWidth - tag.offsetWidth - 4)) + 'px';
  }
  function placeLine() {
    if (!moving || !dropAt) { line.style.display = 'none'; return; }
    const r = dropAt.anchor.getBoundingClientRect(), w = 3;
    const s = dropAt.row
      ? { left: (dropAt.pos === 'before' ? r.left : r.right) - w / 2, top: r.top, width: w, height: r.height }
      : { left: r.left, top: (dropAt.pos === 'before' ? r.top : r.bottom) - w / 2, width: r.width, height: w };
    Object.assign(line.style, { display: 'block', left: s.left + 'px', top: s.top + 'px', width: s.width + 'px', height: s.height + 'px' });
    const comp = vueChain(dropAt.anchor)[0];
    tag.textContent = `${dropAt.pos === 'before' ? 'перед' : 'после'} ${comp ? comp.name + ' · ' : ''}${shortLabel(dropAt.anchor)}`;
    tag.style.display = 'block';
    tag.style.top = Math.max(4, s.top - 24) + 'px';
    tag.style.left = Math.max(4, Math.min(s.left, innerWidth - tag.offsetWidth - 4)) + 'px';
  }
  (function loop() {
    if (picking) place(hl, hovered); else if (moving && dropAt) place(hl, dropAt.anchor); else hl.style.display = 'none';
    if (target) place(sel, target); else sel.style.display = 'none';
    if (moving) placeLine();
    else { line.style.display = 'none'; if (picking && hovered) placeTag(hovered); else if (target) placeTag(target); else tag.style.display = 'none'; }
    requestAnimationFrame(loop);
  })();

  // ---------- pick mode ----------
  function startPick() {
    closeMenu();
    if (nChanges() && !confirm('Есть несохранённые правки — сбросить их?')) return;
    discardDraft();
    picking = true; fab.classList.add('on');
    document.documentElement.style.cursor = 'crosshair';
  }
  function stopPick() {
    picking = false; hovered = null; pickBase = null; fab.classList.remove('on');
    document.documentElement.style.cursor = '';
  }
  // ---------- move mode: drop the picked element before/after another one (live DOM move, recorded in the note) ----------
  function startMove() {
    if (!draft?.target) return;
    moving = true; dropAt = null; fab.classList.add('on');
    document.documentElement.style.cursor = 'grabbing';
    toast('Наведите туда, куда переставить: зелёная линия — новое место. Alt+колесо — уровень выше/ниже, Esc — отмена');
  }
  function stopMove() {
    moving = false; dropAt = null; dropBase = null; fab.classList.remove('on');
    document.documentElement.style.cursor = '';
  }
  function flowIsRow(parent, anchor) {
    const cs = getComputedStyle(parent);
    if (cs.display.includes('flex')) return cs.flexDirection.startsWith('row');
    if (cs.display.includes('grid')) return cs.gridTemplateColumns.trim().split(/\s+/).length > 1;
    return getComputedStyle(anchor).display.startsWith('inline');
  }
  function computeDrop() {
    const t = draft?.target;
    dropAt = null;
    if (!t || !dropBase) return;
    let a = dropBase;
    for (let i = 0; i < dropLevel && a.parentElement && a.parentElement !== document.body; i++) a = a.parentElement;
    if (a === t || t.contains(a) || !a.parentElement || a === document.body || a === document.documentElement) return;
    const r = a.getBoundingClientRect();
    const row = flowIsRow(a.parentElement, a);
    const [x, y] = lastXY;
    const pos = row ? (x < r.left + r.width / 2 ? 'before' : 'after') : (y < r.top + r.height / 2 ? 'before' : 'after');
    dropAt = { anchor: a, pos, row };
  }
  const indexOf = (el) => (el.parentElement ? [...el.parentElement.children].indexOf(el) : -1);
  const describe = (el) => ({
    components: vueChain(el).slice(0, 3), selector: selectorOf(el), tag: el.tagName.toLowerCase(),
    classes: cleanClasses(el), text: (el.innerText || '').trim().slice(0, 60),
  });
  function doDrop(anchor, pos) {
    const t = draft.target;
    if (!draft.move) {
      draft.move = { origParent: t.parentNode, origNext: t.nextSibling, from: { parent: describe(t.parentElement), index: indexOf(t) } };
    }
    anchor.parentNode.insertBefore(t, pos === 'before' ? anchor : anchor.nextSibling);
    const m = draft.move;
    if (t.parentNode === m.origParent && t.nextSibling === m.origNext) { draft.move = null; return; }
    Object.assign(m, { position: pos, anchor: describe(anchor), sameParent: t.parentNode === m.origParent, toIndex: indexOf(t) });
  }
  function undoMove() {
    const m = draft?.move;
    if (!m) return;
    m.origParent.insertBefore(draft.target, m.origNext && m.origNext.parentNode === m.origParent ? m.origNext : null);
    draft.move = null;
  }

  // one capture-phase interceptor for pick + move, so the app never sees these clicks
  const busy = () => picking || moving;
  const swallow = (e) => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); };
  ['pointerdown', 'mousedown', 'mouseup', 'dblclick', 'contextmenu', 'dragstart'].forEach((type) =>
    window.addEventListener(type, (e) => { if (busy() && !isOurs(e.target)) swallow(e); }, true));
  // drop on pointerup: preventDefault on pointerdown suppresses the compat mouseup, pointerup always fires
  window.addEventListener('pointerup', (e) => {
    if (!busy() || isOurs(e.target)) return;
    swallow(e);
    if (moving && dropAt) { doDrop(dropAt.anchor, dropAt.pos); stopMove(); renderDraft(); }
  }, true);
  window.addEventListener('mousemove', (e) => {
    if (!busy()) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || isOurs(el)) return;
    // keep the Alt+wheel level while the pointer stays over the same base element
    if (picking && el !== pickBase) { pickBase = el; pickLevel = 0; hovered = el; }
    if (moving) {
      lastXY = [e.clientX, e.clientY];
      if (el !== dropBase) { dropBase = el; dropLevel = 0; }
      computeDrop();
    }
  }, true);
  window.addEventListener('wheel', (e) => {
    if (!busy() || !e.altKey) return;
    e.preventDefault();
    if (moving) { dropLevel = Math.max(0, dropLevel + (e.deltaY < 0 ? 1 : -1)); computeDrop(); return; }
    if (!pickBase) return;
    // up = parent, down = back toward the element under the pointer (same path)
    pickLevel = Math.max(0, pickLevel + (e.deltaY < 0 ? 1 : -1));
    let h = pickBase;
    for (let i = 0; i < pickLevel; i++) {
      if (!h.parentElement || h.parentElement === document.body) { pickLevel = i; break; }
      h = h.parentElement;
    }
    hovered = h;
  }, { capture: true, passive: false });
  window.addEventListener('click', (e) => {
    if (!busy() || isOurs(e.target)) return;
    swallow(e);
    if (!picking) return;
    const el = hovered || e.target;
    stopPick();
    openDraft(el);
  }, true);
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.code === 'KeyN') { e.preventDefault(); picking ? stopPick() : startPick(); return; }
    if (e.key === 'Escape') {
      if (moving) { stopMove(); e.stopPropagation(); }
      else if (picking) { stopPick(); e.stopPropagation(); }
      else if (menu.classList.contains('open')) closeMenu();
    }
  }, true);

  // ---------- menu ----------
  function closeMenu() { menu.classList.remove('open'); }
  fab.addEventListener('click', () => {
    if (picking) { stopPick(); return; }
    menu.classList.toggle('open');
    root.querySelector('[data-act=stopcap]').hidden = !capStream;
  });
  menu.addEventListener('click', (e) => {
    const act = e.target.closest('button')?.dataset.act;
    if (act === 'pick') startPick();
    if (act === 'page') { closeMenu(); discardDraft(); openDraft(null); }
    if (act === 'list') { closeMenu(); showList(); }
    if (act === 'stopcap') { closeMenu(); stopCapture(); toast('Захват вкладки остановлен'); }
  });

  // ---------- draft panel ----------
  function applyStyle(el, prop, value) {
    if (prop === 'text') { el.textContent = value; return; }
    if (value === '') el.style.removeProperty(prop); else el.style.setProperty(prop, value, 'important');
  }
  function restore(prop, c) {
    const el = draft.target;
    if (prop === 'text') { el.textContent = c.from; return; }
    if (c.orig.v) el.style.setProperty(prop, c.orig.v, c.orig.p); else el.style.removeProperty(prop);
  }
  const nChanges = () => (draft ? draft.changes.size + (draft.move ? 1 : 0) : 0);
  function discardDraft() {
    if (moving) stopMove();
    if (draft && draft.target) { for (const [prop, c] of draft.changes) restore(prop, c); undoMove(); }
    draft = null; target = null;
    panel.classList.remove('open');
  }
  function openDraft(el) {
    TOKENS = collectTokens();
    target = el;
    // rect is taken before any live tweak so the note keeps the original size/position
    draft = { target: el, rect: el ? el.getBoundingClientRect() : null, changes: new Map(), extra: [], comment: '', screenshot: null };
    renderDraft();
  }
  function setChange(prop, from, to) {
    const el = draft.target;
    if (!draft.changes.has(prop)) {
      const orig = prop === 'text' ? null : { v: el.style.getPropertyValue(prop), p: el.style.getPropertyPriority(prop) };
      draft.changes.set(prop, { from, to, orig });
    }
    const c = draft.changes.get(prop);
    if (to.trim() === '' || to.trim() === String(c.from).trim()) {
      restore(prop, c);
      draft.changes.delete(prop);
    } else {
      c.to = to.trim();
      applyStyle(el, prop, c.to);
      // equivalent spelling (0 vs 0px, 1 1 0% vs 1 1 0px, a token that resolves to the same value) is not a change
      const zero = (v) => String(v).trim().replace(/(^|[\s(,])0(px|%|em|rem)?(?=$|[\s),])/g, '$10');
      if (prop !== 'text' && zero(getComputedStyle(el).getPropertyValue(prop)) === zero(c.from)) {
        restore(prop, c);
        draft.changes.delete(prop);
      }
    }
  }
  function datalistFor(prop) {
    const id = 'dl-' + prop.replace(/[^a-z0-9-]/gi, '');
    if (!root.getElementById(id)) {
      const dl = document.createElement('datalist');
      dl.id = id;
      dl.innerHTML = tokensFor(prop).map((t) => `<option value="var(${esc(t.name)})">${esc(t.value.slice(0, 40))}</option>`).join('');
      root.appendChild(dl);
    }
    return id;
  }
  function propRow(prop, current, label = prop, cls = '') {
    const c = draft.changes.get(prop);
    const from = c ? c.from : current; // "from" is always the value before any tweak
    return `<div class="prop${cls}${c ? ' changed' : ''}" data-prop="${esc(prop)}">
      <label title="${esc(prop)}: ${esc(from)}">${esc(label)}</label>
      <input value="${esc(c ? c.to : current)}" data-from="${esc(from)}" list="${datalistFor(prop)}" spellcheck="false">
      <button class="x" title="Вернуть" data-reset>${c ? '↺' : ''}</button></div>`;
  }

  // ---------- Figma-like controls: auto layout + sizing, translated into plain CSS changes ----------
  function setProps(map) {
    const cs = getComputedStyle(draft.target);
    for (let [p, v] of Object.entries(map)) {
      const from = draft.changes.get(p)?.from ?? cs.getPropertyValue(p).trim();
      // justify-content: normal/start ≡ flex-start in flex — don't record a no-op change
      if (p === 'justify-content' && v === 'flex-start' && /^(normal|start|flex-start|flow-start)$/.test(from)) v = from;
      setChange(p, from, v);
    }
    renderDraft();
  }
  const norm = (v) => (/center/.test(v) ? 'center' : /end|right/.test(v) ? 'end' : /between|around|evenly/.test(v) ? 'between' : 'start');
  function layoutState(el) {
    const cs = getComputedStyle(el);
    const flex = cs.display.includes('flex');
    const dir = flex ? (cs.flexDirection.startsWith('column') ? 'col' : 'row') : cs.display.includes('grid') ? 'grid' : 'none';
    const main = norm(cs.justifyContent), cross = norm(cs.alignItems);
    return { cs, flex, dir, wrap: cs.flexWrap === 'wrap', between: main === 'between',
      x: dir === 'col' ? cross : main, y: dir === 'col' ? main : cross };
  }
  function parentState(el) {
    const p = el.parentElement, pcs = p ? getComputedStyle(p) : null;
    const flex = !!pcs && pcs.display.includes('flex');
    return { flex, dir: flex ? (pcs.flexDirection.startsWith('column') ? 'col' : 'row') : 'none', alignItems: pcs?.alignItems || '' };
  }
  function sizeMode(el, axis) {
    if (draft.size?.[axis]) return draft.size[axis];
    const cs = getComputedStyle(el), ps = parentState(el);
    const along = (axis === 'w' && ps.dir === 'row') || (axis === 'h' && ps.dir === 'col');
    if (ps.flex && along) return parseFloat(cs.flexGrow) > 0 ? 'fill' : '';
    if (ps.flex) return (cs.alignSelf === 'stretch' || (cs.alignSelf === 'auto' && /normal|stretch/.test(ps.alignItems))) ? 'fill' : '';
    if (axis === 'w' && cs.display === 'block') return 'fill';
    return '';
  }
  function applySize(axis, mode) {
    const el = draft.target, ps = parentState(el), r = el.getBoundingClientRect();
    const dim = axis === 'w' ? 'width' : 'height', minDim = axis === 'w' ? 'min-width' : 'min-height';
    const along = ps.flex && ((axis === 'w' && ps.dir === 'row') || (axis === 'h' && ps.dir === 'col'));
    let map;
    if (mode === 'fill') map = along ? { flex: '1 1 0%', [minDim]: '0' } : ps.flex ? { 'align-self': 'stretch', [dim]: 'auto' } : { [dim]: '100%' };
    else if (mode === 'hug') map = along ? { flex: '0 0 auto', [dim]: 'fit-content' } : ps.flex ? { 'align-self': 'flex-start', [dim]: 'fit-content' } : { [dim]: 'fit-content' };
    else map = { [dim]: Math.round(axis === 'w' ? r.width : r.height) + 'px', ...(along ? { flex: '0 0 auto' } : {}) };
    // props the previous mode set but this one doesn't — back to the original
    for (const p of [dim, minDim, 'flex', 'align-self']) if (!(p in map) && draft.changes.has(p)) map[p] = draft.changes.get(p).from;
    draft.size = { ...(draft.size || {}), [axis]: mode };
    setProps(map);
  }
  function layoutSection(el) {
    const s = layoutState(el);
    const container = el.children.length > 0 || s.flex || s.dir === 'grid';
    if (!container) return '';
    const btn = (attr, on, label, title) => `<button class="ib${on ? ' on' : ''}" ${attr} title="${title}">${label}</button>`;
    let html = `<div class="sec"><h4>Раскладка${s.dir === 'grid' ? ' <span class="muted">(сейчас grid)</span>' : ''}</h4><div class="row">
      ${btn('data-layout="none"', s.dir === 'none', '✕ Нет', 'Без auto layout (display: block)')}
      ${btn('data-layout="col"', s.dir === 'col', '↓ Вертикально', 'flex-direction: column')}
      ${btn('data-layout="row"', s.dir === 'row', '→ Горизонтально', 'flex-direction: row')}
      ${s.dir === 'row' ? btn('data-wrap', s.wrap, '↩ Перенос', 'flex-wrap: wrap') : ''}</div>`;
    if (s.flex) {
      const cells = [];
      for (const y of ['start', 'center', 'end']) for (const x of ['start', 'center', 'end']) {
        const on = s.between ? (s.dir === 'row' ? y === s.y : x === s.x) : x === s.x && y === s.y;
        cells.push(`<button class="cell${on ? ' on' : ''}" data-align="${x},${y}" title="${x} / ${y}"></button>`);
      }
      html += `<div class="lay">
        <div class="align${s.dir === 'col' ? ' col' : ''}${s.between ? ' sb' : ''}">${cells.join('')}</div>
        <div class="lay-f">
          ${btn('data-sb', s.between, '⇹ Space between', 'justify-content: space-between')}
          ${propRow('gap', s.cs.gap, 'gap', ' mini')}
        </div></div>`;
    }
    html += `<div class="pad">
      ${propRow('padding-top', s.cs.paddingTop, '↑', ' mini')}${propRow('padding-right', s.cs.paddingRight, '→', ' mini')}
      ${propRow('padding-bottom', s.cs.paddingBottom, '↓', ' mini')}${propRow('padding-left', s.cs.paddingLeft, '←', ' mini')}</div></div>`;
    return html;
  }
  function sizeSection(el) {
    const cs = getComputedStyle(el);
    const seg = (axis) => ['hug', 'fill', 'fixed'].map((m) =>
      `<button class="ib${sizeMode(el, axis) === m ? ' on' : ''}" data-size="${axis}:${m}">${{ hug: 'Hug', fill: 'Fill', fixed: 'Fixed' }[m]}</button>`).join('');
    return `<div class="sec"><h4>Размер</h4>
      <div class="szrow"><span class="ax">W</span><div class="seg">${seg('w')}</div>${propRow('width', cs.width, '', ' mini nolabel')}</div>
      <div class="szrow"><span class="ax">H</span><div class="seg">${seg('h')}</div>${propRow('height', cs.height, '', ' mini nolabel')}</div></div>`;
  }
  function renderDraft() {
    const el = draft.target;
    panel.dataset.mode = '';
    panel.classList.toggle('left', dock === 'left');
    let head, body = '';
    if (el) {
      const chain = vueChain(el);
      const r = el.getBoundingClientRect();
      head = `<div class="row"><div class="title">${esc(chain[0]?.name || shortLabel(el))}</div>
        <button class="ib" data-nav="up" title="Родитель">↑</button>
        <button class="ib" data-nav="down" title="Первый ребёнок" ${el.firstElementChild ? '' : 'disabled'}>↓</button>
        <button class="ib" data-move title="Перетащить в другое место">✥</button>
        <button class="ib" data-dock title="Переставить панель">⇆</button>
        <button class="ib" data-close title="Закрыть">✕</button></div>
        <div class="meta"><b>${esc(shortLabel(el))}</b> · ${Math.round(r.width)}×${Math.round(r.height)}<br>
        ${chain.map((c) => esc(c.name)).join(' ‹ ') || '—'}<br>${esc(chain[0]?.file || '')}</div>`;
      const m = draft.move;
      body += `<div class="sec"><h4>Положение</h4><div class="row">
        <button class="ib" data-order="prev" ${el.previousElementSibling ? '' : 'disabled'} title="Поменять местами с предыдущим соседом">↑ Раньше</button>
        <button class="ib" data-order="next" ${el.nextElementSibling ? '' : 'disabled'} title="Поменять местами со следующим соседом">↓ Позже</button>
        <button class="ib" data-move>✥ Перетащить</button>
        ${m ? '<button class="x" data-unmove title="Вернуть на место" style="margin-left:auto">↺</button>' : ''}</div>
        ${m ? `<div class="meta" style="color:#f97316">${m.position === 'before' ? 'перед' : 'после'} ${esc(m.anchor.components[0]?.name || '')} · ${esc(m.anchor.tag + (m.anchor.classes[0] ? '.' + m.anchor.classes[0] : ''))}${m.anchor.text ? ' «' + esc(m.anchor.text.slice(0, 30)) + '»' : ''}${m.sameParent ? '' : ' (в другом контейнере)'}</div>` : ''}</div>`;
      body += layoutSection(el) + sizeSection(el);
      const cs = getComputedStyle(el);
      // width/height/padding/gap live in the visual sections above — not repeated here
      const shown = PROPS.map(([p]) => p).filter((p) => !['width', 'height', 'padding', 'gap'].includes(p));
      body += `<details class="sec" ${draft.cssOpen ? 'open' : ''}><summary><h4>Стили CSS</h4></summary>
        ${shown.map((p) => propRow(p, cs.getPropertyValue(p).trim())).join('')}
        ${draft.extra.map((p) => propRow(p, cs.getPropertyValue(p).trim())).join('')}
        <div class="row" style="margin-top:6px"><input placeholder="+ свойство, напр. align-items" data-addprop spellcheck="false"></div></details>`;
      const text = ownText(el);
      if (text !== null && text.trim()) {
        const c = draft.changes.get('text');
        body += `<div class="sec"><h4>Текст</h4><div class="prop${c ? ' changed' : ''}" data-prop="text" style="grid-template-columns:1fr 22px">
          <input value="${esc(c ? c.to : text)}" data-from="${esc(text)}"><button class="x" data-reset>${c ? '↺' : ''}</button></div></div>`;
      }
    } else {
      head = `<div class="row"><div class="title">Заметка к экрану</div>
        <button class="ib" data-dock title="Переставить панель">⇆</button><button class="ib" data-close title="Закрыть">✕</button></div>
        <div class="meta">${esc(location.hash || '/')} · ${innerWidth}×${innerHeight}</div>`;
    }
    body += `<div class="sec"><h4>Комментарий для Claude</h4>
      <textarea data-comment placeholder="Что поменять и почему. Можно вставить картинку Ctrl+V.">${esc(draft.comment)}</textarea>
      <div class="row" style="margin-top:8px">
        ${el ? '<button class="ib" data-shot="el">📷 Элемент</button>' : ''}
        <button class="ib" data-shot="vp">📷 Экран</button>
        <span class="muted">${draft.screenshot ? '' : 'или Ctrl+V'}</span></div>
      ${draft.screenshot ? `<div class="shot"><img src="${draft.screenshot}"><button class="x" data-unshot title="Убрать">✕</button></div>` : ''}
    </div>`;
    const n = nChanges();
    panel.innerHTML = `<div class="hd">${head}</div>${body}
      <div class="ft"><span class="muted" style="margin-right:auto;align-self:center">${n ? `изменений: ${n}` : ''}</span>
      <button class="ib" data-close>Отмена</button><button class="ib primary" data-save>Сохранить</button></div>`;
    panel.classList.add('open');
  }

  panel.addEventListener('input', (e) => {
    const t = e.target;
    if (t.matches('[data-comment]')) { draft.comment = t.value; return; }
    const row = t.closest('.prop');
    if (!row || !draft?.target) return;
    const prop = row.dataset.prop;
    setChange(prop, t.dataset.from, t.value);
    const changed = draft.changes.has(prop);
    row.classList.toggle('changed', changed);
    row.querySelector('[data-reset]').textContent = changed ? '↺' : '';
    const cnt = panel.querySelector('.ft .muted');
    cnt.textContent = nChanges() ? `изменений: ${nChanges()}` : '';
  });
  panel.addEventListener('keydown', (e) => {
    if (e.target.matches('[data-addprop]') && e.key === 'Enter') {
      const p = e.target.value.trim().toLowerCase();
      if (p && !PROPS.some(([x]) => x === p) && !draft.extra.includes(p)) draft.extra.push(p);
      renderDraft();
      panel.querySelector(`.prop[data-prop="${CSS.escape(p)}"] input`)?.focus();
    }
    // keep app hotkeys (and Escape handlers of modals) away from typing in the panel
    e.stopPropagation();
  });
  panel.addEventListener('toggle', (e) => { if (draft && e.target.matches('details')) draft.cssOpen = e.target.open; }, true);
  panel.addEventListener('paste', (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'));
    if (!item) return;
    e.preventDefault();
    const fr = new FileReader();
    fr.onload = () => { draft.screenshot = fr.result; renderDraft(); };
    fr.readAsDataURL(item.getAsFile());
  });
  panel.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-close')) {
      if (panel.dataset.mode === 'list') { panel.classList.remove('open'); panel.dataset.mode = ''; return; }
      discardDraft(); return;
    }
    if (b.hasAttribute('data-dock')) { dock = dock === 'right' ? 'left' : 'right'; panel.classList.toggle('left', dock === 'left'); return; }
    if (b.hasAttribute('data-reset')) {
      const row = b.closest('.prop'); const inp = row.querySelector('input');
      inp.value = inp.dataset.from; inp.dispatchEvent(new Event('input', { bubbles: true })); return;
    }
    if (b.dataset.nav) {
      const el = draft.target;
      const next = b.dataset.nav === 'up' ? el.parentElement : el.firstElementChild;
      if (!next || next === document.documentElement) return;
      if (nChanges() && !confirm('Сбросить правки у текущего элемента и перейти?')) return;
      const keep = draft.comment, shot = draft.screenshot;
      discardDraft(); openDraft(next); draft.comment = keep; draft.screenshot = shot; renderDraft();
      return;
    }
    if (b.dataset.layout) {
      const s = layoutState(draft.target), mode = b.dataset.layout;
      if (mode === 'none') {
        const map = { display: 'block' };
        for (const p of ['flex-direction', 'flex-wrap', 'justify-content', 'align-items']) if (draft.changes.has(p)) map[p] = draft.changes.get(p).from;
        setProps(map);
      } else {
        setProps({ display: s.cs.display.startsWith('inline') ? 'inline-flex' : 'flex', 'flex-direction': mode === 'col' ? 'column' : 'row' });
      }
      return;
    }
    if (b.hasAttribute('data-wrap')) { setProps({ 'flex-wrap': layoutState(draft.target).wrap ? 'nowrap' : 'wrap' }); return; }
    if (b.hasAttribute('data-sb')) {
      setProps({ 'justify-content': layoutState(draft.target).between ? 'flex-start' : 'space-between' });
      return;
    }
    if (b.dataset.align) {
      const s = layoutState(draft.target), [x, y] = b.dataset.align.split(',');
      const css = (v) => ({ start: 'flex-start', center: 'center', end: 'flex-end' })[v];
      const main = s.dir === 'col' ? y : x, cross = s.dir === 'col' ? x : y;
      setProps(s.between ? { 'align-items': css(cross) } : { 'justify-content': css(main), 'align-items': css(cross) });
      return;
    }
    if (b.dataset.size) { const [axis, mode] = b.dataset.size.split(':'); applySize(axis, mode); return; }
    if (b.hasAttribute('data-move')) { moving ? stopMove() : startMove(); return; }
    if (b.hasAttribute('data-unmove')) { undoMove(); renderDraft(); return; }
    if (b.dataset.order) {
      const el = draft.target;
      const sib = b.dataset.order === 'prev' ? el.previousElementSibling : el.nextElementSibling;
      if (sib) { doDrop(sib, b.dataset.order === 'prev' ? 'before' : 'after'); renderDraft(); }
      return;
    }
    if (b.dataset.shot) { await takeShot(b.dataset.shot); return; }
    if (b.hasAttribute('data-unshot')) { draft.screenshot = null; renderDraft(); return; }
    if (b.hasAttribute('data-save')) { await save(); return; }
    if (b.dataset.del) {
      if (!confirm('Удалить заметку?')) return;
      await fetch(API + '/notes/' + b.dataset.del, { method: 'DELETE' });
      showList(); return;
    }
  });

  // ---------- screenshots (tab capture, permission asked once per page load) ----------
  let capStream = null, capVideo = null;
  async function ensureCapture() {
    if (capStream && capStream.active) return;
    capStream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: 'browser', frameRate: 5 }, audio: false,
      preferCurrentTab: true, selfBrowserSurface: 'include', surfaceSwitching: 'exclude',
    });
    capStream.getVideoTracks()[0].addEventListener('ended', () => { capStream = null; });
    capVideo = document.createElement('video');
    capVideo.muted = true; capVideo.srcObject = capStream;
    await capVideo.play();
    await new Promise((r) => setTimeout(r, 400)); // Chrome adds the "sharing" bar — let the layout settle
  }
  function stopCapture() {
    capStream?.getTracks().forEach((t) => t.stop());
    capStream = null;
  }
  const frames = (n) => new Promise((r) => { const f = () => (--n ? requestAnimationFrame(f) : r()); requestAnimationFrame(f); });
  async function takeShot(kind) {
    try { await ensureCapture(); } catch { toast('Захват отменён — можно вставить скриншот через Ctrl+V'); return; }
    const el = draft.target;
    if (kind === 'el' && el) {
      const r0 = el.getBoundingClientRect();
      if (r0.bottom < 0 || r0.top > innerHeight) el.scrollIntoView({ block: 'center' });
    }
    host.style.visibility = 'hidden'; sel.style.visibility = 'hidden'; tag.style.visibility = 'hidden';
    await frames(3); await new Promise((r) => setTimeout(r, 250));
    const vw = capVideo.videoWidth, vh = capVideo.videoHeight;
    const k = vw / innerWidth;
    let sx = 0, sy = 0, sw = innerWidth, sh = innerHeight;
    if (kind === 'el' && el) {
      const r = el.getBoundingClientRect(), pad = 24;
      sx = Math.max(0, r.left - pad); sy = Math.max(0, r.top - pad);
      sw = Math.min(innerWidth, r.right + pad) - sx; sh = Math.min(innerHeight, r.bottom + pad) - sy;
    }
    const c = document.createElement('canvas');
    c.width = Math.min(Math.round(sw * k), vw); c.height = Math.min(Math.round(sh * k), vh);
    c.getContext('2d').drawImage(capVideo, sx * k, sy * k, c.width, c.height, 0, 0, c.width, c.height);
    host.style.visibility = ''; sel.style.visibility = ''; tag.style.visibility = '';
    draft.screenshot = c.toDataURL('image/png');
    renderDraft();
  }

  // ---------- save ----------
  async function save() {
    if (!draft) return;
    const el = draft.target;
    if (!nChanges() && !draft.comment.trim() && !draft.screenshot) { toast('Пустая заметка — нечего сохранять'); return; }
    const r = draft.rect;
    const note = {
      createdAt: new Date().toISOString(),
      url: location.href,
      route: location.hash.replace(/^#/, '') || '/',
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
      target: el ? {
        components: vueChain(el),
        selector: selectorOf(el),
        tag: el.tagName.toLowerCase(),
        classes: cleanClasses(el),
        scopeId: scopeId(el),
        text: (el.innerText || '').trim().slice(0, 80),
        rect: { x: Math.round(r.left), y: Math.round(r.top + scrollY), width: Math.round(r.width), height: Math.round(r.height) },
      } : null,
      changes: [...draft.changes].map(([property, c]) => ({ property, from: c.from, to: c.to })),
      // move: element was dragged to sit before/after `anchor` (from.parent/index — where it was)
      move: draft.move ? {
        position: draft.move.position, anchor: draft.move.anchor, sameParent: draft.move.sameParent,
        from: draft.move.from, toIndex: draft.move.toIndex,
      } : null,
      comment: draft.comment.trim(),
      screenshot: draft.screenshot,
    };
    try {
      const res = await fetch(API + '/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(note) });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) { toast('Не сохранилось: ' + err.message); return; }
    // keep the live tweaks on the page (until reload) — only forget the draft
    draft = null; target = null; panel.classList.remove('open');
    refreshCount();
    toast('Заметка сохранена ✓');
  }

  // ---------- list ----------
  async function showList() {
    discardDraft();
    const notes = await refreshCount();
    const open = notes.filter((n) => n.status === 'open').reverse();
    const done = notes.filter((n) => n.status === 'done').length;
    panel.dataset.mode = 'list';
    panel.classList.toggle('left', dock === 'left');
    panel.innerHTML = `<div class="hd"><div class="row"><div class="title">Заметки · открытых ${open.length}</div>
      <button class="ib" data-dock>⇆</button><button class="ib" data-close>✕</button></div>
      <div class="meta">Скажите Claude «внеси правки из заметок».${done ? ` Выполнено: ${done}.` : ''}</div></div>
      <div class="sec">${open.length ? open.map((n) => `<div class="note">
        <div class="row"><b style="flex:1">${esc(n.target?.components?.[0]?.name || n.target?.tag || 'Экран')}</b>
        <button class="ib" data-del="${esc(n.id)}" title="Удалить">🗑</button></div>
        <div class="muted">${esc(n.route)} · ${n.viewport?.width}px</div>
        ${n.changes?.length ? `<div class="chg">${n.changes.map((c) => `${esc(c.property)}: ${esc(c.from)} → <b>${esc(c.to)}</b>`).join('<br>')}</div>` : ''}
        ${n.move ? `<div class="chg">✥ ${n.move.position === 'before' ? 'перед' : 'после'} <b>${esc(n.move.anchor.components?.[0]?.name || n.move.anchor.tag)}</b>${n.move.anchor.text ? ' «' + esc(n.move.anchor.text.slice(0, 30)) + '»' : ''}</div>` : ''}
        ${n.comment ? `<div class="c">${esc(n.comment)}</div>` : ''}
        ${n.screenshot ? `<img src="${API}/shots/${esc(n.screenshot)}">` : ''}</div>`).join('') : '<div class="muted">Открытых заметок нет.</div>'}</div>`;
    panel.classList.add('open');
  }
  refreshCount();
})();
