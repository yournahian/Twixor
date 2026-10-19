const fs = require('fs');

let popupCss = fs.readFileSync('chrome-extension/popup.css', 'utf8');

// Ensure --primary-hover is defined in tokens
if (!popupCss.includes('--primary-hover:')) {
  popupCss = popupCss.replace('--primary-2: #0F4BB0;', '--primary-2: #0F4BB0;\n  --primary-hover: #175BB5;');
  popupCss = popupCss.replace('--primary-2: #1E6FD9;', '--primary-2: #1E6FD9;\n  --primary-hover: #2563EB;');
  console.log('✓ Added --primary-hover CSS tokens to light and dark themes');
}

// 1. Fix .subview-title to use var(--text) instead of hardcoded #FFFFFF
popupCss = popupCss.replace(
  /\.subview-title\s*\{[^}]*color:\s*#FFFFFF\s*!important;[^}]*\}/g,
  `.subview-title {
  justify-self: center !important;
  text-align: center !important;
  font-size: 15px !important;
  font-weight: 800 !important;
  color: var(--text) !important;
  letter-spacing: -0.2px !important;
  line-height: 30px !important;
  margin: 0 !important;
}`
);

// 2. Comprehensive Light Mode Theme Additions
const lightModeFixes = `
/* ==============================================================
   LIGHT MODE PERFECTION (FINTECH DESIGN SYSTEM)
   ============================================================== */

/* Subview Navigation Buttons (Back & Refresh) */
.subview-nav-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 5px !important;
  height: 30px !important;
  padding: 0 14px !important;
  border-radius: var(--radius-pill) !important;
  background: var(--surface) !important;
  border: 1px solid var(--border) !important;
  color: var(--text) !important;
  font-size: 11.5px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  white-space: nowrap !important;
  box-sizing: border-box !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06) !important;
}

.subview-nav-btn:hover {
  background: var(--surface-2) !important;
  border-color: var(--primary) !important;
  color: var(--primary) !important;
}

[data-theme="dark"] .subview-nav-btn,
body.dark .subview-nav-btn {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: var(--border) !important;
  color: #FFFFFF !important;
  box-shadow: none !important;
}

[data-theme="dark"] .subview-nav-btn:hover,
body.dark .subview-nav-btn:hover {
  background: rgba(255, 255, 255, 0.16) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #FFFFFF !important;
}

/* Preset Chips active state contrast */
.credit-preset-btn.active {
  background: linear-gradient(135deg, var(--primary), var(--primary-2, #0F4BB0)) !important;
  border-color: var(--primary) !important;
  color: #FFFFFF !important;
  box-shadow: 0 2px 8px rgba(30, 111, 217, 0.4) !important;
}

/* Order History Entry Card */
.order-history-nav-card-btn {
  background: var(--surface) !important;
  border: 1px solid var(--border) !important;
  box-shadow: var(--shadow) !important;
}

.order-history-nav-card-btn:hover {
  background: var(--surface-2) !important;
  border-color: var(--primary) !important;
}

[data-theme="dark"] .order-history-nav-card-btn,
body.dark .order-history-nav-card-btn {
  background: rgba(15, 23, 42, 0.65) !important;
  box-shadow: none !important;
}

[data-theme="dark"] .order-history-nav-card-btn:hover,
body.dark .order-history-nav-card-btn:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(59, 130, 246, 0.4) !important;
}

/* Payment Instructions Box */
.payment-instructions-box {
  background: var(--surface-2) !important;
  border: 1px solid var(--border) !important;
}

.payment-dest-val {
  color: var(--text) !important;
}

.payment-inst-sub {
  color: var(--text-2) !important;
}

[data-theme="dark"] .payment-instructions-box,
body.dark .payment-instructions-box {
  background: rgba(15, 23, 42, 0.65) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

[data-theme="dark"] .payment-dest-val,
body.dark .payment-dest-val {
  color: #F8FAFC !important;
}

/* Cancel Pill Buttons in Light vs Dark */
.step-cancel-pill-btn {
  background: rgba(239, 68, 68, 0.08) !important;
  border: 1px solid rgba(239, 68, 68, 0.3) !important;
  color: #DC2626 !important;
}

.step-cancel-pill-btn:hover {
  background: rgba(239, 68, 68, 0.18) !important;
  border-color: #DC2626 !important;
  color: #B91C1C !important;
}

[data-theme="dark"] .step-cancel-pill-btn,
body.dark .step-cancel-pill-btn {
  background: rgba(239, 68, 68, 0.12) !important;
  border-color: rgba(239, 68, 68, 0.35) !important;
  color: #FCA5A5 !important;
}

[data-theme="dark"] .step-cancel-pill-btn:hover,
body.dark .step-cancel-pill-btn:hover {
  background: rgba(239, 68, 68, 0.25) !important;
  border-color: #EF4444 !important;
  color: #FFFFFF !important;
}

/* Carousel Slides Light vs Dark */
.carousel-slide.theme-founding {
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.08), rgba(255, 255, 255, 0.98)) !important;
  border: 1.5px solid rgba(255, 107, 0, 0.35) !important;
  box-shadow: 0 4px 18px rgba(255, 107, 0, 0.1) !important;
}
.carousel-slide.theme-free {
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.08), rgba(255, 255, 255, 0.98)) !important;
  border: 1.5px solid rgba(100, 116, 139, 0.25) !important;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05) !important;
}
.carousel-slide.theme-starter {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(255, 255, 255, 0.98)) !important;
  border: 1.5px solid rgba(37, 99, 235, 0.35) !important;
  box-shadow: 0 4px 18px rgba(37, 99, 235, 0.1) !important;
}
.carousel-slide.theme-pro {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(255, 255, 255, 0.98)) !important;
  border: 1.5px solid rgba(124, 58, 237, 0.35) !important;
  box-shadow: 0 4px 18px rgba(124, 58, 237, 0.1) !important;
}
.carousel-slide.theme-growth {
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(255, 255, 255, 0.98)) !important;
  border: 1.5px solid rgba(5, 150, 105, 0.35) !important;
  box-shadow: 0 4px 18px rgba(5, 150, 105, 0.1) !important;
}
.carousel-slide.theme-enterprise {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(255, 255, 255, 0.98)) !important;
  border: 1.5px solid rgba(217, 119, 6, 0.35) !important;
  box-shadow: 0 4px 18px rgba(217, 119, 6, 0.1) !important;
}

[data-theme="dark"] .carousel-slide.theme-founding, body.dark .carousel-slide.theme-founding {
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.14), rgba(15, 23, 42, 0.7)) !important;
  border-color: rgba(255, 107, 0, 0.45) !important;
  box-shadow: none !important;
}
[data-theme="dark"] .carousel-slide.theme-free, body.dark .carousel-slide.theme-free {
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.14), rgba(15, 23, 42, 0.7)) !important;
  border-color: rgba(100, 116, 139, 0.35) !important;
  box-shadow: none !important;
}
[data-theme="dark"] .carousel-slide.theme-starter, body.dark .carousel-slide.theme-starter {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.16), rgba(15, 23, 42, 0.7)) !important;
  border-color: rgba(37, 99, 235, 0.45) !important;
  box-shadow: none !important;
}
[data-theme="dark"] .carousel-slide.theme-pro, body.dark .carousel-slide.theme-pro {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.16), rgba(15, 23, 42, 0.7)) !important;
  border-color: rgba(124, 58, 237, 0.45) !important;
  box-shadow: none !important;
}
[data-theme="dark"] .carousel-slide.theme-growth, body.dark .carousel-slide.theme-growth {
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.16), rgba(15, 23, 42, 0.7)) !important;
  border-color: rgba(5, 150, 105, 0.45) !important;
  box-shadow: none !important;
}
[data-theme="dark"] .carousel-slide.theme-enterprise, body.dark .carousel-slide.theme-enterprise {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.16), rgba(15, 23, 42, 0.7)) !important;
  border-color: rgba(217, 119, 6, 0.45) !important;
  box-shadow: none !important;
}

.carousel-slide-features {
  color: var(--text-2) !important;
}

/* Modal Overlay & Card (Light Mode vs Dark Mode) */
.ext-modal-overlay {
  background: rgba(15, 23, 42, 0.45) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
}

.ext-notify-card {
  background: #FFFFFF !important;
  border: 1px solid var(--border) !important;
  box-shadow: 0 20px 50px rgba(30, 111, 217, 0.22), 0 0 1px rgba(0, 0, 0, 0.12) !important;
  color: var(--text) !important;
}

.ext-notify-title {
  color: var(--text) !important;
}

.ext-notify-body {
  color: var(--text-2) !important;
}

.ext-notify-close-btn {
  background: rgba(0, 0, 0, 0.05) !important;
  border: 1px solid var(--border) !important;
  color: var(--text-2) !important;
}

.ext-notify-close-btn:hover {
  background: rgba(0, 0, 0, 0.1) !important;
  color: var(--text) !important;
}

[data-theme="dark"] .ext-modal-overlay,
body.dark .ext-modal-overlay {
  background: rgba(5, 8, 18, 0.78) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
}

[data-theme="dark"] .ext-notify-card,
body.dark .ext-notify-card {
  background: rgba(13, 20, 38, 0.96) !important;
  border: 1px solid rgba(59, 130, 246, 0.35) !important;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(30, 111, 217, 0.25) !important;
  color: #FFFFFF !important;
}

[data-theme="dark"] .ext-notify-title,
body.dark .ext-notify-title {
  color: #FFFFFF !important;
}

[data-theme="dark"] .ext-notify-body,
body.dark .ext-notify-body {
  color: #CBD5E1 !important;
}

[data-theme="dark"] .ext-notify-close-btn,
body.dark .ext-notify-close-btn {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  color: var(--text-2) !important;
}

[data-theme="dark"] .ext-notify-close-btn:hover,
body.dark .ext-notify-close-btn:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  color: #FFFFFF !important;
}

/* Order History Item (Light Mode vs Dark Mode) */
.order-history-item {
  background: var(--surface) !important;
  border: 1px solid var(--border) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}

[data-theme="dark"] .order-history-item,
body.dark .order-history-item {
  background: rgba(255, 255, 255, 0.03) !important;
  border-color: rgba(255, 255, 255, 0.06) !important;
  box-shadow: none !important;
}

/* Status Pill Contrast in Light Mode */
.order-status-pill.pending {
  background: rgba(245, 158, 11, 0.15) !important;
  border: 1px solid rgba(245, 158, 11, 0.45) !important;
  color: #B45309 !important;
}

.order-status-pill.approved {
  background: rgba(34, 197, 94, 0.15) !important;
  border: 1px solid rgba(34, 197, 94, 0.45) !important;
  color: #15803D !important;
}

.order-status-pill.rejected {
  background: rgba(239, 68, 68, 0.15) !important;
  border: 1px solid rgba(239, 68, 68, 0.45) !important;
  color: #B91C1C !important;
}

[data-theme="dark"] .order-status-pill.pending,
body.dark .order-status-pill.pending {
  color: #FCD34D !important;
}

[data-theme="dark"] .order-status-pill.approved,
body.dark .order-status-pill.approved {
  color: #86EFAC !important;
}

[data-theme="dark"] .order-status-pill.rejected,
body.dark .order-status-pill.rejected {
  color: #F87171 !important;
}

.order-item-trx {
  background: rgba(0, 0, 0, 0.05) !important;
  color: var(--text-2) !important;
}

[data-theme="dark"] .order-item-trx,
body.dark .order-item-trx {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #94A3B8 !important;
}
`;

if (!popupCss.includes('LIGHT MODE PERFECTION')) {
  popupCss += '\n' + lightModeFixes;
}

fs.writeFileSync('chrome-extension/popup.css', popupCss, 'utf8');
fs.writeFileSync('chrome-extension/sidepanel.css', popupCss, 'utf8');
console.log('✓ Successfully wrote light mode enhancements to popup.css and sidepanel.css');
