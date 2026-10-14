#!/usr/bin/env node

/**
 * content-extractor.mjs
 *
 * Renders a website with Playwright (headless Chromium), extracts structured
 * text content section-by-section for use in the demo builder pipeline.
 *
 * Enhanced content discovery:
 *   - Walks deeply nested DOMs to find real page sections
 *   - Clicks carousel arrows/dots to reveal all slides
 *   - Expands tabs and accordions to expose hidden content
 *   - Resolves lazy-loaded images (data-src, data-lazy, etc.)
 *   - Scans computed CSS background images (not just inline styles)
 *   - Snapshots background images while each tab/slide is active
 *   - Extracts video elements (poster + source URLs)
 *   - Downloads SVG logos and icons (skips only tiny inline data: SVGs)
 *
 * Usage:
 *   node docs/ai/scripts/content-extractor.mjs --url https://example.com --output ./docs/ai/demos/example
 *
 * Options:
 *   --url              URL to extract content from (required)
 *   --output           Output directory (required)
 *   --timeout          Page load timeout in ms (default: 30000)
 *   --wait             Extra wait after load in ms (default: 5000)
 *   --lang             Target language for translation hint in output (default: en)
 *   --download-images  Download all section images to <output>/images/
 *   --help             Show this help
 *
 * Output files:
 *   <output>/extracted-content.json     Structured content per section
 *
 * Requirements:
 *   npx playwright install chromium
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import https from 'https';
import http from 'http';

// ── Argument parsing ──────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(name, fallback = null) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  if (args[idx + 1] && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  return true;
}

if (args.includes('--help') || args.length === 0) {
  console.log(`
Usage: node docs/ai/scripts/content-extractor.mjs --url <URL> --output <DIR>

Options:
  --url              URL to extract content from (required)
  --output           Output directory (required)
  --timeout          Page load timeout in ms (default: 30000)
  --wait             Extra wait after load in ms (default: 5000)
  --lang             Target language hint (default: en)
  --download-images  Download all section images to <output>/images/
  --help             Show this help
  `);
  process.exit(0);
}

const siteUrl = getArg('url');
const outputDir = getArg('output');
const timeout = parseInt(getArg('timeout', '30000'), 10);
const extraWait = parseInt(getArg('wait', '5000'), 10);
const targetLang = getArg('lang', 'en');
const downloadImages = args.includes('--download-images');

if (!siteUrl) { console.error('Error: --url is required'); process.exit(1); }
if (!outputDir) { console.error('Error: --output is required'); process.exit(1); }

mkdirSync(outputDir, { recursive: true });

console.log(`[extractor] Starting: ${siteUrl}`);
console.log(`[extractor] Output: ${outputDir}`);

// ── Interaction limits (generic safeguards) ──────────────────
const MAX_TAB_CLICKS = 20;
const MAX_ACCORDION_CLICKS = 30;
const MAX_CAROUSEL_DOT_CLICKS = 40;
const MAX_ARROW_CLICKS_PER_CAROUSEL = 12;
const INTERACTION_DELAY_MS = 600;

// ── Main ─────────────────────────────────────────────────────
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
  });
  const page = await context.newPage();

  await page.goto(siteUrl, { waitUntil: 'domcontentloaded', timeout });
  await page.waitForTimeout(extraWait);

  // ── Dismiss popups and cookie banners ─────────────────────
  console.log('[extractor] Dismissing popups...');
  await page.evaluate(() => {
    const acceptPatterns = [
      /accept\s*(all)?/i, /agree/i, /allow\s*(all)?/i, /consent/i,
      /got\s*it/i, /ok(ay)?/i, /dismiss/i, /close/i, /reject\s*(all)?/i,
      /no\s*thanks/i, /×|✕|✖|╳/, /^x$/i,
    ];
    for (const el of document.querySelectorAll('button, a[role="button"], [role="button"]')) {
      const text = (el.textContent || el.ariaLabel || '').trim();
      if (text.length > 0 && text.length < 50) {
        for (const p of acceptPatterns) {
          if (p.test(text)) { try { el.click(); } catch {} break; }
        }
      }
    }
    for (const sel of ['#onetrust-accept-btn-handler', '.cc-btn.cc-allow', '.cc-dismiss']) {
      try { document.querySelector(sel)?.click(); } catch {}
    }
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
  await page.waitForTimeout(500);

  // ── Scroll full page to trigger lazy-loaded content ───────
  console.log('[extractor] Scrolling to trigger lazy content...');
  await page.evaluate(async () => {
    const scrollStep = 300;
    const delay = 300;
    const maxScroll = document.body.scrollHeight;
    for (let y = 0; y < maxScroll; y += scrollStep) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, delay));
    }
    // Scroll back up to trigger upward-loading observers
    for (let y = maxScroll; y >= 0; y -= scrollStep * 2) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2000);

  // ── Trigger IntersectionObserver-based loading ─────────────
  // Many sites load background images only when elements enter the viewport.
  // scrollIntoView each major element to ensure observers fire.
  await page.evaluate(async () => {
    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    const targets = document.querySelectorAll('section, article, [role="tabpanel"], [class*="section" i], [class*="block" i], main > *');
    for (const el of targets) {
      try { el.scrollIntoView({ behavior: 'instant' }); } catch {}
      await delay(300);
    }
    window.scrollTo(0, 0);
    await delay(300);
  });
  await page.waitForTimeout(1500);

  // ── Resolve lazy-loaded image sources ─────────────────────
  console.log('[extractor] Resolving lazy-loaded image sources...');
  const lazyResolved = await page.evaluate(() => {
    let resolved = 0;
    const lazyAttrs = ['data-src', 'data-lazy-src', 'data-original', 'data-lazy', 'data-image'];
    const lazySrcsetAttrs = ['data-srcset', 'data-lazy-srcset'];
    const lazyBgAttrs = ['data-bg', 'data-background-image', 'data-bg-src'];

    for (const el of document.querySelectorAll('img, picture source, video')) {
      for (const attr of lazyAttrs) {
        const val = el.getAttribute(attr);
        const src = el.getAttribute('src') || '';
        if (val && !val.startsWith('data:') && (!src || src.startsWith('data:') || src.includes('placeholder') || src.includes('blank') || src.includes('spacer'))) {
          el.setAttribute('src', val);
          resolved++;
          break;
        }
      }
      for (const attr of lazySrcsetAttrs) {
        const val = el.getAttribute(attr);
        if (val && !el.getAttribute('srcset')) {
          el.setAttribute('srcset', val);
          resolved++;
        }
      }
    }

    for (const el of document.querySelectorAll('*')) {
      for (const attr of lazyBgAttrs) {
        const val = el.getAttribute(attr);
        if (val && !val.startsWith('data:')) {
          el.style.backgroundImage = `url("${val}")`;
          resolved++;
          break;
        }
      }
    }

    return resolved;
  });
  console.log(`[extractor]   Resolved ${lazyResolved} lazy-loaded sources`);

  // ── Background image snapshot infrastructure ──────────────
  // getComputedStyle returns 'none' for hidden elements (inactive tabs, off-screen
  // carousel slides). We snapshot visible bg images while interacting with the page,
  // then inject them into the extraction phase.
  await page.evaluate(() => { window.__collectedBgImages = new Set(); });

  const snapshotBgImages = async () => {
    return await page.evaluate(() => {
      let count = 0;
      for (const el of document.querySelectorAll('*')) {
        const rect = el.getBoundingClientRect();
        if (rect.width < 50 || rect.height < 50) continue;
        try {
          const bg = getComputedStyle(el).backgroundImage;
          if (bg && bg !== 'none') {
            for (const m of bg.matchAll(/url\(["']?(.*?)["']?\)/g)) {
              const src = m[1];
              if (src && !src.startsWith('data:') && !src.includes('gradient')) {
                if (!window.__collectedBgImages.has(src)) {
                  window.__collectedBgImages.add(src);
                  count++;
                }
              }
            }
          }
        } catch {}
      }
      return count;
    });
  };

  // Initial snapshot (above-fold + scrolled-into-view content)
  let bgTotal = await snapshotBgImages();
  console.log(`[extractor]   Initial bg snapshot: ${bgTotal} images`);

  // ── Expand tabs ───────────────────────────────────────────
  console.log('[extractor] Expanding tabs...');
  const tabSelectors = [
    '[role="tab"]',
    '[data-toggle="tab"]',
    '[data-bs-toggle="tab"]',
    '[class*="tab-link" i]',
    '[class*="tab-trigger" i]',
    '[class*="tab-nav" i] a',
    '[class*="tab-nav" i] button',
    '[class*="filter-btn" i]',
    '[class*="category-btn" i]',
  ];

  // Deduplicate tab elements across selectors, skip tabs inside nav/header/cookie zones
  const tabEls = await page.evaluate((selectors) => {
    const isInsideSkipZone = (el) => {
      let cur = el;
      while (cur) {
        if (cur.tagName === 'NAV' || cur.tagName === 'HEADER') return true;
        if (cur.getAttribute && cur.getAttribute('role') === 'navigation') return true;
        const cl = (cur.className || '').toString().toLowerCase();
        if (cl.includes('cookie') || cl.includes('consent') || cl.includes('gdpr') || cl.includes('onetrust')) return true;
        if (cl.includes('modal')) return true;
        cur = cur.parentElement;
      }
      return false;
    };
    const seen = new Set();
    const tabs = [];
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) {
        if (isInsideSkipZone(el)) continue;
        const text = (el.textContent || '').trim();
        const key = text + '|' + (el.getAttribute('aria-controls') || el.getAttribute('href') || '');
        if (seen.has(key)) continue;
        seen.add(key);
        tabs.push(el);
      }
    }
    return tabs.length;
  }, tabSelectors);

  let tabsClicked = 0;
  for (let i = 0; i < Math.min(tabEls, MAX_TAB_CLICKS); i++) {
    await page.evaluate(({ selectors, idx }) => {
      const isInsideSkipZone = (el) => {
        let cur = el;
        while (cur) {
          if (cur.tagName === 'NAV' || cur.tagName === 'HEADER') return true;
          if (cur.getAttribute && cur.getAttribute('role') === 'navigation') return true;
          const cl = (cur.className || '').toString().toLowerCase();
          if (cl.includes('cookie') || cl.includes('consent') || cl.includes('gdpr') || cl.includes('onetrust')) return true;
          if (cl.includes('modal')) return true;
          cur = cur.parentElement;
        }
        return false;
      };
      const seen = new Set();
      const tabs = [];
      for (const sel of selectors) {
        for (const el of document.querySelectorAll(sel)) {
          if (isInsideSkipZone(el)) continue;
          const text = (el.textContent || '').trim();
          const key = text + '|' + (el.getAttribute('aria-controls') || el.getAttribute('href') || '');
          if (seen.has(key)) continue;
          seen.add(key);
          tabs.push(el);
        }
      }
      if (tabs[idx]) {
        try { tabs[idx].click(); } catch {}
      }
    }, { selectors: tabSelectors, idx: i });
    await page.waitForTimeout(INTERACTION_DELAY_MS);
    bgTotal += await snapshotBgImages();
    tabsClicked++;
  }
  console.log(`[extractor]   Tabs clicked: ${tabsClicked}, bg images: ${bgTotal}`);

  // ── Expand accordions ─────────────────────────────────────
  console.log('[extractor] Expanding accordions...');
  const accordionsClicked = await page.evaluate(async ({ maxClicks, delayMs }) => {
    let clicked = 0;
    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    // Skip elements inside navigation, header, cookie overlays, or modals
    const isInsideSkipZone = (el) => {
      let cur = el;
      while (cur) {
        if (cur.tagName === 'NAV' || cur.tagName === 'HEADER') return true;
        if (cur.matches && cur.matches(
          '[class*="cookie" i], [class*="consent" i], [class*="gdpr" i], [class*="onetrust" i], ' +
          '[class*="modal" i], [class*="nav" i]:not([class*="tab-nav" i]):not([class*="accordion-nav" i]), ' +
          '[id*="cookie" i], [id*="consent" i], [role="navigation"]'
        )) return true;
        cur = cur.parentElement;
      }
      return false;
    };

    const selectors = [
      '[data-toggle="collapse"]:not([aria-expanded="true"])',
      '[data-bs-toggle="collapse"]:not([aria-expanded="true"])',
      '[aria-expanded="false"]',
      'details:not([open]) > summary',
      '[class*="accordion" i] [class*="header" i]',
      '[class*="accordion" i] [class*="trigger" i]',
      '[class*="accordion" i] button',
      '[class*="collapsible" i] [class*="header" i]',
    ];
    const clickedEls = new Set();
    for (const sel of selectors) {
      if (clicked >= maxClicks) break;
      for (const el of document.querySelectorAll(sel)) {
        if (clicked >= maxClicks) break;
        if (clickedEls.has(el)) continue;
        if (isInsideSkipZone(el)) continue;
        try { el.click(); clickedEls.add(el); clicked++; await delay(delayMs); } catch {}
      }
    }
    return clicked;
  }, { maxClicks: MAX_ACCORDION_CLICKS, delayMs: 300 });
  console.log(`[extractor]   Accordions expanded: ${accordionsClicked}`);
  if (accordionsClicked > 0) {
    bgTotal += await snapshotBgImages();
  }

  // ── Cycle through carousels ───────────────────────────────
  // Uses ONLY carousel-specific selectors — not [role="tab"] which are tabs, not carousel dots.
  console.log('[extractor] Cycling through carousels...');

  // Strategy 1: Click carousel dots/pagination (NOT role="tab" — those are tabs)
  const dotSelectors = [
    '[class*="carousel" i] [class*="dot" i]',
    '[class*="carousel" i] [class*="indicator" i]',
    '[class*="carousel" i] [class*="pagination" i] button',
    '[class*="carousel" i] [class*="pagination" i] span[role="button"]',
    '[class*="slider" i] [class*="dot" i]',
    '[class*="slider" i] [class*="indicator" i]',
    '[class*="slider" i] [class*="pagination" i] button',
    '[class*="swiper" i] .swiper-pagination-bullet',
    '[class*="slick" i] .slick-dots li button',
  ];

  let dotsClicked = 0;
  const dotCount = await page.evaluate((selectors) => {
    const dots = new Set();
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) dots.add(el);
    }
    return dots.size;
  }, dotSelectors);

  for (let i = 0; i < Math.min(dotCount, MAX_CAROUSEL_DOT_CLICKS); i++) {
    await page.evaluate(({ selectors, idx }) => {
      const dots = new Set();
      for (const sel of selectors) {
        for (const el of document.querySelectorAll(sel)) dots.add(el);
      }
      const arr = [...dots];
      if (arr[idx]) try { arr[idx].click(); } catch {}
    }, { selectors: dotSelectors, idx: i });
    await page.waitForTimeout(INTERACTION_DELAY_MS);
    bgTotal += await snapshotBgImages();
    dotsClicked++;
  }

  // Strategy 2: Click next arrows
  const arrowSelectors = [
    '[class*="carousel" i] [class*="next" i]',
    '[class*="carousel" i] [class*="arrow-right" i]',
    '[class*="carousel" i] [aria-label*="next" i]',
    '[class*="slider" i] [class*="next" i]',
    '[class*="slider" i] [aria-label*="next" i]',
    '[class*="swiper" i] .swiper-button-next',
    '[class*="slick" i] .slick-next',
  ];

  let arrowSlides = 0;
  const arrowCount = await page.evaluate((selectors) => {
    const arrows = new Set();
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) arrows.add(el);
    }
    return arrows.size;
  }, arrowSelectors);

  for (let a = 0; a < arrowCount; a++) {
    for (let click = 0; click < MAX_ARROW_CLICKS_PER_CAROUSEL; click++) {
      const stopped = await page.evaluate(({ selectors, idx }) => {
        const arrows = new Set();
        for (const sel of selectors) {
          for (const el of document.querySelectorAll(sel)) arrows.add(el);
        }
        const arr = [...arrows];
        const arrow = arr[idx];
        if (!arrow) return true;
        if (arrow.disabled || arrow.getAttribute('aria-disabled') === 'true') return true;
        const cl = (arrow.className || '').toString().toLowerCase();
        if (cl.includes('disabled')) return true;
        try { arrow.click(); return false; } catch { return true; }
      }, { selectors: arrowSelectors, idx: a });
      if (stopped) break;
      await page.waitForTimeout(INTERACTION_DELAY_MS);
      bgTotal += await snapshotBgImages();
      arrowSlides++;
    }
  }

  console.log(`[extractor]   Dots clicked: ${dotsClicked}, Arrow slides: ${arrowSlides}, bg images: ${bgTotal}`);

  // ── Second lazy-load resolution pass ──────────────────────
  const lazyResolved2 = await page.evaluate(() => {
    let resolved = 0;
    const lazyAttrs = ['data-src', 'data-lazy-src', 'data-original', 'data-lazy', 'data-image'];
    for (const el of document.querySelectorAll('img, picture source, video')) {
      for (const attr of lazyAttrs) {
        const val = el.getAttribute(attr);
        const src = el.getAttribute('src') || '';
        if (val && !val.startsWith('data:') && (!src || src.startsWith('data:') || src.includes('placeholder') || src.includes('blank'))) {
          el.setAttribute('src', val);
          resolved++;
          break;
        }
      }
    }
    return resolved;
  });
  if (lazyResolved2 > 0) {
    console.log(`[extractor]   Second pass: ${lazyResolved2} more lazy sources resolved`);
    await page.waitForTimeout(1000);
  }

  // Read all collected background image URLs
  const collectedBgUrls = await page.evaluate(() => [...window.__collectedBgImages]);
  console.log(`[extractor]   Total background images collected: ${collectedBgUrls.length}`);

  // ── Extract content section by section ────────────────────
  console.log('[extractor] Extracting content...');
  const extractedContent = await page.evaluate(({ sourceUrl, preCollectedBgUrls }) => {
    // ── Helpers ──
    const getText = (el) => {
      if (!el) return '';
      return el.textContent?.trim().replace(/\s+/g, ' ') || '';
    };

    const isPlaceholderSrc = (src) => {
      if (!src) return true;
      if (src.startsWith('data:')) return true;
      if (src.includes('placeholder')) return true;
      if (src.includes('blank.')) return true;
      if (src.includes('spacer.')) return true;
      if (src.includes('1x1.')) return true;
      if (src.includes('pixel.')) return true;
      return false;
    };

    const isVisible = (el) => {
      if (!el) return false;
      const s = getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
    };

    const isImageReachable = (el) => {
      if (!el) return false;
      if (el.tagName === 'IMG') {
        const src = el.getAttribute('src') || '';
        if (!isPlaceholderSrc(src)) return true;
        for (const attr of ['data-src', 'data-lazy-src', 'data-original', 'data-lazy', 'data-image']) {
          if (el.getAttribute(attr) && !isPlaceholderSrc(el.getAttribute(attr))) return true;
        }
        return false;
      }
      if (el.tagName === 'SOURCE' || el.tagName === 'VIDEO') return true;
      return isVisible(el);
    };

    const isInsideCookieOverlay = (el) => {
      let current = el;
      while (current) {
        if (current.matches && current.matches('[class*="cookie" i], [class*="consent" i], [class*="gdpr" i], [class*="onetrust" i], [id*="cookie" i], [id*="consent" i]')) return true;
        current = current.parentElement;
      }
      return false;
    };

    const getAbsoluteUrl = (href) => {
      if (!href || href.startsWith('javascript:') || href === '#') return href || '#';
      try { return new URL(href, sourceUrl).href; } catch { return href; }
    };

    const getBestImgSrc = (el) => {
      const src = el.getAttribute('src');
      if (src && !isPlaceholderSrc(src)) return src;
      for (const attr of ['data-src', 'data-lazy-src', 'data-original', 'data-lazy', 'data-image']) {
        const val = el.getAttribute(attr);
        if (val && !isPlaceholderSrc(val)) return val;
      }
      const srcset = el.getAttribute('srcset') || el.getAttribute('data-srcset');
      if (srcset) {
        const candidates = srcset.split(',').map(s => s.trim().split(/\s+/));
        let best = candidates[0]?.[0];
        let bestW = 0;
        for (const [url, desc] of candidates) {
          const w = parseInt(desc) || 0;
          if (w > bestW) { bestW = w; best = url; }
        }
        return best || candidates[0]?.[0];
      }
      return null;
    };

    // ── Find page sections (recursive depth walk) ──────────
    const structuralTags = new Set(['section', 'article', 'header', 'footer', 'nav', 'div', 'aside']);
    const findSectionLevel = (root, maxDepth = 8) => {
      let el = root;
      for (let depth = 0; depth < maxDepth; depth++) {
        const kids = [...el.children].filter(c => structuralTags.has(c.tagName.toLowerCase()));
        if (kids.length >= 3) return kids;
        const bestWrapper = kids.sort((a, b) => b.children.length - a.children.length)[0] || el.children[0];
        if (!bestWrapper) break;
        el = bestWrapper;
      }
      return [...el.children].filter(c => structuralTags.has(c.tagName.toLowerCase()));
    };

    const mainEl = document.querySelector('main') || document.body;
    let sections = findSectionLevel(mainEl);

    const headerEl = document.querySelector('body > header, body > nav, body > div > header');
    const footerEl = document.querySelector('body > footer, body > div > footer');

    const allSections = [];
    if (headerEl && !sections.includes(headerEl)) allSections.push(headerEl);
    allSections.push(...sections);
    if (footerEl && !sections.includes(footerEl)) allSections.push(footerEl);

    // ── Extract each section ──────────────────────────────
    const result = [];
    let position = 0;
    const globalSeenImageSrcs = new Set();

    for (const section of allSections) {
      if (!isVisible(section)) continue;
      if (isInsideCookieOverlay(section)) continue;

      const sectionText = getText(section);
      const sectionMedia = section.querySelectorAll('img, video, picture');
      if (sectionText.length < 5 && sectionMedia.length === 0) continue;

      position++;

      // ── Headings ──
      const headings = [...section.querySelectorAll('h1, h2, h3, h4, h5, h6')]
        .filter(h => isVisible(h) && getText(h).length > 0)
        .map(h => ({ tag: h.tagName.toLowerCase(), text: getText(h) }));

      // ── Paragraphs ──
      const paragraphs = [...section.querySelectorAll('p, [class*="description" i], [class*="subtitle" i], [class*="lead" i]')]
        .filter(p => isVisible(p) && getText(p).length > 10)
        .map(p => getText(p))
        .filter((t, i, a) => a.indexOf(t) === i);

      // ── Links ──
      const links = [...section.querySelectorAll('a[href]')]
        .filter(a => {
          if (!isVisible(a)) return false;
          const text = getText(a);
          if (text.length === 0 || text.length > 100) return false;
          return text.length > 1 || a.matches('[class*="btn" i], [class*="button" i], [class*="cta" i], [role="button"]');
        })
        .map(a => ({ text: getText(a), href: getAbsoluteUrl(a.getAttribute('href')), target: a.getAttribute('target') || '' }))
        .filter((l, i, a) => a.findIndex(x => x.text === l.text && x.href === l.href) === i);

      // ── Images ──
      const images = [];
      const seenSrcs = new Set();

      const addImage = (src, alt, type, width, height) => {
        if (!src || src === '#') return;
        if (src.startsWith('data:') && src.length < 500) return;
        const resolved = getAbsoluteUrl(src);
        if (seenSrcs.has(resolved) || globalSeenImageSrcs.has(resolved)) return;
        seenSrcs.add(resolved);
        globalSeenImageSrcs.add(resolved);
        images.push({ src: resolved, alt: alt || '', type, width: width || null, height: height || null });
      };

      // <img> elements
      for (const img of section.querySelectorAll('img')) {
        if (!isImageReachable(img)) continue;
        const src = getBestImgSrc(img);
        if (src) addImage(src, img.getAttribute('alt'), 'img', img.naturalWidth, img.naturalHeight);
      }

      // <picture> <source> srcset
      for (const source of section.querySelectorAll('picture source[srcset], picture source[data-srcset]')) {
        const srcset = source.getAttribute('srcset') || source.getAttribute('data-srcset') || '';
        const candidates = srcset.split(',').map(s => s.trim().split(/\s+/));
        let best = candidates[0]?.[0];
        let bestW = 0;
        for (const [url, desc] of candidates) {
          const w = parseInt(desc) || 0;
          if (w > bestW) { bestW = w; best = url; }
        }
        if (best) addImage(best, '', 'srcset', null, null);
      }

      // Computed CSS background images on visible elements with meaningful size
      // Also check inside carousel/tab containers where children may be partially visible
      const bgCandidates = new Set();
      for (const el of section.querySelectorAll('*')) {
        const rect = el.getBoundingClientRect();
        if (rect.width >= 50 && rect.height >= 50) bgCandidates.add(el);
      }
      // Also include elements inside interactive containers regardless of size
      for (const el of section.querySelectorAll('[class*="slide" i] *, [class*="carousel" i] *, [class*="swiper" i] *, [class*="tab-panel" i] *, [class*="tab-content" i] *, [role="tabpanel"] *')) {
        bgCandidates.add(el);
      }
      for (const el of bgCandidates) {
        try {
          const bg = getComputedStyle(el).backgroundImage;
          if (bg && bg !== 'none') {
            for (const m of bg.matchAll(/url\(["']?(.*?)["']?\)/g)) {
              if (m[1] && !m[1].startsWith('data:') && !m[1].includes('gradient')) {
                addImage(m[1], '', 'background', null, null);
              }
            }
          }
        } catch {}
        for (const attr of ['data-bg', 'data-background-image', 'data-bg-src']) {
          const val = el.getAttribute(attr);
          if (val && !val.startsWith('data:')) addImage(val, '', 'background-lazy', null, null);
        }
      }

      // ── Videos ──
      const videos = [];
      for (const video of section.querySelectorAll('video')) {
        const poster = video.getAttribute('poster');
        const sources = [...video.querySelectorAll('source')]
          .map(s => ({ src: getAbsoluteUrl(s.getAttribute('src')), type: s.getAttribute('type') || '' }))
          .filter(s => s.src && s.src !== '#');
        const videoSrc = video.getAttribute('src');
        if (videoSrc && !sources.find(s => s.src === getAbsoluteUrl(videoSrc))) {
          sources.unshift({ src: getAbsoluteUrl(videoSrc), type: '' });
        }
        if (poster || sources.length > 0) {
          const entry = { type: 'video' };
          if (poster) {
            entry.poster = getAbsoluteUrl(poster);
            addImage(poster, 'Video poster', 'video-poster', null, null);
          }
          if (sources.length > 0) entry.sources = sources;
          videos.push(entry);
        }
      }
      for (const iframe of section.querySelectorAll('iframe[src]')) {
        const src = iframe.getAttribute('src') || '';
        if (src.includes('youtube') || src.includes('youtu.be') || src.includes('vimeo') || src.includes('wistia')) {
          videos.push({
            type: 'iframe-video',
            src: getAbsoluteUrl(src),
            provider: src.includes('youtube') || src.includes('youtu.be') ? 'youtube' : src.includes('vimeo') ? 'vimeo' : 'other',
          });
        }
      }

      // ── Repeated items (cards, list items, slides) ──
      const listItems = [];
      const repeatingContainers = section.querySelectorAll(
        '[class*="grid" i], [class*="cards" i], [class*="list" i], ' +
        '[class*="items" i], [class*="row" i], [class*="container" i], ' +
        '[class*="carousel" i], [class*="slider" i], [class*="swiper" i], [class*="slick" i]'
      );

      for (const container of repeatingContainers) {
        // Include hidden children (carousel slides, inactive tab content)
        const children = [...container.children].filter(c => {
          if (isVisible(c)) return true;
          const cl = (c.className || '').toString().toLowerCase();
          return cl.includes('slide') || cl.includes('item') || cl.includes('card');
        });
        if (children.length < 2) continue;

        const firstTag = children[0].tagName;
        const similarChildren = children.filter(c => c.tagName === firstTag);
        if (similarChildren.length < 2) continue;

        for (const child of similarChildren) {
          const item = {};

          const titleEl = child.querySelector('h1, h2, h3, h4, h5, h6, strong, [class*="title" i], [class*="name" i]');
          if (titleEl) item.title = getText(titleEl);

          const descEl = child.querySelector('p, [class*="description" i], [class*="text" i], [class*="body" i]');
          if (descEl) item.description = getText(descEl);

          const badgeEl = child.querySelector('[class*="badge" i], [class*="label" i], [class*="tag" i], [class*="chip" i]');
          if (badgeEl) item.badge = getText(badgeEl);

          const priceEl = child.querySelector('[class*="price" i], [class*="cost" i], [class*="amount" i]');
          if (priceEl) item.price = getText(priceEl);

          const linkEl = child.querySelector('a[href]');
          if (linkEl) item.link = { text: getText(linkEl), href: getAbsoluteUrl(linkEl.getAttribute('href')) };

          // Image — try <img>, then background image
          const imgEl = child.querySelector('img');
          if (imgEl) {
            const imgSrc = getBestImgSrc(imgEl);
            if (imgSrc) {
              item.image = { src: getAbsoluteUrl(imgSrc), alt: imgEl.getAttribute('alt') || '' };
              addImage(imgSrc, imgEl.getAttribute('alt'), 'list-item-img', imgEl.naturalWidth, imgEl.naturalHeight);
            }
          }
          if (!item.image) {
            const bgTargets = [child, ...child.querySelectorAll('[style*="background"], [data-bg], [class*="image" i], [class*="thumb" i], [class*="photo" i]')];
            for (const bgEl of bgTargets) {
              try {
                const bg = getComputedStyle(bgEl).backgroundImage;
                if (bg && bg !== 'none') {
                  const match = bg.match(/url\(["']?(.*?)["']?\)/);
                  if (match && !match[1].startsWith('data:') && !match[1].includes('gradient')) {
                    item.image = { src: getAbsoluteUrl(match[1]), alt: '' };
                    addImage(match[1], '', 'list-item-bg', null, null);
                    break;
                  }
                }
              } catch {}
              const dataBg = bgEl.getAttribute('data-bg') || bgEl.getAttribute('data-background-image');
              if (dataBg && !dataBg.startsWith('data:')) {
                item.image = { src: getAbsoluteUrl(dataBg), alt: '' };
                addImage(dataBg, '', 'list-item-bg-lazy', null, null);
                break;
              }
            }
          }

          if (item.title || item.description || item.image) listItems.push(item);
        }

        if (listItems.length > 0) break;
      }

      // ── Section metadata ──
      const sectionStyle = getComputedStyle(section);
      const bgColor = sectionStyle.backgroundColor;
      let backgroundHint = 'unknown';
      if (bgColor) {
        const rgb = bgColor.match(/\d+/g)?.map(Number) || [];
        if (rgb.length >= 3) {
          const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
          backgroundHint = brightness > 200 ? 'light' : brightness > 100 ? 'medium' : 'dark';
        }
      }

      const sectionData = {
        position,
        tagName: section.tagName.toLowerCase(),
        classHint: section.className?.toString().substring(0, 100) || '',
        backgroundHint,
        headings,
        paragraphs,
        links,
        images,
        listItems: listItems.length > 0 ? listItems : undefined,
      };
      if (videos.length > 0) sectionData.videos = videos;

      result.push(sectionData);
    }

    // ── Distribute pre-collected background images ──
    // These were captured during tab/carousel interaction when elements were visible.
    if (preCollectedBgUrls && preCollectedBgUrls.length > 0) {
      for (const bgUrl of preCollectedBgUrls) {
        const absUrl = getAbsoluteUrl(bgUrl);
        if (globalSeenImageSrcs.has(absUrl)) continue;

        // Match URL to section by checking if the section's HTML references it
        const urlFilename = bgUrl.split('/').pop()?.split('?')[0] || '';
        let matched = false;
        for (const sectionData of result) {
          const sectionEl = allSections[sectionData.position - 1];
          if (!sectionEl) continue;
          const html = sectionEl.innerHTML;
          if ((urlFilename && html.includes(urlFilename)) || html.includes(bgUrl)) {
            sectionData.images.push({ src: absUrl, alt: '', type: 'background-collected', width: null, height: null });
            globalSeenImageSrcs.add(absUrl);
            matched = true;
            break;
          }
        }
        if (!matched) {
          // Add to the first section that has content (avoid header/footer)
          const target = result.find(s => s.images.length > 0) || result[0];
          if (target) {
            target.images.push({ src: absUrl, alt: '', type: 'background-unmatched', width: null, height: null });
            globalSeenImageSrcs.add(absUrl);
          }
        }
      }
    }

    return result;
  }, { sourceUrl: siteUrl, preCollectedBgUrls: collectedBgUrls });

  // ── Detect source language ────────────────────────────────
  const detectedLang = await page.evaluate(() => {
    return document.documentElement.lang || document.querySelector('meta[http-equiv="content-language"]')?.content || 'unknown';
  });

  // ── Count extracted assets ─────────────────────────────────
  let totalImages = 0;
  let totalVideos = 0;
  for (const s of extractedContent) {
    totalImages += (s.images || []).length;
    totalVideos += (s.videos || []).length;
  }

  // ── Build output ──────────────────────────────────────────
  const output = {
    url: siteUrl,
    extractedAt: new Date().toISOString(),
    detectedLanguage: detectedLang,
    targetLanguage: targetLang,
    translationNeeded: detectedLang !== 'unknown' && !detectedLang.startsWith(targetLang),
    totalSections: extractedContent.length,
    totalImages,
    totalVideos,
    interactionStats: {
      lazySourcesResolved: lazyResolved + lazyResolved2,
      tabsClicked,
      accordionsExpanded: accordionsClicked,
      carouselDotsClicked: dotsClicked,
      carouselArrowSlides: arrowSlides,
      backgroundImagesCollected: collectedBgUrls.length,
    },
    sections: extractedContent,
  };

  writeFileSync(join(outputDir, 'extracted-content.json'), JSON.stringify(output, null, 2));
  console.log(`[extractor] extracted-content.json (${extractedContent.length} sections, ${totalImages} images, ${totalVideos} videos)`);
  console.log(`[extractor] Detected language: ${detectedLang}`);
  if (output.translationNeeded) {
    console.log(`[extractor] Translation needed: ${detectedLang} -> ${targetLang}`);
  }

  // ── Download images (optional) ─────────────────────────────
  if (downloadImages) {
    const imagesDir = join(outputDir, 'images');
    mkdirSync(imagesDir, { recursive: true });

    // Collect all unique image URLs
    const allImages = [];
    const seenUrls = new Set();
    const addToList = (img, sectionPos) => {
      if (!img.src || seenUrls.has(img.src)) return;
      seenUrls.add(img.src);
      allImages.push({ ...img, sectionPosition: sectionPos });
    };

    for (const section of extractedContent) {
      for (const img of (section.images || [])) addToList(img, section.position);
      for (const item of (section.listItems || [])) {
        if (item.image) addToList({ ...item.image, type: 'list-item' }, section.position);
      }
      for (const vid of (section.videos || [])) {
        if (vid.poster) addToList({ src: vid.poster, alt: 'Video poster', type: 'video-poster' }, section.position);
      }
    }

    console.log(`[extractor] Downloading ${allImages.length} images...`);

    const downloadFile = (url, dest) => new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      const req = protocol.get(url, {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Referer': siteUrl },
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redir = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
          downloadFile(redir, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => { writeFileSync(dest, Buffer.concat(chunks)); resolve(); });
        res.on('error', reject);
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    });

    const manifest = [];
    let dlOk = 0, dlFail = 0, dlSkip = 0;

    for (let i = 0; i < allImages.length; i++) {
      const img = allImages[i];
      try {
        const urlObj = new URL(img.src);
        let ext = extname(urlObj.pathname).replace('.', '').toLowerCase() || '';
        if (!ext || ext.length > 5) ext = 'jpg';
        if (ext === 'jpeg') ext = 'jpg';

        const safeName = `section${img.sectionPosition}-img${i + 1}.${ext}`;
        const localPath = join(imagesDir, safeName);

        // Skip tiny inline data: URIs
        if (img.src.startsWith('data:') && img.src.length < 1000) { dlSkip++; continue; }

        await downloadFile(img.src, localPath);

        // Skip tracking pixels (< 200 bytes, except SVGs which can be small but real)
        let fileSize = 0;
        try { fileSize = statSync(localPath).size; } catch {}
        if (fileSize < 200 && ext !== 'svg') { dlSkip++; continue; }

        manifest.push({
          src: img.src,
          alt: img.alt || '',
          localFile: safeName,
          extension: ext,
          sectionPosition: img.sectionPosition,
          type: img.type || 'unknown',
          fileSize,
          status: 'downloaded',
        });
        dlOk++;
      } catch (err) {
        manifest.push({
          src: img.src,
          alt: img.alt || '',
          localFile: null,
          sectionPosition: img.sectionPosition,
          type: img.type || 'unknown',
          status: 'failed',
          error: err.message,
        });
        dlFail++;
      }
    }

    writeFileSync(join(imagesDir, 'image-manifest.json'), JSON.stringify(manifest, null, 2));
    console.log(`[extractor] ${dlOk} downloaded, ${dlFail} failed, ${dlSkip} skipped -> ${imagesDir}/`);
  }

  await context.close();
  console.log('[extractor] Complete.');

} catch (err) {
  console.error(`[extractor] Error: ${err.message}`);
  process.exit(1);
} finally {
  await browser.close();
}
