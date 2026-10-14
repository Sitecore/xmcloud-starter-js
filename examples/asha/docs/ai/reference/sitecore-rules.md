# Sitecore Rules — Canonical Reference

All non-negotiable Sitecore XM Cloud rules for the AI Demo Builder.
Skills reference this file for fix/debug workflows. Create skills keep compressed inline versions.

---

## Template IDs

| Item type | Template ID |
|---|---|
| Template | `ab86861a-6030-46c5-b394-e8f99e8b87db` |
| Template Section | `e269fbb5-3750-427a-9149-7aa950b49301` |
| Template Field | `455a3e98-a627-4b40-8035-e683a0331ac7` |
| Template Folder | `0437fee2-44c9-46a6-abe9-28858d9fee8c` |
| JSON Rendering | `04646a89-996f-4ee7-878a-ffdbf1f0ef0d` |
| HeadlessVariants container | `49c111d0-6867-4798-a724-1f103166e6e9` |
| Variant Definition | `4d50cdae-c2d9-4de8-b080-8f992bfb1b55` |

## Base Templates

### Datasource templates (parent + child, NOT folder)

```
{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}
```

| ID | Purpose |
|---|---|
| `{1930BBEB-7805-471A-A3BE-4858AC7CF696}` | Standard Template |
| `{44A022DB-56D3-419A-B43B-E27E4D8E9C41}` | Grid Parameters |

Set immediately after creation, before sections or fields.

### Rendering Parameters templates (all 4 required)

```
{4247AAD4-EBDE-4994-998F-E067A51B1FE4}|{5C74E985-E055-43FF-B28C-DB6C6A6450A2}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}|{3DB3EB10-F8D0-4CC9-BE26-18CE7B139EC8}
```

| ID | Purpose |
|---|---|
| `{4247AAD4-EBDE-4994-998F-E067A51B1FE4}` | IComponentVariant — variant picker |
| `{5C74E985-E055-43FF-B28C-DB6C6A6450A2}` | IStyling — styles support |
| `{44A022DB-56D3-419A-B43B-E27E4D8E9C41}` | Grid Parameters |
| `{3DB3EB10-F8D0-4CC9-BE26-18CE7B139EC8}` | IRenderingId — HTML ID field |

---

## __Standard Values

Every template must have `__Standard Values`. No exceptions.

**Creation:**
- `name = "__Standard Values"`
- `parentId = owning template item ID`
- `templateId = owning template item ID`

**Linking:** After creation, set `__Standard values` (double underscore) on the **template item** to the SV's Item ID. This is a silent-write field — empty `updatedFields` is normal.

**Default values:** Set `$name` for title fields. Leave Image/Link fields empty.

Do NOT use Standard template ID `1930bbeb-...` as the templateId.

---

## MCP Field Names

### Double underscore prefix (required — without it MCP returns 400)

| Display name | MCP field name | Notes |
|---|---|---|
| Base template | `__Base template` | `Base template` without `__` → 400 error |
| Insert Options / Masters | `__Masters` | Silent-write |
| Standard values [shared] | `__Standard values` | `Standard values` without `__` → 400 error; silent-write |

### JSON Rendering fields

| Display name | MCP field name | Notes |
|---|---|---|
| Component Name [shared] | `componentName` | PascalCase, must exactly match TSX filename |
| Parameters Template [shared] | `Parameters Template` | Item ID (GUID), never a path |
| Add Field Editor Button | `AddFieldEditorButton` | Set to `1` |
| Component Query | `ComponentQuery` | Single-line string, spaces only, no `\n` |
| Datasource Template | `Datasource Template` | Full Sitecore path, never GUID. Silent-write. |
| Datasource Location | `Datasource Location` | Dynamic query pattern. Silent-write. |

### Silent-write fields

These write successfully but return empty `updatedFields`. Not a failure — verify in Content Editor.

| Field | Item type |
|---|---|
| `__Masters` | Folder template SV, datasource folder instance |
| `__Standard values` | Template items (linking to SV) |
| `Renderings` | Available Renderings Page Content — also silent-READ |
| `Datasource Template` | JSON Rendering |
| `Datasource Location` | JSON Rendering |

---

## Available Renderings

Path: `<siteCollection>/<siteName>/Presentation/Available Renderings/Page Content`

**CRITICAL:** `Renderings` field is silent-write AND silent-read — MCP cannot read the current value.

1. Ask user for current value (or use manifest `lastKnownValue`)
2. **Concatenate**: `<existing>|{NEW-GUID}` (uppercase, braces, pipe)
3. **NEVER replace** — overwriting removes all other components from Pages editor

---

## Insert Options

Set on BOTH:
1. Folder template `__Standard Values` → `__Masters` = datasource template
2. Datasource folder **instance** → `__Masters` = datasource template

Without step 2, authors can't create items in the folder.

For list components, parent SV `__Masters` = child template.

---

## ComponentQuery Pattern

**Always use** `field(name: "...")` — **never** `... on TemplateName`.

```graphql
query Name($datasource: String!, $language: String!) {
  datasource: item(path: $datasource, language: $language) {
    title: field(name: "Title") { jsonValue }
    children {
      results {
        id
        cardTitle: field(name: "CardTitle") { jsonValue }
        cardImage: field(name: "CardImage") { jsonValue }
      }
    }
  }
}
```

Rules:
- Must be single-line when stored in MCP (no `\n`)
- Use `field(name: "ExactSitecoreFieldName")` with PascalCase
- Use camelCase GraphQL aliases: `cardTitle: field(name: "CardTitle")`
- Always include `id` in children results
- Always wrap with `{ jsonValue }`
- Template name fragments (`... on`) silently fail in shared XM Cloud instances

