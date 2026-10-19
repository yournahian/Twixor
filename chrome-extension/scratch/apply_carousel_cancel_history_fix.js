const fs = require('fs');

// ==============================================================
// 1. UPDATE build_fintech_full.js
// ==============================================================
let buildJs = fs.readFileSync('chrome-extension/build_fintech_full.js', 'utf8');

// Replace Step 2 header to include Cancel button
const oldStep2Marker = `<div class="buy-step-wrap progressive-step" id="buyStep2" style="display:none;">
              <div class="buy-step-title-row">
                <span class="step-num-badge">2</span>
                <span class="buy-step-title">Select Payment Method</span>
              </div>`;

const newStep2Marker = `<div class="buy-step-wrap progressive-step" id="buyStep2" style="display:none;">
              <div class="buy-step-header-row">
                <div class="buy-step-title-row">
                  <span class="step-num-badge">2</span>
                  <span class="buy-step-title">Select Payment Method</span>
                </div>
                <button type="button" class="step-cancel-pill-btn" id="extCancelStep2Btn" title="Back to Step 1">✕ Cancel</button>
              </div>`;

if (buildJs.includes(oldStep2Marker)) {
  buildJs = buildJs.replace(oldStep2Marker, newStep2Marker);
  console.log('✓ Successfully added Cancel button to Step 2');
}

// Replace Step 3 header to include Cancel button
const oldStep3Marker = `<div class="buy-step-wrap progressive-step" id="buyStep3" style="display:none;">
              <div class="buy-step-title-row">
                <span class="step-num-badge">3</span>
                <span class="buy-step-title">Complete Payment &amp; Submit Proof</span>
              </div>`;

const newStep3Marker = `<div class="buy-step-wrap progressive-step" id="buyStep3" style="display:none;">
              <div class="buy-step-header-row">
                <div class="buy-step-title-row">
                  <span class="step-num-badge">3</span>
                  <span class="buy-step-title">Complete Payment &amp; Submit Proof</span>
                </div>
                <button type="button" class="step-cancel-pill-btn" id="extCancelStep3Btn" title="Back to Step 2">✕ Cancel</button>
              </div>`;

if (buildJs.includes(oldStep3Marker)) {
  buildJs = buildJs.replace(oldStep3Marker, newStep3Marker);
  console.log('✓ Successfully added Cancel button to Step 3');
}

// Replace Subview Header to 3-column layout
const oldHeaderMarker = `<div class="subview-header">
            <button type="button" class="back-pill-btn" id="extBackFromHistoryBtn">← Back to Credits</button>
            <span class="subview-title">Order History</span>
            <button type="button" class="copy-pill-btn" id="extRefreshOrderHistoryBtn" style="font-size:11px;">↻ Refresh</button>
          </div>`;

const newHeaderMarker = `<div class="subview-header">
            <div class="subview-header-left">
              <button type="button" class="back-pill-btn" id="extBackFromHistoryBtn">← Back to Credits</button>
            </div>
            <div class="subview-title">Order History</div>
            <div class="subview-header-right">
              <button type="button" class="copy-pill-btn" id="extRefreshOrderHistoryBtn" style="font-size:11px;">↻ Refresh</button>
            </div>
          </div>`;

if (buildJs.includes(oldHeaderMarker)) {
  buildJs = buildJs.replace(oldHeaderMarker, newHeaderMarker);
  console.log('✓ Successfully updated Subview Header to 3-column layout');
}

// Enhance Carousel slides UI & buttons
const oldSlide0 = `<div class="founding-offer-card carousel-slide active theme-founding" data-slide-index="0" data-credits="5000" data-price="2" data-name="FOUNDING 100">
                  <div class="founding-offer-header">
                    <span class="founding-badge">LIMITED OFFER</span>
                    <span class="founding-title">FOUNDING 100</span>
                  </div>
                  <div class="founding-price-row">
                    <span class="founding-price-old">$5</span>
                    <span class="founding-price-big">$2</span>
                    <span class="founding-price-sub">/mo</span>
                    <span class="founding-credits-pill">5,000 Credits</span>
                  </div>
                  <div class="founding-timer-box">
                    <div id="extFoundingCountdownTimer">02d : 14h : 27m</div>
                  </div>
                  <button type="button" class="founding-claim-btn claim-offer-trigger-btn" data-credits="5000" data-price="2" data-name="FOUNDING 100">
                    Claim Founding 100 ($2)
                  </button>
                </div>`;

