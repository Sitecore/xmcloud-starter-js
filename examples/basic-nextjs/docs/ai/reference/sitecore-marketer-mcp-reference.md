# Sitecore Marketer MCP Reference

MCP tool-specific behaviors, field names, and known issues.
For Sitecore rules (base templates, Standard Values, Available Renderings, etc.), see `docs/ai/reference/sitecore-rules.md`.

---

## Core rule

Use the marketer MCP first for all Sitecore item operations unless:
- a specific MCP action fails
- permissions prevent the change
- the repository/process explicitly requires serialization

Do **not** claim that marketer MCP cannot create templates or renderings.

---

## Tool inventory

**Content items:**
- `create_content_item` — Create item with parent + template
- `update_fields_on_content_item` — Update fields on existing item
- `get_content_item_by_path` — Resolve item IDs by path
- `get_content_item_by_id` — Inspect item after create/update
- `delete_content` — Delete items (only if safe and explicitly requested)
- `list_components` — Inspect existing renderings/components
- `list_available_insertoptions` — Inspect insert options (content items only)

**Assets (search/verify only — upload uses Content Hub API, not MCP):**
- `search_assets` — Search for assets by name/path
- `get_asset_information` — Retrieve asset details by UUID
- `update_asset` — Update alt text and metadata on existing assets

Use the server's actual tool names if they differ.

---

## MCP Usage Patterns

### Resolve parent items first

Before creating a child item:
- resolve the parent with `get_content_item_by_path`
- use the resolved ID — do not guess IDs

### Lookup cache before resolution

Check the manifest `lookups` section before calling `get_content_item_by_path`. Structural paths that should be cached:
- `dataRoot`, `projectTemplatesRoot/Components`, `projectFoldersRoot`
- `renderingParamsRoot`, `headlessVariantsRoot`
- Available Renderings Page Content item
- Category subfolders (after first creation)

See `.agents/skills/sitecore-manifest/SKILL.md` → "Lookup cache rules".

### Upload images to Content Hub DAM

The demo builder uploads images to **Sitecore Content Hub** (not XM Cloud Media Library).
Credentials are stored in `docs/ai/config/credentials.local.yaml` (gitignored).

**Automated workflow** — use the upload script:
```bash
node .agents/skills/sitecore-build-demo/scripts/upload-to-content-hub.mjs --images-dir docs/ai/demos/<client>/images
```

The script performs 5 steps per image:
1. `POST /api/v2.0/upload` — request upload URL
2. `POST /api/v2.0/upload/process` — upload file binary (multipart/form-data)
3. `POST /api/v2.0/upload/finalize` — get `asset_id` + `asset_identifier`
4. `POST /api/entities/{id}/lifecycle/approve` — auto-approve (Created → Approved)
5. `POST /api/entities` (M.PublicLink entity) — create public link → get working public URL

**Image field format (DAM):**
```
update_fields_on_content_item(itemId, {
  "HeroImage": '<Image src="https://<CH_HOST>/api/public/content/<assetId>-<name>?v=<hash>" dam-id="<assetIdentifier>" width="<width>" height="<height>" alt="Description" dam-content-type="Image" thumbnailsrc="https://<CH_HOST>/api/gateway/<assetId>/thumbnail" />'
})
```

The script writes `imageFieldXml` to `image-manifest.json` — use it directly for field updates.

**MCP asset tools** (for searching/verifying, NOT for upload):
- `search_assets` — search for assets by name/path
- `get_asset_information` — get asset details by UUID (XM Cloud Media Library only)
- `update_asset` — update alt text and metadata

**If Content Hub credentials are not available:**
- Generate `images-to-upload.md` for manual upload
- After SE uploads, use `search_assets` to find items and wire fields

### Field update sensitivity

**Always inspect the item via MCP before updating fields.** Use `get_content_item_by_id` to read the item, then use the **exact field names** from the response. Do not guess from display names.

When an update does not stick:
1. Re-read the item via MCP
2. Inspect the actual field names returned
3. Retry using the exact returned names
4. If still unsuccessful, report as requiring follow-up verification

### Field naming — collision risk

Fields named `Title` or `Description` on custom templates may collide with inherited Standard Template fields. For safety, prefix with component context: `SectionTitle`, `CardTitle`, `ItemTitle` — especially for list component parent templates.

### Example datasource items

After creating a datasource folder, create one example content item inside it:
- parent = datasource folder item
- template = datasource template
- name = component name (e.g. `Hero`, `Article Cards`)

For list components, create one parent + one or two child items.

**Field values:**
- If screenshot/design provided: populate with matching content
- If URL provided: extract real content
- If no visual reference: use `__Standard Values` defaults or leave empty

---

## Known Tool Behavior

### Recovery, ordering, and optional blanks

The P0 execution contract and commands are in `.agents/skills/sitecore-build-demo/references/recovery.md`.

- **Timeouts are unknown outcomes.** An aborted `add_component_on_page` or item create can succeed remotely. Persist intent before the request and compare read-back with the pre-write snapshot. If the effect cannot be uniquely attributed, stop; never retry under a new name to bypass a collision.
- **Child ordering is explicit.** Set `__Sortorder` from the approved source sequence and verify the returned child ID order. Parallel creation and non-empty fields do not establish display order.
- **Item-name defaults require field intent.** `$name` defaults can materialise as internal item names. Equality alone is not proof of an error: preserve explicitly supplied values and flag unspecified ones rather than silently blanking them.
- **Empty-write behaviour is an observation, not a universal API guarantee.** A previous demo run observed an acknowledged empty update leaving `AuthorName` unchanged. Reproduce/read back the relevant field; reset-to-standard is not the same as empty. Only explicitly blank optional display text on this build's items may use the approved single-space workaround after an acknowledged ineffective clear. Record the exception and never use it for required/unspecified fields, links, images, or system fields.
- **Response shapes must be checked.** The new adapters reject missing/paginated children and unrecognised page instance identities instead of inventing empty lists. Local regression tests do not certify a particular live MCP/Content Hub version.

