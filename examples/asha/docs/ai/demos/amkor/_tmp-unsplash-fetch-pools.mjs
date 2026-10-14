/**
 * Throwaway: collect real Unsplash photo slugs for each search query used by the
 * amkor image plan.
 *
 * unsplash.com fronts both its search HTML and its /napi JSON with an Anubis
 * proof-of-work bot challenge, so plain fetch (and headless Chromium) get HTTP 401.
 * A headed browser solves the challenge, so we drive Playwright with headless:false
 * and scrape the rendered search results. If UNSPLASH_ACCESS_KEY is set we use the
 * official API instead and skip the browser entirely.
 *
 * Results are cached to _tmp-unsplash-pools.json so re-runs only fetch what is missing.
 *
 * Usage: node docs/ai/demos/amkor/_tmp-unsplash-fetch-pools.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { QUERIES } from './_tmp-amkor-image-queries.mjs';

const DIR = import.meta.dirname;
const OUT = path.join(DIR, '_tmp-unsplash-pools.json');
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const MIN_POOL = 10;

const pools = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const todo = QUERIES.filter((q) => !(pools[q]?.length >= MIN_POOL));

console.log('queries total:', QUERIES.length, '| still to fetch:', todo.length);

const save = () => fs.writeFileSync(OUT, JSON.stringify(pools, null, 2));

if (ACCESS_KEY) {
  for (const query of todo) {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`,
      { headers: { authorization: `Client-ID ${ACCESS_KEY}` } }
    );
    const json = await res.json();
    pools[query] = [
      ...new Set(
        (json.results ?? [])
          .map((r) => (r?.urls?.raw ?? '').match(/images\.unsplash\.com\/(photo-[A-Za-z0-9_-]+)/)?.[1])
          .filter(Boolean)
      ),
    ];
    console.log(res.status, pools[query].length, query);
    save();
  }
} else if (todo.length) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();

  for (const query of todo) {
    const url = `https://unsplash.com/s/photos/${encodeURIComponent(query).replace(/%20/g, '-')}?orientation=landscape`;
    let slugs = [];

    for (let attempt = 1; attempt <= 3 && slugs.length < MIN_POOL; attempt++) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });

        // Wait out the bot-check interstitial if it appears.
        for (let i = 0; i < 12; i++) {
          if (!/not a bot/i.test(await page.title())) break;
          await page.waitForTimeout(2500);
        }

        await page.waitForTimeout(2500);
        // Scroll to force the lazy-loaded grid to render more results.
        for (let i = 0; i < 4; i++) {
          await page.mouse.wheel(0, 3000);
          await page.waitForTimeout(1200);
        }

        const html = await page.content();
        slugs = [
          ...new Set(
            [...html.matchAll(/images\.unsplash\.com\/(photo-[A-Za-z0-9_-]{15,})/g)].map((m) => m[1])
          ),
        ];
      } catch (err) {
        console.log('  retry', query, '-', err.message);
        await page.waitForTimeout(3000 * attempt);
      }
    }

    pools[query] = slugs;
    console.log(String(slugs.length).padStart(3), query);
    save();
  }

  await browser.close();
}

save();
const short = QUERIES.filter((q) => (pools[q]?.length ?? 0) < MIN_POOL);
console.log('\nqueries with >=', MIN_POOL, 'results:', QUERIES.length - short.length, '/', QUERIES.length);
if (short.length) console.log('SHORT/EMPTY:', short.map((q) => `${q} (${pools[q]?.length ?? 0})`));
console.log('wrote', OUT);
