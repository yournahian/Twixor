const { execSync } = require('child_process');
const origHtml = execSync('git show 703d801:chrome-extension/popup.html').toString();

// Find all badges and status texts in origHtml
const lines = origHtml.split('\n');
lines.forEach((l, i) => {
  if (l.includes('StateBadge') || l.includes('LiveStatus') || l.includes('StatusText') || l.includes('QueueIndicator') || l.includes('ProgressBar')) {
    console.log(i + 1, l.trim());
  }
});
