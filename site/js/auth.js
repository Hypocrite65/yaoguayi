/**
 * auth.js — 共享密码门认证模块
 *
 * 设计说明：
 * 提供开发阶段的密码验证功能，供所有页面共用。
 * 使用 SHA-256 哈希比对（Web Crypto API），密码不以明文存储。
 * 验证通过后存入 localStorage，下次访问自动跳过。
 * 页面需包含 id="auth-gate" 的遮罩层 HTML 结构。
 */

const YaoguayiAuth = (() => {
  const AUTH_KEY = 'yaoguayi_dev_auth';
  // SHA-256 hash of the password (not plaintext)
  const AUTH_HASH = '533ec688bba2dda0ba454564a7372550e1cc83fa43fdb82c1b71cebeb027f11b';

  /**
   * 计算字符串的 SHA-256 哈希
   * @param {string} message - 待哈希的字符串
   * @returns {Promise<string>} 16进制哈希字符串
   */
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * 检查是否已通过验证
   * @returns {boolean}
   */
  function isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === 'true';
  }

  /**
   * 解锁站点，隐藏密码门
   */
  function unlock() {
    localStorage.setItem(AUTH_KEY, 'true');
    const gate = document.getElementById('auth-gate');
    if (gate) {
      gate.classList.add('hidden');
      setTimeout(() => gate.classList.add('removed'), 700);
    }
  }

  /**
   * 退出登录，清除认证状态
   */
  function logout() {
    localStorage.removeItem(AUTH_KEY);
    location.reload();
  }

  /**
   * 初始化密码门
   * 页面需要包含以下 DOM 元素：
   *   #auth-gate, #auth-input, #auth-btn, #auth-error
   * 可选：#logout-link
   * @param {Function} [onUnlock] - 解锁后的回调（如触发入场动画）
   */
  function init(onUnlock) {
    const gate = document.getElementById('auth-gate');
    const authInput = document.getElementById('auth-input');
    const authBtn = document.getElementById('auth-btn');
    const authError = document.getElementById('auth-error');
    const logoutLink = document.getElementById('logout-link');

    if (!gate) return;

    // 已验证则直接隐藏密码门
    if (isAuthenticated()) {
      gate.classList.add('removed');
      if (onUnlock) {
        window.addEventListener('load', () => onUnlock());
      }
      return;
    }

    // 未验证，聚焦输入框
    if (authInput) authInput.focus();

    // 验证按钮点击
    if (authBtn) {
      authBtn.addEventListener('click', async () => {
        if (!authInput) return;
        const inputHash = await sha256(authInput.value);
        if (inputHash === AUTH_HASH) {
          unlock();
          if (onUnlock) onUnlock();
        } else {
          if (authError) {
            authError.classList.add('show');
            authInput.style.borderColor = 'rgba(192,57,43,0.4)';
            setTimeout(() => {
              authError.classList.remove('show');
              authInput.style.borderColor = '';
            }, 2000);
          }
        }
      });
    }

    // 回车提交
    if (authInput) {
      authInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && authBtn) authBtn.click();
      });
    }

    // 退出链接
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  }

  return { init, isAuthenticated, unlock, logout };
})();
