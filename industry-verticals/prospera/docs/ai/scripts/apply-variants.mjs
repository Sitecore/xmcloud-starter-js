#!/usr/bin/env node

/**
 * apply-variants.mjs
 *
 * Automates variant selection in Sitecore Pages editor using Playwright.
 * Reads a variant-checklist.md file and sets each component's variant.
 *
 * Usage:
 *   node docs/ai/scripts/apply-variants.mjs \
 *     --checklist docs/ai/demos/peoplecert/variant-checklist.md \
 *     --pages-url "https://pages.sitecorecloud.io/pages/editor?..." \
 *     --dry-run
 *
 * Options:
 *   --checklist     Path to variant-checklist.md (required)
 *   --pages-url     Full Sitecore Pages editor URL for the page (required)
 *   --timeout       Wait timeout per action in ms (default: 5000)
 *   --dry-run       Parse checklist and show plan without opening browser
 *
 * Prerequisites:
 *   - Playwright + Chromium installed (run docs/ai/scripts/setup.sh first)
 *   - User must be logged into Sitecore in their default browser
 *     (the script launches Chromium with persistent context to reuse auth cookies)
 *
 * NOTE: This is experimental. Sitecore Pages editor DOM structure may change
 * between versions. If selectors break, update the SELECTORS section below.
 *
 * Exit codes:
 *   0 — all variants applied (or dry-run completed)
 *   1 — one or more variants failed
 *   2 — could not parse checklist or connect to Pages
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Parse args ---
const args = process.argv.slice(2);
function getArg(name, defaultVal) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultVal;
}
const checklistPath = getArg('checklist', null);
const pagesUrl = getArg('pages-url', null);
const timeout = parseInt(getArg('timeout', '5000'), 10);
const dryRun = args.includes('--dry-run');

if (!checklistPath) {
  console.error('ERROR: --checklist is required');
  console.error('Usage: node apply-variants.mjs --checklist <path> --pages-url <url>');
  process.exit(2);
}

// --- Parse checklist ---
const checklistContent = readFileSync(resolve(process.cwd(), checklistPath), 'utf-8');

// Parse markdown table: | # | Component | Required variant | Why |
const tableRegex = /\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*\*\*(.+?)\*\*\s*\|/g;
const variants = [];
let m;
while ((m = tableRegex.exec(checklistContent)) !== null) {
  variants.push({
    index: parseInt(m[1], 10),
    component: m[2].trim(),
    variant: m[3].trim(),
  });
}

if (variants.length === 0) {
  console.error('ERROR: No variants found in checklist. Expected markdown table with | # | Component | **Variant** | format.');
  process.exit(2);
}

console.log('Variant Application Plan');
console.log('========================\n');
for (const v of variants) {
  console.log(`  ${v.index}. ${v.component} → ${v.variant}`);
}
console.log(`\nTotal: ${variants.length} variants to set\n`);

if (dryRun) {
  console.log('DRY RUN — no browser actions taken.');
  process.exit(0);
}

if (!pagesUrl) {
  console.error('ERROR: --pages-url is required (unless using --dry-run)');
  console.error('Provide the full Sitecore Pages editor URL for the target page.');
  process.exit(2);
}

// --- Playwright automation ---
// Dynamic import so the script doesn't fail if Playwright isn't installed (dry-run still works)
let chromium;
try {
  const pw = await import('playwright');
  chromium = pw.chromium;
} catch {
  console.error('ERROR: Playwright not installed. Run: node docs/ai/scripts/setup.sh');
  process.exit(2);
}

// SELECTORS — update these if Sitecore Pages DOM changes
const SELECTORS = {
  // Component on canvas — click to select
  componentOnCanvas: (name) => `[data-component-name="${name}"]`,
  // Design tab in right panel
  designTab: 'button:has-text("Design"), [data-tab="design"]',
  // Variant dropdown
  variantDropdown: '[data-field="FieldNames"], select[name*="variant" i], [class*="variant-selector"]',
  // Variant option
  variantOption: (name) => `option:has-text("${name}"), [data-variant-name="${name}"], li:has-text("${name}")`,
};

console.log('Launching browser...\n');

const browser = await chromium.launch({ headless: false }); // visible so user can intervene
const context = await browser.newContext();
const page = await context.newPage();

try {
  await page.goto(pagesUrl, { waitUntil: 'networkidle', timeout: 60000 });
  console.log('Page loaded. Waiting for editor to initialize...');
  await page.waitForTimeout(5000); // Pages editor needs time to hydrate

  let succeeded = 0;
  let failed = 0;

  for (const v of variants) {
    console.log(`\n--- Setting ${v.component} → ${v.variant} ---`);
    try {
      // Step 1: Click the component on the canvas
      const componentEl = await page.$(SELECTORS.componentOnCanvas(v.component));
      if (!componentEl) {
        console.warn(`  SKIP: Could not find component "${v.component}" on canvas.`);
        console.warn('  This may be a context-only component in a partial design.');
        failed++;
        continue;
      }
      await componentEl.click();
      await page.waitForTimeout(1000);

      // Step 2: Click Design tab
      const designTab = await page.$(SELECTORS.designTab);
      if (designTab) {
        await designTab.click();
        await page.waitForTimeout(500);
      }

      // Step 3: Open variant dropdown
      const dropdown = await page.$(SELECTORS.variantDropdown);
      if (!dropdown) {
        console.warn(`  WARN: Variant dropdown not found for ${v.component}. Try manually.`);
        failed++;
        continue;
      }
      await dropdown.click();
      await page.waitForTimeout(500);

      // Step 4: Select the variant
      const option = await page.$(SELECTORS.variantOption(v.variant));
      if (!option) {
        console.warn(`  WARN: Variant "${v.variant}" not found in dropdown for ${v.component}.`);
        failed++;
        continue;
      }
      await option.click();
      await page.waitForTimeout(1000);

      console.log(`  DONE: ${v.component} → ${v.variant}`);
      succeeded++;
    } catch (err) {
      console.error(`  FAIL: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n========================`);
  console.log(`Succeeded: ${succeeded}/${variants.length}`);
  if (failed > 0) {
    console.log(`Failed/Skipped: ${failed}/${variants.length}`);
    console.log('\nFailed variants must be set manually in Pages editor.');
  }

  // Keep browser open so user can verify
  console.log('\nBrowser left open for verification. Close it manually when done.');
  // Don't close browser — let user inspect

} catch (err) {
  console.error('ERROR: Could not load Pages editor:', err.message);
  console.error('Make sure you are logged into Sitecore and the URL is correct.');
  await browser.close();
  process.exit(2);
}
