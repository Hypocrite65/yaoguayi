/**
 * admin-panel.js — Admin panel + floating notepad + AI settings modules
 *
 * Three independent modules:
 * 1. AdminPanel: Right-side admin panel (admin-only via wrench icon)
 *    - Section IDs badge overlay for quick reference
 * 2. Notepad: Draggable floating window (all users)
 *    - Quick text editor with line numbers, auto-save to localStorage
 * 3. AISettings: Collapsible config section inside the glossary side-panel
 *    - Provider, API Key (hidden), Base URL, persisted in localStorage
 */

/* ===== AdminPanel: admin-only section IDs ===== */
const AdminPanel = (() => {
  let isOpen = false;

  function open() {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;
    isOpen = true;
    panel.classList.add('open');
    document.body.classList.add('admin-panel-open');
    injectBadges();
  }

  function close() {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;
    isOpen = false;
    panel.classList.remove('open');
    document.body.classList.remove('admin-panel-open');
    removeBadges();
  }

  function toggle() { isOpen ? close() : open(); }

  function getPageType() {
    return location.pathname.includes('hexagram.html') ? 'hexagram' : 'index';
  }

  function getSections() {
    if (getPageType() === 'hexagram') {
      return [
        { id: 'H-01', name: 'Sidebar (卦象图/卦名)', selector: '.hex-sidebar' },
        { id: 'H-02', name: 'Guaci (卦辞)', selector: '.hex-content .section:nth-child(1)' },
        { id: 'H-03', name: 'Tuan (彖传)', selector: '.hex-content .section:nth-child(2)' },
        { id: 'H-04', name: 'Xiang (大象传)', selector: '.hex-content .section:nth-child(3)' },
        { id: 'H-05', name: 'Yaoci (爻辞)', selector: '.hex-content .section:nth-child(4)' },
        { id: 'H-06', name: 'Navigation (前后卦)', selector: '.hex-nav' }
      ];
    }
    return [
      { id: 'I-01', name: 'Cover (封面区)', selector: '.cover' },
      { id: 'I-02', name: 'Nav Links (导航链接)', selector: '.cover-nav' },
      { id: 'I-03', name: 'Month Card (本月卦象)', selector: '#random-card' },
      { id: 'I-04', name: 'Quote (封面引文)', selector: '.cover-quote' },
      { id: 'I-05', name: 'Hex Grid (六十四卦)', selector: '#hexagrams' },
      { id: 'I-06', name: 'Footer (页脚)', selector: '.site-footer' }
    ];
  }

  function injectBadges() {
    removeBadges();
    getSections().forEach(sec => {
      const el = document.querySelector(sec.selector);
      if (!el) return;
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
        el.dataset.adminResetPos = 'true';
      }
      const badge = document.createElement('div');
      badge.className = 'section-badge';
      badge.textContent = sec.id;
      badge.title = sec.name;
      el.appendChild(badge);
    });
  }

  function removeBadges() {
    document.querySelectorAll('.section-badge').forEach(b => b.remove());
    document.querySelectorAll('[data-admin-reset-pos]').forEach(el => {
      el.style.position = '';
      delete el.dataset.adminResetPos;
    });
  }

  function scrollToSection(sectionId) {
    const sec = getSections().find(s => s.id === sectionId);
    if (!sec) return;
    const el = document.querySelector(sec.selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.outline = '2px solid var(--vermilion)';
      el.style.outlineOffset = '4px';
      setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 2000);
    }
  }

  function init() {
    if (!YaoguayiAuth.isAuthenticated()) return;
    const navWrench = document.getElementById('admin-nav-btn');
    if (navWrench) navWrench.style.display = '';

    // Ctrl+Shift+A shortcut
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggle();
      }
    });
  }

  return { init, open, close, toggle, scrollToSection };
})();


