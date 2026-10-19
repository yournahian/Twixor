const { execSync } = require('child_process');
const origHtml = execSync('git show 703d801:chrome-extension/popup.html').toString();

// Extract all <button ... id="..." in each panel-agent-
const panels = origHtml.split('<div class="agent-panel-content"');
for (let i = 1; i < panels.length; i++) {
  const panel = panels[i];
  const idMatch = panel.match(/id="([^"]+)"/);
  const panelId = idMatch ? idMatch[1] : 'unknown';
  console.log(`\n=== PANEL: ${panelId} ===`);
  const btnMatches = panel.matchAll(/<button[^>]+id="([^"]+)"[^>]*>/g);
  for (const b of btnMatches) {
    console.log('  Button:', b[1]);
  }
}