const newSlide0 = `<div class="founding-offer-card carousel-slide active theme-founding" data-slide-index="0" data-credits="5000" data-price="2" data-name="FOUNDING 100">
                  <div class="founding-offer-header">
                    <span class="founding-badge">🔥 LIMITED LAUNCH OFFER</span>
                    <span class="founding-title">FOUNDING 100</span>
                  </div>
                  <div class="founding-price-row">
                    <span class="founding-price-old">$5</span>
                    <span class="founding-price-big">$2</span>
                    <span class="founding-price-sub">/mo</span>
                    <span class="founding-credits-pill">5,000 Credits</span>
                  </div>
                  <div class="founding-timer-box">
                    <span style="font-size:10px; color:#FDBA74; margin-right:4px;">⏱ ENDS IN:</span>
                    <span id="extFoundingCountdownTimer">02d : 14h : 27m</span>
                  </div>
                  <button type="button" class="founding-claim-btn claim-offer-trigger-btn btn-glow-founding" data-credits="5000" data-price="2" data-name="FOUNDING 100">
                    ⚡ Claim Founding 100 ($2)
                  </button>
                </div>`;

if (buildJs.includes(oldSlide0)) {
  buildJs = buildJs.replace(oldSlide0, newSlide0);
  console.log('✓ Successfully enhanced Slide 0 UI');
}

fs.writeFileSync('chrome-extension/build_fintech_full.js', buildJs, 'utf8');

// ==============================================================
// 2. UPDATE popup.css
// ==============================================================
let popupCss = fs.readFileSync('chrome-extension/popup.css', 'utf8');

// Add .buy-step-header-row and .step-cancel-pill-btn
const stepCancelStyles = `
/* Step Header with Cancel Button */
.buy-step-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 6px;
}

.step-cancel-pill-btn {
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #FCA5A5;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1;
}

.step-cancel-pill-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: #EF4444;
  color: #FFFFFF;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}
`;

if (!popupCss.includes('.buy-step-header-row')) {
  popupCss += '\n' + stepCancelStyles;
}

// Fix carousel container & track sizing so no card has any part outside the screen
const oldCarouselContainerRules = `.offers-carousel-container {
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-card);
}

.offers-carousel-track {
  display: flex;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.carousel-slide {
  min-width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  margin: 0 !important;
}`;

const newCarouselContainerRules = `.offers-carousel-container {
  width: 100% !important;
  max-width: 100% !important;
  position: relative !important;
  overflow: hidden !important;
  border-radius: var(--radius-card) !important;
  box-sizing: border-box !important;
}

.offers-carousel-track {
  display: flex !important;
  width: 100% !important;
  transition: transform 0.42s cubic-bezier(0.16, 1, 0.3, 1) !important;
  will-change: transform;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

.carousel-slide {
  flex: 0 0 100% !important;
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  margin: 0 !important;
}

/* Premium Cool Fintech Buttons for Carousel */
.founding-claim-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  width: 100% !important;
  padding: 10px 14px !important;
  font-size: 12.5px !important;
  font-weight: 800 !important;
  letter-spacing: 0.3px !important;
  border-radius: 10px !important;
  border: 1px solid rgba(255, 255, 255, 0.22) !important;
  color: #FFFFFF !important;
  cursor: pointer !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
  box-sizing: border-box !important;
}

.founding-claim-btn:hover {
  transform: translateY(-1.5px) !important;
  filter: brightness(1.12) !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45) !important;
}

.founding-claim-btn:active {
  transform: scale(0.98) !important;
}

.btn-glow-founding {
  background: linear-gradient(135deg, #FF6B00 0%, #D97706 100%) !important;
  box-shadow: 0 4px 16px rgba(255, 107, 0, 0.42) !important;
}`;

if (popupCss.includes(oldCarouselContainerRules)) {
  popupCss = popupCss.replace(oldCarouselContainerRules, newCarouselContainerRules);
  console.log('✓ Successfully fixed Carousel Container strict 100% width and button glow');
}

// Update Subview Header to 3-column grid perfectly centered and spaced lower
const oldSubviewHeader = `.subview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 2px;
}

.subview-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--text);
}`;

