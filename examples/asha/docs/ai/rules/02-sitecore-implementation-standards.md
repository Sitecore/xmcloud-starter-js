# Sitecore implementation standards

Apply these rules to all Sitecore XM Cloud component work.

## Shared docs to respect
- `docs/ai/reference/sitecore-rules.md`
- `docs/ai/skills/shared/react-uiim-guidelines.md`
- `docs/ai/templates/sitecore-component-spec.template.yaml`
- `docs/ai/reference/sitecore-marketer-mcp-reference.md`

## Sitecore item change rules
- Use the **Sitecore marketer MCP** whenever Sitecore items must be created or updated.
- Use the **sitecore-documentation-docs MCP** when official Sitecore behavior is unclear.
- Prefer explicit MCP-backed actions over vague instructions.

## Rendering rules
- Prefer **JSON Rendering** unless the repo explicitly requires otherwise.
- `Datasource Template` must use a **full Sitecore path**, never a GUID.
- `Parameters Template [shared]` must always be set to the **Item ID (GUID)** of the Rendering Parameters template — **never use a path**, never leave it empty.
- `Component Name [shared]` must be **PascalCase** and **exactly match** the TSX filename without extension (e.g. `EurobankHeader` for `EurobankHeader.tsx`). Do not use kebab-case or camelCase.
- `AddFieldEditorButton = 1` is preferred unless repo conventions differ.
- After creating a rendering, **always register it** in the site's Available Renderings: read the **current** `Renderings [shared]` field from the **Page Content** item at `/sitecore/content/<siteCollection>/<siteName>/Presentation/Available Renderings/Page Content`, then **concatenate** the new rendering ID with a pipe separator. **Never replace** the existing value — that removes all other components.

## Workflow-specific rendering rules

### Context-only
- do **not** require datasource by default
- keep these empty:
  - `Datasource Template`
  - `Datasource Location`
  - `Data source`
  - `ComponentQuery`

### Simple datasource
- require datasource
- use datasource template + datasource location
- keep `ComponentQuery` empty

### List datasource
- require datasource
- require valid `ComponentQuery`
- query must use:
  - `$datasource: String!`
  - `$language: String!`
  - `datasource: item(path: $datasource, language: $language)`
  - `children { results { ... } }`
  - `jsonValue` for authorable fields

## Template rules
- Every created custom template must have `__Standard Values`.
- Every datasource template (parent and child) must set `__Base template` to `{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}` (Standard Template + Grid Parameters). This does **not** apply to folder templates.
- Avoid collision-prone field names such as:
  - `id`
  - `name`
  - `path`
  - `url`
  - `template`
  - `parent`
  - `children`
  - `language`
  - `version`
  - `displayName`
- Prefer descriptive field names such as:
  - `Title`
  - `Description`
  - `EyebrowText`
  - `HeroImage`
  - `PrimaryLink`
  - `BadgeText`

## Datasource/folder rules

### Simple datasource component
Must normally include:
- datasource template (with base templates `{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}`)
- folder template
- datasource folder under `/sitecore/content/<siteCollection>/<siteName>/Data/` (with insert options set on the folder item itself)
- example datasource item inside the folder

### List datasource component
Must normally include:
- parent template (with base templates `{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}`)
- child template (with same base templates)
- folder template
- datasource folder under `/sitecore/content/<siteCollection>/<siteName>/Data/` (with insert options set on the folder item itself)
- example parent datasource item inside the folder
- example child items inside the parent item
- parent `__Standard Values` -> `__Masters` = child template
- parent should inherit `_HorizonDatasourceGrouping`
- folder template `__Standard Values` -> `__Masters` = parent template

### Context-only component
Do **not** create by default:
- datasource template
- child template
- folder template
- datasource folder
- `ComponentQuery`

## React implementation rules
- Create components under:
  - `src/components/uiim/<category-kebab>/<ComponentNamePascal>.tsx`
  - Folder is kebab-case, TSX filename is PascalCase (e.g. `navigation/EurobankHeader.tsx`)
- Component props **must** extend `ComponentProps` from `lib/component-props` — never define `params` manually as `Record<string, string>`
- Always use `params.styles` and `params.RenderingIdentifier` from `ComponentProps` in the wrapper element
- Use:
  - Tailwind CSS
  - shadcn/ui primitives from `@/components/ui/*`
  - Sitecore JSS helpers from `@sitecore-content-sdk/nextjs`

## Named exports rule
Every component must use **named exports**, not `export default`:
- Always export at least `export const Default`
- Each additional named export = one variant
- Export name must **exactly match** the Variant Definition item name in Sitecore
- Include a non-exported empty-state fallback component

## React data shape rules

### Context-only
Use:
- `useSitecore()` (SDK 2.0 — replaces the removed `useSitecoreContext()`)
- `page?.layout?.sitecore?.route?.fields` (or access `page` from `ComponentProps`)

### Simple datasource
Use top-level fields:
- `fields.Title`
- `fields.Description`
- `fields.PrimaryLink`
- `fields.HeroImage`

### List datasource
Use GraphQL datasource shape:
- `fields.data.datasource`
- `fields.data.datasource.children.results`
- `.jsonValue`

## Editable field rules (mandatory)
**Every** Sitecore-managed field must use the appropriate SDK editable helper. This is non-negotiable:
- `Text` — for Single-Line Text fields
- `RichText` (alias `ContentSdkRichText`) — for Rich Text fields
- `NextImage` (alias `ContentSdkImage`) — for Image fields
- `Link` (alias `ContentSdkLink`) — for General Link fields

**Never** use plain `<img>`, `next/image Image`, `<a>`, `next/link Link`, or hardcoded strings for Sitecore-managed fields. Doing so breaks Experience Editor editability.

## Output order
For Sitecore tasks, respond in this order:
1. chosen skill/workflow
2. completed or partial spec
3. plan
4. Sitecore actions / MCP actions
5. files changed
6. verification checklist
