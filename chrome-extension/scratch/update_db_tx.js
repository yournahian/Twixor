const fs = require('fs');

let code = fs.readFileSync('backend/config/db.js', 'utf8');

const target = code.substring(code.indexOf('  async getTransactions() {'), code.indexOf('    // 3. Fallback:'));
console.log('Target found length:', target.length);

const replacement = `  async getTransactions() {
    let systemTx = [];
    const txPath = path.join(__dirname, '../data/transactions.json');
    if (fs.existsSync(txPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(txPath, 'utf8'));
        if (Array.isArray(raw)) systemTx = raw;
      } catch (e) {}
    }

    if (supabase) {
      try {
        const { data } = await supabase.from('plans').select('features').eq('id', 'system_transactions').maybeSingle();
        if (data && Array.isArray(data.features) && data.features.length > 0) {
          systemTx = data.features;
        }
      } catch (e) {}
    }

    if (systemTx.length > 0) {
      return systemTx;
    }

`;

code = code.replace(target, replacement);

const recordMarker = 'const updated = [tx, ...existing.filter(e => e.id !== tx.id)].slice(0, 100);';
if (code.includes(recordMarker) && !code.includes('writeFileSync(txPath')) {
  const saveToFile = `const updated = [tx, ...existing.filter(e => e.id !== tx.id)].slice(0, 100);
      const txPath = path.join(__dirname, '../data/transactions.json');
      try {
        fs.mkdirSync(path.dirname(txPath), { recursive: true });
        fs.writeFileSync(txPath, JSON.stringify(updated, null, 2), 'utf8');
      } catch (e) {}`;
  code = code.replace(recordMarker, saveToFile);
}

fs.writeFileSync('backend/config/db.js', code, 'utf8');
console.log('Successfully updated backend/config/db.js');
