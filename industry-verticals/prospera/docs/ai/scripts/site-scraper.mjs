#!/usr/bin/env node

/**
 * site-scraper.mjs
 *
 * Renders a website with Playwright (headless Chromium), extracts:
 *   - Full-page screenshot (desktop + mobile)
 *   - Hero section screenshot
 *   - Computed CSS tokens (colors, fonts, spacing, radii, shadows)
 *   Page load uses `waitUntil: 'load'` (not networkidle) so analytics-heavy sites complete.
 *   - Google Fonts / font-face URLs
 *   - Key images (logo, hero background, OG image)
 *   - Meta tags (theme-color, OG data)
 *
 * Usage:
 *   node scripts/site-scraper.mjs --url https://example.com --output ./docs/ai/themes/example
 *
 * Options:
 *   --url           URL to scrape (required)
 *   --output        Output directory for screenshots and data (required)
 *   --timeout       Page load timeout in ms (default: 30000)
 *   --wait          Extra wait after load in ms (default: 3000)
 *   --no-images     Skip downloading images
 *   --help          Show this help
 *
 * Output files:
 *   <output>/screenshot-desktop.png     Full page at 1440x900
 *   <output>/screenshot-mobile.png      Full page at 390x844
 *   <output>/screenshot-hero.png        Hero section only (top 900px)
 *   <output>/extracted-styles.json      Computed CSS tokens
 *   <output>/meta.json                  Meta tags, fonts, OG data
 *   <output>/images/logo.*              Downloaded logo if found
 *   <output>/images/hero-bg.*           Downloaded hero background if found
 *   <output>/images/og-image.*          Downloaded OG image if found
 *
 * Requirements:
 *   npx playwright install chromium
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { URL } from 'url';

// ── Argument parsing ──────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(name, fallback = null) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  if (args[idx] === `--${name}` && args[idx + 1] && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  return true;
}

if (args.includes('--help') || args.length === 0) {
  console.log(`
Usage: node scripts/site-scraper.mjs --url <URL> --output <DIR>

Options:
  --url           URL to scrape (required)
  --output        Output directory (required)
  --timeout       Page load timeout in ms (default: 30000)
  --wait          Extra wait after load in ms (default: 3000)
  --no-images     Skip image downloads
  --help          Show this help
  `);
  process.exit(0);
}

const siteUrl = getArg('url');
const outputDir = getArg('output');
const timeout = parseInt(getArg('timeout', '30000'), 10);
const extraWait = parseInt(getArg('wait', '3000'), 10);
const skipImages = args.includes('--no-images');

if (!siteUrl) { console.error('Error: --url is required'); process.exit(1); }
if (!outputDir) { console.error('Error: --output is required'); process.exit(1); }

// ── Ensure output directories exist ──────────────────────────
mkdirSync(outputDir, { recursive: true });
if (!skipImages) mkdirSync(join(outputDir, 'images'), { recursive: true });

console.log(`[scraper] Starting: ${siteUrl}`);
console.log(`[scraper] Output: ${outputDir}`);

// ── Main ─────────────────────────────────────────────────────
const browser = await chromium.launch({ headless: true });

try {
  // ── Desktop screenshots ────────────────────────────────────
  console.log('[scraper] Capturing desktop view...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
  });
  const desktopPage = await desktopContext.newPage();

  // `load` — many retail sites never reach `networkidle` (analytics, video, long-polling).
  await desktopPage.goto(siteUrl, { waitUntil: 'load', timeout });
  await desktopPage.waitForTimeout(extraWait);

  // ── Dismiss popups, cookie banners, overlays ─────────────
  console.log('[scraper] Dismissing popups and cookie banners...');
  const dismissedCount = await desktopPage.evaluate(() => {
    let dismissed = 0;

    // ── Strategy 1: Click common accept/close/dismiss buttons ──
    const buttonSelectors = [
      // Cookie consent buttons (text-based)
      'button', 'a[role="button"]', '[role="button"]', 'input[type="button"]',
    ];
    const acceptPatterns = [
      /accept\s*(all)?/i, /agree/i, /allow\s*(all)?/i, /consent/i,
      /got\s*it/i, /ok(ay)?/i, /understood/i, /continue/i,
      /dismiss/i, /close/i, /reject\s*(all)?/i, /decline/i,
      /no\s*thanks/i, /not\s*now/i, /later/i, /skip/i,
      /×|✕|✖|╳/,  // common close symbols
      /^x$/i,      // single "X" text
    ];

    for (const sel of buttonSelectors) {
      const elements = document.querySelectorAll(sel);
      for (const el of elements) {
        const text = (el.textContent || el.value || el.ariaLabel || '').trim();
        if (text.length > 0 && text.length < 50) {
          for (const pattern of acceptPatterns) {
            if (pattern.test(text)) {
              try {
                el.click();
                dismissed++;
              } catch {}
              break;
            }
          }
        }
      }
    }

    // ── Strategy 2: Click elements with cookie/consent-related attributes ──
    const attrSelectors = [
      '[data-testid*="cookie" i] button',
      '[data-testid*="consent" i] button',
      '[data-testid*="accept" i]',
      '[id*="cookie" i] button',
      '[id*="consent" i] button',
      '[class*="cookie" i] button',
      '[class*="consent" i] button',
      '[class*="gdpr" i] button',
      '[aria-label*="cookie" i]',
      '[aria-label*="consent" i]',
      '[aria-label*="close" i]',
      '[aria-label*="dismiss" i]',
      '.onetrust-close-btn-handler',
      '#onetrust-accept-btn-handler',
      '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
      '.cc-btn.cc-allow',
      '.cc-dismiss',
      '[data-click="accept"]',
      '.js-cookie-accept',
      '.cookie-accept',
      '.cookie-close',
    ];

    for (const sel of attrSelectors) {
      try {
        const el = document.querySelector(sel);
        if (el) {
          el.click();
          dismissed++;
        }
      } catch {}
    }

    // ── Strategy 3: Hide overlay/modal elements via CSS ──
    const overlaySelectors = [
      '[class*="cookie" i]', '[class*="consent" i]', '[class*="gdpr" i]',
      '[class*="popup" i]', '[class*="overlay" i]', '[class*="modal" i]',
      '[id*="cookie" i]', '[id*="consent" i]', '[id*="gdpr" i]',
      '[class*="banner" i][class*="notice" i]',
      '.onetrust-pc-dark-filter', '#onetrust-banner-sdk',
      '#CybotCookiebotDialog', '#CybotCookiebotDialogBodyUnderlay',
      '[class*="newsletter" i][class*="popup" i]',
      '[class*="subscribe" i][class*="popup" i]',
      '[class*="notification" i][class*="bar" i]',
    ];

    for (const sel of overlaySelectors) {
      try {
        const elements = document.querySelectorAll(sel);
        for (const el of elements) {
          const style = getComputedStyle(el);
          // Only hide elements that look like overlays (fixed/sticky positioning, high z-index)
          if (
            style.position === 'fixed' || style.position === 'sticky' ||
            parseInt(style.zIndex) > 100 ||
            style.position === 'absolute' && parseInt(style.zIndex) > 900
          ) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            dismissed++;
          }
        }
      } catch {}
    }

    // ── Strategy 4: Restore body scroll if frozen by modal ──
    document.body.style.overflow = 'auto';
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.overflowY = 'auto';

    return dismissed;
  });

  if (dismissedCount > 0) {
    console.log(`[scraper] ✓ Dismissed/hidden ${dismissedCount} popup elements`);
    await desktopPage.waitForTimeout(500); // wait for animations to settle
  } else {
    console.log('[scraper] No popups detected');
  }

  // Cookie/region flows may navigate after clicks — re-attach to the live document.
  try {
    await desktopPage.waitForLoadState('load', { timeout: 20000 });
  } catch {
    /* already settled */
  }
  await desktopPage.waitForTimeout(800);

  // Scroll down and back to trigger lazy-loaded content
  const scrollFullCycle = async () => {
    await desktopPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await desktopPage.waitForTimeout(500);
  };
  try {
    await scrollFullCycle();
  } catch (e) {
    const msg = e?.message || '';
    if (msg.includes('Execution context was destroyed')) {
      console.log('[scraper] Navigation after dismiss — waiting for load, retrying scroll...');
      try {
        await desktopPage.waitForLoadState('load', { timeout: 30000 });
      } catch {
        /* ignore */
      }
      await desktopPage.waitForTimeout(1000);
      try {
        await scrollFullCycle();
      } catch {
        console.log('[scraper] ⚠ Scroll skipped after navigation');
      }
    } else {
      throw e;
    }
  }

  // Full page screenshot
  await desktopPage.screenshot({
    path: join(outputDir, 'screenshot-desktop.png'),
    fullPage: true,
  });
  console.log('[scraper] ✓ screenshot-desktop.png');

  // Hero section (top viewport)
  await desktopPage.screenshot({
    path: join(outputDir, 'screenshot-hero.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });
  console.log('[scraper] ✓ screenshot-hero.png');

  // ── Extract computed styles ────────────────────────────────
  console.log('[scraper] Extracting computed styles...');
  const extractedStyles = await desktopPage.evaluate(() => {
    const cs = (el) => el ? getComputedStyle(el) : null;

    // Helper: get first matching element
    const q = (sel) => document.querySelector(sel);
    const qa = (sel) => [...document.querySelectorAll(sel)];

    // ─ Colors ─
    const body = q('body');
    const bodyStyle = cs(body);
    const header = q('header') || q('nav') || q('[role="banner"]');
    const headerStyle = cs(header);
    const footer = q('footer') || q('[role="contentinfo"]');
    const footerStyle = cs(footer);
    const hero = q('[class*="hero"]') || q('[class*="banner"]') || q('main > section:first-child') || q('main > div:first-child');
    const heroStyle = cs(hero);

    // Find primary action buttons
    const buttons = qa('a[class*="btn"], a[class*="button"], button[class*="btn"], button[class*="button"], a[class*="cta"], .btn, .button, [class*="primary"]')
      .filter(el => {
        const s = cs(el);
        return s && s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent';
      });
    const primaryButton = buttons[0];
    const primaryButtonStyle = cs(primaryButton);

    // Find links
    const links = qa('a').filter(el => {
      const s = cs(el);
      return s && s.color !== bodyStyle?.color;
    });
    const linkStyle = cs(links[0]);

    // ─ Typography ─
    const h1 = q('h1');
    const h2 = q('h2');
    const h3 = q('h3');
    const p = q('p');

    // ─ Shape — broader card detection ─
    const cardCandidates = qa(
      '[class*="card" i], [class*="Card"], .card, ' +
      '[class*="tile" i], [class*="feature" i], [class*="product" i], ' +
      '[class*="item" i][class*="list" i], article'
    ).filter(el => {
      const s = cs(el);
      // Cards typically have visible background, border, shadow, or rounded corners
      return s && (
        (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') ||
        s.boxShadow !== 'none' ||
        s.borderRadius !== '0px' ||
        (s.borderWidth && s.borderWidth !== '0px')
      );
    });
    const cardStyle = cs(cardCandidates[0]);
    const images = qa('main img, [class*="hero"] img, article img, section img');
    const imgStyle = cs(images[0]);

    // ─ Helper: walk up to nearest non-transparent background ─
    const findBgColor = (el, maxDepth = 5) => {
      let current = el;
      let depth = 0;
      while (current && depth < maxDepth) {
        const s = cs(current);
        if (s && s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') {
          return s.backgroundColor;
        }
        current = current.parentElement;
        depth++;
      }
      return null;
    };

    // ─ Container max-width detection ─
    const containerCandidates = qa(
      '[class*="container" i], [class*="wrapper" i], [class*="content" i], main > div, main'
    ).filter(el => {
      const s = cs(el);
      return s && s.maxWidth && s.maxWidth !== 'none' && s.maxWidth !== '0px';
    });
    const containerMaxWidth = cs(containerCandidates[0])?.maxWidth || null;

    // ─ CSS custom properties from :root ─
    const rootStyles = cs(document.documentElement);
    const cssVars = {};
    // Try to read common variable names
    const commonVarNames = [
      '--primary', '--secondary', '--accent', '--background', '--foreground',
      '--muted', '--border', '--ring', '--radius',
      '--color-primary', '--color-secondary', '--color-accent',
      '--brand-primary', '--brand-secondary',
      '--font-heading', '--font-body', '--font-sans', '--font-serif',
    ];
    for (const name of commonVarNames) {
      const val = rootStyles.getPropertyValue(name).trim();
      if (val) cssVars[name] = val;
    }

    return {
      colors: {
        bodyBackground: bodyStyle?.backgroundColor,
        bodyColor: bodyStyle?.color,
        headerBackground: headerStyle?.backgroundColor || findBgColor(header),
        headerColor: headerStyle?.color,
        footerBackground: footerStyle?.backgroundColor !== 'rgba(0, 0, 0, 0)'
          ? footerStyle?.backgroundColor
          : findBgColor(footer),
        footerColor: footerStyle?.color,
        heroBackground: heroStyle?.backgroundColor !== 'rgba(0, 0, 0, 0)'
          ? heroStyle?.backgroundColor
          : findBgColor(hero),
        primaryButtonBackground: primaryButtonStyle?.backgroundColor,
        primaryButtonColor: primaryButtonStyle?.color,
        primaryButtonBorderRadius: primaryButtonStyle?.borderRadius,
        linkColor: linkStyle?.color,
      },
      typography: {
        bodyFontFamily: bodyStyle?.fontFamily,
        bodyFontSize: bodyStyle?.fontSize,
        bodyFontWeight: bodyStyle?.fontWeight,
        bodyLineHeight: bodyStyle?.lineHeight,
        h1FontFamily: cs(h1)?.fontFamily,
        h1FontSize: cs(h1)?.fontSize,
        h1FontWeight: cs(h1)?.fontWeight,
        h1LetterSpacing: cs(h1)?.letterSpacing,
        h1TextTransform: cs(h1)?.textTransform,
        h2FontFamily: cs(h2)?.fontFamily,
        h2FontSize: cs(h2)?.fontSize,
        h2FontWeight: cs(h2)?.fontWeight,
        h3FontFamily: cs(h3)?.fontFamily,
        h3FontSize: cs(h3)?.fontSize,
        h3FontWeight: cs(h3)?.fontWeight,
        pFontSize: cs(p)?.fontSize,
        pLineHeight: cs(p)?.lineHeight,
      },
      shape: {
        cardBorderRadius: cardStyle?.borderRadius,
        cardBoxShadow: cardStyle?.boxShadow,
        cardBorder: cardStyle?.border,
        imgBorderRadius: imgStyle?.borderRadius,
      },
      spacing: {
        heroMinHeight: heroStyle?.minHeight,
        heroPadding: heroStyle?.padding,
        containerMaxWidth: containerMaxWidth,
      },
      cssVariables: cssVars,
    };
  });

  writeFileSync(
    join(outputDir, 'extracted-styles.json'),
    JSON.stringify(extractedStyles, null, 2)
  );
  console.log('[scraper] ✓ extracted-styles.json');

  // ── Extract meta tags, fonts, and OG data ──────────────────
  console.log('[scraper] Extracting meta and fonts...');
  const meta = await desktopPage.evaluate(() => {
    const getMeta = (name) => {
      const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      return el?.getAttribute('content') || null;
    };

    // Google Fonts links
    const fontLinks = [...document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]')]
      .map(el => el.href);

    // @font-face from stylesheets (same-origin only)
    const fontFaces = [];
    try {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSFontFaceRule) {
              fontFaces.push({
                family: rule.style.fontFamily?.replace(/['"]/g, ''),
                src: rule.style.src,
                weight: rule.style.fontWeight,
              });
            }
          }
        } catch { /* cross-origin stylesheets will throw */ }
      }
    } catch { /* ignore */ }

    // Logo candidates — exclude cookie/consent/overlay elements
    const cookieOverlaySelectors = [
      '[class*="cookie" i]', '[class*="consent" i]', '[class*="gdpr" i]',
      '[class*="onetrust" i]', '[class*="cookiebot" i]', '[class*="privacy" i]',
      '[id*="cookie" i]', '[id*="consent" i]', '[id*="onetrust" i]',
    ].join(', ');

    const isInsideCookieOverlay = (el) => {
      let current = el;
      while (current) {
        if (current.matches && current.matches(cookieOverlaySelectors)) return true;
        current = current.parentElement;
      }
      return false;
    };

    const logoCandidates = [
      ...document.querySelectorAll(
        'header img, nav img, [class*="logo" i] img, a[class*="logo" i] img, ' +
        '[aria-label*="logo" i] img, [class*="brand" i] img, ' +
        'header svg, nav svg, [class*="logo" i] svg'
      ),
    ]
      .filter(el => !isInsideCookieOverlay(el))
      .map(el => {
        if (el.tagName === 'SVG') return 'svg-inline';
        if (el.src) return el.src;
        return null;
      })
      .filter(Boolean)
      .filter(url => {
        // Exclude known cookie/consent CDN domains
        if (typeof url !== 'string') return true;
        const lc = url.toLowerCase();
        return !lc.includes('cookielaw.org') &&
               !lc.includes('cookiebot') &&
               !lc.includes('onetrust') &&
               !lc.includes('consent') &&
               !lc.includes('privacy');
      });

    // Hero background image
    const hero = document.querySelector('[class*="hero"], [class*="banner"], main > section:first-child');
    let heroBgImage = null;
    if (hero) {
      const bg = getComputedStyle(hero).backgroundImage;
      if (bg && bg !== 'none') {
        const match = bg.match(/url\(["']?(.*?)["']?\)/);
        if (match) heroBgImage = match[1];
      }
    }

    return {
      title: document.title,
      themeColor: getMeta('theme-color'),
      msColor: getMeta('msapplication-TileColor'),
      ogTitle: getMeta('og:title'),
      ogDescription: getMeta('og:description'),
      ogImage: getMeta('og:image'),
      ogSiteName: getMeta('og:site_name'),
      favicon: document.querySelector('link[rel*="icon"]')?.href,
      googleFontsLinks: fontLinks,
      fontFaces,
      logoCandidates,
      heroBgImage,
    };
  });

  writeFileSync(
    join(outputDir, 'meta.json'),
    JSON.stringify(meta, null, 2)
  );
  console.log('[scraper] ✓ meta.json');

  // ── Download key images ────────────────────────────────────
  if (!skipImages) {
    console.log('[scraper] Downloading images...');

    const downloadImage = async (url, filename) => {
      if (!url || url === 'svg-inline') return;
      try {
        const fullUrl = new URL(url, siteUrl).href;
        const response = await desktopPage.request.get(fullUrl);
        if (response.ok()) {
          const contentType = response.headers()['content-type'] || '';
          let ext = extname(new URL(fullUrl).pathname) || '.png';
          if (contentType.includes('svg')) ext = '.svg';
          else if (contentType.includes('webp')) ext = '.webp';
          else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = '.jpg';
          else if (contentType.includes('png')) ext = '.png';

          const buffer = await response.body();
          writeFileSync(join(outputDir, 'images', `${filename}${ext}`), buffer);
          console.log(`[scraper] ✓ images/${filename}${ext}`);
        }
      } catch (err) {
        console.log(`[scraper] ⚠ Could not download ${filename}: ${err.message}`);
      }
    };

    // Logo
    if (meta.logoCandidates.length > 0) {
      await downloadImage(meta.logoCandidates[0], 'logo');
    }

    // Hero background
    if (meta.heroBgImage) {
      await downloadImage(meta.heroBgImage, 'hero-bg');
    }

    // OG image
    if (meta.ogImage) {
      await downloadImage(meta.ogImage, 'og-image');
    }

    // Favicon
    if (meta.favicon) {
      await downloadImage(meta.favicon, 'favicon');
    }
  }

  await desktopContext.close();

  // ── Mobile screenshot ──────────────────────────────────────
  console.log('[scraper] Capturing mobile view...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();

  await mobilePage.goto(siteUrl, { waitUntil: 'load', timeout });
  await mobilePage.waitForTimeout(extraWait);

  // Dismiss popups on mobile too (they often differ from desktop)
  await mobilePage.evaluate(() => {
    const acceptPatterns = [
      /accept\s*(all)?/i, /agree/i, /allow\s*(all)?/i, /consent/i,
      /got\s*it/i, /ok(ay)?/i, /dismiss/i, /close/i, /reject\s*(all)?/i,
      /no\s*thanks/i, /×|✕|✖|╳/, /^x$/i,
    ];
    // Click buttons
    for (const el of document.querySelectorAll('button, a[role="button"], [role="button"]')) {
      const text = (el.textContent || el.ariaLabel || '').trim();
      if (text.length > 0 && text.length < 50) {
        for (const p of acceptPatterns) {
          if (p.test(text)) { try { el.click(); } catch {} break; }
        }
      }
    }
    // Click known selectors
    for (const sel of ['#onetrust-accept-btn-handler', '.cc-btn.cc-allow', '.cc-dismiss', '[aria-label*="close" i]']) {
      try { document.querySelector(sel)?.click(); } catch {}
    }
    // Hide fixed/sticky overlays
    for (const sel of ['[class*="cookie" i]', '[class*="consent" i]', '[class*="popup" i]', '[class*="overlay" i]', '[class*="modal" i]']) {
      try {
        for (const el of document.querySelectorAll(sel)) {
          const s = getComputedStyle(el);
          if (s.position === 'fixed' || s.position === 'sticky' || parseInt(s.zIndex) > 100) {
            el.style.display = 'none';
          }
        }
      } catch {}
    }
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  });
  await mobilePage.waitForTimeout(500);

  await mobilePage.screenshot({
    path: join(outputDir, 'screenshot-mobile.png'),
    fullPage: true,
  });
  console.log('[scraper] ✓ screenshot-mobile.png');

  await mobileContext.close();

  // ── Done ───────────────────────────────────────────────────
  console.log('[scraper] Complete. Output files:');
  console.log(`  ${join(outputDir, 'screenshot-desktop.png')}`);
  console.log(`  ${join(outputDir, 'screenshot-mobile.png')}`);
  console.log(`  ${join(outputDir, 'screenshot-hero.png')}`);
  console.log(`  ${join(outputDir, 'extracted-styles.json')}`);
  console.log(`  ${join(outputDir, 'meta.json')}`);
  if (!skipImages) console.log(`  ${join(outputDir, 'images/')}`);

} catch (err) {
  console.error(`[scraper] Error: ${err.message}`);
  process.exit(1);
} finally {
  await browser.close();
}
