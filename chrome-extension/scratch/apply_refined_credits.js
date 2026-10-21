const fs = require('fs');

let buildJs = fs.readFileSync('chrome-extension/build_fintech_full.js', 'utf8');

// 1. New panel-credits markup with Pre-rendered 6-Slide Carousel, Progressive 3-Step Wizard, and Subview Order History
const newPanelCreditsMarkup = `      <!-- ============================================== -->
      <!-- TAB 4: CREDITS -->
      <!-- ============================================== -->
      <section id="panel-credits" class="tab-panel">
        <!-- SUBVIEW A: MAIN CREDITS & BUY PORTAL -->
        <div id="credits-main-view" style="display:flex; flex-direction:column; gap:14px; width:100%;">
          
          <!-- 1. Auto-Scrolling Carousel: Plans & Limited Special Offers -->
          <div class="offers-carousel-wrapper">
            <div class="carousel-nav-header">
              <span class="carousel-section-tag">🔥 PLANS &amp; SPECIAL OFFERS</span>
              <div class="carousel-nav-arrows">
                <button type="button" class="carousel-arrow-btn" id="extCarouselPrevBtn" title="Previous Offer">‹</button>
                <button type="button" class="carousel-arrow-btn" id="extCarouselNextBtn" title="Next Offer">›</button>
              </div>
            </div>

            <div class="offers-carousel-container" id="extOffersCarouselContainer">
              <div class="offers-carousel-track" id="extOffersCarouselTrack">
                
                <!-- Slide 0: FOUNDING 100 (Special Launch Offer) -->
                <div class="founding-offer-card carousel-slide active theme-founding" data-slide-index="0" data-credits="5000" data-price="2" data-name="FOUNDING 100">
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
                </div>

                <!-- Slide 1: FREE TIER -->
                <div class="founding-offer-card carousel-slide theme-free" data-slide-index="1" data-credits="100" data-price="0" data-name="FREE TIER">
                  <div class="founding-offer-header">
                    <span class="founding-badge" style="background:#64748B;">FREE TIER</span>
                    <span class="founding-title">EVALUATION PACK</span>
                  </div>
                  <div class="founding-price-row">
                    <span class="founding-price-big">$0</span>
                    <span class="founding-price-sub">/forever</span>
                    <span class="founding-credits-pill" style="background:rgba(100,116,139,0.3); border-color:#64748B;">100 Credits</span>
                  </div>
                  <div class="carousel-slide-features">
                    Free Curated Feeds • Basic Tone Presets • Handle Audits
                  </div>
                  <button type="button" class="founding-claim-btn claim-offer-trigger-btn" style="background:linear-gradient(135deg, #475569, #334155);" data-credits="100" data-price="0" data-name="FREE TIER">
                    Select Free Tier ($0)
                  </button>
                </div>

                <!-- Slide 2: STARTER -->
                <div class="founding-offer-card carousel-slide theme-starter" data-slide-index="2" data-credits="2500" data-price="5" data-name="STARTER">
                  <div class="founding-offer-header">
                    <span class="founding-badge" style="background:#2563EB;">ENTRY GROWTH</span>
                    <span class="founding-title">STARTER PLAN</span>
                  </div>
                  <div class="founding-price-row">
                    <span class="founding-price-old">$8</span>
                    <span class="founding-price-big">$5</span>
                    <span class="founding-price-sub">/mo</span>
                    <span class="founding-credits-pill" style="background:rgba(37,99,235,0.3); border-color:#2563EB;">2,500 Credits</span>
                  </div>
                  <div class="carousel-slide-features">
                    All 12 Growth Agents • Professional Style • Human-like Pacing
                  </div>
                  <button type="button" class="founding-claim-btn claim-offer-trigger-btn" style="background:linear-gradient(135deg, #2563EB, #1D4ED8);" data-credits="2500" data-price="5" data-name="STARTER">
                    Claim Starter ($5)
                  </button>
                </div>

                <!-- Slide 3: PRO (Most Popular) -->
                <div class="founding-offer-card carousel-slide theme-pro" data-slide-index="3" data-credits="10000" data-price="15" data-name="PRO">
                  <div class="founding-offer-header">
                    <span class="founding-badge" style="background:#7C3AED;">MOST POPULAR</span>
                    <span class="founding-title">PRO ACCELERATOR</span>
                  </div>
                  <div class="founding-price-row">
                    <span class="founding-price-old">$25</span>
                    <span class="founding-price-big">$15</span>
                    <span class="founding-price-sub">/mo</span>
                    <span class="founding-credits-pill" style="background:rgba(124,58,237,0.3); border-color:#7C3AED;">10,000 Credits</span>
                  </div>
                  <div class="carousel-slide-features">
                    Priority AI Models • 10 Custom Tone Styles • Fast Processing
                  </div>
                  <button type="button" class="founding-claim-btn claim-offer-trigger-btn" style="background:linear-gradient(135deg, #7C3AED, #6D28D9);" data-credits="10000" data-price="15" data-name="PRO">
                    Claim Pro ($15)
                  </button>
                </div>

                <!-- Slide 4: GROWTH (Best Value) -->
                <div class="founding-offer-card carousel-slide theme-growth" data-slide-index="4" data-credits="25000" data-price="29" data-name="GROWTH">
                  <div class="founding-offer-header">
                    <span class="founding-badge" style="background:#059669;">BEST VALUE</span>
                    <span class="founding-title">GROWTH FLEET</span>
                  </div>
                  <div class="founding-price-row">
                    <span class="founding-price-old">$45</span>
                    <span class="founding-price-big">$29</span>
                    <span class="founding-price-sub">/mo</span>
                    <span class="founding-credits-pill" style="background:rgba(5,150,105,0.3); border-color:#059669;">25,000 Credits</span>
                  </div>
                  <div class="carousel-slide-features">
                    High Volume Feeds • 25 Custom Styles • 24/7 Automation Loop
                  </div>
                  <button type="button" class="founding-claim-btn claim-offer-trigger-btn" style="background:linear-gradient(135deg, #059669, #047857);" data-credits="25000" data-price="29" data-name="GROWTH">
                    Claim Growth ($29)
                  </button>
                </div>

                <!-- Slide 5: ENTERPRISE (VIP Alpha) -->
                <div class="founding-offer-card carousel-slide theme-enterprise" data-slide-index="5" data-credits="100000" data-price="79" data-name="ENTERPRISE">
                  <div class="founding-offer-header">
                    <span class="founding-badge" style="background:#D97706;">VIP ALPHA</span>
                    <span class="founding-title">ENTERPRISE ALPHA</span>
                  </div>
                  <div class="founding-price-row">
                    <span class="founding-price-old">$120</span>
                    <span class="founding-price-big">$79</span>
                    <span class="founding-price-sub">/mo</span>
                    <span class="founding-credits-pill" style="background:rgba(217,119,6,0.3); border-color:#D97706;">100,000 Credits</span>
                  </div>
                  <div class="carousel-slide-features">
                    Dedicated Failover Gateway • Unlimited Tone Styles • VIP Support
                  </div>
                  <button type="button" class="founding-claim-btn claim-offer-trigger-btn" style="background:linear-gradient(135deg, #D97706, #B45309);" data-credits="100000" data-price="79" data-name="ENTERPRISE">
                    Claim Enterprise ($79)
                  </button>
                </div>

              </div>
            </div>

            <!-- Dots Indicators -->
            <div class="carousel-dots-row" id="extCarouselDots">
              <span class="carousel-dot active" data-slide="0"></span>
              <span class="carousel-dot" data-slide="1"></span>
              <span class="carousel-dot" data-slide="2"></span>
              <span class="carousel-dot" data-slide="3"></span>
              <span class="carousel-dot" data-slide="4"></span>
              <span class="carousel-dot" data-slide="5"></span>
            </div>
          </div>

          <!-- 2. Progressive 3-Step Buy Credits Wizard Card -->
          <div class="surface-card buy-credits-panel-card" id="extBuyCreditsCard">
            <div class="field-header">
              <span class="field-label">💳 Buy Twixor Credits</span>
              \${makeInfoBtn('Step-by-step credit purchase with instant admin approval')}
            </div>

            <!-- Step 1: Choose Credits & Currency (ALWAYS VISIBLE) -->
            <div class="buy-step-wrap" id="buyStep1">
              <div class="buy-step-title-row">
                <span class="step-num-badge">1</span>
                <span class="buy-step-title">Choose Credits &amp; Currency</span>
              </div>

              <!-- Preset chips -->
              <div class="credit-presets-row" id="extCreditPresetsRow">
                <button type="button" class="preset-chip-btn credit-preset-btn" data-credits="1000">1,000 C</button>
                <button type="button" class="preset-chip-btn credit-preset-btn" data-credits="2500">2,500 C</button>
                <button type="button" class="preset-chip-btn credit-preset-btn active" data-credits="5000">5,000 C</button>
                <button type="button" class="preset-chip-btn credit-preset-btn" data-credits="10000">10,000 C</button>
                <button type="button" class="preset-chip-btn credit-preset-btn" data-credits="25000">25,000 C</button>
                <button type="button" class="preset-chip-btn credit-preset-btn" data-credits="100000">100,000 C</button>
              </div>

              <div class="grid-2-col" style="margin-top:10px;">
                <div>
                  <span class="sub-label">Credits Amount</span>
                  <input type="number" id="extBuyCreditsInput" class="ext-input" value="5000" min="500" step="500">
                </div>
                <div>
                  <span class="sub-label">Pay Currency</span>
                  <select id="extBuyCurrencySelect" class="ext-select">
                    <option value="USDC" selected>USDC (USD Coin)</option>
                    <option value="BDT">BDT (৳ Bangladeshi Taka)</option>
                    <option value="USDT">USDT (Tether USD)</option>
                    <option value="ETH">ETH (Ethereum)</option>
                    <option value="BNB">BNB (BNB Chain)</option>
                    <option value="MON">MON (Monad)</option>
                    <option value="SOL">SOL (Solana)</option>
                    <option value="POL">POL (Polygon)</option>
                  </select>
                </div>
              </div>

              <!-- Dynamic Calculated Amount Display -->
              <div class="calc-amount-box" id="extCalcAmountBox">
                <span class="calc-label">Total Amount:</span>
                <span class="calc-val" id="extCalcAmountDisplay">$10.00 USDC</span>
              </div>

              <button type="button" class="step-next-action-btn" id="extStep1NextBtn">
                Select Payment Method ↓
              </button>
            </div>

            <!-- Step 2: Select Payment Method (COLLAPSED INITIALLY) -->
            <div class="buy-step-wrap progressive-step" id="buyStep2" style="display:none;">
              <div class="buy-step-title-row">
                <span class="step-num-badge">2</span>
                <span class="buy-step-title">Select Payment Method</span>
              </div>
              <div class="payment-methods-grid" id="extPaymentMethodsGrid">
                <!-- Dynamically populated: bKash & Nagad for BDT; Binance Pay & Crypto for others -->
              </div>
            </div>

            <!-- Step 3: Complete Payment & Submit Proof (COLLAPSED INITIALLY) -->
            <div class="buy-step-wrap progressive-step" id="buyStep3" style="display:none;">
              <div class="buy-step-title-row">
                <span class="step-num-badge">3</span>
                <span class="buy-step-title">Complete Payment &amp; Submit Proof</span>
              </div>
              
              <div class="payment-instructions-box" id="extPaymentInstructionsBox">
                <!-- Dynamic deposit address, number or Binance Pay ID -->
              </div>

              <div class="trx-proof-wrap" style="margin-top:10px;">
                <span class="sub-label" id="extTrxProofLabel">Transaction ID (TrxID) / Order ID / Hash</span>
                <input type="text" id="extTrxProofInput" class="ext-input" placeholder="e.g. 9X7A2K9L or Tx Hash">
              </div>

              <button type="button" class="primary-btn" id="extSubmitOrderBtn" style="margin-top:12px; width:100%;">
                Submit Order for Approval
              </button>
            </div>

            <!-- Status Feedback Message -->
            <div id="extOrderStatusFeedback" class="order-feedback-msg" style="display:none;"></div>
          </div>

          <!-- 3. Purchase & Order History Entry Button (Navigates to dedicated page) -->
          <div class="order-history-launch-wrap">
            <button type="button" class="order-history-nav-card-btn" id="extOpenOrderHistoryBtn">
              <div class="order-history-btn-content">
                <span class="order-history-btn-icon">📜</span>
                <div class="order-history-btn-info">
                  <span class="order-history-btn-heading">Purchase &amp; Order History</span>
                  <span class="order-history-btn-sub" id="extOrderHistoryBtnSub">View pending &amp; completed credit purchases</span>
                </div>
              </div>
              <div class="order-history-btn-right">
                <span class="pending-badge-pill" id="extPendingOrdersBadge" style="display:none;">0 Pending</span>
                <span class="order-history-arrow">→</span>
              </div>
            </button>
          </div>

        </div>

        <!-- SUBVIEW B: DEDICATED PURCHASE & ORDER HISTORY PAGE -->
        <div id="credits-subview-history" style="display:none; flex-direction:column; gap:12px; width:100%;">
          <div class="subview-header">
            <button type="button" class="back-pill-btn" id="extBackFromHistoryBtn">← Back to Credits</button>
            <span class="subview-title">Order History</span>
            <button type="button" class="copy-pill-btn" id="extRefreshOrderHistoryBtn" style="font-size:11px;">↻ Refresh</button>
          </div>

          <div class="surface-card order-history-page-card">
            <div class="order-history-list" id="extOrderHistoryList">
              <div class="order-history-empty" style="text-align:center; padding:24px 12px; color:var(--text-muted); font-size:12px;">
                No orders submitted yet.
              </div>
            </div>
          </div>
        </div>

      </section>`;

