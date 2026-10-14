# {{CLIENT_NAME}} — Demo Build Summary

> **Client:** {{CLIENT_NAME}}
> **Source:** {{SOURCE_URL}}
> **Built:** {{DATE}}
> **Page:** {{PAGE_PATH}}

---

## Build Overview

| Metric | Count |
|--------|-------|
| Template components used | {{TEMPLATE_COUNT}} |
| Custom components built | {{CUSTOM_COUNT}} |
| Custom variants created | {{VARIANT_COUNT}} |
| Datasource items created | {{DATASOURCE_COUNT}} |
| Fields populated | {{FIELDS_COUNT}} |
| Images uploaded | {{IMAGES_UPLOADED}} / {{IMAGES_TOTAL}} |

---

## Component Inventory

| # | Component | Variant | Datasource | Status |
|---|-----------|---------|------------|--------|
| 1 | NavigationHeader | Transparent | _context-only_ | ✅ On page |
| 2 | HeroBanner | BackgroundImage | {{CLIENT}} - Hero Banner | ✅ Wired |
| 3 | ValuePropositionGrid | Default | {{CLIENT}} - Value Props | ✅ Wired |
| ... | ... | ... | ... | ... |

<!-- STATUS KEY: ✅ Wired | ✅ On page | ⚠️ Needs variant | ⚠️ Needs datasource | ❌ Failed -->

---

## Theme

| Property | Value |
|----------|-------|
| Primary color | `{{PRIMARY_COLOR}}` |
| Heading font | `{{HEADING_FONT}}` |
| Body font | `{{BODY_FONT}}` |
| Delivery method | {{THEME_DELIVERY}} |
| Google Fonts | {{GOOGLE_FONTS_STATUS}} |

> [!TIP]
> Theme takes effect on next dev server restart. All components pick up `--brand-*` variables automatically.

---

## Image Upload Summary

**Content Hub:** `{{CONTENT_HUB_HOST}}`

| Result | Count |
|--------|-------|
| Uploaded + approved | {{IMAGES_OK}} |
| Uploaded, pending approval | {{IMAGES_PENDING_APPROVAL}} |
| Failed | {{IMAGES_FAILED}} |
| Skipped (no credentials) | {{IMAGES_SKIPPED}} |
| **Total** | **{{IMAGES_TOTAL}}** |

<!-- If IMAGES_OK == IMAGES_TOTAL, show this: -->
> [!NOTE]
> All {{IMAGES_TOTAL}} images uploaded and approved successfully. Image fields are already set on datasource items.

<!-- If IMAGES_FAILED > 0, show this instead: -->
> [!WARNING]
> {{IMAGES_FAILED}} image(s) failed to upload. See the table below for details and manual upload instructions.

<!-- Only include this table if there are failed or skipped images -->
### Failed / Skipped Images

| # | File | Section | Target Component | Target Field | Error | Source URL |
|---|------|---------|-----------------|--------------|-------|------------|
| 1 | `hero-bg.jpg` | Hero Banner | HeroBanner | HeroImage | Step 2: HTTP 413 — file too large | {{SRC_URL}} |
| 2 | `card-1.png` | Product Cards | ProductPricingCards | CardImage | Step 1: HTTP 403 — permission denied | {{SRC_URL}} |
| ... | ... | ... | ... | ... | ... | ... |

**To fix manually:**
1. Open Content Hub at `{{CONTENT_HUB_HOST}}`
2. Upload the file from `docs/ai/demos/{{CLIENT_KEBAB}}/images/<filename>`
3. Approve the asset (Created -> Approved)
4. Create a public link on the asset
5. In Sitecore Content Editor, find the datasource item and set the Image field

<!-- If IMAGES_SKIPPED > 0 (no credentials), show: -->
> [!NOTE]
> Content Hub credentials were not provided. All {{IMAGES_SKIPPED}} images were downloaded locally but not uploaded.
> Run the upload script when ready:
> ```bash
> node docs/ai/scripts/upload-to-content-hub.mjs --images-dir docs/ai/demos/{{CLIENT_KEBAB}}/images
> ```

### Successful Uploads

<!-- Only include if IMAGES_OK > 0 — helps the SE verify images are correct -->

