# ABM Landing Page For One Account

Create or update a SitecoreAI **ABM landing page** for one target account (for example IKEA) on the Sitecore demo site. The page sells SitecoreAI to that account: what it gains, in its own context, and one clear next step. Use when the marketer names an organization and asks for a landing page, ABM page or account page for it.

The marketer is the authority on the account; the web fills the gaps. Sitecore is the trusted guide, the account is the protagonist. This skill writes **page fields only** and never publishes.

## Site facts

| Item | Value |
|---|---|
| Site name | `main-website` |
| Language | `en` (English only) |
| Landing pages parent `/Home/lp` | `af65681c-5c75-40d2-89a3-3779d5a47a27` |
| Page template | Landing Page Template, `50af6ec7-85fd-4b9b-adf7-1fde9d9136fe` |
| Example page (never change it, never duplicate it) | `Example Landing Page`, `ff0d2a81-31a5-4b8d-8a53-a1d03734c178` |
| Brand context (what Sitecore sells) | `Sitecore`, `43723db2-802c-4960-8d86-09fea574c117` (read it yourself, see step 1) |
| Brand Kit (how Sitecore writes) | the **published** kit named exactly `Sitecore Brand Kit` |
| Customer story library | `Customer Evidence/Story Index` and `Customer Evidence/Stories`; original index and six source records read-back verified 2026-11-05. Revised Proof fit metadata is pending replacement/read-back. Use current file IDs from the step 1 tree; filter older Product context conservatively until updated. |
| Customer Evidence v2 availability | **Enabled.** Three live fields/Types and the `CustomerEvidence` Variant Definition are created/read-back verified; new defaults are blank and the four serialized items are committed. Both live and editing rendering hosts served frontend commit `411d14d0` on 2026-11-05. Write the v2 fields together from a published source story, or empty all three when no story is available. |
| Default goal | `Book a SitecoreAI briefing` → `https://www.sitecore.com/request-a-demo` |
| Secondary hero link | `Explore the platform` → `https://www.sitecore.com/platform` |
| Content Hub | Connected DAM at `https://ffde.sitecoresandbox.cloud`; use the connection as configured |
| Page builder link | `https://pages.sitecorecloud.io/editor?organization=org_BMSdm6mLMr270Wnk&tenantName=sitecoresaabad7-fmccustomde3703-sitecoredem3db4&sc_site=main-website&sc_itemid={ITEM-ID}&sc_lang=en&sc_version={VERSION}` |

The page design (header, footer and the six landing sections with their variants) comes from the template. Never change the layout.

## Product focus — SitecoreAI

**The product being sold is always SitecoreAI.** An account's existing XP/classic XM installation is relationship/background context, not a request to market that product. Keep it in the dossier/report; it does not change the goal, hero, feature cards, FAQ or CTA into an XP campaign. A migration/comparison narrative requires an explicit marketer request, not merely answering "existing XP customer" in intake. Without that request, avoid legacy-product names in page-facing copy.

Scope offering claims to current SitecoreAI capabilities from official knowledge or the current platform page, `https://www.sitecore.com/platform`. The broader Brand Context portfolio includes legacy products: its XP/XM entries are not SitecoreAI capability evidence. When it lacks a current SitecoreAI explanation, read the official platform overview once and reuse it rather than inferring features from XP or doing a search per field. Brand Kit provides voice/naming, not technical proof.

The official platform overview reviewed 2026-11-05 describes SitecoreAI CMS/visual authoring, connected content/data/personalization/optimization, AI agents that draft/tag/translate/activate content, and role-based permissions, approval gates and audit logs with people approving/publishing. Use only relevant source-backed capabilities, phrased as opportunities for the target account—not as its existing deployment. Historic customer results cannot establish SitecoreAI-agent results.

## Evidence

Every statement on the page is backed by **evidence**: a source you can name in the report.

| Statement about | Allowed evidence |
|---|---|
| The account | The marketer's answers (always win), then public web sources (official site, annual report, reputable press) |
| What Sitecore sells and how it sounds | Sitecore brand context documents; Sitecore Brand Kit for voice and terms |
| What a SitecoreAI capability does | Sitecore documentation search, then sitecore.com pages |
| Customer story summary/source | One ready, source-linked story selected through *Customer evidence retrieval*, or one verified official-story fallback; the reference customer may differ from the target account |
| Customer quotes and outcome figures | The selected record's source-backed quote/attribution and achieved outcome figures, or the same official fallback story; copied verbatim |
| Automatic hero image | A search result with an existing public link, assumed usable for this demo through *Images* |

