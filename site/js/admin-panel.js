/**
 * admin-panel.js — Admin panel + unified tool window (AI chat + notepad)
 *
 * Four modules:
 * 1. AdminPanel: Right-side admin panel (admin-only via wrench icon)
 * 2. ToolWindow: Draggable floating window with tabs (AI / Notepad)
 * 3. Notepad: Content module (auto-save, line numbers, save-to-file)
 * 4. AIChat: AI conversation module (streaming, slash commands, image paste)
 */

/* ===== AdminPanel: admin-only section IDs ===== */
const AdminPanel = (() => {
  let isOpen = false;
  let currentHex = null;

  function open() {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;

    isOpen = true;
    panel.classList.add('open');
    document.body.classList.add('admin-panel-open');

    if (typeof SidePanel !== 'undefined' && !SidePanel.isOpen && getPageType() === 'hexagram') {
      SidePanel.toggle();
    }

    const trigger = document.getElementById('panel-trigger');
    if (trigger) trigger.style.display = 'none';

    injectBadges();
  }

  function close() {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;
    isOpen = false;
    panel.classList.remove('open');
    document.body.classList.remove('admin-panel-open');

    if (typeof SidePanel !== 'undefined' && SidePanel.isOpen) {
      SidePanel.close();
    }

    const trigger = document.getElementById('panel-trigger');
    if (trigger) trigger.style.display = '';

    removeBadges();
  }

  function toggle() { isOpen ? close() : open(); }

  function getPageType() {
    const p = location.pathname;
    if (p.includes('hexagram.html')) return 'hexagram';
    if (p.includes('learn.html')) return 'learn';
    return 'index';
  }

  function getHexPrefix() {
    if (!currentHex || !currentHex.id) return 'H00';
    return 'H' + String(currentHex.id).padStart(2, '0');
  }

  function getSections() {
    const page = getPageType();
    if (page === 'hexagram') return buildHexagramSections();
    if (page === 'learn') return buildLearnSections();
    return buildIndexSections();
  }

  function buildIndexSections() {
    const sections = [];
    let n = 1;
    const pad = () => 'I-' + String(n++).padStart(2, '0');

    if (document.querySelector('.cover')) {
      sections.push({ id: pad(), name: '封面区', selector: '.cover' });
    }
    if (document.querySelector('.cover-nav')) {
      sections.push({ id: pad(), name: '导航链接', selector: '.cover-nav' });
    }
    if (document.getElementById('random-card')) {
      sections.push({ id: pad(), name: '本月卦象', selector: '#random-card' });
    }
    if (document.querySelector('.cover-quote')) {
      sections.push({ id: pad(), name: '封面引文', selector: '.cover-quote' });
    }

    if (document.getElementById('hexagrams')) {
      sections.push({ id: pad(), name: '六十四卦', selector: '#hexagrams' });
    }

    if (document.getElementById('learn')) {
      sections.push({ id: pad(), name: '读易', selector: '#learn' });
      document.querySelectorAll('.learn-card').forEach(card => {
        const title = card.querySelector('.learn-card-title');
        if (title) {
          const cardId = card.getAttribute('href') || '';
          sections.push({
            id: pad(),
            name: '读易 · ' + title.textContent.trim(),
            selector: `.learn-card[href="${cardId}"]`,
            indent: true
          });
        }
      });
    }

    if (document.getElementById('site-footer')) {
      sections.push({ id: pad(), name: '页脚', selector: '#site-footer' });
    }

    return sections;
  }

  function buildLearnSections() {
    const sections = [];
    let n = 1;
    const pad = () => 'L-' + String(n++).padStart(2, '0');

    if (document.getElementById('learn-sidebar')) {
      sections.push({ id: pad(), name: '侧边目录', selector: '#learn-sidebar' });
    }

    document.querySelectorAll('.knowledge-article').forEach(article => {
      const heading = article.querySelector('h2');
      const aId = article.id || '';
      if (heading) {
        sections.push({ id: pad(), name: heading.textContent.trim(), selector: '#' + aId });
        article.querySelectorAll('.article-section').forEach((sec, idx) => {
          const h3 = sec.querySelector('h3');
          if (!h3) return;
          sections.push({
            id: pad(),
            name: '  · ' + h3.textContent.trim(),
            selector: `#${aId} .article-section:nth-child(${idx + 2}) h3`,
            indent: true
          });
        });
      }
    });

    if (document.getElementById('site-footer')) {
      sections.push({ id: pad(), name: '页脚', selector: '#site-footer' });
    }

    return sections;
  }

  function buildHexagramSections() {
    const prefix = currentHex ? currentHex.name : '';
    const hp = getHexPrefix();
    const sections = [
      { id: `${hp}-01`, name: `${prefix} · 卦象图`, selector: '.hex-sidebar' },
      { id: `${hp}-02`, name: `${prefix} · 卦辞`, selector: '.hex-content .section:nth-child(1)' },
      { id: `${hp}-03`, name: `${prefix} · 彖传`, selector: '.hex-content .section:nth-child(2)' },
      { id: `${hp}-04`, name: `${prefix} · 大象传`, selector: '.hex-content .section:nth-child(3)' },
      { id: `${hp}-05`, name: `${prefix} · 爻辞`, selector: '.hex-content .section:nth-child(4)' }
    ];

    if (currentHex && currentHex.yaoci) {
      currentHex.yaoci.forEach(y => {
        sections.push({
          id: `${hp}-05-${y.position}`,
          name: `${prefix} · ${y.name}`,
          selector: `#yao-${y.position}`,
          indent: true
        });
      });
    }

    sections.push({ id: `${hp}-06`, name: `${prefix} · 前后卦导航`, selector: '.hex-nav' });
    return sections;
  }

  function updateSectionList(hex) {
    currentHex = hex;
    const container = document.getElementById('admin-sections');
    if (!container) return;

    const sections = getSections();
    container.innerHTML = '<ul class="section-list">' +
      sections.map(sec => {
        const cls = sec.indent ? 'section-item section-item-sub' : 'section-item';
        return `<li class="${cls}" onclick="AdminPanel.scrollToSection('${sec.id}')">` +
          `<span class="section-item-id">${sec.id}</span>` +
          `<span class="section-item-name">${sec.name}</span></li>`;
      }).join('') +
      '</ul>';

    if (isOpen) injectBadges();
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
      badge.className = sec.indent ? 'section-badge section-badge-sub' : 'section-badge';
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
    if (!YaoguayiAuth.isAdmin()) return;
    const navWrench = document.getElementById('admin-nav-btn');
    if (navWrench) navWrench.style.display = '';

    const page = getPageType();
    if (page === 'index' || page === 'learn') {
      setTimeout(() => updateSectionList(null), 500);
    }

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggle();
      }
    });
  }

  return { init, open, close, toggle, scrollToSection, updateSectionList };
})();


