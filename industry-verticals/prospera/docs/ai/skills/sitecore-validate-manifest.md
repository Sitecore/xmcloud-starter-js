# Sitecore validate and repair manifest

Validate the Sitecore manifest against live Sitecore state via MCP, auto-fix what can be fixed, and surface what needs human intervention.

## Trigger hints

Use this skill when:
- Starting work after a long break or environment switch
- The `sitecore-build-demo` Phase 0.5 spot-check fails
- A demo build pipeline fails mid-execution with "item not found" errors
- The user says "validate manifest", "sync manifest", "check manifest", "manifest is stale"
- The user switched Sitecore environments (different site collection or site name)
- Items were manually deleted or recreated in Sitecore Content Editor

## Prerequisites

- `docs/ai/manifests/sitecore-manifest.yaml` must exist
- `docs/ai/config/project.yaml` must exist
- MCP connection to Sitecore must be active (any `get_content_item_by_path` call should succeed)

## Load first

- `docs/ai/config/project.yaml`
- `docs/ai/manifests/sitecore-manifest.yaml`

---

## Validation levels

The skill operates in two modes. Always start with Quick unless the user explicitly requests Full.

| Mode | What it checks | MCP calls | Time estimate |
|------|---------------|-----------|---------------|
| **Quick** | project.yaml vs manifest, 7 root paths, React files exist | ~7 MCP + filesystem | ~15 seconds |
| **Full** | Everything in Quick + every component's template, rendering, datasource folder, variants, example items | ~4-6 per component x 18 = ~80-100 MCP | ~3-5 minutes |

---

## Quick validation

### Step 1 — Config consistency check (no MCP needed)

Compare `docs/ai/config/project.yaml` against the manifest's `project` block:

| Field | project.yaml | manifest.project | Must match? |
|-------|-------------|-----------------|-------------|
| `siteCollection` | `siteCollection` | `siteCollection` | Yes |
| `siteName` | `siteName` | `siteName` | Yes |
| `sdk` | `sdk` | `sdk` | Yes |
| `renderingsRoot` | `renderingsRoot` | `renderingsRoot` | Yes |
| `projectTemplatesRoot` | `projectTemplatesRoot` | `projectTemplatesRoot` | Yes |

**If mismatch found:**
- This is the most common issue (environment switch)
- **Auto-fix:** Update the manifest's `project` block to match `project.yaml`
- **Also update** all site-dependent paths in the manifest:
  - `project.dataRoot` — rebuild from `siteCollection` + `siteName`
  - `project.headlessVariantsRoot` — rebuild from `siteCollection` + `siteName`
  - All `datasourceFolder.path` entries — they contain the site path
  - All `headlessVariants.containerPath` entries — they contain the site path
  - All `lookups` entries that contain the site path
- **Cannot auto-fix:** The `itemId` values in site-dependent paths — these need MCP re-resolution (proceed to Step 3)
- **Flag for user:** "Environment mismatch detected. Manifest paths updated but item IDs need re-resolution. Running root path validation..."

### Step 2 — React file existence check (no MCP needed)

For every component in the manifest with `status: "complete"`:
1. Check that `react.filePath` exists on disk
2. Check that the file exports the variants listed in `react.variants`

**If file missing:**
- **Cannot auto-fix** — the component code was deleted
- **Flag for user:** "Component `<name>` React file missing at `<path>`. Was it intentionally removed?"

**If variants mismatch** (file exports differ from manifest):
- **Auto-fix:** Update `react.variants` in the manifest to match the actual file exports
- **Flag for user:** "Updated `<name>` variants in manifest: was [A, B], now [A, B, C]"

### Step 3 — Root path validation (7 parallel MCP calls)

Validate the 7 critical root paths from `lookups` exist in Sitecore. Run all 7 in parallel:

```
1. get_content_item_by_path(project.dataRoot)
2. get_content_item_by_path(project.projectTemplatesRoot + "/Components")
3. get_content_item_by_path(project.projectFoldersRoot)
4. get_content_item_by_path(project.renderingParamsRoot)
5. get_content_item_by_path(project.headlessVariantsRoot)
6. get_content_item_by_path(project.renderingsRoot)
7. get_content_item_by_path("Available Renderings/Page Content" under site)
```

For each result:

**If item found and ID matches manifest lookup:**
- No action needed

