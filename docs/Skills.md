# Skills: Capability-Style Grouping for the Starter Kits

This document groups starter-kit capabilities into named **skill areas** so developers and AI tools can map tasks to the right guidance. It is a high-level map only—not an API or schema. For concrete APIs and file paths, use the codebase and README.

---

- **How to use it:** Map the user’s task to one or more skill areas. Use the intent and common tasks to shape your answer. Do **not** infer API names, schemas, or file paths from this document—refer to the codebase or README for those. Treat “Hard Rules” and “Stop Conditions”.

---

## Skill Areas (High-Level)

### 1) Component Registration & Rendering

**Intent:** Register UI components so layout and editing can resolve and render them.

#### When to Use
- Adding a new Sitecore-driven component, or fixing “component not found.”
- Wiring a component to the CMS or updating the component map.
- Task involves which components render from layout or in the editor.

#### How to Perform
- Add the component under the starter’s `src/components` structure.
- Register it in the appropriate component map (server map for server components, client map for client components) so the layout pipeline can resolve it.
- Align component props with the data provided by the layout.
- Verify rendering in both preview and published (and, where applicable, editing) modes.

#### Hard Rules
- Every component rendered from Sitecore layout must be registered in a component map.
- Do not remove or rename registrations without updating layout and editing usage.
- Use the same component name in the map as in the layout.

#### Stop Conditions
- Component renders correctly from CMS-driven layout.
- Component is visible and editable in the editor (where applicable).
- No resolution or binding errors.

#### References
- Repository [README](../README.md), starter README, and `.sitecore/` component maps in the starter.

---

### 2) Component Data Strategy

**Intent:** Get page and layout data into the app and pass it to components in the correct way.

#### When to Use
- Wiring component props, passing data from the CMS, or integrating custom (BYOC) components.
- User asks how component data flows, where to fetch layout data, or how server vs client components receive props.

#### How to Perform
- Fetch page/layout data at the route level (e.g. catch-all page or layout) and pass it down as props.
- Use the starter’s field components to render editable content.
- Handle missing or optional fields safely.
- Keep server vs client boundaries clear: client components receive serializable props only.

#### Hard Rules
- Page and layout data must be fetched at the route (page/layout) level, not inside child components.
- Do not introduce duplicate fetches or fetch layout data inside components that are not the route.
- Client components must not receive non-serializable props (e.g. functions or class instances).

#### Stop Conditions
- Component receives correct data in preview and published (and editing) modes.
- No duplicate layout fetches; data flows from route to components as props.
- No serialization or server/client boundary errors.

#### References
- Repository [README](../README.md), starter catch-all route and layout files, and root AI/guidance docs (e.g. [CLAUDE.md](../CLAUDE.md)) for data-flow patterns.

---

### 3) Local Development & Configuration

**Intent:** Run a starter locally against XM Cloud and use the right configuration.

#### When to Use
- Setting up or debugging local dev, or configuring environment variables.
- User asks how to run the starter locally or which env vars are required.

#### How to Perform
- Copy the starter’s environment example file (e.g. `.env.remote.example`) to `.env.local` in the starter folder and set required variables.
- Install dependencies and run the dev server from the starter folder.
- Confirm preview (and, where applicable, editing) work against the connected XM Cloud environment.

#### Hard Rules
- Environment variables must never be committed; use `.env.local` (or equivalent) and keep it out of version control.
- Do not hardcode endpoints or secrets; use environment config only.
- Local dev should use the same data model and connectivity pattern as the repo docs describe.

#### Stop Conditions
Warnings that stop you from proceeding unless the following are met:
- Local app loads and displays content from the connected XM Cloud environment.
- Preview (and editing, where applicable) work correctly.
- No missing or incorrect environment variable errors.

#### References
- [How to Run a Next.js Starter Locally](../README.md#how-to-run-a-nextjs-starter-locally), starter README, and `.env.remote.example` in the starter folder.

---

### 4) Editing & Preview

**Intent:** Support in-context editing and preview so authors can edit and preview content correctly.

#### When to Use
- Enabling or fixing editing for a component, or ensuring preview/design-library behavior.
- User reports that fields are not editable, editor breaks, or preview does not match published.

#### How to Perform
- Use the starter’s editable field components for CMS-driven content.
- Keep markup and placeholders stable so the editor can select and edit fields.
- Ensure components render correctly in both editing and preview modes; avoid changing HTML structure around editable regions.

#### Hard Rules
- Components with editable fields must use the starter’s field components so the editor can attach to them.
- Do not alter the HTML structure around editable fields in a way that breaks editor selection or overlays.
- Client-only components in editor-critical regions can break editing; follow the starter’s server/client split.

#### Stop Conditions
- Author can select, edit, and save fields in the editor.
- Component drag/drop and placeholder behavior work as expected.
- Editing overlays and alignment are correct.

#### References
- Starter README, starter field components and placeholders, and [XM Cloud / Content SDK documentation](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html) for editing behavior.

---

### 5) Routing & Page Composition

**Intent:** Let the CMS drive which pages exist and how they are composed.

#### When to Use
- Changing routing, dynamic routes, or how pages are built from layout data.
- User asks how URLs map to Sitecore items or how to add a new page type.

#### How to Perform
- Use the starter’s catch-all (or equivalent) route so all CMS-defined paths are handled in one place.
- Rely on layout data for page composition; pass site and locale from route params where the starter expects them.
- Follow the starter’s pattern for 404 and error handling.

#### Hard Rules
- Do not create static routes that duplicate CMS-managed paths; routing must defer to layout data for composition.
- Catch-all (or equivalent) must remain the single entry point for CMS-driven routes in that starter.
- SPA or fallback routing must match the starter’s existing pattern.

#### Stop Conditions
- Sitecore-defined paths resolve and render from layout data.
- Navigation and dynamic routes work correctly.
- 404 and error pages behave consistently.

#### References
- Starter’s catch-all route (e.g. `app/[[...path]]/page.tsx` or `pages/[[...path]].tsx`), repository [README](../README.md), and layout/data fetch in that route.

---

### 6) Project Structure & Conventions

**Intent:** Keep the codebase consistent and easy to maintain.

#### When to Use
- Adding features, organizing files, or aligning with repo conventions.
- User asks where to put new components, how to name files, or how the starter is organized.

#### How to Perform
- Follow the starter’s folder layout (e.g. `src/components`, `src/app` or `src/pages`, `src/lib`).
- Use existing utilities and typing patterns from the starter.
- Keep naming and structure consistent with the rest of the starter (e.g. kebab-case for folders, PascalCase for components).

#### Hard Rules
- Do not reorganize the folder hierarchy without a clear reason; stay aligned with the starter’s structure.
- Avoid introducing a parallel or custom structure that duplicates starter internals.
- New components and files should follow the starter’s conventions and types.

#### Stop Conditions
- New code lives in the expected locations and follows existing patterns.
- Project structure remains recognizable and consistent with the starter.

#### References
- Repository [README](../README.md), starter README, and the `src/` layout in the starter (e.g. [CLAUDE.md](../CLAUDE.md) for conventions).

---

## Related Documents

- [README](../README.md) – Repository overview, how to run a starter locally, and getting started.
- [Getting Started](../README.md#getting-started-guide) – Prerequisites and first steps.
- [CLAUDE.md](../CLAUDE.md) – Project and coding context for AI (when present).

Ensure the README or Getting Started section links back to this document so developers and AI can discover it.
