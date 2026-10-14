# Sitecore create context-only component

Use this skill when creating a Sitecore XM Cloud component that renders content from **route/page fields** rather than a datasource item.

## Trigger hints
Use this skill when the component:
- should not have its own datasource item
- should render route/page fields
- may optionally use rendering params
- is page-scoped content such as a page hero, page intro, route banner, or section header driven by page fields

## Do not use this skill when
- the component needs its own datasource item
- the component should be reusable across many pages via datasource selection
- the component contains authorable child items
- the rendering requires `ComponentQuery`

Use instead:
- `docs/ai/skills/sitecore-create-simple-component.md`
- `docs/ai/skills/sitecore-create-list-component.md`

---

## Load first
- `docs/ai/reference/sitecore-rules.md`
- `docs/ai/skills/shared/react-uiim-guidelines.md`
- `docs/ai/templates/sitecore-component-spec.template.yaml`
- `docs/ai/reference/sitecore-marketer-mcp-reference.md`
- `docs/ai/skills/sitecore-maintain-manifest.md`

## Examples
- `docs/ai/examples/sitecore-create-context-component/page-hero.request.md`
- `docs/ai/examples/sitecore-create-context-component/page-hero.spec.yaml`

---

## Inputs to collect

- `siteCollection`
- `siteName`
- `category`
- component PascalCase name
- route/page field list, or confirmation that existing route fields should be used
- route/page template name if known
- optional screenshot paths or attached screenshots
- optional rendering params requirements

---

## Required workflow

1. Read the request.
2. If screenshots are provided, inspect them first.
3. Determine whether the request is truly context-only.
4. Normalize into `docs/ai/templates/sitecore-component-spec.template.yaml`.
5. Apply safe defaults (see below).
6. Read `docs/ai/manifests/sitecore-manifest.yaml`.
   - If the component exists with `status: complete`, confirm with user before re-creating.
   - If `status: partial` or `failed`, resume using recorded item IDs.
   - If not found, register a `planned` entry.
7. Ask concise follow-up questions if required information is missing.
8. Before implementation, show:
   - chosen classification
   - inferred route/context field model
   - assumptions
   - completed or partial spec
   - plan
9. Then implement.

If the user asks for an approval gate, stop after the plan and wait.

## Safe defaults
If not explicitly specified:

- `component.kind = context-only`
- `component.filePath = src/components/uiim/<category-kebab>/<ComponentNamePascal>.tsx`
- `rendering.datasourceRequired = false`
- `rendering.datasourceTemplatePath = ""`
- `rendering.datasourceLocationQuery = ""`
- `rendering.dataSource = ""`
- `rendering.useComponentQuery = false`
- `rendering.componentQuery = ""`
- `react.propsShape = context-route`
- `templates.parent.create = false`
- `templates.child.create = false`
- `folderTemplate.create = false`
- `datasourceFolder.create = false`

---

## Sitecore implementation rules

Use the **Sitecore marketer MCP** whenever Sitecore items must be created or updated.

For a true context-only component, normally create/update only:

0. Check `docs/ai/manifests/sitecore-manifest.yaml` → `lookups` for cached parent item IDs. Use cached IDs for structural paths instead of resolving via MCP. If lookups are empty (first task), resolve all 6 required structural paths and populate lookups before proceeding.

Then create:
1. the Rendering Parameters template
2. the rendering item (with `Parameters Template [shared]` set)
3. the React component file
4. the component map registration
4. optionally page/route template fields if explicitly confirmed or clearly in scope

### Do not create by default
- datasource template
- child template
- folder template
- datasource content folder
- `ComponentQuery`

### Content Resolver alternative

Some context-only components benefit from a **Rendering Contents Resolver** instead of reading from route context. This is especially useful for navigation components.

**When to use a content resolver:**
- The component needs data from a specific item tree (e.g., navigation children)
- The data shape is provided by Sitecore's built-in resolvers (e.g., Navigation Contents Resolver)
- You want to avoid custom server-side data fetching

**How it works:**
1. Set the **Rendering Contents Resolver** field on the rendering item to the appropriate resolver (e.g., "Navigation Contents Resolver")
2. The component instance's **Data Source** is set at placement time to the root item (e.g., Home for navigation)
3. The resolver populates `fields` with the resolved data — no `ComponentQuery` or `getComponentServerProps` needed
4. The rendering still has no `Datasource Template` or `Datasource Location` — the Data Source is set manually per instance