**If item found but ID differs from manifest:**
- **Auto-fix:** Update the `lookups` entry with the new `itemId` and current timestamp
- **Flag for user:** "Root path `<path>` ID changed: was `<old>`, now `<new>`. Updated."

**If item not found (404 / error):**
- **Cannot auto-fix** — the root structure is missing in Sitecore
- **STOP validation** — this is a critical failure
- **Flag for user:** "CRITICAL: Root path `<path>` does not exist in Sitecore. This means either: (a) you switched environments and need to update project.yaml, or (b) the Sitecore items were deleted. Please verify your environment and re-run."

### Step 4 — Component map check (no MCP needed)

Read `.sitecore/component-map.ts` and verify:
- Every manifest component with `status: "complete"` has a matching entry in the component map
- The `componentMapKey` matches the import key

**If component missing from map:**
- **Cannot auto-fix** — requires code change and dev server restart
- **Flag for user:** "Component `<name>` (key: `<key>`) is in the manifest but not in component-map.ts. Run the component registration step."

**If component in map but not in manifest:**
- Informational only — could be a manually added component
- **Flag for user:** "Component `<key>` is in component-map.ts but not in the manifest. Consider adding it."

### Step 5 — Quick validation report

Output a summary:

```
MANIFEST VALIDATION — QUICK MODE
=================================
Config consistency:  PASS / FAIL (environment mismatch)
React files:         17/18 PASS (1 missing)
Root paths:          7/7 PASS
Component map:       18/18 PASS
Lookups updated:     3 entries refreshed

Auto-fixed:
  - Updated manifest project block (europe/sage-uk -> main/main-website)
  - Updated FAQAccordion variants: added "Compact"
  - Refreshed dataRoot lookup ID

Needs human intervention:
  - NewsletterSignup React file missing at src/components/uiim/forms/NewsletterSignup.tsx

Recommendation: Quick check PASSED. Run Full validation if starting a demo build.
```

If Quick passes with no critical issues, stop here unless the user wants Full.

---

## Full validation

Full validation includes everything in Quick, plus per-component deep checks.

### Step 6 — Per-component Sitecore validation

For each component in the manifest with `status: "complete"`, validate its Sitecore items exist. **Group MCP calls in parallel batches of 4-5** to balance speed and reliability.

#### 6a. Template validation

```
get_content_item_by_path(templates.datasource.path)
```

**If found and ID matches:** PASS
**If found but ID differs:**
- **Auto-fix:** Update `templates.datasource.itemId` in manifest
- Check if `standardValues.itemId` also needs updating:
  ```
  get_content_item_by_path(templates.datasource.path + "/__Standard Values")
  ```
  Update if ID differs.

**If not found:**
- **Cannot auto-fix** — template was deleted from Sitecore
- Set component `status: "failed"`
- Add to `verification.failed`: "Datasource template not found at `<path>`"
- **Flag for user:** "CRITICAL: Template for `<name>` was deleted. Needs full recreation via `sitecore-create-simple-component` or `sitecore-create-list-component`."

#### 6b. Child template validation (list components only)

```
get_content_item_by_path(templates.child.path)
```

Same logic as 6a.

#### 6c. Folder template validation

```
get_content_item_by_path(templates.folder.path)
```

Same logic as 6a.

#### 6d. Rendering validation

```
get_content_item_by_path(rendering.path)
```

**If found and ID matches:** PASS
**If found but ID differs:**
- **Auto-fix:** Update `rendering.itemId` in manifest
- **Also check:** Is the rendering still in Available Renderings? The old GUID would be registered, not the new one.
- **Flag for user:** "Rendering `<name>` ID changed. You may need to update Available Renderings to replace the old GUID."

**If not found:**
- **Cannot auto-fix** — rendering was deleted
- Set component `status: "failed"`
- **Flag for user:** "CRITICAL: Rendering for `<name>` was deleted. Needs recreation."

#### 6e. Datasource folder validation

```
get_content_item_by_path(datasourceFolder.path)
```

**If found and ID matches:** PASS
**If found but ID differs:**
- **Auto-fix:** Update `datasourceFolder.itemId`

**If not found:**
- **Auto-fix attempt:** Recreate the folder using MCP:
  ```
  create_content_item(
    name=datasourceFolder.name,
    templateId=templates.folder.itemId,
    parentId=<dataRoot itemId from lookups>
  )
  ```
