const fs = require('fs');

let popupJs = fs.readFileSync('chrome-extension/popup.js', 'utf8');

// The new complete credit payment engine & carousel implementation
const newCreditEngineCode = `
// ==============================================================
// COMPREHENSIVE CREDIT PAYMENT GATEWAY, CAROUSEL & ORDER HISTORY
// ==============================================================
let _extOffersCarouselTimer = null;
let _extOffersCarouselIndex = 0;
let _extPaymentConfig = null;
let _extSelectedPaymentMethod = 'binancePay'; // 'bKash', 'nagad', 'binancePay', 'crypto'

async function initOffersCarousel() {
  const track = document.getElementById('extOffersCarouselTrack');
  const dotsContainer = document.getElementById('extCarouselDots');
  if (!track || !dotsContainer) return;

  let plans = [
    { id: 'free', name: 'FREE', credits: 100, price: 0, offerBadge: 'TRIAL' },
    { id: 'starter', name: 'STARTER', credits: 2500, price: 5, offerBadge: 'ENTRY' },
    { id: 'pro', name: 'PRO', credits: 10000, price: 15, offerBadge: 'MOST POPULAR' },
    { id: 'growth', name: 'GROWTH', credits: 25000, price: 29, offerBadge: 'BEST VALUE' },
    { id: 'enterprise', name: 'ENTERPRISE', credits: 100000, price: 79, offerBadge: 'VIP ALPHA' }
  ];
  let foundingOffer = {
    name: 'FOUNDING 100',
    badge: 'LIMITED OFFER',
    launchPrice: 2,
    originalPrice: 5,
    credits: 5000,
    expiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString()
  };

  try {
    const res = await fetch(\`\${DEFAULT_BACKEND_URL}/api/plans\`).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data.plans) && data.plans.length > 0) plans = data.plans;
      if (data.foundingOffer) foundingOffer = data.foundingOffer;
    }
  } catch (e) {}

  // Build slides: First slide is the special launch/founding offer, followed by each tier
  const slides = [];

  // Slide 0: Special Launch Offer
  if (foundingOffer) {
    slides.push({
      id: 'founding',
      title: foundingOffer.name || 'FOUNDING 100',
      badge: foundingOffer.badge || 'LIMITED OFFER',
      price: foundingOffer.launchPrice || 2,
      oldPrice: foundingOffer.originalPrice || 5,
      credits: foundingOffer.credits || 5000,
      isFounding: true
    });
  }

  // Next slides: All active plans from Free to Enterprise
  plans.forEach(p => {
    slides.push({
      id: p.id,
      title: p.name,
      badge: p.offerBadge || (p.price === 0 ? 'FREE TIER' : (p.popular ? 'POPULAR' : 'OFFER')),
      price: p.price,
      oldPrice: p.price > 0 ? Math.round(p.price * 1.5) : null,
      credits: p.credits || 1000,
      isFounding: false
    });
  });

  track.innerHTML = slides.map((s, idx) => \`
    <div class="founding-offer-card carousel-slide \${idx === 0 ? 'active' : ''}" data-index="\${idx}" data-credits="\${s.credits}" data-price="\${s.price}" data-name="\${escapeHtml(s.title)}">
      <div class="founding-offer-header">
        <span class="founding-badge">\${escapeHtml(s.badge)}</span>
        <span class="founding-title">\${escapeHtml(s.title)}</span>
      </div>
      <div class="founding-price-row">
        \${s.oldPrice ? \`<span class="founding-price-old">$\${s.oldPrice}</span>\` : ''}
        <span class="founding-price-big">$\${s.price}</span>
        <span class="founding-price-sub">\${s.price > 0 ? '/mo' : ''}</span>
        <span class="founding-credits-pill">\${(s.credits || 0).toLocaleString()} Credits</span>
      </div>
      \${s.isFounding ? \`
        <div class="founding-timer-box">
          <div id="extFoundingCountdownTimer">02d : 14h : 27m</div>
        </div>
      \` : \`
        <div style="font-size:11px; color:#94A3B8; margin:6px 0 2px 0;">
          Unlock all 12 autonomous growth agents &amp; human pacing
        </div>
      \`}
      <button type="button" class="founding-claim-btn claim-offer-trigger-btn" data-credits="\${s.credits}" data-price="\${s.price}" data-name="\${escapeHtml(s.title)}">
        \${s.price > 0 ? \`Claim \${escapeHtml(s.title)} ($\${s.price})\` : \`Select \${escapeHtml(s.title)} (Free)\`}
      </button>
    </div>
  \`).join('');

  dotsContainer.innerHTML = slides.map((_, idx) => \`
    <span class="carousel-dot \${idx === 0 ? 'active' : ''}" data-slide="\${idx}"></span>
  \`).join('');

  // Wire Claim click on slides to smooth scroll and auto-fill Buy Credits
  track.querySelectorAll('.claim-offer-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const credits = Number(btn.getAttribute('data-credits')) || 5000;
      const targetCard = document.getElementById('extBuyCreditsCard');
      const creditsInput = document.getElementById('extBuyCreditsInput');

      if (creditsInput) {
        creditsInput.value = credits;
        updateSelectedCreditPreset(credits);
        calculateAndRenderPaymentAmount();
      }

      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.outline = '2px solid #3B82F6';
        targetCard.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
          targetCard.style.outline = 'none';
          targetCard.style.boxShadow = 'none';
        }, 1800);
      }
    });
  });

  // Wire Dot clicks
  dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.getAttribute('data-slide')) || 0;
      scrollToCarouselSlide(idx, slides.length);
    });
  });

  // Carousel Auto-Scrolling
  if (_extOffersCarouselTimer) clearInterval(_extOffersCarouselTimer);
  _extOffersCarouselIndex = 0;
  _extOffersCarouselTimer = setInterval(() => {
    _extOffersCarouselIndex = (_extOffersCarouselIndex + 1) % slides.length;
    scrollToCarouselSlide(_extOffersCarouselIndex, slides.length);
  }, 4000);

  // Pause on hover
  const container = document.getElementById('extOffersCarouselContainer');
  if (container) {
    container.addEventListener('mouseenter', () => {
      if (_extOffersCarouselTimer) clearInterval(_extOffersCarouselTimer);
    });
    container.addEventListener('mouseleave', () => {
      if (_extOffersCarouselTimer) clearInterval(_extOffersCarouselTimer);
      _extOffersCarouselTimer = setInterval(() => {
        _extOffersCarouselIndex = (_extOffersCarouselIndex + 1) % slides.length;
        scrollToCarouselSlide(_extOffersCarouselIndex, slides.length);
      }, 4000);
    });
  }
}

function scrollToCarouselSlide(idx, total) {
  const track = document.getElementById('extOffersCarouselTrack');
  const dots = document.querySelectorAll('#extCarouselDots .carousel-dot');
  if (!track) return;

  _extOffersCarouselIndex = idx;
  track.style.transform = \`translateX(-\${idx * 100}%)\`;
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

function updateSelectedCreditPreset(credits) {
  document.querySelectorAll('.credit-preset-btn').forEach(btn => {
    const val = Number(btn.getAttribute('data-credits'));
    btn.classList.toggle('active', val === credits);
  });
}

// --------------------------------------------------------------
// BUY CREDITS PAYMENT GATEWAY ENGINE
// --------------------------------------------------------------
async function initBuyCreditsGateway() {
  // 1. Fetch Official Deposit Accounts & Rates from Admin
  try {
    const res = await fetch(\`\${DEFAULT_BACKEND_URL}/api/payment-methods\`).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      if (data && data.paymentMethods) {
        _extPaymentConfig = data.paymentMethods;
      }
    }
  } catch (e) {}

  if (!_extPaymentConfig) {
    _extPaymentConfig = {
      bKash: { number: '01700000000', type: 'Personal', instructions: 'Send Money to personal bKash, then submit TrxID below' },
      nagad: { number: '01800000000', type: 'Personal', instructions: 'Send Money to personal Nagad, then submit TrxID below' },
      binancePay: { payId: '829301928', nickname: 'TwixorOfficial', instructions: 'Send to Binance Pay ID, then submit Order ID below' },
      cryptoAddresses: [
        { id: '1', currency: 'USDC', chain: 'Ethereum (ERC-20)', address: '0x892aF71c9201481bAc0129FEE1305481bAc0129' },
        { id: '2', currency: 'USDC', chain: 'Solana (SPL)', address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' },
        { id: '3', currency: 'USDT', chain: 'TRON (TRC-20)', address: 'TYx1234567890abcdef1234567890abcdef' },
        { id: '4', currency: 'USDT', chain: 'BNB Chain (BEP-20)', address: '0x892aF71c9201481bAc0129FEE1305481bAc0129' },
        { id: '5', currency: 'ETH', chain: 'Ethereum Mainnet', address: '0x892aF71c9201481bAc0129FEE1305481bAc0129' },
        { id: '6', currency: 'BNB', chain: 'BNB Smart Chain (BEP-20)', address: '0x892aF71c9201481bAc0129FEE1305481bAc0129' },
        { id: '7', currency: 'SOL', chain: 'Solana Mainnet', address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' },
        { id: '8', currency: 'POL', chain: 'Polygon (POL / MATIC)', address: '0x892aF71c9201481bAc0129FEE1305481bAc0129' },
        { id: '9', currency: 'MON', chain: 'Monad / Base', address: '0x892aF71c9201481bAc0129FEE1305481bAc0129' }
      ],
      rates: { USD_PER_1K_CREDITS: 2.0, BDT_PER_USD: 125.0 }
    };
  }

  // 2. Preset Chips wiring
  document.querySelectorAll('.credit-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const credits = Number(btn.getAttribute('data-credits')) || 5000;
      const input = document.getElementById('extBuyCreditsInput');
      if (input) input.value = credits;
      updateSelectedCreditPreset(credits);
      calculateAndRenderPaymentAmount();
    });
  });

  // 3. Credits Input wiring
  const creditsInput = document.getElementById('extBuyCreditsInput');
  if (creditsInput) {
    creditsInput.addEventListener('input', () => {
      const credits = Number(creditsInput.value) || 0;
      updateSelectedCreditPreset(credits);
      calculateAndRenderPaymentAmount();
    });
  }

  // 4. Currency Select wiring
  const currencySelect = document.getElementById('extBuyCurrencySelect');
  if (currencySelect) {
    currencySelect.addEventListener('change', () => {
      updatePaymentMethodsForCurrency();
      calculateAndRenderPaymentAmount();
    });
  }

  // 5. Submit Order button
  const submitBtn = document.getElementById('extSubmitOrderBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmitCreditOrder);
  }

  // 6. Refresh Order History button
  const refreshHistoryBtn = document.getElementById('extRefreshOrderHistoryBtn');
  if (refreshHistoryBtn) {
    refreshHistoryBtn.addEventListener('click', () => {
      loadUserOrderHistory();
    });
  }

  // Initial setup
  updatePaymentMethodsForCurrency();
  calculateAndRenderPaymentAmount();
  loadUserOrderHistory();
}

function updatePaymentMethodsForCurrency() {
  const currency = document.getElementById('extBuyCurrencySelect')?.value || 'USDC';
  const grid = document.getElementById('extPaymentMethodsGrid');
  if (!grid) return;

  if (currency === 'BDT') {
    // Show ONLY bKash and Nagad for BDT
    grid.innerHTML = \`
      <div class="payment-method-chip \${_extSelectedPaymentMethod === 'bKash' ? 'active' : ''}" data-method="bKash">
        <span class="method-icon">📱</span>
        <span>bKash</span>
      </div>
      <div class="payment-method-chip \${_extSelectedPaymentMethod === 'nagad' ? 'active' : ''}" data-method="nagad">
        <span class="method-icon">💸</span>
        <span>Nagad</span>
      </div>
    \`;
    if (_extSelectedPaymentMethod !== 'bKash' && _extSelectedPaymentMethod !== 'nagad') {
      _extSelectedPaymentMethod = 'bKash';
    }
  } else {
    // Show ONLY Binance Pay and Crypto Transfer for non-BDT
    grid.innerHTML = \`
      <div class="payment-method-chip \${_extSelectedPaymentMethod === 'binancePay' ? 'active' : ''}" data-method="binancePay">
        <span class="method-icon">⚡</span>
        <span>Binance Pay</span>
      </div>
      <div class="payment-method-chip \${_extSelectedPaymentMethod === 'crypto' ? 'active' : ''}" data-method="crypto">
        <span class="method-icon">⛓️</span>
        <span>Crypto Transfer</span>
      </div>
    \`;
    if (_extSelectedPaymentMethod !== 'binancePay' && _extSelectedPaymentMethod !== 'crypto') {
      _extSelectedPaymentMethod = 'binancePay';
    }
  }

  // Update chip active click handlers
  grid.querySelectorAll('.payment-method-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      _extSelectedPaymentMethod = chip.getAttribute('data-method');
      grid.querySelectorAll('.payment-method-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderPaymentDetailsBox();
    });
  });

  renderPaymentDetailsBox();
}

function calculateAndRenderPaymentAmount() {
  const credits = Number(document.getElementById('extBuyCreditsInput')?.value) || 0;
  const currency = document.getElementById('extBuyCurrencySelect')?.value || 'USDC';
  const display = document.getElementById('extCalcAmountDisplay');
  if (!display) return;

  const rates = _extPaymentConfig?.rates || { USD_PER_1K_CREDITS: 2.0, BDT_PER_USD: 125.0 };
  const baseUSD = (credits / 1000) * (rates.USD_PER_1K_CREDITS || 2.0);

  let formattedAmount = '';
  if (currency === 'BDT') {
    const bdtRate = rates.BDT_PER_USD || 125;
    const totalBDT = Math.round(baseUSD * bdtRate);
    formattedAmount = \`৳\${totalBDT.toLocaleString()} BDT\`;
  } else if (currency === 'USDC' || currency === 'USDT') {
    formattedAmount = \`$\${baseUSD.toFixed(2)} \${currency}\`;
  } else if (currency === 'ETH') {
    const rate = rates.ETH || 0.00035;
    formattedAmount = \`\${(baseUSD * rate).toFixed(4)} ETH\`;
  } else if (currency === 'BNB') {
    const rate = rates.BNB || 0.0035;
    formattedAmount = \`\${(baseUSD * rate).toFixed(4)} BNB\`;
  } else if (currency === 'SOL') {
    const rate = rates.SOL || 0.015;
    formattedAmount = \`\${(baseUSD * rate).toFixed(3)} SOL\`;
  } else if (currency === 'POL') {
    const rate = rates.POL || 2.8;
    formattedAmount = \`\${(baseUSD * rate).toFixed(2)} POL\`;
  } else if (currency === 'MON') {
    const rate = rates.MON || 2.0;
    formattedAmount = \`\${(baseUSD * rate).toFixed(2)} MON\`;
  } else {
    formattedAmount = \`$\${baseUSD.toFixed(2)} \${currency}\`;
  }

  display.textContent = formattedAmount;
  renderPaymentDetailsBox();
}

function renderPaymentDetailsBox() {
  const box = document.getElementById('extPaymentInstructionsBox');
  const proofLabel = document.getElementById('extTrxProofLabel');
  const proofInput = document.getElementById('extTrxProofInput');
  const currency = document.getElementById('extBuyCurrencySelect')?.value || 'USDC';
  const amountText = document.getElementById('extCalcAmountDisplay')?.textContent || '';
  if (!box) return;

  const conf = _extPaymentConfig || {};

  if (_extSelectedPaymentMethod === 'bKash') {
    const bkash = conf.bKash || { number: '01700000000', type: 'Personal', instructions: 'Send Money' };
    box.innerHTML = \`
      <div style="font-size:11px; color:#F43F5E; font-weight:800; text-transform:uppercase;">bKash (\${escapeHtml(bkash.type || 'Personal')}) Transfer</div>
      <div class="payment-dest-row">
        <div>
          <span style="font-size:10px; color:#94A3B8;">Send Money to Number:</span>
          <div class="payment-dest-val">\${escapeHtml(bkash.number || '01700000000')}</div>
        </div>
        <button type="button" class="copy-pill-btn" onclick="navigator.clipboard.writeText('\${escapeHtml(bkash.number || '')}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy', 1500);">Copy Number</button>
      </div>
      <div class="payment-inst-sub">
        Send exact amount <strong>\${escapeHtml(amountText)}</strong> to this bKash number. After payment, enter your 8-10 digit Transaction ID (TrxID) below.
      </div>
    \`;
    if (proofLabel) proofLabel.textContent = 'bKash Transaction ID (TrxID)';
    if (proofInput) proofInput.placeholder = 'e.g. 9X7A2K9L';
  } else if (_extSelectedPaymentMethod === 'nagad') {
    const nagad = conf.nagad || { number: '01800000000', type: 'Personal', instructions: 'Send Money' };
    box.innerHTML = \`
      <div style="font-size:11px; color:#EA580C; font-weight:800; text-transform:uppercase;">Nagad (\${escapeHtml(nagad.type || 'Personal')}) Transfer</div>
      <div class="payment-dest-row">
        <div>
          <span style="font-size:10px; color:#94A3B8;">Send Money to Number:</span>
          <div class="payment-dest-val">\${escapeHtml(nagad.number || '01800000000')}</div>
        </div>
        <button type="button" class="copy-pill-btn" onclick="navigator.clipboard.writeText('\${escapeHtml(nagad.number || '')}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy', 1500);">Copy Number</button>
      </div>
      <div class="payment-inst-sub">
        Send exact amount <strong>\${escapeHtml(amountText)}</strong> to this Nagad number. After payment, enter your Transaction ID (TrxID) below.
      </div>
    \`;
    if (proofLabel) proofLabel.textContent = 'Nagad Transaction ID (TrxID)';
    if (proofInput) proofInput.placeholder = 'e.g. 71A8B2C3';
  } else if (_extSelectedPaymentMethod === 'binancePay') {
    const binance = conf.binancePay || { payId: '829301928', nickname: 'TwixorOfficial' };
    box.innerHTML = \`
      <div style="font-size:11px; color:#F59E0B; font-weight:800; text-transform:uppercase;">Binance Pay Instant Transfer</div>
      <div class="payment-dest-row">
        <div>
          <span style="font-size:10px; color:#94A3B8;">Binance Pay ID:</span>
          <div class="payment-dest-val">\${escapeHtml(binance.payId || '829301928')} \${binance.nickname ? \`<span style="font-size:10px; color:#94A3B8;">(\${escapeHtml(binance.nickname)})</span>\` : ''}</div>
        </div>
        <button type="button" class="copy-pill-btn" onclick="navigator.clipboard.writeText('\${escapeHtml(binance.payId || '')}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy', 1500);">Copy Pay ID</button>
      </div>
      <div class="payment-inst-sub">
        Open Binance App &gt; Pay &gt; Send &gt; Enter Pay ID. Send <strong>\${escapeHtml(amountText)}</strong>, then submit your Binance Order ID / Pay ID below.
      </div>
    \`;
    if (proofLabel) proofLabel.textContent = 'Binance Order ID / Pay ID';
    if (proofInput) proofInput.placeholder = 'e.g. 293810482';
  } else {
    // Crypto Transfer
    const addresses = conf.cryptoAddresses || [];
    const matched = addresses.find(a => (a.currency || '').toUpperCase() === currency.toUpperCase()) || addresses[0] || {
      currency: 'USDC',
      chain: 'Ethereum / Solana',
      address: '0x892aF71c9201481bAc0129FEE1305481bAc0129'
    };

    box.innerHTML = \`
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:11px; color:#60A5FA; font-weight:800; text-transform:uppercase;">\${escapeHtml(matched.currency)} Deposit Address</span>
        <span class="badge-mini" style="font-size:9.5px; background:rgba(59, 130, 246, 0.2); color:#60A5FA; border:1px solid rgba(59, 130, 246, 0.4); padding:2px 6px; border-radius:4px;">\${escapeHtml(matched.chain || 'Mainnet')}</span>
      </div>
      <div class="payment-dest-row">
        <div style="flex:1; overflow:hidden;">
          <span style="font-size:10px; color:#94A3B8;">Deposit Wallet Address:</span>
          <div class="payment-dest-val" style="font-size:11.5px; word-break:break-all;">\${escapeHtml(matched.address || '')}</div>
        </div>
        <button type="button" class="copy-pill-btn" onclick="navigator.clipboard.writeText('\${escapeHtml(matched.address || '')}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy', 1500);">Copy Address</button>
      </div>
      <div class="payment-inst-sub">
        Send exact amount <strong>\${escapeHtml(amountText)}</strong> over \${escapeHtml(matched.chain || 'matching network')}. Then paste your transaction hash (Tx Hash) below.
      </div>
    \`;
    if (proofLabel) proofLabel.textContent = 'Transaction Hash (Tx Hash)';
    if (proofInput) proofInput.placeholder = 'e.g. 0x9f8e2a... or Solana signature';
  }
}

async function handleSubmitCreditOrder() {
  const credits = Number(document.getElementById('extBuyCreditsInput')?.value) || 0;
  const currency = document.getElementById('extBuyCurrencySelect')?.value || 'USDC';
  const amount = document.getElementById('extCalcAmountDisplay')?.textContent || '';
  const trxId = document.getElementById('extTrxProofInput')?.value.trim() || '';
  const feedback = document.getElementById('extOrderStatusFeedback');
  const submitBtn = document.getElementById('extSubmitOrderBtn');

  if (credits < 500) {
    alert('Please enter at least 500 credits.');
    return;
  }
  if (!trxId) {
    const idName = _extSelectedPaymentMethod === 'bKash' || _extSelectedPaymentMethod === 'nagad'
      ? 'Transaction ID (TrxID)'
      : (_extSelectedPaymentMethod === 'binancePay' ? 'Binance Order ID / Pay ID' : 'Transaction Hash');
    alert(\`Please enter your \${idName} before submitting.\`);
    document.getElementById('extTrxProofInput')?.focus();
    return;
  }

  const cleanHandle = (state.verifiedXHandle || state.user?.handle || '').replace(/^@/, '').trim();
  const email = state.user?.email || '';

  const methodName = _extSelectedPaymentMethod === 'bKash' ? 'bKash'
    : (_extSelectedPaymentMethod === 'nagad' ? 'Nagad'
    : (_extSelectedPaymentMethod === 'binancePay' ? 'Binance Pay' : 'Crypto Transfer'));

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting Order...';
  }

  try {
    const res = await fetch(\`\${DEFAULT_BACKEND_URL}/api/credits/order\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handle: cleanHandle ? \`@\${cleanHandle}\` : '@user',
        email: email,
        credits: credits,
        amount: amount,
        currency: currency,
        method: methodName,
        chain: currency !== 'BDT' && _extSelectedPaymentMethod === 'crypto' ? currency : '',
        trxId: trxId
      })
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      if (feedback) {
        feedback.className = 'order-feedback-msg success';
        feedback.style.display = 'block';
        feedback.innerHTML = \`
          <strong>✓ Order Submitted Successfully!</strong><br>
          • Order ID: <code>\${escapeHtml(data.order?.id || 'ORD')}</code><br>
          • Credits: <strong>+\${credits.toLocaleString()} C</strong> (\${escapeHtml(amount)})<br>
          • Status: <span style="color:#FBBF24; font-weight:800;">PENDING APPROVAL</span><br>
          <span style="font-size:10.5px; opacity:0.9;">As soon as admin verifies your transaction proof, your credits will be activated immediately.</span>
        \`;
      }
      document.getElementById('extTrxProofInput').value = '';
      loadUserOrderHistory();
    } else {
      if (feedback) {
        feedback.className = 'order-feedback-msg error';
        feedback.style.display = 'block';
        feedback.textContent = data.error || 'Failed to submit order. Please try again.';
      }
    }
  } catch (err) {
    if (feedback) {
      feedback.className = 'order-feedback-msg error';
      feedback.style.display = 'block';
      feedback.textContent = 'Network error submitting order: ' + err.message;
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Order for Approval';
    }
  }
}

async function loadUserOrderHistory() {
  const list = document.getElementById('extOrderHistoryList');
  if (!list) return;

  const cleanHandle = (state.verifiedXHandle || state.user?.handle || '').replace(/^@/, '').trim();
  const email = state.user?.email || '';
  const identifier = cleanHandle ? \`@\${cleanHandle}\` : email;

  if (!identifier) {
    list.innerHTML = \`<div class="order-history-empty" style="text-align:center; padding:16px 8px; color:var(--text-muted); font-size:11.5px;">Login to view your purchase &amp; order history.</div>\`;
    return;
  }

  try {
    const res = await fetch(\`\${DEFAULT_BACKEND_URL}/api/credits/orders?handle=\${encodeURIComponent(identifier)}\`).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      const orders = Array.isArray(data.orders) ? data.orders : [];
      if (orders.length === 0) {
        list.innerHTML = \`<div class="order-history-empty" style="text-align:center; padding:16px 8px; color:var(--text-muted); font-size:11.5px;">No purchase orders submitted yet.</div>\`;
        return;
      }

      list.innerHTML = orders.map(ord => {
        const st = (ord.status || 'PENDING').toUpperCase();
        const pillClass = st === 'APPROVED' || st === 'COMPLETED' ? 'approved' : (st === 'PENDING' ? 'pending' : 'rejected');
        const pillText = st === 'APPROVED' || st === 'COMPLETED' ? '✓ APPROVED' : (st === 'PENDING' ? '⏳ PENDING' : '✕ REJECTED');

        return \`
          <div class="order-item-card">
            <div class="order-item-top">
              <span class="order-item-id">\${escapeHtml(ord.id)} · \${escapeHtml(ord.date || 'Recent')}</span>
              <span class="order-status-pill \${pillClass}">\${pillText}</span>
            </div>
            <div class="order-item-body">
              <span class="order-item-credits">+\${(Number(ord.credits) || 0).toLocaleString()} Credits</span>
              <span class="order-item-amount">\${escapeHtml(ord.amount)}</span>
            </div>
            <div class="order-item-footer">
              <span>\${escapeHtml(ord.method || 'Transfer')}</span>
              \${ord.trxId ? \`<span class="order-item-trx" title="Trx: \${escapeHtml(ord.trxId)}">Trx: \${escapeHtml(ord.trxId)}</span>\` : ''}
            </div>
          </div>
        \`;
      }).join('');
    }
  } catch (e) {
    list.innerHTML = \`<div class="order-history-empty" style="text-align:center; padding:16px 8px; color:var(--text-muted); font-size:11.5px;">Could not load order history.</div>\`;
  }
}
`;

