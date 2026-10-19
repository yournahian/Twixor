const fs = require('fs');
const js = fs.readFileSync('chrome-extension/popup.js', 'utf8');

const regex = /getElementById\(['"]([^'"]+)['"]\)\??\.addEventListener\(['"]click['"]/g;
const ids = new Set();
let match;
while ((match = regex.exec(js)) !== null) {
  const id = match[1];
  if (id.startsWith('run') || id.startsWith('stop') || id.startsWith('start') || id.startsWith('pause') || id.startsWith('skip') || id.startsWith('reset')) {
    ids.add(id);
  }
}

console.log('Button IDs clicked in popup.js:');
console.log(Array.from(ids).sort());
