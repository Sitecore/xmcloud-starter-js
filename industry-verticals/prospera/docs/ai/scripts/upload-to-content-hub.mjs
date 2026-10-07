#!/usr/bin/env node

/**
 * upload-to-content-hub.mjs
 *
 * Uploads downloaded demo images to Sitecore Content Hub using the Upload API v2.
 * Reads the image-manifest.json produced by content-extractor.mjs --download-images.
 *
 * 3-step upload per file:
 *   1. POST /api/v2.0/upload          → get upload URL + identifiers
 *   2. POST /api/v2.0/upload/process  → upload file to the generated URL
 *   3. POST /api/v2.0/upload/finalize → finalize, get asset_id
 *
 * Usage:
 *   node docs/ai/scripts/upload-to-content-hub.mjs \
 *     --host https://your-instance.sitecorecontenthub.cloud \
 *     --token "Bearer eyJ..." \
 *     --images-dir docs/ai/demos/<client>/images \
 *     --config AssetUploadConfiguration \
 *     --dry-run
 *
 * Options:
 *   --host        Content Hub hostname (required, or set CH_HOST env var)
 *   --token       Bearer token (required, or set CH_TOKEN env var)
 *   --images-dir  Directory with downloaded images + image-manifest.json (required)
 *   --config      Upload configuration name (default: AssetUploadConfiguration)
 *   --delay       Delay between uploads in ms to avoid throttling (default: 500)
 *   --dry-run     Show upload plan without executing
 *   --help        Show this help
 *
 * Environment variables:
 *   CH_HOST       Content Hub hostname (alternative to --host)
 *   CH_TOKEN      Bearer token including "Bearer " prefix (alternative to --token)
 *
 * Output:
 *   Updates image-manifest.json with asset_id for each successfully uploaded image.
 *
 * Prerequisites:
 *   - Content Hub instance with upload permissions
 *   - OAuth token with upload access (create via Content Hub > Manage > OAuth clients)
 *   - Upload configuration entity must exist (default: AssetUploadConfiguration)
 */

import { readFileSync, writeFileSync, statSync } from 'fs';
import { join, basename } from 'path';
import https from 'https';
import http from 'http';

// ── Read image dimensions from file header (no dependencies) ──
function getImageDimensions(filePath) {
  try {
    const buf = readFileSync(filePath);
    // JPEG
    if (buf[0] === 0xFF && buf[1] === 0xD8) {
      let offset = 2;
      while (offset < buf.length) {
        if (buf[offset] !== 0xFF) break;
        const marker = buf[offset + 1];
        const len = buf.readUInt16BE(offset + 2);
        // SOF markers: C0-C3, C5-C7, C9-CB, CD-CF
        if ((marker >= 0xC0 && marker <= 0xC3) || (marker >= 0xC5 && marker <= 0xC7) ||
            (marker >= 0xC9 && marker <= 0xCB) || (marker >= 0xCD && marker <= 0xCF)) {
          const height = buf.readUInt16BE(offset + 5);
          const width = buf.readUInt16BE(offset + 7);
          return { width, height };
        }
        offset += 2 + len;
      }
    }
    // PNG
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      return { width, height };
    }
    // SVG — try to parse viewBox or width/height attributes
    if (buf[0] === 0x3C || buf.toString('utf8', 0, 5).includes('<?xml') || buf.toString('utf8', 0, 4) === '<svg') {
      const svgStr = buf.toString('utf8', 0, Math.min(buf.length, 2000));
      const vbMatch = svgStr.match(/viewBox=["'][\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)["']/);
      if (vbMatch) return { width: Math.round(parseFloat(vbMatch[1])), height: Math.round(parseFloat(vbMatch[2])) };
      const wMatch = svgStr.match(/width=["']([\d.]+)/);
      const hMatch = svgStr.match(/height=["']([\d.]+)/);
      if (wMatch && hMatch) return { width: Math.round(parseFloat(wMatch[1])), height: Math.round(parseFloat(hMatch[1])) };
    }
  } catch { /* ignore */ }
  return null;
}

// ── Args ──
const args = process.argv.slice(2);
function getArg(name, fallback = null) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--') ? args[idx + 1] : fallback;
}

if (args.includes('--help') || args.length === 0) {
  console.log(`
Usage:
  node upload-to-content-hub.mjs --host <URL> --images-dir <DIR> [auth options]

Auth (pick one):
  --token       Bearer token with "Bearer " prefix (or set CH_TOKEN env var)
  --user        Content Hub username (with --password for simple auth)
  --password    Content Hub password
  --client-id   OAuth client ID (with --client-secret, --user, --password for OAuth grant)
  --client-secret  OAuth client secret

Options:
  --host        Content Hub hostname (required, or set CH_HOST env var)
  --images-dir  Directory with images + image-manifest.json (required)
  --config      Upload config name (default: AssetUploadConfiguration)
  --delay       Delay between uploads in ms (default: 500)
  --dry-run     Show plan without uploading

Auth examples:
  Simple:  --user admin --password secret
  OAuth:   --client-id MyApp --client-secret xyz --user admin --password secret
  Token:   --token "Bearer eyJ..."
`);
  process.exit(0);
}

// ── Load credentials from local file (fallback for CLI args) ──
let creds = {};
const credsPath = join(
  getArg('project-root') || process.cwd(),
  'docs/ai/config/credentials.local.yaml'
);
try {
  const credsContent = readFileSync(credsPath, 'utf-8');
  // Simple YAML parser for flat contentHub fields
  const hostMatch = credsContent.match(/host:\s*"([^"]+)"/);
  const userMatch = credsContent.match(/user:\s*"([^"]+)"/);
  const passMatch = credsContent.match(/password:\s*"([^"]+)"/);
  const clientIdMatch = credsContent.match(/clientId:\s*"([^"]+)"/);
  const clientSecretMatch = credsContent.match(/clientSecret:\s*"([^"]+)"/);
  const tokenMatch = credsContent.match(/token:\s*"([^"]+)"/);
  const authMethodMatch = credsContent.match(/authMethod:\s*"([^"]+)"/);
  const configMatch = credsContent.match(/uploadConfig:\s*"([^"]+)"/);
  creds = {
    host: hostMatch?.[1] || '',
    user: userMatch?.[1] || '',
    password: passMatch?.[1] || '',
    clientId: clientIdMatch?.[1] || '',
    clientSecret: clientSecretMatch?.[1] || '',
    token: tokenMatch?.[1] || '',
    authMethod: authMethodMatch?.[1] || '',
    uploadConfig: configMatch?.[1] || '',
  };
  if (creds.host) console.log(`[config] Loaded credentials from ${credsPath}`);
} catch { /* file doesn't exist — use CLI args only */ }

