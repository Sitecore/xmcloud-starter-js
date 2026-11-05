// Direct probe of the SitecoreAI search API — replicates exactly what
// @sitecore-content-sdk/nextjs/search useSearch sends, with zero component code.
// Replaces the missing "test query" feature in Search Configuration Manager.
//
// Usage (from examples/basic-nextjs):
//   node .agents/skills/sitecore-search/scripts/search-probe.mjs [searchIndexGuid] [keyphrase] [options]
//   (index defaults to project.yaml searchSources.articles, then SITECORE_SEARCH_PUSH_SOURCE_ID)
//
// Options (search v4, ADR 0011):
//   --facet <Name>            request counts for a facet (display-name casing; repeatable)
//   --filter <Name>=<v1|v2>   eq filter (values OR-ed); implies --facet <Name>
//   --seed <itemId>           More Like This by item ID (dashed lowercase GUID) instead of keyphrase
//   --sort <attr>[:asc|desc]  sort by a (lowercase) document attribute
//   --suggest                 call /v1/search/suggest (autocomplete terms + preview results)
//   --locale <code>           document locale (e.g. ja-JP); required by sources with locales configured
//
// Reads NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID (or SITECORE_EDGE_CONTEXT_ID) from .env.

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const argv = process.argv.slice(2);
const positional = [];
const facetNames = new Set();
const filters = {};
let seed = '';
let sortArg = '';
let suggest = false;
let locale = '';
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--facet') facetNames.add(argv[++i]);
  else if (a === '--filter') {
    const [name, values = ''] = argv[++i].split('=');
    facetNames.add(name);
    filters[name] = values.split('|').filter(Boolean);
  } else if (a === '--seed') seed = argv[++i];
  else if (a === '--sort') sortArg = argv[++i];
  else if (a === '--suggest') suggest = true;
  else if (a === '--locale') locale = argv[++i];
  else positional.push(a);
}
// The index is optional: without a GUID first, use the environment's configured source
// (project.yaml searchSources.articles, then SITECORE_SEARCH_PUSH_SOURCE_ID).
const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const { readSearchSource } = createRequire(import.meta.url)('./lib/search-config.cjs');
const [indexId, keyphrase = ''] = GUID.test(positional[0] || '')
  ? positional
  : [readSearchSource(process.cwd()), ...positional];

if (!indexId) {
  console.error('Usage: node .agents/skills/sitecore-search/scripts/search-probe.mjs [searchIndexGuid] [keyphrase] — no index given and none configured (project.yaml searchSources.articles)');
  process.exit(1);
}

const readEnvVar = (name) => {
  if (process.env[name]) return process.env[name];
  for (const file of ['.env.local', '.env']) {
    try {
      const content = readFileSync(resolve(process.cwd(), file), 'utf8');
      const match = content.match(new RegExp(`^${name}=(.+)$`, 'm'));
      if (match) return match[1].trim();
    } catch {
      // file missing — try next
    }
  }
  return undefined;
};

const contextId =
  readEnvVar('NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID') ?? readEnvVar('SITECORE_EDGE_CONTEXT_ID');

if (!contextId) {
  console.error('No SITECORE_EDGE_CONTEXT_ID found in environment, .env.local, or .env');
  process.exit(1);
}

const [sortName, sortOrder = 'desc'] = sortArg.split(':');
const body = suggest
  ? { config: { id: indexId }, query: { keyphrase }, ...(locale && { locale }) }
  : {
      config: { id: indexId },
      ...(locale && { locale }),
      limit: 10,
      offset: 0,
      query: seed ? { seedItemId: seed } : { keyphrase },
      sessionId: '',
      sort: { fields: sortName ? [{ name: sortName, order: sortOrder }] : [] },
      ...(facetNames.size && {
        facet: {
          fields: [...facetNames].map((name) =>
            filters[name]?.length
              ? { name, filters: [{ operator: 'eq', value: filters[name] }] }
              : { name }
          ),
        },
      }),
    };

const response = await fetch(
  `https://edge-platform.sitecorecloud.io/v1/search${suggest ? '/suggest' : ''}`,
  {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-sitecore-contextid': contextId,
    },
    body: JSON.stringify(body),
  }
);

const text = await response.text();
console.log(`HTTP ${response.status} ${response.statusText}`);

let data;
try {
  data = JSON.parse(text);
} catch {
  console.log(text);
  process.exit(response.ok ? 0 : 1);
}

if (suggest) {
  console.log('querySuggestions:', JSON.stringify(data.querySuggestions ?? []));
  console.log('previewResults:', (data.previewResults ?? []).map((d) => d.title ?? d.Title ?? JSON.stringify(d).slice(0, 80)));
  process.exit(response.ok ? 0 : 1);
}

if (data.facet) {
  console.log('\n--- facets ---');
  for (const f of data.facet) {
    console.log(`${f.name}: ${f.value.map((v) => `${v.text} (${v.count})`).join(', ')}`);
  }
}

const results = data.content ?? [];
console.log(`total: ${data.total ?? 0}, returned: ${results.length}`);

if (results.length > 0) {
  console.log('\n--- attribute names in first result (use these for fieldsMapping) ---');
  console.log(Object.keys(results[0]).join(', '));
  console.log('\n--- results ---');
  for (const doc of results) {
    console.log(JSON.stringify(doc, null, 2));
  }
} else if (!response.ok) {
  console.log(JSON.stringify(data, null, 2));
}
