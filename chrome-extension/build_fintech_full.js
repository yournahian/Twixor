const fs = require('fs');

const origHtml = fs.readFileSync('chrome-extension/popup.html', 'utf8');

// Helper to extract an element with its inner HTML by id
function extractElement(html, id) {
  const startIdx = html.indexOf(`id="${id}"`);
  if (startIdx === -1) return null;
  const tagStart = html.lastIndexOf('<', startIdx);
  const spaceIdx = html.indexOf(' ', tagStart);
  const tagName = html.slice(tagStart + 1, spaceIdx);
  
  let depth = 1;
  let curr = html.indexOf('>', startIdx) + 1;
  while (depth > 0 && curr < html.length) {
    const nextOpen = html.indexOf(`<${tagName}`, curr);
    const nextClose = html.indexOf(`</${tagName}>`, curr);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      curr = nextOpen + tagName.length + 1;
    } else {
      depth--;
      if (depth === 0) {
        return html.slice(tagStart, nextClose + tagName.length + 3);
      }
      curr = nextClose + tagName.length + 3;
    }
  }
  return null;
}

// Inline SVGs (Lucide-style, 24px, stroke-width 2)
const ICONS = {
  tgpulse: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
  crowdfi: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  scoreboost: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  growthfi: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
  replywave: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  unfollow: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>`,
  creatorx: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  defaulter: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="12"></line><line x1="11" y1="14" x2="11.01" y2="14"></line></svg>`,
  reciprocate: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
  homefeed: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  nichesearch: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  tgliker: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,

  // Nav
  home: `<svg class="tab-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  voice: `<svg class="tab-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  credits: `<svg class="tab-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
  account: `<svg class="tab-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,

  // Action chips
  actionLike: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  actionComment: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  actionRepost: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
  actionFollow: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>`,
  actionBookmark: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`,

  // UI Utilities
  eye: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  moon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  dots: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.5" fill="currentColor"></circle><circle cx="12" cy="12" r="1.5" fill="currentColor"></circle><circle cx="12" cy="19" r="1.5" fill="currentColor"></circle></svg>`,
  chevronRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  backArrow: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
  info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  play: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  copy: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  sync: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
  logout: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
  trash: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  key: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"></circle><path d="M21 2l-9.6 9.6"></path><path d="M15.5 7.5l3 3L22 7l-3-3"></path></svg>`
};

function makeInfoBtn(text) {
  return `<button type="button" class="info-popover-btn" data-info="${encodeURIComponent(text)}" title="More Info" aria-label="More Info">${ICONS.info}</button>`;
}

function makeActionChips(prefix, hasBookmark = false) {
  const chips = hasBookmark ? [
    { key: 'Like', id: `${prefix}OptLike`, label: 'Like', icon: ICONS.actionLike, checked: true },
    { key: 'Repost', id: `${prefix}OptRepost`, label: 'Repost', icon: ICONS.actionRepost, checked: false },
    { key: 'Bookmark', id: `${prefix}OptBookmark`, label: 'Bookmark', icon: ICONS.actionBookmark, checked: false },
    { key: 'Follow', id: `${prefix}OptFollow`, label: 'Follow', icon: ICONS.actionFollow, checked: false }
  ] : [
    { key: 'Like', id: `${prefix}OptLike`, label: 'Like', icon: ICONS.actionLike, checked: true },
    { key: 'Comment', id: `${prefix}OptComment`, label: 'Comment', icon: ICONS.actionComment, checked: true },
    { key: 'Repost', id: `${prefix}OptRepost`, label: 'Repost', icon: ICONS.actionRepost, checked: false },
    { key: 'Follow', id: `${prefix}OptFollow`, label: 'Follow', icon: ICONS.actionFollow, checked: false }
  ];

  return `
    <div class="action-chips-wrap">
      ${chips.map(c => `
        <label class="action-chip ${c.checked ? 'active' : ''}">
          <input type="checkbox" id="${c.id}" class="action-chip-input" ${c.checked ? 'checked' : ''}>
          ${c.icon}
          <span>${c.label}</span>
        </label>
      `).join('')}
      ${hasBookmark ? `<input type="checkbox" id="${prefix}OptComment" class="action-chip-input" style="display:none;">` : ''}
    </div>
  `;
}

function makePresetRow(targetInputId, values = [5, 10, 15, 25, 50, 100], defaultVal = 10) {
  return `
    <div class="preset-row-wrap" data-target="${targetInputId}">
      ${values.map(v => {
        const isUnlimited = v === 'unlimited' || v === 0;
        const label = isUnlimited ? 'Unlimited' : (v === 9999 ? '∞' : v);
        const val = isUnlimited ? 0 : v;
        return `
          <button type="button" class="preset-chip-btn tgliker-preset-btn ${v === defaultVal ? 'active' : ''}" data-val="${val}" data-count="${val}">
            ${label}
          </button>
        `;
      }).join('')}
    </div>
  `;
}

const AGENT_COST_CONFIG = {
  telegram: {
    badge: '1 Credit / AI Reply',
    cost: '1 Credit per posted AI comment',
    free: 'Likes, Reposts & Bookmarks are 100% Free',
    rule: 'Atomically verified on server upon successful reply generation. Auto-refunded on failure.'
  },
  audience: {
    badge: '1 Credit / AI Reply',
    cost: '1 Credit per posted AI comment',
    free: 'Profile visits, Likes & Follows are 100% Free',
    rule: 'Engages high-intent commenters. Only successful AI replies consume credits.'
  },
  sorsa: {
    badge: '1 Credit / AI Reply',
    cost: '1 Credit per posted AI comment',
    free: 'Profile Follows & Bookmarks are 100% Free',
    rule: 'Boosts Walchain & Sorsa score with contextual AI engagement.'
  },
  followers: {
    badge: '1 Credit / AI Reply',
    cost: '1 Credit per posted AI comment',
    free: 'Profile Visits, Likes & Follows are 100% Free',
    rule: 'Deducted atomically per engaged tweet in selected Twitter List.'
  },
  replyback: {
    badge: '1 Credit / AI Reply',
    cost: '1 Credit per reciprocal comment reply',
    free: 'Auto-likes on comments are 100% Free',
    rule: 'Continuous reciprocal loop. Only posted AI replies consume credits.'
  },
  unfollow: {
    badge: '5 Unfollows = 1 Credit',
    cost: '1 Credit per 5 successful unfollows (0.2 C / unfollow)',
    free: 'Whitelist checks & profile audits are 100% Free',
    rule: 'Recorded in ledger under Auto Unfollow. Batched in groups of 5.'
  },
  creators: {
    badge: '1 Credit / AI Reply',
    cost: '1 Credit per posted AI comment',
    free: 'Real-time handle monitoring is 100% Free',
    rule: 'Places high-visibility comments within seconds of creator publication.'
  },
  defaulter: {
    badge: '1 Credit / Scan',
    cost: '1 Credit per completed audit run',
    free: 'Handle parsing & list comparison are 100% Free',
    rule: 'Full comment thread audit scanning up to 100 scroll passes.'
  },
  reciprocator: {
    badge: '1 Credit / AI Reply',
    cost: '1 Credit per reciprocal AI comment',
    free: 'Auto-likes on your post comments are 100% Free',
    rule: 'Visits commenter profiles and posts authentic AI replies on their latest tweets.'
  },
  feedengager: {
    badge: '1 Credit / AI Reply',
    cost: '1 Credit per posted AI comment',
    free: 'Timeline scrolling, Likes & Retweets are 100% Free',
    rule: 'Strictly skips ads, retweets, and reply chains to preserve credits.'
  },
  nicheengager: {
    badge: '1 Credit / AI Reply',
    cost: '1 Credit per posted AI comment',
    free: 'Keyword search & target parsing are 100% Free',
    rule: 'Only root tweets are engaged. Ads and duplicates are skipped at 0 cost.'
  },
  tgliker: {
    badge: '10 Credits / Run',
    cost: '10 Credits flat fee per raid launch',
    free: 'Engage unlimited posts in this raid cycle',
    rule: 'Deducted immediately on launch. Allowed on ANY X account (Alt ID recommended).'
  }
};

function makeCostNoticeCard(agentKey) {
  const conf = AGENT_COST_CONFIG[agentKey] || {
    badge: '1 Credit / Action',
    cost: '1 Credit per action',
    free: 'Audits & skips are Free',
    rule: 'Atomically verified on server.'
  };

  return `
    <div class="surface-card agent-cost-card">
      <div class="cost-card-header">
        <div class="cost-card-title-wrap">
          <span class="cost-card-icon">💳</span>
          <span class="cost-card-label">CREDIT PRICING</span>
        </div>
        <span class="cost-card-badge ${agentKey === 'tgliker' ? 'raid-fee' : ''}">${conf.badge}</span>
      </div>
      <div class="cost-card-body">
        <div class="cost-card-main-cost"><strong>Cost:</strong> ${conf.cost}</div>
        <div class="cost-card-free-perk">✨ <strong>Free:</strong> ${conf.free}</div>
        <div class="cost-card-rule-sub">${conf.rule}</div>
      </div>
    </div>
  `;
}

function makeStatusCard({
  cardId,
  liveDotId,
  badgeId,
  queueId,
  barId,
  stats = [],
  statusTextId,
  countdownId
}) {
  return `
    <div class="status-card" id="${cardId}">
      <div class="status-card-header">
        <div class="status-state-left">
          <span class="live-dot" id="${liveDotId}"></span>
          <span class="status-state-badge" id="${badgeId}">Ready to Launch</span>
        </div>
        <span class="status-queue-count" id="${queueId}">0 In Queue</span>
      </div>
      <div class="status-progress-track">
        <div class="status-progress-fill" id="${barId}" style="width:0%;"></div>
      </div>
      <div class="status-stats-grid stats-${stats.length}">
        ${stats.map(s => `
          <div class="stat-tile">
            <span class="stat-tile-label">${s.label}</span>
            <span class="stat-tile-val ${s.color || ''}" id="${s.id}">0</span>
          </div>
        `).join('')}
      </div>
      <div class="status-text-row" id="${statusTextId}">Ready to start...</div>
      ${countdownId ? `<div id="${countdownId}" class="status-countdown-row" style="display:none;"></div>` : ''}
    </div>
  `;
}

function makeStickyActionBar({ runId, resetId, pauseId, skipId, stopId, runLabel = 'Launch' }) {
  return `
    <div class="sticky-action-bar">
      <button type="button" class="primary-btn mini-btn" id="${runId}">
        ${ICONS.play} <span>${runLabel}</span>
      </button>
      ${resetId ? `<button type="button" class="secondary-btn mini-btn" id="${resetId}">Reset</button>` : ''}
      ${pauseId ? `<button type="button" class="pause-btn mini-btn" id="${pauseId}" style="display:none;">Pause</button>` : ''}
      ${skipId ? `<button type="button" class="skip-btn mini-btn" id="${skipId}" style="display:none;">Skip</button>` : ''}
      ${stopId ? `<button type="button" class="danger-btn mini-btn" id="${stopId}" style="display:none;">STOP</button>` : ''}
    </div>
  `;
}