// CLI args override credentials file, which overrides env vars
const host = (getArg('host') || process.env.CH_HOST || creds.host || '').replace(/\/+$/, '');
let token = getArg('token') || process.env.CH_TOKEN || creds.token || '';
const imagesDir = getArg('images-dir');
const uploadConfig = getArg('config') || creds.uploadConfig || 'AssetUploadConfiguration';
const delay = parseInt(getArg('delay', '500'), 10);
const dryRun = args.includes('--dry-run');
const chUser = getArg('user') || creds.user;
const chPassword = getArg('password') || creds.password;
const clientId = getArg('client-id') || creds.clientId;
const clientSecret = getArg('client-secret') || creds.clientSecret;

if (!host) { console.error('ERROR: --host or CH_HOST or credentials.local.yaml required'); process.exit(1); }
// ── Auto-authenticate if no token provided ──
if (!token && !dryRun) {
  if (chUser && chPassword && clientId && clientSecret) {
    // OAuth password grant
    console.log('[auth] Using OAuth password grant...');
    const authBody = `grant_type=password&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&username=${encodeURIComponent(chUser)}&password=${encodeURIComponent(chPassword)}`;
    const authRes = await fetch(`${host}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: authBody,
    });
    if (!authRes.ok) {
      console.error(`ERROR: OAuth auth failed: HTTP ${authRes.status} — ${await authRes.text()}`);
      process.exit(1);
    }
    const authJson = await authRes.json();
    token = `Bearer ${authJson.access_token}`;
    console.log(`[auth] OK — token expires in ${authJson.expires_in}s`);
  } else if (chUser && chPassword) {
    // Simple authentication (POST /api/authenticate)
    console.log('[auth] Using simple authentication...');
    const authRes = await fetch(`${host}/api/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: chUser, password: chPassword }),
    });
    if (!authRes.ok) {
      console.error(`ERROR: Simple auth failed: HTTP ${authRes.status} — ${await authRes.text()}`);
      process.exit(1);
    }
    const authJson = await authRes.json();
    token = authJson.token; // Used as X-Auth-Token header, not Bearer
    console.log('[auth] OK — simple token acquired (does not expire)');
  } else {
    console.error('ERROR: Provide --token, or --user + --password, or --user + --password + --client-id + --client-secret');
    process.exit(1);
  }
}
if (!imagesDir) { console.error('ERROR: --images-dir required'); process.exit(1); }

