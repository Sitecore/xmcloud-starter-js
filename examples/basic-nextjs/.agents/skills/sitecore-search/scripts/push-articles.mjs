// Push the site's published articles into a SitecoreAI Search PUSH SOURCE via the
// Ingestion Service API. Reads articles from Experience Edge (published content only),
// maps them to the push source schema, and upserts them in batches.
//
// Usage (from examples/basic-nextjs):
//   node .agents/skills/sitecore-search/scripts/push-articles.mjs --source <configId> [options]
//
// Options:
//   --source <id>        push source config_id (default: project.yaml searchSources.articles,
//                        then SITECORE_SEARCH_PUSH_SOURCE_ID)
//   --dry-run            print the operations payload; send nothing
//   --language <codes>   Sitecore content languages to read and push, comma-separated, or `all`
//                        (default: project.yaml searchLocales, then en). One document per article
//                        per language, same id across languages (Ingestion API: locale variants
//                        are separate documents; a source with locales requires `locale`).
//   --locale <code>      document locale; only with a single --language (default: the language code,
//                        which matches the source's locale codes in SitecoreAI)
//   --default-language   language served without a URL prefix (default: en). Other languages get
//                        /<language> prepended to ArticleUrl/sc_url (next-intl localePrefix as-needed)
//   --path <itemPath>    articles parent (default: /sitecore/content/main/main-website/Home/Articles)
//   --site-url <url>     absolute site origin; when set, sc_url = <site-url><path> (clickable results)
//   --delete <ids>       comma-separated document ids to delete (runs after upserts)
//   --include-empty      also push articles with no ArticleContent (skipped by default: stubs)
//
// Env (.env.local, then .env): NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID | SITECORE_EDGE_CONTEXT_ID,
// SITECORE_SEARCH_PUSH_API_KEY (server-only, never NEXT_PUBLIC_), SITECORE_SEARCH_PUSH_ENDPOINT.
//
// Push source schema (all String; see docs/ai/reference/agent-api-limitations.md section 6):
//   Title, ArticleContent (plain text), ArticleImage (URL), ArticlePublicationDate (ISO 8601),
//   ArticleUrl (site-relative path), ArticleTopic, ArticleAuthor (display name)
// Document id = Sitecore item ID (dashed GUID), so More Like This can seed from the route item ID.
// FIELD NAMES ARE SENT LOWERCASE: the push source UI stores field names lowercased on save
// ("ArticleImage" -> "articleimage"); the API then rejects the typed casing with
// 'field "ArticleImage" is not defined in config' (verified 2026-10-27). Search results come back
// with the lowercase names too, so datasource *Mapping fields must use them (e.g. "articletopic").

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const ARTICLE_TEMPLATE_ID = '74360AD2-D3DF-4FCE-834C-2F5420488677';
const EDGE_GRAPHQL = 'https://edge-platform.sitecorecloud.io/v1/content/api/graphql/v1';
const BATCH_SIZE = 50; // API limit: 1-50 operations, <= 512 KiB per request

// ---------- args / env ----------
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
};

