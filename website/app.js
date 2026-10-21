/**
 * =========================================================================
 * TWIXOR SUITE — STANDALONE PRODUCT & RELEASES PORTAL
 * Interactive Controller: Theme, Video Academy, Simulator & Download
 * (Completely decoupled from admin dashboard)
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initMobileNavigation();
  initHeroShowcaseTabs();
  initVirtualCursorSimulation();
  initVideoAcademy();
  initAgentFilters();
  initFaqAccordion();
  initDownloadAndChecksum();
  syncLatestReleaseFromApi();
});

/* -------------------------------------------------------------------------
   1. THEME ENGINE (DARK / LIGHT MODE)
   ------------------------------------------------------------------------- */
function initThemeEngine() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const root = document.documentElement;

  // Read persisted preference or default to dark
  const savedTheme = localStorage.getItem('twixor_portal_theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('twixor_portal_theme', next);
      showPortalToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, '🌓');
    });
  }
}

/* -------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   ------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });

    // Close drawer when clicking any link
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    });
  }
}

/* -------------------------------------------------------------------------
   3. INTERACTIVE BÉZIER VIRTUAL CURSOR SIMULATOR
   ------------------------------------------------------------------------- */
function initVirtualCursorSimulation() {
  const triggerBtn = document.getElementById('triggerCursorDemoBtn');
  const cursor = document.getElementById('virtualCursorDemo');
  const stage = document.getElementById('cursorDemoStage');
  const targetLike = document.getElementById('demoTargetLike');
  const targetComment = document.getElementById('demoTargetComment');
  const targetProfile = document.getElementById('demoTargetProfile');
  const trajText = document.getElementById('telemetryTrajectory');
  const dwellText = document.getElementById('telemetryDwell');

  if (!triggerBtn || !cursor || !stage) return;

  let isSimulating = false;

  triggerBtn.addEventListener('click', async () => {
    if (isSimulating) return;
    isSimulating = true;
    triggerBtn.disabled = true;
    triggerBtn.textContent = 'Simulating Physics...';

    const targets = [targetLike, targetComment, targetProfile];

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (!target) continue;

      const stageRect = stage.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      // Relative target position inside stage
      const destX = targetRect.left - stageRect.left + (targetRect.width / 2) - 8;
      const destY = targetRect.top - stageRect.top + (targetRect.height / 2) - 8;

      if (trajText) trajText.textContent = `Cubic Bézier (Target #${i + 1})`;
      if (dwellText) dwellText.textContent = 'Flight...';

      // Animate cursor to target with Bézier curved flight
      await animateCursorFlight(cursor, destX, destY, 650);

      // Pre-click hover dwell
      target.classList.add('target-hovered');
      if (dwellText) dwellText.textContent = 'Hover Dwell (320ms)';
      await sleep(320);

      // Mouse down & click pulse
      target.classList.add('target-pulsed');
      triggerCursorPulse(cursor);
      if (dwellText) dwellText.textContent = 'Organic Click Pulse';
      await sleep(240);

      target.classList.remove('target-pulsed');
      target.classList.remove('target-hovered');
      await sleep(200);
    }

    // Return to resting position
    if (trajText) trajText.textContent = 'Returning Home';
    await animateCursorFlight(cursor, 40, 30, 500);

    if (trajText) trajText.textContent = 'Simulation Complete';
    if (dwellText) dwellText.textContent = '0ms';

    isSimulating = false;
    triggerBtn.disabled = false;
    triggerBtn.textContent = 'Test Virtual Cursor Movement';
    showPortalToast('Bézier Cursor Simulation Finished!', '🎯');
  });
}

