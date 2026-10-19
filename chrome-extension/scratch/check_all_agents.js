const fs = require('fs');

const js = fs.readFileSync('chrome-extension/popup.js', 'utf8');
const html = fs.readFileSync('chrome-extension/popup.html', 'utf8');

const regex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const allIdsInJs = new Set();
while ((match = regex.exec(js)) !== null) {
  allIdsInJs.add(match[1]);
}

console.log('Total unique IDs queried in popup.js:', allIdsInJs.size);

const missingInHtml = [];
allIdsInJs.forEach(id => {
  const pattern = new RegExp(`id=["']${id}["']`);
  if (!pattern.test(html)) {
    missingInHtml.push(id);
  }
});

console.log('Total IDs queried in popup.js but NOT found in popup.html:', missingInHtml.length);
console.log('--- Missing IDs List ---');
missingInHtml.forEach(id => console.log(id));
