const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// 1. Add Payment Accounts & Deposit Addresses to Screen 16 (Plans & Special Offers)
const screen16Marker = '<div class="pricing-grid">';
const paymentAccountsCardHTML = `
          <!-- Official Payment Accounts & Deposit Addresses Card -->
          <div class="atomx-card" style="margin-top:28px; padding:22px; border:1px solid rgba(59, 130, 246, 0.35); background:linear-gradient(135deg, rgba(30, 58, 138, 0.08), rgba(15, 23, 42, 0.4));">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:18px;">💳</span>
                  <h3 style="font-size:17px; font-weight:800; color:var(--text-primary); margin:0;">Official Payment Accounts &amp; Deposit Addresses</h3>
                </div>
                <p style="font-size:12px; color:var(--text-muted); margin:4px 0 0 0;">
                  Set bKash, Nagad, Binance Pay ID, and chain-wise crypto deposit addresses shown dynamically in the Extension Buy Credits portal.
                </p>
              </div>
              <button class="btn btn-primary btn-sm" onclick="adminSavePaymentSettings()">💾 Save Payment Accounts &amp; Addresses</button>
            </div>

            <!-- 2-Column Grid: Local (BDT) & Global (Binance Pay / Exchange Rates) -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:18px; margin-bottom:20px;">
              <!-- BDT: bKash & Nagad -->
              <div style="background:var(--bg-canvas); padding:16px; border-radius:8px; border:1px solid var(--border-subtle);">
                <div style="font-size:13px; font-weight:800; color:#E11D48; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
                  <span>🇧🇩</span> Bangladesh Mobile Financial Services (BDT)
                </div>
                
                <div class="form-group" style="margin-bottom:12px;">
                  <label class="form-label" style="font-size:11.5px; font-weight:700;">bKash Account Number &amp; Type</label>
                  <div style="display:grid; grid-template-columns:2fr 1fr; gap:8px;">
                    <input type="text" class="form-input" id="adminBkashNum" value="\${escapeHtml(pay.bKash?.number || '01700000000')}" placeholder="017XXXXXXXX">
                    <select class="form-input" id="adminBkashType">
                      <option value="Personal" \${pay.bKash?.type === 'Personal' ? 'selected' : ''}>Personal</option>
                      <option value="Merchant" \${pay.bKash?.type === 'Merchant' ? 'selected' : ''}>Merchant</option>
                      <option value="Agent" \${pay.bKash?.type === 'Agent' ? 'selected' : ''}>Agent</option>
                    </select>
                  </div>
                  <input type="text" class="form-input" style="margin-top:6px; font-size:11px;" id="adminBkashInst" value="\${escapeHtml(pay.bKash?.instructions || 'Send Money, then submit TrxID')}" placeholder="Instructions shown to user">
                </div>

                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" style="font-size:11.5px; font-weight:700;">Nagad Account Number &amp; Type</label>
                  <div style="display:grid; grid-template-columns:2fr 1fr; gap:8px;">
                    <input type="text" class="form-input" id="adminNagadNum" value="\${escapeHtml(pay.nagad?.number || '01800000000')}" placeholder="018XXXXXXXX">
                    <select class="form-input" id="adminNagadType">
                      <option value="Personal" \${pay.nagad?.type === 'Personal' ? 'selected' : ''}>Personal</option>
                      <option value="Merchant" \${pay.nagad?.type === 'Merchant' ? 'selected' : ''}>Merchant</option>
                    </select>
                  </div>
                  <input type="text" class="form-input" style="margin-top:6px; font-size:11px;" id="adminNagadInst" value="\${escapeHtml(pay.nagad?.instructions || 'Send Money, then submit TrxID')}" placeholder="Instructions shown to user">
                </div>
              </div>

              <!-- Binance Pay & Global Rates -->
              <div style="background:var(--bg-canvas); padding:16px; border-radius:8px; border:1px solid var(--border-subtle);">
                <div style="font-size:13px; font-weight:800; color:#F59E0B; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
                  <span>⚡</span> Binance Pay &amp; Exchange Rates
                </div>
                
                <div class="form-group" style="margin-bottom:12px;">
                  <label class="form-label" style="font-size:11.5px; font-weight:700;">Binance Pay ID &amp; Nickname</label>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                    <input type="text" class="form-input" id="adminBinancePayId" value="\${escapeHtml(pay.binancePay?.payId || '829301928')}" placeholder="e.g. 829301928">
                    <input type="text" class="form-input" id="adminBinanceNickname" value="\${escapeHtml(pay.binancePay?.nickname || 'TwixorOfficial')}" placeholder="e.g. TwixorOfficial">
                  </div>
                </div>

                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" style="font-size:11.5px; font-weight:700;">Conversion Rates (BDT &amp; Base USD per 1,000 Credits)</label>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                    <div>
                      <div style="font-size:10px; color:var(--text-muted); margin-bottom:2px;">Base USD / 1,000 C</div>
                      <input type="number" step="0.1" class="form-input" id="adminPricePer1k" value="\${pay.rates?.USD_PER_1K_CREDITS || 2.0}">
                    </div>
                    <div>
                      <div style="font-size:10px; color:var(--text-muted); margin-bottom:2px;">1 USD to BDT</div>
                      <input type="number" step="1" class="form-input" id="adminBdtRate" value="\${pay.rates?.BDT_PER_USD || 125}">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chain-Wise & Currency-Wise Crypto Deposit Addresses -->
            <div style="background:var(--bg-canvas); padding:16px; border-radius:8px; border:1px solid var(--border-subtle);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                <div style="font-size:13px; font-weight:800; color:#3B82F6; display:flex; align-items:center; gap:6px;">
                  <span>⛓️</span> Multi-Chain Crypto Deposit Addresses (USDC, USDT, ETH, BNB, MON, SOL, POL)
                </div>
                <button type="button" class="btn btn-secondary btn-sm" onclick="openAddCryptoAddressModal()">+ Add New Chain Address</button>
              </div>

              <div class="atomx-table-wrapper" style="max-height:280px; overflow-y:auto;">
                <table class="atomx-table" style="font-size:12px;">
                  <thead>
                    <tr>
                      <th style="width:90px;">Currency</th>
                      <th style="width:180px;">Chain / Network</th>
                      <th>Deposit Address</th>
                      <th style="width:70px; text-align:center;">Action</th>
                    </tr>
                  </thead>
                  <tbody id="adminCryptoAddressesTableBody">
                    \${(pay.cryptoAddresses || []).map((c, idx) => \`
                      <tr>
                        <td><span class="badge badge-info" style="font-weight:800;">\${escapeHtml(c.currency)}</span></td>
                        <td style="font-weight:600; color:var(--text-primary);">\${escapeHtml(c.chain)}</td>
                        <td style="font-family:monospace; font-size:11.5px; color:#60A5FA; word-break:break-all;">\${escapeHtml(c.address)}</td>
                        <td style="text-align:center;">
                          <button class="btn btn-danger btn-xs" onclick="adminDeleteCryptoAddress('\${c.id || idx}')">✕</button>
                        </td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
`;