const newSubviewHeader = `.subview-header {
  display: grid !important;
  grid-template-columns: 1fr auto 1fr !important;
  align-items: center !important;
  padding: 16px 4px 12px 4px !important;
  margin-top: 4px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.subview-header-left {
  justify-self: start !important;
}

.subview-title {
  justify-self: center !important;
  text-align: center !important;
  font-size: 15px !important;
  font-weight: 800 !important;
  color: #FFFFFF !important;
  letter-spacing: -0.2px !important;
}

.subview-header-right {
  justify-self: end !important;
}`;

if (popupCss.includes(oldSubviewHeader)) {
  popupCss = popupCss.replace(oldSubviewHeader, newSubviewHeader);
  console.log('✓ Successfully updated Subview Header CSS to 3-column centered grid with margin-top');
}

fs.writeFileSync('chrome-extension/popup.css', popupCss, 'utf8');
fs.writeFileSync('chrome-extension/sidepanel.css', popupCss, 'utf8');

// ==============================================================
// 3. UPDATE popup.js (and sidepanel.js)
// ==============================================================
let popupJs = fs.readFileSync('chrome-extension/popup.js', 'utf8');

// Add cancel button handlers and scroll reset in initBuyCreditsGateway & openOrderHistoryPage
const oldInitGatewayStart = 'async function initBuyCreditsGateway() {';
const newCancelWiring = `  // Wire Cancel buttons for Step 2 and Step 3
  const cancelStep2Btn = document.getElementById('extCancelStep2Btn');
  if (cancelStep2Btn && !cancelStep2Btn._wired) {
    cancelStep2Btn._wired = true;
    cancelStep2Btn.addEventListener('click', () => {
      resetBuyStepsToStep1();
      document.getElementById('buyStep1')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  const cancelStep3Btn = document.getElementById('extCancelStep3Btn');
  if (cancelStep3Btn && !cancelStep3Btn._wired) {
    cancelStep3Btn._wired = true;
    cancelStep3Btn.addEventListener('click', () => {
      const step3 = document.getElementById('buyStep3');
      if (step3) step3.style.display = 'none';
      document.getElementById('buyStep2')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }`;

if (popupJs.includes('// 1. Preset Chips wiring') && !popupJs.includes('extCancelStep2Btn')) {
  popupJs = popupJs.replace('// 1. Preset Chips wiring', newCancelWiring + '\n\n  // 1. Preset Chips wiring');
  console.log('✓ Successfully wired Cancel buttons in popup.js');
}

// Update openOrderHistoryPage to reset scroll position to top
const oldOpenOrderHistory = `function openOrderHistoryPage() {
  const mainView = document.getElementById('credits-main-view');
  const subview = document.getElementById('credits-subview-history');
  if (mainView && subview) {
    mainView.style.display = 'none';
    subview.style.display = 'flex';
    loadUserOrderHistory();
  }
}`;

const newOpenOrderHistory = `function openOrderHistoryPage() {
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

if (popupJs.includes(oldOpenOrderHistory)) {
  popupJs = popupJs.replace(oldOpenOrderHistory, newOpenOrderHistory);
  console.log('✓ Successfully updated openOrderHistoryPage to reset scroll position to top');
}

// Update closeOrderHistoryPage to also reset scroll
const oldCloseOrderHistory = `function closeOrderHistoryPage() {
  const mainView = document.getElementById('credits-main-view');
  const subview = document.getElementById('credits-subview-history');
  if (mainView && subview) {
    subview.style.display = 'none';
    mainView.style.display = 'flex';
  }
}`;

const newCloseOrderHistory = `function closeOrderHistoryPage() {
  const mainView = document.getElementById('credits-main-view');
  const subview = document.getElementById('credits-subview-history');
  if (mainView && subview) {
    subview.style.display = 'none';
    mainView.style.display = 'flex';

    const extMain = document.querySelector('.ext-main');
    if (extMain) extMain.scrollTop = 0;
    window.scrollTo(0, 0);
  }
}`;

if (popupJs.includes(oldCloseOrderHistory)) {
  popupJs = popupJs.replace(oldCloseOrderHistory, newCloseOrderHistory);
  console.log('✓ Successfully updated closeOrderHistoryPage to reset scroll');
}

fs.writeFileSync('chrome-extension/popup.js', popupJs, 'utf8');
fs.writeFileSync('chrome-extension/sidepanel.js', popupJs, 'utf8');
console.log('✓ Successfully updated chrome-extension/popup.js and synced to sidepanel.js!');
