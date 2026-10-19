const fs = require('fs');

// 1. UPDATE popup.css
let css = fs.readFileSync('chrome-extension/popup.css', 'utf8');

// Fix preset chip line 2630
css = css.replace(
  /\.credit-preset-btn\.active\s*\{[\s\S]*?box-shadow:[^}]*\}/,
  `.credit-preset-btn.active,
.preset-chip-btn.active {
  background: #1E6FD9 !important;
  background: linear-gradient(135deg, #1E6FD9, #0F4BB0) !important;
  border-color: #1E6FD9 !important;
  color: #FFFFFF !important;
  box-shadow: 0 2px 8px rgba(30, 111, 217, 0.4) !important;
}`
);

// Fix payment method chip active state in light vs dark
css = css.replace(
  /\.payment-method-chip\.active\s*\{[\s\S]*?box-shadow:[^}]*\}/,
  `.payment-method-chip.active {
  background: rgba(30, 111, 217, 0.12) !important;
  border-color: var(--primary) !important;
  color: var(--primary) !important;
  box-shadow: 0 0 12px rgba(30, 111, 217, 0.25) !important;
}

[data-theme="dark"] .payment-method-chip.active,
body.dark .payment-method-chip.active {
  background: linear-gradient(135deg, rgba(30, 111, 217, 0.25), rgba(15, 75, 176, 0.18)) !important;
  color: #FFFFFF !important;
  border-color: var(--primary) !important;
}`
);

// Comprehensive Light Mode explicit overrides (specificity 0,3,0+)
const ultimateLightModeBlock = `
/* ==============================================================
   BULLETPROOF HIGH-SPECIFICITY LIGHT MODE OVERRIDES
   ============================================================== */

/* 1. Carousel Cards in Light Mode */
[data-theme="light"] .carousel-slide,
body.light .carousel-slide {
  background: #FFFFFF !important;
  box-shadow: 0 4px 18px rgba(30, 111, 217, 0.08) !important;
}

[data-theme="light"] .carousel-slide.theme-founding,
body.light .carousel-slide.theme-founding {
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.08), #FFFFFF) !important;
  border: 1.5px solid rgba(255, 107, 0, 0.38) !important;
}

[data-theme="light"] .carousel-slide.theme-free,
body.light .carousel-slide.theme-free {
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.08), #FFFFFF) !important;
  border: 1.5px solid rgba(100, 116, 139, 0.28) !important;
}

[data-theme="light"] .carousel-slide.theme-starter,
body.light .carousel-slide.theme-starter {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), #FFFFFF) !important;
  border: 1.5px solid rgba(37, 99, 235, 0.38) !important;
}

[data-theme="light"] .carousel-slide.theme-pro,
body.light .carousel-slide.theme-pro {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), #FFFFFF) !important;
  border: 1.5px solid rgba(124, 58, 237, 0.38) !important;
}

[data-theme="light"] .carousel-slide.theme-growth,
body.light .carousel-slide.theme-growth {
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.08), #FFFFFF) !important;
  border: 1.5px solid rgba(5, 150, 105, 0.38) !important;
}

[data-theme="light"] .carousel-slide.theme-enterprise,
body.light .carousel-slide.theme-enterprise {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.08), #FFFFFF) !important;
  border: 1.5px solid rgba(217, 119, 6, 0.38) !important;
}

[data-theme="light"] .carousel-slide-features,
body.light .carousel-slide-features {
  color: #5B6B8A !important;
}

/* 2. Purchase & Order History Card Button in Light Mode */
[data-theme="light"] .order-history-nav-card-btn,
body.light .order-history-nav-card-btn {
  background: #FFFFFF !important;
  border: 1px solid #DCE8F7 !important;
  box-shadow: 0 4px 16px rgba(30, 111, 217, 0.08) !important;
}

[data-theme="light"] .order-history-btn-heading,
body.light .order-history-btn-heading {
  color: #0B1B3A !important;
}

[data-theme="light"] .order-history-btn-sub,
body.light .order-history-btn-sub {
  color: #5B6B8A !important;
}

[data-theme="light"] .order-history-nav-card-btn:hover,
body.light .order-history-nav-card-btn:hover {
  background: #F3F8FF !important;
  border-color: #1E6FD9 !important;
}

/* 3. Subview Header Alignment & Contrast in Light Mode */
[data-theme="light"] .subview-title,
body.light .subview-title {
  color: #0B1B3A !important;
}

[data-theme="light"] .subview-nav-btn,
body.light .subview-nav-btn {
  background: #FFFFFF !important;
  border: 1px solid #DCE8F7 !important;
  color: #0B1B3A !important;
  box-shadow: 0 2px 6px rgba(30, 111, 217, 0.08) !important;
}

[data-theme="light"] .subview-nav-btn:hover,
body.light .subview-nav-btn:hover {
  background: #F3F8FF !important;
  border-color: #1E6FD9 !important;
  color: #1E6FD9 !important;
}

/* 4. Payment Instructions Box & Buttons in Light Mode */
[data-theme="light"] .payment-instructions-box,
body.light .payment-instructions-box {
  background: #F3F8FF !important;
  border: 1px solid #DCE8F7 !important;
}

[data-theme="light"] .payment-dest-val,
body.light .payment-dest-val {
  color: #0B1B3A !important;
}

[data-theme="light"] .payment-inst-sub,
body.light .payment-inst-sub {
  color: #5B6B8A !important;
}

/* 5. Cancel Buttons in Light Mode */
[data-theme="light"] .step-cancel-pill-btn,
body.light .step-cancel-pill-btn {
  background: rgba(239, 68, 68, 0.08) !important;
  border: 1px solid rgba(239, 68, 68, 0.35) !important;
  color: #DC2626 !important;
  font-weight: 700 !important;
}

[data-theme="light"] .step-cancel-pill-btn:hover,
body.light .step-cancel-pill-btn:hover {
  background: rgba(239, 68, 68, 0.18) !important;
  border-color: #DC2626 !important;
  color: #B91C1C !important;
}

/* 6. Notification Modal in Light Mode */
[data-theme="light"] .ext-modal-overlay,
body.light .ext-modal-overlay {
  background: rgba(15, 23, 42, 0.45) !important;
  backdrop-filter: blur(8px) !important;
}

[data-theme="light"] .ext-notify-card,
body.light .ext-notify-card {
  background: #FFFFFF !important;
  border: 1px solid #DCE8F7 !important;
  box-shadow: 0 20px 50px rgba(30, 111, 217, 0.22) !important;
  color: #0B1B3A !important;
}

[data-theme="light"] .ext-notify-title,
body.light .ext-notify-title {
  color: #0B1B3A !important;
}

[data-theme="light"] .ext-notify-body,
body.light .ext-notify-body {
  color: #475569 !important;
}

[data-theme="light"] .ext-notify-close-btn,
body.light .ext-notify-close-btn {
  background: rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #DCE8F7 !important;
  color: #5B6B8A !important;
}
`;

