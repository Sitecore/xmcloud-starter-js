# Customer evidence pilot — upload and verification

**State:** Marketer uploaded the index and six stories; all seven passed Marketer MCP read-back at 2026-11-05T14:19:02.225Z. The original uploaded text matched the then-prepared files after whitespace normalization, and all four original evidence document IDs remain present. The local retrieval amendment is ready and the marketer reports the Studio skill/prompt update applied; live retrieval acceptance, baseline comparison and current agent export are still pending.

## Scope

Content-only phase of the [approved execution plan](../../../backlog/customer-evidence-library-plan.md). Authoring stays in this agent bundle; sharing with other agents can be decided after the pilot. No rendering/template/component changes are needed: existing `customerEvidenceName`, `customerEvidenceSummary` and `customerEvidenceLink` fields supply the evidence card. The local skill now contains the selective-retrieval amendment. The marketer reports installing the live Studio update, but it has not been independently verified. Only `agent.json.prompt` is now updated locally; its other attributes/config are still the older export. Copy the prompt value into Studio without importing the stale full config; current export synchronization remains pending.

Skills used: research for first-party source checks; writing-for-agents for selective disclosure; sitecore-standards for the existing output-field boundary. The marketer performed the Brand Context upload; verified document IDs are cached below rather than registered as XM Cloud rendering/template items.

## SitecoreAI-first correction — index update pending

The latest full Sage run treated a marketer-confirmed XP relationship as a reason for an XP-led pitch/FIS proof. The local skill now separates relationship facts from the SitecoreAI offering and applies product/proof eligibility before ranking. The original Product Portfolio/Capabilities Matrix are broad portfolio knowledge; they must not turn XP capabilities into SitecoreAI claims. Current capability evidence is the official platform overview cited by the skill.

The local Story Index now has a **Proof fit** column. Microsoft, Fujitsu, FIS and classic XM-led WellSpan are `legacy-explicit-only`; United and Pet Supplies Plus are `saas-foundation`, not direct proof of current AI-agent results. There are currently no `sitecoreai-direct` pilot records. Source readiness and product eligibility are separate, and an existing XP account is not a legacy-proof exception.

**Update only the existing Story Index document** under Customer Evidence, keeping its title/ID if the UI supports editing. Replace its content with the revised `story-index.md` (5,695 characters), then tell the assistant to verify it. Do not create a duplicate index or rewrite/re-upload the six source stories. Original index read-back below is historical; the revised metadata is not live-verified yet. Then install the updated skill and replacement prompt rule from the bundle README, preserving connectors. The new skill conservatively filters an older index using Product context until metadata is updated. All 12 local product-focus/preservation checks pass (the prior snapshot fails eight); these validate policy text and metadata, not live LLM selection.

Re-run product-focus tests: Sage confirmed as an XP customer must still get a SitecoreAI pitch and no default FIS proof; healthcare must not default to classic XM-led WellSpan; foundation cases must not claim current AI-agent results. A relevant-proof gap is preferable to an unrelated or legacy case. The already-created `sage-briefing` page needs a revised whole-page draft/approval before any content update; no page write is authorized by this correction.

## Files to upload

Upload **only** `story-index.md` and the six Markdown files under `stories/`. This README and `source-review.md` are operator/review material, not agent knowledge to upload.

| File | Required Brand Context display title | Verified item ID | Upload / read-back |
|---|---|---|---|
| `story-index.md` | Story Index | `1d9b8a2a-8c2d-4bda-8b47-b411276a1269` | Original verified; revised Proof fit metadata pending |
| `stories/microsoft-partner-network.md` | CE - Microsoft - Partner Network | `16bb77c9-b2d5-4c64-94c6-ed73c46ae48f` | Verified 2026-11-05 |
| `stories/united-airlines-gate-experience.md` | CE - United Airlines - Gate Experience | `e4568faa-8569-497a-9d05-8fe54a05b974` | Verified 2026-11-05 |
| `stories/fujitsu-content-governance.md` | CE - Fujitsu - Content Governance | `e64508f0-7154-43ec-9e91-95038e2d2248` | Verified 2026-11-05 |
| `stories/pet-supplies-plus-composable-retail.md` | CE - Pet Supplies Plus - Composable Retail | `eb7e2e57-b273-41d8-90b1-244469e588c6` | Verified 2026-11-05 |
| `stories/wellspan-personalized-patient-experience.md` | CE - WellSpan Health - Patient Experience | `26f9aed8-7200-4d06-84a3-407c9cfb5827` | Verified 2026-11-05 |
| `stories/fis-digital-first-marketing.md` | CE - FIS - Digital-first Marketing | `35020303-711c-47f9-9b3c-c00fca90ea91` | Verified 2026-11-05 |

Use the exact display titles above; a filename or Markdown H1 does not prove the UI stored the same title. Titles and stable story keys are the mapping; verified IDs above are a cache and must be resolved again if documents are recreated. Records have `Status: ready` because their content is source-checked; the upload/read-back gate is now verified, but active retrieval has not yet changed. Maintenance states are `candidate`, `ready`, `retired`; only ready entries are eligible for selection.

## Additive upload — marketer/content owner