function animateCursorFlight(cursorEl, targetX, targetY, durationMs) {
  return new Promise(resolve => {
    const startX = cursorEl.offsetLeft;
    const startY = cursorEl.offsetTop;
    const startTime = performance.now();

    // Control point for quadratic curve deviation (simulating human arm arc)
    const midX = (startX + targetX) / 2 + (Math.random() * 40 - 20);
    const midY = Math.min(startX, targetY) - (20 + Math.random() * 30);

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      // Quadratic Bézier curve: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
      const t = ease;
      const curX = Math.round((1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * targetX);
      const curY = Math.round((1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * targetY);

      cursorEl.style.left = `${curX}px`;
      cursorEl.style.top = `${curY}px`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

function triggerCursorPulse(cursorEl) {
  const ring = cursorEl.querySelector('.cursor-pulse-ring');
  if (!ring) return;
  ring.style.opacity = '1';
  ring.style.transform = 'translate(-50%, -50%) scale(1.6)';
  ring.style.transition = 'all 0.3s ease-out';
  setTimeout(() => {
    ring.style.opacity = '0';
    ring.style.transform = 'translate(-50%, -50%) scale(1)';
    ring.style.transition = 'none';
  }, 350);
}

/* -------------------------------------------------------------------------
   3.5. HERO REAL SCREENSHOT GALLERY TABS
   ------------------------------------------------------------------------- */
function initHeroShowcaseTabs() {
  const tabs = document.querySelectorAll('#heroShowcaseTabs .showcase-tab');
  const img = document.getElementById('heroShowcaseImg');
  if (!tabs.length || !img) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const newSrc = tab.getAttribute('data-img');
      const newAlt = tab.getAttribute('data-alt');

      if (newSrc) {
        img.style.opacity = '0.3';
        setTimeout(() => {
          img.src = newSrc;
          if (newAlt) img.alt = newAlt;
          img.style.opacity = '1';
        }, 150);
      }
    });
  });
}

/* -------------------------------------------------------------------------
   4. VIDEO TUTORIAL & VISUAL WALKTHROUGH ACADEMY
   ------------------------------------------------------------------------- */
function initVideoAcademy() {
  const playlistItems = document.querySelectorAll('.playlist-item');
  const posterBox = document.getElementById('videoPosterBox');
  const posterImg = document.getElementById('currentVideoPoster');
  const iframe = document.getElementById('videoIframe');
  const metaTag = document.getElementById('currentVideoTag');
  const metaTitle = document.getElementById('currentVideoTitle');
  const metaDesc = document.getElementById('currentVideoDesc');
  const durationBadge = document.getElementById('videoDurationBadge');

  const stepBadge = document.getElementById('walkthroughStepBadge');
  const stepTitle = document.getElementById('walkthroughStepTitle');
  const stepDesc = document.getElementById('walkthroughStepDesc');
  const startWalkthroughBtn = document.getElementById('startWalkthroughBtn');
  const nextStepBtn = document.getElementById('nextWalkthroughStepBtn');

  const customInput = document.getElementById('customVideoInput');
  const applyCustomBtn = document.getElementById('applyCustomVideoBtn');
  const shareVideoBtn = document.getElementById('shareVideoBtn');

  let currentModuleIdx = 0;
  let autoPlayInterval = null;

  // Restore saved video if user previously linked one
  const savedVideoUrl = localStorage.getItem('twixor_tutorial_video_url');
  if (savedVideoUrl && iframe && posterBox) {
    posterBox.style.display = 'none';
    iframe.style.display = 'block';
    iframe.src = savedVideoUrl;
    if (metaTitle) metaTitle.textContent = 'Custom Tutorial Video';
    if (metaTag) metaTag.textContent = 'ACTIVE VIDEO';
    if (metaDesc) metaDesc.textContent = 'Streaming your linked tutorial video.';
  }

  function activateModule(index) {
    if (!playlistItems.length) return;
    currentModuleIdx = (index + playlistItems.length) % playlistItems.length;

    playlistItems.forEach((item, idx) => {
      item.classList.toggle('active', idx === currentModuleIdx);
    });

    const activeItem = playlistItems[currentModuleIdx];
    const title = activeItem.getAttribute('data-title');
    const tag = activeItem.getAttribute('data-tag');
    const desc = activeItem.getAttribute('data-desc');
    const imgSrc = activeItem.getAttribute('data-img');

    if (posterImg && imgSrc) {
      posterImg.style.opacity = '0.4';
      setTimeout(() => {
        posterImg.src = imgSrc;
        posterImg.style.opacity = '1';
      }, 150);
    }

    if (metaTitle) metaTitle.textContent = title;
    if (metaTag) metaTag.textContent = tag;
    if (metaDesc) metaDesc.textContent = desc;

    if (stepBadge) stepBadge.textContent = `Step ${currentModuleIdx + 1} of ${playlistItems.length}`;
    if (stepTitle) stepTitle.textContent = title;
    if (stepDesc) stepDesc.textContent = desc;

    // Reset iframe if in walkthrough mode
    if (!localStorage.getItem('twixor_tutorial_video_url') && iframe && posterBox) {
      iframe.style.display = 'none';
      iframe.src = '';
      posterBox.style.display = 'flex';
    }
  }

  // Click playlist item
  playlistItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      stopAutoPlay();
      activateModule(idx);
    });
  });

  // Next Step button
  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      stopAutoPlay();
      activateModule(currentModuleIdx + 1);
    });
  }

  // Auto-play Walkthrough button
  if (startWalkthroughBtn) {
    startWalkthroughBtn.addEventListener('click', () => {
      if (autoPlayInterval) {
        stopAutoPlay();
        return;
      }

      startWalkthroughBtn.innerHTML = `<span>Pause Walkthrough</span>`;
      showPortalToast('Auto-playing walkthrough...', '▶️');

      autoPlayInterval = setInterval(() => {
        activateModule(currentModuleIdx + 1);
      }, 3500);
    });
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
      if (startWalkthroughBtn) {
        startWalkthroughBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Auto-Play Walkthrough</span>
        `;
      }
    }
  }

  // Embed Custom / Real Video Link
  if (applyCustomBtn && customInput && iframe && posterBox) {
    applyCustomBtn.addEventListener('click', () => {
      const rawUrl = customInput.value.trim();
      if (!rawUrl) {
        showPortalToast('Please paste a valid video URL (YouTube, Loom, etc.)', '⚠️');
        return;
      }

      let embedUrl = rawUrl;
      if (rawUrl.includes('youtube.com/watch?v=')) {
        const videoId = rawUrl.split('watch?v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (rawUrl.includes('youtu.be/')) {
        const videoId = rawUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (rawUrl.includes('loom.com/share/')) {
        const videoId = rawUrl.split('loom.com/share/')[1]?.split('?')[0];
        embedUrl = `https://www.loom.com/embed/${videoId}?autoplay=1`;
      }

      stopAutoPlay();
      localStorage.setItem('twixor_tutorial_video_url', embedUrl);

      posterBox.style.display = 'none';
      iframe.style.display = 'block';
      iframe.src = embedUrl;

      if (metaTitle) metaTitle.textContent = 'Linked Tutorial Video';
      if (metaTag) metaTag.textContent = 'USER VIDEO';
      if (metaDesc) metaDesc.textContent = `Streaming video from: ${rawUrl}`;

      showPortalToast('Tutorial video embedded and saved!', '🎬');
      customInput.value = '';
    });
  }

  // Share Guide Button
  if (shareVideoBtn) {
    shareVideoBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      showPortalToast('Walkthrough guide link copied to clipboard!', '🔗');
    });
  }
}

