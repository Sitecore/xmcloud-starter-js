/**
 * One-off: run the NewsListing ComponentQuery against Experience Edge preview to confirm
 * the added `image` / CTA selections stay inside the query complexity budget for the
 * 10-item amkor News datasource.
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
const host = env.NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME || 'https://edge-platform.sitecorecloud.io';
const url = `${host.replace(/\/$/, '')}/v1/content/api/graphql/v1?sitecoreContextId=${contextId}`;

const query = `
  query NewsListing($datasource: String!, $language: String!) {
    datasource: item(path: $datasource, language: $language) {
      eyebrow: field(name: "Eyebrow") { jsonValue }
      title: field(name: "Title") { jsonValue }
      ctaLink: field(name: "CtaLink") { jsonValue }
      ctaText: field(name: "CtaText") { jsonValue }
      items: field(name: "FeaturedItems") {
        ... on MultilistField {
          targetItems {
            id
            name
            displayName
            url { path }
            pageTitle: field(name: "pageTitle") { jsonValue }
            pageSubtitle: field(name: "pageSubtitle") { jsonValue }
            pageSummary: field(name: "pageSummary") { jsonValue }
            detail: field(name: "Detail") { jsonValue }
            image: field(name: "image") { value }
            parent { name }
          }
        }
      }
    }
  }
`;

const datasource = process.argv[2] || '{96A42097-34D6-465C-990D-B801882D7B27}';

const res = await fetch(url, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ query, variables: { datasource, language: 'en' } }),
});

const json = await res.json();
if (json.errors) {
  console.log('ERRORS:', JSON.stringify(json.errors, null, 2));
}
const ds = json.data?.datasource;
console.log('datasource resolved:', Boolean(ds));
console.log('title:', ds?.title?.jsonValue?.value);
console.log('ctaLink:', JSON.stringify(ds?.ctaLink), 'ctaText:', JSON.stringify(ds?.ctaText));
const items = ds?.items?.targetItems ?? [];
console.log('targetItems:', items.length);
for (const item of items.slice(0, 2)) {
  console.log('-', item.name, '| raw image:', JSON.stringify(item.image));
}