A factual statement without evidence is left out. Unsupported copy, figures and quotes stay empty and are reported as **gaps**; empty fields are hidden on the live page. Images use the simple findable + public-link rule; no catalog or image-evidence audit is required.

## Tools

Tools load on demand. Load the required namespaces with `ToolSearch` in step 1; discover the Content Hub connector when choosing images as described in *Images*.

| Namespace / connector | Tools this skill uses |
|---|---|
| `marketer_mcp` | `get_brand_context`, `get_brand_context_items`, `list_brandkits`, `get_brandkit_by_id`, `get_content_item_by_path`, `get_content_item_by_id`, `search_assets`, `create_page`, `update_fields_on_item`, `update_content` |
| Content Hub MCP | `visual_search` / `search` with `thumbnails: false`, `public_link` with `action: "list"`, `get_entity` only for missing formatting values |
| `web_search` | `web_search` |
| `sitecore_documentation_mcp` | `search_sitecore_knowledge_sources` |
| `skill_runtime` | `bash` (character counts) |

The **only write tools** are `create_page`, `update_fields_on_item` and `update_content`, all in `marketer_mcp`. Call them only in step 6 and step 7, only on the confirmed target page, and only after draft approval. Page work goes through `marketer_mcp` alone: tools with similar names in other namespaces (`pages`, `content`) create page versions and are outside this skill. Content Hub is **read-only**: use the tools above, with the explicit `public_link` action; its default is `create`, which is outside this skill.

The page open in Page builder, if any, is context only. It becomes the target only when it is this account's page and the marketer chose "update" in intake.

## Process

1. **Load tools and Sitecore context.**
   - Load the namespaces in *Tools* with `ToolSearch`. If `marketer_mcp` does not load, stop and tell the marketer: "The Marketer MCP is not available to this agent. Enable it under Tools & skills → MCP and run again."
   - Read the Sitecore brand context with `get_brand_context` and keep its metadata/tree for later file-ID resolution. Read only the product, messaging/positioning, audience, content and style documents with `get_brand_context_items`, using file IDs from that tree. Defer the entire Customer Evidence folder's document text until step 4: no upfront Story Index, Stories, Case Studies, Testimonials, Success Metrics or Evidence Framework loading. Folder IDs are not content requests.
   - Call `list_brandkits` and load the published `Sitecore Brand Kit` with `get_brandkit_by_id`; if it does not exist, continue with the brand context for voice and note "Brand Kit not applied" for the report.

   Done when tools and non-evidence brand documents are loaded, the context tree is retained, and the Brand Kit is loaded or noted as missing; customer-story content remains deferred.

2. **Research the account** with web search: identity and legal structure (which entity owns the brand and the websites), what it sells and where, scale, digital and marketing posture, recent moves (last 18 months), current web platform and martech signals, any public Sitecore relationship. Done when you have a **dossier** of 8–12 short facts, each with its source URL.

3. **Intake.** Show the marketer the dossier, then ask about what is missing or uncertain: **one question per message, at most 5 questions**. Each question offers **at least 4 lettered options**, marks exactly one as **(Recommended)** with a one-line reason, and ends with "Or type your own answer." Build the options from the dossier, for example:

   ```
   Question 2 of 5 — Who is the page written for?
   A. Chief Digital Officer (Recommended: IKEA's digital transformation is led at CDO level)
   B. Chief Marketing Officer
   C. Head of E-commerce
   D. Head of Customer Experience
   Or type your own answer.
   ```

   Always ask:
   - **Goal**: what the page asks the account to do, with the exact URL. Options: the default goal (Recommended unless the marketer mentioned another), an event or webinar (name, date, URL), a meeting with a named account executive (calendar link), another URL. Check with web search that the URL exists; if you cannot confirm it, say so and offer the default goal again.
   - **Recipient**: the role the page is written for.
   - **Existing page**: read `/sitecore/content/main/main-website/Home/lp` with `get_content_item_by_path` and check its children. If a page for this account exists, ask: update it (new version), create a new page, or stop. Otherwise ask to confirm the page name, with `<account>-<goal>` in lowercase with hyphens as the recommended option, for example `ikea-briefing`.

   Ask about relationship status (prospect, existing customer, partner, unknown) or known pains only when research left them unclear. Choose the hero image yourself through *Images* unless the marketer already supplied one; image tags and asset nomination do not need an intake question. Done when the marketer has confirmed the dossier and answered every question. Write nothing to Sitecore before that.

