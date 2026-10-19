/**
 * site/js/like.js — 文章"认可"按钮前端
 *
 * 约定：页面里放
 *   <section class="endorse" data-like data-like-slug="learn/bagua">…</section>
 * 本脚本自动：拉取计数 → 渲染 → 点击 +1（本地 localStorage 记已点）。
 * 若接口不可用（KV 未绑定 / 网络失败），整个按钮区隐藏，不展示坏掉的 UI。
 */
(function () {
  'use strict';

  var STYLE_ID = 'yg-like-style';
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var css =
      '.endorse{margin:28px auto 0;max-width:720px;text-align:center;}' +
      '.endorse-btn{display:inline-flex;align-items:center;gap:8px;' +
      'padding:10px 22px;border:1px solid var(--border,#e5e0d5);border-radius:999px;' +
      'background:var(--card,#fff);color:var(--text,#333);font-size:15px;cursor:pointer;' +
      'transition:transform .15s ease,border-color .15s ease;}' +
      '.endorse-btn:hover{transform:translateY(-1px);border-color:var(--vermilion,#c8401f);}' +
      '.endorse-btn .heart{color:var(--vermilion,#c8401f);font-size:17px;line-height:1;}' +
      '.endorse-btn .count{color:var(--faint,#999);font-variant-numeric:tabular-nums;}' +
      '.endorse-btn[disabled]{cursor:default;opacity:.75;transform:none;}' +
      '.endorse-btn[disabled] .heart{animation:pop .35s ease;}' +
      '@keyframes pop{0%{transform:scale(.6);}55%{transform:scale(1.35);}100%{transform:scale(1);}}';
    var el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = css;
    document.head.appendChild(el);
  }

  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      localStorage.setItem(k, v);
    } catch (e) { return null; }
  }

  function api(slug, method) {
    return fetch('/api/like' + (method === 'GET' ? '?slug=' + encodeURIComponent(slug) : ''), {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'POST' ? JSON.stringify({ slug: slug }) : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    });
  }

  function mount(box) {
    var slug = box.getAttribute('data-like-slug') || '';
    if (!slug) { box.style.display = 'none'; return; }
    var btn = box.querySelector('.endorse-btn');
    if (!btn) { box.style.display = 'none'; return; }
    var countEl = btn.querySelector('.count');
    var labelEl = btn.querySelector('.label');
    var key = 'yg_like_' + slug;

    function render(count, liked) {
      if (countEl) countEl.textContent = typeof count === 'number' ? count : '–';
      btn.disabled = !!liked;
      btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
      if (labelEl) labelEl.textContent = liked ? '已认可' : '认可';
    }

    if (store(key)) render(undefined, true); // 先按本地状态画，等接口回数再补数字
    api(slug, 'GET').then(function (d) {
      render(d.count, !!store(key));
    }).catch(function () {
      box.style.display = 'none'; // 接口未就绪就不展示
    });

    btn.addEventListener('click', function () {
      if (store(key)) return;
      btn.disabled = true;
      api(slug, 'POST').then(function (d) {
        store(key, '1');
        render(d.count, true);
      }).catch(function () {
        btn.disabled = false; // 失败允许重试
      });
    });
  }

  ensureStyle();
  var boxes = document.querySelectorAll('[data-like]');
  for (var i = 0; i < boxes.length; i++) mount(boxes[i]);

  // 全站累计：在 [data-like-total] 内渲染 __total
  var totals = document.querySelectorAll('[data-like-total]');
  for (var j = 0; j < totals.length; j++) (function (el) {
    var target = el.querySelector('.total-count') || el;
    api('__total', 'GET').then(function (d) {
      target.textContent = d.count;
    }).catch(function () { /* 保持占位，不打断页面 */ });
  })(totals);
})();
