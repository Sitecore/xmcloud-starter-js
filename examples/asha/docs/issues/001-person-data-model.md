# Issue 001: Person Data Model

**Label:** `ready-for-agent`

## Parent

PRD: Article Page Template (`docs/adr/prd-article-page-template.md`)

## What to build

Create the Person shared data template in Sitecore XM Cloud via MCP. This is a reusable data template for representing people (article authors, team members, testimonial subjects). The template lives under the project's Data templates path, not under Components, because it's shared across multiple content types.

The slice includes:
- A Person template with a "Person Data" section containing six fields: `personFirstName` (Single-Line Text), `personLastName` (Single-Line Text), `personJobTitle` (Single-Line Text), `personProfileImage` (Image), `personBio` (Rich Text), `personLinkedIn` (General Link)
- Base templates set to Standard Template + Grid Parameters
- `__Standard Values` for the Person template
- A Person Folder template with `__Standard Values` and insert options pointing to Person
- A People data folder under the site's Data root with insert options set on the folder instance
- An example Person item inside the People folder (for verification and demo use)
- Manifest updated with all item IDs and verification results

Use `docs/ai/config/project.yaml` for project paths. Use `docs/ai/manifests/sitecore-manifest.yaml` for lookups and state tracking. Follow `docs/ai/reference/sitecore-rules.md` for template creation rules and `docs/ai/reference/sitecore-marketer-mcp-reference.md` for MCP field names.

## Acceptance criteria

- [ ] Person template exists at `projectTemplatesRoot/Data/Person` with correct base templates
- [ ] "Person Data" section exists with all 6 fields, each with correct `Type` verified via MCP
- [ ] `__Standard Values` created for Person template (parentId = templateId = Person template ID)
- [ ] Person Folder template exists with `__Standard Values` and `__Masters` pointing to Person template
- [ ] People data folder exists at `dataRoot/People` with insert options set on the folder instance
- [ ] Example Person item created inside People folder with sample data (e.g., "Jane Smith")
- [ ] Manifest updated with all item IDs, verification status, and `status: complete`

## Blocked by

None - can start immediately