// ── Load manifest ──
const manifestPath = join(imagesDir, 'image-manifest.json');
let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
} catch (e) {
  console.error(`ERROR: Cannot read ${manifestPath}: ${e.message}`);
  process.exit(1);
}

const uploadable = manifest.filter(img => img.status === 'downloaded' && img.localFile);

console.log('Content Hub Upload Plan');
console.log('=======================\n');
console.log(`Host:       ${host}`);
console.log(`Config:     ${uploadConfig}`);
console.log(`Images dir: ${imagesDir}`);
console.log(`Uploadable: ${uploadable.length} of ${manifest.length} images\n`);

for (const img of uploadable) {
  const filePath = join(imagesDir, img.localFile);
  let size = 0;
  try { size = statSync(filePath).size; } catch { size = -1; }
  console.log(`  ${img.localFile} (${(size / 1024).toFixed(1)} KB) — section ${img.sectionPosition}`);
}

if (dryRun) {
  console.log('\nDRY RUN — no uploads performed.');
  process.exit(0);
}

// ── HTTP helpers ──
// Build auth headers based on token type
function authHeaders() {
  if (token.startsWith('Bearer ')) {
    return { 'Authorization': token };
  }
  // Simple auth token — uses X-Auth-Token header
  return { 'X-Auth-Token': token };
}

function request(method, url, headers, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const opts = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        ...authHeaders(),
        ...headers,
      },
    };

    const protocol = parsed.protocol === 'https:' ? https : http;
    const req = protocol.request(opts, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const rawBody = Buffer.concat(chunks).toString();
        let json = null;
        try { json = JSON.parse(rawBody); } catch { /* not JSON */ }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: json,
          rawBody,
        });
      });
    });
    req.on('error', reject);
    req.setTimeout(60000, () => { req.destroy(); reject(new Error('timeout')); });
    if (body) req.write(body);
    req.end();
  });
}

function uploadFile(url, filePath, fileName) {
  return new Promise((resolve, reject) => {
    const fileData = readFileSync(filePath);
    const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);

    const prefix = Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
      `Content-Type: application/octet-stream\r\n\r\n`
    );
    const suffix = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([prefix, fileData, suffix]);

    const parsed = new URL(url);
    const opts = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        ...authHeaders(),
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      },
    };

    const protocol = parsed.protocol === 'https:' ? https : http;
    const req = protocol.request(opts, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const rawBody = Buffer.concat(chunks).toString();
        let json = null;
        try { json = JSON.parse(rawBody); } catch { /* not JSON */ }
        resolve({ status: res.statusCode, body: json, rawBody });
      });
    });
    req.on('error', reject);
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('upload timeout')); });
    req.write(body);
    req.end();
  });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Upload loop ──
console.log('\nUploading...\n');
let succeeded = 0;
let failed = 0;