---

## Datasource Location Pattern

```
query:$site/*[@@name='Data']/*[@@templatename='<FolderTemplateName>']|query:$sharedSites/*[@@name='Data']/*[@@templatename='<FolderTemplateName>']
```

---

## Image Field Format (Content Hub DAM)

When using Content Hub as the DAM, Image fields use the DAM format with `src`, `dam-id`, `dam-content-type`, and `thumbnailsrc` attributes:

```xml
<Image src="https://<CH_HOST>/api/public/content/<assetId>-<name>?v=<versionHash>"
       dam-id="<assetIdentifier>"
       width="<width>" height="<height>"
       alt="Description"
       dam-content-type="Image"
       thumbnailsrc="https://<CH_HOST>/api/gateway/<assetId>/thumbnail" />
```

**`width` and `height` are REQUIRED** — without them, Next.js `Image` component throws: `Image with src "..." is missing required "width" property.`

**MCP field update:**
```
update_fields_on_content_item(itemId, {
  "HeroImage": '<Image src="https://host/api/public/content/84088-hero?v=abc" dam-id="xyz" width="1200" height="600" alt="Hero" dam-content-type="Image" thumbnailsrc="https://host/api/gateway/84088/thumbnail" />'
})
```

The `upload-to-content-hub.mjs` script produces the `imageFieldXml` value ready for direct use.

**Content Hub upload pipeline (5 steps per image):**
1. `POST /api/v2.0/upload` — request upload URL
2. `POST /api/v2.0/upload/process` — upload file binary
3. `POST /api/v2.0/upload/finalize` — get `asset_id` + `asset_identifier`
4. `POST /api/entities/{id}/lifecycle/approve` — auto-approve
5. `POST /api/entities` (M.PublicLink) — create public link for working URL

**Credentials:** stored in `docs/ai/config/credentials.local.yaml` (gitignored)

**Legacy format (XM Cloud Media Library without DAM):**
```xml
<image mediaid="{3F2504E0-4F89-11D3-9A0C-0305E82C3301}" />
```
Use this only when Content Hub is not connected and images are in XM Cloud Media Library directly.

---

## Named Exports

- Named exports only (`export const Default`), never `export default`
- `Default` is mandatory and must be first export
- Export name must exactly match Variant Definition item name (case-sensitive)
- Include a non-exported empty-state fallback component
- Props must extend `ComponentProps` from `lib/component-props`
- Use `params.styles` and `params.RenderingIdentifier` in wrapper element
- All Sitecore fields must use SDK editable helpers (`Text`, `RichText`, `NextImage`, `Link`)

---

## Edit-Mode Visibility

```tsx
const isEditing = page?.mode?.isEditing;
{(fields.Title?.value || isEditing) && <Text field={fields.Title} tag="h1" />}
```

---

## Collision-Prone Field Names (avoid in templates)

`icon`, `id`, `name`, `path`, `url`, `template`, `parent`, `children`, `language`, `version`, `displayName`

Use descriptive names instead: `CardTitle`, `SectionTitle`, `HeroImage`, `PrimaryLink`.

---

## Component Type Checklist

### Simple
- Datasource template + SV (with base templates)
- Folder template + SV (`__Masters` → datasource template)
- Datasource folder (insert options on instance)
- Example item
- Rendering Parameters template
- Rendering (NO ComponentQuery)
- Available Renderings registration

### List
- Parent template + SV (with base templates, `__Masters` → child, inherits `_HorizonDatasourceGrouping`)
- Child template + SV (with base templates)
- Folder template + SV (`__Masters` → parent template)
- Datasource folder (insert options on instance)
- Example parent + child items
- Rendering Parameters template
- Rendering (WITH ComponentQuery)
- Available Renderings registration

### Context-only
- NO datasource template, folder, or ComponentQuery
- Rendering Parameters template
- Rendering (empty Datasource Template/Location/ComponentQuery)
- Available Renderings registration
- May use Content Resolver (see `sitecore-content-resolvers.md`)

---

## Path Derivation

From `docs/ai/config/project.yaml`:

| Variable | Derivation |
|---|---|
| `dataRoot` | `/sitecore/content/<siteCollection>/<siteName>/Data` |
| `projectFoldersRoot` | `projectTemplatesRoot` + `/Folders` |
| `headlessVariantsRoot` | `/sitecore/content/<siteCollection>/<siteName>/Presentation/Headless Variants` |
| `renderingParamsRoot` | `projectTemplatesRoot` + `/Rendering Parameters` |

| Item type | Path pattern |
|---|---|
| Datasource template | `projectTemplatesRoot/Components/<Category>/<Name>` |
| Child template | `projectTemplatesRoot/Components/<Category>/<ChildName>` |
| Folder template | `projectFoldersRoot/<FolderName>` |
| Datasource folder | `dataRoot/<ComponentNamePlural>` |
| Rendering | `renderingsRoot/<Category>/<Name>` |
| Rendering Parameters | `renderingParamsRoot/<Category>/<Name>` |
| Variants container | `headlessVariantsRoot/<ComponentName>` |

---

## Source of Truth Priority

1. Repo rules: `docs/ai/rules/*.md`
2. Shared skills: `docs/ai/skills/*.md`, `docs/ai/skills/shared/*.md`
3. This reference: `docs/ai/reference/sitecore-rules.md`
4. MCP tool reference: `docs/ai/reference/sitecore-marketer-mcp-reference.md`
5. Official Sitecore docs: via `sitecore-documentation-docs` MCP
