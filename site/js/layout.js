/**
 * layout.js - Shared navigation and footer component
 *
 * All pages include this script to get a unified top-nav and site-footer.
 * Each page provides:
 *   <nav class="top-nav" id="top-nav"></nav>    (auto-filled)
 *   <footer class="site-footer" id="site-footer"></footer>  (auto-filled)
 *
 * Page-specific options via data attributes on <body>:
 *   data-page="index|hexagram|learn"   - controls nav-left links
 */
(function () {
  'use strict';

  /* ===== SVG constants ===== */
  const LOGO_SVG = `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="84" stroke="#5c3a30" stroke-width="5" fill="none"/>
    <line x1="100" y1="48" x2="100" y2="152" stroke="#2c2420" stroke-width="18" stroke-linecap="round"/>
    <line x1="48" y1="48" x2="100" y2="100" stroke="#2c2420" stroke-width="18" stroke-linecap="round"/>
    <line x1="152" y1="48" x2="152" y2="82" stroke="#c0392b" stroke-width="18" stroke-linecap="round"/>
    <line x1="152" y1="118" x2="152" y2="152" stroke="#c0392b" stroke-width="18" stroke-linecap="round"/>
  </svg>`;

  const ICON_ADMIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';

  const ICON_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

  const ICON_USER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

  const ICON_HISTORY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

  const ICON_NOTEPAD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';

  /* ===== Build nav-left links based on page type ===== */
  function buildNavLeft(page) {
    switch (page) {
      case 'hexagram':
        return '<a class="nav-back" href="/">首页</a>';
      case 'learn':
        return '<a class="nav-home" href="/">首页</a><a class="nav-home" href="/#hexagrams">六十四卦</a>';
      case 'index':
      default:
        return '<a class="nav-home" href="#hexagrams">六十四卦</a><a class="nav-home" href="#learn">读易</a>';
    }
  }

  /* ===== Render top-nav ===== */
  function renderNav() {
    const nav = document.getElementById('top-nav');
    if (!nav) return;

    const page = document.body.dataset.page || 'index';

    nav.innerHTML = `
      <div class="nav-left">
        ${buildNavLeft(page)}
      </div>
      <a class="nav-logo" href="/">${LOGO_SVG}</a>
      <div class="nav-tools">
        <button class="nav-btn" id="admin-nav-btn" title="开发模式 (Ctrl+Shift+A)" onclick="typeof AdminPanel!=='undefined'&&AdminPanel.toggle()" style="display:none;">
          ${ICON_ADMIN}
        </button>
        <button class="nav-btn" id="theme-toggle" title="切换主题" onclick="toggleTheme()">
          ${ICON_SUN}
        </button>
        <div class="nav-account">
          <button class="nav-btn" id="account-btn" title="账户" onclick="toggleAccountMenu()">
            ${ICON_USER}
          </button>
          <div class="account-dropdown" id="account-dropdown">
            <div class="dropdown-header">账户</div>
            <a class="dropdown-item" onclick="closeAccountMenu()">
              ${ICON_HISTORY}
              浏览历史
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" onclick="closeAccountMenu();typeof Notepad!=='undefined'&&Notepad.toggle();">
              ${ICON_NOTEPAD}
              记事本
            </a>
          </div>
        </div>
      </div>`;
  }

  /* ===== Render footer ===== */
  function renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    footer.innerHTML = `
      <div class="footer-row">
        <div class="footer-left">
          爻卦易 <span class="footer-sep">·</span> yaoguayi.com <span class="footer-sep">·</span>
          <a href="/#about">关于本站</a> <span class="footer-sep">·</span>
          开源 <span class="footer-sep">·</span> 非盈利
        </div>
        <div class="footer-right">
          <a href="https://github.com/Hypocrite65/yaoguayi" target="_blank">GitHub</a>
          <span class="footer-sep">·</span>
          <a href="#" id="logout-link">退出预览</a>
        </div>
      </div>`;
  }

  /* ===== Init ===== */
  renderNav();
  renderFooter();
})();
