/**
 * auth.js — 账户认证模块
 *
 * 区分管理员和普通用户，控制管理面板等功能可见性。
 * 状态存储：localStorage yaoguayi_user (JSON: {role})
 * 通过导航栏账户下拉菜单登录/退出。
 */

const YaoguayiAuth = (() => {
  const USER_KEY = 'yaoguayi_user';

  const ACCOUNTS = {
    'admin': {
      hash: '533ec688bba2dda0ba454564a7372550e1cc83fa43fdb82c1b71cebeb027f11b',
      role: 'admin'
    }
  };

  async function sha256(message) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /* ===== Layer 2: User Account ===== */
  function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  }

  function isLoggedIn() {
    return getUser() !== null;
  }

  function isAdmin() {
    const u = getUser();
    return u && u.role === 'admin';
  }

  function accountLogin(username, password) {
    return sha256(password).then(h => {
      const acc = ACCOUNTS[username];
      if (acc && acc.hash === h) {
        localStorage.setItem(USER_KEY, JSON.stringify({ name: username, role: acc.role }));
        return true;
      }
      return false;
    });
  }

  function accountLogout() {
    localStorage.removeItem(USER_KEY);
    location.reload();
  }

  /* ===== Login Dialog (in account dropdown) ===== */
  const ICON_LOGIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>';
  const ICON_LOGOUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';

  function initAccountUI() {
    const link = document.getElementById('auth-action-link');
    const text = document.getElementById('auth-action-text');
    const icon = document.getElementById('auth-action-icon');
    const dropdown = document.getElementById('account-dropdown');
    if (!link || !text || !dropdown) return;

    if (isLoggedIn()) {
      const user = getUser();
      // Update dropdown header
      const header = dropdown.querySelector('.dropdown-header');
      if (header) header.textContent = user.name + (user.role === 'admin' ? ' · 管理员' : '');
      // Show logout
      text.textContent = '退出登录';
      if (icon) icon.innerHTML = ICON_LOGOUT;
      link.onclick = (e) => {
        e.preventDefault();
        if (typeof closeAccountMenu === 'function') closeAccountMenu();
        accountLogout();
      };
    } else {
      text.textContent = '登录';
      if (icon) icon.innerHTML = ICON_LOGIN;
      link.onclick = (e) => {
        e.preventDefault();
        showLoginForm(dropdown);
      };
    }
  }

  function showLoginForm(dropdown) {
    let form = dropdown.querySelector('.login-form');
    if (form) { form.style.display = ''; return; }

    form = document.createElement('div');
    form.className = 'login-form';
    form.innerHTML = `
      <input class="login-input" id="login-user" type="text" placeholder="用户名" autocomplete="off"/>
      <input class="login-input" id="login-pass" type="password" placeholder="密码"/>
      <div class="login-row">
        <button class="login-btn" id="login-submit">登录</button>
        <button class="login-cancel" id="login-cancel">取消</button>
      </div>
      <div class="login-error" id="login-error">用户名或密码错误</div>`;
    dropdown.appendChild(form);

    const userInput = form.querySelector('#login-user');
    const passInput = form.querySelector('#login-pass');
    const submitBtn = form.querySelector('#login-submit');
    const cancelBtn = form.querySelector('#login-cancel');
    const errorEl = form.querySelector('#login-error');

    setTimeout(() => userInput.focus(), 50);

    submitBtn.addEventListener('click', async () => {
      const ok = await accountLogin(userInput.value.trim(), passInput.value);
      if (ok) {
        location.reload();
      } else {
        errorEl.classList.add('show');
        setTimeout(() => errorEl.classList.remove('show'), 2000);
      }
    });

    passInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitBtn.click();
    });

    cancelBtn.addEventListener('click', () => {
      form.style.display = 'none';
      userInput.value = '';
      passInput.value = '';
    });
  }

  function init() {
    initAccountUI();
  }

  return { init, isLoggedIn, isAdmin, getUser, accountLogout };
})();
