#!/usr/bin/env node

/**
 * download-images.mjs
 *
 * Downloads all images referenced in a content-map.yaml to a local directory,
 * ready for upload to Sitecore Media Library via MCP's upload_asset tool.
 *
 * Usage:
 *   node docs/ai/scripts/download-images.mjs \
 *     --content-map docs/ai/demos/peoplecert/content-map.yaml \
 *     --theme-dir docs/ai/themes/peoplecert \
 *     --output docs/ai/demos/peoplecert/images
 *
 * Options:
 *   --content-map   Path to the content-map.yaml (required)
 *   --theme-dir     Path to the theme directory with scraper images (optional)
 *   --output        Directory to save downloaded images (required)
 *   --timeout       Download timeout per image in ms (default: 15000)
 *   --dry-run       List images to download without actually downloading
 *   --help          Show this help
 *
 * Output:
 *   <output>/                          Directory with downloaded images
 *   <output>/image-manifest.json       JSON manifest mapping field → local file → MCP upload params
 *
 * The image-manifest.json is consumed by the agent in Phase 3 to:
 *   1. Call upload_asset for each image
 *   2. Get the returned mediaItem.id
 *   3. Set the Image field: <image mediaid="{id}" />
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const args = process.argv.slice(2);
function getArg(name, fallback = null) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

if (args.includes('--help') || !getArg('content-map') || !getArg('output')) {
  console.log(`
Usage:
  node download-images.mjs --content-map <path> --output <dir> [--theme-dir <dir>] [--dry-run]

Options:
  --content-map   Path to content-map.yaml (required)
  --output        Output directory for images (required)
  --theme-dir     Theme directory with scraper-downloaded images (optional — reuses existing)
  --timeout       Timeout per download in ms (default: 15000)
  --dry-run       List images without downloading
`);
  process.exit(0);
}

const contentMapPath = getArg('content-map');
const themeDir = getArg('theme-dir');
const outputDir = getArg('output');
const timeout = parseInt(getArg('timeout', '15000'), 10);
const dryRun = args.includes('--dry-run');

// --- Parse content map (YAML-like, extract imageFields) ---
const content = readFileSync(contentMapPath, 'utf-8');

// Extract all image entries: field, src, alt
const imageEntries = [];
const fieldRegex = /- field: "(\w+)"\s*\n\s*src: "([^"]+)"\s*\n\s*alt: "([^"]*)"/g;
let m;
while ((m = fieldRegex.exec(content)) !== null) {
  imageEntries.push({ field: m[1], src: m[2], alt: m[3] });
}

// Also extract from children sections
const childImageRegex = /imageFields:\s*\n\s*- field: "(\w+)"\s*\n\s*src: "([^"]+)"\s*\n\s*alt: "([^"]*)"/g;
while ((m = childImageRegex.exec(content)) !== null) {
  if (!imageEntries.find(e => e.src === m[2])) {
    imageEntries.push({ field: m[1], src: m[2], alt: m[3] });
  }
}

// Extract component context for each image (look backward for componentName)
const lines = content.split('\n');
const enriched = imageEntries.map(img => {
  const lineIdx = lines.findIndex(l => l.includes(img.src));
  let componentName = 'unknown';
  for (let i = lineIdx; i >= 0; i--) {
    const match = lines[i].match(/componentName: "(\w+)"/);
    if (match) { componentName = match[1]; break; }
    const match2 = lines[i].match(/manifestName: "(\w+)"/);
    if (match2) { componentName = match2[1]; break; }
  }
  const ext = extname(new URL(img.src).pathname).replace('.', '') || 'jpg';
  const safeName = `${componentName}-${img.field}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return {
    ...img,
    componentName,
    localFileName: `${safeName}.${ext}`,
    extension: ext,
  };
});

console.log('Image Download Plan');
console.log('===================\n');
console.log(`Content map: ${contentMapPath}`);
console.log(`Output dir:  ${outputDir}`);
console.log(`Images found: ${enriched.length}\n`);

for (const img of enriched) {
  console.log(`  ${img.componentName}.${img.field} → ${img.localFileName}`);
  console.log(`    src: ${img.src}`);
}

if (dryRun) {
  console.log('\nDRY RUN — no downloads performed.');
  process.exit(0);
}

// --- Download ---
mkdirSync(outputDir, { recursive: true });

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout, headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }}, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        writeFileSync(dest, Buffer.concat(chunks));
        resolve();
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout for ${url}`)); });
  });
}

console.log('\nDownloading...\n');

const manifest = [];
let succeeded = 0;
let failed = 0;

for (const img of enriched) {
  const localPath = join(outputDir, img.localFileName);

  // Check if scraper already downloaded this image
  if (themeDir) {
    const scraperImages = join(themeDir, 'images');
    // Try matching by URL basename
    const srcBasename = basename(new URL(img.src).pathname);
    const scraperPath = join(scraperImages, srcBasename);
    if (existsSync(scraperPath)) {
      copyFileSync(scraperPath, localPath);
      console.log(`  COPY  ${img.localFileName} (from scraper cache)`);
      manifest.push({ ...img, localPath, status: 'downloaded', source: 'scraper-cache' });
      succeeded++;
      continue;
    }
  }

  try {
    await downloadFile(img.src, localPath);
    console.log(`  OK    ${img.localFileName}`);
    manifest.push({ ...img, localPath, status: 'downloaded', source: 'direct' });
    succeeded++;
  } catch (err) {
    console.error(`  FAIL  ${img.localFileName}: ${err.message}`);
    manifest.push({ ...img, localPath: null, status: 'failed', error: err.message });
    failed++;
  }
}

// --- Write manifest ---
const manifestPath = join(outputDir, 'image-manifest.json');
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`\n===================`);
console.log(`Downloaded: ${succeeded}/${enriched.length}`);
if (failed > 0) console.log(`Failed: ${failed}/${enriched.length}`);
console.log(`Manifest: ${manifestPath}`);