4. **Choose the angle, then retrieve evidence.** Pick the SitecoreAI angle that best fits the confirmed account/recipient and map 2–3 pains to evidenced capabilities. Now run *Customer evidence retrieval* using that angle and the existing dossier/intake answers; no extra evidence-intake question. With v2 enabled, capture the selected customer's name, factual 1–3 sentence summary and source URL; its exact quote is optional. If v2 is pending, use only the same source's quote-only fallback and omit the new fields. Do not hunt for portraits/logos, three stats, or extra FAQ filler. Done when planned facts have sources and the chosen story/reason (or bounded no-evidence result) is ready for the draft.

5. **Build and review the draft.** Build every field as described in *Field map*, in the Brand Kit voice, and choose only the hero image through *Images*. For a new page, set `testimonialAuthorImage` and `partnerLogosImage` to `""`. For an update, reuse the target page's current values for these two fields; if they are not already in context, read the selected target once with `get_content_item_by_id` before preparing the draft. Preserve these existing values unless the marketer explicitly asks to replace/clear them, and show that change in the draft for approval. No portrait/logo search is needed. Count the characters of every limited field with `bash` rather than estimating. Run the *Checklist*; rewrite any failing field and run the full checklist again. Show a draft table of values, counts and evidence, including each chosen image's public URL/preview and basic field value (or a missing-result/public-link gap). The agent makes the image choice; there is no separate image-selection approval or nomination step. Ask the marketer to approve the whole page draft before any write. Draft approval is separate from the intake questions. Done when every check passes and the marketer has approved the exact draft.

6. **Write.**
   - New page: `create_page` with `parentId` = landing pages parent, `templateId` = page template, `name` = confirmed page name, `language` = `en`, and `fields` = `[{"Title": "<Title value>"}]` (single-key objects keyed by field name). Then **one** `update_fields_on_item` call on the new page ID with every other field as `{"name": "<field>", "value": "<value>"}` pairs; it edits version 1 in place.
   - Existing page: **one** `update_content` call with `itemId` = page ID, `siteName`, `language` = `en`, `createNewVersion` = `true`, and every field as `{name, value}` pairs. The previous content stays in the earlier version.

7. **Verify.** Read the page back with `get_content_item_by_id`. Compare every field with the value you sent; write any field that differs or is missing once more with `update_fields_on_item`, and read it back again. Build the **Page builder link** from the pattern in *Site facts*: `{ITEM-ID}` = the page's item ID in lowercase with hyphens and no braces, `{VERSION}` = the version you wrote (`1` for a new page; the version returned by `update_content` for an update). Use only this link: preview URLs from other tools carry an access token. Done when every field matches or is listed as a failed write, and the link is built.

8. **Report** as described in *Output*.

## Customer evidence retrieval

Run in step 4, **after** account research, intake and angle selection. Normal retrieval is **one compact index + one selected story**, reusing content already fetched in this run. The retained legacy documents are not a default case/quote bank; do not fetch the folder, all stories or the legacy documents, or audit sources/images to complete the library.

