# Agents.md - XM Cloud Starter Kits AI Guidance

## Project Overview

This repository contains **XM Cloud Front End Application Starter Kits** - a collection of production-ready Next.js starter applications for Sitecore XM Cloud development. Each starter demonstrates modern headless CMS patterns with Sitecore Content SDK integration.

**Repository Structure:**
- `/examples/` - Contains starter front-end applications (Next.js and SPA)
- `/authoring/` - Sitecore content items, templates, and deployment configurations
- `/local-containers/` - Docker setup for local development environments
- `xmcloud.build.json` - Primary configuration for XM Cloud deployment
- `.cursor/rules/` - Detailed coding standards and patterns (see below)

### Project structure (per Next.js starter)

Each Next.js starter under `examples/*` uses this layout under `src/`. All of these exist in the repository.

| Path | Purpose |
|------|---------|
| **`src/app/`** | **Routes and layouts.** App Router: `layout.tsx`, `page.tsx`, `[site]/[locale]/[[...path]]/` for Sitecore pages, `loading.tsx`, `error.tsx`, `not-found.tsx`. |
| **`src/app/api/`** | **API routes.** e.g. `editing/render`, `editing/config`, `robots`, `sitemap`. |
| **`src/components/`** | **React components.** Feature folders (e.g. `hero/`, `article-header/`), `ui/` for Shadcn, `content-sdk/`, BYOC. |
| **`src/lib/`** | **APIs and helpers.** `sitecore-client.ts` (Content SDK client), `component-props/`, `utils.ts`, constants. |
| **Styles** | **Global and feature styles.** Location varies by starter: `src/app/globals.css` and/or `src/assets/` (e.g. `main.scss`, `styles/globals.css`, `base/`, `components/`). No single `src/styles/` folder. |
| **`src/utils/`** | Shared utilities (e.g. `NoDataFallback.tsx`). Present in kit starters. |
| **`src/i18n/`** | Internationalization (routing, request). Present in App Router starters. |
| **`src/proxy.ts`** | Next.js proxy (locale, multisite, redirects, personalization). |

**Where environment variables are handled**

- **Defined:** In `.env.remote.example` (or `.env.example`) at the root of each starter. Developers copy to `.env.local` for local development.
- **Loaded:** Next.js loads `.env.local` automatically; **do not edit** `.env.local` or any `.env.*.local` in agent workflows.
- **Consumed:** `sitecore.config.ts` and app code read `process.env.*` (e.g. `SITECORE_EDGE_CONTEXT_ID`, `NEXT_PUBLIC_DEFAULT_SITE_NAME`, `SITECORE_EDITING_SECRET`, `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID`, optional `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_BASE_URL` for absolute URLs when no request host is available).

**Where Content SDK (or JSS) is initialized**

- **`sitecore.config.ts`** (starter root) – SDK config: edge context, site name, editing secret (from env).
- **`sitecore.cli.config.ts`** (starter root) – CLI: component map, build, deploy.
- **`src/lib/sitecore-client.ts`** – Sitecore/GraphQL client used in Server Components for layout and route data.
- **`src/Layout.tsx`** and **`src/Providers.tsx`** – Wrap the app with Sitecore providers and layout structure.
- **`.sitecore/component-map.ts`** – Generated component map; safe to edit when registering new components.

## Upstream, forks, and pull request scope

Before planning work that would become a **pull request to the official upstream** repository, confirm whether the user is targeting that upstream or their **own fork** or **template** copy of the repo.

- **Official upstream** maintains a **limited** set of starters under `examples/` as best-practice **examples**. Appropriate contributions include **improvements, bug fixes, and generally useful features** in **existing** starters.
- **Not appropriate as upstream pull requests:** **new example sites**, **additional** starters, or **bespoke** extensions for a **single** organization’s product or requirements. Those should live in a **user fork** or a repository created with **Use this template**.
- In a **fork** or private copy, the user may add starters and extend freely; align the work to **that** repository, not upstream’s contribution model.