const readEnvVar = (name) => {
  if (process.env[name]) return process.env[name];
  for (const file of ['.env.local', '.env']) {
    try {
      const content = readFileSync(resolve(process.cwd(), file), 'utf8');
      const match = content.match(new RegExp(`^${name}=(.*)$`, 'm'));
      if (match && match[1].trim()) return match[1].trim().replace(/^["']|["']$/g, '');
    } catch {
      // file missing — try next
    }
  }
  return undefined;
};

const dryRun = flag('dry-run');
// Source ID: --source, then project.yaml searchSources.articles, then SITECORE_SEARCH_PUSH_SOURCE_ID.
const { readSearchSource, readSearchLocales } = createRequire(import.meta.url)('./lib/search-config.cjs');
const sourceId = opt('source', readSearchSource(process.cwd()));
// Languages: --language, then project.yaml searchLocales, then en.
const languageArg = opt('language', '');
const languages = (!languageArg || languageArg === 'all' ? readSearchLocales(process.cwd()) : languageArg.split(','))
  .map((s) => s.trim())
  .filter(Boolean);
const localeOverride = opt('locale', '');
const defaultLanguage = opt('default-language', 'en');
const parentPath = opt('path', '/sitecore/content/main/main-website/Home/Articles');
const siteUrl = opt('site-url', '')?.replace(/\/$/, '');
const includeEmpty = flag('include-empty');
const deleteIds = (opt('delete', '') || '').split(',').map((s) => s.trim()).filter(Boolean);

const contextId =
  readEnvVar('NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID') ?? readEnvVar('SITECORE_EDGE_CONTEXT_ID');
const apiKey = readEnvVar('SITECORE_SEARCH_PUSH_API_KEY');
const endpoint = readEnvVar('SITECORE_SEARCH_PUSH_ENDPOINT')?.replace(/\/$/, '');

const fail = (msg) => {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
};

if (!languages.length) fail('No languages: pass --language <codes> or set project.yaml searchLocales');
if (localeOverride && languages.length > 1) fail('--locale needs a single --language');
if (!contextId) fail('No SITECORE_EDGE_CONTEXT_ID / NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID in env, .env.local, or .env');
if (!dryRun) {
  if (!sourceId) fail('Missing source: --source <configId>, project.yaml searchSources.articles, or SITECORE_SEARCH_PUSH_SOURCE_ID');
  if (!apiKey) fail('Missing SITECORE_SEARCH_PUSH_API_KEY in .env.local');
  if (!endpoint) fail('Missing SITECORE_SEARCH_PUSH_ENDPOINT in .env.local (the source "API Endpoint" value)');
}

// ---------- mapping helpers ----------
const stripHtml = (html) =>
  String(html ?? '')
    .replace(/<(br|\/p|\/li|\/h[1-6])\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

/** Sitecore date (20260806T000000Z, or already ISO) -> ISO 8601 string; '' when empty/invalid. */
const toIsoDate = (raw) => {
  if (!raw) return '';
  const m = String(raw).match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  const iso = m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z` : String(raw);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime()) || d.getUTCFullYear() < 1900) return '';
  return d.toISOString().replace('.000Z', 'Z');
};

/** Image field jsonValue -> URL. Tolerates { value: { src } }, { src }, and raw XML. */
const imageUrl = (jsonValue) => {
  const v = jsonValue?.value ?? jsonValue;
  if (!v) return '';
  if (typeof v === 'object') return v.src || v.url || '';
  const m = String(v).match(/src="([^"]+)"/i);
  return m ? m[1].replace(/&amp;/g, '&') : '';
};

/** Droptree jsonValue -> person display name. */
const authorName = (jsonValue) => {
  const v = jsonValue?.value && typeof jsonValue.value === 'object' ? jsonValue.value : jsonValue;
  if (!v || typeof v !== 'object') return '';
  const f = v.fields || {};
  const first = f.personFirstName?.value ?? '';
  const last = f.personLastName?.value ?? '';
  const full = `${first} ${last}`.trim();
  return full || v.displayName || v.name || '';
};

/** Edge item id (32 hex, no dashes) -> dashed lowercase GUID. */
const dashedGuid = (id) => {
  const h = String(id).replace(/[{}-]/g, '').toLowerCase();
  return h.length === 32
    ? `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
    : String(id);
};

// ---------- read published articles from Edge ----------
const QUERY = /* GraphQL */ `
  query Articles($path: String!, $language: String!, $template: String!, $after: String) {
    item(path: $path, language: $language) {
      children(first: 10, after: $after, includeTemplateIDs: [$template]) {
        pageInfo { hasNext endCursor }
        results {
          id
          name
          url { path }
          title: field(name: "Title") { value }
          content: field(name: "ArticleContent") { value }
          image: field(name: "ArticleImage") { jsonValue }
          date: field(name: "ArticlePublicationDate") { value }
          topic: field(name: "ArticleTopic") { value }
          articleUrl: field(name: "ArticleUrl") { value }
          author: field(name: "ArticleAuthor") { jsonValue }
        }
      }
    }
  }
`;

const edge = async (variables) => {
  const res = await fetch(`${EDGE_GRAPHQL}?sitecoreContextId=${encodeURIComponent(contextId)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.errors) {
    fail(`Edge GraphQL HTTP ${res.status}: ${JSON.stringify(body.errors ?? body).slice(0, 800)}`);
  }
  return body.data;
};

const readArticles = async (language) => {
  const articles = [];
  let after = null;
  do {
    const data = await edge({ path: parentPath, language, template: ARTICLE_TEMPLATE_ID, after });
    if (!data?.item) fail(`Parent not found (or not published in ${language}) on Edge: ${parentPath}`);
    const page = data.item.children;
    articles.push(...page.results);
    after = page.pageInfo.hasNext ? page.pageInfo.endCursor : null;
  } while (after);
  return articles;
};

// ---------- map to operations ----------
const warnings = [];
const skipped = [];
const readCounts = [];
const operations = [];

/** One upsert per published article in `language`, keyed by the item ID (same id in every locale). */
const toOperations = (articles, language, locale) => {
  const pushable = articles.filter((a) => {
    if (includeEmpty || stripHtml(a.content?.value)) return true;
    skipped.push(`[${language}] ${a.name} (${dashedGuid(a.id)})`);
    return false;
  });
  // Edge returns the same url.path in every language; the host serves non-default
  // languages under /<language> (next-intl localePrefix "as-needed").
  const prefix = language === defaultLanguage ? '' : `/${language}`;
  return pushable.map((a) => toOperation(a, language, locale, prefix));
};

const toOperation = (a, language, locale, prefix) => {
  const edgePath = a.url?.path || a.articleUrl?.value || '';
  const path = edgePath ? `${prefix}${edgePath}` : '';
  const fields = {
    Title: a.title?.value || a.name,
    ArticleContent: stripHtml(a.content?.value),
    ArticleImage: imageUrl(a.image?.jsonValue),
    ArticlePublicationDate: toIsoDate(a.date?.value),
    ArticleUrl: path,
    ArticleTopic: a.topic?.value || '',
    ArticleAuthor: authorName(a.author?.jsonValue),
  };
  for (const [k, v] of Object.entries(fields)) if (!v) warnings.push(`[${language}] ${a.name}: empty ${k}`);
  if (a.articleUrl?.value && a.url?.path && a.articleUrl.value !== a.url.path) {
    warnings.push(`[${language}] ${a.name}: ArticleUrl field "${a.articleUrl.value}" != Edge url.path "${a.url.path}" (using Edge path)`);
  }
  const op = {
    action: 'upsert',
    id: dashedGuid(a.id),
    locale,
    fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k.toLowerCase(), v])),
  };
  if (siteUrl && path) op.sc_url = `${siteUrl}${path}`;
  return op;
};

for (const language of languages) {
  const locale = localeOverride || language;
  const articles = await readArticles(language);
  readCounts.push(`${language}: ${articles.length}`);
  operations.push(...toOperations(articles, language, locale));
  for (const id of deleteIds) operations.push({ action: 'delete', id: dashedGuid(id), locale });
}

console.log(`Read published articles from Edge under ${parentPath} (${readCounts.join(', ')})`);
if (skipped.length) {
  console.log(`Skipped ${skipped.length} with empty ArticleContent (use --include-empty to push; --delete <id> to remove an already-pushed stub):\n  - ${skipped.join('\n  - ')}`);
}
if (warnings.length) console.log(`Warnings (${warnings.length}):\n  - ${warnings.join('\n  - ')}`);

if (dryRun) {
  console.log(JSON.stringify({ operations }, null, 2));
  console.log(`\nDRY RUN — ${operations.length} operation(s) not sent.`);
  process.exit(0);
}

// ---------- push in batches ----------
let ok = 0;
let failed = 0;
for (let i = 0; i < operations.length; i += BATCH_SIZE) {
  const batch = operations.slice(i, i + BATCH_SIZE);
  const res = await fetch(`${endpoint}/v1/index/${encodeURIComponent(sourceId)}/push`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `ApiKey ${apiKey}` },
    body: JSON.stringify({ operations: batch }),
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = null;
  }
  if (!body?.results) {
    console.error(`Batch ${i / BATCH_SIZE + 1}: HTTP ${res.status} ${text.slice(0, 800)}`);
    failed += batch.length;
    continue;
  }
  for (const r of body.results) {
    if (r.succeeded) ok += 1;
    else {
      failed += 1;
      const src = batch[r.index];
      console.error(`  FAILED ${r.action} ${src?.id} [${src?.locale}] (${src?.fields?.title ?? ''}): ${r.statusCode} ${r.errorMessage ?? ''}`);
    }
  }
  console.log(`Batch ${i / BATCH_SIZE + 1}: HTTP ${res.status} status=${body.status}`);
}

console.log(`\nDone: ${ok} succeeded, ${failed} failed.`);
process.exit(failed ? 1 : 0);