| # | File | Section | Asset ID | Public URL | Dimensions |
|---|------|---------|----------|------------|------------|
| 1 | `hero-bg.jpg` | Hero Banner | `{{ASSET_ID}}` | [link]({{PUBLIC_URL}}) | 1200 x 600 |
| 2 | `logo.png` | Navigation | `{{ASSET_ID}}` | [link]({{PUBLIC_URL}}) | 200 x 60 |
| ... | ... | ... | ... | ... | ... |

---

## Videos

<!-- Only include this section if manualVideoTasks has entries. Otherwise omit entirely. -->

> [!NOTE]
> {{VIDEOS_COUNT}} section(s) on the live site use video. Videos are not uploaded automatically — poster images are used as static fallbacks. Upload videos to Content Hub manually if needed.

| # | Section | Component | Poster | Video Source | What to do |
|---|---------|-----------|--------|-------------|------------|
| 1 | Hero | HeroBanner (VideoBackground) | `hero-poster.jpg` | `https://client.com/hero.mp4` | Upload to Content Hub, set URL on component |
| ... | ... | ... | ... | ... | ... |

<!-- If no videos found, omit this entire section. -->

---

## Manual Tasks

These items require action in the **Pages editor** or **Content Editor**. Work through them in order.

### 1. Variant Selection (~2 min)

Open the page in Pages editor and set these variants:

| # | Component | Current | Set to |
|---|-----------|---------|--------|
| 1 | NavigationHeader | Default | Transparent |
| 2 | ProductPricingCards | Default | Horizontal |
| ... | ... | ... | ... |

**Steps per component:**
1. Click the component on the canvas
2. In the right-hand pane, click **Design** tab
3. Select the variant from the dropdown

### 2. Context-Only Components

These components read from page context, not datasources. Verify they appear correctly:

- [ ] **NavigationHeader** — lives in Header partial design. Assign "{{CLIENT}} - Main Navigation" datasource in Content Editor if using list datasource mode.
- [ ] **SiteFooter** — lives in Footer partial design. Assign "{{CLIENT}} - Site Footer" datasource in Content Editor.

### 3. Link Verification

Demo links point to the client's live site. Update any that should point to internal demo pages:

- [ ] Hero CTA — currently `{{HERO_CTA_URL}}`
- [ ] Product cards — currently linking to `{{CLIENT_DOMAIN}}/...`

### 4. Cleanup (if reusing Home page)

Remove these OOB starter kit components that were already on the page:

- [ ] RichText (position 3)
- [ ] Image (position 5)
- [ ] Container (position 7)

> [!NOTE]
> These cannot be removed via API. In Pages editor: click the component → three-dot menu → **Remove**.

### 5. Personalization (Optional)

To show different content per audience segment, create additional datasource items:

| Component | Folder | Template |
|-----------|--------|----------|
| HeroBanner | /Data/HeroBanners | HeroBanner |
| ProductPricingCards | /Data/ProductPricingCards | ProductPricingCards |

**Naming:** `{{CLIENT}} - <ComponentName> - <Segment>` (e.g., "{{CLIENT}} - Hero Banner - Families")

Then in Pages: select component → **Personalize** → add condition → assign segment datasource.

---

## Output Files

All files are saved under `docs/ai/demos/{{CLIENT_KEBAB}}/`.

### Build Pipeline Files
_Used by the automation to track progress and enable resume. You don't need to edit these._

| File | What it contains |
|------|-----------------|
| `demo-progress.yaml` | Tracks which phases and sections are done — lets you resume an interrupted build |
| `build-plan.yaml` | Maps each page section to a template component and variant |
| `content-map.yaml` | Client content (text, links, images) mapped to Sitecore field names |

### Reference Files for the SE
_Use these while finishing the demo in Pages editor._

| File | When to use it |
|------|---------------|
| `build-plan-summary.md` | Review before approving — shows what each page section maps to |
| `demo-summary.md` | Start here after build — full overview of what was built and what needs manual work |
| `manual-tasks.md` | Step-by-step checklist for remaining manual tasks (variants, context components, links, cleanup) |
| `variant-checklist.md` | Quick-reference table for setting component variants in Pages editor |

### Assets

| File | What it contains |
|------|-----------------|
| `images/` | Source images downloaded from the client site, used for Content Hub uploads |
| `images/image-manifest.json` | Maps each image to its source URL, Content Hub asset ID, and upload status |

---

> [!TIP]
> **Quick test:** Open `{{PAGE_URL}}` in a browser. You should see the client's colors, fonts, and content on all components. Then walk through `manual-tasks.md` to finish the last mile.
