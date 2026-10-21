/**
 * ATOMX ENGAGE / TWIXOR — RELEASE MANAGEMENT SERVICE
 * Handles extension packaging, file uploading, SHA-256 calculation,
 * and releases synchronization with the Official Website Portal and Extension Network.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../data');
const RELEASES_FILE = path.join(DATA_DIR, 'releases.json');
const WEBSITE_DIR = path.resolve(__dirname, '../../website');
const BACKEND_RELEASES_DIR = path.resolve(__dirname, '../public/releases');
const CHROME_EXT_DIR = path.resolve(__dirname, '../../chrome-extension');

// In-memory cache for ultra-fast response
let cachedData = null;

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(WEBSITE_DIR)) fs.mkdirSync(WEBSITE_DIR, { recursive: true });
  if (!fs.existsSync(BACKEND_RELEASES_DIR)) fs.mkdirSync(BACKEND_RELEASES_DIR, { recursive: true });
}

function calculateFileSha256(filePath) {
  try {
    if (!fs.existsSync(filePath)) return '';
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(buffer).digest('hex');
  } catch (e) {
    return '';
  }
}

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function getDefaultReleases() {
  // Check if real website/twixor-v2.4.0.zip exists to get exact size and hash
  const existingZipPath = path.join(WEBSITE_DIR, 'twixor-v2.4.0.zip');
  let realSize = 1739344;
  let realHash = '739b798336a6a826ab331268bb602d9c92daa77e9ff110f1709cc8ce2b31608d';

  if (fs.existsSync(existingZipPath)) {
    const stat = fs.statSync(existingZipPath);
    realSize = stat.size;
    realHash = calculateFileSha256(existingZipPath) || realHash;
  }

  return {
    activeVersion: '2.4.0',
    portalUrl: 'http://localhost:4173/#download',
    releases: [
      {
        version: '2.4.0',
        title: 'Twixor v2.4.0 — Deep Comment Traversal & Safety Pacing',
        minSupportedVersion: '1.0.0',
        releaseDate: '2026-10-20',
        releaseNotes: 'Enhanced endless comment traversal (300+ depth) in Reciprocator & CrowdFi, zero profile wait evaluation fix, unified tweet freshness synchronization across 9 intervals, and strict human safety cursor physics.',
        highlights: [
          'Smart Endless Comment Traversal (300+ depth)',
          'Zero Profile Wait Safety Evaluation Fix',
          'Tweet Freshness Synchronization across 9 intervals',
          'Strict Safety Cursor Physics & Bézier Trajectory'
        ],
        zipFileName: 'twixor-v2.4.0.zip',
        fileSizeBytes: realSize,
        fileSizeFormatted: formatBytes(realSize),
        checksumSha256: realHash,
        downloadUrl: 'twixor-v2.4.0.zip',
        portalDownloadUrl: 'http://localhost:4173/#download',
        hasRealRelease: true,
        createdAt: '2026-10-20T12:00:00.000Z'
      },
      {
        version: '2.3.1',
        title: 'v2.3.1 — Light Mode Perfection & Account Guard',
        minSupportedVersion: '1.0.0',
        releaseDate: '2026-10-18',
        releaseNotes: 'Refined Light Mode theming across Popup and Side Panel with contrast-checked borders. Pre-Action Account Lock verifying active profile before engagement.',
        highlights: ['Refined Light Mode UI', 'Pre-Action Account Lock'],
        zipFileName: 'twixor-v2.3.1.zip',
        fileSizeBytes: 1720000,
        fileSizeFormatted: '1.65 MB',
        checksumSha256: '',
        downloadUrl: 'twixor-v2.4.0.zip',
        portalDownloadUrl: 'http://localhost:4173/#download',
        hasRealRelease: true,
        createdAt: '2026-10-18T10:00:00.000Z'
      },
      {
        version: '2.2.0',
        title: 'v2.2.0 — Bézier Virtual Cursor & Discard Engine',
        minSupportedVersion: '1.0.0',
        releaseDate: '2026-10-15',
        releaseNotes: 'Introduced glowing on-screen cursor with cubic Bézier flight vectors and hand-tremor micro-jitters. Discard Dialog Protocol eradicating Twitter draft loops.',
        highlights: ['Bézier Virtual Cursor Physics', 'Twitter Draft Discard Dialog Protocol'],
        zipFileName: 'twixor-v2.2.0.zip',
        fileSizeBytes: 1690000,
        fileSizeFormatted: '1.6 MB',
        checksumSha256: '',
        downloadUrl: 'twixor-v2.4.0.zip',
        portalDownloadUrl: 'http://localhost:4173/#download',
        hasRealRelease: true,
        createdAt: '2026-10-15T08:00:00.000Z'
      }
    ]
  };
}

function loadReleasesData() {
  if (cachedData) return cachedData;
  ensureDirs();

  if (!fs.existsSync(RELEASES_FILE)) {
    const defaults = getDefaultReleases();
    fs.writeFileSync(RELEASES_FILE, JSON.stringify(defaults, null, 2), 'utf8');
    cachedData = defaults;
    return cachedData;
  }

  try {
    const raw = fs.readFileSync(RELEASES_FILE, 'utf8');
    cachedData = JSON.parse(raw);
    if (!cachedData.releases || !Array.isArray(cachedData.releases)) {
      cachedData = getDefaultReleases();
    }
  } catch (e) {
    cachedData = getDefaultReleases();
  }

  return cachedData;
}

function saveReleasesData(data) {
  ensureDirs();
  cachedData = data;
  fs.writeFileSync(RELEASES_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Returns active release with full metadata for system/version API
 */
