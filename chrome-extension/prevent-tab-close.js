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
      // 1. Direct DOM check: UserAvatar-Container outside tweet articles or in composer
      const avatarEls = document.querySelectorAll('[data-testid^="UserAvatar-Container-"]');
      for (const av of avatarEls) {
        if (!av.closest('article[data-testid="tweet"]') || av.closest('div[data-testid="inline_reply"], div[role="dialog"], [aria-modal="true"], [data-testid="tweetTextarea_0"]')) {
          const tid = av.getAttribute('data-testid') || '';
          const m = tid.match(/UserAvatar-Container-([a-zA-Z0-9_]{1,30})/i);
          if (m && m[1]) {
            publishHandle(m[1]);
            return;
          }
        }
      }

      // 2. Window INITIAL_STATE check
      if (window.__INITIAL_STATE__) {
        const sn = extractScreenNameFromObject(window.__INITIAL_STATE__);
        if (sn) { publishHandle(sn); return; }
      }

      // 3. React Fiber tree search
      const targets = [
        document.querySelector('[data-testid="TopNavBar_UserMenu_Button"]'),
        document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]'),
        document.querySelector('header'),
        document.querySelector('a[data-testid="AppTabBar_Profile_Link"]'),
        document.querySelector('a[data-testid="SideNav_Profile_Link"]'),
        document.querySelector('div[data-testid="inline_reply"]'),
        document.querySelector('div[data-testid="tweetTextarea_0"]'),
        document.getElementById('react-root')
      ];

      for (const el of targets) {
        if (!el) continue;
        const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
        if (!fiberKey) continue;
        let fiber = el[fiberKey];
        let depth = 0;
        while (fiber && depth < 45) {
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

  // Periodic scan for first 20 seconds
  let scanCount = 0;
  const scanInterval = setInterval(() => {
    scanCount++;
    scanReactFiberForHandle();
    if (document.documentElement.getAttribute('data-twixor-x-handle') || scanCount > 15) {
      clearInterval(scanInterval);
    }
  }, 1000);

  // Message dispatcher for isolated content script bridge
  window.addEventListener('message', (ev) => {
    if (!ev.data) return;
    if (ev.data.type === '__TWIXOR_REQUEST_HANDLE__') {
      scanReactFiberForHandle();
    }
    // Direct Draft.js / Lexical text insertion in MAIN world context
    if (ev.data.type === '__TWIXOR_INSERT_COMPOSER_TEXT__' && ev.data.text) {
      let inserted = false;
      try {
        const text = ev.data.text;
        const editable = document.querySelector('div[contenteditable="true"][role="textbox"]') ||
                         document.querySelector('.public-DraftEditor-content') ||
                         document.querySelector('div[data-testid="tweetTextarea_0"] [contenteditable="true"]') ||
                         document.querySelector('[contenteditable="true"]');
        const container = document.querySelector('div[data-testid="tweetTextarea_0"]') || editable;

        if (editable || container) {
          const targets = [
            editable,
            editable?.parentElement,
            editable?.parentElement?.parentElement,
            container,
            container?.firstElementChild
          ].filter(Boolean);

          for (const t of targets) {
            // Check React Props
            const propsKey = Object.keys(t).find(k => k.startsWith('__reactProps$'));
            if (propsKey && t[propsKey]) {
              const p = t[propsKey];
              if (typeof p.onPaste === 'function') {
                try {
                  p.onPaste({
                    preventDefault: () => {},
                    stopPropagation: () => {},
                    clipboardData: {
                      getData: (type) => (type === 'text/plain' || type === 'Text' ? text : ''),
                      types: ['text/plain', 'Text']
                    }
                  });
                  inserted = true;
                  break;
                } catch (pe) {}
              }
              if (typeof p.onBeforeInput === 'function') {
                try {
                  p.onBeforeInput({
                    preventDefault: () => {},
                    stopPropagation: () => {},
                    data: text,
                    inputType: 'insertText'
                  });
                  inserted = true;
                  break;
                } catch (bie) {}
              }
            }

            // Check React Fiber
            const fiberKey = Object.keys(t).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
            if (!fiberKey) continue;
            let fiber = t[fiberKey];
            let depth = 0;
            while (fiber && depth < 35) {
              const mp = fiber.memoizedProps;
              if (mp) {
                if (typeof mp.onPaste === 'function') {
                  try {
                    mp.onPaste({
                      preventDefault: () => {},
                      stopPropagation: () => {},
                      clipboardData: {
                        getData: (type) => (type === 'text/plain' || type === 'Text' ? text : ''),
                        types: ['text/plain', 'Text']
                      }
                    });
                    inserted = true;
                    break;
                  } catch (pe) {}
                }
                if (typeof mp.handlePastedText === 'function') {
                  try {
                    mp.handlePastedText(text, text, mp.editorState);
                    inserted = true;
                    break;
                  } catch (hpe) {}
                }
              }
              fiber = fiber.return;
              depth++;
            }
            if (inserted) break;
          }

          // Native fallback in MAIN world
          if (editable) {
            try {
              editable.focus({ preventScroll: true });
              const dt = new DataTransfer();
              dt.setData('text/plain', text);
              dt.setData('Text', text);
              try {
                editable.dispatchEvent(new InputEvent('beforeinput', {
                  inputType: 'insertFromPaste',
                  dataTransfer: dt,
                  bubbles: true,
                  cancelable: true,
                  composed: true
                }));
              } catch (bie) {}
              editable.dispatchEvent(new ClipboardEvent('paste', {
                bubbles: true,
                cancelable: true,
                composed: true,
                clipboardData: dt
              }));
              document.execCommand('insertText', false, text);
              editable.dispatchEvent(new InputEvent('input', {
                inputType: 'insertText',
                data: text,
                bubbles: true,
                composed: true
              }));
              editable.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
              editable.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
              inserted = true;
            } catch (ne) {}
          }
        }
      } catch (err) {}
      window.postMessage({ type: '__TWIXOR_COMPOSER_TEXT_INSERTED__', ok: inserted }, '*');
    }

    // Direct submit click in MAIN world context
    if (ev.data.type === '__TWIXOR_SUBMIT_REPLY__') {
      try {
        const btn = document.querySelector('button[data-testid="tweetButton"]') ||
                    document.querySelector('button[data-testid="tweetButtonInline"]') ||
                    document.querySelector('div[role="dialog"] button[data-testid="tweetButton"]') ||
                    document.querySelector('header button[data-testid="tweetButton"]');
        if (btn) {
          btn.removeAttribute('aria-disabled');
          btn.disabled = false;
          const propsKey = Object.keys(btn).find(k => k.startsWith('__reactProps$'));
          if (propsKey && btn[propsKey] && typeof btn[propsKey].onClick === 'function') {
            try {
              btn[propsKey].onClick({
                preventDefault: () => {},
                stopPropagation: () => {},
                bubbles: true
              });
            } catch (ce) {}
          }
          btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
          btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
          btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
          btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
          btn.click();
        }
      } catch (e) {}
    }
  });
})();
