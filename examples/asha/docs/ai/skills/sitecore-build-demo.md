# Sitecore build demo from URL

Use this skill when a Solution Engineer wants to create a Sitecore demo that replicates a client's homepage.

## Trigger hints
Use this skill when:
- the user provides a URL and says "build a demo", "replicate this site", "create a demo for [client]"
- the user provides a screenshot of a homepage and asks to build components for it
- the user says "analyze this homepage and build the components"

## Prerequisites
- Template component library must be built (check manifest for 17+ components with status "complete")
- Playwright scraper must be installed (`node docs/ai/scripts/site-scraper.mjs --help` should work)

## Load first
- `docs/ai/catalog/component-registry.yaml`
- `docs/ai/catalog/theme-component-mapping.md`
- `docs/ai/manifests/sitecore-manifest.yaml`

## Resume a demo build

If the user says "resume demo", "continue demo", "pick up where we left off", or a previous session was interrupted:

1. Read `docs/ai/demos/<client-kebab>/demo-progress.yaml`
2. Find the last phase with `status: "complete"` — that's where we finished
3. Find the first phase with `status: "partial"` or `"pending"` — that's where to resume
4. For Phase 3 (content) or Phase 6 (assembly), check per-section status:
   - Skip sections with `status: "populated"` or `"wired"`
   - Resume from the first section with `status: "pending"` or `"created"` (created but not populated)
   - Retry sections with `status: "failed"` (read the `error` field for context)
5. Show the user a summary of what's done and what remains before continuing

**Do NOT re-run completed phases.** The progress file is the source of truth for demo state.

---

## Full workflow

### Phase 0 — Gather inputs (screenshot required)

A screenshot is the **primary input** for demo creation. Without a visual reference, the build plan will be wrong.

**Collect from the user:**
1. **Client name** (required) — for file naming and content
2. **Screenshot** (required) — full-page desktop screenshot of the homepage to replicate
3. **Client URL** (optional) — used for content extraction in Phase 2.5 and theme scraping
4. **Content Hub credentials** (if not already saved) — for image uploads in Phase 3

**How to obtain the screenshot:**

| User provides | Action |
|---|---|
| URL only | Run Playwright scraper to capture screenshot. If scraper fails (403, auth, CAPTCHA), ask user to provide a screenshot manually. Do NOT proceed without one. |
| Screenshot only | Use it directly. URL-based content extraction (Phase 2.5) will be skipped — content comes from screenshot analysis. |
| URL + screenshot | Use the screenshot for visual analysis (Phases 1-2). Use the URL for content extraction (Phase 2.5). |
| Neither | Ask for at least a screenshot. Do not proceed without visual reference. |

**HARD RULE: Never proceed to Phase 1 without a screenshot.** Web fetch and web search are insufficient — they miss layout, spacing, card styles, section backgrounds, and visual hierarchy that drive variant selection.

**Content Hub credentials (always validate):**

Read `docs/ai/config/credentials.local.yaml`.

**If credentials exist** (`contentHub.host` is populated):
1. Show the user: *"Found stored Content Hub credentials for `<host>`. Validating..."*
2. Validate by calling `POST <host>/api/authenticate` with stored user/password
3. If **200 OK** → credentials are valid, show: *"Content Hub credentials verified for `<host>`."*
4. If **401 / failed** → credentials are expired or wrong:
   - Show: *"Stored credentials for `<host>` are invalid (password expired or changed)."*
   - Ask the user for updated credentials (same flow as "no credentials" below)
   - Update `credentials.local.yaml` with new values

