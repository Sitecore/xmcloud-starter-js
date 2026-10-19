# Update header and footer

Match a site's header and footer from screenshots. The header stays a working HeaderST: Mega Menu items and Link Lists follow the information architecture. The footer is a static site-named FooterST variant.

## When to use

- "update the header and footer" / "match this header" / "match this footer"
- the user pastes header and footer screenshots and gives the partial-design path
- a site needs its own HeaderST and FooterST variant named after the site

## Not this skill

| Ask | Skill |
|-----|--------|
| Cosmetic HeaderST only, named Version1, Version2, … | `sitecore-headerst-variant` |
| A new selectable Skin | `create-new-theme` |
| Pixel-match page body components | `sitecore-create-demo-variants` |

Do not restyle `Default`. Other sites keep the variants they already use.

## Inputs

| Input | Required | Role |
|-------|----------|------|
| Header screenshot | Yes | Layout of utility row, logo, search, primary nav, audience row |
| Footer screenshot | Yes | Column copy, link labels, legal bar |
| Partial designs folder | Yes | Example: `/sitecore/content/asha/asha/Presentation/Partial Designs/Global` |
| IA file | Yes for the header | `docs/ai/ia/<site>-ia.md`. Primary nav labels and their children become Mega Menu items and Link Lists |

If a screenshot or the partial path is missing, ask before editing.

## Variant name

PascalCase the site name and drop hyphens so it is a valid export: site `asha` → `Asha`. The TSX export and the Variant Definition item use that exact name.

Leave `Default`, `LoginRequired`, and existing `VersionN` exports unchanged.

## Load first

- `docs/ai/ia/<site>-ia.md`
- `src/components/site-three/HeaderST.tsx`
- `src/components/site-three/FooterST.tsx`
- `docs/ai/skills/sitecore-add-variants.md`
- `docs/ai/reference/agent-api-limitations.md`

## Workflow

```
Header and footer progress:
- [ ] Step 1: Read the screenshots and the partials
- [ ] Step 2: Add the HeaderST variant
- [ ] Step 3: Point Mega Menu items and Link Lists at the IA
- [ ] Step 4: Add the static FooterST variant
- [ ] Step 5: Create Variant Definition items
- [ ] Step 6: Tell the user the Pages steps
```

### Step 1 — Read the screenshots and the partials

`get_content_item_by_path` on the folder the user named. Header and Footer partials are usually `.../Global/Header` and `.../Global/Footer`.

`get_components_on_page` on each partial. Record:

- HeaderST rendering instance id, datasource, and `DynamicPlaceholderId`
- Each MegaMenuItem in `header-navigation-{id}`: instance id, datasource id, title, dynamic placeholder id
- Each LinkList in `mega-menu-item-primary-links-{id}` and `mega-menu-item-secondary-links-{id}`
- FooterST rendering instance id

Note which Link List datasources are shared by more than one Mega Menu. A shared list cannot be specialized per menu; clear it or replace it with a new list.

### Step 2 — HeaderST variant

Add `export const <SiteName>` in `HeaderST.tsx`. Match the screenshot with theme tokens (`bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, `bg-dark`). Do not hard-code hex.

Keep one `AppPlaceholder` named `header-navigation-${params.DynamicPlaceholderId}` for the primary nav row. Style the Mega Menu triggers (uppercase, spacing) with Tailwind selectors on that nav. Utility links, search, logo, and an audience row that are not Mega Menus live in this variant.

Link internal pages as `/${site}/${locale}/${item name}` using `page.siteName` and `page.locale`, with `asha` / `en` as the fallback. External utility links (store, account, login) stay external when the IA omitted them.

Use a transparent logo in `public/` when the Sitecore logo field still holds another brand.

### Step 3 — Mega Menu items and Link Lists

Map the primary nav in screenshot order onto the IA L1 items.

- Update each existing MegaMenuItem `Title` and `Link` to that L1 page. Internal link XML: `<link text="Careers" linktype="internal" id="{ITEM-ID}" />`
- Marketer MCP cannot rename items. Update the visible `Title` and link text. Say so in the summary.
- Update that menu's primary Link List children so each link text and target is an L2 page. Blank leftover child links (`text=""` and no href) so starter labels disappear.
- Add MegaMenuItem instances with `add_component_on_page` when the nav has more items than the partial. Rendering id `b1d5e3e7-6e29-4cfc-acbc-0d49d31b4955`. Placeholder `/headless-header/header-navigation-{DynamicPlaceholderId}`.
- Add a LinkList into `mega-menu-item-primary-links-{newDynamicId}` when a menu has no primary list. Rendering id `4956263d-1195-4d6e-931b-800ea625ff6f`. Then set each child `Link`.
- Do not put the same destination under two menus. L3 pages go in a secondary Link List titled with the L2 name when that menu has its own list.

Audience and utility rows in the screenshot stay direct links in the variant unless the screenshot shows them as dropdowns.

### Step 4 — FooterST variant

Add `export const <SiteName>` in `FooterST.tsx`. Static markup is enough: columns, headings, body copy, and the legal bar from the screenshot. Do not require Link List placeholders. Use the same theme tokens. Copy only text that is visible in the screenshot or on the source site.

### Step 5 — Variant Definition items

Headless Variants root: `/sitecore/content/<collection>/<site>/Presentation/Headless Variants`

| Item | Template |
|------|----------|
| `<Component>` container, if missing | Headless Variants `{49C111D0-6867-4798-A724-1F103166E6E9}` |
| `<SiteName>` definition | Variant Definition `{4D50CDAE-C2D9-4DE8-B080-8F992BFB1B55}` |

Create `HeaderST/<SiteName>` and `FooterST/<SiteName>` on this site only. Verify with `get_content_item_by_path`.

### Step 6 — Pages steps

MCP cannot set `FieldNames` (`docs/ai/reference/agent-api-limitations.md`). After the items exist, tell the user:

1. Open the Header partial → HeaderST → variant `<SiteName>`
2. Open the Footer partial → FooterST → variant `<SiteName>`
3. On each new Link List, choose **Header Primary Links** (primary column) or **Header Secondary Links** (grouped column)
4. Publish the Header and Footer partials

## Tests

Add a render test for each new export. Assert the screenshot labels that are hard-coded in the variant. Do not require datasource link text that comes from Sitecore.

## Do not

- Do not change `Default` or other sites' partials
- Do not name the variant `VersionN` in this skill
- Do not hard-code client hex when a theme token already matches
- Do not delete shared Link Lists that other menus still reference
- Do not claim the variant is selected in Pages until `get_components_on_page` shows its `FieldNames` id
