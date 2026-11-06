# Handoff — ABM agent and Brand Context iteration, 2026-11-05

**Resume here before continuing this work.** Repo-only handoff: do not upload it to Brand Context or Studio. Branch: `sitecore-demo`. This note records both completed work and pending live application; it is not a claim that every local change is installed in Studio.

## State at handoff

| Artifact / environment | State |
|---|---|
| Six customer-story documents | Prepared, marketer-uploaded and MCP read-back verified; source text remains unchanged |
| Original Story Index | Uploaded and verified at 2026-11-05T14:19:02.225Z, 4,882 characters |
| Current local Story Index | **5,695 characters**, with SitecoreAI Proof fit metadata; replacement/read-back in Brand Context is still pending |
| `SKILL.md` | Updated locally for selective retrieval, SitecoreAI product focus and product-first proof filtering; latest correction is not live-verified |
| `agent.json.prompt` | **Updated directly and read back locally. Only this attribute changed**; all other JSON attributes/config are identical to the prior file |
| Remaining `agent.json.config` | Still the older Studio export, not a verified snapshot of current connected tools/skills/connectors |
| Studio | Marketer reported installing the earlier skill/prompt revision; supplied test responses and a full Sage run. Latest product-focus correction/application and current export remain pending |
| Frontend, templates and shared layout | Unchanged in this iteration. Customer Evidence v2 was already deployed before this content/retrieval work |
| Git | Changes from this iteration are uncommitted/unpushed at handoff; HEAD is `411b84d2` |

The **`prompt` property in `agent.json` is the system prompt's source of truth**. README files are human/operator instructions, not files to upload as agent knowledge. `source-review.md` is an audit note, also not an upload document.

To apply the prompt safely, copy its decoded string into the existing connected Studio agent. Do not import the entire older configuration over that agent. Obtain a fresh Studio export afterward and preserve its real connector and skill identifiers when synchronizing the repository.

## What we built in Brand Context

We reused the existing **Sitecore** Brand Context:

- Context ID: `43723db2-802c-4960-8d86-09fea574c117`.
- Customer Evidence folder: `044c45f8-ff0a-4650-ac52-4461a1247867`.
- Stories folder: `8a5ac876-deb9-4367-8b60-f8fdb9fb5ccd`.
- Story Index file: `1d9b8a2a-8c2d-4bda-8b47-b411276a1269`.

The marketer added Story Index directly under Customer Evidence and six individual records under Stories. **Evidence Framework, Case Studies, Testimonials and Success Metrics were retained**, as was unrelated knowledge. No context rebuild, Brand Kit replacement or assistant-side Brand Context write occurred. This MCP connection exposes context reads, not document create/edit tools; the marketer edits/uploads in the UI.

All seven original uploaded files succeeded in a batched MCP read and matched prepared text after whitespace normalization. Full story-file IDs and upload verification live in [the library guide](customer-evidence/README.md); resolve current IDs from the metadata tree if a document is recreated.

The pack's records have official URLs, factual summaries, actual products, optional source passages/metrics and applicability caveats. There are nine optional metric entries and two verified direct quotes. Publication dates are **unknown**; review/upload dates are not publication dates. The source audit and relevant first-party passages are in [source-review.md](customer-evidence/source-review.md).

### Revised proof fit — local metadata, upload pending

| Stories | Proof fit / automatic use |
|---|---|
| Microsoft, Fujitsu, FIS | `legacy-explicit-only`: XP-led historical evidence; not automatic SitecoreAI proof |
| WellSpan Health | `legacy-explicit-only`: classic Sitecore XM-led evidence, not XM Cloud/current SitecoreAI proof |
| United Airlines, Pet Supplies Plus | `saas-foundation`: relevant composable/SaaS foundation evidence, **not proof of current AI-agent results** |
| Direct current SitecoreAI-result stories | None in this pilot yet |