/* -------------------------------------------------------------------------
   5. AGENT FILTER TABS
   ------------------------------------------------------------------------- */
function initAgentFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const agentCards = document.querySelectorAll('.agent-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      agentCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------
   6. FAQ ACCORDION
   ------------------------------------------------------------------------- */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isExpanded = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isExpanded) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* -------------------------------------------------------------------------
   7. DOWNLOAD EXTENSION & CHECKSUM COPIER
   ------------------------------------------------------------------------- */
function initDownloadAndChecksum() {
  const downloadBtns = [
    document.getElementById('navDownloadBtn'),
    document.getElementById('heroDownloadBtn'),
    document.getElementById('downloadPackageBtn')
  ].filter(Boolean);

  const copyChecksumBtn = document.getElementById('copyChecksumBtn');
  const checksumValue = document.getElementById('checksumValue');

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerExtensionDownload();
    });
  });

  if (copyChecksumBtn && checksumValue) {
    copyChecksumBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(checksumValue.innerText.trim());
      copyChecksumBtn.textContent = 'Copied!';
      showPortalToast('SHA-256 Checksum copied to clipboard', '📋');
      setTimeout(() => {
        copyChecksumBtn.textContent = 'Copy';
      }, 2000);
    });
  }
}

/**
 * Creates and triggers a download of the active extension release archive
 */
