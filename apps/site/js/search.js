/**
 * search.js - Global site search (Ctrl+K)
 */
(function () {
  'use strict';

  /* ===== State ===== */
  let index = null;
  let modal = null;
  let isOpen = false;
  let selIdx = -1;

  /* ===== Guanxiang static index ===== */
  const GX = [
    { id: 'fangwei', t: '从方位说起', d: '八卦与方位——坐北朝南的易学渊源', k: '方位 东南西北 先天八卦 后天八卦 文王 风水 朝向' },
    { id: 'mingzi', t: '从名字说起', d: '姓名中的易学——汉字笔画与阴阳', k: '名字 姓名 五格 笔画 阴阳 汉字' },
    { id: 'shijian', t: '从时间说起', d: '十二时辰与地支——古人的计时智慧', k: '时间 时辰 地支 子丑寅卯 十二' },
    { id: 'yanse', t: '从颜色说起', d: '五行与色彩——青赤黄白黑的文化密码', k: '颜色 色彩 五行 青赤黄白黑 木火土金水' },
    { id: 'shuzi', t: '从数字说起', d: '河图洛书与数理——数字背后的宇宙观', k: '数字 河图 洛书 九五至尊 阴阳 奇偶' },
    { id: 'jieqi', t: '从节气说起', d: '二十四节气与消息卦', k: '节气 二十四节气 消息卦 冬至 立春 复卦 泰卦' },
    { id: 'shenti', t: '从身体说起', d: '五行与中医——五脏的相生相克', k: '身体 中医 五脏 相生相克 肝心脾肺肾' },
    { id: 'jiating', t: '从家庭说起', d: '八卦与家庭——乾父坤母六子卦', k: '家庭 乾父 坤母 六子卦 长男 长女' },
  ];

  /* ===== Load search index ===== */
  async function loadIndex() {
    if (index) return;
    const [hex, know] = await Promise.all([
      fetch('/data/hexagrams.json').then(r => r.json()),
      fetch('/data/knowledge.json').then(r => r.json()),
    ]);
    index = { hex, know };
  }

  /* ===== Search ===== */
  function query(q) {
    if (!index || !q.trim()) return [];
    var s = q.trim().toLowerCase();
    var out = [];

    index.hex.forEach(function (h) {
      var hay = [h.name, h.pinyin, h.guaci_trans || '', h.xiang_trans || '', String(h.id)].join(' ').toLowerCase();
      if (hay.includes(s)) {
        out.push({ cat: '卦象', title: '第' + h.id + '卦 \xB7 ' + h.name, desc: h.guaci_trans || h.guaci || '', url: '/hexagrams.html?hex=' + h.id });
      }
    });

    index.know.forEach(function (a) {
      var hay = [a.title, a.subtitle || '', a.summary || ''].concat(a.sections.map(function (s) { return s.heading; })).join(' ').toLowerCase();
      if (hay.includes(s)) {
        out.push({ cat: '读易', title: a.title, desc: a.subtitle || a.summary || '', url: '/learn.html#' + a.id });
      }
    });

    GX.forEach(function (g) {
      var hay = [g.t, g.d, g.k].join(' ').toLowerCase();
      if (hay.includes(s)) {
        out.push({ cat: '观象', title: g.t, desc: g.d, url: '/guanxiang.html#' + g.id });
      }
    });

    return out.slice(0, 20);
  }

  /* ===== Inject CSS ===== */
  function injectCSS() {
    var st = document.createElement('style');
    st.textContent =
      '.srch-ov{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);display:flex;justify-content:center;padding-top:min(18vh,140px);opacity:0;transition:opacity .2s;pointer-events:none;}' +
      '.srch-ov.open{opacity:1;pointer-events:auto;}' +
      '.srch-box{width:min(520px,90vw);max-height:68vh;background:var(--card-bg,#fff);border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.25);display:flex;flex-direction:column;overflow:hidden;align-self:flex-start;}' +
      '.srch-head{display:flex;align-items:center;gap:10px;padding:16px 20px;border-bottom:1px solid var(--border,#e5e0d8);}' +
      '.srch-head svg{width:18px;height:18px;flex-shrink:0;color:var(--muted,#999);}' +
      '.srch-inp{flex:1;border:none;outline:none;background:transparent;font-size:16px;color:var(--ink,#2c2420);font-family:"Noto Serif SC",serif;}' +
      '.srch-inp::placeholder{color:var(--faint,#bbb);}' +
      '.srch-esc{font-size:10px;color:var(--faint,#bbb);border:1px solid var(--border,#ddd);border-radius:4px;padding:2px 6px;flex-shrink:0;}' +
      '.srch-body{overflow-y:auto;padding:6px 0;}' +
      '.srch-empty{padding:32px 20px;text-align:center;color:var(--muted,#999);font-size:13px;}' +
      '.srch-item{display:flex;align-items:center;gap:12px;padding:10px 20px;cursor:pointer;text-decoration:none;color:inherit;transition:background .12s;}' +
      '.srch-item:hover,.srch-item.sel{background:var(--hover-bg,rgba(0,0,0,.04));}' +
      '.srch-tag{font-size:10px;padding:2px 8px;border-radius:4px;background:var(--tag-bg,#f0ebe4);color:var(--muted,#888);flex-shrink:0;letter-spacing:.06em;}' +
      '.srch-it{flex:1;min-width:0;}' +
      '.srch-tt{font-size:14px;font-weight:500;color:var(--ink,#2c2420);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '.srch-ds{font-size:12px;color:var(--muted,#999);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '.srch-ar{color:var(--faint,#ccc);flex-shrink:0;}';
    document.head.appendChild(st);
  }

  /* ===== Build modal ===== */
  function build() {
    if (modal) return;
    injectCSS();
    modal = document.createElement('div');
    modal.className = 'srch-ov';
    modal.innerHTML =
      '<div class="srch-box">' +
        '<div class="srch-head">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          '<input class="srch-inp" placeholder="搜索卦象、文章..." autocomplete="off"/>' +
          '<span class="srch-esc">ESC</span>' +
        '</div>' +
        '<div class="srch-body"></div>' +
      '</div>';

    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });

    var inp = modal.querySelector('.srch-inp');
    var timer;
    inp.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { render(inp.value); }, 60);
    });
    inp.addEventListener('keydown', onKey);
    document.body.appendChild(modal);
  }

  function esc(s) { var d = document.createElement('span'); d.textContent = s; return d.innerHTML; }

  function render(q) {
    var box = modal.querySelector('.srch-body');
    var res = query(q);
    selIdx = -1;

    if (!q.trim()) { box.innerHTML = '<div class="srch-empty">输入关键词搜索全站内容</div>'; return; }
    if (!res.length) { box.innerHTML = '<div class="srch-empty">未找到相关内容</div>'; return; }

    box.innerHTML = res.map(function (r, i) {
      return '<a class="srch-item" href="' + r.url + '" data-i="' + i + '">' +
        '<span class="srch-tag">' + r.cat + '</span>' +
        '<div class="srch-it"><div class="srch-tt">' + esc(r.title) + '</div>' +
        (r.desc ? '<div class="srch-ds">' + esc(r.desc) + '</div>' : '') +
        '</div><span class="srch-ar">→</span></a>';
    }).join('');
  }

  function onKey(e) {
    var items = modal.querySelectorAll('.srch-item');
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); selIdx = Math.min(selIdx + 1, items.length - 1); hilite(items); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selIdx = Math.max(selIdx - 1, -1); hilite(items); }
    else if (e.key === 'Enter' && selIdx >= 0 && items[selIdx]) { e.preventDefault(); items[selIdx].click(); }
  }

  function hilite(items) {
    items.forEach(function (el, i) { el.classList.toggle('sel', i === selIdx); });
    if (selIdx >= 0 && items[selIdx]) items[selIdx].scrollIntoView({ block: 'nearest' });
  }

  /* ===== Open / Close ===== */
  async function open() {
    if (isOpen) return;
    isOpen = true;
    build();
    await loadIndex();
    modal.classList.add('open');
    var inp = modal.querySelector('.srch-inp');
    inp.value = '';
    render('');
    requestAnimationFrame(function () { inp.focus(); });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    if (modal) modal.classList.remove('open');
  }

  /* ===== Ctrl+K ===== */
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      isOpen ? close() : open();
    }
  });

  window.SiteSearch = { open: open, close: close, toggle: function () { isOpen ? close() : open(); } };
})();