1. **Read the index only.** From the step 1 tree, locate the existing Customer Evidence folder and its exact file title **Story Index**. Call `get_brand_context_items` with the brand context ID and `itemIds: [<index-file-ID>]`. Use that file's successful content response. IDs come from the current tree, not paths or invented GUIDs. Missing, ambiguous or unreadable index goes to the bounded fallback below, not a required-context stop.
2. **Filter for SitecoreAI fit, then select one ready row.** Readiness means source-checked, not automatically suitable for this offering. Use the index's Proof fit:
   - `sitecoreai-direct`: source explicitly supports the current SitecoreAI product/capability and any claimed outcome.
   - `saas-foundation`: relevant composable/SaaS foundation evidence; identify it as such, never as proof of current SitecoreAI-agent results. A matching capability alone is insufficient if its product/context does not support the proposed statement.
   - `legacy-explicit-only`: XP-led or classic XM-led evidence; excluded from automatic selection, even for an existing XP account. Use only when the marketer explicitly requests that legacy story/comparison and its draft attribution makes the historical context clear. Merely confirming an XP relationship is not this exception.
   Prefer relevant `sitecoreai-direct` evidence; use a `saas-foundation` row only when no relevant direct row exists and the narrower foundation statement fits. If Proof fit is absent in an older index, classify conservatively from its Product context: XP-led/classic XM-led or uncertain rows are not automatic SitecoreAI proof. Do not relabel old results or pull a legacy quote/stat to fill optional fields.
   Rank within the eligible tier:
   1. Explicit marketer-selected applicable story.
   2. The target account's own applicable story.
   3. Capability/business-problem match to the SitecoreAI angle.
   4. Industry/business-model match.
   5. Recipient fit.
   6. Known publication recency, then stable story key. Unknown publication dates get no freshness bonus; document creation/review dates are not publication dates.
   This is prompt-guided judgment, not a coded score. Apply the product/proof eligibility filter before this ranking; customer/industry similarity or the account's XP relationship cannot override it. A marketer-selected official story outside the index uses the bounded fallback, rather than silently substituting another customer.
3. **Read that story only.** Resolve the row's exact document title under **Stories** from the retained tree and fetch that single file ID with `get_brand_context_items`. Confirm its ready status, story key, customer, source URL and applicability support the intended statement. A ready record's sourced content is sufficient: no routine official-page reread or link/quote audit. One alternate ready record is allowed only when the first is missing, stale, failed to fetch or cannot support the statement; if it also fails, record the evidence gap. Absence of an optional quote or metric is not a failure and does not trigger another story search.
4. **Bounded official fallback.** Use only when the index is missing/unreadable, no SitecoreAI-eligible relevant ready row fits, or the marketer explicitly selected an applicable story outside it. Reuse an applicable official story already supplied or returned during account research. Otherwise run **one targeted official-site search**, inspect at most **three** candidates, and read **one** best official customer-story body through the available web tool; snippets alone are not proof. Apply the same SitecoreAI-fit filter to web results; an XP case is not a default fallback. One alternate page is allowed only for a genuine retrieval/support failure. If no verified, product-relevant source supports the statement, leave evidence/quote/stat text empty and report the gap; do not switch the campaign to XP. No exhaustive search, legacy-document sweep or quotation hunt.
5. **Use one source consistently.** Map the chosen customer, Factual summary and Source to the three v2 fields; quote, speaker/title/company and any stat also come from that same record/source. Preserve historical products and exact quotations; do not turn XP/XM results into current SitecoreAI-agent claims. Forecasts are not achieved outcomes; scale/feedback figures retain their meaning in the summary. Use achieved stats only when their exact published value fits the existing field limit; if a qualifier/unit will not fit, omit that stat instead of rounding or removing the qualifier. Missing quote/attribution leaves all three quote/author text fields empty, with no portrait/logo lookup.
6. **Explain and continue.** Record `Selected <customer/story> because <capability/industry/recipient fit>.` for the draft/report, or the bounded no-evidence result. Continue the draft in the same turn; there is no separate evidence approval step. Whole-page approval before writes remains unchanged.

## Images

**Only `heroImage` is populated automatically.** Social proof is quote + author text by default: `testimonialAuthorImage` and `partnerLogosImage` are manual-only optional fields. For new pages write both as `""`; for updates carry forward their current values unless the marketer explicitly requests and approves a replacement or clear. Never search Content Hub or the media library for these two fields. They stay in the template and renderer for manually authored content. If the marketer supplies an existing image field value/asset/public URL for one, use the supplied value with normal field formatting—no discovery search.

**For the hero, an image found in search with an existing public link is assumed usable. Find it, take the public URL, and use it.** There are no tag, brand, ownership, rights, lifecycle, approval, expiry, MIME, identity or image-review gates; do not run an image audit or ask extra image questions. Do not impose a separate image-call budget or candidate-validation workflow. The ordinary whole-page draft approval still applies.

