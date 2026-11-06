---
name: sitecore-search
description: "Enable, configure, and verify SitecoreAI Search on a site with the SearchResults, SearchCollection, and SearchTypeahead components. Use when setting up search for an environment or demo (push source, seeding articles, connecting components), or when search results, the typeahead, or a collection strip misbehave."
---

# Sitecore search

The components already exist, so search is configuration, not engineering. Per environment it needs:
- an article set
- a push source
- datasources that point at the source
- three placements

The design and its reasons are in ADR 0013 (`docs/adr/0013-seeded-articles-and-search-per-environment.md`).

## Load first
- `docs/ai/reference/agent-api-limitations.md` §6: the search endpoint contract (facets, More Like This, suggest, push sources, and their casing traps).
- `docs/adr/0011-search-push-source-facets-mlt-suggest.md`: why the components work the way they do.

## Set up search for an environment
Run from the app root, with the marketer MCP on the right environment (`AGENTS.md`, environment check).

Seeding and connecting use the **hand-off**: `search-setup.cjs` never calls Sitecore. It prints `awaiting-tool`, then:
1. claim the request (`--claim <id>`)
2. run that exact marketer MCP tool
3. save its result to a file and record it (`--reply <id> --result <file>`)
4. run the phase again

The rules are the same as build-demo's: never repeat a claimed mutation after a crash, `--initialize` only on the first run of a phase, and `--begin` after a session break. See `.agents/skills/sitecore-build-demo/references/recovery.md`.

Working records go to `--directory`: `docs/ai/demos/<client>/search-setup` in a demo, otherwise the gitignored `.search-setup/`.

1. **Check.** Start Check's `search-source` check (or `search-probe.mjs`) tells you whether `searchSources.articles` in `docs/ai/config/project.yaml` answers.
   - *Done when* it answers, or you know the source is missing.
2. **Push source** (only when missing). The user creates it in the SitecoreAI UI, following `references/push-source-setup.md`. Record the ID in `project.yaml` as `searchSources.articles`, and put the push key and endpoint in `.env.local`.
   - *Done when* `search-probe.mjs` answers HTTP 200.
3. **Images** (only with Content Hub credentials):
   - run `prepare-article-images.mjs`
   - then `upload-to-content-hub.mjs --images-dir .search-setup/images --initialize`
   - *Done when* the upload reports `complete`.
   - Without credentials, skip this step: seeding uses the shared-sandbox fallback and lists those articles in `sharedSandboxImages`.
4. **Seed:**
   ```bash
   node .agents/skills/sitecore-search/scripts/search-setup.cjs --phase seed --initialize [--images-manifest .search-setup/images/image-manifest.json]
   ```
   It creates missing articles and **gap-fills** existing ones: only empty fields are written. `--overwrite` resets fields, and only when the user asks.
   - *Done when* `seed-result.json` reports `complete`.
5. **Connect:**
   ```bash
   node .agents/skills/sitecore-search/scripts/search-setup.cjs --phase connect --initialize [--home-placement none]
   ```
   - It finds search datasources by template and sets the source, mappings, `SortBy` and `Facets`.
   - It creates the Related Articles datasource and adds any missing placement: Related in Article Layout, Latest on Home, SearchResults on `/Articles`.
   - *Done when* `connect-result.json` reports `complete`. A `partial` result with `manualPlacements` means those become Pages tasks for the user (Agent API down; see `agent-api-limitations.md` §4). Also list `cleanupDatasources` for Content Editor.
6. **Publish.** The user publishes the site once.
   - A deployed showcase re-renders each page at most 60 seconds after its last render (`revalidate = 60` on the catch-all page). Wait about a minute after publishing before step 8. The first request after that may still get the old page (with the old `SearchIndex`, so HTTP 404 `no search index found`) while it refreshes in the background; the next request gets the new one. A redeploy is needed only for code changes.
7. **Push:**
   ```bash
   node .agents/skills/sitecore-search/scripts/push-articles.mjs --dry-run
   node .agents/skills/sitecore-search/scripts/push-articles.mjs
   ```
   It reads published articles from Edge and pushes them to the source.
   - *Done when* every article succeeded, and the option probes from `references/push-source-setup.md` step 8 answer HTTP 200.
   - Rerun it after any article change: the index doesn't follow publishing.
8. **Verify:** `verify-demo.mjs <url>` (`.agents/skills/sitecore-build-demo/scripts/`), or the 3 browser protocols below.
   - *Done when* everything passes.

### Rules that bite
- **Serialized fields:** `Facets`, `RelatedToCurrentPage`, `ArticleTopic` and the Article Topics tags arrive with the environment's deploy. If they're missing, deploy the environment. Creating them through MCP assigns new IDs and duplicates the fields.
- **Mapping casing:** mappings use the source's **lowercase** document attributes (`title`, `articlecontent`, …). `Facets` uses the facet **display name** (`ArticleTopic`, optionally `ArticleTopic:Topic`). A wrong facet name makes SearchResults fall back to no facets.
- **Rendering modes:** search renders skeletons in editing and preview. Verify on the live or local site.
- **Translated sites:** connect writes only the `en` versions of the search datasources. On a source with `searchLocales`, copy the English values of `SearchIndex`, the `*Mapping` fields, `SortBy`, `SortOrder` and `Facets` into every other language version (`update_content` with `language`), then read them back.
  - Check for translated config values too. Machine translation turns them into values like `TitleMapping="Titel"` or `SortOrder="descripción"`, which match no source attribute.
  - The components send the page's locale, except for the default language.
  - **Translated labels:** in `Facets`, keep the name and translate only the label (`ArticleTopic:Tema`). The search UI labels are the `SearchExperience_*` entries in the site Dictionary (keys in `src/lib/search-ui/constants.ts`). Give every entry a version in each language.

## Scripts

| Script | Purpose |
|---|---|
| `search-setup.cjs --phase seed\|connect` | Seed the articles, or connect search (hand-off, journaled, read back) |
| `prepare-article-images.mjs [--directory d]` | Download the article images for upload to this environment's Content Hub |
| `push-articles.mjs [--dry-run] [--language <codes>\|all] [--site-url <origin>] [--delete ids]` | Sync published articles from Edge into the push source: one document per article per language in `project.yaml` `searchLocales` (default `en`). Non-default languages get a `/<language>` URL prefix |
| `search-probe.mjs [indexGuid] [keyphrase] [--locale <code>] [--facet N] [--filter N=a\|b] [--seed id] [--sort attr:desc] [--suggest]` | Query the endpoint directly (bypasses React). The index defaults to the configured source. |
| `search-verify.mjs [baseUrl]` | Browser protocol: SearchResults, including facets |
| `collection-verify.mjs [baseUrl]` | Browser protocol: Latest on Home, Related on an article |
| `typeahead-verify.mjs [baseUrl]` | Browser protocol: suggestion terms and top results |

All live in `.agents/skills/sitecore-search/scripts/`.
- **Source ID lookup:** `--source`, then `project.yaml` `searchSources.articles`, then `SITECORE_SEARCH_PUSH_SOURCE_ID`.
- **Browser protocols:** need Playwright Chromium (`npm run agents:browsers`).
  - They assert that the expected document ranks first, not exact counts, because keyphrase matching is loose.
  - They run headless, which analytics treats as a bot, so search analytics events are skipped.
