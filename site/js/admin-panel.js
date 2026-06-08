/**
 * admin-panel.js — Admin panel + floating notepad + AI chat modules
 *
 * Three independent modules:
 * 1. AdminPanel: Right-side admin panel (admin-only via wrench icon)
 *    - Dynamic section IDs with hexagram-specific content index
 *    - Global unique IDs: H{nn}-{sec} for hexagram pages, I-{sec} for index
 * 2. Notepad: Draggable floating window (all users)
 *    - Quick text editor with line numbers, auto-save to localStorage
 *    - Pin mode: stays visible across page navigations
 *    - Save to text file
 * 3. AIChat: AI conversation panel inside the glossary side-panel
 *    - Configurable provider/key/model, streaming API calls
 *    - Optional site content as system prompt context
 */

/* ===== AdminPanel: admin-only section IDs ===== */
const AdminPanel = (() => {
  let isOpen = false;
  let currentHex = null; // set by updateSectionList(hex)

  function open() {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;

    isOpen = true;
    panel.classList.add('open');
    document.body.classList.add('admin-panel-open');

    // Open glossary panel alongside (side by side) on hexagram pages
    if (typeof SidePanel !== 'undefined' && !SidePanel.isOpen && getPageType() === 'hexagram') {
      SidePanel.toggle();
    }

    // Hide the glossary panel trigger (both panels are open)
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

    // Close the glossary panel too (they open/close as a pair)
    if (typeof SidePanel !== 'undefined' && SidePanel.isOpen) {
      SidePanel.close();
    }

    // Restore the glossary panel trigger
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

  /** Get zero-padded hex ID for global section IDs */
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

  /** Dynamically scan index.html for sections based on actual DOM */
  function buildIndexSections() {
    const sections = [];
    let n = 1;
    const pad = () => 'I-' + String(n++).padStart(2, '0');

    // Cover area
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

    // Hexagram grid
    if (document.getElementById('hexagrams')) {
      sections.push({ id: pad(), name: '六十四卦', selector: '#hexagrams' });
    }

    // Knowledge / learn cards
    if (document.getElementById('learn')) {
      sections.push({ id: pad(), name: '读易', selector: '#learn' });
      // Detect individual knowledge cards
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

    // Footer
    if (document.getElementById('site-footer')) {
      sections.push({ id: pad(), name: '页脚', selector: '#site-footer' });
    }

    return sections;
  }

  /** Dynamically scan learn.html for sections */
  function buildLearnSections() {
    const sections = [];
    let n = 1;
    const pad = () => 'L-' + String(n++).padStart(2, '0');

    // Sidebar TOC
    if (document.getElementById('learn-sidebar')) {
      sections.push({ id: pad(), name: '侧边目录', selector: '#learn-sidebar' });
    }

    // Each article
    document.querySelectorAll('.knowledge-article').forEach(article => {
      const heading = article.querySelector('h2');
      const aId = article.id || '';
      if (heading) {
        sections.push({ id: pad(), name: heading.textContent.trim(), selector: '#' + aId });
        // Sub-sections
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

    // Footer
    if (document.getElementById('site-footer')) {
      sections.push({ id: pad(), name: '页脚', selector: '#site-footer' });
    }

    return sections;
  }

  /**
   * Build dynamic section list for hexagram pages.
   * Uses globally unique IDs: H{nn}-{sec} format.
   * Includes hexagram name prefix and yaoci sub-items.
   */
  function buildHexagramSections() {
    const prefix = currentHex ? currentHex.name : '';
    const hp = getHexPrefix(); // e.g. H01, H02, ...H64
    const sections = [
      { id: `${hp}-01`, name: `${prefix} · 卦象图`, selector: '.hex-sidebar' },
      { id: `${hp}-02`, name: `${prefix} · 卦辞`, selector: '.hex-content .section:nth-child(1)' },
      { id: `${hp}-03`, name: `${prefix} · 彖传`, selector: '.hex-content .section:nth-child(2)' },
      { id: `${hp}-04`, name: `${prefix} · 大象传`, selector: '.hex-content .section:nth-child(3)' },
      { id: `${hp}-05`, name: `${prefix} · 爻辞`, selector: '.hex-content .section:nth-child(4)' }
    ];

    // Add yaoci sub-items from DOM
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

  /**
   * Dynamically update the section list HTML inside the admin panel.
   * Called after renderHexagram() with the hex data object.
   */
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
  }

  function injectBadges() {
    removeBadges();
    getSections().forEach(sec => {
      if (sec.indent) return; // skip sub-items for main badges
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

    // Also add badges for yaoci sub-items
    if (currentHex && currentHex.yaoci) {
      const hp = getHexPrefix();
      currentHex.yaoci.forEach(y => {
        const el = document.querySelector(`#yao-${y.position}`);
        if (!el) return;
        if (getComputedStyle(el).position === 'static') {
          el.style.position = 'relative';
          el.dataset.adminResetPos = 'true';
        }
        const badge = document.createElement('div');
        badge.className = 'section-badge section-badge-sub';
        badge.textContent = `${hp}-05-${y.position}`;
        badge.title = `${currentHex.name} · ${y.name}`;
        el.appendChild(badge);
      });
    }
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

    // For non-hexagram pages, populate sections after dynamic content loads
    const page = getPageType();
    if (page === 'index' || page === 'learn') {
      // Delay slightly so fetch-based dynamic content (knowledge cards, articles) is rendered
      setTimeout(() => updateSectionList(null), 500);
    }

    // Ctrl+Shift+A shortcut
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggle();
      }
    });
  }

  return { init, open, close, toggle, scrollToSection, updateSectionList };
})();


/* ===== Notepad: floating draggable window (all users) ===== */
const Notepad = (() => {
  const NOTEPAD_KEY = 'yaoguayi_notepad';
  const PIN_KEY = 'yaoguayi_notepad_pin';
  const POS_KEY = 'yaoguayi_notepad_pos';
  let isVisible = false;
  let isPinned = false;
  let isDragging = false;
  let dragOffsetX = 0, dragOffsetY = 0;
  let initialized = false;

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

  function togglePin() {
    isPinned = !isPinned;
    localStorage.setItem(PIN_KEY, isPinned ? '1' : '');
    updatePinButton();
    if (isPinned && !isVisible) show();
  }

  function updatePinButton() {
    const btn = document.getElementById('notepad-pin-btn');
    if (!btn) return;
    btn.title = isPinned ? '取消固定' : '固定显示';
    btn.classList.toggle('active', isPinned);
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

  /** Save notepad content as a .txt file download */
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

    // Save position to localStorage for persistence across page navigations
    const { win } = getEls();
    if (win) {
      const rect = win.getBoundingClientRect();
      localStorage.setItem(POS_KEY, JSON.stringify({
        left: rect.left,
        top: rect.top
      }));
    }
  }

  function init() {
    if (initialized) return;
    const { win, area, lines } = getEls();
    if (!area) return;
    initialized = true;

    // Load saved content
    area.value = localStorage.getItem(NOTEPAD_KEY) || '';

    // Load pin state
    isPinned = localStorage.getItem(PIN_KEY) === '1';
    updatePinButton();

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

    // Restore saved position if previously dragged
    const savedPos = localStorage.getItem(POS_KEY);
    if (savedPos && win) {
      try {
        const pos = JSON.parse(savedPos);
        // Clamp to viewport bounds
        const maxX = window.innerWidth - win.offsetWidth;
        const maxY = window.innerHeight - win.offsetHeight;
        const x = Math.max(0, Math.min(pos.left, maxX));
        const y = Math.max(0, Math.min(pos.top, maxY));
        win.style.left = x + 'px';
        win.style.top = y + 'px';
        win.style.right = 'auto';
        win.style.bottom = 'auto';
      } catch { /* ignore invalid JSON */ }
    }

    updateLineNumbers();
    updateCharCount();

    // If pinned, auto-show on page load
    if (isPinned) show();
  }

  return { init, show, hide, toggle, clear, selectAll, togglePin, saveToFile };
})();


/* ===== AIChat: conversation panel in side-panel ===== */
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

  let messages = []; // conversation history [{role, content}]
  let isStreaming = false;
  let abortController = null;
  let currentHexData = null; // set externally
  let pendingImage = null;   // {base64, mediaType} waiting to be sent

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
    // Auto-collapse config after save
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

  /** Update model/base defaults when provider changes */
  function onProviderChange() {
    const p = document.getElementById('ai-provider');
    const m = document.getElementById('ai-model');
    const b = document.getElementById('ai-base');
    if (!p) return;
    const pv = p.value;
    // If model is empty or was a default from another provider, replace with new default
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

  /** Site overview blurb (lightweight, avoids bloating context) */
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

  /** Build system prompt with hexagram content */
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

  /** Render a single message into HTML */
  function renderMessage(msg) {
    const cls = msg.role === 'user' ? 'ai-msg ai-msg-user' : 'ai-msg ai-msg-assistant';
    let html = '';
    // Show image thumbnail for user messages with images
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

  /** Refresh the chat message list */
  function renderMessages() {
    const list = document.getElementById('ai-chat-messages');
    if (!list) return;
    if (messages.length === 0) {
      list.innerHTML = '<div class="ai-chat-empty">询问关于此卦的问题...</div>';
      return;
    }
    list.innerHTML = messages.map(renderMessage).join('');
    list.scrollTop = list.scrollHeight;
  }

  /** Append text to the last assistant message (streaming) */
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

  /* ---- Slash commands ---- */
  const SLASH_COMMANDS = [
    { cmd: '/clear',   desc: '清除全部对话',         fn: cmdClear },
    { cmd: '/compact', desc: '仅保留最近几条消息',   fn: cmdCompact },
    { cmd: '/help',    desc: '显示可用命令列表',      fn: cmdHelp }
  ];

  /** Insert a local system notice into the chat (not sent to API) */
  function addSystemMsg(text) {
    const list = document.getElementById('ai-chat-messages');
    if (!list) return;
    // Remove empty-state placeholder if present
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

  /** Try to handle a slash command; returns true if handled */
  function handleSlashCommand(text) {
    if (!text.startsWith('/')) return false;
    const cmd = text.split(/\s/)[0].toLowerCase();
    const match = SLASH_COMMANDS.find(c => c.cmd === cmd);
    if (match) { match.fn(); return true; }
    addSystemMsg(`未知命令: ${cmd}，输入 /help 查看可用命令`);
    return true;
  }

  /* ---- Slash menu popup ---- */
  let slashMenuEl = null;

  function createSlashMenu() {
    if (slashMenuEl) return slashMenuEl;
    const el = document.createElement('div');
    el.className = 'ai-slash-menu';
    el.style.display = 'none';
    // Build items
    SLASH_COMMANDS.forEach(c => {
      const item = document.createElement('div');
      item.className = 'ai-slash-item';
      item.innerHTML = `<span class="ai-slash-cmd">${c.cmd}</span><span class="ai-slash-desc">${c.desc}</span>`;
      item.addEventListener('mousedown', (e) => {
        e.preventDefault(); // keep focus on input
        const input = document.getElementById('ai-chat-input');
        if (input) { input.value = c.cmd; }
        hideSlashMenu();
        c.fn();
        if (input) input.value = '';
      });
      el.appendChild(item);
    });
    // Insert before input row
    const inputRow = document.querySelector('.ai-chat-input-row');
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

  /** Send message to AI */
  async function send() {
    const input = document.getElementById('ai-chat-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text || isStreaming) return;
    hideSlashMenu();

    // Handle slash commands locally
    if (handleSlashCommand(text)) {
      input.value = '';
      return;
    }

    const settings = loadSettings();
    if (!settings.key) {
      toggleExpand(); // show settings if collapsed
      const s = document.getElementById('ai-status');
      if (s) { s.textContent = '请先配置 API 密钥'; s.className = 'ai-status'; }
      return;
    }

    // Add user message (with optional image)
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

    // Add empty assistant message placeholder with typing indicator
    messages.push({ role: 'assistant', content: '' });
    renderMessages();
    // Show typing dots until first content arrives
    const chatList = document.getElementById('ai-chat-messages');
    const typingEl = chatList && chatList.querySelector('.ai-msg-assistant:last-child');
    if (typingEl) typingEl.innerHTML = '<span class="ai-typing"><span>·</span><span>·</span><span>·</span></span>';

    try {
      abortController = new AbortController();
      const systemPrompt = buildSystemPrompt();

      if (settings.provider === 'anthropic') {
        await streamAnthropic(settings, systemPrompt);
      } else {
        await streamOpenAI(settings, systemPrompt);
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

  /** Stream from OpenAI-compatible API */
  async function streamOpenAI(settings, systemPrompt) {
    const baseUrl = (settings.base || DEFAULT_BASES.openai).replace(/\/+$/, '');
    const model = settings.model || DEFAULT_MODELS[settings.provider] || DEFAULT_MODELS.openai;

    // Build API messages: system prompt + all messages with content (excludes empty assistant placeholder)
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.filter(m => m.content).map(m => {
        if (m.image) {
          // OpenAI vision format: content array with text + image_url
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
      body: JSON.stringify({
        model,
        messages: apiMessages,
        stream: true
      }),
      signal: abortController.signal
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => resp.statusText);
      throw new Error(`API ${resp.status}: ${errText}`);
    }

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

  /** Stream from Anthropic API */
  async function streamAnthropic(settings, systemPrompt) {
    const baseUrl = (settings.base || 'https://api.anthropic.com').replace(/\/+$/, '');
    const model = settings.model || DEFAULT_MODELS.anthropic;

    // Anthropic: system is separate, messages are user/assistant only (excludes empty placeholder)
    const apiMessages = messages
      .filter(m => m.content)
      .map(m => {
        if (m.image) {
          // Anthropic vision format: content array with image + text
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

  /** Handle image paste from clipboard */
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
    const inputRow = document.querySelector('.ai-chat-input-row');
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

  function init() {
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

    // Auto-collapse settings if already configured
    if (settings.key) {
      const body = document.getElementById('ai-config-body');
      const icon = document.getElementById('ai-config-toggle');
      if (body) body.classList.add('collapsed');
      if (icon) icon.textContent = '▸';
    }

    // Chat input
    const input = document.getElementById('ai-chat-input');
    if (input) {
      input.addEventListener('keydown', handleInputKey);
      input.addEventListener('paste', handlePaste);
      input.addEventListener('input', onInputChange);
      input.addEventListener('blur', () => setTimeout(hideSlashMenu, 150));
    }

    renderMessages();
  }

  return {
    init, saveSettings, clearSettings, toggleKey, toggleExpand,
    send, stopStreaming, clearChat, setHexData, onProviderChange,
    removeImage
  };
})();


/* ===== Auto-init Notepad on DOMContentLoaded (works for all users) ===== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { Notepad.init(); });
} else {
  Notepad.init();
}
