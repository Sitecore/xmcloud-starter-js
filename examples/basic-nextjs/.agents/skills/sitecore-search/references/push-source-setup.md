# Push source setup (SitecoreAI UI, once per environment)

There's no API for creating a search source, so the user does this in **Content → Search sources → Create Source → Push source**. Give the user this checklist. Facts behind it: `docs/ai/reference/agent-api-limitations.md` §6.

**Get it right at creation: a source can't be edited afterwards.** Field options (Searchable, Filterable, Sortable) and the advanced settings are fixed once the source is saved (seen 2026-10-28 on `main`'s environment). A wrong source means creating a new one, which has a new ID: update `project.yaml`, rerun connect, push again, and delete the old source. Check every row of step 3 and every switch of step 4 before saving.

1. **Basic configuration:** name `Articles`, with a description such as "Pushed by push-articles.mjs".
2. **Locales:** English only, unless the articles are translated. Every extra locale multiplies the Searchable allowance, and every push must name its locale.
   - **Translated articles:** select every site language that has article versions (check with `get_all_languages`). The UI's codes equal the Sitecore language names. List them in `project.yaml` as `searchLocales` (for example `["en", "ja-JP", "de-DE"]`) so `push-articles.mjs` pushes each one.
3. **Fields.** Type the names as shown; the UI stores them lowercase. Facet requests still use the display name (`ArticleTopic`).

   | Field | Type | Include | Searchable | Filterable | Sortable |
   |---|---|---|---|---|---|
   | `Title` | String | ✅ | ✅ | | ✅ |
   | `ArticleContent` | String | ✅ | ✅ | | |
   | `ArticleImage` | String | ✅ | | | |
   | `ArticlePublicationDate` | String (ISO date, sorts as text) | ✅ | | | ✅ |
   | `ArticleUrl` | String | ✅ | | | |
   | `ArticleTopic` | String | ✅ | ✅ | ✅ | |
   | `ArticleAuthor` | String | ✅ | | ✅ | |

   - There's no Datetime type.
   - Use String, not Tags, for single-value facets: the API's handling of Tags values isn't documented.
4. **Advanced settings.** Turn all of them on:
   - Semantic reranking
   - Fuzzy search
   - **Autocomplete**: fields `Title` (and optionally `ArticleTopic`), limit `5`
   - **Result preview**: limit `3`

   A limit of `0` returns nothing.
5. **Save**, then **publish** the source. Pushes to an unpublished source return 404.
6. **Credential** (once per SitecoreAI instance; it works for every source): **Search sources → Settings → Create credential**. The key is shown only once.
7. **Record:**
   - `docs/ai/config/project.yaml`: `searchSources: { articles: <source ID> }`. Commit it on the branch that owns the environment.
   - `.env.local`: `SITECORE_SEARCH_PUSH_API_KEY=<key>` (never with a `NEXT_PUBLIC_` prefix) and `SITECORE_SEARCH_PUSH_ENDPOINT=<the source's API Endpoint>`.
8. **Done when** `node .agents/skills/sitecore-search/scripts/search-probe.mjs` answers HTTP 200. An empty source returns `total: 0` until the first push.
   - After the first push, also probe the options, because a missing one only shows up as HTTP 400 at query time: `--facet ArticleTopic` (Filterable), `--sort articlepublicationdate:desc` (Sortable), `pers --suggest` (Autocomplete and Result preview).
