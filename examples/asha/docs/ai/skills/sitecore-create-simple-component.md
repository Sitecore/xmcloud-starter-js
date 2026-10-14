# Sitecore create simple component

Use this skill when creating a Sitecore XM Cloud component backed by a **single datasource item**.

## Trigger hints
Use this skill when the component:
- uses a single datasource item
- is a hero, promo, CTA, content block, image/text block, or quote block
- should be reusable by selecting a datasource item
- does not have repeated child datasource content

## Do not use this skill when
- the component needs repeated child items
- authors must create nested cards/rows/FAQ items/testimonials
- the rendering depends on `ComponentQuery`
- the component requires authorable collections of child datasource items

Use instead:
- `docs/ai/skills/sitecore-create-list-component.md`
- `docs/ai/skills/sitecore-create-context-component.md`

---

## Load first
- `docs/ai/reference/sitecore-rules.md`
- `docs/ai/skills/shared/react-uiim-guidelines.md`
- `docs/ai/templates/sitecore-component-spec.template.yaml`
- `docs/ai/reference/sitecore-marketer-mcp-reference.md`
- `docs/ai/skills/sitecore-maintain-manifest.md`

## Examples
- `docs/ai/examples/sitecore-create-simple-component/hero.request.md`
- `docs/ai/examples/sitecore-create-simple-component/hero.spec.yaml`
- `docs/ai/examples/sitecore-create-simple-component/promo-banner.spec.yaml`

---

## Inputs to collect

Confirm or infer:
- component name
- category/grouping
- site collection and site name
- rendering name
- datasource template name
- folder template name
- React file path
- field names and field types
- screenshot/design reference if provided
- whether datasource is required
- whether repo process expects direct MCP item creation or serialization

If required information is missing, ask concise follow-up questions first.

---

## Required workflow

1. Classify the request as a simple datasource component.
2. Inspect screenshots/design references before implementation.
3. Normalize into `docs/ai/templates/sitecore-component-spec.template.yaml`.
4. Apply safe defaults (see below).
5. Read `docs/ai/manifests/sitecore-manifest.yaml`.
   - If the component exists with `status: complete`, confirm with user before re-creating.
   - If `status: partial` or `failed`, resume using recorded item IDs.
   - If not found, register a `planned` entry.
6. State assumptions clearly.
7. Before implementation, return:
   - chosen workflow
   - classification
   - assumptions
   - completed or partial spec
   - plan
8. Then implement.

If the user wants approval first, stop after the plan.

## Safe defaults
If not explicitly specified:

- `component.kind = simple`
- `component.filePath = src/components/uiim/<category-kebab>/<ComponentNamePascal>.tsx`
- `rendering.datasourceRequired = true`
- `rendering.useComponentQuery = false`
- `rendering.componentQuery = ""`
- `react.propsShape = default-jss`

---

## Sitecore implementation rules

### Marketer MCP first

Use marketer MCP first for Sitecore item operations, including:
- datasource templates
- template sections
- template fields
- template `__Standard Values`
- folder templates
- folder template `__Standard Values`
- datasource folders
- renderings

Do not claim marketer MCP cannot create templates or renderings by default.

Only fall back to manual/serialization/patch-ready output when:
- a specific MCP action fails
- permissions block the change
- repo governance requires serialized definitions

---

### Creation order

0. Check `docs/ai/manifests/sitecore-manifest.yaml` → `lookups` for cached parent item IDs. Use cached IDs for structural paths instead of resolving via MCP. If lookups are empty (first task), resolve all 6 required structural paths and populate lookups before proceeding.
1. resolve or create the folder/container structure:
   - resolve `projectTemplatesRoot/Components` via `get_content_item_by_path`. If it does not exist, create it using template folder ID `0437fee2-44c9-46a6-abe9-28858d9fee8c`.
   - resolve or create the `<Category>` subfolder under `Components` (same template folder ID).
   - do the same for `renderingsRoot/<Category>` and `renderingParamsRoot/<Category>`.
   - resolve or create `projectFoldersRoot` (the `Folders` container under `projectTemplatesRoot`).
   - **⚠️ IMPORTANT: If creating NEW category folders, create ALL 3 category folders FIRST in their own batch and wait for IDs. Only create templates in the NEXT batch. Creating templates in the same batch as their category folders risks placing them under the wrong parent (race condition).**
