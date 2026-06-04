/**
 * theme.js — 共享主题切换模块
 *
 * 设计说明：
 * 管理日间/夜间主题切换，所有页面共用。
 * 状态存 localStorage，页面加载时自动恢复。
 * 图标：太阳 = 当前日间模式，月亮 = 当前夜间模式。
 */

const SUN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
const MOON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

function toggleTheme() {
  const btn = document.getElementById('theme-toggle');
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('yaoguayi_theme', isDark ? 'dark' : 'light');
  if (btn) btn.innerHTML = isDark ? MOON_SVG : SUN_SVG;
}

function initTheme() {
  if (localStorage.getItem('yaoguayi_theme') === 'dark') {
    document.body.classList.add('dark-theme');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerHTML = MOON_SVG;
  }
}

function toggleAccountMenu() {
  document.getElementById('account-dropdown').classList.toggle('show');
}

function closeAccountMenu() {
  const d = document.getElementById('account-dropdown');
  if (d) d.classList.remove('show');
}

document.addEventListener('click', (e) => {
  const a = document.querySelector('.nav-account');
  if (a && !a.contains(e.target)) closeAccountMenu();
});

// 页面加载时初始化主题
initTheme();