for (const img of uploadable) {
  const filePath = join(imagesDir, img.localFile);
  const fileName = img.localFile;
  let fileSize;
  try { fileSize = statSync(filePath).size; } catch {
    console.error(`  SKIP  ${fileName}: file not found`);
    img.uploadStatus = 'file-not-found';
    failed++;
    continue;
  }

  console.log(`  Uploading ${fileName} (${(fileSize / 1024).toFixed(1)} KB)...`);

  try {
    // Step 1: Request upload URL
    const step1Body = JSON.stringify({
      file_name: fileName,
      file_size: fileSize,
      upload_configuration: { name: uploadConfig },
      action: { name: 'NewAsset' },
    });

    const step1 = await request('POST', `${host}/api/v2.0/upload`, {
      'Content-Type': 'application/json',
    }, step1Body);

    if (step1.status !== 200 && step1.status !== 201) {
      throw new Error(`Step 1 failed: HTTP ${step1.status} — ${step1.rawBody.substring(0, 200)}`);
    }

    const uploadUrl = step1.headers['location'];
    const uploadIdentifier = step1.body?.upload_identifier;
    const fileIdentifier = step1.body?.file_identifier;

    if (!uploadUrl) throw new Error('Step 1: no Location header returned');

    // Step 2: Upload the file
    const fullUploadUrl = uploadUrl.startsWith('http') ? uploadUrl : `${host}${uploadUrl}`;
    const step2 = await uploadFile(fullUploadUrl, filePath, fileName);

    if (step2.status !== 200) {
      throw new Error(`Step 2 failed: HTTP ${step2.status} — ${step2.rawBody.substring(0, 200)}`);
    }

    // Step 3: Finalize
    const step3Body = JSON.stringify({
      upload_identifier: uploadIdentifier,
      file_identifier: fileIdentifier,
    });

    const step3 = await request('POST', `${host}/api/v2.0/upload/finalize`, {
      'Content-Type': 'application/json',
    }, step3Body);

    if (step3.status !== 200 && step3.status !== 201) {
      throw new Error(`Step 3 failed: HTTP ${step3.status} — ${step3.rawBody.substring(0, 200)}`);
    }

    const assetId = step3.body?.asset_id;
    const assetIdentifier = step3.body?.asset_identifier;

    // Step 4: Auto-approve (Created → Approved)
    const step4 = await request('POST', `${host}/api/entities/${assetId}/lifecycle/approve`, {});
    if (step4.status === 200) {
      img.approved = true;
    } else {
      img.approved = false;
      console.log(`    WARN  Approve failed (${step4.status}) — asset may need manual approval`);
    }

    // Step 5: Create public link with custom RelativeUrl: {assetId}-{cleanName}
    const cleanName = fileName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-');
    const relativeUrl = `${assetId}-${cleanName}`;
    const plBody = JSON.stringify({
      entitydefinition: { href: `${host}/api/entitydefinitions/M.PublicLink` },
      properties: { Resource: 'downloadOriginal', RelativeUrl: relativeUrl },
      relations: {
        AssetToPublicLink: { parents: [{ href: `${host}/api/entities/${assetId}` }] }
      }
    });
    const step5 = await request('POST', `${host}/api/entities`, {
      'Content-Type': 'application/json',
    }, plBody);

    let publicUrl = '';
    let versionHash = '';
    if (step5.status === 201 && step5.headers?.location) {
      // Get the public link entity to read RelativeUrl + VersionHash
      const plEntity = await request('GET', step5.headers.location, {});
      const relUrl = plEntity.body?.properties?.RelativeUrl || '';
      versionHash = plEntity.body?.properties?.VersionHash || '';
      publicUrl = relUrl ? `${host}/api/public/content/${relUrl}${versionHash ? '?v=' + versionHash : ''}` : '';
    } else {
      console.log(`    WARN  Public link creation failed (${step5.status}) — URL may not be publicly accessible`);
      publicUrl = `${host}/api/public/content/${assetIdentifier}`;
    }

    const thumbnailUrl = `${host}/api/gateway/${assetId}/thumbnail`;

    // Read image dimensions from local file (required by Next.js Image component)
    const dims = getImageDimensions(filePath);
    const widthAttr = dims ? ` width="${dims.width}"` : '';
    const heightAttr = dims ? ` height="${dims.height}"` : '';

    const imageFieldXml = `<Image src="${publicUrl}" dam-id="${assetIdentifier}"${widthAttr}${heightAttr} alt="${img.alt || fileName}" dam-content-type="Image" thumbnailsrc="${thumbnailUrl}" />`;

    img.uploadStatus = 'uploaded';
    img.assetId = assetId;
    img.assetIdentifier = assetIdentifier;
    img.publicUrl = publicUrl;
    img.thumbnailUrl = thumbnailUrl;
    img.width = dims?.width || null;
    img.height = dims?.height || null;
    img.imageFieldXml = imageFieldXml;

    console.log(`    OK  asset_id: ${assetId}, approved: ${img.approved}`);
    succeeded++;

  } catch (err) {
    console.error(`    FAIL  ${err.message}`);
    img.uploadStatus = 'failed';
    img.uploadError = err.message;
    failed++;
  }

  // Throttle to avoid performance impact
  if (delay > 0) await sleep(delay);
}

// ── Update manifest ──
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`\n=======================`);
console.log(`Uploaded: ${succeeded}/${uploadable.length}`);
if (failed > 0) console.log(`Failed:   ${failed}/${uploadable.length}`);
console.log(`Manifest updated: ${manifestPath}`);

if (succeeded > 0) {
  console.log(`\nNext step: Use the imageFieldXml values from image-manifest.json to set Image fields:`);
  console.log(`  update_fields_on_content_item(itemId, { "HeroImage": manifest[N].imageFieldXml })`);
  console.log(`\nExample imageFieldXml:`);
  const example = manifest.find(m => m.imageFieldXml);
  if (example) console.log(`  ${example.imageFieldXml}`);
}