// Replace old panel-credits with newPanelCreditsMarkup
const panelCreditsStart = '      <!-- ============================================== -->\n      <!-- TAB 4: CREDITS -->\n      <!-- ============================================== -->\n      <section id="panel-credits" class="tab-panel">';
const panelCreditsEnd = '      </section>\n\n      <!-- ============================================== -->\n      <!-- TAB 5: ACCOUNT -->';

const idxStart = buildJs.indexOf(panelCreditsStart);
const idxEnd = buildJs.indexOf(panelCreditsEnd);

if (idxStart !== -1 && idxEnd !== -1) {
  buildJs = buildJs.substring(0, idxStart) + newPanelCreditsMarkup + '\n\n' + buildJs.substring(idxEnd + '      </section>\n\n'.length);
  console.log('✓ Successfully replaced panel-credits with 6-slide carousel, progressive wizard, and dedicated history subview');
} else {
  console.error('Could not locate panel-credits boundaries in build_fintech_full.js');
}

// 2. Add Referral Program Card into #extLoggedInCard in #panel-access (Account Tab)
const referralCardHTML = `
          <!-- Referral Program Card (Moved to Account Tab) -->
          <div class="surface-card" style="margin-top:6px;">
            <div class="field-header">
              <span class="field-label">Referral Program</span>
              \${makeInfoBtn('150 + 150 credits on successful referral activation')}
            </div>
            <div class="referral-input-row">
              <input type="text" readonly value="twixor.bond • Ref: @user" id="extInviteLinkInput" class="ext-input">
              <button type="button" class="copy-pill-btn" id="extCopyInviteLinkBtn">Copy</button>
            </div>
            <div class="referral-stats-grid">
              <div class="ref-stat-box">Total: <strong id="extRefTotalCount">0</strong></div>
              <div class="ref-stat-box text-success">Approved: <strong id="extRefApprovedCount">0</strong></div>
              <div class="ref-stat-box text-warning">Pending: <strong id="extRefPendingCount">0</strong></div>
              <div class="ref-stat-box text-primary">Earned: <strong id="extRefEarnedCredits">0 C</strong></div>
            </div>
          </div>
`;

// Insert right before `<!-- 4 List Rows -->` in #panel-access
const listRowsMarker = '<!-- 4 List Rows -->';
if (buildJs.includes(listRowsMarker) && !buildJs.includes('Referral Program Card (Moved to Account Tab)')) {
  buildJs = buildJs.replace(listRowsMarker, referralCardHTML + '\n          ' + listRowsMarker);
  console.log('✓ Successfully moved Referral Program Card into Account Tab (panel-access)');
}

fs.writeFileSync('chrome-extension/build_fintech_full.js', buildJs, 'utf8');
console.log('✓ Successfully updated chrome-extension/build_fintech_full.js');