### `list_available_insertoptions`

Most reliable for content items in a site content tree. For template inspection under `/sitecore/templates/...`, prefer `get_content_item_by_path` or `get_content_item_by_id`.

### `create_component_ds` children reliability

**Severity:** Medium — causes empty list components

The `create_component_ds` tool accepts a `children` array, but children may not be created. The API reports success but the parent has no children.

**Workaround:** After creating any list component datasource:
1. Read the parent back with `get_content_item_by_id`
2. Check if children exist
3. If missing, create individually with `create_content_item`

**Alternative:** Skip `create_component_ds` entirely for list components. Create parent + each child individually with `create_content_item`.

### `create_content_item` returns the ID; children listings lag

**Severity:** Medium — a successful create looks missing

Observed 2026-10-19: `create_content_item` returns `{ "itemId": "<guid>" }`. Immediately afterwards, `get_content_item_by_id` on the **parent** did not always list the new child; it appeared on a later read (2 of 34 creates in one build). The item itself existed.

**Workaround:** keep the returned `itemId` and verify by reading that item by ID (name, template, path under the parent). Do not treat a child missing from the parent's listing as a failed create, and never create it again. The `sitecore-build-demo` recovery helper does this automatically.

### `delete_content` silent no-op

**Severity:** Medium — items reported deleted still exist

Observed 2026-08-05: `delete_content` returned `success: true` twice for a page item ("Example Article", Article Page Template), but the item still resolved via `get_content_item_by_id` and still appeared in the parent's children afterwards. The deletion never took effect. Re-confirmed 2026-08-17 on the same item: third `success: true`, item still resolves with all fields.

**Workaround:** Always verify with `get_content_item_by_id` after `delete_content`. If the item still resolves, mark the deletion `pendingManual` and delete in Content Editor.

### Bounded field reads (observed 2026-11-04)

Adding three fields to Landing Page Template increased its business/base field set beyond 50. `get_content_item_by_id`, `get_content_item_by_path` and `get_page_template_by_id` still returned 50 entries; the last inherited fields (`Priority`, `Page Design`, `SxaTags`) stopped appearing. The returned previous values were unchanged. A missing key in this bounded projection is **not** proof of clearing or deletion; compare key presence separately from value changes and do not repair unseen fields blindly.

The template's new custom fields and blank Standard Values were readable. Inherited metadata such as `__Short description`/`__Sortorder` on Template field/Variant Definition items is not echoed in these reads; verify that metadata through the approved serialized output or authoring UI. `validation:false` in the page-template schema response is not a read-back of the field's actual `Validation` string—read the Template field item for that.

### `create_page` fields format

`create_page` does **not** use the `{name, value}` pair format that `create_content_item` / `update_fields_on_item` use. Passing pairs fails with `Cannot find a field with the name name`.

**Correct format:** array of single-key objects keyed by field name:

```json
[{ "Title": "My Page Title" }]
```

Reliable pattern: create the page with `Title` only, then set remaining fields with `update_fields_on_item` (which uses `{name, value}` pairs).

Note: item read-backs do not echo base-template fields (e.g. `Title` on pages) — only template-own section fields. A `Title` update that returns without error has succeeded even though the echo omits it; verify visually if it matters.

---

## Output and Honesty Rules

- Distinguish between **created**, **updated**, **verified**, and **planned**
- Do not claim completion for unverified items
- Do not say MCP is unable to create templates/renderings unless you observed a specific failure
- Report silent-write fields as: *"Written via MCP; verify in Content Editor — updatedFields is empty by design."*

Good phrasing:
- "Created via marketer MCP and verified by item lookup"
- "Created via marketer MCP; field update needs follow-up verification"

---

## Verified Examples

### Promo Banner (simple component)

Derived from `siteCollection: new`, `siteName: fmc`:

- Datasource template: `/sitecore/templates/Project/new/Components/Banners/Promo Banner`
- Folder template: `/sitecore/templates/Project/new/Folders/Promo Banner Folder`
- Datasource folder: `/sitecore/content/new/fmc/Data/Promo Banners`
- Rendering Parameters: `/sitecore/templates/Project/new/Rendering Parameters/Banners/Promo Banner`
- Rendering: `/sitecore/layout/Renderings/Project/new/Banners/Promo Banner`

Known IDs:
- Template: `ce483486-28de-4d03-ab7a-0234f31b9914`
- SV: `41e0101a-...` (templateId = `ce483486-...`)
- Folder template: `34d06ac8-...`
- Datasource folder: `f684a188-...`
- Rendering: `b8a741b2-...`

### Video Testimonial

- Datasource template: `/sitecore/templates/Project/new/Components/Content/Video Testimonial`
- Folder template: `/sitecore/templates/Project/new/Folders/Video Testimonial Folder`
- Datasource folder: `/sitecore/content/new/fmc/Data/Video Testimonials`
- Rendering Parameters: `/sitecore/templates/Project/new/Rendering Parameters/Content/Video Testimonial`
- Rendering: `/sitecore/layout/Renderings/Project/new/Content/Video Testimonial`