**Note:** Components using content resolvers technically have a Data Source but no Datasource Template. The Data Source is the root item for the resolver, not a traditional datasource item. This is a valid pattern — do not create datasource templates or folders for these components.

### Rendering rules
- Create a **JSON Rendering**
- `Datasource Template` must remain empty (even if using a content resolver)
- `Datasource Location` must remain empty
- `Data source` must remain empty (set per-instance at placement time if using a content resolver)
- `ComponentQuery` must remain empty
- `AddFieldEditorButton = 1` is still preferred
- The rendering should **not** require datasource selection
- `Component Name [shared]` must be **PascalCase** and **exactly match** the TSX filename without extension (e.g. `PageHero` for `PageHero.tsx`)
- `Parameters Template [shared]` must be set to the **Item ID (GUID)** of the Rendering Parameters template — **never use a path**. Resolve the ID via MCP after creating the Rendering Parameters template.

### Available Renderings rule

**CRITICAL:** `Renderings` field is silent-write AND silent-read — MCP cannot read the current value.
1. Ask user for current value (or use manifest `lastKnownValue`)
2. **Concatenate**: `<existing>|{NEW-RENDERING-GUID}` (uppercase, braces, pipe)
3. **NEVER replace** — overwriting removes all other components
4. Path: `<siteCollection>/<siteName>/Presentation/Available Renderings/Page Content`

### Route/page field rules

If route fields already exist: use them, do not create duplicates.

If route fields do not exist:
- propose the required route/page template changes first
- ask for confirmation before modifying page templates
- avoid collision-prone field names: `id`, `name`, `path`, `url`, `template`, `parent`, `children`, `language`, `version`, `displayName`
- any new or updated template must include `__Standard Values`

### Verification rule

After create/update, verify:
- rendering path and component name
- `Component Name [shared]` is PascalCase matching TSX filename
- `Parameters Template [shared]` is set to the Item ID (GUID), not a path
- rendering `Datasource Template` is empty
- rendering `Datasource Location` is empty
- rendering `ComponentQuery` is empty
- rendering does not require datasource
- rendering is registered in Available Renderings (Page Content)
- if route template fields were created: field existence, field `Type`, `__Standard Values`

---

## React implementation rules

- Create under `src/components/uiim/<category-kebab>/<ComponentNamePascal>.tsx`
- Component props type **must** extend `ComponentProps` from `lib/component-props` — never define `params` manually
- Always use `params.styles` and `params.RenderingIdentifier` from `ComponentProps` in the wrapper element
- Use Tailwind CSS
- Use shadcn/ui primitives from `@/components/ui/*`
- Always import from `@sitecore-content-sdk/nextjs`
- Use `useSitecore()` (SDK 2.0 — replaces the removed `useSitecoreContext()`) and access route fields via `page?.layout?.sitecore?.route?.fields` or the `page` prop from `ComponentProps`
- **All** Sitecore-managed fields must use SDK editable helpers (`Text`, `RichText`, `NextImage as ContentSdkImage`, `Link as ContentSdkLink`) — never use plain `<img>`, `<a>`, or hardcoded text for authorable fields
- Handle missing route fields safely with optional chaining



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
5. any follow-up verification or serialization requirements
6. updated manifest entry

---

## Completion rule

A task is only fully complete when:
- the React component is implemented
- the component map is updated when required
- the rendering item was created/updated or clearly reported as blocked
- the important Sitecore values were verified or explicitly flagged for follow-up
- any required route template changes were confirmed and executed

Do not silently downgrade unverified Sitecore work to "manual setup required" without explaining why.

---

## Verification checklist

**Context-only-specific:**
- [ ] Request correctly classified as context-only
- [ ] No datasource template, folder, or `ComponentQuery` created
- [ ] Rendering does not require datasource
- [ ] `Datasource Template`, `Datasource Location`, `ComponentQuery` all empty
- [ ] TSX uses `useSitecore()` + `page?.layout?.sitecore?.route?.fields` (or `page` from `ComponentProps`)
- [ ] If page template changed, `__Standard Values` created

**Shared checks** — see `docs/ai/skills/shared/verification-checklist.md`