/* ===== Notepad: floating draggable window (all users) ===== */
const Notepad = (() => {
  const NOTEPAD_KEY = 'yaoguayi_notepad';
  let isVisible = false;
  let isDragging = false;
  let dragOffsetX = 0, dragOffsetY = 0;

  function getEls() {
    return {
      win: document.getElementById('notepad-window'),
      area: document.getElementById('notepad-area'),
      lines: document.getElementById('notepad-lines'),
      count: document.getElementById('notepad-count')
    };
  }

  function show() {
    const { win } = getEls();
    if (!win) return;
    isVisible = true;
    win.classList.add('visible');
    updateLineNumbers();
    updateCharCount();
  }

  function hide() {
    const { win } = getEls();
    if (!win) return;
    isVisible = false;
    win.classList.remove('visible');
  }

  function toggle() { isVisible ? hide() : show(); }

  function updateLineNumbers() {
    const { area, lines } = getEls();
    if (!area || !lines) return;
    const n = area.value.split('\n').length;
    let txt = '';
    for (let i = 1; i <= n; i++) txt += i + '\n';
    lines.textContent = txt;
  }

  function updateCharCount() {
    const { area, count } = getEls();
    if (!area || !count) return;
    const t = area.value;
    count.textContent = `${t.length} chars / ${t.split('\n').length} lines`;
  }

  function clear() {
    const { area } = getEls();
    if (!area || !confirm('Clear all notepad content?')) return;
    area.value = '';
    localStorage.removeItem(NOTEPAD_KEY);
    updateLineNumbers();
    updateCharCount();
  }

  function selectAll() {
    const { area } = getEls();
    if (!area) return;
    area.focus();
    area.select();
  }

  /* Drag logic */
  function onMouseDown(e) {
    const { win } = getEls();
    if (!win) return;
    isDragging = true;
    const rect = win.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    win.style.transition = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    const { win } = getEls();
    if (!win) return;
    const x = Math.max(0, Math.min(e.clientX - dragOffsetX, window.innerWidth - win.offsetWidth));
    const y = Math.max(0, Math.min(e.clientY - dragOffsetY, window.innerHeight - win.offsetHeight));
    win.style.left = x + 'px';
    win.style.top = y + 'px';
    win.style.right = 'auto';
    win.style.bottom = 'auto';
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function init() {
    const { win, area, lines } = getEls();
    if (!area) return;

    // Load saved content
    area.value = localStorage.getItem(NOTEPAD_KEY) || '';

    // Auto-save
    area.addEventListener('input', () => {
      localStorage.setItem(NOTEPAD_KEY, area.value);
      updateLineNumbers();
      updateCharCount();
    });

    // Sync scroll
    area.addEventListener('scroll', () => {
      if (lines) lines.scrollTop = area.scrollTop;
    });

    // Tab key
    area.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = area.selectionStart, end = area.selectionEnd;
        area.value = area.value.substring(0, s) + '  ' + area.value.substring(end);
        area.selectionStart = area.selectionEnd = s + 2;
        localStorage.setItem(NOTEPAD_KEY, area.value);
        updateLineNumbers();
      }
    });

    // Drag title bar
    const titleBar = win && win.querySelector('.notepad-titlebar');
    if (titleBar) titleBar.addEventListener('mousedown', onMouseDown);

    updateLineNumbers();
    updateCharCount();
  }

  return { init, show, hide, toggle, clear, selectAll };
})();


/* ===== AISettings: collapsible config in side-panel ===== */
const AISettings = (() => {
  const KEYS = {
    provider: 'yaoguayi_ai_provider',
    key: 'yaoguayi_ai_key',
    base: 'yaoguayi_ai_base'
  };

  function load() {
    return {
      provider: localStorage.getItem(KEYS.provider) || 'openai',
      key: localStorage.getItem(KEYS.key) || '',
      base: localStorage.getItem(KEYS.base) || ''
    };
  }

  function save() {
    const p = document.getElementById('ai-provider');
    const k = document.getElementById('ai-key');
    const b = document.getElementById('ai-base');
    const s = document.getElementById('ai-status');
    if (p) localStorage.setItem(KEYS.provider, p.value);
    if (k) localStorage.setItem(KEYS.key, k.value);
    if (b) localStorage.setItem(KEYS.base, b.value);
    if (s) { s.textContent = 'Saved'; s.className = 'ai-status saved'; setTimeout(updateStatus, 1500); }
  }

  function clear() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    const p = document.getElementById('ai-provider');
    const k = document.getElementById('ai-key');
    const b = document.getElementById('ai-base');
    if (p) p.value = 'openai';
    if (k) k.value = '';
    if (b) b.value = '';
    updateStatus();
  }

  function updateStatus() {
    const s = document.getElementById('ai-status');
    if (!s) return;
    const key = localStorage.getItem(KEYS.key);
    s.textContent = key ? 'Configured' : 'Not configured';
    s.className = key ? 'ai-status configured' : 'ai-status';
  }

  function toggleKey() {
    const k = document.getElementById('ai-key');
    const t = document.getElementById('ai-key-toggle');
    if (!k || !t) return;
    k.type = k.type === 'password' ? 'text' : 'password';
    t.textContent = k.type === 'password' ? 'Show' : 'Hide';
  }

  function toggleExpand() {
    const body = document.getElementById('ai-config-body');
    const icon = document.getElementById('ai-config-toggle');
    if (!body) return;
    const collapsed = body.classList.toggle('collapsed');
    if (icon) icon.textContent = collapsed ? '▸' : '▾';
  }

  function init() {
    const settings = load();
    const p = document.getElementById('ai-provider');
    const k = document.getElementById('ai-key');
    const b = document.getElementById('ai-base');
    if (p) p.value = settings.provider;
    if (k) k.value = settings.key;
    if (b) b.value = settings.base;
    updateStatus();

    // Auto-collapse if already configured
    if (settings.key) {
      const body = document.getElementById('ai-config-body');
      const icon = document.getElementById('ai-config-toggle');
      if (body) body.classList.add('collapsed');
      if (icon) icon.textContent = '▸';
    }
  }

  return { init, save, clear, toggleKey, toggleExpand };
})();
