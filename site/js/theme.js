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

// 注入 no-transition 样式：主题切换瞬间禁用过渡，防止闪白
// 同时定义 html.dark-theme 变量（变量可继承，body 自动生效），
// 配合各页 <head> 内联脚本，页面渲染前即应用深色，避免加载闪烁
(function(){
  var st = document.createElement('style');
  st.textContent = '.no-transition,.no-transition *,.no-transition *::before,.no-transition *::after{transition:none !important;}'
    // 切换瞬间：导航栏关掉毛玻璃、背景改不透明，避免合成器重算模糊时闪白
    + '.no-transition .top-nav{-webkit-backdrop-filter:none !important;backdrop-filter:none !important;background:#faf8f1 !important;}'
    + '.no-transition.dark-theme .top-nav{background:#1c1a16 !important;}'
    + 'html.dark-theme{'
    + '--bg:#1c1a16;--bg-alt:#252320;--ink:#e8e0d4;--ink-light:#ccc4b8;'
    + '--muted:#a49c8c;--faint:#847c6c;--ghost:#5a5448;--whisper:#3e3830;'
    + '--border:rgba(232,224,212,0.10);--border-strong:rgba(232,224,212,0.18);'
    + '--vermilion:#e07060;--vermilion-faint:rgba(224,112,96,0.18);'
    + '--nav-bg:rgba(28,26,22,0.94);--card-bg:rgba(37,35,32,0.7);'
    + '--hover-bg:rgba(232,224,212,0.08);--shadow:rgba(0,0,0,0.3);'
    + '--svg-fill:#e8e0d4;--svg-circle:#a07860;}'
    + 'html.dark-theme body{background:var(--bg);color:var(--ink);}'
    + 'html{background:#faf8f1;}html.dark-theme{background:#1c1a16;}';
  document.head.appendChild(st);
})();

function toggleTheme() {
  // 切换瞬间禁用所有过渡动画，避免屏幕闪白晃眼
  var root = document.documentElement;
  root.classList.add('no-transition');
  var btn = document.getElementById('theme-toggle');
  var isDark = root.classList.toggle('dark-theme');
  // 兼容旧版 body.dark-theme（历史页面 CSS 用 body 选择器）
  document.body.classList.toggle('dark-theme', isDark);
  localStorage.setItem('yaoguayi_theme', isDark ? 'dark' : 'light');
  if (btn) btn.innerHTML = isDark ? MOON_SVG : SUN_SVG;
  // 强制重排让新主题立即生效，再恢复过渡
  void document.body.offsetHeight;
  root.classList.remove('no-transition');
}

function initTheme() {
  if (localStorage.getItem('yaoguayi_theme') === 'dark') {
    document.documentElement.classList.add('dark-theme');
    document.body.classList.add('dark-theme');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerHTML = MOON_SVG;
  }
}

// 页面加载时初始化主题
initTheme();

/**
 * goBack — 返回上一次位置
 * 有浏览历史则后退一页；直接打开本页（无历史）时去兜底页。
 */
function goBack(fallback) {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = fallback || '/';
  }
}

/* ===== PWA：注册 Service Worker（离线可用） ===== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {
      /* 注册失败不影响正常使用 */
    });
  });
}
