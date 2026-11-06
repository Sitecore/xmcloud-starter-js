# Design Studio and Atoms — handoff

Goal: let this rendering host take part in SitecoreAI Design Studio.

- **Now:** make the existing code components work well with Design Studio.
- **Later:** support Content SDK **Atoms**. Marketers and the Design Studio AI compose low-code
  components from our brand-aware building blocks, with no code change and no redeploy.

**Read first:** `docs/ai/reference/design-studio-atoms.md`. It holds the platform facts, how atoms
work end to end (§2.3), the proposed catalog (§5) and the risks (§6), each with a source. This handoff
only tracks status, decisions and next steps. Keep facts in the reference doc.

## Status (2026-10-28)

- Research done and written up in the reference doc. No code, config or Sitecore item has changed.
- Atoms are **beta only**:
  - npm tag `beta.atoms`, version `3.0.0-beta.atoms.20261021204512`
  - `Sitecore/content-sdk` branch `release/betas/atoms`
  - Not in the public docs. No Sitecore starter kit uses them.
- The project is on Content SDK `2.4.1` (GA), which is enough for Design Studio activation (2.3+).

## Decisions needed (owner: user)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | Variants installed by Design Studio | (a) accept the `<Component>.<Variant>.tsx` files that Install writes; (b) fold them into the named-export file | Record it in ADR 0013 before anyone installs a DS variant |
| D2 | Start the beta spike? | Only after Sitecore confirms low-code / "Hosted" components are enabled for our organisation | Ask Sitecore first (Q1 below) |
| D3 | Who owns the atom catalog | Framework (`main`), or per-client demo branches | Framework owns the atoms; clients only re-skin through `--brand-*` |

## Next steps

### Track A — GA, on a feature branch from `main`, PR per `.github/DMZ-WORKFLOW.md`

1. **ADR 0013, Design Studio variant policy (D1).** Write it in `docs/adr/`.
   - If the policy is (a), update the `sitecore-add-variants` skill and AGENTS.md "React" rule, then
     run `npm run agents:sync`.
   - If it is (b), add a step to the `sitecore-add-variants` skill.
   - *Done when* the ADR is merged and `npm run agents:check` passes.
2. **Design-token export.** Turn `docs/ai/themes/<client>.theme.yaml` into a JSON file Design Studio
   accepts for variant generation (colour, font and radius tokens, named after `--brand-*`). Add it as
   a script under `tools/` or a step in `sitecore-extract-theme`.
   - *Done when* the JSON is generated for the Sitecore theme, uploaded in DS, and an AI variant
     prompt that names a token produces on-brand output.
3. **Preview values.** For each `uiim` component that previews empty in Design Studio, add standard
   values to its datasource template through the marketer MCP. Update the manifest as you go.
   - *Done when* every component in `docs/ai/catalog/component-registry.yaml` previews with content
     in DS Inspect mode.

### Track B — beta spike (only after D2)

Use a branch `spike/atoms-beta` from `main`. **Never merge or push it to `main` or `dmz`.**

1. Upgrade all `@sitecore-content-sdk/*` packages to the `beta.atoms` tag and pin exact versions. Add
   `zod@^4` and `@tailwindcss/node@^4`. Let npm update the lock file.
2. Copy the wiring from
   `content-sdk/packages/create-content-sdk-app/src/templates/nextjs-app-router` (beta branch):
   - `src/atoms/index.tsx`
   - `atomsConfig` in `src/Providers.tsx`
   - `instrumentation.ts` and `instrumentation-node.ts`, with
     `registerTailwindCssCompiler('src/app/globals.css')`
   - `serverExternalPackages: ['@tailwindcss/node']`
   - the `atoms.validation` block in `sitecore.cli.config.ts`
   - the `sitecore-tools:atoms:*` scripts, run before `dev` and `build`
   - `!.sitecore/atoms.lock.json` in `.gitignore`
3. Build 5 or 6 atoms from the reference doc §5: `Section`, `Stack`, `Heading`, `Body`, `Media`,
   `CtaButton`. Each wraps `src/components/ui/*` and the SDK helpers and is styled through `--brand-*`.
   Run `npm run sitecore-tools:atoms:update`.
   - *Done when* `npm run build` passes with validation on.
4. Deploy the spike to a non-demo environment. Ask before changing `xmcloud.build.json`. In Design
   Studio, generate one low-code component and activate it, then add it to a page in Page builder.
   - *Done when* each of these is observed and written down in the spike notes:
     - DS receives the catalog
     - the Document renders in preview
     - the component renders on a published page with styled Tailwind classes
     - fields are inline-editable in Pages
     - switching variants works (check the `fieldNames` vs `FieldNames` observation, reference §6 #8)
5. Write the findings into the reference doc (turn 🔶 into ✅ or ❌) and record the answers to Q1–Q4.

### Track C — adoption (after GA and a Sitecore Starter port)

1. Port through `docs/adr/upstream-sync-runbook.md`. Never cherry-pick beta code.
2. Write an ADR covering when to use atoms vs code components, catalog versioning, the `legacy` policy,
   and `breakOnError: true` in CI.
3. Add a `sitecore-atoms` skill (adapt the SDK's `content-sdk-atoms-*` skills) and a router row in
   AGENTS.md, then run `npm run agents:sync`.
4. Add a `hosted` component kind to `component-registry.yaml` and the Sitecore manifest. Record the
   component ID, `ComponentRef` paths and variants.
5. Optional: let `sitecore-build-demo` create low-code components through the Components API.

## Open questions for Sitecore

- **Q1.** Are low-code / Hosted components (Design Studio `isLowCode` mode) available to our
  organisation, and when will they be GA?
- **Q2.** How are low-code Documents promoted between environments and rolled back? Components API v1
  has no delete and no revert.
- **Q3.** Will Content SDK 3.0 be the GA vehicle, and will the starter kits ship `src/atoms`?
- **Q4.** How does Sitecore site theming (`theming.mode: 'site'`) relate to the brand kits and DS
  design tokens? We use `--brand-*`.

## Gotchas already found

- The CLI loads **only** `src/atoms/index.ts(x)` and needs a named `catalog` export. It loads the file
  with `tsx`, so check that the `@/` aliases resolve; if they don't, split it into `catalog.ts` and
  `registry.tsx`.
- Atoms are **not** registered in `.sitecore/component-map*`. They are registered through
  `atomsConfig`. Our `src/components/atoms/**` exclusion is a separate Sitecore Starter convention.
- The DS Install command runs `npx shadcn add` and resolves aliases through `components.json`. Ours
  uses `utils: @/lib/utils`; the Sitecore Starter uses `@/lib/atoms-utils`.
- Saved Documents depend on atom prop names. Change schemas in a backward-compatible way and retire
  atoms with `legacy: true` rather than deleting them.

## Recreating the source checkout

The research used temporary clones, which are not kept:

```bash
git clone --filter=blob:none https://github.com/Sitecore/content-sdk.git && cd content-sdk
git checkout origin/release/betas/atoms   # atoms code, templates, skills, .changeset/*atoms*
npm view @sitecore-content-sdk/nextjs dist-tags   # check for a newer beta, or GA
```
