const fs = require('fs');

// 1. UPDATE chrome-extension/build_fintech_full.js
let buildJs = fs.readFileSync('chrome-extension/build_fintech_full.js', 'utf8');

// Update Step 3 title so it never wraps
const oldStep3Title = '<span class="buy-step-title">Complete Payment &amp; Submit Proof</span>';
const newStep3Title = '<span class="buy-step-title">Payment Details &amp; Proof</span>';
if (buildJs.includes(oldStep3Title)) {
  buildJs = buildJs.replace(oldStep3Title, newStep3Title);
  console.log('✓ Updated Step 3 title to concise single-line format');
}

// Update Subview Header buttons and text
const oldHeader = `<div class="subview-header">
            <div class="subview-header-left">
              <button type="button" class="back-pill-btn" id="extBackFromHistoryBtn">← Back to Credits</button>
            </div>
            <div class="subview-title">Order History</div>
            <div class="subview-header-right">
              <button type="button" class="copy-pill-btn" id="extRefreshOrderHistoryBtn" style="font-size:11px;">↻ Refresh</button>
            </div>
          </div>`;

const newHeader = `<div class="subview-header">
            <div class="subview-header-left">
              <button type="button" class="subview-nav-btn" id="extBackFromHistoryBtn">← Back</button>
            </div>
            <div class="subview-title">Order History</div>
            <div class="subview-header-right">
              <button type="button" class="subview-nav-btn" id="extRefreshOrderHistoryBtn">↻ Refresh</button>
            </div>
          </div>`;

if (buildJs.includes(oldHeader)) {
  buildJs = buildJs.replace(oldHeader, newHeader);
  console.log('✓ Updated Subview Header with "← Back" and neutral "↻ Refresh" button');
}

fs.writeFileSync('chrome-extension/build_fintech_full.js', buildJs, 'utf8');

// 2. UPDATE chrome-extension/popup.css
let popupCss = fs.readFileSync('chrome-extension/popup.css', 'utf8');

const oldHeaderAndCancelCSS = `/* Step Header with Cancel Button */
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
}`;

const newHeaderAndCancelCSS = `/* Step Header with Cancel Button */
.buy-step-header-row {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  width: 100% !important;
  margin-bottom: 6px !important;
  gap: 8px !important;
}

.buy-step-title-row {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  flex: 1 !important;
  min-width: 0 !important;
}

.buy-step-title {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  font-size: 11.5px !important;
  font-weight: 700 !important;
}

.step-cancel-pill-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  height: 24px !important;
  padding: 0 10px !important;
  border-radius: var(--radius-pill) !important;
  background: rgba(239, 68, 68, 0.12) !important;
  border: 1px solid rgba(239, 68, 68, 0.35) !important;
  color: #FCA5A5 !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
}

.step-cancel-pill-btn:hover {
  background: rgba(239, 68, 68, 0.25) !important;
  border-color: #EF4444 !important;
  color: #FFFFFF !important;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4) !important;
}

/* Subview Nav Buttons (Identical Back and Refresh) */
.subview-nav-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 5px !important;
  height: 30px !important;
  padding: 0 14px !important;
  border-radius: var(--radius-pill) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid var(--border) !important;
  color: var(--text) !important;
  font-size: 11.5px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  white-space: nowrap !important;
  box-sizing: border-box !important;
}

.subview-nav-btn:hover {
  background: rgba(255, 255, 255, 0.16) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #FFFFFF !important;
}`;

if (popupCss.includes(oldHeaderAndCancelCSS)) {
  popupCss = popupCss.replace(oldHeaderAndCancelCSS, newHeaderAndCancelCSS);
  console.log('✓ Replaced old Cancel & Subview CSS with polished uniform styles');
} else {
  popupCss += '\n' + newHeaderAndCancelCSS;
  console.log('✓ Appended new Cancel & Subview CSS');
}

fs.writeFileSync('chrome-extension/popup.css', popupCss, 'utf8');
fs.writeFileSync('chrome-extension/sidepanel.css', popupCss, 'utf8');
console.log('✓ Synced popup.css to sidepanel.css');
