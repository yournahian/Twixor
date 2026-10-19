const fs = require('fs');
const js = fs.readFileSync('chrome-extension/popup.js', 'utf8');
const html = fs.readFileSync('chrome-extension/popup.html', 'utf8');

const regex = /getElementById\(['"]([^'"]+)['"]\)\??\.addEventListener\(['"]click['"]/g;
const ids = new Set();
let match;
while ((match = regex.exec(js)) !== null) {
  const id = match[1];
  if (id.startsWith('run') || id.startsWith('stop') || id.startsWith('start') || id.startsWith('pause') || id.startsWith('skip') || id.startsWith('reset')) {
    ids.add(id);
  }
}

console.log('--- MISSING BUTTON IDs IN popup.html ---');
let missingCount = 0;
for (const id of Array.from(ids).sort()) {
  const present = html.includes(`id="${id}"`);
  if (!present) {
    console.log('MISSING:', id);
    missingCount++;
  } else {
    console.log('OK:     ', id);
  }
}
console.log('Total missing:', missingCount);
