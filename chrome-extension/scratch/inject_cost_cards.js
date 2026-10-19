const fs = require('fs');
let code = fs.readFileSync('chrome-extension/build_fintech_full.js', 'utf8');

const agents = [
  'telegram', 'audience', 'sorsa', 'followers', 'replyback',
  'unfollow', 'creators', 'defaulter', 'reciprocator',
  'feedengager', 'nicheengager', 'tgliker'
];

agents.forEach(a => {
  const target = `<div class="agent-panel-content" id="panel-agent-${a}" style="display:none;">`;
  const replacement = `${target}\n              \${makeCostNoticeCard('${a}')}`;
  if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log('Injected cost card for:', a);
  } else {
    console.warn('Target not found for:', a);
  }
});

fs.writeFileSync('chrome-extension/build_fintech_full.js', code, 'utf8');
console.log('Successfully updated build_fintech_full.js with cost cards!');
