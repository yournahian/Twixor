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
      // 1. Direct DOM check: ONLY in user's own reply box or navigation (never generic page avatars)
      const myReplyAvatar = document.querySelector('div[data-testid="inline_reply"] [data-testid^="UserAvatar-Container-"]');
      if (myReplyAvatar) {
        const tid = myReplyAvatar.getAttribute('data-testid') || '';
        const m = tid.match(/UserAvatar-Container-([a-zA-Z0-9_]{1,30})/i);
        if (m && m[1]) {
          publishHandle(m[1]);
          return;
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
    function getTargetComposer() {
      // 1. Tagged by content.js as active target composer
      const tagged = document.querySelector('[data-twixor-active-composer="true"]');
      if (tagged) return tagged;

      // 2. Reply modal or popup dialog
      const dialog = document.querySelector('div[role="dialog"], div[aria-modal="true"]');
      if (dialog) {
        const dlgEdit = dialog.querySelector('div[data-testid="tweetTextarea_0"] [contenteditable="true"]') ||
                         dialog.querySelector('[contenteditable="true"][role="textbox"]') ||
                         dialog.querySelector('[contenteditable="true"]') ||
                         dialog.querySelector('div[data-testid="tweetTextarea_0"]');
        if (dlgEdit) return dlgEdit;
      }

      // 3. Status page inline reply
      const inlineReply = document.querySelector('div[data-testid="inline_reply"]');
      if (inlineReply) {
        const inlineEdit = inlineReply.querySelector('div[data-testid="tweetTextarea_0"] [contenteditable="true"]') ||
                           inlineReply.querySelector('[contenteditable="true"]');
        if (inlineEdit) return inlineEdit;
      }

      // 4. Fallback (mobile compose route or general textbox)
      return document.querySelector('div[data-testid="tweetTextarea_0"] [contenteditable="true"]') ||
             document.querySelector('div[contenteditable="true"][role="textbox"]') ||
             document.querySelector('.public-DraftEditor-content') ||
             document.querySelector('[contenteditable="true"]');
    }

    function setupDraftCaret(editable) {
      if (!editable) return null;
      try {
        editable.focus({ preventScroll: true });
        const span = editable.querySelector('span[data-text="true"]') ||
                     editable.querySelector('span[data-offset-key]') ||
                     editable.querySelector('div[data-block="true"]') ||
                     editable;
        const sel = window.getSelection();
        const range = document.createRange();
        if (span.firstChild && span.firstChild.nodeType === Node.TEXT_NODE) {
          range.setStart(span.firstChild, span.firstChild.length);
        } else {
          range.selectNodeContents(span);
        }
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        return span;
      } catch (e) {
        return null;
      }
    }

    function insertViaReactFiber(editable, textToInsert) {
      if (!editable || !textToInsert) return false;
      try {
        const composeContainer = editable.closest('div[data-testid="tweetTextarea_0"], .DraftEditor-root, div[role="dialog"]');
        const targets = [editable, editable.parentElement, composeContainer].filter(Boolean);
        for (const t of targets) {
          const fiberKey = Object.keys(t).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
          if (!fiberKey) continue;
          let fiber = t[fiberKey];
          let depth = 0;
          while (fiber && depth < 40) {
            const mp = fiber.memoizedProps;
            if (mp) {
              const fakeEvent = {
                preventDefault: () => {},
                stopPropagation: () => {},
                isDefaultPrevented: () => false,
                isPropagationStopped: () => false,
                persist: () => {},
                clipboardData: {
                  getData: (type) => (type === 'text/plain' || type === 'Text' ? textToInsert : ''),
                  types: ['text/plain', 'Text']
                },
                nativeEvent: {
                  clipboardData: {
                    getData: (type) => (type === 'text/plain' || type === 'Text' ? textToInsert : ''),
                    types: ['text/plain', 'Text']
                  }
                }
              };

              if (typeof mp.onPaste === 'function') {
                try {
                  mp.onPaste(fakeEvent);
                  return true;
                } catch (e) {}
              }
              if (typeof mp.handlePastedText === 'function') {
                try {
                  const res = mp.handlePastedText(textToInsert, textToInsert, mp.editorState);
                  if (res === 'handled' || res === true) return true;
                } catch (e) {}
              }
              if (typeof mp.onBeforeInput === 'function') {
                try {
                  mp.onBeforeInput({
                    ...fakeEvent,
                    data: textToInsert,
                    inputType: 'insertText'
                  });
                  return true;
                } catch (e) {}
              }
            }
            fiber = fiber.return;
            depth++;
          }
        }
      } catch (e) {}
      return false;
    }

    // Direct Draft.js / Lexical text insertion in MAIN world context
    if (ev.data.type === '__TWIXOR_INSERT_COMPOSER_TEXT__' && ev.data.text) {
      let inserted = false;
      try {
        const text = ev.data.text;
        const editable = getTargetComposer();

        if (editable) {
          const span = setupDraftCaret(editable);

          // 1. DataTransfer Paste event (Native browser paste simulation)
          try {
            const dt = new DataTransfer();
            dt.setData('text/plain', text);
            dt.setData('Text', text);
            const pasteEv = new ClipboardEvent('paste', {
              bubbles: true,
              cancelable: true,
              composed: true,
              clipboardData: dt
            });
            editable.dispatchEvent(pasteEv);
          } catch (pe) {}

          // 2. React Fiber memoizedProps.handlePastedText or onPaste
          inserted = insertViaReactFiber(editable, text);

          // 3. Native execCommand
          try {
            document.execCommand('insertText', false, text);
          } catch (ece) {}

          // 4. Direct DOM Text Node Sync for Draft.js MutationObserver
          try {
            const targetSpan = span || editable.querySelector('span[data-text="true"]');
            if (targetSpan) {
              const br = targetSpan.querySelector('br');
              if (br) br.remove();
              targetSpan.textContent = text;
            }
          } catch (de) {}

          // 5. Input events to notify React and Draft.js
          try {
            editable.dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertFromPaste', data: text, bubbles: true, cancelable: true, composed: true }));
            editable.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste', data: text, bubbles: true, composed: true }));
            editable.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            editable.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
          } catch (ie) {}

          // 6. Unlock submit button in DOM
          try {
            const submitBtn = document.querySelector('header button[data-testid="tweetButton"]') ||
                              document.querySelector('[data-testid="TopNavBar"] button[data-testid="tweetButton"]') ||
                              document.querySelector('button[data-testid="tweetButtonInline"]') ||
                              document.querySelector('button[data-testid="tweetButton"]');
            if (submitBtn) {
              submitBtn.removeAttribute('aria-disabled');
              submitBtn.disabled = false;
            }
          } catch (se) {}
        }
      } catch (err) {}
      window.postMessage({ type: '__TWIXOR_COMPOSER_TEXT_INSERTED__', ok: true }, '*');
    }

    // Single character insertion in MAIN world context (for real-time human typing animation)
    if (ev.data.type === '__TWIXOR_INSERT_CHAR__' && typeof ev.data.char === 'string') {
      try {
        const char = ev.data.char;
        const editable = getTargetComposer();

        if (editable) {
          const span = setupDraftCaret(editable);
          let ok = false;
          try {
            ok = document.execCommand('insertText', false, char);
          } catch (e) {}

          if (!ok) {
            ok = insertViaReactFiber(editable, char);
          }

          // Direct DOM Text Node fallback
          try {
            const targetSpan = span || editable.querySelector('span[data-text="true"]');
            if (targetSpan) {
              const br = targetSpan.querySelector('br');
              if (br) br.remove();
              if (targetSpan.firstChild && targetSpan.firstChild.nodeType === Node.TEXT_NODE) {
                targetSpan.firstChild.nodeValue += char;
              } else {
                targetSpan.textContent = (targetSpan.textContent || '') + char;
              }
            }
          } catch (e) {}

          try {
            editable.dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data: char, bubbles: true, composed: true }));
            editable.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data: char, bubbles: true, composed: true }));
            editable.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
          } catch (ie) {}
        }
      } catch (err) {}
    }

    // Direct submit click in MAIN world context
    if (ev.data.type === '__TWIXOR_SUBMIT_REPLY__') {
      try {
        const dialog = document.querySelector('div[role="dialog"], div[aria-modal="true"]');
        const scope = dialog || document;
        const btn = scope.querySelector('header button[data-testid="tweetButton"]') ||
                    scope.querySelector('[data-testid="TopNavBar"] button[data-testid="tweetButton"]') ||
                    scope.querySelector('button[data-testid="tweetButtonInline"]') ||
                    scope.querySelector('button[data-testid="tweetButton"]') ||
                    document.querySelector('header button[data-testid="tweetButton"]') ||
                    document.querySelector('[data-testid="TopNavBar"] button[data-testid="tweetButton"]') ||
                    document.querySelector('button[data-testid="tweetButton"]');
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
          btn.click();
        }
      } catch (e) {}
    }
  });
})();
