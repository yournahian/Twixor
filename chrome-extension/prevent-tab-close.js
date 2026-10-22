/**
 * ATOMX TAB SHIELD — MAIN WORLD PROTECTOR
 * Registered in manifest.json with "world": "MAIN" and "run_at": "document_start".
 * Runs inside the page's execution context before Twitter/X scripts load.
 * Permanently neutralizes window.close, Window.prototype.close, self.close,
 * and dangerous history.back() on /home, ensuring Twitter router never closes the browser tab.
 */
(function() {
  'use strict';

  if (window.__atomx_tab_shield_active) return;
  window.__atomx_tab_shield_active = true;

  const blockedClose = function() {
    console.warn('[ATOMX TAB SHIELD] Intercepted and blocked script call to window.close()');
    try {
      if (window.location && window.location.pathname && window.location.pathname.includes('/compose/post')) {
        window.history.replaceState({}, '', '/home');
      }
    } catch (e) {}
    return false;
  };

  // 1. Lock down window.close
  try {
    Object.defineProperty(window, 'close', {
      value: blockedClose,
      writable: false,
      configurable: false
    });
  } catch (e) {
    try { window.close = blockedClose; } catch (err) {}
  }

  // 2. Lock down Window.prototype.close
  try {
    if (typeof Window !== 'undefined' && Window.prototype) {
      Object.defineProperty(Window.prototype, 'close', {
        value: blockedClose,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {}

  // 3. Lock down self.close, top.close, parent.close
  try { self.close = blockedClose; } catch (e) {}
  try { if (window.top) window.top.close = blockedClose; } catch (e) {}
  try { if (window.parent) window.parent.close = blockedClose; } catch (e) {}

  // 4. Trap window.open so spawned references cannot call .close()
  try {
    const origOpen = window.open;
    window.open = function() {
      const win = origOpen.apply(window, arguments);
      if (win) {
        try {
          Object.defineProperty(win, 'close', { value: blockedClose, writable: false, configurable: false });
        } catch (e) {
          try { win.close = blockedClose; } catch (err) {}
        }
      }
      return win;
    };
  } catch (e) {}

  // 5. Guard history.back on /home to prevent exiting the timeline into a blank/closed tab
  try {
    const origBack = window.history.back;
    window.history.back = function() {
      if (window.location && window.location.pathname === '/home' && window.history.length <= 2) {
        console.warn('[ATOMX TAB SHIELD] Intercepted history.back() on /home to prevent leaving feed.');
        return;
      }
      return origBack.apply(window.history, arguments);
    };
  } catch (e) {}

  // 6. Suppress beforeunload prompt that can stall or crash tabs
  try {
    window.addEventListener('beforeunload', function(e) {
      try { e.stopImmediatePropagation(); } catch (err) {}
    }, true);
  } catch (e) {}

  console.log('[ATOMX TAB SHIELD] MAIN world tab close protection active.');

  // 7. MAIN World Real-Time Twitter Identity & React State Detector
  function publishHandle(handle) {
    if (!handle || typeof handle !== 'string') return;
    const clean = handle.replace(/^@/, '').toLowerCase().trim();
    const INVALID = ['unknown', 'undefined', 'null', 'home', 'explore', 'notifications', 'messages', 'i', 'compose', 'settings', 'search', 'hashtag', 'lists', 'communities', 'verified-orgs-signup', 'login', 'signup', 'jobs', 'premium'];
    if (clean.length < 2 || INVALID.includes(clean) || !/^[\w_]{1,30}$/.test(clean)) return;
    try {
      document.documentElement.setAttribute('data-twixor-x-handle', clean);
      window.postMessage({ type: '__TWIXOR_USER_HANDLE__', handle: clean }, '*');
    } catch (e) {}
  }

  function extractScreenNameFromObject(obj, depth) {
    if (!obj || (depth || 0) > 6) return null;
    if (typeof obj === 'string') return null;
    if (typeof obj.screen_name === 'string') return obj.screen_name;
    if (typeof obj.username === 'string') return obj.username;
    if (obj.user && typeof obj.user.screen_name === 'string') return obj.user.screen_name;
    if (obj.legacy && typeof obj.legacy.screen_name === 'string') return obj.legacy.screen_name;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const found = extractScreenNameFromObject(obj[key], (depth || 0) + 1);
        if (found) return found;
      }
    }
    return null;
  }

  function scanReactFiberForHandle() {
    try {
      const targets = [
        document.querySelector('[data-testid="TopNavBar_UserMenu_Button"]'),
        document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]'),
        document.querySelector('header'),
        document.querySelector('a[data-testid="AppTabBar_Profile_Link"]'),
        document.querySelector('a[data-testid="SideNav_Profile_Link"]'),
        document.getElementById('react-root')
      ];

      for (const el of targets) {
        if (!el) continue;
        const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
        if (!fiberKey) continue;
        let fiber = el[fiberKey];
        let depth = 0;
        while (fiber && depth < 35) {
          const props = fiber.memoizedProps;
          if (props) {
            const sn = extractScreenNameFromObject(props);
            if (sn) { publishHandle(sn); return; }
          }
          fiber = fiber.return;
          depth++;
        }
      }
    } catch (e) {}
  }

  // Hook window.fetch strictly for authentic logged-in user account responses
  try {
    const origFetch = window.fetch;
    window.fetch = async function(...args) {
      const resp = await origFetch.apply(this, args);
      try {
        const url = args[0] ? (typeof args[0] === 'string' ? args[0] : args[0].url || '') : '';
        if (url.includes('/1.1/account/settings.json') || url.includes('/1.1/account/verify_credentials.json')) {
          resp.clone().json().then(data => {
            if (data && data.screen_name) publishHandle(data.screen_name);
          }).catch(() => null);
        } else if (url.includes('/graphql/') && (url.includes('Viewer') || url.includes('AuthenticatedUser'))) {
          resp.clone().json().then(data => {
            const sn = data?.data?.viewer?.user_results?.result?.legacy?.screen_name ||
                       data?.data?.viewer?.legacy?.screen_name ||
                       data?.viewer?.legacy?.screen_name;
            if (sn) publishHandle(sn);
          }).catch(() => null);
        }
      } catch (e) {}
      return resp;
    };
  } catch (e) {}

  // Periodic scan for first 15 seconds
  let scanCount = 0;
  const scanInterval = setInterval(() => {
    scanCount++;
    scanReactFiberForHandle();
    if (document.documentElement.getAttribute('data-twixor-x-handle') || scanCount > 10) {
      clearInterval(scanInterval);
    }
  }, 1200);

  window.addEventListener('message', (ev) => {
    if (ev.data && ev.data.type === '__TWIXOR_REQUEST_HANDLE__') {
      scanReactFiberForHandle();
    }
  });
})();
