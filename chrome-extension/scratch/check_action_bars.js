const fs = require('fs');
const js = fs.readFileSync('chrome-extension/build_fintech_full.js', 'utf8');

const regex = /makeStickyActionBar\(\{([^}]+)\}\)/g;
let match;
let i = 1;
while ((match = regex.exec(js)) !== null) {
  console.log(`--- Action Bar ${i++} ---`);
  console.log(match[1].trim());
}
