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

    // Close the glossary side panel first to avoid visual overlap
    if (typeof SidePanel !== 'undefined' && SidePanel.isOpen) {
      SidePanel.close();
    }

    isOpen = true;
    panel.classList.add('open');
    document.body.classList.add('admin-panel-open');

    // Hide the glossary panel trigger
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

    // Restore the glossary panel trigger
    const trigger = document.getElementById('panel-trigger');
    if (trigger) trigger.style.display = '';

    removeBadges();
  }

  function toggle() { isOpen ? close() : open(); }

  function getPageType() {
    return location.pathname.includes('hexagram.html') ? 'hexagram' : 'index';
  }

  /** Get zero-padded hex ID for global section IDs */
  function getHexPrefix() {
    if (!currentHex || !currentHex.id) return 'H00';
    return 'H' + String(currentHex.id).padStart(2, '0');
  }

  function getSections() {
    if (getPageType() === 'hexagram') {
      return buildHexagramSections();
    }
    return [
      { id: 'I-01', name: '封面区', selector: '.cover' },
      { id: 'I-02', name: '导航链接', selector: '.cover-nav' },
      { id: 'I-03', name: '本月卦象', selector: '#random-card' },
      { id: 'I-04', name: '封面引文', selector: '.cover-quote' },
      { id: 'I-05', name: '六十四卦', selector: '#hexagrams' },
      { id: 'I-06', name: '页脚', selector: '.site-footer' }
    ];
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

    // For index page, populate static sections immediately
    if (getPageType() === 'index') {
      updateSectionList(null);
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
    openai: 'gpt-4o-mini',
    anthropic: 'claude-3-haiku-20240307',
    custom: ''
  };

  const DEFAULT_BASES = {
    openai: 'https://api.openai.com/v1',
    anthropic: '',
    custom: ''
  };

  let messages = []; // conversation history [{role, content}]
  let isStreaming = false;
  let abortController = null;
  let currentHexData = null; // set externally

  function loadSettings() {
    const provider = localStorage.getItem(KEYS.provider) || 'openai';
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
    if (s) { s.textContent = '已保存'; s.className = 'ai-status saved'; setTimeout(updateStatus, 1500); }
  }

  function clearSettings() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    const p = document.getElementById('ai-provider');
    const k = document.getElementById('ai-key');
    const b = document.getElementById('ai-base');
    const m = document.getElementById('ai-model');
    if (p) p.value = 'openai';
    if (k) k.value = '';
    if (b) b.value = DEFAULT_BASES.openai;
    if (m) m.value = DEFAULT_MODELS.openai;
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

  /** Build system prompt with hexagram content */
  function buildSystemPrompt() {
    const cb = document.getElementById('ai-include-context');
    if (!cb || !cb.checked || !currentHexData) {
      return 'You are a scholar who specializes in the Book of Changes (I Ching / Zhou Yi). Answer the user\'s questions.';
    }
    const h = currentHexData;
    let prompt = `你是一位精通《周易》的学者。当前用户正在查看第${h.id}卦「${h.name}」(${h.pinyin})。\n`;
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
    prompt += `\n请基于以上内容回答用户的问题。如用户使用中文提问，请用中文回答；如使用英文，请用英文回答。`;
    return prompt;
  }

  /** Render a single message into HTML */
  function renderMessage(msg) {
    const cls = msg.role === 'user' ? 'ai-msg ai-msg-user' : 'ai-msg ai-msg-assistant';
    const content = escapeHtml(msg.content)
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
    return `<div class="${cls}">${content}</div>`;
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

  /** Send message to AI */
  async function send() {
    const input = document.getElementById('ai-chat-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text || isStreaming) return;

    const settings = loadSettings();
    if (!settings.key) {
      toggleExpand(); // show settings if collapsed
      const s = document.getElementById('ai-status');
      if (s) { s.textContent = '请先配置 API 密钥'; s.className = 'ai-status'; }
      return;
    }

    // Add user message
    messages.push({ role: 'user', content: text });
    input.value = '';
    renderMessages();
    setStreaming(true);

    // Add empty assistant message placeholder
    messages.push({ role: 'assistant', content: '' });
    renderMessages();

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
      ...messages.filter(m => m.content)
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
      .map(m => ({ role: m.role, content: m.content }));

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

  function handleInputKey(e) {
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
    if (input) input.addEventListener('keydown', handleInputKey);

    renderMessages();
  }

  return {
    init, saveSettings, clearSettings, toggleKey, toggleExpand,
    send, stopStreaming, clearChat, setHexData, onProviderChange
  };
})();


/* ===== Auto-init Notepad on DOMContentLoaded (works for all users) ===== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { Notepad.init(); });
} else {
  Notepad.init();
}
