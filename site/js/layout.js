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

  const ICON_NOTEPAD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';

  const ICON_LOGIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>';

  const ICON_LOGOUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';

  const ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';

  const ICON_GITHUB = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>';

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
            <a class="dropdown-item" onclick="closeAccountMenu();typeof Notepad!=='undefined'&&Notepad.toggle();">
              ${ICON_NOTEPAD}
              记事本
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" id="auth-action-link">
              <span id="auth-action-icon">${ICON_LOGOUT}</span>
              <span id="auth-action-text">退出登录</span>
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
          © 2026 爻卦易 <span class="footer-sep">·</span> 观象明理
        </div>
        <div class="footer-right">
          <a href="mailto:support@yaoguayi.com" title="联系我们" class="footer-mail">${ICON_MAIL}</a>
          <a href="https://github.com/Hypocrite65/yaoguayi" target="_blank" title="GitHub">${ICON_GITHUB}</a>
        </div>
      </div>`;
  }

  /* ===== Init ===== */
  renderNav();
  renderFooter();
})();