// Insert pay declaration in renderAdminPlanManagement
const renderPlanStart = 'function renderAdminPlanManagement(container) {';
if (appJs.includes(renderPlanStart) && !appJs.includes('adminSavePaymentSettings')) {
  const paySetup = `function renderAdminPlanManagement(container) {
  const pay = AtomXState.paymentMethods || {
    bKash: { number: '01700000000', type: 'Personal', instructions: 'Send Money, then submit TrxID' },
    nagad: { number: '01800000000', type: 'Personal', instructions: 'Send Money, then submit TrxID' },
    binancePay: { payId: '829301928', nickname: 'TwixorOfficial', instructions: 'Send to Binance Pay ID, then submit Order ID' },
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
`;
  appJs = appJs.replace(renderPlanStart, paySetup);
  
  // Insert the card right after pricing-grid in screen 16
  const targetClosing = '              </div>\n            `).join(\'\')}\n          </div>';
  if (appJs.includes(targetClosing)) {
    appJs = appJs.replace(targetClosing, targetClosing + '\n' + paymentAccountsCardHTML);
    console.log('✓ Successfully injected Payment Accounts card into Screen 16');
  }
}

// 2. Add Pending Orders Section & Approval actions to Screen 17 (Transactions & Orders)
const txScreenStart = 'function renderAdminTransactions(container) {';
if (appJs.includes(txScreenStart) && !appJs.includes('adminApproveOrder')) {
  // Replace allTx handling to calculate pending
  const allTxTarget = '  const allTx = AtomXState.adminTransactions || [];';
  const allTxReplacement = `  const allTx = AtomXState.adminTransactions || [];
  const pendingTx = allTx.filter(t => (t.status || '').toUpperCase() === 'PENDING');`;
  appJs = appJs.replace(allTxTarget, allTxReplacement);

  // Add Pending Orders Banner right before `<div class="atomx-card">` in Screen 17
  const pendingBannerHTML = `
          <!-- Pending Approvals Banner/Card -->
          \${pendingTx.length > 0 ? \`
            <div class="atomx-card" style="margin-bottom:20px; padding:16px 18px; border:2px solid #F59E0B; background:linear-gradient(135deg, rgba(245,158,11,0.08), rgba(0,0,0,0.1));">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="badge" style="background:#F59E0B; color:#000; font-weight:800;">⏳ ACTION REQUIRED</span>
                  <h3 style="font-size:15px; font-weight:800; margin:0; color:var(--text-primary);">
                    \${pendingTx.length} Credit Purchase Order\${pendingTx.length > 1 ? 's' : ''} Awaiting Approval
                  </h3>
                </div>
                <span style="font-size:12px; color:var(--text-muted);">Verify payment transaction ID / hash before approving</span>
              </div>

              <div class="atomx-table-wrapper">
                <table class="atomx-table" style="font-size:12px;">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Credits</th>
                      <th>Amount &amp; Currency</th>
                      <th>Method &amp; Network</th>
                      <th>TrxID / Hash</th>
                      <th style="text-align:center;">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    \${pendingTx.map(tx => \`
                      <tr style="background:rgba(245, 158, 11, 0.04);">
                        <td style="font-weight:700; font-family:monospace;">\${escapeHtml(tx.id)}</td>
                        <td>\${escapeHtml(tx.date)}</td>
                        <td>
                          <strong>\${escapeHtml(tx.handle || tx.user)}</strong>
                          \${tx.email ? \`<div style="font-size:10px; color:var(--text-muted);">\${escapeHtml(tx.email)}</div>\` : ''}
                        </td>
                        <td><strong style="color:var(--status-success);">+\${(Number(tx.credits) || 0).toLocaleString()} C</strong></td>
                        <td style="font-weight:700; color:var(--text-primary);">\${escapeHtml(tx.amount)} \${escapeHtml(tx.currency || '')}</td>
                        <td>
                          <span class="badge badge-info" style="font-weight:700;">\${escapeHtml(tx.method)}</span>
                          \${tx.chain ? \`<div style="font-size:10px; color:var(--text-muted);">\${escapeHtml(tx.chain)}</div>\` : ''}
                        </td>
                        <td>
                          <div style="font-family:monospace; font-size:11px; background:var(--bg-canvas); padding:2px 6px; border-radius:4px; border:1px solid var(--border-subtle); display:inline-flex; align-items:center; gap:6px;">
                            <span>\${escapeHtml(tx.trxId || tx.txHash || tx.orderId || 'N/A')}</span>
                            <button type="button" class="btn btn-xs btn-secondary" onclick="navigator.clipboard.writeText('\${escapeHtml(tx.trxId || tx.txHash || tx.orderId || '')}'); showToast('Copied TrxID!');">Copy</button>
                          </div>
                        </td>
                        <td style="text-align:center;">
                          <div style="display:inline-flex; gap:6px;">
                            <button class="btn btn-success btn-xs" onclick="adminApproveOrder('\${tx.id}')">✓ Approve</button>
                            <button class="btn btn-danger btn-xs" onclick="adminRejectOrder('\${tx.id}')">✕ Reject</button>
                          </div>
                        </td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          \` : ''}
`;

  const txCardMarker = '<div class="atomx-card">\n            <div class="atomx-table-wrapper">';
  if (appJs.includes(txCardMarker)) {
    appJs = appJs.replace(txCardMarker, pendingBannerHTML + '\n          ' + txCardMarker);
    console.log('✓ Successfully injected Pending Orders section into Screen 17');
  }

  // Update Status column and add Actions column to main table
  appJs = appJs.replace('<th>Status</th>\n                  </tr>', '<th>Status</th>\n                    <th style="text-align:center;">Action</th>\n                  </tr>');
  const mainRowStatusTarget = '<td><span class="badge badge-success" style="font-size:10.5px;">✓ ${tx.status || \'Paid\'}</span></td>\n                    </tr>';
  const mainRowStatusReplacement = `<td>
                        <span class="badge \${(tx.status || '').toUpperCase() === 'APPROVED' || (tx.status || '').toUpperCase() === 'COMPLETED' ? 'badge-success' : ((tx.status || '').toUpperCase() === 'PENDING' ? 'badge-warning' : 'badge-danger')}" style="font-size:10.5px; font-weight:700;">
                          \${(tx.status || '').toUpperCase() === 'PENDING' ? '⏳ PENDING' : ((tx.status || '').toUpperCase() === 'APPROVED' || (tx.status || '').toUpperCase() === 'COMPLETED' ? '✓ PAID' : '✕ REJECTED')}
                        </span>
                        \${tx.trxId ? \`<div style="font-family:monospace; font-size:10px; color:var(--text-muted); margin-top:2px;" title="\${escapeHtml(tx.trxId)}">Trx: \${escapeHtml(tx.trxId.slice(0, 10))}...</div>\` : ''}
                      </td>
                      <td style="text-align:center;">
                        \${(tx.status || '').toUpperCase() === 'PENDING' ? \`
                          <div style="display:inline-flex; gap:4px;">
                            <button class="btn btn-success btn-xs" onclick="adminApproveOrder('\${tx.id}')">✓</button>
                            <button class="btn btn-danger btn-xs" onclick="adminRejectOrder('\${tx.id}')">✕</button>
                          </div>
                        \` : \`<span style="font-size:11px; color:var(--text-muted);">-</span>\`}
                      </td>
                    </tr>`;
  if (appJs.includes(mainRowStatusTarget)) {
    appJs = appJs.replace(mainRowStatusTarget, mainRowStatusReplacement);
    console.log('✓ Successfully updated main table row with Action column and Pending badge');
  }
}

