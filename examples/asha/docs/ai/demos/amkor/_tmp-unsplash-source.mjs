/**
 * Throwaway: turn the cached Unsplash candidate pools into a validated, deduped
 * page -> image plan for every amkor page that still shows the generic logo
 * placeholder (or has no image at all).
 *
 * - Normalises every candidate to https://images.unsplash.com/photo-<id>?w=1200&q=80
 * - Validates over HTTP: only 200 + an image/* content-type is accepted.
 * - Dedupes globally so no two pages (and therefore no two siblings) share a photo.
 * - Falls back to the section's EXTRA_QUERIES pools when a primary pool runs dry.
 *
 * Output: _tmp-amkor-image-plan.json ({ id, path, query, alt, url } per page)
 *
 * Usage: node docs/ai/demos/amkor/_tmp-unsplash-source.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { EXTRA_QUERIES, planFor } from './_tmp-amkor-image-queries.mjs';

const DIR = import.meta.dirname;
const pools = JSON.parse(fs.readFileSync(path.join(DIR, '_tmp-unsplash-pools.json'), 'utf8'));
const pages = JSON.parse(fs.readFileSync(path.join(DIR, '_tmp-amkor-pages.json'), 'utf8'));

const isPlaceholder = (img) => /Amkor-logo-PMS293-transparent/i.test(img);
const isEmpty = (img) => !img || !/src="[^"]+"/i.test(img);
const targets = pages.filter((p) => isPlaceholder(p.image) || isEmpty(p.image));

const toUrl = (slug) => `https://images.unsplash.com/${slug}?w=1200&q=80`;

const validation = new Map();
async function isValidPhoto(url) {
  if (validation.has(url)) return validation.get(url);
  let ok = false;
  for (let attempt = 1; attempt <= 2 && !ok; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        },
      });
      const type = res.headers.get('content-type') || '';
      ok = res.status === 200 && type.startsWith('image/');
      await res.arrayBuffer().catch(() => {});
      if (!ok && res.status >= 500) await new Promise((r) => setTimeout(r, 1000));
      else break;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  validation.set(url, ok);
  return ok;
}

console.log('pages needing an image:', targets.length);

const used = new Set();
const plan = [];
const failures = [];

for (const page of targets) {
  const spec = planFor(page.path);
  if (!spec) {
    failures.push({ path: page.path, reason: 'no query mapped' });
    continue;
  }

  const candidateQueries = [spec.query, ...(EXTRA_QUERIES[spec.query] ?? [])];
  let chosen = null;

  outer: for (const query of candidateQueries) {
    for (const slug of pools[query] ?? []) {
      if (used.has(slug)) continue;
      const url = toUrl(slug);
      if (!(await isValidPhoto(url))) continue;
      used.add(slug);
      chosen = { url, query };
      break outer;
    }
  }

  if (!chosen) {
    failures.push({ path: page.path, reason: `no unused valid photo for "${spec.query}"` });
    continue;
  }

  plan.push({ id: page.id, path: page.path, query: chosen.query, alt: spec.alt, url: chosen.url });
}

const out = path.join(DIR, '_tmp-amkor-image-plan.json');
fs.writeFileSync(out, JSON.stringify(plan, null, 2));

console.log('planned:', plan.length, '| failures:', failures.length);
for (const f of failures) console.log('  FAIL', f.path, '-', f.reason);
console.log('unique photos:', new Set(plan.map((p) => p.url)).size);
console.log('all validated HTTP 200 + image/*:', plan.every((p) => validation.get(p.url) === true));
console.log('wrote', out);