Details: **[CONTRIBUTING.md – What we do not accept](CONTRIBUTING.md#what-we-do-not-accept)**. Related AI rules: **`.cursor/rules/project-context.mdc`**.

## Starter Applications Guide

### Quick Reference

| Starter | Purpose | Use Case | Key Features |
|---------|---------|----------|--------------|
| **basic-nextjs** | Foundation | Learning XM Cloud basics | Minimal setup, App Router, basic components |
| **kit-nextjs-article-starter** | Editorial | Lifestyle/magazine sites | Article layouts, rich content, Solterra & Co. brand |
| **kit-nextjs-location-finder** | Location-based | Car dealers, retail chains | Google Maps integration, location search, Alaris brand |
| **kit-nextjs-product-listing** | E-commerce | Product catalogs | Product grids, filters, SYNC audio brand |
| **kit-nextjs-skate-park** | Demo/Examples | Component showcase | Component variants, testing patterns |
| **basic-spa** | SPA Alternative | Angular applications | Angular + Node proxy, SSR support |

### When to Use Which Starter

**Choose `basic-nextjs` if:**
- You're new to XM Cloud and Sitecore Content SDK
- You need a minimal starting point
- You want to understand core integration patterns
- You're building a simple site with basic components

**Choose `kit-nextjs-article-starter` if:**
- Building editorial/magazine/lifestyle websites
- Need rich content layouts and article structures
- Want examples of complex content hierarchies
- Building content-heavy sites (blogs, news, magazines)

**Choose `kit-nextjs-location-finder` if:**
- Building location-based applications
- Need Google Maps integration
- Require location search functionality
- Building dealer/retail/store locator sites

**Choose `kit-nextjs-product-listing` if:**
- Building product catalog sites
- Need product filtering and search
- Require e-commerce patterns
- Building audio/tech product sites

**Choose `kit-nextjs-skate-park` if:**
- Learning component patterns and variants
- Need examples of component architecture
- Testing XM Cloud integration patterns
- Building component libraries

**Choose `basic-spa` if:**
- Prefer Angular over React
- Need SPA architecture with SSR
- Building Angular-based applications
- Require Node proxy for XM Cloud integration

## Development Workflow

### Getting Started with Any Starter

1. **Navigate to the starter directory:**
   ```bash
   cd examples/[starter-name]
   ```

2. **Set up environment:**
   ```bash
   cp .env.remote.example .env.local
   # Edit .env.local with your XM Cloud credentials
   ```

3. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```

### Commands (starter scripts)

Run these from **inside a starter directory** (e.g. `examples/kit-nextjs-skate-park`), not the repo root.

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies for the starter |
| `npm run dev` | Start dev server (generates component map, runs Sitecore tools build, starts Next.js with map watch) |
| `npm run build` | Production build (generate map, Sitecore tools build, Next.js build) |
| `npm run start` | Start production server (run after `npm run build`) |
| `npm run lint` | Lint `src/**/*.{ts,tsx}` with ESLint |
| `npm run format:check` | Check formatting with Prettier |
| `npm run type-check` | TypeScript check without emit |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run sitecore-tools:generate-map` | Generate `.sitecore/component-map` from `src/components` |
| `npm run sitecore-tools:build` | Run Sitecore CLI build (metadata, sites, import map) |

**Typical workflow:** `npm install` → `npm run dev` for local development; `npm run build` then `npm run start` for production.

### Required Environment Variables

All starters require these environment variables:
- `NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME` - XM Cloud Edge URL
- `SITECORE_EDGE_CONTEXT_ID` - XM Cloud Edge Context ID
- `NEXT_PUBLIC_DEFAULT_SITE_NAME` - Default site name
- `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` - Public Edge Context ID
- `SITECORE_EDITING_SECRET` - Editing host secret

### Multi-Starter Development Principles

1. **Independence**: Each starter is standalone - no monorepo linking
2. **Pattern Sharing**: Copy utilities between starters, don't link
3. **Consistency**: Follow same patterns across all starters
4. **Isolation**: Changes to one starter don't affect others

## Architecture Patterns

### Component Structure

All starters follow the **Locality of Behavior** pattern:

```
components/
  component-name/
    ComponentName.tsx          # Main component with variants
    component-name.props.tsx   # Props interface
    ComponentNameDefault.dev.tsx  # Variant implementations
    ComponentNameVariant.dev.tsx
```

**Key Principles:**
- Main component file contains variants and rendering logic; define props interfaces in sidecar files like `component-name.props.ts` or `component-name.props.tsx`
- Variants exported as named exports: `Default`, `ThreeUp`, `Slider`, etc.
- Props interfaces extend `ComponentProps` from `@/lib/component-props`
- Use `.dev.tsx` files only when separation is necessary for maintainability

**Props Sidecar Rule (All Starters):**
- Keep props/interfaces in sidecar files (`*.props.ts` / `*.props.tsx`) per component folder.
- Exclude sidecar props files from Sitecore component generation in each starter `sitecore.cli.config.ts` using `componentMap.exclude` patterns:
  - `src/components/**/*.props.ts`
  - `src/components/**/*.props.tsx`
- After adding or renaming props files, run `npm run sitecore-tools:generate-map` and verify sidecar files are not registered in `.sitecore/component-map.ts`.

### Sitecore Integration Patterns

**Component Props Structure:**
```typescript
interface ComponentProps extends ComponentProps {
  params: { [key: string]: any };
  fields: {
    data: {
      datasource: {
        fieldName?: { jsonValue?: Field };
      };
    };
  };
  isPageEditing?: boolean;
}
```

**Safe Field Access:**
```typescript
// ✅ Safe destructuring with fallbacks
const { data } = fields || {};
const { datasource } = data || {};
const { title, description } = datasource || {};

// ✅ Safe field rendering
{(title?.jsonValue?.value || isEditing) && (
  <Text field={title?.jsonValue} tag="h1" />
)}
```

**Datasource Validation:**
```typescript
if (!fields?.data?.datasource) {
  return <NoDataFallback componentName="ComponentName" />;
}
```

### Next.js App Router Patterns

**Server Components (Default):**
- Use for data fetching and static content
- Fetch Sitecore data in Server Components
- No 'use client' directive needed

**Client Components:**
- Use 'use client' directive for interactivity
- Keep client components focused on UI interactions
- Pass server-fetched data as props

**Routing:**
- Use `src/app/[site]/[locale]/[[...path]]/page.tsx` for Sitecore catch-all routes
- Implement `layout.tsx` for shared page structure
- Use `loading.tsx` for loading states
- Create `error.tsx` for error boundaries

## Technology Stack

### Core Technologies
- **Next.js 14+** - App Router (default); `basic-nextjs-pages-router` uses Pages Router
- **TypeScript** - Strict mode enabled
- **Sitecore XM Cloud** - Headless CMS platform
- **Sitecore Content SDK** - `@sitecore-content-sdk/nextjs`
- **Tailwind CSS** - Utility-first with container queries
- **Shadcn/ui** - Accessible component library

### Additional Libraries
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **next-localization** - i18n support
- **change-case** - String utilities

## Common Patterns Across Starters

### 1. Component Variants
All starters use variant-based component architecture:
```typescript
export const Default: React.FC<ComponentProps> = (props) => { ... };
export const ImageBottom: React.FC<ComponentProps> = (props) => { ... };
export const ThreeUp: React.FC<ComponentProps> = (props) => { ... };
```

### 2. Container Components
Flexible container system with width variants:
- `container-5050`, `container-3070`, `container-7030`
- `container-full-width`, `container-full-bleed`
- Responsive grid layouts

### 3. Image Handling
Consistent image wrapper pattern:
```typescript
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
<ImageWrapper field={image?.jsonValue} />
```

### 4. Button Components
Standardized button system:
```typescript
import { ButtonBase } from '@/components/button-component/ButtonComponent';
<ButtonBase field={cta?.jsonValue} />
```

### 5. Error Handling
Standard fallback component:
```typescript
import { NoDataFallback } from '@/utils/NoDataFallback';
if (!fields?.data?.datasource) {
  return <NoDataFallback componentName="ComponentName" />;
}
```

## Coding Standards Quick Reference

### Naming Conventions
- **Variables/Functions**: `camelCase` (`handleClick`, `isActive`)
- **Components**: `PascalCase` (`Hero`, `ProductListing`)
- **Constants**: `UPPER_SNAKE_CASE` (`API_ENDPOINT`)
- **Directories**: `kebab-case` (`product-listing/`)
- **Types/Interfaces**: `PascalCase` with `Props` suffix (`HeroProps`)

### TypeScript Standards
- Strict mode enabled in all projects
- Prefer explicit types over `any`
- Use discriminated unions for complex state
- Export types at module boundaries

### Import Patterns
```typescript
// Sitecore SDK components
import { Text, RichText, Image, useSitecore } from '@sitecore-content-sdk/nextjs';

// Utilities
import { cn } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';

// Reusable components
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { ButtonBase } from '@/components/button-component/ButtonComponent';

// Utilities
import { NoDataFallback } from '@/utils/NoDataFallback';
```

## Best Practices

### 1. Always Validate Datasources
```typescript
if (!fields?.data?.datasource) {
  return <NoDataFallback componentName="ComponentName" />;
}
```

### 2. Handle Editing Mode
```typescript
const { page } = useSitecore();
const { isEditing } = page.mode;
// Show fields in editing mode even if empty
{(title?.jsonValue?.value || isEditing) && <Text field={title?.jsonValue} />}
```

### 3. Safe Destructuring
```typescript
// ✅ Good
const { data } = fields || {};
const { datasource } = data || {};
const { title } = datasource || {};

// ❌ Bad - can throw errors
const { title } = fields.data.datasource;
```

### 4. Use Sitecore Field Components
```typescript
// ✅ Good
<Text field={title?.jsonValue} tag="h1" />
<RichText field={content?.jsonValue} />
<Image field={image?.jsonValue} />

// ❌ Avoid manual field extraction
<h1>{fields.title.value}</h1>
```

### 5. Error Boundaries
Always wrap XM Cloud API calls in try/catch:
```typescript
try {
  const layoutData = await client.getRouteData(path);
  return layoutData;
} catch (error) {
  console.error('Failed to fetch layout data:', error);
  return { notFound: true };
}
```

## Testing

- **Stack:** Jest + React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`); coverage via Jest (`jest --coverage`). Used in kit starters.
- **Run:** From a starter directory: `npm run test`. For watch mode: `npm run test:watch`.
- **Coverage:** From a starter directory: `npm run test:coverage`.
- **When to update:** Update or add tests when you change behavior (components, utils, API routes). Mock XM Cloud / Sitecore services and use test data that matches `fields.data.datasource`; test missing datasource and fallbacks (e.g. `NoDataFallback`).
- **Before completing:** Ensure tests pass (`npm run test`) and, if you changed code, that the starter still builds (`npm run build`).

## DO & DON'T Rules

| DO | DON'T |
|----|--------|
| Use existing utilities and common code (`NoDataFallback`, `cn`, `ImageWrapper`, `ButtonBase`, `@/lib/utils`, `@/lib/component-props`) | Edit `.next/`, `dist/`, `out/`, `build/` or other build output |
| Follow patterns in components and starters (Locality of Behavior, datasource validation, Sitecore field components) | Change env vars or commit `.env`, `.env.local`, or `.env.*.local` |
| Ensure starter edits build with `npm install && npm run build` in the starter directory | Add dependencies without explicit approval |
| Reuse common patterns (see `src/lib/`, `src/utils/`, existing component structure) | Modify `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` unless required |
| Run `npm run build` after template or component changes | Rewrite folder structure or move files arbitrarily |
| Run `npm run lint` (and `npm run test` where available) when changing code | Touch CI or global config without explicit instruction |
| Validate datasource (`fields?.data?.datasource`) and use safe destructuring | Modify `.github/workflows/`, `xmcloud.build.json`, or `Dockerfile` without instruction |
| Add new components under `src/components/`; the component map (`.sitecore/component-map.ts`) is generated automatically when you run `npm run dev` or `npm run build` | Edit `node_modules/` or generated files under `.sitecore/` (the map is regenerated by tooling; do not edit it manually) |

## Detailed Rules Reference

For comprehensive coding standards and patterns, refer to:

- **`.cursor/rules/`** - Detailed rule files covering:
  - `code-style.mdc` - Vibe-coding principles and TypeScript standards
  - `general.mdc` - Universal coding principles (DRY, SOLID)
  - `project-context.mdc` - Repository-specific context
  - `safety.mdc` - Safety rules (never edit compiled artifacts)
  - `javascript.mdc` - JavaScript/TypeScript conventions
  - `sitecore.mdc` - Sitecore XM Cloud patterns
  - `nextjs.mdc` - Next.js specific patterns
  - `testing.mdc` - Testing strategies

- **`CLAUDE.md`** - Comprehensive guide for Claude Code
- **`copilot-instructions.md`** - GitHub Copilot guidance
- **`LLMs.txt`** - Concise guidance for various AI assistants

## Safety Rules

**Never Edit:**
- `node_modules/` - Installed packages
- `.next/`, `dist/`, `out/`, `build/` - Build outputs
- `.cache/`, `.sitecore/` - Cache and generated files (component map is regenerated by tooling)
- `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` - Lock files
- `.env.local`, `.env.*.local` - Local environment files

**Focus On:**
- `src/` - Source code files
- `*.ts`, `*.tsx` - TypeScript files
- Configuration files: `next.config.js`, `tsconfig.json`, `package.json`
- Component maps: `.sitecore/component-map.ts`

## Git Workflow

This repository uses **DMZ git workflow**:

- **`main` branch**: Always clean and deployable (never commit directly)
- **`dmz` branch**: Validation layer where PRs are merged
- **Feature branches**: Created from `main`, PRs target `dmz`

**Key Rules:**
1. Always create feature branches from latest `main`
2. Create PRs to `dmz` (not `main`)
3. Use Squash and merge only
4. Ensure branch is based on latest `main` before creating PR

## Quick Decision Tree

**Which starter should I modify?**
- Learning basics → `basic-nextjs`
- Editorial content → `kit-nextjs-article-starter`
- Location features → `kit-nextjs-location-finder`
- Product catalogs → `kit-nextjs-product-listing`
- Component examples → `kit-nextjs-skate-park`
- Angular SPA → `basic-spa`

**Where should I add a new component?**
- `src/components/[component-name]/ComponentName.tsx`
- Follow Locality of Behavior pattern
- Include props interface and variants in main file

**How do I handle missing datasources?**
- Use `NoDataFallback` component
- Check `fields?.data?.datasource` existence
- Handle both editing and preview modes

**What if I need client-side interactivity?**
- Add `'use client'` directive
- Keep component focused on interactivity
- Pass server-fetched data as props

## Example Agent Tasks

### 1. Add a utility in a starter

**Example:** Add a constant or helper in a starter (e.g. `examples/kit-nextjs-skate-park/src/lib/constants.ts` or `src/utils/date-utils.ts`):

- Export from the module (or from `src/lib/index.ts` / barrel if the starter has one) if it is shared
- Add or update tests (e.g. `*.test.ts` or `*.test.tsx` in the same area or under `__tests__/`) if the starter has a test script
- Run `npm run build` and `npm run lint` in that starter directory before completing

### 2. Fix a failing test

- From the starter directory (e.g. `examples/kit-nextjs-skate-park`): `npm run test`
- Or run a single package: `cd examples/kit-nextjs-skate-park && npm run test`
- Locate the failing `*.test.ts` or `*.test.tsx` file from the output
- Preserve intended behavior; fix assertions or implementation so the test passes
- Re-run `npm run test` (and `npm run build` if you changed implementation) before completing

### 3. Add or change a component

- Edit under the starter’s `src/components/` (e.g. `examples/kit-nextjs-skate-park/src/components/my-block/MyBlock.tsx`)
- Follow Locality of Behavior: main component file with variants and props; use `NoDataFallback`, validate `fields?.data?.datasource`, use Sitecore field components (`Text`, `RichText`, `Image`)
- Use `.env.remote.example` (or `.env.example`) when documenting env vars in the starter; never edit or commit `.env.local`
- Verify: run `npm install && npm run build` (or `npm run dev`) in that starter; the component map (`.sitecore/component-map.ts`) is generated automatically, do not edit it by hand

## Additional Resources

- [Sitecore XM Cloud Documentation](https://doc.sitecore.com/xmc)
- [Sitecore Content SDK Documentation](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)

---

**Remember:** When in doubt, refer to `.cursor/rules/` for detailed guidance. This `Agents.md` file provides quick reference - the rule files contain comprehensive patterns and examples.