function getActiveRelease() {
  const data = loadReleasesData();
  const activeVer = data.activeVersion || '2.4.0';
  const found = data.releases.find(r => r.version === activeVer) || data.releases[0];

  if (!found) {
    return {
      currentVersion: '2.4.0',
      minSupportedVersion: '1.0.0',
      releaseDate: '2026-10-20',
      releaseTitle: 'Twixor v2.4.0',
      releaseNotes: 'Latest stable release',
      downloadUrl: data.portalUrl || 'http://localhost:4173/#download',
      portalDownloadUrl: data.portalUrl || 'http://localhost:4173/#download',
      zipDownloadUrl: `http://localhost:4173/twixor-v2.4.0.zip`,
      zipFileName: 'twixor-v2.4.0.zip',
      fileSizeBytes: 1739344,
      fileSizeFormatted: '1.7 MB',
      checksumSha256: '739b798336a6a826ab331268bb602d9c92daa77e9ff110f1709cc8ce2b31608d',
      hasRealRelease: true
    };
  }

  const portalUrl = data.portalUrl || 'http://localhost:4173/#download';

  return {
    currentVersion: found.version,
    minSupportedVersion: found.minSupportedVersion || '1.0.0',
    releaseDate: found.releaseDate,
    releaseTitle: found.title,
    releaseNotes: found.releaseNotes,
    highlights: found.highlights || [],
    downloadUrl: portalUrl,
    portalDownloadUrl: portalUrl,
    zipDownloadUrl: found.zipFileName ? `http://localhost:4173/${found.zipFileName}` : portalUrl,
    zipFileName: found.zipFileName || `twixor-v${found.version}.zip`,
    fileSizeBytes: found.fileSizeBytes || 0,
    fileSizeFormatted: found.fileSizeFormatted || '1.7 MB',
    checksumSha256: found.checksumSha256 || '',
    hasRealRelease: true
  };
}

/**
 * Returns all releases and release configuration
 */
function getAllReleases() {
  const data = loadReleasesData();
  return {
    activeVersion: data.activeVersion || '2.4.0',
    portalUrl: data.portalUrl || 'http://localhost:4173/#download',
    releases: data.releases
  };
}

/**
 * Save / Upload a new release
 */
async function saveRelease({
  version,
  title,
  minSupportedVersion = '1.0.0',
  releaseNotes = '',
  highlights = [],
  portalDownloadUrl,
  zipBuffer,
  zipFileName,
  setActive = true
}) {
  ensureDirs();
  const cleanVer = (version || '').replace(/^v/, '').trim();
  if (!cleanVer) throw new Error('Release version is required (e.g. 2.4.1)');

  const finalZipFileName = zipFileName || `twixor-v${cleanVer}.zip`;
  let fileSize = 0;
  let sha256 = '';

  if (zipBuffer && zipBuffer.length > 0) {
    fileSize = zipBuffer.length;
    sha256 = crypto.createHash('sha256').update(zipBuffer).digest('hex');

    // Write file to both website directory and backend releases directory
    const websiteDest = path.join(WEBSITE_DIR, finalZipFileName);
    const backendDest = path.join(BACKEND_RELEASES_DIR, finalZipFileName);

    fs.writeFileSync(websiteDest, zipBuffer);
    fs.writeFileSync(backendDest, zipBuffer);
  } else {
    // If no buffer was passed, check if file exists in website directory
    const existingFile = path.join(WEBSITE_DIR, finalZipFileName);
    if (fs.existsSync(existingFile)) {
      const buf = fs.readFileSync(existingFile);
      fileSize = buf.length;
      sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    }
  }

  const data = loadReleasesData();
  const today = new Date().toISOString().split('T')[0];

  const newRelease = {
    version: cleanVer,
    title: title || `Twixor Suite v${cleanVer}`,
    minSupportedVersion: minSupportedVersion || '1.0.0',
    releaseDate: today,
    releaseNotes: releaseNotes || `Twixor v${cleanVer} update with security and performance improvements.`,
    highlights: Array.isArray(highlights) ? highlights : (highlights ? [highlights] : []),
    zipFileName: finalZipFileName,
    fileSizeBytes: fileSize,
    fileSizeFormatted: formatBytes(fileSize),
    checksumSha256: sha256,
    downloadUrl: finalZipFileName,
    portalDownloadUrl: portalDownloadUrl || data.portalUrl || 'http://localhost:4173/#download',
    hasRealRelease: true,
    createdAt: new Date().toISOString()
  };

  // Replace or prepend release
  const existingIdx = data.releases.findIndex(r => r.version === cleanVer);
  if (existingIdx >= 0) {
    data.releases[existingIdx] = newRelease;
  } else {
    data.releases.unshift(newRelease);
  }

  if (setActive) {
    data.activeVersion = cleanVer;
  }
  if (portalDownloadUrl) {
    data.portalUrl = portalDownloadUrl;
  }

  saveReleasesData(data);
  return newRelease;
}

