const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4173;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.zip': 'application/zip',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  // API Endpoints fallback directly to backend releases data
  if (reqPath === '/api/system/version' || reqPath === '/api/releases/latest') {
    try {
      const releasesFilePath = path.join(__dirname, '../backend/data/releases.json');
      if (fs.existsSync(releasesFilePath)) {
        const raw = JSON.parse(fs.readFileSync(releasesFilePath, 'utf8'));
        const activeVer = raw.activeVersion || '2.4.0';
        const active = (raw.releases || []).find(r => r.version === activeVer) || (raw.releases && raw.releases[0]);
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        return res.end(JSON.stringify({
          currentVersion: active ? active.version : '2.4.0',
          minSupportedVersion: active ? active.minSupportedVersion : '1.0.0',
          releaseDate: active ? active.releaseDate : '2026-10-20',
          releaseTitle: active ? active.title : 'Twixor v2.4.0',
          releaseNotes: active ? active.releaseNotes : '',
          highlights: active ? active.highlights : [],
          downloadUrl: `http://localhost:${PORT}/#download`,
          portalDownloadUrl: `http://localhost:${PORT}/#download`,
          zipDownloadUrl: `http://localhost:${PORT}/${active ? active.zipFileName : 'twixor-v2.4.0.zip'}`,
          zipFileName: active ? active.zipFileName : 'twixor-v2.4.0.zip',
          fileSizeBytes: active ? active.fileSizeBytes : 1739344,
          fileSizeFormatted: active ? active.fileSizeFormatted : '1.7 MB',
          checksumSha256: active ? active.checksumSha256 : '739b798336a6a826ab331268bb602d9c92daa77e9ff110f1709cc8ce2b31608d',
          hasRealRelease: true
        }));
      }
    } catch (e) {}
  }

  const filePath = path.join(ROOT, reqPath);


  // Security check: ensure path is within ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Twixor Website Portal is running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
