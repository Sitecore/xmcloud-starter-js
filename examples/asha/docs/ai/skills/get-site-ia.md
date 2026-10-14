# Get site IA

Extract a website's **information architecture** (main navigation under Home:
L1 → L2 → L3) into an indented markdown file that `sitecore-create-ia` can
consume without reformatting.

## Trigger hints
Use this skill when the user asks to:
- "get site IA" / "extract IA" / "map the navigation"
- "build IA from URL" / "produce an IA markdown for create-ia"
- prepare `docs/ai/ia/<client>-ia.md` before creating Sitecore pages

## Do not use this skill when
- the user wants Sitecore items created now → use `sitecore-create-ia` (after this file exists)
- the user only wants a brand theme → use `create-new-theme` / `sitecore-extract-theme`
- the user already has a finished IA markdown and only needs items created

## Relationship to `sitecore-create-ia`

| Skill | Role |
|-------|------|
| **get-site-ia** (this) | Discover nav → write `docs/ai/ia/<client>-ia.md` |
| **sitecore-create-ia** | Read that file → create Sitecore pages via Marketer MCP |

`sitecore-create-ia` already documents: save large specs to `docs/ai/ia/<client>-ia.md`.

---

## Required inputs

| Input | Required | Notes |
|-------|----------|-------|
| **Website URL** | Yes | Homepage preferred (full nav / mega-menus) |
| **Client key** | Yes | Kebab-case filename stem, e.g. `quanex`, `amesburytruth` |
| **Max depth** | Optional | Default **3** levels under Home (L1/L2/L3). Cap inventing deeper trees. |
| **Screenshot(s)** | Optional | Helps when mega-menus are hover-only or JS-heavy |
| **Include utility links** | Optional | Default **yes** for Contact / About / Careers / Locations if in primary or utility nav |

Do **not** invent Sitecore site name, content root path, or template IDs here.
Those belong to `sitecore-create-ia`. Optionally leave placeholders in the file header.

---

## Output

### Path (always)

```
docs/ai/ia/<client-kebab>-ia.md
```

Examples: `docs/ai/ia/quanex-ia.md`, `docs/ai/ia/era-ia.md`

### Format

Use the template:

```
docs/ai/templates/site-ia.template.md
```

Mirror existing specs: `docs/ai/ia/rockland-ia.md`, `docs/ai/ia/pillsburylaw-ia.md`.

**Hard rules (must match `sitecore-create-ia`):**

1. Indented `- ` list = parent/child
2. List **only creatable page (or folder) items** — no "see also" nav aliases
3. Label text = display name; item name will be kebab-cased by create-ia
4. **Do not duplicate** the same page under multiple branches; pick one canonical parent
5. Mark folders with `[folder]` when clearly a container with no page body
6. Optional `shared` folder only if the site has reusable hubs — do not invent one
7. Assume **Home already exists** — either omit `Home` from the tree or note `Home (exists — skip)` and list L1 children as top-level `-` items under the tree section

### Header metadata (required in every file)

```markdown
# <Client> — Sitecore Content Tree (IA draft)

Source: <URL>
Client key: <client-kebab>
Extracted: <ISO date>
Extracted by: get-site-ia
Max depth: <n>
Confidence: high | medium | low

## Hand-off to sitecore-create-ia
- IA file: `docs/ai/ia/<client-kebab>-ia.md`
- Site name: _(fill when creating)_
- Content root: _(e.g. /sitecore/content/<collection>/<site>/Home)_
- Page template ID: _(fill when creating)_
- Folder template ID: _(if any [folder] / shared nodes)_

## Notes
- <extraction method, gaps, mega-menu caveats>

## Tree (creatable items only)

- Personal
  - Banking
    - Checking
```

---

## Workflow

```
IA extraction progress:
- [ ] Step 1: Confirm URL + client key + max depth
- [ ] Step 2: Discover navigation
- [ ] Step 3: Normalize tree (dedupe, depth, naming)
- [ ] Step 4: Draft for user confirmation
- [ ] Step 5: Write docs/ai/ia/<client>-ia.md
- [ ] Step 6: Hand off instructions for sitecore-create-ia
```

### Step 1 — Confirm inputs

Restate URL, client key, max depth. If client key is missing, derive from domain
(`www.quanex.com` → `quanex`) and confirm.

### Step 2 — Discover navigation

Use **all available** signals, in order:

1. **Primary / mega-menu** — open the homepage; expand menus (hover/click) via Playwright when needed
2. **Utility / footer primary links** — Contact, About, Careers, Locations, Resources (if they are real sections)
3. **Sitemap** (`/sitemap.xml` or HTML sitemap) — fill gaps only for pages clearly part of main IA
4. **User screenshot** — resolve hover-only labels the scraper missed

Prefer real nav labels over marketing slogans. Skip:
- Login / Register / Basket / language switchers (unless user asks)
- External-only links
- Anchor-only same-page links
- Legal footers (Privacy, Cookies) unless user asks

If Playwright is available, prefer a focused nav crawl over inventing structure.
Reuse patterns from `docs/ai/scripts/site-scraper.mjs` / `content-extractor.mjs` when helpful;
a full new scraper is optional — accuracy matters more than automation.

### Step 3 — Normalize

1. Cap depth at **max depth** (default 3 under Home)
2. Collapse duplicate destinations to one branch
3. Prefer shorter, CMS-friendly labels (keep brand product names intact)
4. Sort children in **on-site nav order** when known; otherwise logical grouping
5. Tag `[folder]` only when the node is clearly a container (e.g. empty hub with only children)

### Step 4 — Confirm with user

Present:
- L1 list + approximate page count
- Confidence + known gaps (e.g. "L3 under Products incomplete — mega-menu truncated")
- Ask: approve as-is, deepen a branch, or exclude utility pages

**Do not write the file until the user approves** (unless they explicitly say "write it without confirmation").

### Step 5 — Write the file

Write `docs/ai/ia/<client-kebab>-ia.md` using the template format.
Overwrite only after confirming if a file already exists.

### Step 6 — Hand off

Tell the user next command pattern:

> IA draft ready at `docs/ai/ia/<client>-ia.md`.  
> Run **sitecore-create-ia** with: site name, content root path, page template ID, and this file path.

Do **not** auto-start `sitecore-create-ia` unless the user asks.

---

## Verification checklist

- [ ] File at `docs/ai/ia/<client-kebab>-ia.md`
- [ ] Header metadata + hand-off placeholders present
- [ ] Tree is indented `- ` list only (creatable items)
- [ ] No duplicate pages under multiple parents
- [ ] Depth ≤ max depth
- [ ] Home treated as existing (skipped or noted)
- [ ] User confirmed before write (unless waived)
- [ ] User told how to pass the file into `sitecore-create-ia`

## Do not

- Do not create Sitecore items (that is `sitecore-create-ia`)
- Do not invent deep L3/L4 trees not evidenced by nav/sitemap
- Do not put theme tokens, components, or presentation in this file
- Do not store IA specs outside `docs/ai/ia/` (keep one place for create-ia)
- Do not require template IDs or content root to finish extraction
