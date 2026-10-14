# 0005 — SmartMedia for video-capable surfaces

## Status

Accepted — 2026-06-09

## Context

Content Hub public URLs used as Sitecore Image field values do **not** carry width/height intrinsics. `next/image` (which `ContentSdkImage` wraps) requires either a `width`/`height` pair, a `fill` parent, or those values in the field XML — otherwise it throws at render time.

Separately, several demo surfaces (hero backgrounds, banner backgrounds, article hero) want to render **video assets** from Content Hub through the same Sitecore Image fields. Content Hub identifies video assets via the `dam-content-type='video'` attribute on the asset. `ContentSdkImage` cannot render `<video>`.

The HCA demo (`HCA-smart-media` branch) introduced a first cut of `SmartMedia` to handle both problems on the five surfaces that needed video. The original `gpn` branch had taken a different approach — swap site-wide and fall back to plain `<img>` when dims are missing — which silently regresses Experience Editor editability across every Content Hub image (project rule `02-sitecore-implementation-standards`: never use plain `<img>` for Sitecore-managed fields).

This ADR promotes the HCA approach to `main`, with refinements decided in a design review (see "Decisions from review" below). It becomes the standard pattern for video-capable surfaces across all future demos.

## Decision

Introduce `SmartMedia` at `src/components/uiim/media/SmartMedia.tsx`, scoped to **five video-capable surfaces only**:

- `HeroBanner`
- `HeroBannerCarousel` (main slide background only — the small thumbnail stays on `ContentSdkImage`)
- `CTABanner` (the `WithImage` background variant)
- `FeatureHighlight`
- `ArticleHero` (background image only — the 40×40 author avatar stays on `ContentSdkImage`)

Every other uiim/ component — logo clouds, testimonials, card grids, icons, avatars, footer/header marks — **stays on `ContentSdkImage`**. A 48×48 icon slot should not be able to author an autoplay video.

`SmartMedia`'s API extends the original with `width`, `height`, `fill`, `sizes`, `priority`, `alt` props that pass through to `ContentSdkImage` on the image branch. This preserves the explicit-dim fix work and means today's `fill` / `width=…` props on the five target files keep working verbatim.

### Decisions from review

The following refinements were locked in during the promotion-to-main design review:

1. **Scope enforcement is documentation-only.** No lint rule, no allowlist file. The header comment in `SmartMedia.tsx` lists the five canonical surfaces and the "do not use on logos/icons/avatars" rule. Adding a sixth surface is a deliberate, reviewed PR — never a search-and-replace. The autoplay-in-icon risk is an accepted risk.

2. **Detection is inference only.** Check `field.value['dam-content-type'] === 'video'` first; fall back to a tightened URL regex (`/\.(mp4|webm|mov|ogg|m4v|ogv)(\?|#|\/|$)/i`) covering more extensions and URL fragment/path continuations. No `MediaType` rendering parameter — the content-model cost outweighs the small real-world inference-failure risk on these five surfaces. An optional `forceMode?: 'auto' | 'image' | 'video'` prop gives devs an escape hatch for true edge cases.

3. **`isEditing` is read internally via `useSitecore()`.** Callers do not pass it. Eliminates the "caller forgot to wire `isEditing` → author sees autoplay loop while editing" wiring footgun. SmartMedia is therefore a client component (`'use client'`); all five current targets are already client components for animation/interaction, so the cost is ~zero.

4. **View-mode playback respects `prefers-reduced-motion`.** Playback is triggered imperatively in `useEffect` via a video ref, not via a static `autoPlay` attribute. This avoids the SSR/hydration mismatch that a media-query-driven attribute would create, and avoids the brief motion flash that would occur if `autoPlay` was the default and the effect later paused it. The video is `aria-hidden="true"` in view mode (decorative). An optional `poster` prop (caller-supplied URL per surface) is rendered as the `<video poster=…>` attribute and shown when playback is suppressed.

5. **No visible pause/play button.** A control button on an ambient background loop clashes with the demo aesthetic and would need per-brand styling on every demo. Skipped intentionally; if a regulated-vertical demo requires strict WCAG conformance, the pause UI is added as a follow-up rather than baked in here.

6. **Editor-mode playback is unchanged from HCA.** Renders `<video controls preload="metadata">` — no autoplay, no loop. Author can preview on demand without being distracted while editing copy.

7. **Default-dim fallback (1600×900) is kept, with a louder dev signal.** When neither field XML dims nor caller sizing props are present:
   - **Production:** inject defaults, render via `ContentSdkImage` to preserve editability, `console.warn` once per `src` (module-level dedupe).
   - **Development (`NODE_ENV !== 'production'`):** **throw** with the diagnostic message. Next.js' dev error overlay surfaces the wiring bug immediately so contributors can't ship a missing-dims regression by accident.
   The root-cause fix — populating `width`/`height` in field XML on upload — is tracked in Future Work below.

### Rollout

Two PRs:

