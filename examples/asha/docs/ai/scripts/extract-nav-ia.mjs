/**
 * Extract main navigation (L1–L3) from a homepage for get-site-ia.
 * Usage: node docs/ai/scripts/extract-nav-ia.mjs --url https://example.com/ --out docs/ai/ia/_tmp-nav.json
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const url = arg('--url');
const out = arg('--out', 'docs/ai/ia/_tmp-nav.json');
if (!url) {
  console.error('Required: --url');
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);

// Dismiss common overlays
for (const sel of [
  'button:has-text("Accept")',
  'button:has-text("Agree")',
  '#onetrust-accept-btn-handler',
  '.cookie-accept',
  '[aria-label="Close"]',
]) {
  try {
    const el = page.locator(sel).first();
    if (await el.isVisible({ timeout: 500 })) await el.click({ timeout: 1000 });
  } catch {
    /* ignore */
  }
}

const nav = await page.evaluate(async () => {
  const clean = (t) => (t || '').replace(/\s+/g, ' ').trim();
  const skip = (t) => {
    const x = t.toLowerCase();
    return (
      !t ||
      t.length > 80 ||
      /^(login|log in|register|sign in|sign up|basket|cart|search|menu|close|back)$/i.test(t) ||
      x.includes('{{')
    );
  };

  const roots = [
    ...document.querySelectorAll(
      'nav, header nav, #site-navbar, #products-navbar, .navbar, [role="navigation"], .main-nav, .primary-nav'
    ),
  ];
  if (!roots.length) roots.push(document.querySelector('header') || document.body);

  /** @type {{ label: string, href: string, children: any[] }[]} */
  const l1 = [];
  const seenL1 = new Set();

  function addChild(arr, label, href) {
    if (skip(label)) return null;
    let node = arr.find((n) => n.label.toLowerCase() === label.toLowerCase());
    if (!node) {
      node = { label, href: href || '', children: [] };
      arr.push(node);
    }
    return node;
  }

  for (const root of roots) {
    // Top-level links in nav bars
    const topLinks = root.querySelectorAll(
      ':scope > ul > li > a, :scope ul.navbar-nav > li > a, .nav-item > a.nav-link, .menu-item > a, li.dropdown > a'
    );
    for (const a of topLinks) {
      const label = clean(a.textContent);
      if (skip(label)) continue;
      const key = label.toLowerCase();
      if (seenL1.has(key)) continue;
      seenL1.add(key);
      const node = { label, href: a.href || '', children: [] };
      l1.push(node);

      // Children in sibling dropdown / mega menu
      const li = a.closest('li');
      if (!li) continue;
      const sub = li.querySelectorAll(
        '.dropdown-menu a, .submenu a, .mega-menu a, ul ul a, .dropdown-item, h5 a, h4 a, h3 a'
      );
      for (const s of sub) {
        const sl = clean(s.textContent);
        if (skip(sl) || sl.toLowerCase() === key) continue;
        // Prefer heading-like as L2, plain as L3 under nearest heading — flat L2 for now
        addChild(node.children, sl, s.href || '');
      }
    }
  }

  // Footer columns as supplemental L1 candidates (only if primary nav thin)
  const footer = document.querySelector('footer');
  const footerCols = [];
  if (footer) {
    for (const col of footer.querySelectorAll('ul')) {
      const heading =
        clean(
          col.previousElementSibling?.textContent ||
            col.parentElement?.querySelector('h2,h3,h4,h5,h6,.footer-title')?.textContent
        ) || '';
      const links = [...col.querySelectorAll('a')]
        .map((a) => ({ label: clean(a.textContent), href: a.href || '' }))
        .filter((x) => !skip(x.label));
      if (links.length) footerCols.push({ heading, links });
    }
  }

  return {
    title: document.title,
    l1,
    footerCols,
    allHeaderLinks: [...document.querySelectorAll('header a')]
      .map((a) => ({ label: clean(a.textContent), href: a.href || '' }))
      .filter((x) => !skip(x.label))
      .slice(0, 120),
  };
});

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(nav, null, 2));
console.log('Wrote', out, 'L1 count', nav.l1.length);
await browser.close();
