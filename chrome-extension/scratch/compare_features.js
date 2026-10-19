const fs = require('fs');
const { execSync } = require('child_process');

const origHtml = execSync('git show 703d801:chrome-extension/popup.html').toString();
const currHtml = fs.readFileSync('chrome-extension/popup.html', 'utf8');

const origIds = new Set([...origHtml.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
const currIds = new Set([...currHtml.matchAll(/id="([^"]+)"/g)].map(m => m[1]));

console.log('Original IDs count:', origIds.size);
console.log('Current IDs count:', currIds.size);

const missing = [];
for (const id of origIds) {
  if (!currIds.has(id)) {
    missing.push(id);
  }
}

console.log('IDs in original but missing in current:', missing.length);
if (missing.length > 0) {
  console.log('Missing IDs:', missing);
} else {
  console.log('All original IDs are 100% preserved!');
}
