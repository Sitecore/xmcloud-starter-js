# Sitecore create information architecture

Create a Sitecore content tree (information architecture) from a user-supplied hierarchy using the **Sitecore Marketer MCP** server.

Docs: [Sitecore Marketer MCP server](https://doc.sitecore.com/sai/en/users/sitecoreai/sitecore-marketer-mcp-server.html)

## Trigger hints
Use this skill when the user asks to:
- "create IA", "create information architecture", "build the site tree", "create pages from IA"
- create a hierarchy of page/content items under a Sitecore site
- populate a content tree from a markdown tree spec (e.g. `docs/ai/ia/rockland-ia.md`)
- fill each new page's rich text **`Content`** field from a supplied live site URL

To **extract** IA from a live website into that markdown file first, use **`get-site-ia`**.

## Do not use this skill when
- the user wants to create page **templates** or **components** (use `sitecore-create-page-template`, `sitecore-create-simple-component`, etc.)
- the user wants to add components to an existing page (use page/component skills)
- the user only wants to **analyze** a website's nav without creating items → use **`get-site-ia`** (writes `docs/ai/ia/<client>-ia.md`)

---

## Load first
- `docs/ai/config/project.yaml`
- `docs/ai/manifests/sitecore-manifest.yaml`
- `docs/ai/skills/sitecore-maintain-manifest.md`
- `docs/ai/reference/sitecore-marketer-mcp-reference.md`

---

## Required user inputs

Do **not** start creating items until all required inputs are confirmed. Ask for anything missing.

| Input | Required | Description |
|-------|----------|-------------|
| **Site name** | Yes | Sitecore site name (e.g. `main-website`). Used with `list_sites` to verify the target site exists. |
| **Content root path** | Yes | Full Sitecore item path where the IA tree is rooted (e.g. `/sitecore/content/main/main-website/Home`). All created items are descendants of this path. |
| **IA tree** | Yes | Indented markdown tree **or** path to an IA spec file. Lists only items that will be **created** — no navigation-reference placeholders. |
| **Page template ID** | Yes | Template ID (GUID) for page items. Resolve with `get_page_template_by_id` if the user gives a template name/path instead. |
| **Folder template ID** | If folders exist | Template ID for folder nodes (e.g. `shared`). Required when the tree includes non-page containers. |
| **Default item fields** | Optional | Array of `{ name, value }` applied to every **page** on create. User provides field names and values; validate against template via `get_page_template_by_id`. |
| **Language** | Optional | Language code for create/read operations. Default: `en`. |
| **Site URL** | When body copy is wanted | Public site origin, e.g. `https://www.bcaa.com`. Take it from the user or from the IA spec `Source:` line. When present, every created page's rich text **`Content`** field is filled from the matching live page. Do not create title-only pages while a URL is available. |

### Optional per-node overrides
The user may specify in the IA spec or separately:
- **folder** — node is a folder (uses folder template), not a page
- **templateId** — different page template for this node or subtree
- **fields** — field overrides for a specific node (merged on top of default fields)

If not specified, treat every node as a **page** using the page template ID.

---

## IA tree input format

The tree uses **indentation** for parent/child relationships. Each line is one creatable item.

```markdown
- Home
  - shared
    - Deposit Protection
    - Merchant Services
  - Personal
    - Banking
      - Checking Products
        - Free Checking
  - Locations
```

Rules:
- The root node in the spec (e.g. `Home`) must match the last segment of **content root path**, or be skipped if the content root path already points at that item.
- **Only list items that will exist** in Sitecore. Do not list navigation references to shared items under other sections.
- Put reusable content once under a **`shared`** folder directly under Home (or as the user specifies).
- Item **display name** = the label text. Item **name** (URL segment) = kebab-case derived from the label (e.g. `Free Checking` → `free-checking`).
- Nodes marked `[folder]` or under a `shared` parent use the **folder template** unless the user says otherwise.

Save large specs to `docs/ai/ia/<client>-ia.md` and reference the file path as input.
Produce new specs from a live site with the **`get-site-ia`** skill (same path + format).

---

## MCP server

Use the **`user-marketer`** MCP server (Sitecore Marketer MCP).

If tools fail with authentication errors, call `mcp_auth` on that server, then retry.

Primary tools for this skill:

| Tool | Purpose |
|------|---------|
| `list_sites` | Verify site name exists |
| `get_content_item_by_path` | Resolve content root and parent item IDs |
| `get_page_template_by_id` | Validate template and available fields before create |
| `list_avail_insertopts` | Confirm template is allowed under parent before create |
| `create_page` | Create a page item (`templateId`, `parentId`, `name`, `language`, `fields`) |
| `create_content_item` | Create page/folder items — **preferred for field population**; pass `fields` as `[{ name, value }]` |
| `update_fields_on_item` | Apply default or per-node fields after create if needed |
| `get_content_item_by_id` | Verify item after create |
| `search_site` | Check whether a page title already exists (optional dedup) |

See `docs/ai/reference/sitecore-marketer-mcp-reference.md` for field value formats (HTML for rich text, XML for image/link, GUID for references).

---

## Workflow

Copy this checklist and track progress:

```
IA creation progress:
- [ ] Step 0: Confirm required inputs
- [ ] Step 1: Verify MCP + site
- [ ] Step 2: Resolve content root
- [ ] Step 3: Validate templates + default fields
- [ ] Step 4: Parse IA tree and map each node to a live URL
- [ ] Step 5: Create items (depth-first, parent before child) with Content HTML
- [ ] Step 6: Update manifest
- [ ] Step 7: Present summary
```

### Step 0 — Confirm required inputs

Collect and restate:
1. Site name
2. Content root path (full Sitecore path)
3. IA tree (inline or file path)
4. Page template ID (+ folder template ID if needed)
5. Default fields (if any)
6. Language (default `en`)
7. Site URL (user message, or the IA spec `Source:` line). If neither exists, ask before creating. Title-only creates are only for an explicit "titles only" request.

If the user provides a template **name** instead of GUID, resolve it via MCP before proceeding.

### Step 1 — Verify MCP and site

1. Call `list_sites` and confirm the **site name** matches an entry.
2. If no match, list available sites and ask the user to pick one.

### Step 2 — Resolve content root

1. Call `get_content_item_by_path` with the **content root path**.
2. Record the returned item ID — this is the parent for top-level IA children (or the starting node if creating under it).
3. If the path does not exist, stop and ask the user to create the root or correct the path.

### Step 3 — Validate templates and default fields

1. Call `get_page_template_by_id` with the page template ID. Note available field names.
2. If folder nodes exist, resolve and note the folder template ID.
3. Validate every **default field** name exists on the page template. Drop or flag unknown fields; ask the user if any required field is missing.
4. Confirm whether the template has a rich text field named **`Content`**. The Page template `{3E1A16A3-1EB9-4EB9-941C-9B0F081A5D76}` does: `Content` is rich text, and `src/components/sxa/PageContent.tsx` renders it. An empty value shows the placeholder `[Content]`.
5. Format default field values per field type (see MCP reference). Rich text values are HTML fragments, not XML and not plain text.

### Step 4 — Parse IA tree

1. Parse the indented markdown tree into an ordered list of nodes: `{ label, depth, parentLabel, itemName, isFolder }`.
2. Derive `itemName` as kebab-case from `label`.
3. Mark `isFolder: true` for:
   - nodes explicitly tagged `[folder]`
   - the `shared` folder (unless user specifies otherwise)
   - any node the user identifies as a folder-only container
4. Build the full Sitecore path for each node: `contentRootPath` + `/` + ancestor segments.
5. When a site URL is in scope, map every node to a live URL before creating anything. See [Content population from live site](#content-population-from-live-site).
6. Present a **creation plan** (count, depth, shared folder location, how many nodes have a resolved URL) and confirm with the user before creating.

### Step 5 — Create items (depth-first)

Process nodes **top to bottom, parent before child**:

For each node:

1. **Resolve parent ID**
   - Parent is the content root item ID (if depth 1) or the previously created child under that parent.
   - Cache created item IDs by full path as you go.

2. **Skip if exists**
   - Call `get_content_item_by_path` with `failOnNotFound: false`.
   - If the item exists, record its ID in the cache and skip create.

3. **Check insert options**
   - Call `list_avail_insertopts` on the parent ID.
   - Prefer templates listed in insert options.
   - **If the user explicitly supplies a page template ID that is missing from insert options:** attempt **one** `create_content_item` with that template. Quanex (2026-08-11) showed Services Page `{274FC64E-...}` was absent from Home insert options but `create_content_item` still succeeded. If create fails, stop and report — do not keep force-creating. Warn in the summary that insert options should be updated for authors.

4. **Create the item**
   - **Page (preferred):** `create_content_item({ templateId, parentId, name: itemName, language, fields })` with `fields` as `[{ name, value }]`.
   - **Page (alternate):** `create_page` — pass `fields` as a single object in the array: `[{ pageTitle: "...", pageShortTitle: "...", ... }]`. Do **not** use `{ name, value }` pairs with `create_page` (API error: "Cannot find a field with the name name").
   - **Folder:** `create_content_item({ templateId: folderTemplateId, parentId, name: itemName, language, fields })`
   - Merge **default fields** + any **per-node field overrides** into the `fields` array.
   - When a site URL is in scope and the template has **`Content`**, include `{ name: "Content", value: "<html fragment>" }` from the mapped live page. A user default that sets `Content` to empty must not wipe that HTML.
   - Services Page templates that have **`Detail`** and no `Content` still use `Detail` for the body (see field map below). If both fields exist, fill **`Content`**.

5. **Verify**
   - Call `get_content_item_by_id` on the returned ID.
   - Record: item ID, full path, template, display name.

6. **On failure**
   - Log the node, error, and parent path.
   - Continue with siblings if safe; stop if parent creation failed (children cannot be created).

**Creation order example** for:
```
Home
  shared
    Deposit Protection
  Personal
    Banking
```
Create: `shared` → `Deposit Protection` → `Personal` → `Banking` (assuming Home already exists at content root).

### Step 6 — Update manifest

Follow `sitecore-maintain-manifest.md`:
- Add an `ia` or `pages` section (or extend `components`) with created item IDs, paths, and status.
- Record content root path, site name, template IDs, and timestamp.

### Step 7 — Present summary

Show the user:
- Total items created vs skipped (already existed)
- Table of created items: display name, item name, full path, item ID
- How many pages have a non-empty `Content` value on read-back, and which nodes fell back or stayed empty
- Any failures or insert-option blocks
- Reminder: shared items live once under `/Home/shared/` (or as specified); wire navigation links separately if needed
- Next steps: publish, add components to pages, configure navigation

---

## Shared content pattern

When the IA spec uses a **`shared`** folder under Home:
- Create `shared` as a **folder** item once.
- Create each shared page **only** under `shared`.
- Do **not** duplicate shared pages under Personal, Small Business, Commercial, etc.
- Navigation in those sections should link to the canonical shared item — that is a separate navigation configuration task, not part of this content tree.

---

## Field defaults

Apply fields in this order (later overrides earlier):
1. Template standard values (implicit — no action needed)
2. User-provided **default item fields** (applied to every page)
3. Per-node **fields** overrides from the IA spec

Example default fields input from user:
```yaml
defaultFields:
  - name: Title
    value: ""          # populated from display name if empty
  - name: NavigationTitle
    value: ""          # populated from display name if empty
```

If `Title` or `NavigationTitle` is empty, set it to the node's display label after create via `update_fields_on_item`.

**Services Page / Base Page field map** (template `{274FC64E-530F-457E-BD04-8B195DF94646}` and relatives):

| User phrasing | Actual field name |
|---------------|-------------------|
| Title / page title | `pageTitle` (there is **no** `Title` field — updates with `Title` fail) |
| Header title | `pageHeaderTitle` |
| Short title | `pageShortTitle` |
| Subtitle | `pageSubtitle` |
| Summary | `pageSummary` |
| Detail / body (Services Page) | `Detail` (rich text HTML) |
| Body (Page template) | `Content` (rich text HTML) |
| Image | `image` |

Also set when populating from a live site: `metadataTitle`, `metadataDescription`, `ogTitle`, `ogDescription`.

### Silent MCP fields (important)

For Services Page items, Marketer MCP **read/update responses typically only echo `Detail` and `image`**. Inherited Page Content / Metadata / Open Graph fields (`pageTitle`, `pageHeaderTitle`, `pageShortTitle`, `pageSubtitle`, `pageSummary`, `metadata*`, `og*`) are often **silent** — they may still be written. Always:
1. Send the full field set on create/update anyway
2. Confirm `Detail` + `image` via MCP read-back
3. Mark `page*` / `metadata*` / `og*` as **pendingManual** in the manifest (verify in Content Editor)

`update_content` requires `siteName` in addition to `itemId` + `fields`. Prefer `update_fields_on_item` when site context is already implied.

### Image field without Content Hub

When DAM credentials are unavailable:
- External URL XML is accepted and returned by MCP, e.g. `<image src="https://client.example/hero.jpg" alt="Label" />`
- Prefer page `og:image` or a known brand hero from theme extraction
- Record pendingManual: replace with DAM `dam-id` XML when assets are uploaded

---

## Content population from live site

When a site URL is supplied — in the user message or as the IA spec `Source:` line — fill **`Content`** on every created page from that site. The Page Content rendering shows this field. A title with an empty `Content` value is a stub, and the component prints `[Content]`.

Skip live copy only when the user explicitly asks for titles only.

### Map each node to a real URL first

IA trees often nest items that are siblings on the live site (BCAA plan tiers live beside `/membership/plans`, not under it). Guessing `/{kebab}/` from the label produces 404s.

1. Fetch the homepage with a normal browser user agent. Some sites (BCAA) return a 500 redirect without one.
2. Collect nav `href`s and their link text. Prefer an exact label match.
3. Fetch `sitemap.xml` (follow a sitemap index). Normalize double slashes (`/products//…` → `/products/…`).
4. Match remaining nodes by slug against the sitemap. Record the URL on the node.
5. If nothing matches, leave that node's `Content` empty and list it in the summary. Do not invent a path or paste a sibling page and pretend it is this page.

### What goes in `Content`

`Content` is rich text. The value is an HTML fragment, the same shape an author would paste into the rich text editor.

Fetch the mapped URL and keep the copy a visitor reads in the main column:

- Intro and the sections under it: `h2`, `h3`, `p`, `ul` / `ol` / `li`, `a`, `strong`, `em`
- In-content links, rewritten to absolute URLs on the source site
- Enough of the page to be useful on its own — typically the intro plus the next sections — then stop

Leave out chrome that is not the page body: header, mega-menu, footer, cookie banner, scripts, styles, tracking pixels, quote widgets, and "related" carousels. Do not paste the raw document. Do not repeat the H1 when `Title` / `pageTitle` already carry it.

Cap the fragment around 8–12 blocks or roughly 6,000 characters. Close with `<p><a href="{source url}">Read more on {site name}</a></p>` when the live page continues past what you stored. That keeps the field meaningful without dumping the whole page into Sitecore.

Also set, from the same fetch:

- `pageTitle` / `pageHeaderTitle` / `Title` ← h1, or the IA label when the h1 is empty
- `pageShortTitle` / `navigationTitle` ← IA label
- `pageSubtitle` ← a short phrase from the description (≤ ~120 chars), when the template has the field
- `pageSummary` / `metadataDescription` ← the meta or og description (≤ ~400 chars), when those fields exist
- Services Page `Detail` ← the same HTML fragment, only when the template has `Detail` and no `Content`
- `image` ← og:image XML when the template has an image field and the user asked for images

### When the page is missing or thin

- HTTP 404, or a soft 200 whose h1 says the page was not found: do not store that error page. Try one alternate path from the sitemap. If that fails, leave `Content` empty and say so.
- A page that is only a form or a login wall: store the short intro above the form, plus the source link. Do not invent product claims to fill the gap.
- Parent-section copy is a last resort, and the summary must say the body came from the parent, not from this URL.

### Write and verify

Send `Content` on `create_content_item` (or `update_fields_on_item` if the item already exists and the user asked to fill it). Then `get_content_item_by_id`. The Page template echoes `Title` and the `page*` title fields. If `Content` comes back empty, the write did not stick — retry once and mark it pending if it is still empty.

Parallelize **sibling** fetches and creates after the parent ID is known (batches of ~5–6 MCP calls). Always create depth-first (parent before child).

### Item naming

- Prefer display-style names with spaces matching the IA label (e.g. `Hardware Solutions`) when the site already uses that pattern.
- Sanitize: `&` → `and`, `+` → `Plus` (or spell out), strip other illegal Sitecore name chars.
- Skip pre-existing children under Home that are not in the IA tree (e.g. starter `Speakers` / `Video` / `Data`).

---

## Learnings log (append-only)

| Date | Site | Learning |
|------|------|----------|
| 2026-08-11 | quanex | Services Page create works without insert-option listing; MCP silent for page*/metadata*/og*; Detail+image confirmed; external image XML works; content from quanex.com `/product/` URLs; 64 pages created under `/sitecore/content/quanex/quanex/Home`. |
| 2026-08-11 | era | ERA Everywhere Magento paths use `/default/{category}/...` (not bare `/{category}.html`). Fab&Fix lives at `/fabandfix/` (not `/default/fabfix/`); ERA Protect at `/era-protect/`. Always resolve site Home via `list_sites` — do not trust pasted sibling-site paths (amesburytruth vs era). 82 Services Pages under `/sitecore/content/quanex/era/Home`. |
| 2026-08-11 | amesburytruth | Same Services Page insert-option gap + silent page*/metadata*/og*; 81 pages under `/sitecore/content/quanex/amesburytruth/Home`. Live URLs: `/products/windows|doors|weatherseals|extrusions/...` (sitemap may list `/products//…` with double slash). Sanitize `/` in item names (`Casement Awning`, `Hung Sliding`). Brand og:image fallback `https://www.amesburytruth.com/img/fb-post.png`. Soft-200 404s exist (e.g. hung/keepers) — check h1 for "404 Page Not Found" and fall back to parent copy. |
| 2026-08-25 | amkor | 99 Services Pages under `/sitecore/content/amkor/amkor/Home`. Services Page `{B2B918C3-...}` absent from Home insert options (Article/Audio/Detail/Landing/Product/Page Folder) but `create_content_item` succeeded. MCP silent for page*/metadata*/og*; Detail confirmed. XM Cloud `ItemNameValidation` `^[\w\*\$][\w\s\-\$]*(\(\d{1,}\)){0,1}$` rejects `.` `+` `/` `®` `™` and non-digit parentheses — sanitize item names, keep original labels in pageTitle. Titles from IA names only (no live scrape). Starter Data/Speakers/Video left untouched. Items created in Draft workflow. |
| 2026-08-25 | lcmc | Live For Patients "Communication and Translation" maps to UMC page `/university-medical-center-new-orleans/patients-visitors/communication-translation/` (no system-level `/for-patients/...` URL). Touro sibling: `/touro/patients-visitors/translation/`. External image XML `<image src="https://www.lcmchealth.org/images/content/Female-patient.jpg" alt="..." />` accepted; no `credentials.local.yaml` so skip DAM. MCP echoes Detail+image only; send page*/metadata*/og* anyway. Test pattern approved for remaining pages only after this item is reviewed. |
| 2026-10-05 | bcaa | 104 Page items `{3E1A16A3-1EB9-4EB9-941C-9B0F081A5D76}` under `/sitecore/content/bcaa/bcaa/Home`. Page was absent from Home insert options (Article/Audio Product/Detail/Landing/Product/Page Folder) but `create_content_item` succeeded. Unlike Services Page, this Page template echoes `Title`, `pageTitle`, `pageHeaderTitle`, `pageShortTitle`, and `navigationTitle` on read-back. `&` in item names must be spelled `and` (`Health and Dental`). Titles only; no live-site body copy. Starter Data/Speakers/Video left untouched. Items created in Draft. |
| 2026-10-05 | bcaa | Page template field `Content` is rich text (`get_page_template_by_id`). `PageContent` renders it; empty values show `[Content]`. When a site URL is supplied, create-ia fills `Content` with a cleaned HTML fragment from the matching live page, not a single teaser paragraph and not the raw document. |
| 2026-10-05 | bcaa | `update_fields_on_item` wrote `Content` on all 104 Page items and MCP read-back echoed the HTML (Membership, Life, School Safety Patrol). Map URLs from nav and sitemap, not from the Sitecore path. `/insurance/travel/trip-cancellation` and `/insurance/small-business/claim` are form shells with no article body. |

---

## Verification checklist

- [ ] Site name verified via `list_sites`
- [ ] Content root path resolved via `get_content_item_by_path`
- [ ] Page template validated via `get_page_template_by_id`
- [ ] Default fields validated against template
- [ ] IA tree parsed; each node mapped to a live URL when a site URL was supplied
- [ ] `Content` set from that page's body HTML and confirmed on read-back (or listed as empty with a reason)
- [ ] Creation plan confirmed with user
- [ ] Items created depth-first; parents before children
- [ ] Insert options checked before each create
- [ ] Existing items skipped (not duplicated)
- [ ] Created items verified via `get_content_item_by_id`
- [ ] Manifest updated with item IDs and paths
- [ ] Summary presented to user

---

## Do not

- Do not create items without confirmed site name, content root path, template ID(s), and IA tree.
- Do not guess template IDs or parent item IDs — always resolve via MCP.
- Do not duplicate shared content under multiple sections.
- Do not invent pages not listed in the IA spec.
- Do not invent body copy. `Content` comes from the mapped live page, or it stays empty and the summary says why.
- Do not leave `Content` empty when a site URL was supplied and the page fetch succeeded.
- Do not claim success for items that were not verified via MCP read-back.
