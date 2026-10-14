# Sitecore create page template

Use this skill when creating a new Sitecore XM Cloud **page template** (route template) that inherits from an existing base page template and adds page-type-specific fields.

## Trigger hints
Use this skill when:
- the user wants a new page type (Article, Event, Case Study, Product, etc.)
- the request involves creating a route template with custom fields
- the user says "create a page template", "new page type", "article template", "event page"
- a page-type orchestrator skill (e.g., `sitecore-create-article-page`) delegates template creation here

## Do not use this skill when
- the request is about a datasource component template (use `sitecore-create-simple-component` or `sitecore-create-list-component`)
- the request is about rendering parameters only
- the request is about modifying an existing page template's presentation (use partial designs directly)

---

## Load first
- `docs/ai/config/project.yaml`
- `docs/ai/reference/sitecore-rules.md`
- `docs/ai/reference/sitecore-marketer-mcp-reference.md`
- `docs/ai/manifests/sitecore-manifest.yaml`
- `docs/ai/skills/sitecore-maintain-manifest.md`
- `docs/ai/catalog/page-template-registry.yaml`

---

## Inputs to collect

- `pageTypeName` — PascalCase name for the page template (e.g., `ArticlePage`)
- `templateSectionName` — name for the new template section (e.g., `Article Data`)
- `baseTemplatePath` — path or ID of the base page template to inherit from (resolved via MCP)
- `fields` — list of field names, types, and purposes
- `sharedDataTemplates` — optional list of shared data templates to create (e.g., Person)
- `contentTreeParent` — where pages of this type will be created (e.g., `/Home/Articles`)
- `insertOptions` — whether to set insert options on the parent page

---

## Required workflow

1. Read `docs/ai/config/project.yaml` for project paths.
2. Read `docs/ai/manifests/sitecore-manifest.yaml` for existing state.
3. Check `docs/ai/catalog/page-template-registry.yaml` for the page type definition.
4. If the page template already exists in the manifest with `status: complete`, confirm with user before re-creating.
5. If `status: partial` or `failed`, resume using recorded item IDs.
6. Before implementation, show:
   - page type name and inheritance
   - field schema
   - shared data templates (if any)
   - content tree structure
   - plan
7. Then implement.

---

## Implementation steps

### Step 1 — Resolve base template

Use MCP to find the base page template. This is the route template that existing pages use.

Common approach:
1. Get the Home item via `get_content_item_by_path`
2. Read its `__Template` field to find the base page template ID
3. Verify the base template has the expected standard fields (Title, metadata, OG, etc.)

Record the base template ID in the manifest.

### Step 2 — Create shared data templates (if any)

For each shared data template (e.g., Person):

1. Create a template folder under `projectTemplatesRoot/Data/` if it doesn't exist
2. Create the template item (using Template template ID `ab86861a-6030-46c5-b394-e8f99e8b87db`)
3. Set `__Base template` to `{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}` (Standard Template + Grid Parameters)
4. Create template section
5. Create template fields with explicit `Type` set on each
6. Create `__Standard Values` (name=`__Standard Values`, parentId=template ID, templateId=template ID)
7. Create data folder under `dataRoot/` (e.g., `/Data/People`)
8. Create a folder template if needed, with insert options pointing to the data template
9. Set insert options on the data folder instance

Verify each item after creation.

### Step 3 — Create the page template

1. Create the template item under `projectTemplatesRoot/Page Types/` (or similar grouping)
   - Template ID: `ab86861a-6030-46c5-b394-e8f99e8b87db`
2. Set `__Base template` to: `<baseTemplateId>` (the resolved base page template)
   - This inherits all standard route fields, placeholder settings, etc.
3. Create the template section (e.g., "Article Data")
4. Create each template field with explicit `Type`
   - For Droptree fields, set `Source` to the data folder path (e.g., `/sitecore/content/main/main-website/Data/People`)
5. Create `__Standard Values`:
   - `name = "__Standard Values"`
   - `parentId = page template ID`
   - `templateId = page template ID`

### Step 4 — Set up content tree

1. Resolve the parent page path (e.g., `/Home/Articles`)
2. If the parent page doesn't exist, create it using the base page template
3. Set insert options on the parent page to include the new page template
   - Read current `__Masters` field on the parent
   - Append the new page template ID

### Step 5 — Update Layout.tsx RouteFields

Add the new route fields to the `RouteFields` interface in `src/Layout.tsx`:
- Import any new field types needed
- Add each field with its TypeScript type
- Use optional fields (`?`) for all new additions

### Step 6 — Update manifest

Record in `docs/ai/manifests/sitecore-manifest.yaml`:
- Page template item ID and path
- Template section and field IDs
- `__Standard Values` ID
- Shared data template IDs (if any)
- Data folder IDs
- Content tree parent page ID
- Status: `partial` during creation, `complete` after verification

---

## Verification checklist

- [ ] Base template resolved and recorded
- [ ] Page template created and inherits from base
- [ ] Template section exists with correct name
- [ ] All fields exist with correct `Type`
- [ ] Droptree fields have correct `Source` set
- [ ] `__Standard Values` created and based on owning template
- [ ] Shared data templates created (if any) with fields, section, `__Standard Values`
- [ ] Data folders created with insert options
- [ ] Content tree parent page exists with insert options set
- [ ] `Layout.tsx` RouteFields updated
- [ ] Manifest updated

---

## Output format

Before implementation:
1. page type name and inheritance chain
2. field schema table
3. shared data templates (if any)
4. content tree structure
5. plan

After implementation:
1. MCP actions performed
2. items created with IDs
3. files changed
4. verification results
5. manifest entry