2. create datasource template
3. set `__Base template` on datasource template to `{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}` (Standard Template + Grid Parameters). This applies to all datasource templates, **not** folder templates.
4. create template section
5. create template fields
6. explicitly set each field item `Type`
7. create template `__Standard Values`
8. link the datasource template to its `__Standard Values` — set the `Standard values` field on the template item to the `__Standard Values` Item ID
9. create folder template
10. create folder template `__Standard Values`
11. link the folder template to its `__Standard Values` — same as step 8
12. set folder insert options / `__Masters`
13. create datasource folder under `/sitecore/content/<siteCollection>/<siteName>/Data`
14. set insert options on the datasource folder item itself (not only on the folder template `__Standard Values`)
15. create an example datasource item inside the folder (using the datasource template)
16. create Rendering Parameters template under `renderingParamsRoot/<Category>/<ComponentName>`
17. set all four base templates on the Rendering Parameters template
18. create rendering item
19. update rendering fields via MCP. Use these known MCP field names:
    - `componentName` = PascalCase component name matching TSX filename (e.g. `EurobankHeader`)
    - `Parameters Template` = Item ID (GUID) of the Rendering Parameters template
    - `AddFieldEditorButton` = `1`
    - `Datasource Template` = full Sitecore path to the datasource template (silent-write — `updatedFields` will be empty, this is normal)
    - `Datasource Location` = dynamic query (silent-write). Use the standard pattern: `query:$site/*[@@name='Data']/*[@@templatename='<FolderTemplateName>']|query:$sharedSites/*[@@name='Data']/*[@@templatename='<FolderTemplateName>']`
18. register the rendering in Available Renderings — **read the current value** of the `Renderings` field on the **Page Content** Available Renderings item, then **concatenate** (not replace) the new rendering ID with a pipe separator. Path: at `/sitecore/content/<siteCollection>/<siteName>/Presentation/Available Renderings/Page Content`
19. verify final state

### Batch operations cheat sheet (simple component)

Optimize MCP calls by batching independent operations. This is the proven sequence from 10+ components:

```
Batch 1 (if new category): Create 3 category folders (Components, Rendering Parameters, Renderings)
   ↓ wait for IDs
Batch 2: Create datasource template + folder template
Batch 3: Set base templates + create Data section
Batch 4: Create all fields (parallel)
Batch 5: Set all field types (parallel)
Batch 6: Create both __Standard Values (parallel)
Batch 7: Link SVs + set defaults + set __Masters + create datasource folder + rendering params + rendering (all parallel)
Batch 8: Set folder insert options + rendering params base templates + rendering fields + create example item + create variants container (all parallel)
Batch 9: Create all variant definitions (parallel)
Batch 10: Ask user for Available Renderings value → append
```

---

### Parent resolution

Before creating child items:
- resolve parents with `get_content_item_by_path`
- use resolved item IDs
- do not guess IDs

---

### Template field rule

When creating template fields:
- create the field item under the correct section
- explicitly set the field item `Type`
- verify the final `Type`

Common field types:
- `Single-Line Text`
- `Rich Text`
- `Image`
- `General Link`

If needed, also set `Source`, `Shared`, `Unversioned`.

Do not assume the field type is correct by default.

---

### `__Standard Values` rule

- `name = "__Standard Values"`, `parentId = owning template ID`, `templateId = owning template ID`
- After creation, **link it**: set `__Standard values` on the template item to the SV's Item ID (silent-write — empty `updatedFields` is normal)
- Applies to datasource templates and folder templates
- Do NOT use Standard template ID `1930bbeb-...` as the templateId

---

### Folder template rule

When creating a datasource folder template:
- create the folder template item
- create its `__Standard Values` using the folder template's own item ID as both `parentId` and `templateId`
- set insert options / `__Masters` so authors can create the correct datasource items inside the folder

Use exact field names returned by MCP inspection when updating insert options.

---

### Rendering rule

Prefer **JSON Rendering** unless repo convention differs.

For simple datasource components:
- datasource should normally be required
- `ComponentQuery` must remain empty
- `AddFieldEditorButton = 1` is preferred
- `Datasource Template` must use a full Sitecore path
- `Component Name [shared]` must be **PascalCase** and **exactly match** the TSX filename without extension (e.g. `EurobankHeader` for `EurobankHeader.tsx`)
- `Parameters Template [shared]` must be set to the **Item ID (GUID)** of the Rendering Parameters template — **never use a path**. Resolve the ID via MCP after creating the Rendering Parameters template.

Use exact field names returned by MCP inspection when updating the item.

---


### Example datasource item rule

After creating the datasource folder, create one example content item inside it.

This ensures:
- the datasource picker is not empty when the component is first used
- authors have something to duplicate or edit immediately
- the component can render in Experience Editor without manual content creation

**Simple component:** create one item using the datasource template. Name it after the component (e.g. `Hero`, `Promo Banner`).

**List component:** create one parent item using the parent template, then create one or two child items using the child template inside the parent.

#### Field values for example items

- **If the user provided a screenshot or design reference:** populate the example item fields with content that matches the design — extract text, headings, descriptions, image URLs, and link targets from the visual reference. The goal is for the component to render identically to the design from day one.
- **If the user provided a URL in the prompt:** use it to extract real content for the example item fields (text, images, links visible on the page).
- **If no visual reference was provided:** use `__Standard Values` defaults where set. If no defaults exist, leave fields empty — do not invent placeholder copy.

Use `get_content_item_by_path` to resolve the folder, then `create_content_item` with:
- `parentId` = datasource folder item ID
- `templateId` = datasource template item ID
- `name` = component name

Verify with `get_content_item_by_id` after creation.

---

### Datasource template base templates rule

Every datasource template (parent and child) must inherit these two base templates. This does **not** apply to folder templates.