The connected Marketer MCP exposes Brand Context reads, not document create/edit tools. Upload owner: the marketer operating this session's UI; upload is complete. Long-term maintenance ownership is still to be assigned.

1. Confirm the intended **Sitecore** Brand Context ID `43723db2-802c-4960-8d86-09fea574c117` and existing **Customer Evidence** folder ID `044c45f8-ff0a-4650-ac52-4461a1247867`. Reuse that folder; do not rebuild the context or import a replacement Brand Kit.
2. Retain **Evidence Framework**, **Case Studies**, **Testimonials** and **Success Metrics**, plus all unrelated knowledge. Reuse or create a folder named **Stories** under Customer Evidence.
3. Upload the six story Markdown documents into Stories. Set each exact display title from the table; preserve the content, source URLs, quotation/attribution and status.
4. Upload `story-index.md` directly under Customer Evidence and title it **Story Index**. Uploading the index last avoids ready rows pointing at documents not yet present.
5. Tell the assistant **“Customer evidence pilot uploaded”**. If the UI converts the content, verification must check the resulting text rather than assuming the attachment round-tripped.

Expected tree:

```text
Customer Evidence/
  Evidence Framework     retained
  Case Studies           retained
  Testimonials           retained
  Success Metrics        retained
  Story Index            new
  Stories/               new
    CE - ...             six source-linked records
```

## Read-back gate — assistant through the same Marketer MCP

1. Call `get_brand_context({brandContextId: "43723db2-802c-4960-8d86-09fea574c117"})`. Check the existing folder/retained documents and resolve Story Index plus Stories' files by exact title. Stop on missing or ambiguous titles; do not invent or guess file IDs.
2. Call one `get_brand_context_items` batch with the seven resolved **file** IDs (index + six records). Folder IDs are not content requests; the tool's maximum batch size is 50, not a reason to fetch extra documents.
3. Verify every individual success/content response, exact story key, ready status, customer, source URL, summary and any quote/attribution. Check each index row maps to exactly one uploaded file. Normalize only harmless Markdown/whitespace transformations; changes to claims or attribution fail the gate.
4. Record the real IDs and verified date here after successful reads. Until then, report **prepared; not uploaded/verified**. Retained document IDs from the inventory remain unchanged.

This seven-file read is a one-time upload audit, **not** the normal ABM retrieval pattern.

**Verified 2026-11-05T14:19:02.225Z:** Story Index is directly under Customer Evidence; Stories folder ID is `8a5ac876-deb9-4367-8b60-f8fdb9fb5ccd`. All seven requested files succeeded and matched local content (19,108 returned characters in total). Source URLs, readiness, metrics and quotations round-trip with the text. The original Evidence Framework, Case Studies, Testimonials and Success Metrics IDs remain present with their prior update timestamps. No Brand Context write was sent by the assistant.

## Local verification

- Six index rows map to six exact document titles, stable keys and official source URLs.
- Metric passages match the previously fetched official bodies; the two quotes retain exact text and speaker/title/company attribution. Fujitsu's quote/product tag was checked in the preceding raw-HTML audit.
- Publication/review dates are separate; no projected FIS or retail growth figure is stored as an achieved metric. Forecast caveats stay in Applicability notes, not in the page-ready summary.
- Relative links, whitespace and table structure pass; `npm run agents:check` and `git diff --check` pass. No application code changed, so the application test suite was not rerun.
- Local retrieval amendment passed 28 static policy/preservation checks: deferred loading, ordered selection, bounded fallback, same-source proof, historical/date/qualifier handling, unchanged intake/images/page writes, unchanged agent-export hash, and intact uploaded index/record lengths. `agents:check` and whitespace checks pass. These checks validate the document policy, not actual LLM execution.
- Marketer-uploaded knowledge passes read-back; Studio installation is marketer-reported. Live retrieval acceptance, export synchronization and measured comparison remain pending.

## Next gate — Studio installation and comparison

The local [skill](../SKILL.md#customer-evidence-retrieval) now implements the customer-evidence amendment. Its retrieval section is the authoritative runtime procedure; this guide records uploads/IDs, not a second copy of that policy. The local edit does not change the live Studio skill.

Before replacing the Studio skill, capture repeatable baseline runs for Sage, AEGEAN and another industry with the same prompts/model/settings. Then follow the [bundle installation and replacement prompt rule](../README.md#install--update), preserving existing connector selections. Obtain the current Studio export before auditing/editing its configuration; the older repo `agent.json` is not an importable replacement for the connected agent.

Use the bundle's read-only evidence fixtures and normal approved draft/write/read-back acceptance. Compare relevance, source consistency, evidence-stage/draft time, customer-document calls/returned characters and proof-related searches. Local policy checks are not a measured latency improvement. Studio installation, export synchronization and measured acceptance remain pending; expand only after bounded retrieval and non-regression are demonstrated.

## Maintenance / rollback

Maintain a source-linked story once in its document and selection metadata once in the index. Recheck the official source when facts/product applicability change; mark unverified entries candidate and obsolete entries retired. Publication dates remain unknown until verified from the publisher. Preserve historical products and verbatim quotes.

If the pilot regresses, keep the retained knowledge and revert only the retrieval amendment; leave the new documents unused. No Brand Context deletion, new server/ranker, template migration or layout change is needed.