if (!css.includes('BULLETPROOF HIGH-SPECIFICITY LIGHT MODE OVERRIDES')) {
  css += '\n' + ultimateLightModeBlock;
}

fs.writeFileSync('chrome-extension/popup.css', css, 'utf8');
fs.writeFileSync('chrome-extension/sidepanel.css', css, 'utf8');
console.log('✓ popup.css and sidepanel.css updated with bulletproof light mode rules');

// 2. UPDATE popup.js openOrderHistoryPage
let popupJs = fs.readFileSync('chrome-extension/popup.js', 'utf8');

const targetOpenHistory = `function openOrderHistoryPage() {
  const mainView = document.getElementById('credits-main-view');
  const subview = document.getElementById('credits-subview-history');
  if (mainView && subview) {
    mainView.style.display = 'none';
    subview.style.display = 'flex';
    
    const extMain = document.querySelector('.ext-main');
    if (extMain) {
      extMain.scrollTop = 0;
      setTimeout(() => { extMain.scrollTop = 0; }, 10);
      setTimeout(() => { extMain.scrollTop = 0; }, 50);
      setTimeout(() => { extMain.scrollTop = 0; }, 150);
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    loadUserOrderHistory();
  }
}`;

popupJs = popupJs.replace(
  /function openOrderHistoryPage\(\)\s*\{[\s\S]*?loadUserOrderHistory\(\);\s*\}\s*\}/,
  targetOpenHistory
);

fs.writeFileSync('chrome-extension/popup.js', popupJs, 'utf8');
fs.writeFileSync('chrome-extension/sidepanel.js', popupJs, 'utf8');
console.log('✓ popup.js and sidepanel.js updated with robust scrollTop reset');
