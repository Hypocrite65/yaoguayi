/**
 * admin-panel.js — Admin tool panel module
 *
 * Provides a right-side admin panel with three tabs:
 * 1. Section IDs: Display section badges on page elements for quick reference
 * 2. AI Settings: Configure AI API provider, key, and base URL
 * 3. Notepad: Quick scratchpad with line numbers and auto-save
 *
 * Only visible when authenticated (yaoguayi_dev_auth === 'true').
 * Panel state and notepad content persisted in localStorage.
 */

const AdminPanel = (() => {
  /* ===== State ===== */
  let isOpen = false;
  let activeTab = 'sections';
  let badgesVisible = false;

  /* ===== DOM references (lazy) ===== */
  let panel, trigger, notepadEl, lineNumEl;

  function getEl() {
    panel = document.getElementById('admin-panel');
    trigger = document.getElementById('admin-trigger');
    notepadEl = document.getElementById('admin-notepad');
    lineNumEl = document.getElementById('admin-line-numbers');
  }

  /* ===== Open / Close ===== */
  function open() {
    getEl();
    if (!panel) return;
    isOpen = true;
    panel.classList.add('open');
    if (trigger) trigger.classList.add('hidden');
    switchTab(activeTab);
  }

  function close() {
    getEl();
    if (!panel) return;
    isOpen = false;
    panel.classList.remove('open');
    if (trigger) trigger.classList.remove('hidden');
    removeBadges();
  }

  function toggle() {
    isOpen ? close() : open();
  }

  /* ===== Tab switching ===== */
  function switchTab(tab) {
    activeTab = tab;
    getEl();
    if (!panel) return;

    // Update tab active state
    panel.querySelectorAll('.admin-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });

    // Show corresponding content
    panel.querySelectorAll('.admin-tab-content').forEach(c => {
      c.classList.toggle('active', c.dataset.tab === tab);
    });

    // Toggle section badges
    if (tab === 'sections') {
      injectBadges();
    } else {
      removeBadges();
    }

    // Initialize notepad line numbers on first show
    if (tab === 'notepad' && notepadEl) {
      updateLineNumbers();
    }
  }

  /* ===== Tab 1: Section Badges ===== */

  /**
   * Detect current page type based on URL path
   */
  function getPageType() {
    const path = location.pathname;
    if (path.includes('hexagram.html')) return 'hexagram';
    return 'index';
  }

  /**
   * Get section definitions for the current page
   */
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

  /**
   * Inject badge overlays on each section element
   */
  function injectBadges() {
    removeBadges();
    const sections = getSections();
    sections.forEach(sec => {
      const el = document.querySelector(sec.selector);
      if (!el) return;

      // Ensure the element has position for absolute badge
      const pos = getComputedStyle(el).position;
      if (pos === 'static') {
        el.style.position = 'relative';
        el.dataset.adminResetPos = 'true';
      }

      const badge = document.createElement('div');
      badge.className = 'section-badge';
      badge.textContent = sec.id;
      badge.title = sec.name;
      el.appendChild(badge);
    });
    badgesVisible = true;
  }

  /**
   * Remove all badge overlays
   */
  function removeBadges() {
    document.querySelectorAll('.section-badge').forEach(b => b.remove());
    document.querySelectorAll('[data-admin-reset-pos]').forEach(el => {
      el.style.position = '';
      delete el.dataset.adminResetPos;
    });
    badgesVisible = false;
  }

  /**
   * Scroll to a section by its ID code
   */
  function scrollToSection(sectionId) {
    const sections = getSections();
    const sec = sections.find(s => s.id === sectionId);
    if (!sec) return;
    const el = document.querySelector(sec.selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Brief highlight effect
      el.style.outline = '2px solid var(--vermilion)';
      el.style.outlineOffset = '4px';
      setTimeout(() => {
        el.style.outline = '';
        el.style.outlineOffset = '';
      }, 2000);
    }
  }

  /* ===== Tab 2: AI Settings ===== */

  const AI_KEYS = {
    provider: 'yaoguayi_ai_provider',
    key: 'yaoguayi_ai_key',
    base: 'yaoguayi_ai_base'
  };

  function loadAISettings() {
    return {
      provider: localStorage.getItem(AI_KEYS.provider) || 'openai',
      key: localStorage.getItem(AI_KEYS.key) || '',
      base: localStorage.getItem(AI_KEYS.base) || ''
    };
  }

  function saveAISettings() {
    const providerEl = document.getElementById('ai-provider');
    const keyEl = document.getElementById('ai-key');
    const baseEl = document.getElementById('ai-base');
    const statusEl = document.getElementById('ai-status');

    if (providerEl) localStorage.setItem(AI_KEYS.provider, providerEl.value);
    if (keyEl) localStorage.setItem(AI_KEYS.key, keyEl.value);
    if (baseEl) localStorage.setItem(AI_KEYS.base, baseEl.value);

    if (statusEl) {
      statusEl.textContent = 'Saved';
      statusEl.className = 'ai-status saved';
      setTimeout(() => updateAIStatus(), 1500);
    }
  }

  function clearAISettings() {
    Object.values(AI_KEYS).forEach(k => localStorage.removeItem(k));
    const providerEl = document.getElementById('ai-provider');
    const keyEl = document.getElementById('ai-key');
    const baseEl = document.getElementById('ai-base');
    if (providerEl) providerEl.value = 'openai';
    if (keyEl) keyEl.value = '';
    if (baseEl) baseEl.value = '';
    updateAIStatus();
  }

  function updateAIStatus() {
    const statusEl = document.getElementById('ai-status');
    if (!statusEl) return;
    const key = localStorage.getItem(AI_KEYS.key);
    if (key) {
      statusEl.textContent = 'Configured';
      statusEl.className = 'ai-status configured';
    } else {
      statusEl.textContent = 'Not configured';
      statusEl.className = 'ai-status';
    }
  }

  function toggleKeyVisibility() {
    const keyEl = document.getElementById('ai-key');
    const toggleEl = document.getElementById('ai-key-toggle');
    if (!keyEl || !toggleEl) return;
    if (keyEl.type === 'password') {
      keyEl.type = 'text';
      toggleEl.textContent = 'Hide';
    } else {
      keyEl.type = 'password';
      toggleEl.textContent = 'Show';
    }
  }

  /**
   * Populate AI settings form from localStorage
   */
  function initAIForm() {
    const settings = loadAISettings();
    const providerEl = document.getElementById('ai-provider');
    const keyEl = document.getElementById('ai-key');
    const baseEl = document.getElementById('ai-base');
    if (providerEl) providerEl.value = settings.provider;
    if (keyEl) keyEl.value = settings.key;
    if (baseEl) baseEl.value = settings.base;
    updateAIStatus();
  }

  /* ===== Tab 3: Notepad ===== */

  const NOTEPAD_KEY = 'yaoguayi_notepad';

  function initNotepad() {
    getEl();
    if (!notepadEl) return;

    // Load saved content
    notepadEl.value = localStorage.getItem(NOTEPAD_KEY) || '';

    // Auto-save on input
    notepadEl.addEventListener('input', () => {
      localStorage.setItem(NOTEPAD_KEY, notepadEl.value);
      updateLineNumbers();
      updateCharCount();
    });

    // Sync scroll between textarea and line numbers
    notepadEl.addEventListener('scroll', () => {
      if (lineNumEl) lineNumEl.scrollTop = notepadEl.scrollTop;
    });

    // Tab key support — insert tab instead of moving focus
    notepadEl.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = notepadEl.selectionStart;
        const end = notepadEl.selectionEnd;
        notepadEl.value = notepadEl.value.substring(0, start) + '  ' + notepadEl.value.substring(end);
        notepadEl.selectionStart = notepadEl.selectionEnd = start + 2;
        localStorage.setItem(NOTEPAD_KEY, notepadEl.value);
        updateLineNumbers();
      }
    });

    updateLineNumbers();
    updateCharCount();
  }

  function updateLineNumbers() {
    if (!notepadEl || !lineNumEl) return;
    const lines = notepadEl.value.split('\n').length;
    let html = '';
    for (let i = 1; i <= lines; i++) {
      html += i + '\n';
    }
    lineNumEl.textContent = html;
  }

  function updateCharCount() {
    const countEl = document.getElementById('admin-char-count');
    if (!countEl || !notepadEl) return;
    const text = notepadEl.value;
    const chars = text.length;
    const lines = text.split('\n').length;
    countEl.textContent = `${chars} chars / ${lines} lines`;
  }

  function clearNotepad() {
    getEl();
    if (!notepadEl) return;
    if (!confirm('Clear all notepad content?')) return;
    notepadEl.value = '';
    localStorage.removeItem(NOTEPAD_KEY);
    updateLineNumbers();
    updateCharCount();
  }

  function selectAllNotepad() {
    getEl();
    if (!notepadEl) return;
    notepadEl.focus();
    notepadEl.select();
  }

  /* ===== Keyboard shortcut ===== */
  function initShortcut() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (YaoguayiAuth.isAuthenticated()) toggle();
      }
    });
  }

  /* ===== Initialization ===== */
  function init() {
    if (!YaoguayiAuth.isAuthenticated()) return;

    // Show admin trigger button
    const triggerBtn = document.getElementById('admin-trigger');
    if (triggerBtn) triggerBtn.style.display = '';

    // Show wrench in nav
    const navWrench = document.getElementById('admin-nav-btn');
    if (navWrench) navWrench.style.display = '';

    // Initialize sub-modules
    initAIForm();
    initNotepad();
    initShortcut();
  }

  /* ===== Public API ===== */
  return {
    init,
    open, close, toggle,
    switchTab,
    scrollToSection,
    saveAISettings, clearAISettings, toggleKeyVisibility,
    clearNotepad, selectAllNotepad
  };
})();