/* ===== ToolWindow: unified draggable floating window with tabs ===== */
const ToolWindow = (() => {
  const POS_KEY = 'yaoguayi_toolwindow_pos';
  const PIN_KEY = 'yaoguayi_notepad_pin';

  let windowEl = null;
  let created = false;
  let activeTab = 'ai';
  let isDragging = false;
  let dragOffsetX = 0, dragOffsetY = 0;
  let isMobile = false;

  const SVG_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 17v5"/><path d="M9 11V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7"/><path d="M5 17h14"/><path d="M7 11l-2 6h14l-2-6"/></svg>';
  const SVG_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  function createWindow() {
    if (created) return;
    created = true;
    isMobile = window.innerWidth <= 768;

    const el = document.createElement('div');
    el.className = 'tool-window hidden';
    el.id = 'tool-window';
    el.innerHTML = `
      <div class="tool-titlebar" id="tool-titlebar">
        <div class="tool-tabs">
          <button class="tool-tab active" data-tab="ai">AI 助手</button>
          <button class="tool-tab" data-tab="notepad">记事本</button>
        </div>
        <div class="tool-titlebar-btns">
          <button class="tool-titlebar-btn" id="tool-pin-btn" title="固定显示" style="display:none">${SVG_PIN}</button>
          <button class="tool-titlebar-btn tool-close-btn" onclick="ToolWindow.closeWindow()" title="关闭">${SVG_CLOSE}</button>
        </div>
      </div>
      <div class="tool-panel active" id="tool-panel-ai"></div>
      <div class="tool-panel" id="tool-panel-notepad"></div>`;

    document.body.appendChild(el);
    windowEl = el;

    // Tab click
    el.querySelectorAll('.tool-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        switchTab(tab.dataset.tab);
      });
    });

    // Pin button
    const pinBtn = document.getElementById('tool-pin-btn');
    if (pinBtn) {
      pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        Notepad.togglePin();
        updatePinState();
      });
    }

    // Drag (mouse)
    const titlebar = document.getElementById('tool-titlebar');
    if (titlebar && !isMobile) {
      titlebar.addEventListener('mousedown', onDragStart);
      titlebar.addEventListener('touchstart', onTouchStart, { passive: false });
    }

    // Build panel contents
    AIChat.createPanel(document.getElementById('tool-panel-ai'));
    Notepad.createPanel(document.getElementById('tool-panel-notepad'));

    // Restore position
    restorePosition();

    // Update pin button visibility
    updatePinState();
  }

  function switchTab(name) {
    if (!windowEl) return;
    activeTab = name;
    windowEl.querySelectorAll('.tool-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === name);
    });
    windowEl.querySelectorAll('.tool-panel').forEach(p => {
      p.classList.toggle('active', p.id === 'tool-panel-' + name);
    });
    const pinBtn = document.getElementById('tool-pin-btn');
    if (pinBtn) pinBtn.style.display = (name === 'notepad') ? '' : 'none';
    if (name === 'ai') {
      const input = document.getElementById('ai-chat-input');
      if (input) setTimeout(() => input.focus(), 50);
    }
  }

  function updatePinState() {
    const pinBtn = document.getElementById('tool-pin-btn');
    if (!pinBtn) return;
    const pinned = localStorage.getItem(PIN_KEY) === '1';
    pinBtn.title = pinned ? '取消固定' : '固定显示';
    pinBtn.classList.toggle('active', pinned);
  }

  function toggleWindow() {
    if (!created) createWindow();
    if (windowEl.classList.contains('hidden')) openWindow();
    else closeWindow();
  }

  function openWindow(tab) {
    if (!created) createWindow();
    windowEl.classList.remove('hidden');
    if (tab) switchTab(tab);
    if (activeTab === 'ai') {
      const input = document.getElementById('ai-chat-input');
      if (input) setTimeout(() => input.focus(), 100);
    }
  }

  function closeWindow() {
    if (windowEl) windowEl.classList.add('hidden');
  }

  function isOpen() {
    return windowEl && !windowEl.classList.contains('hidden');
  }

  /* Drag: mouse */
  function onDragStart(e) {
    if (e.target.closest('.tool-tab') || e.target.closest('.tool-titlebar-btn')) return;
    isDragging = true;
    const rect = windowEl.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    windowEl.style.transition = 'none';
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    e.preventDefault();
  }

  function onDragMove(e) {
    if (!isDragging) return;
    applyPosition(e.clientX - dragOffsetX, e.clientY - dragOffsetY);
  }

  function onDragEnd() {
    isDragging = false;
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    savePosition();
  }

  /* Drag: touch */
  function onTouchStart(e) {
    if (e.target.closest('.tool-tab') || e.target.closest('.tool-titlebar-btn')) return;
    if (e.touches.length !== 1) return;
    isDragging = true;
    const t = e.touches[0];
    const rect = windowEl.getBoundingClientRect();
    dragOffsetX = t.clientX - rect.left;
    dragOffsetY = t.clientY - rect.top;
    windowEl.style.transition = 'none';
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    e.preventDefault();
  }

  function onTouchMove(e) {
    if (!isDragging || e.touches.length !== 1) return;
    const t = e.touches[0];
    applyPosition(t.clientX - dragOffsetX, t.clientY - dragOffsetY);
    e.preventDefault();
  }

  function onTouchEnd() {
    isDragging = false;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
    savePosition();
  }

  function applyPosition(x, y) {
    x = Math.max(0, Math.min(x, window.innerWidth - windowEl.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - windowEl.offsetHeight));
    windowEl.style.left = x + 'px';
    windowEl.style.top = y + 'px';
    windowEl.style.right = 'auto';
    windowEl.style.bottom = 'auto';
  }

  function savePosition() {
    if (!windowEl) return;
    const rect = windowEl.getBoundingClientRect();
    localStorage.setItem(POS_KEY, JSON.stringify({ left: rect.left, top: rect.top }));
  }

  function restorePosition() {
    if (isMobile || !windowEl) return;
    const saved = localStorage.getItem(POS_KEY);
    if (!saved) return;
    try {
      const pos = JSON.parse(saved);
      const maxX = window.innerWidth - windowEl.offsetWidth;
      const maxY = window.innerHeight - windowEl.offsetHeight;
      applyPosition(Math.min(pos.left, maxX), Math.min(pos.top, maxY));
    } catch { /* ignore */ }
  }

  function init() {
    if (localStorage.getItem(PIN_KEY) === '1') {
      openWindow('notepad');
    }
  }

  return { init, toggleWindow, openWindow, closeWindow, isOpen, switchTab };
})();


