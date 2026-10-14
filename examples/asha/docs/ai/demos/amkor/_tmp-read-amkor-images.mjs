/**
 * Throwaway: read the current `image` and `Detail` field of every amkor page from
 * Experience Edge (batched by item id to stay under the query complexity budget)
 * and dump to _tmp-amkor-pages.json.
 *
 * Usage: node docs/ai/demos/amkor/_tmp-read-amkor-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../../../..');
const envText = fs.readFileSync(path.join(root, '.env.local'), 'utf8');
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#') && line.includes('='))
    .map((line) => {
      const i = line.indexOf('=');
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const contextId = env.SITECORE_EDGE_CONTEXT_ID || env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID;
const host =
  env.NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME || 'https://edge-platform.sitecorecloud.io';
const url = `${host.replace(/\/$/, '')}/v1/content/api/graphql/v1?sitecoreContextId=${contextId}`;

const pages = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, '_tmp-amkor-page-ids.json'), 'utf8')
);

// The Edge endpoint sums alias depth, so 4 aliases x 3 levels = 12 is the safe max.
const BATCH = 4;
const results = [];

for (let i = 0; i < pages.length; i += BATCH) {
  const batch = pages.slice(i, i + BATCH);
  const query = `query Batch($language: String!) {
    ${batch
      .map(
        (p, n) => `p${n}: item(path: "{${p.id.toUpperCase()}}", language: $language) {
          id name
          image: field(name: "image") { value }
          detail: field(name: "Detail") { value }
        }`
      )
      .join('\n')}
  }`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { language: 'en' } }),
  });
  const json = await res.json();
  if (json.errors) console.error('ERRORS batch', i, JSON.stringify(json.errors));

  batch.forEach((p, n) => {
    const node = json.data?.[`p${n}`];
    results.push({
      id: p.id,
      path: p.path,
      name: node?.name ?? null,
      found: Boolean(node),
      image: node?.image?.value ?? '',
      detail: (node?.detail?.value ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 300),
    });
  });
}

const isPlaceholder = (img) => /Amkor-logo-PMS293-transparent/i.test(img);
const isEmpty = (img) => !img || !/src="[^"]+"/i.test(img);

const out = path.join(import.meta.dirname, '_tmp-amkor-pages.json');
fs.writeFileSync(out, JSON.stringify(results, null, 2));

console.log('total pages:', results.length);
console.log('not found on edge:', results.filter((p) => !p.found).length);
console.log('placeholder logo:', results.filter((p) => isPlaceholder(p.image)).length);
console.log('empty image:', results.filter((p) => isEmpty(p.image)).length);
const keep = results.filter((p) => p.image && !isEmpty(p.image) && !isPlaceholder(p.image));
console.log('real non-placeholder image (SKIP):', keep.length);
for (const p of keep) console.log('  SKIP', p.path, '->', (p.image.match(/src="([^"]+)"/) || [])[1]);
console.log('wrote', out);
