const fs = require('fs');

let css = fs.readFileSync('chrome-extension/popup.css', 'utf8');

// 1. Replace line 2703 payment-instructions-box
css = css.replace(
  /\.payment-instructions-box\s*\{[\s\S]*?background:\s*rgba\(15,\s*23,\s*42,\s*0\.65\);[\s\S]*?\}/,
  `.payment-instructions-box {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}`
);

// 2. Replace lines 2928-2956 carousel slides
const oldSlidesBlock = `/* Slide Color Themes */
.carousel-slide.theme-founding {
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(15, 23, 42, 0.6)) !important;
  border: 1.5px solid rgba(255, 107, 0, 0.4) !important;
}

.carousel-slide.theme-free {
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.12), rgba(15, 23, 42, 0.6)) !important;
  border: 1.5px solid rgba(100, 116, 139, 0.35) !important;
}

.carousel-slide.theme-starter {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(15, 23, 42, 0.6)) !important;
  border: 1.5px solid rgba(37, 99, 235, 0.4) !important;
}

.carousel-slide.theme-pro {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.14), rgba(15, 23, 42, 0.6)) !important;
  border: 1.5px solid rgba(124, 58, 237, 0.45) !important;
}

.carousel-slide.theme-growth {
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.14), rgba(15, 23, 42, 0.6)) !important;
  border: 1.5px solid rgba(5, 150, 105, 0.45) !important;
}

.carousel-slide.theme-enterprise {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.14), rgba(15, 23, 42, 0.6)) !important;
  border: 1.5px solid rgba(217, 119, 6, 0.45) !important;
}`;

const newSlidesBlock = `/* Slide Color Themes — Dynamic Light & Dark */
.carousel-slide.theme-founding {
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.08), var(--surface)) !important;
  border: 1.5px solid rgba(255, 107, 0, 0.4) !important;
}

.carousel-slide.theme-free {
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.08), var(--surface)) !important;
  border: 1.5px solid rgba(100, 116, 139, 0.28) !important;
}

.carousel-slide.theme-starter {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), var(--surface)) !important;
  border: 1.5px solid rgba(37, 99, 235, 0.38) !important;
}

.carousel-slide.theme-pro {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), var(--surface)) !important;
  border: 1.5px solid rgba(124, 58, 237, 0.38) !important;
}

.carousel-slide.theme-growth {
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.08), var(--surface)) !important;
  border: 1.5px solid rgba(5, 150, 105, 0.38) !important;
}

.carousel-slide.theme-enterprise {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.08), var(--surface)) !important;
  border: 1.5px solid rgba(217, 119, 6, 0.38) !important;
}

[data-theme="dark"] .carousel-slide.theme-founding,
body.dark .carousel-slide.theme-founding {
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.14), rgba(15, 23, 42, 0.7)) !important;
}
[data-theme="dark"] .carousel-slide.theme-free,
body.dark .carousel-slide.theme-free {
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.14), rgba(15, 23, 42, 0.7)) !important;
}
[data-theme="dark"] .carousel-slide.theme-starter,
body.dark .carousel-slide.theme-starter {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.16), rgba(15, 23, 42, 0.7)) !important;
}
[data-theme="dark"] .carousel-slide.theme-pro,
body.dark .carousel-slide.theme-pro {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.16), rgba(15, 23, 42, 0.7)) !important;
}
[data-theme="dark"] .carousel-slide.theme-growth,
body.dark .carousel-slide.theme-growth {
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.16), rgba(15, 23, 42, 0.7)) !important;
}
[data-theme="dark"] .carousel-slide.theme-enterprise,
body.dark .carousel-slide.theme-enterprise {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.16), rgba(15, 23, 42, 0.7)) !important;
}`;

if (css.includes(oldSlidesBlock)) {
  css = css.replace(oldSlidesBlock, newSlidesBlock);
  console.log('✓ Replaced old dark slide themes with dynamic var(--surface) and dark overrides');
}

// 3. Replace line 3034 order-history-nav-card-btn
css = css.replace(
  /\.order-history-nav-card-btn\s*\{[\s\S]*?background:\s*rgba\(15,\s*23,\s*42,\s*0\.65\);[\s\S]*?\}/,
  `.order-history-nav-card-btn {
  width: 100%;
  padding: 12px 14px;
  border-radius: var(--radius-card);
  background: var(--surface);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
  box-shadow: var(--shadow);
}`
);

// 4. Update applyExtTheme in popup.js to also sync classes
let popupJs = fs.readFileSync('chrome-extension/popup.js', 'utf8');
const oldApplyTheme = `function applyExtTheme(theme) {
  const isDark = theme !== 'light';
  document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');`;

const newApplyTheme = `function applyExtTheme(theme) {
  const isDark = theme !== 'light';
  document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.body.classList.toggle('dark', isDark);
  document.body.classList.toggle('light', !isDark);
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('light', !isDark);`;

if (popupJs.includes(oldApplyTheme)) {
  popupJs = popupJs.replace(oldApplyTheme, newApplyTheme);
  console.log('✓ Updated applyExtTheme in popup.js to sync classList on body & html');
}

// 5. Update openOrderHistoryPage in popup.js to enforce scrollIntoView
const oldOpenHistory = `function openOrderHistoryPage() {
  const mainView = document.getElementById('credits-main-view');
  const subview = document.getElementById('credits-subview-history');
  if (mainView && subview) {
    mainView.style.display = 'none';
    subview.style.display = 'flex';
    
    // Reset scroll to top so header is never scrolled under top branding
    const extMain = document.querySelector('.ext-main');
    if (extMain) extMain.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    loadUserOrderHistory();
  }
}`;

const newOpenHistory = `function openOrderHistoryPage() {
  const mainView = document.getElementById('credits-main-view');
  const subview = document.getElementById('credits-subview-history');
  if (mainView && subview) {
    mainView.style.display = 'none';
    subview.style.display = 'flex';
    
    const extMain = document.querySelector('.ext-main');
    if (extMain) extMain.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Use requestAnimationFrame so layout finishes before scrolling
    requestAnimationFrame(() => {
      if (extMain) extMain.scrollTop = 0;
      subview.scrollIntoView({ behavior: 'auto', block: 'start' });
    });

    loadUserOrderHistory();
  }
}`;

if (popupJs.includes(oldOpenHistory)) {
  popupJs = popupJs.replace(oldOpenHistory, newOpenHistory);
  console.log('✓ Updated openOrderHistoryPage with requestAnimationFrame scrollIntoView');
}

fs.writeFileSync('chrome-extension/popup.css', css, 'utf8');
fs.writeFileSync('chrome-extension/sidepanel.css', css, 'utf8');
fs.writeFileSync('chrome-extension/popup.js', popupJs, 'utf8');
fs.writeFileSync('chrome-extension/sidepanel.js', popupJs, 'utf8');
console.log('✓ All CSS and JS files synchronized successfully!');