/* ===== Notepad: content module (no window management) ===== */
const Notepad = (() => {
  const NOTEPAD_KEY = 'yaoguayi_notepad';
  const PIN_KEY = 'yaoguayi_notepad_pin';
  let isPinned = false;
  let initialized = false;

  function getEls() {
    return {
      area: document.getElementById('notepad-area'),
      lines: document.getElementById('notepad-lines'),
      count: document.getElementById('notepad-count')
    };
  }

  function createPanel(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="tool-toolbar">
        <button class="tool-btn" onclick="Notepad.saveToFile()">保存</button>
        <button class="tool-btn" onclick="Notepad.clear()">清除</button>
        <span class="tool-toolbar-status" id="notepad-count">0 字 / 1 行</span>
      </div>
      <div class="notepad-body">
        <div class="notepad-lines" id="notepad-lines">1\n</div>
        <textarea class="notepad-area" id="notepad-area" placeholder="随手记录..." spellcheck="false"></textarea>
      </div>`;

    init();
  }

  function togglePin() {
    isPinned = !isPinned;
    localStorage.setItem(PIN_KEY, isPinned ? '1' : '');
    if (isPinned && !ToolWindow.isOpen()) {
      ToolWindow.openWindow('notepad');
    }
  }

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
    count.textContent = `${t.length} 字 / ${t.split('\n').length} 行`;
  }

  function clear() {
    const { area } = getEls();
    if (!area || !confirm('清除所有记事本内容？')) return;
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

  function saveToFile() {
    const { area } = getEls();
    if (!area) return;
    const text = area.value;
    if (!text.trim()) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const ts = now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') + '_' +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0');
    a.download = `notepad_${ts}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function init() {
    if (initialized) return;
    const { area, lines } = getEls();
    if (!area) return;
    initialized = true;

    isPinned = localStorage.getItem(PIN_KEY) === '1';
    area.value = localStorage.getItem(NOTEPAD_KEY) || '';

    area.addEventListener('input', () => {
      localStorage.setItem(NOTEPAD_KEY, area.value);
      updateLineNumbers();
      updateCharCount();
    });

    area.addEventListener('scroll', () => {
      if (lines) lines.scrollTop = area.scrollTop;
    });

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

    updateLineNumbers();
    updateCharCount();
  }

  return { createPanel, init, clear, selectAll, togglePin, saveToFile };
})();


/* ===== AIChat: AI conversation module (no window management) ===== */
const AIChat = (() => {
  const KEYS = {
    provider: 'yaoguayi_ai_provider',
    key: 'yaoguayi_ai_key',
    base: 'yaoguayi_ai_base',
    model: 'yaoguayi_ai_model'
  };

  const DEFAULT_MODELS = {
    agnes: 'agnes-2.0-flash',
    openai: 'gpt-4o-mini',
    anthropic: 'claude-3-haiku-20240307',
    custom: ''
  };

  const DEFAULT_BASES = {
    agnes: 'https://apihub.agnes-ai.com/v1',
    openai: 'https://api.openai.com/v1',
    anthropic: '',
    custom: ''
  };

  let messages = [];
  let isStreaming = false;
  let abortController = null;
  let currentHexData = null;
  let pendingImage = null;
  let panelEl = null;

  function createPanel(container) {
    if (!container) return;
    panelEl = container;

    const isAdmin = typeof YaoguayiAuth !== 'undefined' && YaoguayiAuth.isAdmin();
    const hasHexContext = location.pathname.includes('hexagram.html');

    container.innerHTML = `
      <div class="tool-toolbar">
        <button class="tool-btn" onclick="AIChat.saveChatToFile()" title="保存对话">保存</button>
        <button class="tool-btn" onclick="AIChat.clearChat()" title="清除对话">清除</button>
      </div>
      <div id="ai-config-admin" style="display:${isAdmin ? '' : 'none'};">
        <div class="ai-config-section">
          <div class="ai-config-header" onclick="AIChat.toggleExpand()">
            <span id="ai-config-toggle">▾</span>
            <span class="ai-config-label">AI 接口配置（管理员）</span>
            <span class="ai-status" id="ai-status">未配置</span>
          </div>
          <div class="ai-config-body" id="ai-config-body">
            <div class="ai-form">
              <div class="ai-field"><label class="ai-label">供应商</label>
                <select class="ai-select" id="ai-provider" onchange="AIChat.onProviderChange()"><option value="agnes">Agnes AI</option><option value="openai">OpenAI</option><option value="anthropic">Anthropic</option><option value="custom">自定义</option></select></div>
              <div class="ai-field"><label class="ai-label">模型</label>
                <input class="ai-input" id="ai-model" placeholder="模型名称"></div>
              <div class="ai-field"><label class="ai-label">API Key</label>
                <div class="ai-key-row"><input class="ai-input" id="ai-key" type="password" placeholder="sk-..."><button class="ai-key-toggle" id="ai-key-toggle" onclick="AIChat.toggleKey()">显示</button></div></div>
              <div class="ai-field"><label class="ai-label">Base URL</label>
                <input class="ai-input" id="ai-base" placeholder="https://..."></div>
              <div class="ai-actions">
                <button class="ai-btn primary" onclick="AIChat.saveSettings()">保存配置</button>
                <button class="ai-btn" onclick="AIChat.clearSettings()">重置</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ai-chat-context">
        <label><input type="checkbox" id="ai-include-context" ${hasHexContext ? 'checked' : ''}> 获取${hasHexContext ? '此卦' : '网站'}信息</label>
      </div>
      <div class="ai-chat-area">
        <div class="ai-chat-messages" id="ai-chat-messages">
          <div class="ai-chat-empty">输入问题，AI 为你解读卦象...</div>
        </div>
        <div class="ai-chat-input-row">
          <textarea class="ai-chat-input" id="ai-chat-input" placeholder="输入消息..." rows="1"></textarea>
          <button class="ai-chat-send" id="ai-chat-send" onclick="AIChat.send()" title="发送">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
          <button class="ai-chat-stop" id="ai-chat-stop" onclick="AIChat.stopStreaming()" title="停止">
            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
          </button>
        </div>
      </div>`;

    if (isAdmin) {
      const settings = loadSettings();
      const p = document.getElementById('ai-provider');
      const k = document.getElementById('ai-key');
      const b = document.getElementById('ai-base');
      const m = document.getElementById('ai-model');
      if (p) { p.value = settings.provider; p.addEventListener('change', onProviderChange); }
      if (k) k.value = settings.key;
      if (b) { b.value = settings.base; b.placeholder = DEFAULT_BASES[settings.provider] || 'https://...'; }
      if (m) { m.value = settings.model; m.placeholder = DEFAULT_MODELS[settings.provider] || '模型名称'; }
      updateStatus();
      if (settings.key) {
        const body = document.getElementById('ai-config-body');
        const icon = document.getElementById('ai-config-toggle');
        if (body) body.classList.add('collapsed');
        if (icon) icon.textContent = '▸';
      }
    }

    const input = document.getElementById('ai-chat-input');
    if (input) {
      input.addEventListener('keydown', handleInputKey);
      input.addEventListener('paste', handlePaste);
      input.addEventListener('input', onInputChange);
      input.addEventListener('blur', () => setTimeout(hideSlashMenu, 150));
    }
  }

  function loadSettings() {
    const provider = localStorage.getItem(KEYS.provider) || 'agnes';
    return {
      provider,
      key: localStorage.getItem(KEYS.key) || '',
      base: localStorage.getItem(KEYS.base) || DEFAULT_BASES[provider] || '',
      model: localStorage.getItem(KEYS.model) || DEFAULT_MODELS[provider] || ''
    };
  }

  function saveSettings() {
    const p = document.getElementById('ai-provider');
    const k = document.getElementById('ai-key');
    const b = document.getElementById('ai-base');
    const m = document.getElementById('ai-model');
    const s = document.getElementById('ai-status');
    if (p) localStorage.setItem(KEYS.provider, p.value);
    if (k) localStorage.setItem(KEYS.key, k.value);
    if (b) localStorage.setItem(KEYS.base, b.value);
    if (m) localStorage.setItem(KEYS.model, m.value);
    if (s) { s.textContent = '已保存至浏览器'; s.className = 'ai-status saved'; setTimeout(updateStatus, 1500); }
    const body = document.getElementById('ai-config-body');
    const icon = document.getElementById('ai-config-toggle');
    if (body) body.classList.add('collapsed');
    if (icon) icon.textContent = '▸';
  }

  function clearSettings() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    const p = document.getElementById('ai-provider');
    const k = document.getElementById('ai-key');
    const b = document.getElementById('ai-base');
    const m = document.getElementById('ai-model');
    if (p) p.value = 'agnes';
    if (k) k.value = '';
    if (b) b.value = DEFAULT_BASES.agnes;
    if (m) m.value = DEFAULT_MODELS.agnes;
    updateStatus();
  }

  function updateStatus() {
    const s = document.getElementById('ai-status');
    if (!s) return;
    const key = localStorage.getItem(KEYS.key);
    s.textContent = key ? '已配置' : '未配置';
    s.className = key ? 'ai-status configured' : 'ai-status';
  }

  function toggleKey() {
    const k = document.getElementById('ai-key');
    const t = document.getElementById('ai-key-toggle');
    if (!k || !t) return;
    k.type = k.type === 'password' ? 'text' : 'password';
    t.textContent = k.type === 'password' ? '显示' : '隐藏';
  }

  function toggleExpand() {
    const body = document.getElementById('ai-config-body');
    const icon = document.getElementById('ai-config-toggle');
    if (!body) return;
    const collapsed = body.classList.toggle('collapsed');
    if (icon) icon.textContent = collapsed ? '▸' : '▾';
  }

  function onProviderChange() {
    const p = document.getElementById('ai-provider');
    const m = document.getElementById('ai-model');
    const b = document.getElementById('ai-base');
    if (!p) return;
    const pv = p.value;
    const allDefaults = Object.values(DEFAULT_MODELS);
    if (m && (!m.value || allDefaults.includes(m.value))) {
      m.value = DEFAULT_MODELS[pv] || '';
    }
    const allBases = Object.values(DEFAULT_BASES);
    if (b && (!b.value || allBases.includes(b.value))) {
      b.value = DEFAULT_BASES[pv] || '';
    }
    if (m) m.placeholder = DEFAULT_MODELS[pv] || '模型名称';
    if (b) b.placeholder = DEFAULT_BASES[pv] || 'https://...';
  }

  const SITE_OVERVIEW = [
    '【关于本网站】',
    '爻卦易 (yaoguayi.com) 是一个在线《周易》六十四卦查阅工具，主要功能：',
    '- 六十四卦完整原文（卦辞、彖传、大象传、爻辞、小象传）',
    '- 每段原文附白话译文',
    '- 文字拼音标注，辅助古文阅读',
    '- 日间/夜间主题切换',
    '- AI 对话助手，可基于卦象内容答疑解惑',
    '',
    '【变爻断卦法】（朱熹《易学启蒙》七条规则）',
    '用户卜筮得卦后，根据变爻（老阳、老阴所化之爻）数量决定解法：',
    '1. 无变爻 → 看本卦卦辞',
    '2. 一个变爻 → 看本卦该变爻的爻辞',
    '3. 两个变爻 → 看本卦两个变爻的爻辞，以上爻为主',
    '4. 三个变爻 → 看本卦卦辞与变卦卦辞，以本卦为主',
    '5. 四个变爻 → 看变卦中两个不变爻的爻辞，以下爻为主',
    '6. 五个变爻 → 看变卦中唯一不变爻的爻辞',
    '7. 六爻皆变 → 乾卦看"用九"、坤卦看"用六"，其余看变卦卦辞',
    '（变卦：将所有变爻阴阳互换后得到的新卦）',
    ''
  ].join('\n');

  function buildSystemPrompt() {
    const cb = document.getElementById('ai-include-context');
    if (!cb || !cb.checked || !currentHexData) {
      return '你是「爻卦易」的 AI 助手，精通《周易》。\n' + SITE_OVERVIEW +
        '回答用户关于周易、卦象的问题。如用户使用中文提问，请用中文回答；如使用英文，请用英文回答。';
    }
    const h = currentHexData;
    let prompt = '你是「爻卦易」的 AI 助手，精通《周易》。\n' + SITE_OVERVIEW;
    prompt += `当前用户正在查看第${h.id}卦「${h.name}」(${h.pinyin})。\n`;
    prompt += `卦符: ${String.fromCodePoint(0x4DBF + h.id)}\n`;
    prompt += `上卦: ${h.upperTrigram}，下卦: ${h.lowerTrigram}\n\n`;
    prompt += `以下是该卦的完整内容：\n\n`;
    prompt += `【卦辞】${h.guaci}\n`;
    if (h.guaci_trans) prompt += `译文：${h.guaci_trans}\n`;
    prompt += `\n【彖传】${h.tuan || '无'}\n`;
    if (h.tuan_trans) prompt += `译文：${h.tuan_trans}\n`;
    prompt += `\n【大象传】${h.xiang || '无'}\n`;
    if (h.xiang_trans) prompt += `译文：${h.xiang_trans}\n`;
    if (h.yaoci && h.yaoci.length > 0) {
      prompt += `\n【爻辞】\n`;
      h.yaoci.forEach(y => {
        prompt += `${y.name}：${y.text}\n`;
        if (y.text_trans) prompt += `  译文：${y.text_trans}\n`;
        if (y.xiang) prompt += `  小象传：${y.xiang}\n`;
        if (y.xiang_trans) prompt += `  小象译文：${y.xiang_trans}\n`;
      });
    }
    prompt += `\n请基于以上内容回答用户的问题。回答时优先引用原文。如用户使用中文提问，请用中文回答；如使用英文，请用英文回答。`;
    return prompt;
  }

  function renderMessage(msg) {
    const cls = msg.role === 'user' ? 'ai-msg ai-msg-user' : 'ai-msg ai-msg-assistant';
    let html = '';
    if (msg.image) {
      html += `<img class="ai-msg-img" src="data:${msg.image.mediaType};base64,${msg.image.base64}" alt="image">`;
    }
    html += escapeHtml(msg.content)
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
    return `<div class="${cls}">${html}</div>`;
  }

  function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  function renderMessages() {
    const list = document.getElementById('ai-chat-messages');
    if (!list) return;
    if (messages.length === 0) {
      list.innerHTML = '<div class="ai-chat-empty">输入问题，AI 为你解读卦象...</div>';
      return;
    }
    list.innerHTML = messages.map(renderMessage).join('');
    list.scrollTop = list.scrollHeight;
  }

  function appendToLastMessage(text) {
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant') return;
    last.content += text;
    const list = document.getElementById('ai-chat-messages');
    if (!list) return;
    const lastEl = list.querySelector('.ai-msg-assistant:last-child');
    if (lastEl) {
      const content = escapeHtml(last.content)
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
      lastEl.innerHTML = content;
      list.scrollTop = list.scrollHeight;
    }
  }

  /* Slash commands */
  const SLASH_COMMANDS = [
    { cmd: '/clear',   desc: '清除全部对话',         fn: cmdClear },
    { cmd: '/compact', desc: '仅保留最近几条消息',   fn: cmdCompact },
    { cmd: '/help',    desc: '显示可用命令列表',      fn: cmdHelp }
  ];

  function addSystemMsg(text) {
    const list = document.getElementById('ai-chat-messages');
    if (!list) return;
    const empty = list.querySelector('.ai-chat-empty');
    if (empty) empty.remove();
    const div = document.createElement('div');
    div.className = 'ai-system-msg';
    div.textContent = text;
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
  }

  function cmdClear() {
    messages = [];
    renderMessages();
    addSystemMsg('对话已清除');
  }

  function cmdCompact() {
    if (messages.length <= 6) {
      addSystemMsg('消息较少，无需压缩');
      return;
    }
    const removed = messages.length - 6;
    messages = messages.slice(-6);
    renderMessages();
    addSystemMsg(`已压缩：移除了前 ${removed} 条消息，保留最近 6 条`);
  }

  function cmdHelp() {
    const lines = SLASH_COMMANDS.map(c => `${c.cmd}  —  ${c.desc}`).join('\n');
    addSystemMsg('可用命令：\n' + lines);
  }

  function handleSlashCommand(text) {
    if (!text.startsWith('/')) return false;
    const cmd = text.split(/\s/)[0].toLowerCase();
    const match = SLASH_COMMANDS.find(c => c.cmd === cmd);
    if (match) { match.fn(); return true; }
    addSystemMsg(`未知命令: ${cmd}，输入 /help 查看可用命令`);
    return true;
  }

  /* Slash menu popup */
  let slashMenuEl = null;

  function createSlashMenu() {
    if (slashMenuEl) return slashMenuEl;
    const el = document.createElement('div');
    el.className = 'ai-slash-menu';
    el.style.display = 'none';
    SLASH_COMMANDS.forEach(c => {
      const item = document.createElement('div');
      item.className = 'ai-slash-item';
      item.innerHTML = `<span class="ai-slash-cmd">${c.cmd}</span><span class="ai-slash-desc">${c.desc}</span>`;
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const input = document.getElementById('ai-chat-input');
        if (input) { input.value = c.cmd; }
        hideSlashMenu();
        c.fn();
        if (input) input.value = '';
      });
      el.appendChild(item);
    });
    const inputRow = panelEl && panelEl.querySelector('.ai-chat-input-row');
    if (inputRow) inputRow.parentNode.insertBefore(el, inputRow);
    slashMenuEl = el;
    return el;
  }

  function showSlashMenu(filter) {
    const menu = createSlashMenu();
    const items = menu.querySelectorAll('.ai-slash-item');
    let anyVisible = false;
    items.forEach((item, i) => {
      const show = !filter || SLASH_COMMANDS[i].cmd.startsWith(filter);
      item.style.display = show ? '' : 'none';
      if (show) anyVisible = true;
    });
    menu.style.display = anyVisible ? '' : 'none';
  }

  function hideSlashMenu() {
    if (slashMenuEl) slashMenuEl.style.display = 'none';
  }

  function onInputChange(e) {
    const val = e.target.value;
    if (val.startsWith('/') && !val.includes(' ')) {
      showSlashMenu(val.toLowerCase());
    } else {
      hideSlashMenu();
    }
  }

  async function send() {
    const input = document.getElementById('ai-chat-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text || isStreaming) return;
    hideSlashMenu();

    if (handleSlashCommand(text)) {
      input.value = '';
      return;
    }

    const settings = loadSettings();
    const hasLocalKey = settings.key && YaoguayiAuth.isAdmin();

    const userMsg = { role: 'user', content: text };
    if (pendingImage) {
      userMsg.image = pendingImage;
      pendingImage = null;
      removeImagePreview();
    }
    messages.push(userMsg);
    input.value = '';
    renderMessages();
    setStreaming(true);

    messages.push({ role: 'assistant', content: '' });
    renderMessages();
    const chatList = document.getElementById('ai-chat-messages');
    const typingEl = chatList && chatList.querySelector('.ai-msg-assistant:last-child');
    if (typingEl) typingEl.innerHTML = '<span class="ai-typing"><span>·</span><span>·</span><span>·</span></span>';

    try {
      abortController = new AbortController();
      const systemPrompt = buildSystemPrompt();

      if (hasLocalKey) {
        if (settings.provider === 'anthropic') {
          await streamAnthropic(settings, systemPrompt);
        } else {
          await streamOpenAI(settings, systemPrompt);
        }
      } else {
        await streamViaProxy(systemPrompt);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        appendToLastMessage('\n[已停止]');
      } else {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
          lastMsg.content = `错误: ${err.message}`;
        } else {
          appendToLastMessage(`\n\n错误: ${err.message}`);
        }
        renderMessages();
      }
    } finally {
      setStreaming(false);
      abortController = null;
    }
  }

  async function streamViaProxy(systemPrompt) {
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.filter(m => m.content).map(m => {
        if (m.image) {
          return { role: m.role, content: [
            { type: 'image_url', image_url: { url: `data:${m.image.mediaType};base64,${m.image.base64}` } },
            { type: 'text', text: m.content }
          ]};
        }
        return { role: m.role, content: m.content };
      })
    ];

    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages, stream: true }),
      signal: abortController.signal
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => resp.statusText);
      throw new Error(`API ${resp.status}: ${errText}`);
    }

    await readSSEStream(resp);
  }

  async function streamOpenAI(settings, systemPrompt) {
    const baseUrl = (settings.base || DEFAULT_BASES.openai).replace(/\/+$/, '');
    const model = settings.model || DEFAULT_MODELS[settings.provider] || DEFAULT_MODELS.openai;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.filter(m => m.content).map(m => {
        if (m.image) {
          return { role: m.role, content: [
            { type: 'image_url', image_url: { url: `data:${m.image.mediaType};base64,${m.image.base64}` } },
            { type: 'text', text: m.content }
          ]};
        }
        return { role: m.role, content: m.content };
      })
    ];

    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.key}`
      },
      body: JSON.stringify({ model, messages: apiMessages, stream: true }),
      signal: abortController.signal
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => resp.statusText);
      throw new Error(`API ${resp.status}: ${errText}`);
    }

    await readSSEStream(resp);
  }

  async function streamAnthropic(settings, systemPrompt) {
    const baseUrl = (settings.base || 'https://api.anthropic.com').replace(/\/+$/, '');
    const model = settings.model || DEFAULT_MODELS.anthropic;

    const apiMessages = messages
      .filter(m => m.content)
      .map(m => {
        if (m.image) {
          return { role: m.role, content: [
            { type: 'image', source: { type: 'base64', media_type: m.image.mediaType, data: m.image.base64 } },
            { type: 'text', text: m.content }
          ]};
        }
        return { role: m.role, content: m.content };
      });

    const resp = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: apiMessages,
        stream: true
      }),
      signal: abortController.signal
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => resp.statusText);
      throw new Error(`API ${resp.status}: ${errText}`);
    }

    await readAnthropicStream(resp);
  }

  async function readSSEStream(resp) {
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') return;
        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) appendToLastMessage(delta);
        } catch { /* skip malformed chunks */ }
      }
    }
  }

  async function readAnthropicStream(resp) {
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        try {
          const json = JSON.parse(data);
          if (json.type === 'content_block_delta' && json.delta?.text) {
            appendToLastMessage(json.delta.text);
          }
        } catch { /* skip */ }
      }
    }
  }

  function setStreaming(val) {
    isStreaming = val;
    const btn = document.getElementById('ai-chat-send');
    const stop = document.getElementById('ai-chat-stop');
    const input = document.getElementById('ai-chat-input');
    if (btn) btn.style.display = val ? 'none' : '';
    if (stop) stop.style.display = val ? '' : 'none';
    if (input) input.disabled = val;
  }

  function stopStreaming() {
    if (abortController) abortController.abort();
  }

  function clearChat() {
    messages = [];
    renderMessages();
  }

  function setHexData(hex) {
    currentHexData = hex;
  }

  function saveChatToFile() {
    if (messages.length === 0) return;
    const now = new Date();
    const dateStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0');
    const ts = dateStr.replace(/[- :]/g, '').replace(' ', '_');

    let pageInfo = '爻卦易';
    if (currentHexData) {
      pageInfo = `第${currentHexData.id}卦 · ${currentHexData.name}`;
    }

    let text = `爻卦易 AI 对话记录\n日期：${dateStr}\n页面：${pageInfo}\n`;
    text += '─'.repeat(40) + '\n\n';
    messages.forEach(m => {
      const label = m.role === 'user' ? '[我]' : '[AI]';
      text += `${label} ${m.content}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_chat_${ts}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handlePaste(e) {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          const mediaType = file.type || 'image/png';
          const base64 = dataUrl.split(',')[1];
          pendingImage = { base64, mediaType };
          showImagePreview(dataUrl);
        };
        reader.readAsDataURL(file);
        return;
      }
    }
  }

  function showImagePreview(dataUrl) {
    removeImagePreview();
    const preview = document.createElement('div');
    preview.className = 'ai-image-preview';
    preview.id = 'ai-image-preview';
    preview.innerHTML = `<img src="${dataUrl}" alt="preview"><button class="ai-image-remove" onclick="AIChat.removeImage()" title="移除图片">×</button>`;
    const inputRow = panelEl && panelEl.querySelector('.ai-chat-input-row');
    if (inputRow) inputRow.parentNode.insertBefore(preview, inputRow);
  }

  function removeImagePreview() {
    const el = document.getElementById('ai-image-preview');
    if (el) el.remove();
  }

  function removeImage() {
    pendingImage = null;
    removeImagePreview();
  }

  function handleInputKey(e) {
    if (e.key === 'Escape') {
      hideSlashMenu();
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return {
    createPanel, saveSettings, clearSettings, toggleKey, toggleExpand,
    send, stopStreaming, clearChat, setHexData, onProviderChange,
    removeImage, saveChatToFile
  };
})();


/* ===== Auto-init ToolWindow on DOMContentLoaded ===== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { ToolWindow.init(); });
} else {
  ToolWindow.init();
}