/**
 * Automatically package extension directory into ZIP archive
 */
async function packageSourceRelease({
  version,
  title,
  minSupportedVersion = '1.0.0',
  releaseNotes = '',
  highlights = [],
  portalDownloadUrl = 'http://localhost:4173/#download',
  setActive = true
}) {
  ensureDirs();
  const archiver = require('archiver');
  const cleanVer = (version || '').replace(/^v/, '').trim();
  if (!cleanVer) throw new Error('Version is required for packaging extension.');

  const zipName = `twixor-v${cleanVer}.zip`;
  const websiteDest = path.join(WEBSITE_DIR, zipName);
  const backendDest = path.join(BACKEND_RELEASES_DIR, zipName);

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(websiteDest);
    const archive = typeof archiver === 'function'
      ? archiver('zip', { zlib: { level: 9 } })
      : (archiver.ZipArchive ? new archiver.ZipArchive({ zlib: { level: 9 } }) : new (require('archiver').ZipArchive)());

    output.on('close', () => {
      try {
        const fileBuffer = fs.readFileSync(websiteDest);
        // Copy to backend releases directory as well
        fs.writeFileSync(backendDest, fileBuffer);

        const fileSize = fileBuffer.length;
        const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        // Update manifest.json version if needed to match cleanVer
        const manifestPath = path.join(CHROME_EXT_DIR, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
          try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            if (manifest.version !== cleanVer) {
              manifest.version = cleanVer;
              fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
            }
          } catch (me) {}
        }

        const data = loadReleasesData();
        const today = new Date().toISOString().split('T')[0];

        const release = {
          version: cleanVer,
          title: title || `Twixor Suite v${cleanVer}`,
          minSupportedVersion: minSupportedVersion || '1.0.0',
          releaseDate: today,
          releaseNotes: releaseNotes || `Twixor v${cleanVer} packaged directly from latest production build.`,
          highlights: Array.isArray(highlights) ? highlights : (highlights ? [highlights] : []),
          zipFileName: zipName,
          fileSizeBytes: fileSize,
          fileSizeFormatted: formatBytes(fileSize),
          checksumSha256: sha256,
          downloadUrl: zipName,
          portalDownloadUrl: portalDownloadUrl || data.portalUrl || 'http://localhost:4173/#download',
          hasRealRelease: true,
          createdAt: new Date().toISOString()
        };

        const existingIdx = data.releases.findIndex(r => r.version === cleanVer);
        if (existingIdx >= 0) {
          data.releases[existingIdx] = release;
        } else {
          data.releases.unshift(release);
        }

        if (setActive) {
          data.activeVersion = cleanVer;
        }
        if (portalDownloadUrl) {
          data.portalUrl = portalDownloadUrl;
        }

        saveReleasesData(data);
        resolve(release);
      } catch (err) {
        reject(err);
      }
    });

    archive.on('error', (err) => reject(err));
    archive.pipe(output);

    // Add files from chrome-extension, ignoring temporary / scratch files
    archive.glob('**/*', {
      cwd: CHROME_EXT_DIR,
      ignore: ['scratch/**', 'node_modules/**', '.git/**', '*.log']
    });

    archive.finalize();
  });
}

/**
 * Set active release version
 */
function setActiveVersion(version) {
  const cleanVer = (version || '').replace(/^v/, '').trim();
  const data = loadReleasesData();
  const exists = data.releases.some(r => r.version === cleanVer);
  if (!exists) throw new Error(`Release v${cleanVer} does not exist in releases history.`);

  data.activeVersion = cleanVer;
  saveReleasesData(data);
  return getActiveRelease();
}

/**
 * Update release settings (e.g. portalUrl)
 */
function updateSettings(settings) {
  const data = loadReleasesData();
  if (settings.portalUrl) data.portalUrl = settings.portalUrl;
  if (settings.activeVersion) data.activeVersion = (settings.activeVersion || '').replace(/^v/, '').trim();
  saveReleasesData(data);
  return data;
}

/**
 * Delete a release by version
 */
function deleteRelease(version) {
  const cleanVer = (version || '').replace(/^v/, '').trim();
  const data = loadReleasesData();
  if (data.releases.length <= 1) {
    throw new Error('Cannot delete the only remaining release.');
  }

  data.releases = data.releases.filter(r => r.version !== cleanVer);
  if (data.activeVersion === cleanVer) {
    data.activeVersion = data.releases[0].version;
  }

  saveReleasesData(data);
  return getAllReleases();
}

module.exports = {
  getActiveRelease,
  getAllReleases,
  saveRelease,
  packageSourceRelease,
  setActiveVersion,
  updateSettings,
  deleteRelease,
  loadReleasesData
};