function triggerExtensionDownload() {
  const ver = window._activeReleaseVer || '2.4.0';
  const zipFile = window._activeReleaseZip || 'twixor-v2.4.0.zip';

  showPortalToast(`Starting Twixor v${ver} Download...`, '📦');

  // Trigger download of the extension archive
  const a = document.createElement('a');
  a.href = zipFile;
  a.download = zipFile;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Show helpful instruction alert
  setTimeout(() => {
    showPortalToast('Unzip the file and click "Load unpacked" in chrome://extensions', '💡');
  }, 1200);
}

/**
 * Synchronizes latest release details dynamically from the Backend API or Local Store
 */
async function syncLatestReleaseFromApi() {
  try {
    const endpoints = ['/api/system/version'];
    if (window.location.protocol === 'http:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      endpoints.push('http://localhost:5000/api/system/version', 'http://127.0.0.1:5000/api/system/version');
    }

    let releaseData = null;
    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          releaseData = await res.json();
          break;
        }
      } catch (err) {}
    }

    if (!releaseData || !releaseData.currentVersion) return;

    window._activeReleaseVer = releaseData.currentVersion;
    window._activeReleaseZip = releaseData.zipFileName || `twixor-v${releaseData.currentVersion}.zip`;

    // 1. Update Announcement Bar
    const badgeNew = document.querySelector('#announcementBar .badge-new');
    const announcementText = document.querySelector('#announcementBar .announcement-text');
    if (badgeNew) badgeNew.textContent = `RELEASE v${releaseData.currentVersion}`;
    if (announcementText) {
      announcementText.innerHTML = `<strong>Twixor v${releaseData.currentVersion} is live!</strong> ${releaseData.releaseNotes ? releaseData.releaseNotes.slice(0, 120) + '...' : 'Enhanced autonomous engagement suite.'}`;
    }

    // 2. Update Nav Download Button
    const navBtn = document.getElementById('navDownloadBtn');
    if (navBtn) {
      const span = navBtn.querySelector('span');
      if (span) span.textContent = `Download v${releaseData.currentVersion}`;
    }

    // 3. Update Hero Download Button
    const heroBtn = document.getElementById('heroDownloadBtn');
    if (heroBtn) {
      const span = heroBtn.querySelector('span');
      if (span) span.textContent = `Download Extension v${releaseData.currentVersion}`;
    }

    // 4. Update Download Section
    const downloadCard = document.querySelector('.download-card');
    if (downloadCard) {
      const verTag = downloadCard.querySelector('.version-tag');
      const relDate = downloadCard.querySelector('.release-date');
      const title = downloadCard.querySelector('.download-title');
      const desc = downloadCard.querySelector('.download-desc');
      const specPills = downloadCard.querySelectorAll('.spec-pill');
      const pkgBtn = document.getElementById('downloadPackageBtn');
      const checksumVal = document.getElementById('checksumValue');

      if (verTag) verTag.textContent = `Twixor v${releaseData.currentVersion}`;
      if (relDate && releaseData.releaseDate) relDate.textContent = `Released ${releaseData.releaseDate}`;
      if (title) title.textContent = releaseData.releaseTitle || `Twixor Twitter Growth Suite v${releaseData.currentVersion}`;
      if (desc && releaseData.releaseNotes) desc.textContent = releaseData.releaseNotes;
      if (specPills && specPills[1] && releaseData.fileSizeFormatted) {
        specPills[1].innerHTML = `&#128230; ZIP Archive (${releaseData.fileSizeFormatted})`;
      }
      if (pkgBtn) {
        const btnSpan = pkgBtn.querySelector('span');
        if (btnSpan) btnSpan.textContent = `Download ${releaseData.zipFileName || 'twixor-extension.zip'}`;
      }
      if (checksumVal && releaseData.checksumSha256) {
        checksumVal.textContent = releaseData.checksumSha256;
      }
    }
  } catch (err) {
    console.debug('Active release synced with local portal fallback:', err);
  }
}


/* -------------------------------------------------------------------------
   UTILITIES: TOAST NOTIFICATIONS & SLEEP
   ------------------------------------------------------------------------- */
function showPortalToast(message, icon = '✨') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="font-size:18px;">${icon}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