Set `__Base template` to:
```
{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}
```

| ID | Purpose |
|---|---|
| `{1930BBEB-7805-471A-A3BE-4858AC7CF696}` | Standard Template |
| `{44A022DB-56D3-419A-B43B-E27E4D8E9C41}` | Grid Parameters |

Set this immediately after creating the datasource template item, before creating sections or fields.

---

### Insert options on datasource folder instance rule

After creating the datasource folder under `/Data`, you must set insert options **on the folder item itself** — not only on the folder template's `__Standard Values`.

Use `update_fields_on_content_item` on the datasource folder item to set insert options / `__Masters` pointing to the datasource template.

Without this step, authors cannot create new datasource items inside the folder.

---

### Available Renderings rule

**CRITICAL:** `Renderings` field is silent-write AND silent-read — MCP cannot read the current value.
1. Ask user for current value (or use manifest `lastKnownValue`)
2. **Concatenate**: `<existing>|{NEW-RENDERING-GUID}` (uppercase, braces, pipe)
3. **NEVER replace** — overwriting removes all other components
4. Path: `<siteCollection>/<siteName>/Presentation/Available Renderings/Page Content`

---

### Verification rule

Prefer MCP-based verification first. Verify:
- template path and section
- datasource template `Base template` includes `{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}`
- field existence and `Type`
- template `__Standard Values` is based on owning template
- folder template `__Standard Values` is based on owning folder template
- folder insert options / `__Masters`
- datasource folder path
- insert options set on datasource folder instance (not only on folder template)
- rendering datasource template, datasource location, component name
- `Component Name [shared]` is PascalCase matching TSX filename
- `Parameters Template [shared]` is set to the Item ID (GUID), not a path
- rendering is registered in Available Renderings (Page Content)

If something cannot be reliably verified through MCP, state that explicitly and mark it as follow-up required.

---

## React implementation rules

- Create under `src/components/uiim/<category-kebab>/<ComponentNamePascal>.tsx`
- Component props type **must** extend `ComponentProps` from `lib/component-props` — never define `params` manually
- Always use `params.styles` and `params.RenderingIdentifier` from `ComponentProps` in the wrapper element
- Use Tailwind CSS
- Use shadcn/ui primitives from `@/components/ui/*`
- Always import from `@sitecore-content-sdk/nextjs`
- Use top-level field access: `fields.Title`, `fields.Description`, `fields.PrimaryLink`, `fields.HeroImage`
- **All** Sitecore-managed fields must use SDK editable helpers (`Text`, `RichText`, `NextImage as ContentSdkImage`, `Link as ContentSdkLink`) — never use plain `<img>`, `<a>`, or hardcoded text for authorable fields
- Do not model repeated child items in this workflow



### Rendering Parameters template rule

Create at `renderingParamsRoot/<Category>/<ComponentName>` before the rendering item.
1. Create template item (standard Template template ID)
2. Set `__Base template` to: `{4247AAD4-EBDE-4994-998F-E067A51B1FE4}|{5C74E985-E055-43FF-B28C-DB6C6A6450A2}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}|{3DB3EB10-F8D0-4CC9-BE26-18CE7B139EC8}`
3. Set rendering `Parameters Template [shared]` to this template's **Item ID (GUID)**, not a path

---

### Named exports and variants rule

- Named exports only (`export const Default`), never `export default`
- `Default` is mandatory and must be first export
- Include a non-exported empty-state fallback component
- Export name must exactly match Variant Definition item name in Sitecore
- For variants beyond `Default`, use `docs/ai/skills/sitecore-add-variants.md`

### Component map rule

- Update `.sitecore/component-map.ts` with the new component
- Follow the existing naming pattern in the file

---

## Output format

Before implementation:
1. chosen workflow
2. classification
3. assumptions
4. completed or partial spec
5. plan

After implementation:
1. Sitecore actions performed
2. MCP/item operations performed
3. files changed
4. verification results
5. follow-up verification or serialization requirements
6. updated manifest entry

---

## Completion rule

A task is only fully complete when:
- the React component is implemented
- the component map is updated when required
- the needed Sitecore items were created/updated or clearly reported as blocked
- the important Sitecore values were verified or explicitly flagged for follow-up

Do not silently downgrade unverified Sitecore work to "manual setup required" without explaining why.

---

## Verification checklist

**Simple-component-specific:**
- [ ] Request correctly classified as simple component
- [ ] Datasource template created with base templates `{1930BBEB-...}|{44A022DB-...}`
- [ ] Template section + fields created with explicit `Type`
- [ ] `__Standard Values` created and linked to template
- [ ] Folder template + SV created, `__Masters` → datasource template
- [ ] Datasource folder under `/Data` with insert options on instance
- [ ] Example datasource item created inside folder
- [ ] `Datasource Template` uses full Sitecore path
- [ ] `Datasource Location` is valid
- [ ] `ComponentQuery` is empty
- [ ] TSX uses top-level `fields.<FieldName>`

**Shared checks** — see `docs/ai/skills/shared/verification-checklist.md`