- **PR 1 (this PR)** — Introduce `SmartMedia.tsx`, this ADR, and the `CONTEXT.md` glossary entry. No call sites touched. The wrapper is dormant on `main` until PR 2 swaps the surfaces. Safe to merge and revert independently.
- **PR 2** — Swap `ContentSdkImage` → `SmartMedia` on the five scoped surfaces. Verify each in Experience Editor (image asset, video asset, missing dims behavior). Visual sanity check against pre-swap renders.

Existing demo branches (HCA, HCA-smart-media, gpn, Saga, Howdens, Eurobank, RVU) reconcile **lazily** — `main` wins; each demo absorbs `main`'s `SmartMedia` the next time it rebases. No coordinated multi-branch rebase.

## Consequences

### Positive

- Video assets render correctly on the five surfaces that need them.
- Today's explicit `width`/`height`/`fill` props on those surfaces survive — no regression.
- No plain `<img>` anywhere — Experience Editor editability stays intact for every image field, including Content Hub uploads missing dims.
- Icons, avatars, logos, and footer marks cannot accidentally render as autoplay videos (provided the documented scope is honored).
- `useSitecore()`-internal `isEditing` means new contributors cannot forget to pass it and accidentally trigger autoplay during editing.
- `prefers-reduced-motion` is respected — users with vestibular sensitivity don't get unwanted motion on first paint.
- Dev-mode throw on missing dims means wiring bugs surface during development, not in a production demo with a black hero box.

### Negative

- Two image-rendering paths exist in the codebase (`SmartMedia` and `ContentSdkImage`). A future contributor may swap `ContentSdkImage → SmartMedia` in a logo/icon component "for consistency" and reintroduce the autoplay-in-icon risk. **Scope enforcement is documentation-only** — this is an accepted risk, not a mitigated one. The scope boundary is documented in the SmartMedia source comment header and here.
- `SmartMedia` is now a client component (`'use client'`). Use sites outside Server Component trees are fine; using it inside a Server Component subtree implicitly makes that boundary client.
- When the default-dim fallback fires, the image may aspect-shift slightly. `object-cover` masks this on every current use site, but if a future surface uses `object-contain` or no `object-*` class, layout bugs may appear.
- `<video>` elements bypass `next/image` optimization (no AVIF/WebP transcoding, no responsive `srcset`). Acceptable for the small set of hero/background surfaces that use video; not a strategy for image-heavy surfaces.
- Diverges from the `gpn` branch's `SmartMedia` implementation in several ways (extended API, no plain `<img>` fallback, internal `useSitecore()`, reduced-motion handling, dev-throw). Merging `gpn → main` later will need a manual reconciliation.
- Reduced-motion playback is imperative (ref + `.play()` / `.pause()`), not declarative. Slightly more code than a static `autoPlay` attribute, but the alternative has hydration-mismatch and motion-flash bugs.

## Alternatives considered

1. **Adopt `gpn`'s `SmartMedia` as-is, swap site-wide.** Rejected — violates the project's "no plain `<img>` for Sitecore fields" rule for every Content Hub image, regresses editability across the whole component library.
2. **Keep `ContentSdkImage` everywhere, refuse video.** Rejected — five surfaces have real video requirements for current and upcoming demos.
3. **Add a `MediaType` rendering parameter for explicit author override.** Rejected — adds a field to five datasource/rendering-parameter templates, propagates across every demo, and 95% of authors leave it on `auto`. The content-model cost outweighs the small inference-failure risk on these five surfaces.
4. **Require `isEditing` as a non-optional prop.** Rejected in favor of internal `useSitecore()` read — eliminates the wiring footgun entirely. Forcing the prop adds review burden on every new use site without removing the failure mode.
5. **Visible pause/play button on view-mode video.** Deferred — clashes with ambient-hero aesthetic, would need per-brand styling on every demo. Added as a follow-up if a regulated-vertical demo requires strict WCAG conformance.
6. **Lint rule / CI check to enforce scope allowlist.** Deferred — judged premature given the small surface count. Reconsidered if the scope creep risk materializes.
7. **Fix the upload pipeline first** (`docs/ai/scripts/upload-to-content-hub.mjs`) to probe asset dimensions on upload and write `width`/`height` into the Sitecore Image field XML, so `ContentSdkImage` works without explicit props. Deferred as future work — does not solve the video case, and the default-dim fallback handles the gap in the meantime. Once landed, the dev-throw branch becomes near-dead and the explicit-dim props on non-`SmartMedia` surfaces could be retired.

## Future work

- Update `upload-to-content-hub.mjs` to populate `width`/`height` on Image field XML so the default-dim fallback rarely fires. When this lands, the dev-throw branch becomes near-dead code and can be tightened or removed.
- If a regulated-vertical demo requires strict WCAG 2.2.2 conformance, add a visible pause/play control to the view-mode video branch. Keep it opt-in (prop) so non-regulated demos keep the clean aesthetic.
- If video is needed on a sixth surface, evaluate whether to extend the scope (and update this ADR) or keep `SmartMedia` constrained to the current five.
- Consider a custom ESLint rule that flags `SmartMedia` imports outside the documented scope, if scope creep materializes.
- Consider whether `poster` should accept a Sitecore `ImageField` (author-managed) rather than a URL string, once a surface emerges where authors need to manage the poster independently of the video asset.