1. **Find an image.** Reuse a candidate already returned or use Content Hub `visual_search` / `search` for a suitable picture (`take: 3`, `thumbnails: false` keeps the response small). Use the connected instance as configured; no tenant/schema/model/relationship inspection is needed for image selection.
2. **Retrieve public links before deciding.** When search returns candidate IDs, the next image operation is **one batch** `public_link` call with `action: "list"`, `assets: ["<candidate-ID>", ...]` for all returned candidates, and `by: "id"`. Skip this lookup only when a public URL is already supplied/returned, in which case use it immediately. Temporary signed thumbnails in search results do not establish whether public links exist. This automatic lookup is for the hero only; do not start portrait or logo searches. Select a candidate with a returned public URL and use it. Only report no public image after the lookup returns no URL for the candidates. This is the required retrieval step, not an audit; Content Hub remains read-only with no upload or public-link creation.
3. **Format the field and continue the draft.** Use the identifier/title/size already returned. Only if needed, read `get_entity` with `idOrIdentifier: "<ID>"`, `by: "id"`, `members: "Title,SC.Asset.AltText,MainFile"` to obtain formatting values—not to decide eligibility. Parse `MainFile` if it is JSON text. Use available link-size or main-file width/height; if absent, use `1200` × `675` so the SDK image helper has dimensions. Use a short descriptive alt value. No metadata-completeness check or provenance report is required. Done when the image's public URL is assigned, or no result with a public link is available; continue to the page draft in the same turn.

Content Hub image XML uses the asset identifier as `dam-id` and the public URL for `src` / `thumbnailsrc`. Escape XML attribute values:

```xml
<Image src="<PUBLIC-URL>" dam-id="<ASSET-IDENTIFIER>" width="<W>" height="<H>" alt="<ALT-TEXT>" dam-content-type="Image" thumbnailsrc="<PUBLIC-URL>" />
```

Dimensions and XML encoding are rendering details, not image-eligibility checks. Show the chosen public preview in the ordinary page draft; no separate image approval is needed. Use the public link, not a temporary signed search thumbnail. For an XM media-library result, use its media item GUID in `<image mediaid="{GUID}" />`; a Content Hub identifier belongs in `dam-id`, not `mediaid`.

## Angles

| Account profile | SitecoreAI angle |
|---|---|
| Consumer brand at global scale (retail, CPG, home, hospitality) | One brand, many markets: personalized, on-brand experiences per market and visitor, produced at content velocity without engineering overhead |
| Regulated industry (finance, healthcare, pharma) | Governed AI: content at scale inside approval, compliance and brand guardrails |
| B2B or enterprise technology | Account-based experiences: account-specific pages and journeys without a sprint |
| Digitally maturing or mid-market | A platform to grow into: composable content and AI personalization paced to the team |

Name the SitecoreAI offering only from brand context or Sitecore knowledge, using its current names. Customer evidence preserves the source's historical products and attribution; those outcomes are not automatically results of the current offering.

## Field map

Write every field below on every run. "Empty" means `""`. Customer Evidence v2 is enabled in this environment: write all three fields together from the same published source story, or empty all three when no story is available. Keep fixed slots; unused stat/FAQ pairs are empty, not filler.

### Page

| Field | Type | Rule |
|---|---|---|
| `Title` | Single-Line Text | `<Account> and SitecoreAI` plus a short hook, max 70 chars (browser title) |
| `NavigationTitle` | Single-Line Text | `<Account>` |
| `ShowInNavigation` | Checkbox | `0` |

### Hero

| Field | Type | Limit | Rule |
|---|---|---|---|
| `heroEyebrow` | Single-Line Text | 40 | Short tag, e.g. `Prepared for IKEA` |
| `heroHeadline` | Single-Line Text | 80 | Names the account, benefit-led, no trailing period |
| `heroSubhead` | Single-Line Text | 200 | 1–2 sentences tied to a dossier fact |
| `heroPrimaryCta` | General Link | text 3–6 words | The goal: `<link text="…" linktype="external" url="<goal URL verbatim>" anchor="" target="_blank" />` |
| `heroSecondaryCta` | General Link | — | The secondary hero link from *Site facts* |
| `heroImage` | Image | — | Chosen and encoded through *Images*: Content Hub DAM XML or a verified Sitecore media GUID; else empty |
| `heroVideo` | General Link | — | Empty unless the marketer supplies a video URL |