// Replace handleVerifyCryptoTx or append to popup.js
if (!popupJs.includes('initBuyCreditsGateway')) {
  popupJs += '\n' + newCreditEngineCode;
  console.log('✓ Successfully appended Credit payment gateway and carousel functions');
}

// Call initOffersCarousel and initBuyCreditsGateway inside DOMContentLoaded / switchExtTab
const switchTabMarker = 'function switchExtTab(tabId) {';
if (popupJs.includes(switchTabMarker) && !popupJs.includes("if (tabId === 'credits') initOffersCarousel();")) {
  popupJs = popupJs.replace(switchTabMarker, `function switchExtTab(tabId) {
  if (tabId === 'credits') {
    setTimeout(() => {
      initOffersCarousel();
      initBuyCreditsGateway();
    }, 50);
  }`);
  console.log('✓ Hooked carousel and payment gateway into switchExtTab');
}

// Also call on startup if credits tab is active or during initial setup
const startupMarker = 'document.addEventListener(\'DOMContentLoaded\', async () => {';
if (popupJs.includes(startupMarker) && !popupJs.includes('initBuyCreditsGateway();')) {
  popupJs = popupJs.replace(startupMarker, `document.addEventListener('DOMContentLoaded', async () => {
    setTimeout(() => {
      initOffersCarousel();
      initBuyCreditsGateway();
    }, 300);`);
  console.log('✓ Hooked carousel and payment gateway into DOMContentLoaded');
}

fs.writeFileSync('chrome-extension/popup.js', popupJs, 'utf8');
fs.writeFileSync('chrome-extension/sidepanel.js', popupJs, 'utf8');
console.log('✓ Successfully updated chrome-extension/popup.js and synced to sidepanel.js!');