**If no credentials** (file doesn't exist or `contentHub.host` is empty):
1. Show the user: *"I need Content Hub credentials to upload images automatically. See `docs/ai/config/credentials.example.yaml` for the expected format."*
2. Ask the user:
   - **Content Hub hostname** — e.g., `https://your-instance.sitecorecontenthub.cloud`
   - **Username and password**
   - **Client ID and secret** (only if they want OAuth instead of simple auth)
3. Validate immediately by calling `POST <host>/api/authenticate`
4. If **200 OK** → copy from `credentials.example.yaml` to `credentials.local.yaml` and fill in values (gitignored)
5. Tell the user: *"Credentials saved and verified. They'll be reused for future demo builds. Delete `credentials.local.yaml` to reset."*
6. If **401 / failed** → ask the user to check and retry

**If the user declines to provide credentials**, that's fine — set `contentHub.host: ""` and images will fall back to the manual `images-to-upload.md` checklist in Phase 3 Step 5.

**Validation script shortcut** (agent can run this instead of manual HTTP call):
```bash
node docs/ai/scripts/upload-to-content-hub.mjs --images-dir docs/ai/demos/test --dry-run
```
If it prints `[auth] OK`, credentials are valid. If it prints `ERROR`, they need updating.

**Create the progress file** at `docs/ai/demos/<client-kebab>/demo-progress.yaml` using the template at `docs/ai/templates/demo-progress.template.yaml`. Set `client.name`, `client.sourceUrl`, `client.startedAt`, and `phases.phase0_inputs.status: "complete"`.

### Phase 0.5 — Manifest health check

Before any demo work, validate that the manifest is usable and pointing at the right environment.

**Run the `sitecore-validate-manifest` skill in Quick mode.**

This performs:
1. Config consistency check (`project.yaml` vs manifest `project` block)
2. Root path validation (7 parallel MCP calls to verify structural folders exist)
3. React file existence check (all component files present)
4. Component map cross-check

**Decision tree:**

| Quick result | Action |
|---|---|
| All PASS | Proceed to Phase 1 |
| Config mismatch only | Auto-fix applied, re-run Quick, then proceed |
| Root paths fail | STOP — ask user to verify environment. Do not proceed. |
| React files missing | WARN user, but can proceed (missing components won't be used in this demo) |
| Component map mismatch | WARN user — dev server restart may be needed after demo build |

**If Quick validation finds stale IDs** (items exist but with different GUIDs), the skill auto-repairs the manifest. The user is shown what changed before proceeding.

**If the user requests Full validation** (or Quick fails on multiple checks), run Full mode. This adds per-component deep checks (~3-5 minutes) but guarantees every template, rendering, datasource folder, example item, and variant container exists.

**Do not skip this phase.** A stale manifest causes silent failures in Phase 3 (content population) that are hard to diagnose.

### Phase 1 — Extract the brand theme

Use the `sitecore-extract-theme` skill:

1. Run the Playwright scraper:
   ```
   node docs/ai/scripts/site-scraper.mjs --url <URL> --output docs/ai/themes/<client-kebab>
   ```
2. Read the scraper output (`extracted-styles.json`, `meta.json`)
3. Inspect the screenshots
4. Produce `docs/ai/themes/<client-kebab>.theme.yaml`
5. Present the theme to the user for review

**Do not proceed past Phase 1 until the user confirms the theme.**

### Phase 2 — Analyze the homepage

Use the `site-analyzer` agent (`docs/ai/agents/site-analyzer.md`):

1. Read the component registry and theme mapping
2. Inspect the desktop screenshot top-to-bottom
3. Identify every section on the page
4. Match each section to a template component + best-fit variant
5. **Variant gap analysis** — for each matched section:
   - Check if the selected variant already exists (named export in TSX + Variant Definition in Sitecore)
   - If variant exists → mark as `variantMatch: "exact"`
   - If no existing variant matches the visual → mark as `variantMatch: "none"` and describe the custom variant needed:
     ```yaml
     customVariantNeeded:
       name: "EurobankCards"     # PascalCase, will become React export name
       description: "2x3 card grid with top images, red accent links, hover scale effect"
       parentComponent: "FeatureCardsGrid"  # existing component to add variant to
     ```
   - If a variant partially matches → mark as `variantMatch: "partial"` and note what differs
6. Extract visible content from the screenshot (in English)
7. **API-addable classification** — classify each component:
   - `apiAddable: true` — has a datasource template, can be added via `add_component_on_page`
   - `apiAddable: false` — context-only component (no datasource template), must be added manually in Pages editor

   Context-only components (NavigationHeader, SiteFooter) will fail with "No datasource template found" when using `add_component_on_page`. Flag these in the build plan so the assembly phase skips them and includes them in the manual tasks checklist.
8. Output two files:
   - `docs/ai/demos/<client-kebab>/build-plan.yaml` — machine-readable plan for subsequent phases
   - `docs/ai/demos/<client-kebab>/build-plan-summary.md` — human-readable summary using the template at `docs/ai/templates/build-plan-summary.template.md`
9. **Present the summary (not the YAML) to the user in chat.** The summary includes:
   - Section-by-section table with plain-language descriptions, matched components, variants, and confidence
   - Sections needing attention (low confidence or custom)
   - Variant decisions with reasoning
   - Components grouped by type (API-addable vs manual vs custom)
   - Build order in plain language

**⛔ MANDATORY CHECKPOINT — Do not proceed past Phase 2.**

Present the **build plan summary** to the user and STOP. The SE reads the summary to validate the plan — not the raw YAML. Wait for explicit approval before creating any Sitecore items, datasource content, or React code.

**Ask TWO questions — do not continue without answers to both:**
1. "Does the build plan look correct? Approved to proceed?"
2. "Do you want pixel-perfect custom variants for each component (Phase 5.5), or are the generic template variants sufficient?"

Record the Phase 5.5 decision in `demo-progress.yaml` (`phases.phase5_5_variants.skippedReason` if declined).

The user must say "approved", "go ahead", "looks good", or equivalent before Phase 2.5 begins. If the user requests changes, update the plan and re-present.

**Why this gate exists:** In the Eurobank demo build, skipping approval led to creating wrong variants, wrong content language, and wrong page structure — all of which had to be redone. This checkpoint prevents ~15 minutes of wasted MCP calls.

### Phase 2.5 — Extract and map content

After the build plan is approved, extract precise content from the client site and map it to component fields.

**Step 1 — Run the content extractor script:**
```bash
node docs/ai/scripts/content-extractor.mjs --url <CLIENT_URL> --output docs/ai/demos/<client-kebab> --download-images
```

This produces:
- `docs/ai/demos/<client-kebab>/extracted-content.json` — structured content per section
- `docs/ai/demos/<client-kebab>/images/` — all section images downloaded locally
- `docs/ai/demos/<client-kebab>/images/image-manifest.json` — maps each image to its source URL, local file, and section

The `extracted-content.json` contains:
- DOM-extracted text per section (headings, paragraphs, links, images)
- Repeated item detection (cards, list items)
- Source language detection
- Background color hints per section

**Step 2 — Run the content-scraper agent** (`docs/ai/agents/content-scraper.md`):

The agent reads the build plan + extracted content and:
1. Matches extracted DOM sections to build plan sections (using headings as anchors)
2. **Translates all content to English** (if source language is not English)

> **HARD RULE: All demo content must be created in English (en), regardless of source page language.**
> Never create datasource items in the source language (Greek, Spanish, French, etc.) even if the screenshot shows non-English text. Always translate to natural English.
> This rule exists because demos are shown to English-speaking stakeholders. Creating in the source language then translating back wastes two round-trips of MCP calls.
3. Maps content to specific Sitecore component fields
4. Handles field types (plain text vs Rich Text vs General Link vs Image)
5. Outputs `docs/ai/demos/<client-kebab>/content-map.yaml`

The content map is the input for Phase 3 — it contains exact field values ready to write to Sitecore.

**Why this phase exists:** Phase 2 extracts approximate content from screenshots (good enough for the build plan). Phase 2.5 extracts precise content from the DOM (needed for accurate datasource population). The extractor also captures links, image URLs, and content that isn't visible in screenshots (below the fold, inside accordions, etc.).

**If the extractor fails** (site blocks headless browsers, requires auth):
- Fall back to the build plan's screenshot-extracted content
- Set `contentSource: "screenshot"` in the content map
- Note reduced accuracy in the summary

### Phase 3 — Populate content for template components

Create **new datasource items** with the client's content. Never modify the example items from serialization — they serve as clean defaults for every demo.

**Input:** Read `docs/ai/demos/<client>/content-map.yaml` (produced by Phase 2.5). This contains exact, English-translated field values for every section, with content already mapped to Sitecore field names.

**Validate the content map before proceeding.** Check these required keys:
- Top-level `client` key exists (NOT `meta`) with `client.name`
- Every section has: `componentName`, `manifestName`, `kind`, `datasourceItemName`, `fields`, `children`, `imageFields`
- `children` is always the key name (not `slideChildren`, `cardChildren`, `tabChildren`, etc.)
- `kind` is one of: `"simple"`, `"list"`, `"context-only"`
- `imageFields` is an array (may be empty `[]`)

If any key is missing or uses a non-standard name, **fix the content map first** before creating items. Do NOT silently skip sections with wrong keys.

**Context:** Each demo runs on an isolated branch + dedicated Sitecore environment deployed from serialization. All manifest IDs are valid (serialization preserves GUIDs). Example items remain untouched.

#### Naming convention

```
<ClientName> - <ComponentName>                    # default client content
<ClientName> - <ComponentName> - <Segment>        # personalization variant (SE creates later)
```

Examples:
```
Data/HeroBanners/
  ├── Hero Banner                                 # original example (untouched)
  ├── Eurobank - Hero Banner                      # default (pipeline creates)
  ├── Eurobank - Hero Banner - Families           # personalization (SE creates)
  └── Eurobank - Hero Banner - Retirees           # personalization (SE creates)
```

#### Step 1 — Upload images to Content Hub

**Run this FIRST** — before creating datasource items. The `imageFieldXml` values are needed when populating fields in Step 3.

Images were downloaded during Phase 2.5 (content extraction with `--download-images`). The local files and manifest are at `docs/ai/demos/<client>/images/`.

**If Content Hub credentials are available** (check `docs/ai/config/credentials.local.yaml`):

```bash
node docs/ai/scripts/upload-to-content-hub.mjs \
  --images-dir docs/ai/demos/<client>/images
```

The script reads credentials automatically and performs 5 steps per image:
1. `POST /api/v2.0/upload` — request upload URL
2. `POST /api/v2.0/upload/process` — upload file binary
3. `POST /api/v2.0/upload/finalize` — get `asset_id` + `asset_identifier`
4. `POST /api/entities/{id}/lifecycle/approve` — auto-approve (Created → Approved)
5. `POST /api/entities` (M.PublicLink) — create public link → get working public URL

After completion, `image-manifest.json` is updated with per-image:
- `assetId`, `assetIdentifier`, `publicUrl`, `thumbnailUrl`
- `imageFieldXml` — ready-to-use DAM Image field XML for datasource items

**If no Content Hub credentials:** Skip this step. Image fields will be left empty and added to `images-to-upload.md` for manual upload later.

#### Step 2 — Create client datasource items

For each section in `buildOrder.phase1_sitecore` with `matchType: "template"`:

**Context-only components** (NavigationHeader, SiteFooter): skip — no datasource.

**Simple components:**
```
create_content_item(
  name="<ClientName> - <ComponentName>",
  templateId=manifest.templates.datasource.itemId,
  parentId=manifest.datasourceFolder.itemId
)
```
Save the returned `itemId`.

**List components (parent + children):**
```
create_content_item(
  name="<ClientName> - <ComponentName>",
  templateId=manifest.templates.datasource.itemId,
  parentId=manifest.datasourceFolder.itemId
)
```
Then create each child item under the new parent (see Step 4).

#### Step 3 — Populate all fields (text + links + images in one call)

For each new client datasource item, build a single field update that includes **all field types**:

```
update_fields_on_content_item(newItemId, {
  // Text fields — from content-map
  "Title": contentMap.sections[N].fields.Title,
  "Description": contentMap.sections[N].fields.Description,

  // Link fields — convert { text, href, target } to Sitecore XML
  "PrimaryLink": '<link text="Learn more" anchor="" linktype="external" class="" title="" target="_blank" querystring="" url="https://client.com/page" />',

  // Image fields — from image-manifest.json imageFieldXml (uploaded in Step 1)
  "HeroImage": '<Image src="https://host/api/public/content/84088-hero?v=def" dam-id="xyz" width="1200" height="600" alt="Hero" dam-content-type="Image" thumbnailsrc="https://host/api/gateway/84088/thumbnail" />'
})
```

**Matching images to fields:** The content-map's `imageFields` array lists `{ field, src }` per section. The `image-manifest.json` maps each `src` URL to its `imageFieldXml`. To wire them:
1. For each section's `imageFields` entry, find the manifest entry with matching `src`
2. Use the manifest's `imageFieldXml` as the field value
3. Include it in the same `update_fields_on_content_item` call as text and link fields

**If images were not uploaded** (Step 1 was skipped), omit Image fields — add them to `images-to-upload.md` for manual handling.

**Link field conversion rules:**
- `href` starts with `http` → `linktype="external"`, set `url` attribute
- `href` is `#` or empty → `linktype="external"`, `url="#"`
- `href` is relative → prepend client domain, `linktype="external"`
- `target` is `_blank` or absent → set `target` accordingly
- **All attributes must be present** even if empty — `text`, `anchor`, `linktype`, `class`, `title`, `target`, `querystring`, then `id` or `url`

Run multiple simple component updates in parallel — they're independent.

#### Step 4 — Handle children (list components only)

For each list component section, create all child items under the new client parent:

```
For each child in contentMap.sections[N].children:
  create_content_item(
    name="<ClientName> - <descriptive child name>",
    templateId=manifest.templates.child.itemId,
    parentId=<new client parent itemId from Step 2>
  )
  update_fields_on_content_item(newChildId, {
    // Text + link + image fields — all in one call
    "CardTitle": child.fields.CardTitle,
    "CardDescription": child.fields.CardDescription,
    "CardLink": '<link text="..." ... />',
    "CardImage": '<Image src="..." dam-id="..." width="..." height="..." ... />'  // from image-manifest.json — width/height REQUIRED
  })
```

Include child image fields (e.g., `CardImage`) in the same update call — match `child.imageFields[].src` to `image-manifest.json` entries.

The number of children matches exactly what the content map specifies (extracted from the client site).

Children within the same parent can be created in parallel (they share a parent but are independent).

> **KNOWN ISSUE: `create_component_ds` may not reliably create children.**
>
> The `create_component_ds` tool accepts a `children` array, but children may not actually be created. After creating any list component datasource:
> 1. Read the parent item back with `get_content_item_by_id`
> 2. Check if `children.results` contains the expected number of items
> 3. If children are missing, create them individually with `create_content_item` under the parent
>
> This verification step adds ~5 seconds per list component but prevents empty card grids and stat rows.

#### Step 5 — Handle image upload failures

If any images failed to upload in Step 1, or Step 1 was skipped entirely:

1. Generate `docs/ai/demos/<client>/images-to-upload.md` with:
   - Local file path (already downloaded in Phase 2.5)
   - Content Hub host URL
   - Source URL
   - Target datasource item + field name
2. Record `imagesFailed` count in `demo-progress.yaml`
3. After the SE uploads manually and confirms, use `search_assets` to find items by name, build `imageFieldXml`, and set on datasource items

#### Step 6 — Handle videos (metadata only)

Videos are NOT downloaded or uploaded. If `content-map.yaml` has a `manualVideoTasks` section:

1. Use the video **poster image** as the component's Image field value (the poster is already in the image manifest — it was downloaded as a regular image)
2. Add each video to `manual-tasks.md` with:
   - Section position and component name
   - Video source URL(s)
   - Instructions: "Upload video to Content Hub, create public link, set URL on component"
3. If the matched component variant is `VideoBackground`, note the video URL in the datasource field as a placeholder text so the SE knows where to find it

Do NOT attempt to download `.mp4`/`.webm` files — they're 10-100MB and would slow the pipeline significantly.

#### Step 7 — Record all new items

Save all created item IDs to `docs/ai/demos/<client>/content-map.yaml`:

```yaml
client:
  name: "Eurobank"
  createdAt: "2026-04-09T..."

datasourceItems:
  - componentName: "HeroBanner"
    itemName: "Eurobank - Hero Banner"
    itemId: "{new-guid}"
    parentFolder: "{manifest datasource folder id}"
    fieldsPopulated: ["Title", "Subtitle", "PrimaryLink", "SecondaryLink"]
    imageFieldsPending: ["HeroImage"]
    children: []

  - componentName: "ProductPricingCards"
    itemName: "Eurobank - Product Pricing Cards"
    itemId: "{new-guid}"
    parentFolder: "{manifest datasource folder id}"
    fieldsPopulated: ["Title", "Description"]
    imageFieldsPending: []
    children:
      - name: "Eurobank - Personal Banking"
        itemId: "{new-guid}"
        fieldsPopulated: ["CardTitle", "CardDescription", "BadgeText", "PriceText", "CardLink"]
        imageFieldsPending: ["CardImage"]
      - name: "Eurobank - Business Banking"
        itemId: "{new-guid}"
        fieldsPopulated: [...]
```

This content map is consumed by Phase 6 (page assembly) to wire the correct datasource items.

#### Personalization readiness

The pipeline creates one default datasource per component. To add personalization:

1. **SE creates additional datasource items** in the same folder using the naming convention:
   ```
   <ClientName> - <ComponentName> - <Segment>
   ```
2. **SE sets up personalization rules** in Pages editor:
   - Select the component on the page
   - Add a personalization condition (audience segment, campaign, etc.)
   - Assign the segment-specific datasource

The pipeline provides a note in `manual-tasks.md`:
```markdown
## Personalization (Optional)

To show different content for different audience segments, create
additional datasource items in the same folder:

| Component | Folder | Template |
|-----------|--------|----------|
| Hero Banner | /Data/HeroBanners | HeroBanner template |
| Product Pricing Cards | /Data/ProductPricingCards | ProductPricingCards template |

Naming convention: "<ClientName> - <ComponentName> - <Segment>"
Example: "Eurobank - Hero Banner - Families"

Then in Pages editor: select component → Personalize → add condition → assign datasource.
```

#### Progress tracking (Phase 3) — MANDATORY

**HARD REQUIREMENT:** The `sections` array in `demo-progress.yaml` must NOT be empty. Before starting Phase 3, initialize one entry per content-map section:

```yaml
sections:
  - position: 1
    componentName: "AnnouncementBar"
    kind: "simple"
    phase3:
      status: "pending"
      itemId: ""
      fieldsPopulated: false
      childrenCreated: 0
      childrenExpected: 0
      error: ""
```

**After each MCP call**, update the section's status:

```
sections[N].phase3.status:
  "pending"   → not started
  "created"   → create_content_item succeeded, itemId recorded
  "populated" → update_fields_on_content_item succeeded
  "failed"    → MCP call returned error, error message recorded
```

For list components, also track:
- `childrenCreated` — increment after each child create_content_item
- `childrenExpected` — from content-map.yaml `children` count

**Write the progress file to disk after every 2-3 sections** (not after every MCP call — that would be too slow). Always write after the last section.

**If `sections` is empty at the end of Phase 3, the phase FAILED** — even if `phase3_content.status` says "complete". An empty sections array means no per-section tracking was done and resume is impossible.

**On resume:** Skip sections where `status: "populated"`. For `status: "created"`, retry the field update. For `status: "failed"`, retry the full section.

#### Content population order

- Work through sections top-to-bottom following `buildOrder.phase1_sitecore`
- Simple components can run in **parallel** (independent datasource folders)
- List component parent must be created **before** children (sequential)
- Children within the same parent can run in **parallel**
- Use manifest IDs for template and folder lookups — don't re-resolve paths

### Phase 4 — Apply the theme

The theme was extracted in Phase 1. All 18 template components consume `--brand-*` CSS variables (see `docs/ai/reference/brand-variables.md` for the full contract).

**Two delivery methods** — prefer inlined, fall back to import:

#### Method 1: Inlined in globals.css (PREFERRED)

Paste the client `:root` block **above** `@layer base` in `src/app/globals.css`. An unlayered `:root` always beats `@layer base` in the CSS cascade, regardless of how Next.js processes the CSS.

1. Read the theme YAML's `cssVariables` block (produced in Phase 1)
2. In `src/app/globals.css`, find the commented `/* CLIENT THEME */` placeholder above `@layer base`
3. Replace it with the client's `:root` block:
   ```css
   :root {
     --brand-primary: #00827f;
     --brand-primary-foreground: #ffffff;
     --brand-heading-font: 'Poppins', sans-serif;
     /* ... all 19 variables from the theme */
   }
   ```
4. Record `themeDelivery: "globals-inlined"` in `demo-progress.yaml`

#### Method 2: Separate globals-brand.css (FALLBACK)

Only use this if you have verified the `@import` works in DevTools after build.

1. Write the `:root` block to `src/app/globals-brand.css`
2. Uncomment the `@import './globals-brand.css'` line at the bottom of `globals.css`
3. Build and verify in DevTools that `--brand-primary` etc. resolve to client values, not defaults
4. Record `themeDelivery: "globals-brand-import"` in `demo-progress.yaml`

**Why Method 1 is preferred:** Next.js App Router CSS processing can strip or reorder `@import` statements. When this happens, the `@layer base` defaults win and the client theme doesn't apply. An unlayered `:root` block above `@layer base` is immune to this — it always wins the cascade.

**Google Fonts (if applicable):**

If the theme specifies `typography.googleFontsUrl`, add a `<link>` tag to `src/app/layout.tsx`:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" />
```

**Present the theme diff to the user before proceeding:**
- Show the `:root` block content and where it was placed
- Show the Google Fonts link (if any)
- Note any font substitutions (proprietary -> Google Fonts alternative)
- Note which delivery method was used (inlined / import)
- Ask: "Does this look correct? Ready to apply?"

The theme takes effect on next dev server restart. All 18 components pick up the new values automatically via `var(--brand-*)` references.

### Phase 5 — Build custom components (if any)

For each section in the build plan with `matchType: "custom"`:

1. Use the appropriate Sitecore creation skill (simple/list/context-only)
2. Follow the `customComponents` section of the build plan for field specs
3. Build the component from scratch with the client theme applied
4. Populate the datasource with client content
5. Update the manifest (template, rendering, datasource folder, example item, variants)
6. Register in Available Renderings
7. Register in component-map.ts

Custom components must be fully built before page assembly so they can be placed alongside template components in a single pass.

If there are no custom components (`customComponents: []` in build plan), skip to Phase 5.5.

### Phase 5.5 — Create demo variants (pixel-perfect matching)

For each component on the page, create a custom named export that replicates the exact layout, spacing, and visual style from the client's screenshot.

**Use the `sitecore-create-demo-variants` skill** (`docs/ai/skills/sitecore-create-demo-variants.md`).

This phase bridges the gap between "same colors" (Phase 4 CSS variables) and "looks like their actual site" (custom layout per section).

**What it produces:**
1. A `variant-specs.yaml` file with per-section visual analysis
2. A new named export in each component's TSX file (named after the client, e.g., `PeopleCert`)
3. Variant Definition items in Sitecore (one per component)
4. Updated variant checklist referencing the custom variant names

**Decision:** If the user explicitly says generic variants are fine, skip this phase. Otherwise, create custom variants for all sections where `variantMatch` is `"none"` or `"partial"`. If the user wants pixel-perfect, create for ALL sections.

**Update `demo-progress.yaml`** after completion:
- `phases.phase5_5_variants.status: "complete"`
- `phases.phase5_5_variants.variantsCreated: N`

### Phase 6 — Assemble the page

Add components to the page in build-plan order and wire each to its datasource item.

**Known limitation:** The Agent API cannot set rendering parameters (including variant selection) when adding components. Variants must be set manually in Pages editor after assembly. See `docs/ai/reference/agent-api-limitations.md`.

#### Step 1 — Use the existing Home page (default)

**Always use the existing Home page** unless the user explicitly asks for a new subpage. Do not create a new page by default — the Home page is the primary demo surface and already has the correct Page Design, partial designs (header/footer), and URL routing.

**Steps:**
1. Resolve the Home page: `get_content_item_by_path("/sitecore/content/<siteCollection>/<siteName>/Home")`
2. Read current components: `get_components_on_page(homePageId)`
3. Inventory what's already on the page:
   - **Custom uiim components** already placed (match by `componentName`) — these will be re-wired to new client datasources, not re-added
   - **OOB starter kit components** (RichText, Image, Container, Promo — identified by paths under `/sitecore/layout/Renderings/Feature/`) — these cannot be removed via MCP, note them for manual cleanup
4. Use the Home page ID for all subsequent `add_component_on_page` and `set_component_datasource` calls

**Only create a new subpage if the user explicitly requests it:**
```
create_page(name="<client-name> Demo", parentId=<home-page-id>, templateId=<page-template-id>)
```

Do NOT ask the user "should I use the Home page or create a new page?" — just use the Home page.

#### Step 2 — Add components to the page

For each section in the build plan, top to bottom (following `buildOrder.phase1_sitecore`):

**If component already exists on page** (Option A, matched by `componentName`):
- Skip adding — it's already placed
- Proceed to Step 3 to update its datasource

**If component is NOT on the page:**
```
add_component_on_page(
  pageId=<target-page-id>,
  componentRenderingId=<rendering itemId from manifest>,
  placeholderPath="headless-main",
  componentItemName=<componentName>
)
```

**Ordering:** Use `insertAfterComponentId` to place each component after the previous one. For the first component, omit this parameter (appends to end). Track the returned component instance for the next insertion.

**Context-only components** (NavigationHeader, SiteFooter):
- These components have no datasource template and **cannot be added via `add_component_on_page`** — the API returns "No datasource template found"
- If they live in partial designs, they're already on the page via the Page Design — skip
- If they need to be in `headless-main`, add them to the manual tasks checklist with clear positioning instructions (e.g., "Add NavigationHeader between AnnouncementBar and HeroBanner")
- Do NOT attempt to add them via API — it will fail and waste time

**Skip adding OOB components** that aren't in the build plan (RichText, Image, Container, Promo from starter kit). These cannot be removed via MCP — note them for manual cleanup.

#### Step 3 — Wire datasources

For each component that was added or already existed:

Read the **client datasource item IDs** from `docs/ai/demos/<client>/content-map.yaml` (created in Phase 3). Do NOT use the manifest's `exampleItem` IDs — those are the clean defaults.

**Simple components (own datasource):**
```
set_component_datasource(
  pageId=<target-page-id>,
  componentId=<component instance id from add response or get_components_on_page>,
  datasourceId=<client item ID from content-map.yaml>
)
```

**List components (parent datasource with children):**
Same as simple — wire the client parent item ID. The children live under it and ComponentQuery resolves them automatically.

**Context-only components (NavigationHeader, SiteFooter):**
No datasource to set — skip this step.

#### Step 4 — Generate the variant checklist

Since variants cannot be set via MCP, generate a clear checklist for the SE.

For each component in the build plan that uses a **non-Default** variant:

```markdown
## Variant Selection Checklist

Open the page in Pages editor and set these variants:

| # | Component | Current | Needed | Variant ID |
|---|-----------|---------|--------|-----------|
| 1 | NavigationHeader | Default | Transparent | {A46EFC9D-...} |
| 2 | ProductPricingCards | Default | Horizontal | {C9B441F5-...} |
| 3 | LegalComplianceBanner | Default | WithImage | {21600F34-...} |
| 4 | CTABanner | Default | WithImage | {2DC4E1E9-...} |
| 5 | TrustStatsRow | Default | WithIcons | {A31EA0E4-...} |
| 6 | ImageGallery | Default | Gallery | {CF1F5876-...} |

Steps per component:
1. Click the component on the canvas
2. In the right-hand pane, click Design tab
3. Select the variant from the dropdown
4. Repeat for next component

Estimated time: ~2 minutes
```

Components that use the **Default** variant don't need action — Default is applied automatically when the component is added.

Save this checklist to `docs/ai/demos/<client-kebab>/variant-checklist.md`.

#### Progress tracking (Phase 6)

**After each component add/wire**, update the section's status in `demo-progress.yaml`:

```
sections[N].phase6.status:
  "pending"  → not started
  "added"    → add_component_on_page succeeded, componentInstanceId recorded
  "wired"    → set_component_datasource succeeded
  "skipped"  → context-only component or already on page
  "failed"   → MCP call returned error
```

Write progress to disk after every 3-4 components.

**On resume:** Skip sections where `status: "wired"` or `"skipped"`. For `status: "added"`, retry datasource wiring. For `status: "failed"`, retry the full add+wire.

#### Step 5 — Verify assembly

After all components are added and datasources wired:

1. `get_components_on_page(targetPageId)` — read final state
2. Verify each build plan section has a matching component on the page
3. Verify each component has a non-empty `dataSource` (except context-only)
4. Report any gaps

Present the assembly result:
```
Page assembly complete:
- Components added: 12 (of 14 in build plan)
- Datasources wired: 10 (2 context-only, no datasource)
- Already on page: 3 (reused existing)
- Variants needing manual selection: 6 (see variant-checklist.md)
- OOB components to clean up manually: 4 (RichText x2, Image, Container)
```

### Phase 7 — Summary

**GATE: Do not proceed to Phase 7 if Phase 6 is incomplete.**

Check `demo-progress.yaml`:
- `phase6_assembly.datasourcesWired` must be >= `phase6_assembly.totalComponents` minus context-only components
- If `datasourcesWired` is significantly less than expected, Phase 6 failed silently — go back and retry failed sections before generating the summary
- Mark Phase 6 as `"complete"` only when all wirable components have datasources

Generate `docs/ai/demos/<client-kebab>/demo-summary.md` using the template at `docs/ai/templates/demo-summary.template.md`.

**How to populate the template:**

1. **Build Overview table** — pull counts from `demo-progress.yaml`:
   - `TEMPLATE_COUNT` = sections with `matchType: "template"`
   - `CUSTOM_COUNT` = `phases.phase5_custom.customComponentsBuilt`
   - `VARIANT_COUNT` = `phases.phase5_5_variants.variantsCreated`
   - `DATASOURCE_COUNT` = count of `sections[*].phase3.itemId` that are non-empty
   - `FIELDS_COUNT` = sum of populated fields across all sections (from `content-map.yaml`)
   - `IMAGES_UPLOADED` / `IMAGES_TOTAL` = sum of `imagesUploaded` / `imagesExpected` across sections

2. **Component Inventory table** — one row per section from `build-plan.yaml`:
   - Status from `sections[N].phase6.status`: `wired` = "✅ Wired", `skipped` = "✅ On page", `added` (but not wired) = "⚠️ Needs datasource", `failed` = "❌ Failed"
   - If variant is non-Default and Phase 5.5 was skipped, append "⚠️ Needs variant" to status

3. **Theme section** — from the theme YAML produced in Phase 1

4. **Image Upload Summary** — read `docs/ai/demos/<client>/images/image-manifest.json`:
   - Count entries by `uploadStatus`: `"uploaded"` with `approved: true` = OK, `"uploaded"` with `approved: false` = pending approval, `"failed"` = failed, `"downloaded"` (not attempted) = skipped
   - **Summary table**: show totals per result category
   - **If all OK**: show the NOTE callout, include the Successful Uploads table for reference
   - **If any failed**: show the WARNING callout + Failed/Skipped Images table. For each failed image, pull `uploadError` from the manifest entry to populate the Error column
   - **If skipped** (no credentials): show the NOTE with the upload script command
   - **Successful Uploads table**: one row per `uploadStatus: "uploaded"` entry — show file, section (from `sectionPosition`), `assetId`, clickable `publicUrl`, and `width x height`
   - **Remove empty sub-tables** — if no failures, omit the Failed table. If no successes, omit the Successful table.

5. **Videos** — read `content-map.yaml` `manualVideoTasks`:
   - Only include this section if there are video entries
   - One row per video with section, component, poster image file, source URL, and action
   - If no videos found, omit the entire Videos section

6. **Manual Tasks** — populate each subsection:
   - **Variant Selection**: only include components where the build plan variant differs from Default
   - **Context-Only Components**: only include NavigationHeader/SiteFooter if they appear in the build plan
   - **Link Verification**: list links from content-map that point to the client's domain
   - **Cleanup**: only include if reusing an existing page that had OOB components
   - **Personalization**: always include — it's optional guidance for the SE

7. **Remove unused sections** — if a manual task, image, or video subsection has zero items, remove it entirely. Don't leave empty tables.

**Present the summary to the user in the chat** (not just saved to file). Copy the populated content directly into the chat response so the SE can read it immediately.

Also save the standalone `manual-tasks.md` with just the Manual Tasks section (subsections 1-5) for quick reference in the Pages editor.

## Output files

After completion, the demo directory should contain:

```
docs/ai/demos/<client-kebab>/
│
│  BUILD PIPELINE FILES (automation internals — enable resume)
├── demo-progress.yaml         # which phases/sections are done
├── build-plan.yaml            # page sections mapped to components + variants (machine-readable)
├── content-map.yaml           # client content mapped to Sitecore field names
│
│  SE REFERENCE FILES (use while finishing the demo)
├── build-plan-summary.md      # human-readable build plan (reviewed in Phase 2)
├── demo-summary.md            # start here — full build overview + manual tasks
├── manual-tasks.md            # step-by-step checklist for remaining work
├── variant-checklist.md       # quick-ref table for setting variants in Pages
│
│  ASSETS
├── images/                    # downloaded source images from client site
└── images/image-manifest.json # maps images to Content Hub IDs + upload status
```

## Important rules

- **Never replace existing Available Renderings** — template components are already registered
- **Never recreate template components** — they already exist, just populate their datasource items with client content
- **Always use the manifest** for item IDs — don't re-resolve paths that are already cached
- **Always present the plan before executing** — the SE must approve the theme and build plan
- **Automate images via Content Hub** — download during Phase 2.5 (`--download-images`), upload + approve + create public link via `upload-to-content-hub.mjs` in Phase 3 Step 5, set Image fields using DAM format (`<Image src="..." dam-id="..." />`). Requires Content Hub credentials in `credentials.local.yaml`. Fall back to manual `images-to-upload.md` if no credentials.
- **Mark variants as manual** — generate the variant checklist, don't skip this step. See `docs/ai/reference/agent-api-limitations.md` for why.
- **Use `insertAfterComponentId` for ordering** — add components sequentially, passing the previous component's instance ID to maintain build-plan order
- **Use the existing Home page by default** — do not create a new subpage unless the user explicitly asks. The Home page already has the correct Page Design and URL routing. Note any OOB components for manual cleanup.
- **All content in English** — regardless of source page language, all datasource content must be in English (en). Translate from the source language during content extraction, never after content creation.