// Extract auth views in panel-access
const extAuthTabBar = extractElement(origHtml, 'extAuthTabBar');
const extRequestAccessView = extractElement(origHtml, 'extRequestAccessView');
const extCheckStatusLookupView = extractElement(origHtml, 'extCheckStatusLookupView');
const extPendingApprovalView = extractElement(origHtml, 'extPendingApprovalView');
const extRejectedView = extractElement(origHtml, 'extRejectedView');
const extSetPasswordView = extractElement(origHtml, 'extSetPasswordView');
const extLoggedOutCard = extractElement(origHtml, 'extLoggedOutCard');
const extResetPasswordView = extractElement(origHtml, 'extResetPasswordView');
const extSuspendedView = extractElement(origHtml, 'extSuspendedView');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Twixor — Twitter Growth Extension</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body class="dark auth-locked" data-theme="dark">
  <div class="popup-wrapper">
    <!-- Top App Header (Fintech Blue Gradient) -->
    <header class="ext-top-branding">
      
      <!-- Default Header View (Home, AI Voice, Safety, Credits, Account) -->
      <div id="defaultHeaderView" class="header-content-wrap">
        <div class="brand-top-row">
          <div class="ext-brand">
            <img src="assets/logo.png" alt="TWIXOR" class="ext-logo-img">
            <span class="brand-bold">TWIXOR</span>
          </div>
          <div class="header-action-group">
            <button type="button" class="header-icon-btn" id="extDrawerTriggerBtn" title="Menu" aria-label="Menu">
              ${ICONS.dots}
            </button>
            <button class="notification-bell-btn" id="extBellBtn" title="Notifications" style="display:none;">
              <span class="bell-badge-dot"></span>
            </button>
          </div>

          <!-- Sleek Compact 3-Dots Dropdown Menu -->
          <div class="header-tools-drawer" id="extHeaderDrawer" style="display:none;">
            <div class="drawer-items-list">
              <button type="button" class="drawer-item-row" id="extThemeToggleBtn" title="Toggle Theme" aria-label="Toggle Theme">
                <span class="drawer-item-icon" id="drawerThemeIcon">${ICONS.moon}</span>
                <span class="drawer-item-title" id="themeModeText">Theme Mode</span>
              </button>
              <button type="button" class="drawer-item-row" id="dockSidePanelBtn" title="Open in Chrome Side Panel">
                <span class="drawer-item-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="15" y1="3" x2="15" y2="21"/>
                  </svg>
                </span>
                <span class="drawer-item-title">Side Panel</span>
              </button>
              <button type="button" class="drawer-item-row" id="popoutWindowBtn" title="Open Floating Mini Window">
                <span class="drawer-item-icon">↗️</span>
                <span class="drawer-item-title">Popout Window</span>
              </button>
            </div>
            <button type="button" id="closeDrawerBtn" style="display:none;"></button>
          </div>
        </div>

        <!-- Centered Balance & Account Info -->
        <div class="header-center-stack">
          <span class="header-credits-label">Credits</span>
          <div class="header-credits-val-wrap">
            <span class="header-credits-val" id="creditBalanceText">9,616</span>
            <span class="header-credits-cur">C</span>
            <button type="button" class="eye-toggle-btn" id="extToggleEyeBtn" title="Toggle Balance Visibility" aria-label="Toggle Balance Visibility">
              ${ICONS.eye}
            </button>
          </div>
          <button type="button" class="buy-credits-pill-btn" id="extHeaderBuyCreditsBtn">
            Buy Credits
          </button>
          <div class="account-locked-pill" id="verifiedAccountBar">
            <span class="live-dot" id="barLockDot"></span>
            <span class="verified-handle" id="barVerifiedHandleText">@user</span>
            <span class="lock-tag" id="barMatchBadge">Locked</span>
          </div>
        </div>
      </div>

      <!-- Agent Detail Header View (Shown ONLY when inside an agent detail page - Grand Blue Zone) -->
      <div id="agentHeaderView" class="header-content-wrap" style="display:none;">
        <div class="brand-top-row">
          <button type="button" class="header-icon-btn agent-back-btn" id="agentDetailBackBtn" title="Back to Agents" aria-label="Back to Agents">
            ${ICONS.backArrow}
          </button>
          <div class="ext-brand">
            <img src="assets/logo.png" alt="TWIXOR" class="ext-logo-img">
            <span class="brand-bold">TWIXOR</span>
          </div>
          <div class="header-action-group">
            <button type="button" class="header-icon-btn info-popover-btn" id="detailAgentInfoBtn" title="Agent Info" aria-label="Agent Info" data-info="Autonomous agent workflow. Parameters configurable below.">
              ${ICONS.info}
            </button>
          </div>
        </div>

        <!-- Grand Centered Agent Info Stack (Matches Screenshot 5) -->
        <div class="agent-header-center-stack">
          <div class="agent-header-icon-circle" id="detailAgentIcon">
            ${ICONS.tgpulse}
          </div>
          <div class="agent-header-title-row">
            <span class="agent-header-name" id="detailAgentTitle">TG Pulse</span>
            <span id="detailAgentBadge" class="badge-mini popular" style="display:none;">POPULAR</span>
          </div>
          <div class="agent-header-pills-row">
            <div class="agent-header-pill" title="Current Balance">
              <span>⚡</span>
              <span id="detailAgentCreditPill">1,248 C</span>
            </div>
            <div class="agent-header-pill" title="AI Voice Style">
              <span>🎙️</span>
              <span id="detailAgentVoicePill">CT Human Reply</span>
            </div>
            <div class="agent-header-pill agent-cost-pill" title="Credit Cost per Action">
              <span>💳</span>
              <span id="detailAgentCostPill">1 C / reply</span>
            </div>
          </div>
          <div class="account-locked-pill" id="agentLockedBar">
            <span class="live-dot"></span>
            <span class="verified-handle" id="agentVerifiedHandleText">@user</span>
            <span class="lock-tag">1-TO-1 LOCKED & MATCHED</span>
          </div>
          <div id="detailAgentDesc" style="display:none;"></div>
        </div>
      </div>

    </header>

    <!-- Universal Update Available Notification Banner -->
    <div id="extUpdateBanner" style="display:none;" class="update-banner">
      <div class="update-banner-content">
        <strong id="extUpdateVersionText">UPDATE AVAILABLE: v1.0.1</strong>
        <span>Security hardening & multi-agent upgrades</span>
      </div>
      <a href="https://github.com/yournahian/Twixor/releases" target="_blank" id="extUpdateDownloadBtn" class="update-btn">
        UPDATE NOW
      </a>
    </div>

    <!-- Real-Time Twitter Account Mismatch Alert Banner -->
    <div id="accountMismatchBanner" style="display:none;" class="mismatch-banner">
      <div class="mismatch-header">
        <span>🔒 Account Lock Warning</span>
        <button type="button" id="closeMismatchBannerBtn" class="banner-dismiss-btn" title="Dismiss">✕</button>
      </div>
      <div id="accountMismatchDesc">
        Locked to ID: <strong id="mismatchExpectedHandle">@handle</strong>.<br>
        Active Twitter tab: <strong id="mismatchActualHandle">@other</strong>.
      </div>
    </div>

    <!-- Rate Limit Warning Banner -->
    <div id="rateLimitWarningBanner" style="display:none;" class="rate-limit-banner">
      <div class="rate-limit-header">
        <span id="rateLimitBannerTitle">Twitter Daily Post Limit Reached</span>
        <button type="button" id="closeRateLimitBannerBtn" class="banner-dismiss-btn" title="Dismiss">✕</button>
      </div>
      <div id="rateLimitBannerDesc">
        Daily post limit reached. Active tasks safely paused.
      </div>
    </div>

    <!-- Main Content Panels -->
    <main class="ext-main">

      <!-- ============================================== -->
      <!-- TAB 1: 12 AUTONOMOUS AGENTS (HOME + DETAIL) -->
      <!-- ============================================== -->
      <section id="panel-agents" class="tab-panel active">

        <!-- VIEW A: BENTO GRID DASHBOARD -->
        <div id="agentsBentoView" class="agents-bento-container">
          <div class="section-header-title">Quick Agents</div>

          <!-- Section 1: Raid & Boost -->
          <div class="surface-card">
            <div class="agent-group-label">Raid & Boost</div>
            <div class="quick-agents-grid">
              <!-- 1. TG Pulse -->
              <button type="button" class="bento-card" data-agent-id="telegram" title="TG Pulse">
                <div class="bento-icon-box bento-icon-tgpulse">
                  ${ICONS.tgpulse}
                </div>
                <span class="bento-title">TG Pulse</span>
              </button>

              <!-- 2. CrowdFi -->
              <button type="button" class="bento-card" data-agent-id="audience" title="CrowdFi">
                <div class="bento-icon-box bento-icon-crowdfi">
                  ${ICONS.crowdfi}
                </div>
                <span class="bento-title">CrowdFi</span>
              </button>

              <!-- 3. Score Boost -->
              <button type="button" class="bento-card" data-agent-id="sorsa" title="Score Boost">
                <div class="bento-icon-box bento-icon-scoreboost">
                  ${ICONS.scoreboost}
                </div>
                <span class="bento-title">Score Boost</span>
              </button>

              <!-- 4. GrowthFi -->
              <button type="button" class="bento-card" data-agent-id="followers" title="GrowthFi">
                <div class="bento-icon-box bento-icon-growthfi">
                  ${ICONS.growthfi}
                </div>
                <span class="bento-title">GrowthFi</span>
              </button>
            </div>
          </div>

          <!-- Section 2: Growth & Reply -->
          <div class="surface-card">
            <div class="agent-group-label">Growth & Reply</div>
            <div class="quick-agents-grid">
              <!-- 5. ReplyWave -->
              <button type="button" class="bento-card" data-agent-id="replyback" title="ReplyWave">
                <div class="bento-icon-box bento-icon-replywave">
                  ${ICONS.replywave}
                </div>
                <span class="bento-title">ReplyWave</span>
              </button>

              <!-- 6. Unfollow -->
              <button type="button" class="bento-card" data-agent-id="unfollow" title="Unfollow">
                <div class="bento-icon-box bento-icon-unfollow">
                  ${ICONS.unfollow}
                </div>
                <span class="bento-title">Unfollow</span>
              </button>

              <!-- 7. CreatorX -->
              <button type="button" class="bento-card" data-agent-id="creators" title="CreatorX">
                <div class="bento-icon-box bento-icon-creatorx">
                  ${ICONS.creatorx}
                </div>
                <span class="bento-title">CreatorX</span>
              </button>

              <!-- 8. Defaulter -->
              <button type="button" class="bento-card" data-agent-id="defaulter" title="Defaulter">
                <div class="bento-icon-box bento-icon-defaulter">
                  ${ICONS.defaulter}
                </div>
                <span class="bento-title">Defaulter</span>
              </button>
            </div>
          </div>

          <!-- Section 3: Tools & Audit -->
          <div class="surface-card">
            <div class="agent-group-label">Tools & Audit</div>
            <div class="quick-agents-grid">
              <!-- 9. Reciprocate -->
              <button type="button" class="bento-card" data-agent-id="reciprocator" title="Reciprocate">
                <div class="bento-icon-box bento-icon-reciprocate">
                  ${ICONS.reciprocate}
                </div>
                <span class="bento-title">Reciprocate</span>
              </button>

              <!-- 10. Home Feed -->
              <button type="button" class="bento-card" data-agent-id="feedengager" title="Home Feed">
                <div class="bento-icon-box bento-icon-homefeed">
                  ${ICONS.homefeed}
                </div>
                <span class="bento-title">Home Feed</span>
              </button>

              <!-- 11. Niche Search -->
              <button type="button" class="bento-card" data-agent-id="nicheengager" title="Niche Search">
                <div class="bento-icon-box bento-icon-nichesearch">
                  ${ICONS.nichesearch}
                </div>
                <span class="bento-title">Niche Search</span>
              </button>

              <!-- 12. TG Liker -->
              <button type="button" class="bento-card" data-agent-id="tgliker" title="TG Liker">
                <div class="bento-icon-box bento-icon-tgliker">
                  ${ICONS.tgliker}
                </div>
                <span class="bento-title">TG Liker</span>
              </button>
            </div>
          </div>

          <!-- Active Voice Banner at Bottom of Home -->
          <div class="active-voice-banner" id="homeActiveVoiceBanner" title="Customize AI Voice">
            <div class="voice-banner-left">
              <div class="voice-banner-icon">${ICONS.voice}</div>
              <div class="voice-banner-meta">
                <span class="voice-banner-label">Active Voice</span>
                <span class="voice-banner-name" id="homeActiveVoiceName">CT Human Reply</span>
              </div>
            </div>
            <div class="voice-banner-arrow">${ICONS.chevronRight}</div>
          </div>
        </div>

        <!-- VIEW B: DEDICATED AGENT WORKSPACE VIEW -->
        <div id="agentDetailView" class="agent-detail-container" style="display: none;">
          <span class="badge-mini" id="detailAgentBadge" style="display:none;">100% AUTO</span>
          <div id="detailAgentDesc" style="display:none;"></div>

          <!-- Admin Maintenance Banner -->
          <div id="agentMaintenanceBanner" style="display:none;" class="maintenance-banner">
            <div class="maintenance-header">
              <span>🛑 AGENT DISABLED BY ADMIN</span>
            </div>
            <div id="agentMaintenanceReason">
              This agent is temporarily paused by administrator for scheduled maintenance.
            </div>
          </div>

          <!-- Agent Workspaces -->
          <div class="agent-workspace-panels">

            <!-- 1. TG Pulse -->
            <div class="agent-panel-content" id="panel-agent-telegram" style="display:none;">
              ${makeCostNoticeCard('telegram')}
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Paste raid links</span>
                  <div class="field-actions">
                    <span id="tgLinkBadge" class="sub-badge">Smart Filter</span>
                    <button type="button" class="clean-btn" id="cleanTgInputBtn">Clean Text</button>
                  </div>
                </div>
                <textarea id="tgLinksInput" class="ext-textarea" placeholder="Paste Telegram message or tweet URLs..."></textarea>
              </div>

              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Actions</span>
                </div>
                ${makeActionChips('action')}
                <span id="tgActiveToneName" style="display:none;">CT Human Reply</span>
                <span id="actionSelectAllBtn" style="display:none;"></span>
                <span id="actionSelectLikeCommentBtn" style="display:none;"></span>
                <span id="actionSelectLikeOnlyBtn" style="display:none;"></span>
              </div>

              <!-- Validation Summary Card -->
              <div class="surface-card" id="tgParseSummaryCard" style="display:none;">
                <div class="summary-counts-row">
                  <div>Valid: <strong id="tgValidLinksCount" class="text-success">0</strong></div>
                  <div>Skipped: <strong id="tgInvalidLinksCount" class="text-danger">0</strong></div>
                </div>
              </div>

              ${makeStatusCard({
                cardId: 'telegramProgressCard',
                liveDotId: 'tgPulseLiveDot',
                badgeId: 'tgStateBadge',
                queueId: 'tgQueueIndicator',
                barId: 'tgProgressBar',
                stats: [
                  { label: 'DONE', id: 'tgDoneCount', color: 'text-primary' },
                  { label: 'QUEUE', id: 'tgTotalCount', color: 'text-success' },
                  { label: 'SKIPPED', id: 'tgSkippedCount', color: 'text-warning' }
                ],
                statusTextId: 'tgLiveStatusText',
                countdownId: 'tgCountdownText'
              })}
              <div id="tgPulseStateBadge" style="display:none;"></div>
              <div id="tgPulseStatusText" style="display:none;"></div>
              <div id="tgLiveStatus" style="display:none;"></div>
              <div id="tgSkippedPostsContainer" style="display:none;">
                <span id="tgSkippedBadgeCount">0</span>
                <div id="tgSkippedPostsList"></div>
              </div>

              ${makeStickyActionBar({
                runId: 'runTgEngageBtn',
                resetId: 'resetTelegramQueueBtn',
                pauseId: 'pauseTgEngageBtn',
                skipId: 'skipTgEngageBtn',
                stopId: 'stopTgEngageBtn',
                runLabel: 'Launch TG Pulse'
              })}
            </div>

            <!-- 2. CrowdFi -->
            <div class="agent-panel-content" id="panel-agent-audience" style="display:none;">
              ${makeCostNoticeCard('audience')}
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Twitter List URL</span>
                  <span id="audienceCustomCountBadge" class="sub-badge" style="display:none;">Custom</span>
                </div>
                <select id="audienceListSelect" class="ext-select">
                  <option value="custom" selected>Custom List URL</option>
                </select>
                <div id="customListUrlBox" style="margin-top:6px;">
                  <input type="url" id="customListUrlInput" class="ext-input" placeholder="https://x.com/i/lists/...">
                </div>
              </div>

              <div class="surface-card">
                <div class="grid-2-col">
                  <div>
                    <span class="field-label">Tweet Freshness</span>
                    <select id="audienceDateRangeSelect" class="ext-select">
                      <option value="15m">Last 15 Minutes</option>
                      <option value="30m">Last 30 Minutes</option>
                      <option value="1h">Last 1 Hour</option>
                      <option value="2h">Last 2 Hours</option>
                      <option value="6h">Last 6 Hours</option>
                      <option value="12h">Last 12 Hours</option>
                      <option value="24h" selected>Last 24 Hours</option>
                      <option value="48h">Last 48 Hours</option>
                      <option value="3d">Last 3 Days</option>
                      <option value="7d">Last 7 Days</option>
                    </select>
                  </div>
                  <div>
                    <span class="field-label">Profiles to Collect</span>
                    <select id="audienceProfileCountSelect" name="audienceTargetCountSelect" class="ext-select">
                      <option value="10">10 Profiles</option>
                      <option value="25" selected>25 Profiles</option>
                      <option value="50">50 Profiles</option>
                      <option value="100">100 Profiles</option>
                    </select>
                    <select id="audienceTargetCountSelect" style="display:none;">
                      <option value="10">10</option>
                      <option value="25" selected>25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
                <div style="margin-top:10px;">
                  <span class="field-label">Posts / Profile</span>
                  <select id="audiencePostsPerProfileSelect" class="ext-select">
                    <option value="random" selected>🎲 Random 1 or 2</option>
                    <option value="1">1 Post</option>
                    <option value="2">2 Posts</option>
                    <option value="3">3 Posts</option>
                  </select>
                </div>
              </div>

              <div class="surface-card">
                <span class="field-label">Actions to Execute</span>
                ${makeActionChips('audience')}
                <input type="checkbox" id="audienceLikePostsToggle" checked style="display:none;">
                <input type="checkbox" id="audienceReplyPostsToggle" checked style="display:none;">
                <input type="checkbox" id="audienceRepostToggle" style="display:none;">
                <input type="checkbox" id="audienceAutoFollowToggle" style="display:none;">
              </div>

              ${makeStatusCard({
                cardId: 'audienceProgressCard',
                liveDotId: 'audienceLiveDot',
                badgeId: 'audienceStateBadge',
                queueId: 'audienceQueueIndicator',
                barId: 'audienceProgressBar',
                stats: [
                  { label: 'DONE', id: 'audienceDoneCount', color: 'text-primary' },
                  { label: 'COLLECTED', id: 'audienceCollectedCount', color: 'text-success' },
                  { label: 'SKIPPED', id: 'audienceSkippedCount', color: 'text-warning' }
                ],
                statusTextId: 'audienceLiveStatusText'
              })}
              <div id="audienceStatusText" style="display:none;"></div>

              ${makeStickyActionBar({
                runId: 'runAudienceBuilderBtn',
                resetId: 'resetAudienceQueueBtn',
                pauseId: 'pauseAudienceBuilderBtn',
                skipId: 'skipAudienceBuilderBtn',
                stopId: 'stopAudienceBuilderBtn',
                runLabel: 'Launch CrowdFi'
              })}
            </div>

            <!-- 3. Score Boost -->
            <!-- 3. Score Boost / Score Accelerator -->
            <div class="agent-panel-content" id="panel-agent-sorsa" style="display:none;">
              ${makeCostNoticeCard('sorsa')}
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Target Accounts</span>
                  <span id="sorsaTargetCountBadge" class="sub-badge">5 accounts ready</span>
                </div>
                <div class="source-chips-row">
                  <select id="sorsaCuratedListSelect" class="ext-select" style="margin-bottom:6px;">
                    <option value="top_crypto" selected>Admin Curated Alpha Pod</option>
                  </select>
                  <div class="button-row">
                    <button type="button" class="secondary-btn mini-btn" id="sorsaLoadCuratedBtn">Load List</button>
                    <button type="button" class="secondary-btn mini-btn" id="sorsaUploadCsvBtn">Upload .CSV</button>
                    <button type="button" class="secondary-btn mini-btn" id="sorsaToggleManualInputBtn">Handles</button>
                  </div>
                  <input type="file" id="sorsaCsvFileInput" accept=".csv,.txt" style="display:none;">
                  <textarea id="sorsaHandlesInput" class="ext-textarea" style="display:none; margin-top:6px;" placeholder="@handle1&#10;@handle2"></textarea>
                </div>
              </div>

              <!-- Execution Strategy Card (On Top) -->
              <div class="surface-card">
                <span class="field-label">Execution Strategy</span>
                <select id="sorsaModeSelect" class="ext-select">
                  <option value="sequential" selected>📄 Mode 1: Sequential Resume (Resumes from last index)</option>
                  <option value="deduplication">🔄 Mode 2: Rolling Deduplication (Rotates target list)</option>
                </select>
                <div id="sorsaModeDescription" style="font-size:11px; color:#94A3B8; margin-top:5px; line-height:1.4;">
                  Remembers your last processed account index and picks up where it left off on every run.
                </div>

                <!-- Mode 2 Deduplication Cool-Off Window (Hidden unless Mode 2 is chosen) -->
                <div id="sorsaDeduplicationWindowBox" style="display:none; margin-top:10px;">
                  <span class="field-label" style="font-size:11px; margin-bottom:4px;">Mode 2 Deduplication Cool-Off Window</span>
                  <select id="sorsaCooloffSelect" class="ext-select">
                    <option value="12">12 Hours</option>
                    <option value="24" selected>24 Hours</option>
                    <option value="48">48 Hours</option>
                    <option value="72">72 Hours</option>
                    <option value="custom">Custom Hours...</option>
                  </select>
                  <div id="sorsaCustomCooloffBox" style="display:none; margin-top:6px;">
                    <input type="number" id="sorsaCustomCooloffInput" class="ext-input" min="1" max="720" value="24" placeholder="Enter custom cooldown hours">
                  </div>
                </div>
              </div>

              <!-- 1 Line: Accounts / Cycle and Posts / Profile -->
              <div class="surface-card">
                <div class="grid-2-col" style="gap:10px;">
                  <div>
                    <span class="field-label">Accounts Per Cycle</span>
                    <select id="sorsaCountSelect" class="ext-select">
                      <option value="5">5 Accounts</option>
                      <option value="10" selected>10 Accounts</option>
                      <option value="15">15 Accounts</option>
                      <option value="20">20 Accounts</option>
                      <option value="25">25 Accounts</option>
                      <option value="50">50 Accounts</option>
                      <option value="all">All Accounts</option>
                      <option value="custom">Custom...</option>
                    </select>
                    <div id="sorsaCustomCountBox" style="display:none; margin-top:5px;">
                      <input type="number" id="sorsaCustomCountInput" class="ext-input" min="1" max="1000" placeholder="e.g. 12">
                    </div>
                    <input type="hidden" id="sorsaBatchSizeSelect" value="10">
                  </div>
                  <div>
                    <span class="field-label">Posts per Profile</span>
                    <select id="sorsaPostsPerProfileSelect" class="ext-select">
                      <option value="random" selected>🎲 Random 1 or 2</option>
                      <option value="1">1 Post</option>
                      <option value="2">2 Posts</option>
                      <option value="3">3 Posts</option>
                    </select>
                    <input type="hidden" id="sorsaPostsPerAccountSelect" value="random">
                  </div>
                </div>
              </div>

              <!-- Unfollow Non-Followers First Card -->
              <div class="surface-card">
                <div class="switch-row">
                  <div>
                    <div class="switch-label">Unfollow Non-Followers First</div>
                    <div class="switch-sub">If target doesn't follow back: unfollows, engages on recent posts, then re-follows.</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" id="sorsaUnfollowNonFollowersToggle">
                    <span class="slider-round"></span>
                  </label>
                </div>
              </div>

              <div class="surface-card">
                <span class="field-label">Actions to Execute</span>
                ${makeActionChips('sorsa')}
              </div>

              ${makeStatusCard({
                cardId: 'sorsaProgressCard',
                liveDotId: 'sorsaLiveDot',
                badgeId: 'sorsaStateBadge',
                queueId: 'sorsaQueueIndicator',
                barId: 'sorsaProgressBar',
                stats: [
                  { label: 'DONE', id: 'sorsaDoneCount', color: 'text-primary' },
                  { label: 'COLLECTED', id: 'sorsaCollectedCount', color: 'text-success' },
                  { label: 'SKIPPED', id: 'sorsaSkippedCount', color: 'text-warning' }
                ],
                statusTextId: 'sorsaLiveStatusText',
                countdownId: 'sorsaCountdownText'
              })}
              <div id="sorsaStatusText" style="display:none;"></div>

              ${makeStickyActionBar({
                runId: 'runSorsaBoosterBtn',
                resetId: 'resetSorsaQueueBtn',
                pauseId: 'pauseSorsaBoosterBtn',
                skipId: 'skipSorsaBoosterBtn',
                stopId: 'stopSorsaBoosterBtn',
                runLabel: 'Launch Score Boost'
              })}
            </div>

            <!-- 4. GrowthFi -->
            <div class="agent-panel-content" id="panel-agent-followers" style="display:none;">
              ${makeCostNoticeCard('followers')}
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Twitter List URL</span>
                  <span class="status-pill-badge">Safety Schedule On</span>
                </div>
                <select id="followerNicheSelect" class="ext-select">
                  <option value="custom" selected>Custom List URL</option>
                </select>
                <div id="customFollowerUrlBox" style="margin-top:6px;">
                  <input type="url" id="customFollowerUrlInput" class="ext-input" placeholder="https://x.com/i/lists/...">
                </div>
                <span id="followerCustomCountBadge" style="display:none;"></span>
              </div>

              <div class="surface-card">
                <div class="grid-2-col" style="gap:8px;">
                  <div>
                    <span class="field-label">Tweet Freshness</span>
                    <select id="followerFreshnessSelect" class="ext-select">
                      <option value="15m">Last 15 Minutes</option>
                      <option value="30m">Last 30 Minutes</option>
                      <option value="1h" selected>Last 1 Hour</option>
                      <option value="2h">Last 2 Hours</option>
                      <option value="6h">Last 6 Hours</option>
                      <option value="12h">Last 12 Hours</option>
                      <option value="24h">Last 24 Hours</option>
                      <option value="3d">Last 3 Days</option>
                      <option value="7d">Last 7 Days</option>
                    </select>
                  </div>
                  <div>
                    <span class="field-label">Sort Priority</span>
                    <select id="followerSortSelect" class="ext-select">
                      <option value="active" selected>🔥 Most Active</option>
                      <option value="recent">⏱️ Newest First</option>
                    </select>
                  </div>
                </div>

                <div style="margin-top:8px;">
                  <span class="field-label">Posts to Engage</span>
                  <select id="followerDailyTargetSelect" class="ext-select">
                    <option value="5">5 Posts</option>
                    <option value="8" selected>8 Posts (Safe)</option>
                    <option value="15">15 Posts</option>
                    <option value="25">25 Posts</option>
                    <option value="50">50 Posts</option>
                    <option value="custom">Custom...</option>
                  </select>
                </div>
                <div id="followerCustomTargetBox" style="display:none; margin-top:8px;">
                  <input type="number" id="followerCustomTargetInput" class="ext-input" min="1" max="500" placeholder="Enter custom post count (e.g. 12)">
                </div>
              </div>

              <div class="surface-card">
                <span class="field-label">Actions to Execute</span>
                ${makeActionChips('follower')}
              </div>

              ${makeStatusCard({
                cardId: 'followerProgressCard',
                liveDotId: 'followerLiveDot',
                badgeId: 'followerStateBadge',
                queueId: 'followerQueueIndicator',
                barId: 'followerProgressBar',
                stats: [
                  { label: 'DONE', id: 'followerDoneCount', color: 'text-primary' },
                  { label: 'COLLECTED', id: 'followerCollectedCount', color: 'text-success' },
                  { label: 'SKIPPED', id: 'followerSkippedCount', color: 'text-warning' }
                ],
                statusTextId: 'followerLiveStatusText'
              })}
              <div id="followerStatusText" style="display:none;"></div>

              ${makeStickyActionBar({
                runId: 'runFollowerIncreaseBtn',
                resetId: 'resetFollowerQueueBtn',
                pauseId: 'pauseFollowerIncreaseBtn',
                skipId: 'skipFollowerIncreaseBtn',
                stopId: 'stopFollowerIncreaseBtn',
                runLabel: 'Launch GrowthFi'
              })}
            </div>

            <!-- 5. ReplyWave -->
            <div class="agent-panel-content" id="panel-agent-replyback" style="display:none;">
              ${makeCostNoticeCard('replyback')}
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Target Tweet URL</span>
                  <button type="button" class="current-tab-chip" data-target="replybackTweetUrlInput">Current Tab</button>
                </div>
                <input type="url" id="replybackTweetUrlInput" name="myTweetUrlInput1" class="ext-input" placeholder="https://x.com/username/status/...">
                <input type="hidden" id="myTweetUrlInput1">
                <input type="hidden" id="myTweetUrlInput2">
                <input type="hidden" id="myTweetUrlInput3">
              </div>

              <div class="surface-card">
                <div class="grid-2-col">
                  <div>
                    <span class="field-label">Max Replies / Post</span>
                    <input type="number" id="replybackMaxRepliesInput" class="ext-input" value="10" min="1" max="100">
                    <input type="hidden" id="replyBackMaxCountSelect" value="10">
                  </div>
                  <div>
                    <span class="field-label">Pacing Delay</span>
                    <select id="replybackIntervalSelect" class="ext-select">
                      <option value="balanced" selected>Balanced (30-60s)</option>
                      <option value="relaxed">Relaxed (1-2m)</option>
                    </select>
                    <input type="hidden" id="replyBackDelaySelect" value="12">
                    <input type="hidden" id="replyBackToneSelect" value="Natural &amp; Concise">
                  </div>
                </div>
              </div>

              <div class="surface-card">
                <span class="field-label">Actions to Execute</span>
                ${makeActionChips('replyback')}
                <input type="checkbox" id="replyBackAutoLikeCheck" checked style="display:none;">
              </div>

              ${makeStatusCard({
                cardId: 'replyBackProgressCard',
                liveDotId: 'replyBackLiveDot',
                badgeId: 'replyBackStateBadge',
                queueId: 'replyBackQueueIndicator',
                barId: 'replyBackProgressBar',
                stats: [
                  { label: 'DONE', id: 'replyBackDoneCount', color: 'text-primary' },
                  { label: 'QUEUE', id: 'replyBackQueueCount', color: 'text-success' },
                  { label: 'SKIPPED', id: 'replyBackSkippedCount', color: 'text-warning' }
                ],
                statusTextId: 'replyBackLiveStatusText',
                countdownId: 'replyBackCountdownText'
              })}
              <span id="replyBackPostIndicator" style="display:none;"></span>
              <span id="replyBackCollectedCount" style="display:none;"></span>

              ${makeStickyActionBar({
                runId: 'runReplyBackBtn',
                resetId: 'resetReplyBackQueueBtn',
                pauseId: 'pauseReplyBackBtn',
                skipId: 'skipReplyBackBtn',
                stopId: 'stopReplyBackBtn',
                runLabel: 'Launch ReplyWave'
              })}
            </div>

            <!-- 6. Unfollow -->
            <div class="agent-panel-content" id="panel-agent-unfollow" style="display:none;">
              ${makeCostNoticeCard('unfollow')}
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Target Criteria</span>
                  <span class="status-pill-badge">Safety Synced</span>
                </div>
                <select id="unfollowCriteriaSelect" class="ext-select">
                  <option value="non_followers" selected>Does Not Follow Back</option>
                  <option value="low_score">Low Wallchain Score</option>
                  <option value="both">Both (Non-Followers & Low Wallchain Score)</option>
                </select>
                <input type="checkbox" id="unfollowCriteriaNotFollowing" checked style="display:none;">
                <input type="checkbox" id="unfollowCriteriaLowScore" style="display:none;">

                <!-- Score Threshold Box (Visible when Low Wallchain Score or Both is selected) -->
                <div id="unfollowScoreThresholdBox" style="display:none; margin-top:8px;">
                  <span class="field-label" style="font-size:11px; margin-bottom:4px;">Score Threshold</span>
                  <input type="number" id="unfollowScoreThresholdInput" class="ext-input" value="30" min="1" max="100" placeholder="Unfollow if score is below this number (e.g. 30)">
                  <span style="font-size:10.5px; color:#94A3B8; margin-top:3px; display:block;">Unfollows profiles with Wallchain / Influence score below this threshold.</span>
                </div>
              </div>

              <!-- Target Limit Card -->
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Target Limit (Accounts)</span>
                  ${makeInfoBtn('Maximum number of unfollows to execute in this batch')}
                </div>
                <input type="number" id="unfollowTargetCountInput" class="ext-input" value="25" min="1" max="200">
                <input type="hidden" id="unfollowMaxCountInput" value="25">
                <input type="hidden" id="unfollowMaxCount" value="25">
                ${makePresetRow('unfollowTargetCountInput', [10, 25, 50, 100], 25)}
              </div>

              <!-- Global Safety Engine Card (From Screenshot 1) -->
              <div class="surface-card" style="border-left: 3px solid #3B82F6; background: rgba(59, 130, 246, 0.06);">
                <div style="display:flex; align-items:center; gap:6px; font-weight:700; font-size:11.5px; color:#60A5FA;">
                  <span>🛡️</span>
                  <span>Global Safety Engine ACTIVE</span>
                </div>
                <div style="font-size:11px; color:#94A3B8; margin-top:4px; line-height:1.4;">
                  Pacing delays, batch rest breaks, and anti-ban limits are automatically synchronized from your central <strong>Safety Settings</strong>. Powered by Global Smooth Scroll & Virtual Cursor.
                </div>
              </div>

              <!-- Whitelist Protected Accounts Card -->
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Whitelist Protected Accounts (Never Unfollow)</span>
                  ${makeInfoBtn('Accounts listed here will never be unfollowed under any circumstances')}
                </div>
                <textarea id="unfollowWhitelistInput" class="ext-textarea" rows="2" placeholder="@friend1, @partner2, @vitalikbuterin" style="margin-top:4px; font-size:12px;"></textarea>
                <div style="font-size:10.5px; color:#94A3B8; margin-top:4px; line-height:1.35;">
                  Separate usernames by comma or newline. These VIP accounts will never be unfollowed.
                </div>
              </div>

              ${makeStatusCard({
                cardId: 'unfollowProgressCard',
                liveDotId: 'unfollowLiveDot',
                badgeId: 'unfollowStateBadge',
                queueId: 'unfollowProgressText',
                barId: 'unfollowProgressBar',
                stats: [
                  { label: 'DONE', id: 'unfollowCountDone', color: 'text-primary' },
                  { label: 'SKIPPED', id: 'unfollowCountSkipped', color: 'text-warning' },
                  { label: 'FAILED', id: 'unfollowCountFailed', color: 'text-danger' }
                ],
                statusTextId: 'unfollowLiveStatusText',
                countdownId: 'unfollowCountdownText'
              })}

              ${makeStickyActionBar({
                runId: 'runAutoUnfollowBtn',
                resetId: 'resetUnfollowQueueBtn',
                pauseId: 'pauseAutoUnfollowBtn',
                skipId: 'skipAutoUnfollowBtn',
                stopId: 'stopAutoUnfollowBtn',
                runLabel: 'Launch Unfollow'
              })}
            </div>

            <!-- 7. CreatorX -->
            <div class="agent-panel-content" id="panel-agent-creators" style="display:none;">
              ${makeCostNoticeCard('creators')}
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Add Creator</span>
                  ${makeInfoBtn('Follow and engage immediately when these top creators post')}
                </div>
                <div class="input-with-btn">
                  <input type="text" id="addCreatorInput" name="creatorHandlesInput" class="ext-input" placeholder="@vitalikbuterin, @elonmusk">
                  <input type="hidden" id="creatorHandlesInput">
                  <button type="button" class="primary-btn mini-btn" id="addCreatorBtn" style="min-width:54px;">Add</button>
                </div>
                <div id="creatorListChips" class="creator-chips-wrap" style="margin-top:10px; display:flex; flex-wrap:wrap; gap:6px;"></div>
              </div>

              <div class="surface-card">
                <span class="field-label">Actions to Execute</span>
                ${makeActionChips('creator')}
              </div>

              ${makeStickyActionBar({
                runId: 'runCreatorRadarBtn',
                stopId: 'stopCreatorRadarBtn',
                runLabel: 'Launch CreatorX'
              })}
            </div>

            <!-- 8. Defaulter -->
            <div class="agent-panel-content" id="panel-agent-defaulter" style="display:none;">
              ${makeCostNoticeCard('defaulter')}
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Tweet Link</span>
                  <button type="button" class="current-tab-chip" data-target="defaulterPostUrl">Current Tab</button>
                </div>
                <input type="url" id="defaulterPostUrl" name="defaulterTweetUrlInput" class="ext-input" placeholder="https://x.com/username/status/...">
                <input type="hidden" id="defaulterTweetUrlInput">
              </div>

              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Expected Group Members / Raid Logs</span>
                  <span id="defaulterExpectedCountBadge" class="sub-badge">0 Members</span>
                </div>
                <textarea id="defaulterExpectedUsers" name="defaulterGroupHandlesInput" class="ext-textarea" placeholder="Paste Telegram raid logs, chat messages, or X links, e.g.:&#10;x.com/reduansheikh11/status/2101233..."></textarea>
                <textarea id="defaulterGroupHandlesInput" style="display:none;"></textarea>
                <span id="defaulterCountBadge" style="display:none;"></span>
                <div style="display:flex; align-items:center; gap:10px; margin-top:8px;">
                  <button type="button" class="primary-btn mini-btn" id="defaulterCleanListBtn" style="white-space:nowrap; padding:6px 14px; min-height:32px; font-size:11.5px; font-weight:700; border-radius:8px; gap:6px;">
                    <span>🧹</span>
                    <span>Clean &amp; Extract @handles</span>
                  </button>
                  <span style="font-size:11px; color:#94A3B8; line-height:1.3;">Auto-cleans raw links &amp; chat logs</span>
                </div>
              </div>

              <!-- Defaulter Audit Results Card -->
              <div id="defaulterResultsCard" class="surface-card" style="display:none;">
                <div class="field-header">
                  <span class="field-label" id="defaulterResultsHeading">Audit Results</span>
                  <button type="button" class="clean-btn" id="copyDefaultersMainBtn">Copy Defaulters</button>
                </div>
                <div class="grid-3-col" style="margin: 8px 0;">
                  <div class="status-stat-tile">
                    <div class="stat-label">EXPECTED</div>
                    <div class="stat-value text-primary" id="defaulterStatExpected">0</div>
                  </div>
                  <div class="status-stat-tile">
                    <div class="stat-label">COMMENTED</div>
                    <div class="stat-value text-success" id="defaulterStatCommented">0</div>
                  </div>
                  <div class="status-stat-tile">
                    <div class="stat-label">DEFAULTERS</div>
                    <div class="stat-value text-danger" id="defaulterStatDefaulters">0</div>
                  </div>
                </div>
                <div id="defaulterSummaryText" style="font-size:11.5px; color:var(--text-2); margin-bottom:8px;"></div>
                <div id="defaulterChipsContainer" style="display:flex; flex-wrap:wrap; gap:6px;"></div>
                <div id="defaulterCopyBoxContainer" style="display:none; margin-top:8px;">
                  <textarea id="defaulterCopyBox" class="ext-textarea" style="height:60px;" readonly></textarea>
                  <button type="button" class="secondary-btn mini-btn" id="copyDefaultersBtn" style="margin-top:6px; width:100%;">Copy All</button>
                </div>
              </div>

              ${makeStickyActionBar({
                runId: 'startDefaulterAuditBtn',
                stopId: 'stopDefaulterAuditBtn',
                runLabel: 'Audit Post'
              })}
            </div>

            <!-- 9. Reciprocate -->
            <div class="agent-panel-content" id="panel-agent-reciprocator" style="display:none;">
              ${makeCostNoticeCard('reciprocator')}
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Tweet Link</span>
                  <button type="button" class="current-tab-chip" data-target="reciprocatorPostUrl">Current Tab</button>
                </div>
                <input type="url" id="reciprocatorPostUrl" name="reciprocatorPostUrlInput" class="ext-input" placeholder="https://x.com/username/status/...">
                <input type="hidden" id="reciprocatorPostUrlInput">
              </div>

              <div class="surface-card">
                <div class="grid-2-col">
                  <div>
                    <span class="field-label">Commenters Limit</span>
                    <select id="reciprocatorMaxCommentersSelect" class="ext-select">
                      <option value="10">10 Commenters</option>
                      <option value="25" selected>25 Commenters</option>
                      <option value="50">50 Commenters</option>
                      <option value="all">All Comments (∞)</option>
                    </select>
                  </div>
                  <div>
                    <span class="field-label">Posts / Profile</span>
                    <select id="reciprocatorPostsPerUserSelect" class="ext-select">
                      <option value="random" selected>Random (1-2 Posts)</option>
                      <option value="1">1 Post</option>
                      <option value="2">2 Posts</option>
                      <option value="3">3 Posts</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="surface-card">
                <span class="field-label">Actions to Execute</span>
                ${makeActionChips('reciprocator')}
              </div>

              ${makeStatusCard({
                cardId: 'reciprocatorProgressCard',
                liveDotId: 'reciprocatorLiveDot',
                badgeId: 'reciprocatorStateBadge',
                queueId: 'reciprocatorQueueIndicator',
                barId: 'reciprocatorProgressBar',
                stats: [
                  { label: 'DONE', id: 'reciprocatorCountDone', color: 'text-primary' },
                  { label: 'QUEUE', id: 'reciprocatorCountQueue', color: 'text-success' },
                  { label: 'SKIPPED', id: 'reciprocatorCountSkipped', color: 'text-warning' }
                ],
                statusTextId: 'reciprocatorLiveStatusText',
                countdownId: 'reciprocatorCountdownText'
              })}
              <input type="hidden" id="reciprocatorMaxCount" value="25">
              <input type="hidden" id="reciprocatorPostsPerProfileSelect" value="random">

              ${makeStickyActionBar({
                runId: 'runReciprocatorBtn',
                resetId: 'resetReciprocatorQueueBtn',
                pauseId: 'pauseReciprocatorBtn',
                skipId: 'skipReciprocatorBtn',
                stopId: 'stopReciprocatorBtn',
                runLabel: 'Launch Reciprocate'
              })}
            </div>

            <!-- 10. Home Feed -->
            <div class="agent-panel-content" id="panel-agent-feedengager" style="display:none;">
              ${makeCostNoticeCard('feedengager')}
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Target Posts</span>
                  <span class="status-pill-badge">Ad Skip On</span>
                </div>
                <input type="number" id="feedTargetCountInput" class="ext-input" value="15" min="1" max="100">
                ${makePresetRow('feedTargetCountInput', [5, 10, 15, 25, 50, 100], 15)}
              </div>

              <div class="surface-card">
                <span class="field-label">Actions to Execute</span>
                ${makeActionChips('feed')}
              </div>

              ${makeStatusCard({
                cardId: 'feedEngagerProgressCard',
                liveDotId: 'feedEngagerLiveDot',
                badgeId: 'feedEngagerStateBadge',
                queueId: 'feedEngagerQueueIndicator',
                barId: 'feedEngagerProgressBar',
                stats: [
                  { label: 'DONE', id: 'feedEngagerCountDone', color: 'text-primary' },
                  { label: 'TARGET', id: 'feedEngagerCountQueue', color: 'text-success' },
                  { label: 'SKIPPED', id: 'feedEngagerCountSkipped', color: 'text-warning' }
                ],
                statusTextId: 'feedEngagerLiveStatusText',
                countdownId: 'feedEngagerCountdownText'
              })}
              <span id="feedEngagerDoneCount" style="display:none;"></span>
              <span id="feedEngagerTargetTotal" style="display:none;"></span>
              <span id="feedEngagerSkippedCount" style="display:none;"></span>
              <span id="feedEngagerStatusText" style="display:none;"></span>

              ${makeStickyActionBar({
                runId: 'runFeedEngagerBtn',
                resetId: 'resetFeedEngagerBtn',
                pauseId: 'pauseFeedEngagerBtn',
                skipId: 'skipFeedEngagerBtn',
                stopId: 'stopFeedEngagerBtn',
                runLabel: 'Engage Home Feed'
              })}
            </div>

            <!-- 11. Niche Search -->
            <div class="agent-panel-content" id="panel-agent-nicheengager" style="display:none;">
              ${makeCostNoticeCard('nicheengager')}
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Niche Keyword</span>
                  <span class="status-pill-badge">Anti-Spam On</span>
                </div>
                <input type="text" id="nicheKeywordInput" name="nicheQueryInput" class="ext-input" placeholder="e.g. AI agents, web3, crypto">
                <input type="hidden" id="nicheQueryInput">
              </div>

              <div class="surface-card">
                <div class="grid-2-col">
                  <div>
                    <span class="field-label">Feed Filter</span>
                    <select id="nicheFeedFilterSelect" name="nicheTabModeSelect" class="ext-select">
                      <option value="live" selected>Latest / Live</option>
                      <option value="top">Top Posts</option>
                    </select>
                    <select id="nicheTabModeSelect" style="display:none;">
                      <option value="live" selected>Latest / Live</option>
                      <option value="top">Top Posts</option>
                    </select>
                  </div>
                  <div>
                    <span class="field-label">Posts to Engage</span>
                    <input type="number" id="nicheTargetCountInput" class="ext-input" value="15" min="1" max="100">
                  </div>
                </div>
                <div style="margin-top:6px;">
                  ${makePresetRow('nicheTargetCountInput', [5, 10, 15, 25, 50, 100], 15)}
                </div>
              </div>

              <div class="surface-card">
                <span class="field-label">Actions to Execute</span>
                ${makeActionChips('niche')}
              </div>

              ${makeStatusCard({
                cardId: 'nicheEngagerProgressCard',
                liveDotId: 'nicheEngagerLiveDot',
                badgeId: 'nicheEngagerStateBadge',
                queueId: 'nicheEngagerQueueIndicator',
                barId: 'nicheEngagerProgressBar',
                stats: [
                  { label: 'DONE', id: 'nicheEngagerCountDone', color: 'text-primary' },
                  { label: 'TARGET', id: 'nicheEngagerCountQueue', color: 'text-success' },
                  { label: 'SKIPPED', id: 'nicheEngagerCountSkipped', color: 'text-warning' }
                ],
                statusTextId: 'nicheEngagerLiveStatusText',
                countdownId: 'nicheEngagerCountdownText'
              })}

              ${makeStickyActionBar({
                runId: 'runNicheEngagerBtn',
                resetId: 'resetNicheEngagerBtn',
                pauseId: 'pauseNicheEngagerBtn',
                skipId: 'skipNicheEngagerBtn',
                stopId: 'stopNicheEngagerBtn',
                runLabel: 'Launch Niche Search'
              })}
            </div>

            <!-- 12. TG Liker (Raid & Repost) -->
            <div class="agent-panel-content" id="panel-agent-tgliker" style="display:none;">
              ${makeCostNoticeCard('tgliker')}

              <!-- Alt ID & Account Lock Exemption Callout -->
              <div class="surface-card" style="background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.22); padding:10px 14px; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:6px; font-size:11.5px; font-weight:700; color:#10B981; margin-bottom:4px;">
                  <span>⚡</span>
                  <span>Account Lock Exemption (Alt ID Recommended)</span>
                </div>
                <div style="font-size:11px; color:#94A3B8; line-height:1.45;">
                  TG Liker is exempt from Account Lock and can run on <strong>ANY Twitter/X ID</strong>. For mass raids, using an <strong>Alt / Burner account</strong> is highly recommended!
                </div>
              </div>

              <!-- 1. Target Profile URL / @handle / Tweet URL -->
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Target Profile URL / @handle / Tweet URL</span>
                  <button type="button" class="current-tab-chip" data-target="tgLikerTargetInput">Current Tab</button>
                </div>
                <textarea id="tgLikerTargetInput" class="ext-textarea" rows="2" placeholder="https://x.com/username or @username&#10;(Leave empty to use active X tab)"></textarea>
                <div style="font-size:10.5px; color:#94A3B8; margin-top:4px;">
                  Leave blank to raid whatever profile or tweet is currently open in your active X tab.
                </div>
              </div>

              <!-- 2. Target Section (Matches Screenshot 3) -->
              <div class="surface-card">
                <span class="field-label" style="margin-bottom:6px; display:block;">Target Section</span>
                <select id="tgLikerSectionSelect" class="ext-select">
                  <option value="auto" selected>Auto — Profile ➔ /reposts page, Tweet ➔ Quotes</option>
                  <option value="profile_reposts">Profile: /reposts page (All posts reposted by creator)</option>
                  <option value="profile_all">Profile: Main timeline</option>
                  <option value="quotes">Tweet: Quotes</option>
                  <option value="replies">Tweet: Replies</option>
                </select>
              </div>

              <!-- 3. ACTIONS ON EACH POST: -->
              <div class="surface-card">
                <span class="field-label" style="margin-bottom:8px; display:block;">ACTIONS ON EACH POST:</span>
                <div class="action-chips-wrap" style="display:flex; gap:8px;">
                  <label class="action-chip active" style="flex:1;">
                    <input type="checkbox" id="tgLikerOptLike" class="action-chip-input" checked>
                    <span>❤️ Like</span>
                  </label>
                  <label class="action-chip" style="flex:1;">
                    <input type="checkbox" id="tgLikerOptRepost" class="action-chip-input">
                    <span>🔄 Repost</span>
                  </label>
                  <label class="action-chip" style="flex:1;">
                    <input type="checkbox" id="tgLikerOptBookmark" class="action-chip-input">
                    <span>🔖 Bookmark</span>
                  </label>
                  <input type="checkbox" id="tgLikerOptFollow" style="display:none;">
                  <input type="checkbox" id="tgLikerOptComment" style="display:none;">
                </div>
              </div>

              <!-- 4. Execution Speed (per post) (Matches Screenshot 4) -->
              <div class="surface-card">
                <span class="field-label" style="margin-bottom:6px; display:block;">Execution Speed (per post)</span>
                <select id="tgLikerSpeedSelect" class="ext-select">
                  <option value="3500" selected>⚡ Fast / Balanced — 3.5s</option>
                  <option value="4500">🖱️ Human Normal — 4.5s</option>
                  <option value="6000">🖱️ Safe &amp; Natural — 6s</option>
                  <option value="8000">🛡️ High Safety — 8s</option>
                  <option value="10000">🛡️ Maximum Safety — 10s</option>
                </select>
              </div>

              <!-- 5. Max Posts to Process -->
              <div class="surface-card">
                <div class="field-header">
                  <span class="field-label">Max Posts to Process</span>
                  <span style="font-size:10.5px; color:#94A3B8;">(0 = Unlimited until stopped)</span>
                </div>
                <input type="number" id="tgLikerTargetCountInput" class="ext-input" value="20" min="0">
                <div style="margin-top:8px;">
                  ${makePresetRow('tgLikerTargetCountInput', [10, 20, 30, 50, 100, 0], 20)}
                </div>
              </div>

              <!-- 6. 📍 Stop at post -->
              <div class="surface-card">
                <div class="field-header">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span>📍</span>
                    <span class="field-label" style="margin:0;">Stop at post</span>
                  </div>
                  <button type="button" class="mini-btn" id="tgLikerBtnPickStop" style="background:#0e7490; color:#fff; font-weight:700; padding:4px 12px; border-radius:6px; font-size:11px; cursor:pointer; border:none;">Pick</button>
                </div>
                <input type="text" id="tgLikerStopText" class="ext-input" placeholder="@username + post text, or tweet link" style="margin-top:6px;">
                <input type="hidden" id="tgLikerStopPick" value="">
                <div id="tgLikerStopInfo" style="font-size:10.5px; color:#94A3B8; margin-top:5px; line-height:1.4;">
                  Click Pick -> then click target tweet on the X page. Or manually type: part of the @username or tweet text. Auto-stops when this post is reached. Leave empty for no stop point.
                </div>
              </div>

              <!-- 7. Continuous Feed Loop -->
              <div class="surface-card">
                <div class="switch-row" style="margin:0;">
                  <div>
                    <div class="switch-label" style="font-size:12px; font-weight:700; color:#fff;">Continuous Feed Loop</div>
                    <div class="switch-sub" style="font-size:10.5px; color:#94A3B8; margin-top:2px;">Refresh feed automatically when end of page is reached to catch new incoming posts</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" id="tgLikerContinuousLoop" checked>
                    <span class="slider-round"></span>
                  </label>
                </div>
              </div>

              <!-- 8. 🌰 Smart Break Engine -->
              <div class="surface-card">
                <div class="field-header" style="margin-bottom:8px;">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span>🌰</span>
                    <span class="field-label" style="margin:0;">Smart Break Engine</span>
                  </div>
                  <label class="ext-checkbox-label" style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                    <input type="checkbox" id="tgLikerBreakOn" checked style="accent-color:var(--primary); width:14px; height:14px;">
                    <span style="font-size:11px; font-weight:700; color:#60A5FA;">Short Break On</span>
                  </label>
                </div>

                <div class="grid-2-col" style="gap:8px; margin-bottom:8px;">
                  <div>
                    <span class="field-label" style="font-size:10.5px; margin-bottom:3px; display:block;">Every (posts)</span>
                    <div style="display:flex; align-items:center; gap:4px;">
                      <input type="number" id="tgLikerEvMin" class="ext-input" value="25" min="1" style="text-align:center;">
                      <span style="color:#94A3B8; font-size:11px;">–</span>
                      <input type="number" id="tgLikerEvMax" class="ext-input" value="40" min="1" style="text-align:center;">
                    </div>
                  </div>
                  <div>
                    <span class="field-label" style="font-size:10.5px; margin-bottom:3px; display:block;">Take Break (sec)</span>
                    <div style="display:flex; align-items:center; gap:4px;">
                      <input type="number" id="tgLikerBsMin" class="ext-input" value="45" min="1" style="text-align:center;">
                      <span style="color:#94A3B8; font-size:11px;">–</span>
                      <input type="number" id="tgLikerBsMax" class="ext-input" value="120" min="1" style="text-align:center;">
                    </div>
                  </div>
                </div>

                <div style="border-top:1px solid rgba(255,255,255,0.06); padding-top:8px; margin-top:8px;">
                  <label class="ext-checkbox-label" style="display:flex; align-items:center; gap:6px; cursor:pointer; margin-bottom:6px;">
                    <input type="checkbox" id="tgLikerLbOn" checked style="accent-color:#F59E0B; width:14px; height:14px;">
                    <span style="font-size:11px; font-weight:700; color:#FBBF24;">🔴 Long Break</span>
                  </label>
                  
                  <div class="grid-2-col" style="gap:8px; margin-bottom:8px;">
                    <div>
                      <span class="field-label" style="font-size:10.5px; margin-bottom:3px; display:block;">Every (posts)</span>
                      <div style="display:flex; align-items:center; gap:4px;">
                        <input type="number" id="tgLikerLbEvMin" class="ext-input" value="100" min="1" style="text-align:center;">
                        <span style="color:#94A3B8; font-size:11px;">–</span>
                        <input type="number" id="tgLikerLbEvMax" class="ext-input" value="150" min="1" style="text-align:center;">
                      </div>
                    </div>
                    <div>
                      <span class="field-label" style="font-size:10.5px; margin-bottom:3px; display:block;">Take Break (min)</span>
                      <div style="display:flex; align-items:center; gap:4px;">
                        <input type="number" id="tgLikerLbMinMin" class="ext-input" value="5" min="1" style="text-align:center;">
                        <span style="color:#94A3B8; font-size:11px;">–</span>
                        <input type="number" id="tgLikerLbMinMax" class="ext-input" value="10" min="1" style="text-align:center;">
                      </div>
                    </div>
                  </div>
                </div>

                <div style="display:flex; align-items:center; gap:8px; border-top:1px solid rgba(255,255,255,0.06); padding-top:8px; margin-top:8px;">
                  <span style="font-size:11px; color:#94A3B8;">⌛ Hourly limit</span>
                  <input type="number" id="tgLikerHourly" class="ext-input" value="0" min="0" style="width:60px; text-align:center; padding:4px 6px;">
                  <span style="font-size:10.5px; color:#64748B;">posts/hr (0 = off)</span>
                </div>
              </div>

              <!-- 9. 🎥 Scroll Recorder (Independent) -->
              <div class="surface-card recorder-card" style="border: 1px solid rgba(244, 63, 94, 0.25); background: rgba(244, 63, 94, 0.04);">
                <div class="field-header">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span style="color:#F43F5E;">🎥</span>
                    <span class="field-label" style="margin:0; color:#FDA4AF;">Scroll Recorder</span>
                    <span style="font-size:10.5px; color:#94A3B8;">(Independent from like job)</span>
                  </div>
                </div>
                <div style="font-size:10.5px; color:#94A3B8; margin-top:4px; line-height:1.4;">
                  Smoothly scrolls upward from your current position on the active X tab. Auto-stops and saves when reaching top of timeline.
                </div>

                <div class="grid-2-col" style="gap:8px; margin-top:8px;">
                  <div>
                    <span class="field-label" style="font-size:10.5px; margin-bottom:4px; display:block;">Capture source:</span>
                    <select id="tgLikerRecSource" class="ext-select">
                      <option value="auto" selected>Auto — current X tab (no picker needed)</option>
                      <option value="ask">Ask — Chrome screen picker (choose tab/window)</option>
                    </select>
                  </div>
                  <div>
                    <span class="field-label" style="font-size:10.5px; margin-bottom:4px; display:block;">Scroll pace:</span>
                    <select id="tgLikerRecPace" class="ext-select">
                      <option value="slow">Slow (~0.5 screen/s)</option>
                      <option value="normal" selected>Normal (~1 screen/s)</option>
                      <option value="fast">Fast (~1.6 screen/s)</option>
                      <option value="faster">Faster (~3 screen/s)</option>
                      <option value="turbo">Turbo (~5 screen/s)</option>
                      <option value="insane">Insane (~9 screen/s)</option>
                    </select>
                  </div>
                </div>

                <div style="margin-top:8px;">
                  <span class="field-label" style="font-size:10.5px; margin-bottom:4px; display:block;">Save folder:</span>
                  <input type="text" id="tgLikerRecFolder" value="TG-LIKER" class="ext-input" placeholder="TG-LIKER">
                  <div style="font-size:10.5px; color:#94A3B8; margin-top:3px; line-height:1.35;">
                    Auto-saves to this folder in Downloads without prompt dialog. Filename: username + timestamp.
                  </div>
                </div>

                <div style="margin-top:10px;">
                  <button type="button" class="danger-btn" id="tgLikerBtnRecStart" style="background:#be123c !important; color:#fff !important; width:100%; font-weight:700; padding:10px;">
                    🔴 Record + Scroll Up
                  </button>
                  <button type="button" class="danger-btn" id="tgLikerBtnRecStop" style="display:none !important; width:100%; font-weight:700; padding:10px;">
                    ⏹ Stop &amp; Save
                  </button>
                </div>
                <div id="tgLikerRecStatus" style="font-size:10.5px; color:#F43F5E; margin-top:6px; text-align:center;">
                  Clicking will record the current X tab directly. If unavailable, screen picker will appear.
                </div>
              </div>

              <!-- TG Liker Status Card -->
              ${makeStatusCard({
                cardId: 'tgLikerProgressCard',
                liveDotId: 'tgLikerLiveDot',
                badgeId: 'tgLikerStateBadge',
                queueId: 'tgLikerQueueIndicator',
                barId: 'tgLikerProgressBar',
                stats: [
                  { label: 'LIKED', id: 'tgLikerCountLiked', color: 'text-primary' },
                  { label: 'REPOSTED', id: 'tgLikerCountReposted', color: 'text-success' },
                  { label: 'SAVED', id: 'tgLikerCountBookmarked', color: 'text-primary' },
                  { label: 'SKIPPED', id: 'tgLikerCountSkipped', color: 'text-warning' }
                ],
                statusTextId: 'tgLikerLiveStatusText',
                countdownId: 'tgLikerCountdownText'
              })}

              <!-- Hidden Aliases / Helpers for Continue / Queue -->
              <div id="tgLikerContinueBox" style="display:none;"></div>
              <span id="tgCollectedCount" style="display:none;"></span>
              <div id="tgLikerStatusText" style="display:none;"></div>

              ${makeStickyActionBar({
                runId: 'runTgLikerBtn',
                resetId: 'resetTgLikerBtn',
                pauseId: 'pauseTgLikerBtn',
                skipId: 'skipTgLikerBtn',
                stopId: 'stopTgLikerBtn',
                runLabel: 'Launch Liker'
              })}
            </div>

          </div>
        </div>
      </section>

      <!-- ============================================== -->
      <!-- TAB 2: AI VOICE -->
      <!-- ============================================== -->
      <section id="panel-reply" class="tab-panel">
        <div class="tab-header-row">
          <div>
            <div class="voice-section-title">AI Voice</div>
            <div class="voice-section-subtitle">Applies to all agents uniformly</div>
          </div>
          <button type="button" id="openCustomToneBtn" class="link-btn">+ Custom Style</button>
        </div>

        <!-- Tone Chips Grid (2 Columns) -->
        <div class="surface-card">
          <div class="tone-pills" id="tonePills"></div>
        </div>

        <!-- Custom Tone Drawer / Form -->
        <div id="customToneDrawer" style="display:none;" class="surface-card">
          <div class="drawer-inner-header">
            <span class="field-label">Create Custom Style</span>
            <button type="button" id="closeCustomToneBtn" class="clean-btn">✕</button>
          </div>
          <input type="text" id="customToneNameInput" class="ext-input" placeholder="Tone Name (e.g. Degen Alpha, Founder)">
          <textarea id="customTonePromptInput" class="ext-textarea" style="margin-top:6px;" placeholder="Custom reply prompt instructions..."></textarea>
          <div class="custom-tone-footer" style="margin-top:8px;">
            <span id="customLimitStatus" class="sub-badge">0 / 2 custom used</span>
            <button type="button" id="saveCustomToneBtn" class="primary-btn mini-btn">Save Style</button>
          </div>
        </div>

        <!-- Hidden indicators for JS engine compatibility -->
        <div style="display:none;">
          <span id="globalActiveToneBadge">CT Human Reply</span>
          <textarea id="globalActiveTonePromptArea"></textarea>
        </div>

        <!-- Footer Note Card with Shield Icon -->
        <div class="safety-note-card">
          <div class="safety-note-icon">${ICONS.shield}</div>
          <div class="safety-note-text">Never posts generic fallback replies. On API failure it skips safely.</div>
        </div>
      </section>

      <!-- ============================================== -->
      <!-- TAB 3: SAFETY CONTROLS -->
      <!-- ============================================== -->
      <section id="panel-safety" class="tab-panel">
        <div>
          <div class="voice-section-title">Safety Controls</div>
          <div class="voice-section-subtitle">Anti-ban pacing protects your Twitter account</div>
        </div>

        <!-- Execution Mode -->
        <div class="surface-card">
          <div class="slider-card-header">
            <div class="slider-label-left">
              <span class="slider-title">Execution Mode</span>
              ${makeInfoBtn('Advanced Debugger Mode connects directly to Chrome DevTools Protocol (CDP) for low-level humanized input dispatch.')}
            </div>
            <span id="extExecStrategyBadge" class="safety-live-val">Virtual Cursor</span>
          </div>
          <select id="extExecutionStrategySelect" class="ext-select" style="margin-top:6px;">
            <option value="dom" selected>Standard DOM Mode (Virtual Cursor)</option>
            <option value="debugger">Advanced Debugger Mode</option>
          </select>
          <div id="extExecStrategyDesc" style="display:none;"></div>
        </div>

        <!-- 1. Reply Delay (Dual Range) -->
        <div class="surface-card slider-card">
          <div class="slider-card-header">
            <span class="slider-title">Reply Delay</span>
            <span id="valExtReplyDelay" class="safety-live-val">3 - 6 sec</span>
          </div>
          <div class="dual-range-wrap">
            <div class="dual-range-track"></div>
            <div class="dual-range-highlight" id="highlightReplyDelay"></div>
            <input type="range" min="0" max="60" value="3" id="extReplyDelayMin" class="dual-range-input">
            <input type="range" min="0" max="60" value="6" id="extReplyDelayMax" class="dual-range-input">
          </div>
        </div>

        <!-- 2. Profile Wait (Dual Range) -->
        <div class="surface-card slider-card">
          <div class="slider-card-header">
            <span class="slider-title">Profile Wait</span>
            <span id="valExtProfileWait" class="safety-live-val">10 - 20 sec</span>
          </div>
          <div class="dual-range-wrap">
            <div class="dual-range-track"></div>
            <div class="dual-range-highlight" id="highlightProfileWait"></div>
            <input type="range" min="0" max="120" value="10" id="extProfileWaitMin" class="dual-range-input">
            <input type="range" min="0" max="120" value="20" id="extProfileWaitMax" class="dual-range-input">
          </div>
        </div>

        <!-- 3. Take Break After (Dual Range) -->
        <div class="surface-card slider-card">
          <div class="slider-card-header">
            <span class="slider-title">Take Break After</span>
            <span id="valExtBreakActions" class="safety-live-val">10 - 15 actions</span>
          </div>
          <div class="dual-range-wrap">
            <div class="dual-range-track"></div>
            <div class="dual-range-highlight" id="highlightBreakActions"></div>
            <input type="range" min="0" max="50" value="10" id="extBreakActionsMin" class="dual-range-input">
            <input type="range" min="0" max="50" value="15" id="extBreakActionsMax" class="dual-range-input">
          </div>
        </div>

        <!-- 4. Batch Rest Duration (Dual Range) -->
        <div class="surface-card slider-card">
          <div class="slider-card-header">
            <span class="slider-title">Batch Rest Duration</span>
            <span id="valExtRestDuration" class="safety-live-val">1 - 3 min</span>
          </div>
          <div class="dual-range-wrap">
            <div class="dual-range-track"></div>
            <div class="dual-range-highlight" id="highlightRestDuration"></div>
            <input type="range" min="0" max="15" value="1" id="extRestDurationMin" class="dual-range-input">
            <input type="range" min="0" max="15" value="3" id="extRestDurationMax" class="dual-range-input">
          </div>
        </div>

        <!-- 5. Cursor Movement Speed (Single Range) -->
        <div class="surface-card slider-card">
          <div class="slider-card-header">
            <span class="slider-title">Cursor Speed</span>
            <span id="valExtCursorSpeed" class="safety-live-val">450 ms</span>
          </div>
          <input type="range" min="0" max="1500" step="50" value="450" id="extCursorSpeedSlider" class="single-range-input">
        </div>

        <!-- 6. Comment Typing Delay (Single Range) -->
        <div class="surface-card slider-card">
          <div class="slider-card-header">
            <span class="slider-title">Typing Delay</span>
            <span id="valExtTypingDelay" class="safety-live-val">110 ms/char</span>
          </div>
          <input type="range" min="0" max="250" step="10" value="110" id="extTypingDelaySlider" class="single-range-input">
        </div>

        <!-- Background Mode Toggle -->
        <div class="surface-card switch-row">
          <div>
            <div class="switch-label">Background Mode</div>
            <div class="switch-sub">Keep active while tab is unfocused</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="extBackgroundToggle" checked>
            <span class="slider-round"></span>
          </label>
        </div>
      </section>

      <!-- ============================================== -->
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
              ${makeInfoBtn('Step-by-step credit purchase with instant admin approval')}
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
              <div class="buy-step-header-row">
                <div class="buy-step-title-row">
                  <span class="step-num-badge">2</span>
                  <span class="buy-step-title">Select Payment Method</span>
                </div>
                <button type="button" class="step-cancel-pill-btn" id="extCancelStep2Btn" title="Back to Step 1">✕ Cancel</button>
              </div>
              <div class="payment-methods-grid" id="extPaymentMethodsGrid">
                <!-- Dynamically populated: bKash & Nagad for BDT; Binance Pay & Crypto for others -->
              </div>
            </div>

            <!-- Step 3: Complete Payment & Submit Proof (COLLAPSED INITIALLY) -->
            <div class="buy-step-wrap progressive-step" id="buyStep3" style="display:none;">
              <div class="buy-step-header-row">
                <div class="buy-step-title-row">
                  <span class="step-num-badge">3</span>
                  <span class="buy-step-title">Payment Details &amp; Proof</span>
                </div>
                <button type="button" class="step-cancel-pill-btn" id="extCancelStep3Btn" title="Back to Step 2">✕ Cancel</button>
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
            <div class="subview-header-left">
              <button type="button" class="subview-nav-btn" id="extBackFromHistoryBtn">← Back</button>
            </div>
            <div class="subview-title">Order History</div>
            <div class="subview-header-right">
              <button type="button" class="subview-nav-btn" id="extRefreshOrderHistoryBtn">↻ Refresh</button>
            </div>
          </div>

          <div class="surface-card order-history-page-card">
            <div class="order-history-list" id="extOrderHistoryList">
              <div class="order-history-empty" style="text-align:center; padding:24px 12px; color:var(--text-muted); font-size:12px;">
                No orders submitted yet.
              </div>
            </div>
          </div>
        </div>

      </section>

      <!-- ============================================== -->
      <!-- TAB 5: ACCOUNT -->
      <!-- ============================================== -->
      <section id="panel-access" class="tab-panel">
        <div class="voice-section-title">Account</div>

        <!-- Logged In Card -->
        <div id="extLoggedInCard" style="display:none; flex-direction:column; gap:8px;">
          <!-- User Profile Card -->
          <div class="surface-card profile-card">
            <div class="account-avatar-box">
              <div class="account-avatar-circle">
                ${ICONS.account}
              </div>
            </div>
            <div class="account-user-details">
              <div class="account-handle-title" id="extHandleText">@user</div>
              <div class="account-meta-sub">
                <span class="live-dot" style="margin-right:2px;"></span>
                <span id="extAccountStatus">Locked</span>
                <span style="margin: 0 4px;">•</span>
                <span id="extLoggedInName">Member</span>
              </div>
              <div class="account-badges-row">
                <span id="extLoggedInPlan" class="badge-mini growth">GROWTH</span>
                <span id="extLoggedInCredits" class="credits-count-badge">-- Credits</span>
              </div>
            </div>
          </div>

          
          <!-- Referral Program Card (Moved to Account Tab) -->
          <div class="surface-card" style="margin-top:6px;">
            <div class="field-header">
              <span class="field-label">Referral Program</span>
              ${makeInfoBtn('150 + 150 credits on successful referral activation')}
            </div>
            <div class="referral-input-row">
              <input type="text" readonly value="https://twixorhq.vercel.app/ref/user" id="extInviteLinkInput" class="ext-input">
              <button type="button" class="copy-pill-btn" id="extCopyInviteLinkBtn">Copy</button>
            </div>
            <div class="referral-stats-grid">
              <div class="ref-stat-box">Total: <strong id="extRefTotalCount">0</strong></div>
              <div class="ref-stat-box text-success">Approved: <strong id="extRefApprovedCount">0</strong></div>
              <div class="ref-stat-box text-warning">Pending: <strong id="extRefPendingCount">0</strong></div>
              <div class="ref-stat-box text-primary">Earned: <strong id="extRefEarnedCredits">0 C</strong></div>
            </div>
          </div>

          <!-- 4 List Rows -->
          <div class="surface-card list-rows-card">
            <button type="button" class="account-list-row" id="extSyncAccountBtn">
              <span class="list-row-left">
                <span class="list-row-icon">${ICONS.sync}</span>
                <span class="list-row-label">Sync Details</span>
              </span>
              <span class="list-row-chevron">${ICONS.chevronRight}</span>
            </button>

            <button type="button" class="account-list-row danger" id="extLogoutBtn">
              <span class="list-row-left">
                <span class="list-row-icon">${ICONS.logout}</span>
                <span class="list-row-label">Log Out</span>
              </span>
              <span class="list-row-chevron">${ICONS.chevronRight}</span>
            </button>

            <button type="button" class="account-list-row" id="extForceResetBtn">
              <span class="list-row-left">
                <span class="list-row-icon">${ICONS.trash}</span>
                <span class="list-row-label">Clear Extension Cache</span>
              </span>
              <span class="list-row-chevron">${ICONS.chevronRight}</span>
            </button>

            <div class="account-accordion-row">
              <div class="accordion-trigger-row" id="extToggleChangePasswordBox">
                <span class="list-row-left">
                  <span class="list-row-icon">${ICONS.key}</span>
                  <span class="list-row-label">Change Password</span>
                </span>
                <span id="extChangePasswordArrow" class="list-row-chevron">▼</span>
              </div>
              <div id="extChangePasswordForm" style="display:none;" class="change-password-box">
                <input type="password" id="extLoggedInCurrentPassInput" class="ext-input" placeholder="Current password">
                <input type="password" id="extLoggedInNewPassInput" class="ext-input" style="margin-top:6px;" placeholder="New password (min 6 chars)">
                <input type="password" id="extLoggedInConfirmPassInput" class="ext-input" style="margin-top:6px;" placeholder="Confirm new password">
                <button type="button" class="primary-btn mini-btn" id="extLoggedInSubmitChangePassBtn" style="margin-top:8px; width:100%;">
                  Save Password
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Auth Navigation & Views (For unauthenticated extension states) -->
        ${extAuthTabBar || ''}
        ${extRequestAccessView || ''}
        ${extCheckStatusLookupView || ''}
        ${extPendingApprovalView || ''}
        ${extRejectedView || ''}
        ${extSetPasswordView || ''}
        ${extLoggedOutCard || ''}
        ${extResetPasswordView || ''}
        ${extSuspendedView || ''}
      </section>

    </main>

    <!-- Floating Bottom Navigation Bar (Fixed Dock) -->
    <nav class="ext-bottom-nav" id="extTabsNav">
      <button class="tab-btn active" data-tab="agents" title="Home">
        ${ICONS.home}
        <span>Home</span>
      </button>

      <button class="tab-btn" data-tab="reply" title="AI Voice">
        ${ICONS.voice}
        <span>AI Voice</span>
      </button>

      <button class="tab-btn tab-safety-center" data-tab="safety" title="Safety Controls">
        <div class="tab-safety-shield-circle">
          ${ICONS.shield}
        </div>
        <span>Safety</span>
      </button>

      <button class="tab-btn" data-tab="credits" title="Credits">
        ${ICONS.credits}
        <span>Credits</span>
      </button>

      <button class="tab-btn" data-tab="access" title="Account">
        ${ICONS.account}
        <span>Account</span>
      </button>
    </nav>

    <!-- Info Popover Floating Modal -->
    <div id="extInfoPopover" class="info-popover-box" style="display:none;">
      <div class="info-popover-content" id="extInfoPopoverText">Info text</div>
    </div>

    <!-- Notification Modal Overlay -->
    <div id="extNotificationOverlay" class="ext-modal-overlay" style="display:none;">
      <div class="ext-notify-card">
        <div class="ext-notify-header">
          <div class="ext-notify-icon-box" id="extNotifyIcon">✨</div>
          <div class="ext-notify-title" id="extNotifyTitle">Twixor Notification</div>
          <button type="button" class="ext-notify-close-btn" id="extNotifyCloseBtn">✕</button>
        </div>
        <div class="ext-notify-body" id="extNotifyBody"></div>
        <div class="ext-notify-footer" id="extNotifyFooter">
          <button type="button" class="secondary-btn mini-btn" id="extNotifyCancelBtn" style="display:none;">Cancel</button>
          <button type="button" class="ext-notify-ok-btn" id="extNotifyOkBtn">Got It</button>
        </div>
      </div>
    </div>

    <!-- Floating Quick Toast -->
    <div id="extToastBanner" class="ext-toast-banner">
      <span id="extToastIcon">✓</span>
      <span id="extToastText">Notification text</span>
    </div>

    <!-- Hidden Engine Compatibility Elements -->
    <div style="display:none;" id="extEngineCompatibilityFallbacks">
      <button type="button" id="resetTgLiveLikerBtn"></button>
      <button type="button" id="stopAgentBtn"></button>
      <button type="button" id="stopReplyAutomationBtn"></button>
      <button type="button" id="stopReplyConsoleBtn"></button>
      <button type="button" id="runTgAgentBtn"></button>
      <button type="button" id="pauseTgAgentBtn"></button>
      <button type="button" id="skipTgAgentBtn"></button>
      <button type="button" id="stopTgAgentBtn"></button>
      <button type="button" id="runAudienceBtn"></button>
      <button type="button" id="resetAudienceBtn"></button>
      <button type="button" id="pauseAudienceBtn"></button>
      <button type="button" id="skipAudienceBtn"></button>
      <button type="button" id="stopAudienceBtn"></button>
      <button type="button" id="runSorsaBtn"></button>
      <button type="button" id="resetSorsaBtn"></button>
      <button type="button" id="pauseSorsaBtn"></button>
      <button type="button" id="skipSorsaBtn"></button>
      <button type="button" id="stopSorsaBtn"></button>
      <button type="button" id="runFollowerBtn"></button>
      <button type="button" id="resetFollowerBtn"></button>
      <button type="button" id="pauseFollowerBtn"></button>
      <button type="button" id="skipFollowerBtn"></button>
      <button type="button" id="stopFollowerBtn"></button>
      <button type="button" id="runReplybackBtn"></button>
      <button type="button" id="resetReplybackBtn"></button>
      <button type="button" id="stopReplybackBtn"></button>
      <button type="button" id="runUnfollowBtn"></button>
      <button type="button" id="stopUnfollowBtn"></button>
      <button type="button" id="runCreatorBtn"></button>
      <button type="button" id="stopCreatorBtn"></button>
      <button type="button" id="runDefaulterBtn"></button>
      <button type="button" id="stopDefaulterBtn"></button>
    </div>

    <!-- TG Liker Launch Confirmation Modal -->
    <div id="tgLikerConfirmModal" class="tg-liker-modal-backdrop" style="display:none;">
      <div class="tg-liker-modal-card">
        <div class="tg-liker-modal-header">
          <div class="tg-liker-modal-icon-badge">⚡</div>
          <div class="tg-liker-modal-headings">
            <h3 class="tg-liker-modal-title">Launch TG Liker</h3>
            <span class="tg-liker-modal-subtitle">Mass Raid &amp; Repost Automation</span>
          </div>
          <button type="button" class="tg-liker-modal-close" id="tgLikerModalCloseIcon">&times;</button>
        </div>

        <div class="tg-liker-modal-content">
          <!-- Cost Breakdown Card -->
          <div class="tg-liker-modal-cost-box">
            <div class="cost-row-main">
              <span class="cost-lbl">Execution Cost:</span>
              <span class="cost-amt-pill">10 Credits</span>
            </div>
            <div class="cost-desc-text">
              Flat fee per launch. You can engage unlimited posts in this raid cycle.
            </div>
            <div class="cost-balance-check">
              <span>Your Current Balance:</span>
              <strong id="tgLikerModalBalance">0 Credits</strong>
            </div>
          </div>

          <!-- Important Alt ID Recommendation -->
          <div class="tg-liker-modal-notice-box">
            <div class="notice-box-header">
              <span class="notice-icon">⚠️</span>
              <strong>Recommended Account Setup:</strong>
            </div>
            <p class="notice-box-body">
              For mass Telegram raids, it is <strong>highly recommended to use an Alt / Burner X (Twitter) account</strong> to keep your main personal account clean.
            </p>
            <div class="notice-box-perk">
              <span class="perk-check">✓</span>
              <span><strong>Unlocked Access:</strong> TG Liker is exempt from Account Lock and will run on <em>ANY</em> active X (Twitter) account in your browser!</span>
            </div>
          </div>
        </div>

        <div class="tg-liker-modal-footer">
          <button type="button" id="tgLikerModalCancelBtn" class="ext-btn-secondary" style="flex:1;">Cancel</button>
          <button type="button" id="tgLikerModalConfirmBtn" class="ext-btn-primary" style="flex:1.5; background:linear-gradient(135deg, #EF4444 0%, #DC2626 100%);">
            Confirm &amp; Launch (10 C)
          </button>
        </div>
      </div>
    </div>

  </div>

  <script src="popup.js"></script>
</body>
</html>`;

fs.writeFileSync('chrome-extension/popup.html', htmlContent, 'utf8');
fs.writeFileSync('chrome-extension/sidepanel.html', htmlContent, 'utf8');
console.log('Successfully wrote redesigned popup.html and sidepanel.html');

// Validate IDs retained
const newIds = [...htmlContent.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
if (fs.existsSync('chrome-extension/scratch_all_original_ids.json')) {
  const origIds = JSON.parse(fs.readFileSync('chrome-extension/scratch_all_original_ids.json', 'utf8'));
  const missingIds = origIds.filter(id => !newIds.includes(id));
  console.log('Original ID count:', origIds.length);
  console.log('New ID count:', newIds.length);
  console.log('Missing ID count:', missingIds.length);
} else {
  console.log('Total IDs in generated markup:', newIds.length);
}