// 3. Add JavaScript handlers for Payment settings and Order approvals
const adminPaymentHandlers = `
// ==============================================================
// ADMIN PAYMENT & DEPOSIT ADDRESSES MANAGEMENT HANDLERS
// ==============================================================
async function adminSavePaymentSettings() {
  const pay = AtomXState.paymentMethods || {};
  const bKashNum = document.getElementById('adminBkashNum')?.value.trim() || '';
  const bKashType = document.getElementById('adminBkashType')?.value || 'Personal';
  const bKashInst = document.getElementById('adminBkashInst')?.value.trim() || '';

  const nagadNum = document.getElementById('adminNagadNum')?.value.trim() || '';
  const nagadType = document.getElementById('adminNagadType')?.value || 'Personal';
  const nagadInst = document.getElementById('adminNagadInst')?.value.trim() || '';

  const binancePayId = document.getElementById('adminBinancePayId')?.value.trim() || '';
  const binanceNickname = document.getElementById('adminBinanceNickname')?.value.trim() || '';

  const pricePer1k = Number(document.getElementById('adminPricePer1k')?.value) || 2.0;
  const bdtRate = Number(document.getElementById('adminBdtRate')?.value) || 125;

  pay.bKash = { number: bKashNum, type: bKashType, instructions: bKashInst };
  pay.nagad = { number: nagadNum, type: nagadType, instructions: nagadInst };
  pay.binancePay = { payId: binancePayId, nickname: binanceNickname, instructions: 'Send to Binance Pay ID, then submit Order ID' };
  pay.rates = pay.rates || {};
  pay.rates.USD_PER_1K_CREDITS = pricePer1k;
  pay.rates.BDT_PER_USD = bdtRate;

  AtomXState.paymentMethods = pay;

  try {
    const res = await fetch(\`\${API_BASE}/api/admin/payment-methods\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pay)
    });
    if (res.ok) {
      showToast('✓ Payment accounts, addresses & rates saved successfully!');
    } else {
      showToast('⚠️ Saved locally, cloud sync pending');
    }
  } catch (e) {
    showToast('✓ Saved locally');
  }
  renderAdminPlanManagement(document.getElementById('mainContentArea'));
}

function openAddCryptoAddressModal() {
  const modalHTML = \`
    <div class="modal-backdrop" id="addCryptoAddressModal">
      <div class="modal-box" style="max-width:440px;">
        <div class="modal-header">
          <h3 class="modal-title">Add Crypto Deposit Address</h3>
          <button class="modal-close-btn" onclick="closeModal()">×</button>
        </div>
        <div class="form-group">
          <label class="form-label">Currency / Token</label>
          <select class="form-input" id="newCryptoCurrency">
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
            <option value="ETH">ETH (Ethereum)</option>
            <option value="BNB">BNB (BNB Chain)</option>
            <option value="SOL">SOL (Solana)</option>
            <option value="POL">POL (Polygon)</option>
            <option value="MON">MON (Monad)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Chain / Network Name</label>
          <input type="text" class="form-input" id="newCryptoChain" placeholder="e.g. Ethereum (ERC-20), Solana (SPL), Polygon">
        </div>
        <div class="form-group">
          <label class="form-label">Deposit Wallet Address</label>
          <input type="text" class="form-input" id="newCryptoAddress" placeholder="0x... or Solana Base58 address">
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
          <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="adminAddCryptoAddress()">+ Add Address</button>
        </div>
      </div>
    </div>
  \`;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function adminAddCryptoAddress() {
  const currency = document.getElementById('newCryptoCurrency')?.value || 'USDC';
  const chain = document.getElementById('newCryptoChain')?.value.trim() || 'Mainnet';
  const address = document.getElementById('newCryptoAddress')?.value.trim() || '';

  if (!address) {
    alert('Please enter a valid wallet address');
    return;
  }

  const pay = AtomXState.paymentMethods || {};
  pay.cryptoAddresses = pay.cryptoAddresses || [];
  pay.cryptoAddresses.push({
    id: Date.now().toString(),
    currency,
    chain,
    address
  });

  closeModal();
  await adminSavePaymentSettings();
}

async function adminDeleteCryptoAddress(id) {
  if (!confirm('Are you sure you want to remove this deposit address?')) return;
  const pay = AtomXState.paymentMethods || {};
  pay.cryptoAddresses = (pay.cryptoAddresses || []).filter(c => (c.id || '') !== String(id));
  AtomXState.paymentMethods = pay;
  await adminSavePaymentSettings();
}

async function adminApproveOrder(orderId) {
  if (!confirm(\`Approve order \${orderId} and add credits to user account?\`)) return;
  try {
    const res = await fetch(\`\${API_BASE}/api/admin/approve-transaction\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(\`✓ \${data.message}\`);
      await loadAdminServerData();
      renderAdminTransactions(document.getElementById('mainContentArea'));
    } else {
      alert(data.error || 'Failed to approve order');
    }
  } catch (err) {
    alert('Network error approving order: ' + err.message);
  }
}

async function adminRejectOrder(orderId) {
  const reason = prompt('Reason for rejecting order (e.g. Invalid Transaction ID, Amount Mismatch):', 'Invalid Transaction ID');
  if (reason === null) return;
  try {
    const res = await fetch(\`\${API_BASE}/api/admin/reject-transaction\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, reason })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(\`Order \${orderId} rejected\`);
      await loadAdminServerData();
      renderAdminTransactions(document.getElementById('mainContentArea'));
    } else {
      alert(data.error || 'Failed to reject order');
    }
  } catch (err) {
    alert('Network error rejecting order: ' + err.message);
  }
}
`;

if (!appJs.includes('adminSavePaymentSettings')) {
  appJs += '\n' + adminPaymentHandlers;
  console.log('✓ Successfully appended payment and order admin handlers');
}

fs.writeFileSync('app.js', appJs, 'utf8');
fs.writeFileSync('backend/public/app.js', appJs, 'utf8');
console.log('✓ Successfully updated app.js and synced to backend/public/app.js!');