### Features (2–3 populated cards, three authoring slots)

| Field | Type | Limit | Rule |
|---|---|---|---|
| `feature{1,2,3}IconName` | Single-Line Text | — | One of: `Sparkles`, `Brain`, `Bot`, `Wand2`, `Zap`, `Rocket`, `Globe`, `Languages`, `Layers`, `Workflow`, `Users`, `Target`, `ShieldCheck`, `Gauge`, `BarChart3`, `LineChart`, `Store`, `ShoppingCart`, `Boxes`, `Clock`, `Lightbulb` |
| `feature{1,2,3}Title` | Single-Line Text | 40 | 2–4 words, outcome-led |
| `feature{1,2,3}Description` | Rich Text | 100–180 chars inside `<p>` | One account pain → the SitecoreAI capability that solves it, as an outcome. Name the account in at least 2 of the 3 |

Use 2–3 useful feature cards. An unused card has empty icon/title/description fields; do not create icon-only filler. At least two populated descriptions name the account.

### Stats (0–3 populated slots)

| Field | Type | Limit | Rule |
|---|---|---|---|
| `stat{1,2,3}Number` | Single-Line Text | 8 | A Sitecore outcome figure from a published source, copied exactly |
| `stat{1,2,3}Label` | Single-Line Text | 30 | What it measures, with the customer name when it fits |

Stats describe achieved Sitecore outcomes from the selected story/source only; account facts, scale and feedback figures belong in appropriately qualified copy. Use only already-fetched figures whose exact values/qualifiers fit the limits; no forecast, rounding, qualifier removal or search to fill three slots. Unused slots stay empty (both fields) and are normal optional omissions. The renderer adapts columns and collapses the section content when all slots are empty.

### Social proof

| Field | Type | Rule |
|---|---|---|
| `testimonialQuote` | Rich Text | A published Sitecore customer quote, verbatim, in `<p>`, without surrounding quotation marks |
| `testimonialAuthorName` | Single-Line Text | The person's name as published |
| `testimonialAuthorTitle` | Single-Line Text | `<Role>, <Company>` as published, max 80 chars |
| `testimonialAuthorImage` | Image | **Manual-only optional:** new page `""`; update preserves the existing value unless replacement/clear is explicitly approved. No portrait search |
| `partnerLogosImage` | Image | **Manual-only optional:** new page `""`; update preserves the existing value unless replacement/clear is explicitly approved. No logo/strip search |

The quote/author text remains optional and verbatim; portrait/logo fields remain manual-only under *Images*. Use the enabled source-linked Customer Evidence card below. When no customer story is available, leave its three fields empty and use a real quote-only fallback if available; do not invent a quotation when a sourced story summary is sufficient.

### Customer Evidence v2 (enabled)

| Field | Type | Rule |
|---|---|---|
| `customerEvidenceName` | Single-Line Text | Reference customer's/company name as published; max 80 chars. It need not be the target ABM account |
| `customerEvidenceSummary` | Rich Text | 1–3 factual sentences from the linked story in `<p>`; a summary, not invented direct speech |
| `customerEvidenceLink` | General Link | The published story URL with text such as `Read customer story`, formatted as the other external links |

All three are populated together from one source, or all three are empty. An optional quote and its author must be from that same story; otherwise those text fields stay empty. Complete evidence fields automatically select the new presentation in `Default`/`Sitecore`; older pages without them keep the legacy presentation. The agent changes page fields only, not variants/layout/shared partial designs.

### FAQ (3–5 populated pairs, five authoring slots)

| Field | Type | Limit | Rule |
|---|---|---|---|
| `faq{1..5}Question` | Single-Line Text | 140 | A useful recipient question. At least two populated questions name the account |
| `faq{1..5}Answer` | Rich Text | 1–3 sentences in `<p>` | Direct and concrete, backed by evidence |

Choose 3–5 useful questions across time to value/migration, integration with the account's stack, security/compliance/data residency, AI governance, and the confirmed goal. The last populated question explains the goal and what the account gets. Fill consecutive slots; unused remaining pairs are `""`. Do not invent filler to reach five. Complete pairs render in order; incomplete/empty pairs and an entirely empty FAQ section collapse outside editing.