- If recreation succeeds, update the manifest with the new ID
- **Flag for user:** "Datasource folder for `<name>` was missing. Recreated at `<path>`. Insert options may need manual verification."

#### 6f. Example item validation

```
get_content_item_by_path(datasourceFolder.path + "/" + exampleItem.name)
```

**If found and ID matches:** PASS
**If found but ID differs:**
- **Auto-fix:** Update `exampleItem.itemId`

**If not found:**
- **Auto-fix attempt:** Recreate example item:
  ```
  create_content_item(
    name=exampleItem.name,
    templateId=templates.datasource.itemId,
    parentId=datasourceFolder.itemId
  )
  ```
- Set default field values from the template's standard values
- Update manifest with new ID
- **Flag for user:** "Example item for `<name>` was missing. Recreated with default values."

**For list components — also check children:**
```
get_content_item_by_path(datasourceFolder.path + "/" + exampleItem.name + "/" + child.name)
```
Same auto-fix logic.

#### 6g. Headless variants validation

```
get_content_item_by_path(headlessVariants.containerPath)
```

**If container found:**
- Check each variant definition exists as a child
- For missing variants: recreate using the variant definition template ID from the container's children
- **Auto-fix:** Recreate missing variant definitions

**If container not found:**
- **Auto-fix attempt:** Recreate container + all variant definitions
- **Flag for user:** "Headless Variants container for `<name>` was missing. Recreated with `<N>` variants."

### Step 7 — Rendering Parameters validation

For each component, verify the rendering parameters template exists:

```
get_content_item_by_path(templates.renderingParams.path)
```

**If found and ID matches:** PASS
**If found but ID differs:**
- **Auto-fix:** Update `templates.renderingParams.itemId`
- **Flag for user:** "Rendering params template for `<name>` ID changed. Verify the rendering's `Parameters Template` field still points to the correct ID."

**If not found:**
- **Cannot auto-fix** — needs recreation with the 4 base template GUIDs
- **Flag for user:** "Rendering params template for `<name>` missing. Needs recreation."

### Step 8 — Lookups refresh

After all per-component checks, update every `lookups` entry:
- If the item was validated and the ID is correct, update `lastReadAt` to now
- If the item returned a different ID, update both `itemId` and `lastReadAt`
- If the item no longer exists, remove the lookup entry

### Step 9 — Available Renderings cross-check

This is a special case because MCP cannot read the `Renderings` field value.

1. Collect all `rendering.itemId` values from validated components
2. Compare against `availableRenderings.lastKnownValue` in the manifest
3. Report any rendering GUIDs in the manifest that are NOT in `lastKnownValue`