Source readiness (`ready`) and suitability for the current offering are separate. We **did not rewrite old products, metrics or quotations as SitecoreAI results**, nor retire/delete the historical records. There is no requirement to force a third statistic or a quotation.

## Agent changes and the important correction

### Selective retrieval

The agent now keeps Brand Context metadata/tree for ID lookup and loads the usual non-evidence product, audience, messaging and style documents. Customer Evidence text is deferred until after research, intake and angle selection.

Normal evidence retrieval is **one index + one selected ready story**, not a bulk read of Stories/legacy documents. One alternate record is allowed only on a genuine retrieval/staleness/support failure. Official-web fallback is bounded, with the same product-fit filter; unavailable valid evidence means empty proof, not an irrelevant substitute. Missing optional quotes/stats must not cause extra searching or intake.

The runtime procedure is authoritative in [SKILL.md](SKILL.md#customer-evidence-retrieval), not duplicated in this handoff. Selection remains prompt-guided judgment; no ranking server/helper was built.

### Why the first full Sage run was rejected

The marketer selected a SitecoreAI briefing, VP of Digital Experience / Head of Web, and confirmed that Sage is an existing **XP** customer. The agent incorrectly treated that account fact as campaign direction: it chose FIS historical XP proof and wrote “Build from XP,” XP-centered FAQs and an XP-path CTA.

Historical attribution was factually careful, but **factual accuracy alone did not meet the SitecoreAI campaign goal**. Earlier smoke-test passes for FIS/WellSpan selection are superseded as acceptance of automatic current-product proof.

The correction now makes these distinctions explicit in both `SKILL.md` and `agent.json.prompt`:

- **The offering is SitecoreAI.** Existing XP/classic XM is account background, not permission to switch the proposition.
- Legacy names stay in the dossier/report by default. A migration/comparison narrative or legacy-story exception needs an explicit request; “existing XP customer” alone is not that request.
- **Product/proof eligibility precedes ranking**, rather than being a low-priority industry/pain tie-break.
- Prefer relevant current-product evidence; use foundation evidence only for a narrower supported statement. Do not turn legacy results into AI-agent outcomes or select an unrelated case merely to fill the card.
- Keep hero/features/FAQ/CTAs about current SitecoreAI capabilities. A missing suitable story is acceptable.

We read the live Product Portfolio and Capabilities Matrix: they cover the broader portfolio, including XP, but do not describe the current unified SitecoreAI offering. They were **not rewritten**. Current offering scope was checked against [Sitecore's official platform overview](https://www.sitecore.com/platform), including CMS/visual authoring, connected content/data/personalization/optimization, AI content agents, permissions/approval gates/audit logs and human publishing control. Brand Kit supplies voice/naming, not technical capability proof.

## Tests and limits of verification

| Marketer-supplied test | Reviewed result |
|---|---|
| Sage / CMO fixture | FIS, 2 reported content calls / 7,646 characters. Source, quote and stat handling were correct under the earlier rule; automatic FIS selection is **not accepted under the new product focus** |
| AEGEAN / CDO fixture | United, 2 reported calls / 7,375 characters. Initially treated scale/feedback as eligible stats; a fresh exact-field fixture correctly left all stat/quote fields empty and kept qualified figures in the summary |
| Mayo Clinic / digital experience fixture | WellSpan, 2 reported calls / 6,994 characters. Correct XM name, 20% new accounts in the first two months after launch, 28-character stat label and empty optional fields. **Automatic legacy XM selection is superseded by the new focus** |
| Full Sage run | XP-focused proposition rejected despite marketer-approved creation; follow-up needs a corrected whole-page draft |

These were output/field reviews, not independently measured latency benchmarks. The expanded tool arguments, durations and a current Studio export are still missing. The full Sage transcript shows tool names/order, but it does not independently establish exact fetched IDs/payloads, image-link action, every stored field, or publication state.

Local checks passed:

- 28 static selective-retrieval/preservation checks before the stricter focus correction.
- 12 product-focus/preservation checks after it; the prior policy fails eight of those checks.
- After directly editing `agent.json.prompt`, JSON parsing/read-back confirmed **only `prompt` changed**; `config` and every other attribute stayed identical.
- `npm run agents:check` and `git diff --check`.

Test prototypes/snapshots were under `/tmp`, not permanent project tests. Static checks validate policy text and metadata, not actual LLM compliance. The application test suite was not rerun because no frontend implementation changed here. Do not report a performance improvement without repeated before/after traces under the same prompts/model/settings.

## Pages and UI observations — do not confuse them

- The full Studio run reports creating **`sage-briefing`**, item `4bde5ca1-b53f-4628-bebc-1a2956a45d00`, version 1, after approval, with field read-back and no publishing. This is marketer-reported; this assistant did not independently read the page or change it.
- **`saga-briefing` is a different page name.** It was supplied with the screenshot discussion; do not silently equate or modify it as Sage.
- The screenshot's large empty third stat and quote/author placeholders were in **Pages editing mode**. The marketer confirmed preview looked good because empty stats are hidden. Empty editor fields must remain authorable; no renderer/layout change was made.
- The earlier Pages module-MIME error was reproduced on obsolete Pages-app script URLs returning HTML while the current app main script returned JavaScript. Browser/CDN stale-build investigation was not conclusively closed; no MIME/Next.js configuration change was made. It is separate from agent content/retrieval.

## Preserved safeguards

Hero-only automatic image selection remains search → existing public-link list → formatting, with no eligibility audit. Content Hub stays read-only; `public_link(action: "list")` must be explicit. Portrait/logo fields are manual-only: empty on new pages, preserved on updates unless replacement/clear is approved.

Stats accept achieved outcomes only, exact number/qualifier within 8 characters and label within 30. Scale/feedback may stay qualified in summary copy; forecasts are not achieved outcomes. Quote absence and unused slots are normal optional omissions, not requests for filler. Empty values must be `""`, not literal backticks/placeholders.

Whole-page draft approval precedes writes. Page writes use the established Marketer MCP workflow with read-back; no shared layout/design changes and no automatic publishing. Check the environment marker from project configuration before any Sitecore write; never create/delete markers yourself.

## Next actions, in order

1. Have the marketer replace **the existing Story Index's content only** with current `customer-evidence/story-index.md` (5,695 characters). Keep its title/ID where possible; no duplicate index or six-story re-upload. Read the revised index back through MCP and compare metadata/content before marking it verified.
2. Apply current `SKILL.md` and **`agent.json.prompt`** to the existing Studio agent without overwriting connected config. Obtain/export current Studio JSON and verify actual attached skill/tool/connector identifiers; do not guess them.
3. Run fresh read-only SitecoreAI-focus tests, including an existing-XP Sage account. It must not default to an XP proposition/FIS proof. Recheck healthcare against the new eligibility filter; do not count prior legacy selections as passes. Capture actual tool details and timings; keep fallback bounded.
4. Request a revised whole-page draft for the **existing `sage-briefing`** page. Preserve confirmed recipient/goal and existing fields/media as appropriate; explicitly revise the legacy-facing copy and stale proof values. Obtain approval before creating a new version or clearing/replacing anything. Do not change `saga-briefing` or shared layouts.
5. Add more current-product/direct stories only after source validation and relevance testing. Do not blindly bulk-upload all stories or rebuild Brand Context.

### Git scope for a later commit

Relevant work is this agent bundle (including `customer-evidence/` and this note) plus `docs/ai/backlog/customer-evidence-library-plan.md`. Two pre-existing untracked design-studio files are unrelated and **must be excluded**:

- `docs/ai/backlog/design-studio-atoms-handoff.md`
- `docs/ai/reference/design-studio-atoms.md`

No workflow, Docker, serialized Sitecore item, lockfile, generated agent file, frontend implementation or deployment change belongs to this iteration.
