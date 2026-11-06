# SitecoreAI Design Studio and Atoms — research and integration approach

Researched 2026-10-28 against official Sitecore docs, the Sitecore API catalog, and the source of
`Sitecore/content-sdk` and `Sitecore/xmcloud-starter-js`. Each claim cites its source. Anything marked
**(inference)** is my reading of the code, not something Sitecore documents.

---

## TL;DR

1. **Design Studio** (GA since Nov 2025) is SitecoreAI's component workspace. You can browse and inspect
   components, generate AI variants and new components, model content types, set availability, and
   **activate** a component. The output today is **code**: you install it into the repo (copy it, or run
   `sitecore-tools project component add`, which wraps `shadcn add`), then redeploy.
2. **"Atoms" means two different things:**
   - **Generic Atomic Design.** Sitecore's Accelerate Cookbook says to keep reusable non-rendering
     building blocks in `src/atoms/`, outside the component factory.
   - **Content SDK Atoms**, a **beta** feature (npm tag `beta.atoms`, `3.0.0-beta.atoms.*`, latest
     2026-10-21). The rendering host publishes a typed **catalog** of atoms (Zod schemas, built on
     Vercel's `json-render`). Design Studio and its AI then compose those atoms into **low-code
     components**. Each is stored as a JSON **Document** on Sitecore's side and rendered at runtime by the
     host's **registry**, so a new component needs **no code install and no redeploy**.
3. The beta is not in the public docs. No Sitecore starter kit has adopted it yet; they only carry
   preparatory changes (shadcn `components.json` and exclusion of `src/components/atoms/**` from the
   component map). The only public trace of the server side is the Components API: an `atoms` payload on
   `model-suggestion`, and `DraftType: Code | Hosted`.
4. **Recommendation:** treat this as two tracks.
   - **Now (GA):** make the existing code components Design Studio-friendly, and decide how installed
     variants fit the repo conventions.
   - **Spike on a throwaway branch (beta):** wire `src/atoms` with a small, brand-aware catalog that wraps
     the shadcn primitives and SDK field helpers already in this repo. Confirm whether our tenant exposes
     the low-code mode.
   - **Adopt for real only** after the Content SDK release is GA and the Sitecore Starter has ported it,
     using the normal sync runbook (ADR 0010).

---

## 1. Design Studio — what is GA today

| Capability | Facts | Source |
|---|---|---|
| Purpose | A central interface to visualise and test components and forms, compare variants side by side, experiment outside a site, and generate variants with AI | [Design studio](https://doc.sitecore.com/sai/en/users/sitecoreai/design-components/design-studio.html) |
| AI variants | Admin / Advanced roles. Prompts, up to 3 reference images, and a **design-token JSON file** (e.g. a Figma export) referenced by token name | [Generate variants](https://doc.sitecore.com/sai/en/users/sitecoreai/design-components/design-studio/generate-variants-of-a-component-with-ai.html), [changelog 2025-12-14](https://developers.sitecore.com/changelog/sitecoreai/14122025/smarter-variant-generation-in-design-studio) |
| AI new components | Generates the presentation **and** a content model from a prompt, or a presentation only from an existing model | [Generate a new component](https://doc.sitecore.com/sai/en/users/sitecoreai/design-components/design-studio/generate-a-new-component-using-ai.html), [changelog 2026-10-08](https://developers.sitecore.com/changelog/sitecoreai/08102026/create-smarter-components-faster-with-design-studio) |
| Modeling | Assign fields or content models; clone a model (independent) or inherit one (linked); set availability per site / template / placeholder | [Model a component](https://doc.sitecore.com/sai/en/users/sitecoreai/design-components/design-studio/model-a-component-in-design-studio.html) |
| Activation | Required to reach Page builder. Activation needs Content SDK **2.3**; earlier versions "save" instead. Name and section are fixed once activated, and activated variants cannot be removed in Design Studio | [Activate](https://doc.sitecore.com/sai/en/users/sitecoreai/design-components/design-studio/activate-a-component.html), [Cookbook: creating components with AI](https://developers.sitecore.com/learn/accelerate/sitecoreai/implementation/developer-experience/creating-components-with-ai) |
| Install | Copy the code, or click **Install** for a CLI command, then **redeploy**. Previews update only at deploy time | [Install a component](https://doc.sitecore.com/sai/en/users/sitecoreai/design-components/design-studio/install-a-component.html) |
| Code extraction | At deploy, components listed in `.sitecore/component-map.ts` and `package.json` are sent to SitecoreAI. On by default; opt out with `disableCodeGeneration: true` | [Code extraction](https://doc.sitecore.com/sai/en/developers/content-sdk/20/en/understanding-code-extraction-in-the-design-studio.html) |
| Import map | `writeImportMap({ paths })` writes `.sitecore/import-map.{server,client}.ts`, which tells generated code what it may import | [Import maps](https://doc.sitecore.com/sai/en/developers/content-sdk/20/understanding-import-maps.html) |
| Components API | REST: create components and drafts, AI suggestions, activation (one-way, deletes the draft), no delete in v1 | [Changelog 2026-09-25](https://developers.sitecore.com/changelog/sitecoreai/25092026/new-sitecoreai-apis-now-available%3A-components%2C-content-types%2C-and-content-items), [API docs](https://api-docs.sitecore.com/sai/components-api) |

**How Install works in code.** `sitecore-tools project component add <id> --token …` fetches the variant
spec. If the base component is already registered, it writes `<Base>.<Variant>.tsx` next to it, runs
`npx shadcn@^3.4.2 add "<edge>/authoring/api/v1/components/generated/<id>?…"`, and then regenerates the
component map. Source: `packages/cli/src/scripts/project/component/add.ts` (`Sitecore/content-sdk`, on
`dev`, so this is GA). The project's `components.json` therefore matters: shadcn resolves `ui` / `utils`
aliases through it.

> ⚠️ **Convention clash.** This repo keeps variants as **named exports in one file** (AGENTS.md). Design
> Studio Install writes **separate `<Component>.<Variant>.tsx` files**. Content SDK supports that layout:
> the map generator has `includeVariants`
> (`packages/content/src/tools/templating/components.ts`). Either accept that layout for DS-installed
> variants, or fold installed code into the named-export file by hand.

---

## 2. Content SDK Atoms (beta) — how it works

Source: branch `release/betas/atoms` of `Sitecore/content-sdk` (head `5ca9fb53d`, 2026-10-21). Changeset
`.changeset/jss-8379-atomic-design-atoms.md` describes it as *"Introduce Atoms — the Atomic Design
foundation for building low-code components with Design Studio."*

### 2.1 Building blocks

| Piece | What it is | Where |
|---|---|---|
| `defineAtomsCatalog({ version?, stylingSolution?, components, actions })` | A schema of atoms. Each component has Zod `props`, a `description` (fed to the AI), `slots`, `allowedChildren` / `allowedParents`, an optional `version`, and `legacy` | `packages/react/src/atoms/define-atoms-catalog.ts`, `types.ts` |
| `defineAtomsRegistry(catalog, { components, actions })` | React implementations of the catalog. Each renderer gets `{ props, children, emit, on, bindings }`. A client surface (`'use client'`) | `define-atoms-registry.ts` (re-export of json-render's `defineRegistry`) |
| Field schemas | `textFieldSchema`, `richTextFieldSchema`, `imageFieldSchema`, `linkFieldSchema`, `dateFieldSchema`, `fileFieldSchema`, plus `withPropMeta`. They mirror SDK field shapes and tag the props with Design Studio control / field-type hints | `field-schemas.ts`, `schema-utils.ts` |
| `atomsConfig` on `SitecoreProvider` | `{ catalog, registry, navigate?, compileCssAction? }`. **This is how atoms are registered — they are not added to the component map** | `SitecoreProvider.tsx`, template skill `content-sdk-atoms-create` |
| Document | A json-render "flat spec": `{ name, root, elements: { key: { type, props, children } }, state }`. At render time the SDK injects `state.fields` (Sitecore fields) and `state.params` (rendering params). Props bind with `{ "$state": "/fields/…" }`, `$cond`, `$bindState`, and similar | `packages/content/src/atoms/types.ts`, `create-ncc.test.tsx` |
| Runtime render | A rendering whose params include **`ComponentRef`** is routed to `StudioComponentServerWrapper`. It picks the path by variant (`FieldNames`, else `default`), fetches the Document from `<edge>/mms/<path>`, merges fields and params, compiles CSS, and renders it through `createNCC` | `placeholder-utils.tsx`, `StudioComponentServerWrapper.tsx` |
| Design Studio preview | `DesignLibraryApp` → `DesignLibraryLowCodeComponent` when `page.mode.designLibrary.isLowCode`. It posts `atoms:catalog`, receives `component:atoms:preview` Documents, validates them (`validateSpec`), and returns errors on `atoms:error` (`type: 'validation'`) so the AI can repair them | `DesignLibraryLowCodeComponent.tsx`, `design-library-bridge/*` |
| Editing chrome | In editing mode every atom is wrapped in `<code type="text/sitecore" chrometype="atom">`, which makes it selectable and draggable in Pages and Design Studio with no developer work | `with-editing-chrome.tsx` |
| Styling | `stylingSolution: 'tailwind' \| 'inline-css'` (default `inline-css`). For Tailwind, `registerTailwindCssCompiler('src/app/globals.css')` in `instrumentation-node.ts` compiles class names that exist only in runtime Documents (server-side in production, through a server action in the DS preview) | `packages/nextjs/src/instrumentation/tailwind-compiler.ts`, `.changeset/jss-9810-atoms-styling.md` |
| Lock file | `.sitecore/atoms.lock.json` stores a schema hash per atom. `sitecore-tools project atoms validate` runs on `dev`/`build` (`atoms.validation.breakOnError`), and `… atoms update` regenerates the file. The CLI reads **only `src/atoms/index.ts(x)`** and requires a named `catalog` export | `packages/cli/src/scripts/project/atoms/*` |
| `legacy` flag | Keeps an atom or action renderable, but the AI excludes it from new generations | `.changeset/jss-10436-*`, `jss-10470-*` |
| Site theming (same beta) | `theming: { mode: 'site' }` in `sitecore.config` adds `<edge>/authoring/api/v1/themes/delivery/<site>/web-css` and the `sc-ds-theme` body class. Live `theme-update` preview arrives over postMessage | `packages/content/src/layout/theming.ts`, `editing/theme-preview.ts` |
| Agent skills | Starters ship `content-sdk-atoms-setup`, `-create`, and `-maintain` | `packages/create-content-sdk-app/src/templates/nextjs-app-router/.agents/skills/` |

### 2.2 Data flow (inference from code)

```
Rendering host                              SitecoreAI
──────────────                              ──────────
src/atoms catalog ──(atoms:catalog event)──▶ Design Studio AI composes atoms
                                             → Document (JSON) stored in "MMS"
                                             → component with a "Hosted" draft type (inference)
                                             → rendering item with param ComponentRef=<mms path>|…
Page request ─ layout has ComponentRef ─▶ fetch <edge>/mms/<path> ─▶ createNCC(document, registry)
                                         └ Tailwind compiles the Document's classNames → <style>
```

The Components API corroborates this. `POST /components/drafts/{id}/model-suggestion` accepts *"Raw atoms
payload from Rendering Host, representing small reusable UI building blocks"*, and `DraftType` is
`"Code" | "Hosted"`
([model-suggestion](https://api-docs.sitecore.com/sai/components-api/components/createdraftmodelsuggestion),
[update draft](https://api-docs.sitecore.com/sai/components-api/components/updatedraft)). The mapping
"Hosted = atoms Document" is my **inference**.

### 2.3 End-to-end walkthrough (example: an "Event Banner")

1. **Developer, once.** Define atoms in `src/atoms/index.tsx`. The catalog says what the AI may use;
   the registry renders it with our `ui/*` and SDK field helpers. Add `atomsConfig` on
   `SitecoreProvider`, register the Tailwind compiler, run `atoms:update`, and deploy.
2. **Marketer, in Design Studio.**
   - DS loads our host in low-code preview mode, and the host posts the catalog (`atoms:catalog`) ✅.
   - The AI returns a Document that only references catalog atoms, with props bound to fields, e.g.
     `"props": { "field": { "$state": "/fields/Title" } }` ✅ (format).
   - The host validates it, sends errors back on `atoms:error`, renders it with our atoms, compiles
     its classes, and wraps each atom in editing chrome ✅.
   - The marketer iterates, sets availability, and activates ✅ (documented). Sitecore stores the
     Document (served from `<edge>/mms/…`) and a rendering whose `ComponentRef` param points at it 🔶.
3. **Author, in Page builder.** Drags the component and fills a normal datasource item. Inline
   editing should work because atoms render fields through SDK helpers 🔶 (verify).
4. **Visitor, at runtime ✅.**
   - The layout has `params.ComponentRef`, so `StudioComponentServerWrapper` fetches the Document.
   - It injects `fields` and `params`, compiles CSS into `<style>`, and json-render walks the elements
     and calls our registry for each `type`.
   - The output is wrapped in `div.component {styles}#{RenderingIdentifier}`.
5. **Maintenance.**
   - Restyling an atom is a code deploy, and every low-code component that uses it updates.
   - A schema change makes `atoms validate` fail: run `atoms update` and bump `version`. Keep props
     backward-compatible, because saved Documents still use them.
   - Retire an atom with `legacy: true`.

✅ verified in SDK source or docs · 🔶 inference

### 2.4 Maturity

- npm dist-tags on 2026-10-28: `latest` is `2.4.1`, and `beta.atoms` is `3.0.0-beta.atoms.20261021204512`.
  It is a **major** version and pins `@json-render/*@0.20.0`; the starter template uses `zod@^4`.
- No public doc page mentions atoms. A search of the user-docs `llms.txt` and the Content SDK 2.x
  `llms.txt` found nothing.
- `Sitecore/xmcloud-starter-js` `main` has no `src/atoms`. It only has:
  - `components.json` `utils: "@/lib/atoms-utils"` (PR #602, #604, "Atoms util configuration" and
    "Validate Atoms Support for Alaris, Sync, and Solterra")
  - `src/components/atoms/**` excluded from the component map (#613)

  Our fork already ported that exclusion.

---

## 3. Where this project stands

| Aspect | Current state | Gap for atoms |
|---|---|---|
| Content SDK | `@sitecore-content-sdk/nextjs ^2.4.1` (`docs/ai/config/upstream-sync.yaml`) | Needs `3.0.0-beta.atoms` (core, content, react, nextjs, cli move together) |
| Next / React | Next 16.4, React 19.3 | OK (peer: next ^16.2, react ^19.2.1) |
| zod | `^3.24.1`, not imported anywhere in `src/` | Needs zod 4. Low risk |
| Tailwind | v4, `src/app/globals.css` with `@import 'tailwindcss' source('../')` | Compatible with `registerTailwindCssCompiler('src/app/globals.css')`. Also removes the need for `@source inline(...)` safelists for Document classes |
| shadcn | `components.json` (`utils: @/lib/utils`) and `src/components/ui/{badge,button,card,input}` | These are natural atom implementations. The Sitecore Starter alias is `@/lib/atoms-utils`; keep ours unless Install needs theirs |
| Brand theming | `--brand-*` CSS variables (`docs/ai/reference/brand-variables.md`), generated per client by `sitecore-extract-theme` | Atoms should style through `--brand-*`, so AI-composed components get the client brand for free. Site theming (`theming.mode: 'site'`) is a parallel, Sitecore-managed token system. Decide later whether to map our tokens onto it |
| Providers / Layout | `Providers.tsx` passes `loadImportMap`. `Layout.tsx` uses `DesignLibraryApp` | Add `atomsConfig`. `DesignLibraryApp` already handles the low-code branch once the SDK is upgraded |
| Component map exclusions | Already excludes `src/components/atoms/**`, `**/*.schema.ts`, `src/components/ui/**` | `src/atoms/` sits outside `src/components`, so no change is needed |
| `.gitignore` | `.sitecore/*` ignored, with exceptions for the component maps | Add `!.sitecore/atoms.lock.json` |
| Agent tooling | Skills route requests to code components plus marketer MCP items. Manifest and registries track code components | Low-code components live as Documents in SitecoreAI. Neither the manifest, `component-registry.yaml`, nor the MCP has a concept for them yet |

---

## 4. Recommended approach

### Track A — now, GA only (no SDK change)

1. **Choose a variant-install policy** (ADR-worthy):
   - accept `<Component>.<Variant>.tsx` files from Design Studio Install, or
   - require folding them into the named-export file.

   Either way, Variant Definition items must match.
2. **Feed Design Studio the client brand.** Generate a design-token JSON from
   `docs/ai/themes/<client>.theme.yaml`, which DS accepts as a variant-generation input (changelog
   2025-12-14). This could be a small script or an extension of `sitecore-extract-theme`. SEs can then
   generate on-brand AI variants live in a demo.
3. **Make components preview well.** Use standard values on datasource templates, or DS visualization
   values (`/sitecore/system/Settings/Foundation/Design Library/Data Sources`, per the
   [XCentium write-up](https://www.xcentium.com/blogs/visualize-components-in-the-sitecoreai-design-studio)).
4. Keep `writeImportMap({ paths: ['src/components'] })`. It already exposes `src/components/ui` to
   generated code.

### Track B — beta spike on a throwaway branch (never merged)

Goal: prove the end-to-end loop in our tenant: catalog → DS low-code generation → Page builder →
render. **First check with Sitecore whether low-code / Hosted components are enabled for our
organisation.** The SDK side is useless without it.

1. Upgrade the `@sitecore-content-sdk/*` packages to `beta.atoms`, add `zod@^4` and `@tailwindcss/node@^4`,
   and set `serverExternalPackages: ['@tailwindcss/node']`.
2. Copy the wiring from `create-content-sdk-app/src/templates/nextjs-app-router`:
   - `src/atoms/index.tsx`
   - `atomsConfig` in `src/Providers.tsx` (with `compileCssForDocumentAction` and `router.push`)
   - `instrumentation.ts` and `instrumentation-node.ts`
   - `atoms.validation` in `sitecore.cli.config.ts`
   - the `sitecore-tools:atoms:*` scripts, prepended to `dev`/`build`
   - the `.gitignore` exception for the lock file
3. Build a small catalog (below), then run `npm run sitecore-tools:atoms:update` and commit the lock
   file.
4. Verify:
   - DS receives the catalog (`atoms:catalog`)
   - AI-composed Documents render in preview and on a published page
   - Tailwind classes in Documents are styled
   - fields bound to atoms are **inline-editable** in Pages (inference: should work, because field
     objects with metadata flow into `state.fields` and atoms render through SDK helpers)

### Track C — real adoption (after GA and a Sitecore Starter port)

- Port it through `docs/adr/upstream-sync-runbook.md`, not by cherry-picking beta code.
- Write an ADR. Topics to decide:
  - atoms vs code components: when to use each (Cookbook rule: use code for behaviour, external data,
    or authoring controls a model can't express)
  - catalog ownership and versioning
  - when to set `legacy`
  - `breakOnError: true` in CI
- Adapt the SDK's three atoms skills into `.agents/skills/` (e.g. `sitecore-atoms`) and run
  `npm run agents:sync`. Add a router row.
- Extend `component-registry.yaml` and the manifest with a `hosted` kind: component ID, `ComponentRef`
  paths, and variants.
- For the demo builder: let `sitecore-build-demo` create low-code components through the Components
  API, in addition to code components. That gives the SE a "new component in minutes, no deploy" story.

---

## 5. Proposed atom catalog for this project

Design rules:

- **Wrap, don't duplicate.** Atom renderers call the existing `src/components/ui/*` and the SDK helpers
  (`Text`, `RichText`, `NextImage`, `Link`). This keeps the repo's editability non-negotiable: every
  field goes through an SDK helper.
- **Field props use the SDK field schemas** (`textFieldSchema()` and the others). Never invent field
  shapes (SDK skill `content-sdk-atoms-create`).
- **Use tokens, not colours.** Style variants are enums (`tone: 'default' | 'muted' | 'dark' | 'brand'`)
  mapped to `--brand-*`. Keep free-form `className` limited to layout atoms, so the AI cannot break the
  brand.
- **Descriptions are prompts.** Write them as instructions to the AI: when to use the atom, and where.
- **Constrain composition** with `allowedChildren` / `allowedParents`, e.g. `Section` → `Container` →
  layout → content.
- **Versioning:** set catalog `version` plus per-atom `version`. Retire atoms with `legacy: true` instead
  of deleting them; existing Documents still need them.

| Layer | Atoms | Implementation |
|---|---|---|
| Layout | `Section` (tone, spacing), `Container`, `Stack` (direction, gap, align), `Grid` (cols 1–4, responsive) | Tailwind and `--brand-bg` / `--brand-muted` |
| Text | `Eyebrow`, `Heading` (level, `textFieldSchema`), `Body` (`richTextFieldSchema`) | SDK `Text` / `RichText` with `font-heading` / `font-body` |
| Media | `Media` (`imageFieldSchema`, aspect, rounded) | `NextImage` (`SmartMedia` only if a video surface is wanted; see ADR 0005) |
| Action | `CtaButton` (`linkFieldSchema`, variant) | `ui/button` with `asChild` + SDK `Link` |
| Decorative | `Badge`, `Divider`, `Icon` (lucide name enum) | `ui/badge`, lucide |
| Containers | `Card` (slots: default) | `ui/card` |

Sketch (to validate on the spike branch):

```tsx
// src/atoms/index.tsx
import { z } from 'zod';
import {
  defineAtomsCatalog, defineAtomsRegistry,
  textFieldSchema, richTextFieldSchema, imageFieldSchema, linkFieldSchema,
} from '@sitecore-content-sdk/nextjs/atoms';
import { Text, RichText, NextImage, Link } from '@sitecore-content-sdk/nextjs';
import { Button } from '@/components/ui/button';

export const catalog = defineAtomsCatalog({
  version: '1.0.0',
  stylingSolution: 'tailwind',
  components: {
    Section: {
      description: 'Full-width page band. Always the outermost atom. Use tone "muted" to alternate sections.',
      props: z.object({ tone: z.enum(['default', 'muted', 'dark']).optional() }),
      slots: ['default'],
      allowedChildren: ['Stack', 'Grid', 'Card'],
    },
    Heading: {
      description: 'Editable section heading bound to a Sitecore text field.',
      props: z.object({ field: textFieldSchema(), level: z.enum(['h1', 'h2', 'h3']).optional() }),
    },
    CtaButton: {
      description: 'Primary or secondary call to action bound to a Sitecore link field.',
      props: z.object({ field: linkFieldSchema(), variant: z.enum(['default', 'secondary', 'outline']).optional() }),
    },
    // Stack, Grid, Body, Media, Badge, Card …
  },
  actions: {},
});

export const registry = defineAtomsRegistry(catalog, {
  components: {
    Section: ({ props, children }) => (
      <section className={props.tone === 'muted' ? 'bg-[var(--brand-muted)]' : 'bg-[var(--brand-bg)]'}>{children}</section>
    ),
    Heading: ({ props }) => <Text field={props.field} tag={props.level ?? 'h2'} className="font-heading" />,
    CtaButton: ({ props }) => (
      <Button asChild variant={props.variant ?? 'default'}><Link field={props.field} /></Button>
    ),
  },
});
```

To verify on the spike: the CLI loads this module with `tsx`. Check that `@/` path aliases and React
imports resolve under `sitecore-tools project atoms validate`. If they don't, split the module into
`catalog.ts` (no React) and `registry.tsx`, and re-export both from `index.tsx`.

---

## 6. Risks and open questions

| # | Item | Mitigation |
|---|---|---|
| 1 | **Beta, major version (3.0.0), undocumented.** APIs have changed between betas (e.g. the `className` restriction was added and then removed) | Spike only. Pin exact versions. Never merge to `main` or `dmz` |
| 2 | **Tenant feature availability.** Low-code / Hosted may be behind a flag | Ask Sitecore before starting Track B |
| 3 | Low-code components live **outside the repo** (Documents in MMS). Serialization, environment promotion, and rollback are unclear. The Components API v1 has no delete and no revert | Treat Documents as content. Ask Sitecore how they promote between environments |
| 4 | Runtime Tailwind compile on the request path (`@tailwindcss/node` native binaries, in-memory cache per process) | Measure TTFB on the editing host and the delivery host. Check that the deploy target supports native binaries |
| 5 | Our tooling (marketer MCP, manifest, `component-registry.yaml`) only understands code components | Track C extensions |
| 6 | Design Studio Install writes `<Base>.<Variant>.tsx`, which conflicts with the named-export convention | Track A, step 1 |
| 7 | Two theming systems: our `--brand-*` and Sitecore site theming (`theming.mode: 'site'`) | Keep `--brand-*`. Revisit when site theming is documented |
| 8 | `StudioComponentServerWrapper` reads `rendering.params.fieldNames` (lower-case) to pick a variant (**observation**; Sitecore usually sends `FieldNames`) | Check variant switching on the spike |

---

## Sources

**Official docs and API**
- Design studio and its sub-pages (generate variants, generate a new component, model, activate, install):
  https://doc.sitecore.com/sai/en/users/sitecoreai/design-components/design-studio.html
- Content SDK 2.x: code extraction, import maps, `llms.txt`:
  https://doc.sitecore.com/sai/en/developers/content-sdk/20/llms.txt
- Accelerate Cookbook:
  - Creating components with AI in Design Studio:
    https://developers.sitecore.com/learn/accelerate/sitecoreai/implementation/developer-experience/creating-components-with-ai
  - Component Design Best Practices (`src/atoms/` folder guidance):
    https://developers.sitecore.com/learn/accelerate/sitecoreai/pre-development/developer-considerations/component-design-best-practices
- Changelog:
  - 2025-11-10, 2025-12-14, 2026-02-25, 2026-04-22, 2026-09-25, and 2026-10-08:
    https://developers.sitecore.com/changelog
- Components API (model-suggestion `atoms`, `DraftType`): https://api-docs.sitecore.com/sai/components-api

**Source code**
- `Sitecore/content-sdk`, branch `release/betas/atoms` (`5ca9fb53d`):
  - `packages/react/src/atoms/*`
  - `packages/content/src/atoms/*`
  - `packages/react/src/components/DesignLibrary/{StudioComponentServerWrapper,StudioComponentWrapper,DesignLibraryLowCodeComponent}.tsx`
  - `packages/react/src/components/Placeholder/placeholder-utils.tsx`
  - `packages/nextjs/src/instrumentation/*`
  - `packages/cli/src/scripts/project/atoms/*`
  - `packages/create-content-sdk-app/src/templates/nextjs-app-router/**`
  - `.changeset/*atoms*`
- `Sitecore/content-sdk`, branch `dev`: `packages/cli/src/scripts/project/component/add.ts` (Install via
  shadcn)
- `Sitecore/xmcloud-starter-js`, branch `main`: commits `d8de384` (#602), `6cc2fc3` (#604), `e470778` (#613)
- npm: `npm view @sitecore-content-sdk/nextjs dist-tags` (2026-10-28)
- `vercel-labs/json-render` (`@json-render/core` and `@json-render/react`), the catalog/registry/spec
  engine underneath

**Secondary (used only for corroboration)**
- Miguel Minoldo, "SitecoreAI's new APIs move schema management into the automation layer"
- XCentium, "Visualize Components in the SitecoreAI Design Studio"
