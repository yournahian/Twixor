const fs = require('fs');

const js = fs.readFileSync('chrome-extension/popup.js', 'utf8');
const html = fs.readFileSync('chrome-extension/popup.html', 'utf8');

const agentWorkflows = [
  { name: 'TG Pulse', searchPattern: "document.getElementById('runTgEngageBtn')" },
  { name: 'Audience Builder / CrowdFi', searchPattern: "async function startAudienceBuilderWorkflow" },
  { name: 'Sorsa Booster', searchPattern: "async function startSorsaScoreBoosterWorkflow" },
  { name: 'Follower Increase', searchPattern: "async function startFollowersIncreaseWorkflow" },
  { name: 'Reply Back', searchPattern: "async function startReplyBackLoopWorkflow" },
  { name: 'CreatorX', searchPattern: "document.getElementById('runCreatorRadarBtn')" },
  { name: 'Defaulter Audit', searchPattern: "async function startDefaulterAuditWorkflow" },
  { name: 'Auto Unfollow', searchPattern: "async function startAutoUnfollowWorkflow" },
  { name: 'Reciprocate', searchPattern: "async function startCommenterReciprocatorWorkflow" },
  { name: 'Home Feed Engager', searchPattern: "async function startHomeFeedEngagerWorkflow" },
  { name: 'Niche Search', searchPattern: "async function startNicheSearchEngagerWorkflow" },
  { name: 'TG Liker', searchPattern: "document.getElementById('runTgLikerBtn')" }
];

console.log('=== EXACT AUDIT OF ALL 12 AGENT WORKFLOWS ===\n');

agentWorkflows.forEach(agent => {
  const funcIdx = js.indexOf(agent.searchPattern);
  if (funcIdx === -1) {
    console.log(`[${agent.name}]: Pattern '${agent.searchPattern}' NOT found!`);
    return;
  }

  const funcSnippet = (agent.name === 'CreatorX')
    ? js.substring(js.indexOf("document.getElementById('addCreatorBtn')"), js.indexOf("document.getElementById('defaulterUseCurrentTabBtn')"))
    : js.substring(funcIdx, funcIdx + 5000);
  const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
  let m;
  const idsInFunc = [];
  while ((m = idRegex.exec(funcSnippet)) !== null) {
    if (!idsInFunc.includes(m[1])) idsInFunc.push(m[1]);
  }

  const missing = idsInFunc.filter(id => {
    const p = new RegExp(`id=["']${id}["']`);
    return !p.test(html);
  });

  if (missing.length === 0) {
    console.log(`[${agent.name}]: ✓ PERFECT! All ${idsInFunc.length} IDs match popup.html`);
  } else {
    console.log(`[${agent.name}]: ❌ MISSING ${missing.length} IDs:`);
    console.log(missing);
  }
});
