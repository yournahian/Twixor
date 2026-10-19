const fs = require('fs');

// 1. Build Comprehensive Unified CSS
const completeCss = `/* ==============================================================
   TWIXOR — FINTECH DESIGN SYSTEM (MANIFEST V3 SIDE PANEL & POPUP)
   Strictly Vanilla CSS — Light & Dark Theme via CSS Variables
   ============================================================== */

:root,
[data-theme="light"],
body.light {
  /* LIGHT THEME DESIGN TOKENS */
  --bg: #EAF4FF;
  --surface: #FFFFFF;
  --surface-2: #F3F8FF;
  --border: #DCE8F7;
  --input: #F3F8FF;
  --text: #0B1B3A;
  --text-2: #5B6B8A;
  --primary: #1E6FD9;
  --primary-2: #0F4BB0;
  --accent-orange: #FF7A1A;
  --success: #16A34A;
  --danger: #E5484D;
  --shadow: 0 6px 20px rgba(30, 111, 217, 0.12);
  --header-grad: linear-gradient(160deg, #1E6FD9, #0F4BB0);
  
  /* Radii */
  --radius-card: 24px;
  --radius-chip: 16px;
  --radius-input: 16px;
  --radius-pill: 999px;
  --radius-full: 999px;
  
  /* Typography */
  --font-sans: "Inter", "Poppins", system-ui, -apple-system, "Segoe UI", sans-serif;
  
  /* Legacy alias mappings */
  --bg-canvas: var(--bg);
  --bg-card: var(--surface);
  --bg-card-hover: var(--surface-2);
  --border-subtle: var(--border);
  --border-card: var(--border);
  --text-primary: var(--text);
  --text-secondary: var(--text-2);
  --text-muted: var(--text-2);
  --blue-primary: var(--primary);
  --blue-vibrant: var(--primary);
}

[data-theme="dark"],
body.dark {
  /* DARK THEME DESIGN TOKENS (Neutral graphite, high contrast cards) */
  --bg: #0B0D12;
  --surface: #151922;
  --surface-2: #1E2330;
  --border: #2D3748;
  --input: #0F1218;
  --text: #FFFFFF;
  --text-2: #94A3B8;
  --primary: #3B82F6;
  --primary-2: #1E6FD9;
  --accent-orange: #FF7A1A;
  --success: #22C55E;
  --danger: #EF4444;
  --shadow: 0 4px 18px rgba(0, 0, 0, 0.55);
  --header-grad: linear-gradient(160deg, #1E6FD9, #0F4BB0);

  /* Legacy alias mappings */
  --bg-canvas: var(--bg);
  --bg-card: var(--surface);
  --bg-card-hover: var(--surface-2);
  --border-subtle: var(--border);
  --border-card: var(--border);
  --text-primary: var(--text);
  --text-secondary: var(--text-2);
  --text-muted: var(--text-2);
  --blue-primary: var(--primary);
  --blue-vibrant: var(--primary);
}

/* ==============================================================
   BASE & RESET
   ============================================================== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  margin: 0;
  padding: 0;
  background-color: var(--bg);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  width: 100%;
  min-width: 320px;
  max-width: 420px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--bg);
  color: var(--text);
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

@media screen and (max-width: 399px) {
  body {
    width: 380px;
    height: 600px;
  }
}

@media screen and (min-width: 400px) {
  body {
    width: 100%;
    max-width: 420px;
    height: 100vh;
  }
}

.popup-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  flex: 1 1 auto;
  position: relative;
  overflow-x: hidden;
}

.tabular-nums,
#creditBalanceText,
#extCreditsBig,
.stat-tile-val,
.safety-live-val {
  font-variant-numeric: tabular-nums;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* ==============================================================
   HEADER (BLUE GRADIENT)
   ============================================================== */
.ext-top-branding {
  background: var(--header-grad);
  padding: 16px 16px 36px 16px;
  color: #FFFFFF;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.header-content-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
}

.brand-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
  min-height: 36px;
}

.ext-brand {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.ext-logo-img {
  height: 24px;
  width: auto;
  object-fit: contain;
  display: block;
}

.brand-bold {
  font-weight: 800;
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: 0.8px;
  line-height: 1;
}

.header-action-group {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
}

.header-icon-btn,
.header-tool-btn {
  background: rgba(255, 255, 255, 0.16) !important;
  border: 1px solid rgba(255, 255, 255, 0.28) !important;
  border-radius: var(--radius-chip) !important;
  color: #FFFFFF !important;
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  min-height: 36px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  position: relative;
  padding: 0 !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.header-icon-btn:hover,
.header-tool-btn:hover {
  background: rgba(255, 255, 255, 0.28) !important;
  border-color: rgba(255, 255, 255, 0.45) !important;
}

.header-icon-btn svg,
.header-tool-btn svg {
  width: 18px;
  height: 18px;
  stroke: #FFFFFF;
}

#drawerThemeIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.header-tools-drawer {
  position: absolute;
  top: 44px;
  right: 0;
  width: 220px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow);
  z-index: 1000;
  overflow: hidden;
  animation: drawerSlideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes drawerSlideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.drawer-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  background-color: var(--surface-2);
}

.drawer-title-text {
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
}

.drawer-close-btn {
  background: transparent;
  border: none;
  color: var(--text-2);
  font-size: 14px;
  cursor: pointer;
  padding: 2px 4px;
}

.drawer-items-list {
  display: flex;
  flex-direction: column;
}

.drawer-item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;
  width: 100%;
}

.drawer-item-row:last-child {
  border-bottom: none;
}

.drawer-item-row:hover {
  background-color: var(--surface-2);
}

.drawer-item-icon {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-chip);
  background: var(--surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}

.drawer-item-text {
  display: flex;
  flex-direction: column;
}

.drawer-item-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
}

.drawer-item-sub {
  font-size: 10px;
  color: var(--text-2);
}

/* Centered Header Balance & Status */
.header-center-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.header-credits-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
}

.header-credits-val-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  line-height: 1;
}

.header-credits-val {
  font-size: 28px;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: -0.5px;
}

.header-credits-cur {
  font-size: 20px;
  font-weight: 800;
  color: #FFFFFF;
  margin-right: 2px;
}

.eye-toggle-btn {
  background: rgba(255, 255, 255, 0.18);
  border: none;
  border-radius: 50%;
  color: #FFFFFF;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;
}

.eye-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.32);
}

.buy-credits-pill-btn {
  background: transparent;
  border: 1.5px solid #FFFFFF;
  border-radius: var(--radius-pill);
  color: #FFFFFF;
  padding: 6px 18px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 32px;
}

.buy-credits-pill-btn:hover {
  background: #FFFFFF;
  color: var(--primary-2);
}

.account-locked-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-pill);
  padding: 4px 10px;
  font-size: 11px;
  color: #FFFFFF;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--success);
  display: inline-block;
  box-shadow: 0 0 6px var(--success);
}

.verified-handle {
  font-weight: 600;
}

.lock-tag {
  color: var(--success);
  font-weight: 700;
}

/* ==============================================================
   AGENT DETAIL MINI-HEADER
   ============================================================== */
.agent-header-nav-row {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100%;
}

.agent-back-btn {
  background: rgba(255, 255, 255, 0.16) !important;
  border: 1px solid rgba(255, 255, 255, 0.28) !important;
  border-radius: var(--radius-chip) !important;
  color: #FFFFFF !important;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.agent-back-btn:hover {
  background: rgba(255, 255, 255, 0.28) !important;
}

.agent-header-info-center {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.agent-header-icon-circle,
.agent-header-icon-tile {
  width: 32px !important;
  height: 32px !important;
  border-radius: 50% !important;
  background: rgba(255, 255, 255, 0.2) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #FFFFFF !important;
}

.agent-header-icon-circle svg,
.agent-header-icon-tile svg {
  width: 18px !important;
  height: 18px !important;
  stroke: #FFFFFF !important;
}

.agent-header-name {
  font-size: 16px !important;
  font-weight: 800 !important;
  color: #FFFFFF !important;
}

.agent-info-circle-btn {
  background: rgba(255, 255, 255, 0.16) !important;
  border: 1px solid rgba(255, 255, 255, 0.28) !important;
  border-radius: var(--radius-chip) !important;
  color: #FFFFFF !important;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.agent-header-pills-row {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  margin-top: 2px !important;
}

.agent-header-pill {
  background: rgba(0, 0, 0, 0.25) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: var(--radius-full) !important;
  padding: 4px 10px !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #FFFFFF !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 5px !important;
}

/* ==============================================================
   MAIN SCROLLABLE CONTENT (SURFACE OVERLAPS HEADER BY -24px)
   ============================================================== */
.ext-main {
  flex: 1 1 auto;
  padding: 24px 16px 100px 16px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--bg);
  border-radius: var(--radius-card) var(--radius-card) 0 0;
  margin-top: -24px;
  position: relative;
  z-index: 20;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
}

.ext-main::-webkit-scrollbar {
  width: 6px;
}
.ext-main::-webkit-scrollbar-track {
  background: transparent;
}
.ext-main::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: var(--radius-pill);
}

.tab-panel {
  display: none;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 150ms ease, transform 150ms ease;
}

.tab-panel.active {
  display: flex;
  opacity: 1;
  transform: translateY(0);
}

/* ==============================================================
   SURFACE CARDS (Radius 24px)
   ============================================================== */
.surface-card {
  background-color: var(--surface) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-card) !important;
  padding: 16px !important;
  box-shadow: var(--shadow) !important;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

.section-header-title,
.voice-section-title {
  font-size: 20px !important;
  font-weight: 700 !important;
  color: var(--text) !important;
  margin-bottom: 2px !important;
}

.voice-section-subtitle {
  font-size: 12px !important;
  color: var(--text-2) !important;
  margin-bottom: 8px !important;
}

.agent-group-label {
  font-size: 12px !important;
  font-weight: 700 !important;
  color: var(--text-2) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  margin-bottom: 4px !important;
}

/* ==============================================================
   HOME TAB: 4-COLUMN BENTO AGENT GRID
   ============================================================== */
.agents-bento-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quick-agents-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px 8px;
}

.bento-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 2px;
  min-height: 84px;
  transition: transform 0.15s ease;
}

.bento-card:hover {
  transform: translateY(-2px);
}

.bento-card:active {
  transform: translateY(0) scale(0.97);
}

/* 56px Rounded Gradient Icon Tiles */
.bento-icon-box,
.bento-icon-tile {
  width: 56px !important;
  height: 56px !important;
  min-width: 56px !important;
  min-height: 56px !important;
  border-radius: 18px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-bottom: 8px !important;
  color: #FFFFFF !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25) !important;
  transition: all 0.18s ease !important;
  flex-shrink: 0;
}

.bento-icon-box svg,
.bento-icon-tile svg {
  width: 24px !important;
  height: 24px !important;
  stroke-width: 2 !important;
  stroke: #FFFFFF !important;
  color: #FFFFFF !important;
}

/* Vibrant Curated Fintech Gradients for Each Agent Tile */
.bento-icon-tgpulse    { background: linear-gradient(135deg, #0088CC 0%, #00B4D8 100%) !important; }
.bento-icon-crowdfi    { background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%) !important; }
.bento-icon-scoreboost { background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%) !important; }
.bento-icon-growthfi   { background: linear-gradient(135deg, #10B981 0%, #059669 100%) !important; }

.bento-icon-replywave  { background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%) !important; }
.bento-icon-unfollow   { background: linear-gradient(135deg, #64748B 0%, #475569 100%) !important; }
.bento-icon-creatorx   { background: linear-gradient(135deg, #EC4899 0%, #DB2777 100%) !important; }
.bento-icon-defaulter  { background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%) !important; }

.bento-icon-reciprocate { background: linear-gradient(135deg, #06B6D4 0%, #0284C7 100%) !important; }
.bento-icon-homefeed   { background: linear-gradient(135deg, #6366F1 0%, #4338CA 100%) !important; }
.bento-icon-nichesearch { background: linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%) !important; }
.bento-icon-tgliker    { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%) !important; }

.bento-title,
.bento-agent-name {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: var(--text) !important;
  line-height: 1.25 !important;
  text-align: center !important;
  max-width: 76px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ==============================================================
   ACTIVE VOICE PILL BANNER
   ============================================================== */
.active-voice-banner,
.active-voice-pill-card {
  background-color: var(--surface) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-pill) !important;
  padding: 10px 16px !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  cursor: pointer;
  box-shadow: var(--shadow);
  min-height: 48px !important;
  max-height: 48px !important;
  transition: all 0.15s ease;
  width: 100%;
}

.active-voice-banner:hover {
  border-color: var(--primary) !important;
  transform: translateY(-1px);
}

.voice-banner-left {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
}

.voice-banner-icon {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  min-height: 28px !important;
  border-radius: 50% !important;
  background: var(--surface-2) !important;
  color: var(--primary) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.voice-banner-icon svg {
  width: 16px !important;
  height: 16px !important;
  max-width: 16px !important;
  max-height: 16px !important;
  stroke: var(--primary) !important;
}

.voice-banner-meta {
  display: flex !important;
  flex-direction: column !important;
}

.voice-banner-label {
  font-size: 10px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  color: var(--text-2) !important;
  letter-spacing: 0.5px !important;
}

.voice-banner-name {
  font-size: 13px !important;
  font-weight: 700 !important;
  color: var(--text) !important;
}

.voice-banner-arrow {
  color: var(--text-2) !important;
  display: flex !important;
  align-items: center !important;
}

.voice-banner-arrow svg {
  width: 14px !important;
  height: 14px !important;
  stroke: var(--text-2) !important;
}

/* ==============================================================
   AI VOICE 2-COLUMN CHIP GRID
   ============================================================== */
.tab-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.link-btn {
  background: transparent;
  border: none;
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 0;
  transition: opacity 0.15s ease;
}
.link-btn:hover {
  opacity: 0.85;
}

.tone-pills,
#tonePills {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 8px !important;
  width: 100% !important;
}

.tone-pill {
  background-color: var(--surface-2) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-chip) !important;
  padding: 10px 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  color: var(--text) !important;
  cursor: pointer !important;
  min-height: 44px !important;
  transition: all 0.15s ease !important;
  text-align: center !important;
  user-select: none !important;
}

.tone-pill:hover {
  border-color: var(--primary) !important;
  color: var(--primary) !important;
}

.tone-pill.active {
  background-color: var(--primary) !important;
  border-color: var(--primary) !important;
  color: #FFFFFF !important;
  box-shadow: 0 4px 12px rgba(30, 111, 217, 0.35) !important;
}

.tone-pill.active span {
  color: #FFFFFF !important;
}

/* ==============================================================
   SAFETY CONTROLS & SLIDERS
   ============================================================== */
.slider-card-header {
  display: flex !important;
  flex-direction: row !important;
  justify-content: space-between !important;
  align-items: center !important;
  width: 100% !important;
  margin-bottom: 8px !important;
}

.slider-title {
  font-size: 13px !important;
  font-weight: 700 !important;
  color: var(--text) !important;
}

.slider-label-left {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}

.safety-live-val {
  font-size: 12px !important;
  font-weight: 700 !important;
  color: var(--primary) !important;
  font-variant-numeric: tabular-nums !important;
}

.dual-range-wrap {
  position: relative !important;
  height: 28px !important;
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
}

.dual-range-track {
  position: absolute;
  left: 0;
  right: 0;
  height: 6px;
  background-color: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  z-index: 0;
}

.dual-range-highlight {
  position: absolute;
  height: 6px;
  background-color: var(--primary);
  border-radius: var(--radius-full);
  z-index: 1;
}

.dual-range-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 28px;
  -webkit-appearance: none;
  background: transparent;
  pointer-events: none;
  z-index: 2;
  margin: 0;
}

.dual-range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: auto;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 2.5px solid var(--primary);
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: transform 0.1s ease;
}

.dual-range-input::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.single-range-input {
  width: 100% !important;
  height: 6px !important;
  background-color: var(--surface-2) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-full) !important;
  outline: none !important;
  accent-color: var(--primary) !important;
  margin-top: 6px !important;
}

.switch-row {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100% !important;
}

.switch-label {
  font-size: 13px !important;
  font-weight: 700 !important;
  color: var(--text) !important;
}

.switch-sub {
  font-size: 11px !important;
  color: var(--text-2) !important;
  margin-top: 2px !important;
}

.switch {
  position: relative !important;
  display: inline-block !important;
  width: 44px !important;
  height: 24px !important;
  min-width: 44px !important;
  flex-shrink: 0 !important;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider-round {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--surface-2) !important;
  border: 1px solid var(--border) !important;
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 999px !important;
}

.slider-round:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: #FFFFFF;
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,0.25);
}

.switch input:checked + .slider-round {
  background-color: var(--primary) !important;
  border-color: var(--primary) !important;
}

.switch input:checked + .slider-round:before {
  transform: translateX(20px);
}

/* ==============================================================
   UNIVERSAL BUTTONS & CONTROLS
   ============================================================== */
.primary-btn {
  background: var(--primary) !important;
  color: #FFFFFF !important;
  border: none !important;
  border-radius: var(--radius-input) !important;
  padding: 10px 16px !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  box-shadow: 0 4px 14px rgba(30, 111, 217, 0.35) !important;
  transition: all 0.15s ease !important;
  min-height: 40px !important;
  text-decoration: none !important;
}

.primary-btn:hover {
  background: var(--primary-2) !important;
  transform: translateY(-1px);
}

.primary-btn:active {
  transform: translateY(0);
}

.secondary-btn {
  background: var(--surface-2) !important;
  color: var(--text) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-input) !important;
  padding: 10px 14px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  transition: all 0.15s ease !important;
  min-height: 40px !important;
}

.secondary-btn:hover {
  border-color: var(--primary) !important;
  color: var(--primary) !important;
}

.mini-btn {
  padding: 8px 12px !important;
  font-size: 12px !important;
}

.pause-btn {
  background: #D97706 !important;
  color: #FFFFFF !important;
  border: none !important;
  border-radius: var(--radius-input) !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
}

.skip-btn {
  background: var(--surface-2) !important;
  color: var(--text-2) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-input) !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
}

.danger-btn {
  background: var(--danger) !important;
  color: #FFFFFF !important;
  border: none !important;
  border-radius: var(--radius-input) !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
}

.clean-btn {
  background: transparent;
  border: none;
  color: var(--primary);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  padding: 2px 4px;
}
.clean-btn:hover {
  text-decoration: underline;
}

.current-tab-chip {
  background-color: var(--surface-2) !important;
  border: 1px solid var(--border) !important;
  color: var(--primary) !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  padding: 2px 8px !important;
  border-radius: var(--radius-full) !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
}
.current-tab-chip:hover {
  background-color: var(--primary) !important;
  color: #FFFFFF !important;
  border-color: var(--primary) !important;
}

.sticky-action-bar {
  position: sticky;
  bottom: 0;
  background: var(--surface);
  padding: 10px 0;
  margin-top: 12px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
  z-index: 10;
}
.sticky-action-bar .primary-btn {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.sticky-action-bar .secondary-btn,
.sticky-action-bar .pause-btn,
.sticky-action-bar .skip-btn,
.sticky-action-bar .danger-btn {
  flex: 1;
}

/* ==============================================================
   FORM CONTROLS & INPUTS
   ============================================================== */
.field-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 6px !important;
}

.field-label {
  font-size: 12px !important;
  font-weight: 700 !important;
  color: var(--text) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.4px !important;
}

.sub-badge {
  font-size: 10px;
  font-weight: 700;
  color: var(--primary);
  background: var(--surface-2);
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.status-pill-badge {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--success);
  background-color: rgba(34, 197, 94, 0.12);
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.ext-input,
.ext-select,
.ext-textarea {
  width: 100% !important;
  background-color: var(--input) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-input) !important;
  color: var(--text) !important;
  font-size: 12px !important;
  padding: 10px 12px !important;
  outline: none !important;
  transition: border-color 0.15s ease !important;
  box-sizing: border-box !important;
}

.ext-input:focus,
.ext-select:focus,
.ext-textarea:focus {
  border-color: var(--primary) !important;
}

.ext-textarea {
  min-height: 70px;
  resize: vertical;
  font-family: inherit;
}

.grid-2-col {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 8px !important;
}

.grid-3-col {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 6px !important;
}

.quick-chips-row {
  display: flex;
  gap: 4px;
}

.quick-chip-btn {
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-2);
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.15s ease;
}

.quick-chip-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Action Chips */
.action-chips-wrap {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 6px !important;
  margin-top: 4px !important;
}

.action-chip {
  background-color: var(--surface-2) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-chip) !important;
  padding: 8px 12px !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  color: var(--text) !important;
  cursor: pointer !important;
  min-height: 40px !important;
  user-select: none !important;
  transition: all 0.15s ease !important;
}

.action-chip:hover {
  border-color: var(--primary) !important;
}

.action-chip.active {
  background-color: var(--primary) !important;
  border-color: var(--primary) !important;
  color: #FFFFFF !important;
  box-shadow: 0 2px 8px rgba(30, 111, 217, 0.35) !important;
}

.action-chip.active svg {
  stroke: #FFFFFF !important;
}

.action-chip-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

/* Preset Row */
.preset-row-wrap {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: none;
}
.preset-row-wrap::-webkit-scrollbar {
  display: none;
}
.preset-chip-btn {
  background-color: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-input);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.preset-chip-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.preset-chip-btn.active {
  background-color: var(--primary);
  border-color: var(--primary);
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(30, 111, 217, 0.35);
}

/* Status Card */
.status-card {
  background-color: var(--surface) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-card) !important;
  padding: 14px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
  box-shadow: var(--shadow);
}

.status-card-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}

.status-state-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-state-badge {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text);
}

.status-queue-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-2);
}

.status-progress-track {
  width: 100%;
  height: 6px;
  background-color: var(--surface-2);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.status-progress-fill {
  height: 100%;
  background: var(--header-grad);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.status-stats-grid {
  display: grid;
  gap: 6px;
}
.status-stats-grid.stats-3 { grid-template-columns: repeat(3, 1fr) !important; }
.status-stats-grid.stats-4 { grid-template-columns: repeat(4, 1fr) !important; }

.stat-tile {
  background-color: var(--surface-2) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-chip) !important;
  padding: 8px 4px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  text-align: center !important;
}

.stat-tile-label {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--text-2);
  text-transform: uppercase;
}

.stat-tile-val {
  font-size: 14px !important;
  font-weight: 800 !important;
  margin-top: 2px;
}

.text-primary { color: var(--primary) !important; }
.text-success { color: var(--success) !important; }
.text-warning { color: #F59E0B !important; }
.text-danger  { color: var(--danger) !important; }

.status-text-row {
  font-size: 11px;
  color: var(--text-2);
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ==============================================================
   CREDITS TAB
   ============================================================== */
.balance-hero-card {
  text-align: center;
  padding: 18px 14px;
}
.balance-hero-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-2);
  letter-spacing: 0.5px;
}
.balance-hero-amount-wrap {
  margin-top: 6px;
}
.balance-hero-val {
  font-size: 28px;
  font-weight: 800;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.founding-offer-card {
  background: linear-gradient(135deg, rgba(255, 122, 26, 0.12), rgba(30, 111, 217, 0.12));
  border: 1px solid var(--accent-orange);
  border-radius: var(--radius-card);
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: var(--shadow);
}
.founding-offer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.founding-badge {
  font-size: 9.5px;
  font-weight: 800;
  color: #FFFFFF;
  background: var(--accent-orange);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}
.founding-title {
  font-size: 12px;
  font-weight: 800;
  color: var(--accent-orange);
}
.founding-price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}
.founding-price-old {
  font-size: 12px;
  color: var(--text-2);
  text-decoration: line-through;
}
.founding-price-big {
  font-size: 24px;
  font-weight: 800;
  color: var(--text);
}
.founding-price-sub {
  font-size: 12px;
  color: var(--text-2);
}
.founding-credits-pill {
  margin-left: auto;
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
}
.founding-timer-box {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-input);
  padding: 6px;
  text-align: center;
  font-family: monospace;
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 10px;
}
.founding-claim-btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 10px;
  background: linear-gradient(135deg, var(--accent-orange), #EA580C);
  color: #FFFFFF;
  font-weight: 700;
  font-size: 12px;
  border-radius: var(--radius-input);
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(255, 122, 26, 0.35);
  transition: transform 0.15s ease;
}
.founding-claim-btn:hover {
  transform: translateY(-1px);
}

.referral-input-row {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}
.copy-pill-btn {
  background-color: var(--primary);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-input);
  padding: 0 14px;
  font-weight: 600;
  font-size: 11px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.copy-pill-btn:hover {
  background-color: var(--primary-2);
}
.referral-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  background-color: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-input);
  padding: 8px 6px;
  margin-top: 8px;
  font-size: 10px;
  text-align: center;
}
.ref-stat-box strong {
  display: block;
  font-size: 12px;
  font-weight: 700;
  margin-top: 2px;
}

/* ==============================================================
   ACCOUNT TAB
   ============================================================== */
.profile-card,
.account-user-card {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 14px !important;
  padding: 16px !important;
  text-align: left !important;
}

.account-avatar-box {
  flex-shrink: 0;
}

.account-avatar-circle {
  width: 48px !important;
  height: 48px !important;
  min-width: 48px !important;
  min-height: 48px !important;
  border-radius: 50% !important;
  background: var(--header-grad) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #FFFFFF !important;
  box-shadow: 0 4px 12px rgba(30, 111, 217, 0.3);
}

.account-avatar-circle svg {
  width: 24px !important;
  height: 24px !important;
  stroke: #FFFFFF !important;
}

.account-user-details {
  display: flex !important;
  flex-direction: column !important;
  gap: 3px !important;
  text-align: left !important;
  flex: 1;
}

.account-handle-title {
  font-size: 15px !important;
  font-weight: 700 !important;
  color: var(--text) !important;
  display: flex;
  align-items: center;
  gap: 6px;
}

.account-meta-sub {
  font-size: 12px !important;
  color: var(--text-2) !important;
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
}

.account-badges-row {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  margin-top: 4px !important;
}

.badge-mini {
  font-size: 10px !important;
  font-weight: 700 !important;
  padding: 2px 7px !important;
  border-radius: var(--radius-full) !important;
  text-transform: uppercase;
}

.badge-mini.growth {
  background: rgba(30, 111, 217, 0.15) !important;
  color: var(--primary) !important;
}

.credits-count-badge {
  font-size: 11px !important;
  font-weight: 700 !important;
  color: var(--success) !important;
}

.list-rows-card {
  padding: 6px !important;
  display: flex;
  flex-direction: column;
}

.account-list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border);
  padding: 12px 8px;
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;
}

.account-list-row:last-child {
  border-bottom: none;
}

.account-list-row:hover {
  background-color: var(--surface-2);
  border-radius: var(--radius-input);
}

.account-list-row.danger {
  color: var(--danger);
}

.list-row-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.list-row-icon svg {
  display: block;
}

.list-row-chevron {
  color: var(--text-2);
}

.account-accordion-row {
  border-bottom: 1px solid var(--border);
  padding: 12px 8px;
}

.accordion-trigger-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
}

.change-password-box {
  margin-top: 10px;
  padding-top: 8px;
}

/* ==============================================================
   FIXED BOTTOM NAVIGATION DOCK
   ============================================================== */
.ext-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 420px;
  margin: 0 auto;
  height: 68px;
  background-color: var(--surface);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 999;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
}

.tab-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--text-2);
  font-size: 11px;
  font-weight: 600;
  min-width: 54px;
  min-height: 48px;
  transition: color 0.15s ease;
}

.tab-btn:hover {
  color: var(--primary);
}

.tab-btn.active {
  color: var(--primary);
}

.tab-btn .tab-icon-svg {
  width: 22px;
  height: 22px;
}

/* Center Floating Safety Shield Button (56px, raised 18px with glow) */
.tab-safety-center {
  position: relative;
  top: -18px;
}

.tab-safety-shield-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--header-grad);
  border: 3px solid var(--surface);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(30, 111, 217, 0.5), 0 0 14px rgba(59, 130, 246, 0.4);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
}

.tab-safety-shield-circle:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 24px rgba(30, 111, 217, 0.65), 0 0 18px rgba(59, 130, 246, 0.6);
}

.tab-safety-shield-circle svg {
  width: 24px;
  height: 24px;
}

/* Info Popover */
.info-popover-btn {
  background: transparent;
  border: none;
  color: var(--text-2);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  transition: color 0.15s ease;
}

.info-popover-btn:hover {
  color: var(--primary);
}

.info-popover-box {
  position: fixed;
  z-index: 10000;
  max-width: 260px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-input);
  padding: 8px 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  font-size: 11px;
  line-height: 1.4;
  color: var(--text);
  pointer-events: auto;
}

/* Safety Note Card */
.safety-note-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  box-shadow: var(--shadow);
}
.safety-note-icon {
  color: var(--primary);
  flex-shrink: 0;
}
.safety-note-icon svg {
  width: 18px;
  height: 18px;
}
.safety-note-text {
  font-size: 11.5px;
  color: var(--text-2);
  line-height: 1.35;
}
`;

fs.writeFileSync('chrome-extension/popup.css', completeCss, 'utf8');
fs.writeFileSync('chrome-extension/sidepanel.css', completeCss, 'utf8');
console.log('Successfully wrote pristine complete CSS to popup.css and sidepanel.css');