### Final CTA

| Field | Type | Limit | Rule |
|---|---|---|---|
| `finalCtaHeadline` | Single-Line Text | 80 | Names the account and invites the goal |
| `finalCtaSubhead` | Rich Text | 1 sentence in `<p>` | Names the goal; for an event, its name and date as the marketer gave them |
| `finalCtaButton` | General Link | text 3–6 words | Same goal URL as `heroPrimaryCta`, verbatim |

## Rich text format

Allowed tags: `p`, `strong`, `a`. No headings, lists, inline styles, classes, images or tables.

## Checklist

- Every populated Single-Line Text field is within its limit; every populated icon name is from the list. Unused stat/FAQ/feature slots are empty.
- Every General Link is `<link text="…" linktype="external" url="https://…" anchor="" target="_blank" />`; every Rich Text value is wrapped in `<p>`.
- The account name appears 5–10 times across authored text, including `heroHeadline`, `heroSubhead`, 2 of 3 feature descriptions, at least two populated FAQ questions and `finalCtaHeadline`.
- `heroPrimaryCta` and `finalCtaButton` use the goal URL exactly as the marketer gave it.
- Every account fact traces to the marketer or a dossier source; every Sitecore claim, figure and quote traces to its evidence.
- Quote/author text is real published evidence or empty. Enabled Customer Evidence fields share one selected source and are all populated or all empty; any quote/attribution and achieved stats share that source. Pending v2 fields are absent from write batches.
- The page markets SitecoreAI: current capabilities are evidenced, and legacy account context has not become the proposition. Legacy-product names appear in page copy only for an explicitly requested migration/comparison or legacy-story exception, never because intake confirmed an XP relationship.
- Evidence retrieval filters for SitecoreAI product/proof eligibility before ranking, then reads one selected ready record (one alternate only on real failure) or uses the bounded official fallback. No automatic legacy XP/classic XM proof, relabelled historical results or upfront/bulk customer-document loading. Selection/proof fit, unknown dates and metric meaning are explained.
- The tone is peer-to-peer for the recipient: concrete outcomes, second person, no superlatives the evidence does not support.

## Guardrails

- **Evidence only.** Write account facts as public facts, and pains as opportunities ("Teams running IKEA's scale of markets…"), never as insider knowledge.
- **Verbatim quotes and figures.** Copy customer quotes, names, titles and figures exactly; never round or merge them.
- **Never publish** and never change workflow or publishing settings. The marketer reviews the page in Pages and publishes it.
- **Page fields only.** Leave the layout, partial designs, shared content, the example page and other accounts' pages untouched.
- **One account per page.** Update an existing page only after the marketer chose "update" in intake.
- **Missing required tool, stop.** When a required brand-context or page-writing tool is unavailable, stop and report it. Optional customer-evidence lookup failures use *Customer evidence retrieval*'s bounded fallback/gap path; image-tool failures follow *Images*. Use only the named tools for their stated purpose.
- **Images:** automate the hero only with the found + public-link rule. Portrait/logo fields are manual-only: empty on new pages, preserved on updates unless an explicit replacement/clear is approved. Content Hub stays read-only.
- **English only.**

## Output

1. The page: name, path, item ID, version, and the line **Open in Page builder: <link>**; new page or new version of an existing page.
2. The dossier summary and chosen angle (one sentence each), plus `Selected <customer/story> because <fit>.` or the bounded no-evidence result.
3. A table of every field: name, value (shortened for rich text) and evidence (marketer, URL, brand context or Sitecore knowledge). For images, the public URL/preview is sufficient; no image verification/provenance table or audit notes.
4. **Gaps:** missing source for customer evidence/quote fallback, missing hero result/public link, unavailable hero-image tool, or Brand Kit not applied. Report pending v2 deployment/activation as **pending enhancement**, not failed content. Unused stat/FAQ slots and manual portrait/logo defaults are optional omissions, not missing assets/filler; mark existing images **preserved** on updates. Images still use the found + public-link rule.
5. **Review checklist** for the marketer: account facts and sources; Sitecore figures and quote; goal URL; gaps; the `Sitecore` variants visible on the page. Image choice is already part of the ordinary draft, not a separate review gate.
6. The line: "Review in Pages before publishing. Nothing was published."