**If discrepancy found:**
- **Cannot auto-fix** (we can't read the real value from Sitecore)
- **Flag for user:** "The following renderings may be missing from Available Renderings: `<list>`. Please verify in Content Editor at `<path>` and provide the current value so I can update the manifest."

### Step 10 — Full validation report

```
MANIFEST VALIDATION — FULL MODE
=================================
Config consistency:     PASS
React files:            18/18 PASS
Root paths:             7/7 PASS
Component map:          18/18 PASS

Per-component results (18 components):
  AnnouncementBar:      ALL PASS (template, rendering, folder, example, variants)
  NavigationHeader:     ALL PASS (rendering, variants — no datasource)
  HeroBanner:           ALL PASS
  TabNavigationSection: REPAIR (example item recreated)
  ProductPricingCards:  ALL PASS
  FeatureHighlight:     ALL PASS
  LegalComplianceBanner: ALL PASS
  ValuePropositionGrid: ALL PASS
  TrustStatsRow:        ALL PASS
  TestimonialBlock:     ALL PASS
  CTABanner:            ALL PASS
  FeatureCardsGrid:     ALL PASS
  ImageGallery:         ALL PASS
  LogoCloud:            ALL PASS
  SiteFooter:           ALL PASS (rendering, variants — no datasource)
  NewsletterSignup:     FAIL (React file missing)
  FAQAccordion:         ALL PASS
  RichTextBlock:        ALL PASS

Auto-fixed:
  - TabNavigationSection example item recreated (ID: {NEW-GUID})
  - 3 lookup entries refreshed
  - FAQAccordion variants list updated in manifest

Needs human intervention:
  - NewsletterSignup: React file missing — was it deleted intentionally?
  - Available Renderings: Cannot verify — please check in Content Editor

Manifest saved: docs/ai/manifests/sitecore-manifest.yaml
Last validated: 2026-04-08T14:30:00Z
```

---

## Auto-fix decision matrix

| Issue | Can auto-fix? | Action |
|-------|--------------|--------|
| project.yaml vs manifest mismatch | YES | Update manifest project block + site-dependent paths |
| Lookup ID changed | YES | Update lookup entry |
| Template ID changed | YES | Update manifest entry |
| Rendering ID changed | YES | Update manifest entry + flag Available Renderings |
| Datasource folder missing | YES | Recreate via MCP |
| Example item missing | YES | Recreate via MCP with defaults |
| Example child items missing | YES | Recreate via MCP |
| Variant container missing | YES | Recreate container + definitions via MCP |
| Variant definition missing | YES | Recreate via MCP |
| Manifest `react.variants` stale | YES | Update from file exports |
| Root path missing (404) | NO | STOP — ask user to check environment |
| Template deleted | NO | STOP for that component — needs full skill re-run |
| Rendering deleted | NO | STOP for that component — needs full skill re-run |
| Rendering params deleted | NO | STOP for that component — needs recreation |
| React file missing | NO | Ask user — was it intentional? |
| Component map entry missing | NO | Needs code change + dev server restart |
| Available Renderings stale | NO | Cannot read field — ask user to verify in Content Editor |

---

## Auto-fix safety rules

1. **Never delete items** — only create or update
2. **Never modify Available Renderings** during validation — only flag discrepancies
3. **Never overwrite a component's `status: "complete"`** with `"partial"` unless an item is genuinely missing — ID changes are not failures
4. **Always write the manifest after fixes** — don't lose the repair work
5. **Always present the report before proceeding** — the user must acknowledge fixes and manual items
6. **Log every auto-fix** in the component's `notes` array with a timestamp:
   ```yaml
   notes:
     - "2026-04-08T14:30:00Z — validate-manifest: example item recreated (old ID {X}, new ID {Y})"
   ```

---

## Handling environment switches

When `project.yaml` and the manifest have different `siteCollection` / `siteName`, this is the most impactful mismatch. The fix cascade is:

1. Update manifest `project` block
2. Rebuild all site-dependent paths:
   - `project.dataRoot`: `/sitecore/content/<newCollection>/<newSite>/Data`
   - `project.headlessVariantsRoot`: `/sitecore/content/<newCollection>/<newSite>/Presentation/Headless Variants`
   - Every component's `datasourceFolder.path`
   - Every component's `headlessVariants.containerPath`
3. **Clear all site-dependent item IDs** — set to empty string `""`
4. Remove site-dependent `lookups` entries (keep definition-item lookups like templates/renderings)
5. Run root path validation to re-resolve the new site's structural IDs
6. Run full per-component validation to re-resolve all IDs in the new environment
7. **Flag for user:** "Environment switch detected. All site-dependent IDs cleared and re-resolved. Definition items (templates, renderings) are shared across sites and kept unchanged. Please verify Available Renderings in the new site."

---

## Integration with build-demo pipeline

The `sitecore-build-demo` skill calls this automatically in Phase 0.5:

- **Phase 0.5 runs Quick validation** (~15 seconds)
- If Quick passes → proceed to Phase 1
- If Quick fails on root paths → STOP and present errors
- If Quick fails on config mismatch → auto-fix and re-run Quick
- The user can request Full validation at any time by saying "validate manifest full" or "full check"

---

## Verification checklist

After running validation, confirm:

- [ ] `project.yaml` and manifest `project` block are in sync
- [ ] All React files exist and export the listed variants
- [ ] All 7 root paths resolve in Sitecore
- [ ] All component map entries match the manifest
- [ ] (Full only) Every component's template, rendering, folder, example item, and variants exist
- [ ] (Full only) All lookups are refreshed with current timestamps
- [ ] Manifest is saved to disk with `lastUpdatedAt` set to now
- [ ] Report is presented to user with clear action items

---

## Do not

- Do not run Full validation automatically — only Quick unless requested or Quick fails
- Do not silently fix issues without reporting them — always present the report
- Do not delete Sitecore items during validation — only create or update
- Do not modify component code (React files, component-map.ts) — only flag for the user
- Do not proceed with a demo build if root paths fail — this indicates a fundamental environment issue
- Do not guess Available Renderings values — always flag for manual verification
