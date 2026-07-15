# GitHub Copilot Instructions for XM Cloud Starter Applications

## Project Overview

This repository contains **XM Cloud Front End Application Starter Kits** - multiple Next.js starter applications and SPA examples for Sitecore XM Cloud development. Each starter demonstrates modern headless CMS patterns with Sitecore XM Cloud integration.

### Repository Structure:
- `/examples/` - Contains starter front-end applications (Next.js and SPA)
- `/authoring/` - Sitecore content items, templates, and deployment configurations  
- `/local-containers/` - Docker setup for local development environments
- `xmcloud.build.json` - Primary configuration for XM Cloud deployment

### Available Starter Applications

- **basic-nextjs** - Simple Next.js starter with basic XM Cloud integration
- **kit-nextjs-article-starter** - **Solterra & Co.** - Editorial-style template for lifestyle brands
- **kit-nextjs-location-finder** - **Alaris** - Car brand template with location finder functionality
- **kit-nextjs-product-listing** - **SYNC** - Product-focused template for audio gear companies
- **kit-nextjs-skate-park** - Simple demo site showcasing component examples
- **basic-spa** - SPA starter kit with Angular and Node proxy

### Each starter demonstrates:
- Tailwind-based styling with Shadcn/ui components
- Personalized homepage via URL parameters
- Modular component architecture with variants
- Localization support for English (en) and Canadian English (en-CA)

### Upstream, forks, and pull request scope

Before work is framed as a **pull request to the official upstream** repository, confirm the user’s target: **upstream** (public, maintained examples) or a **fork** / **Use this template** copy.

- **Upstream** welcomes **improvements, bug fixes, and broadly useful features** in **existing** starters. The set of starters in `examples/` is intentionally **limited** as best-practice references.
- **Not for upstream PRs:** **new example sites**, **additional** starter apps, or **bespoke** extensions for a **single** customer or product. Those belong in a **user fork** or a separate repo; see **[CONTRIBUTING.md - What we do not accept](CONTRIBUTING.md#what-we-do-not-accept)** and **`.cursor/rules/project-context.mdc`**.

## Technology Stack

### Core Technologies
- **Next.js 14+** - React framework with App Router (all starters except `basic-nextjs-pages-router`)
- **TypeScript** - Strict type safety throughout all components
- **Sitecore XM Cloud** - Headless content management and delivery
- **Sitecore Content SDK** - Modern SDK for XM Cloud integration (`@sitecore-content-sdk/nextjs`)
- **Tailwind CSS** - Utility-first CSS with container queries (@container)
- **Shadcn/ui** - Modern component library with accessibility features

### Additional Libraries
- **Framer Motion** - Animation library for interactive components
- **Lucide React** - Icon library for consistent iconography
- **next-localization** - Internationalization with dictionary support
- **change-case** - String case transformation utilities
- **React Hook Form** - Form handling with validation
- **Zod** - TypeScript-first schema validation

### Development Tools:
- **Docker** - Containerized local development with Sitecore CM
- **Node.js LTS** - JavaScript runtime environment
- **npm** - Package management across all starter applications

### File Organization:
- Each starter is independent and self-contained; do not share code or packages across starters—copy utilities and components as needed
- Component directories contain main file, variants, and props
- Main component file should contain variants and rendering logic; keep props/interfaces in sidecar files (`*.props.ts` / `*.props.tsx`)
- Using `.dev.tsx` files for variant implementations is discouraged unless maintainability becomes difficult for the component and separation cannot be avoided
- Shared utilities in dedicated directories (within each starter)
- Group UI components in `ui/` subdirectory
- Exclude sidecar props files from component-map generation in each starter `sitecore.cli.config.ts` with:
  - `src/components/**/*.props.ts`
  - `src/components/**/*.props.tsx`
- After props-file changes, run `npm run sitecore-tools:generate-map` and confirm sidecar files are not registered in `.sitecore/component-map.ts`.

## Coding Standards

### TypeScript Best Practices
- Enable strict mode in all projects
- Prefer explicit types over `any`
- Use discriminated unions for complex state
- Export types at module boundaries for reusability
- Define proper interfaces for XM Cloud data structures

### Functional Programming:
- Prefer pure functions where possible
- Use immutable data patterns
- Avoid side effects in business logic
- Compose small, focused functions
- Use React hooks appropriately

### Component Development Patterns

#### Sitecore Component Structure
Follow the Locality of Behavior pattern:

```typescript
// ComponentName.tsx - Main component file with all variants
import type React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Field, ImageField } from '@sitecore-content-sdk/nextjs';

interface ComponentParams {
  [key: string]: any;
}

interface ComponentFields {
  title?: { jsonValue: Field<string> };
  subtitle?: { jsonValue: Field<string> };
  backgroundImage?: { jsonValue: ImageField };
}

interface ComponentProps extends ComponentProps {
  params: ComponentParams;
  fields: {
    data: {
      datasource: ComponentFields;
    };
  };
  isPageEditing?: boolean;
}

// Export named variants
export const Default: React.FC<ComponentProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <ComponentDefault {...props} isPageEditing={isEditing} />;
};

export const ThreeUp: React.FC<ComponentProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <ComponentThreeUp {...props} isPageEditing={isEditing} />;
};
```

#### Data Source Validation
Always validate datasource existence:
- Always check `fields?.data?.datasource` existence
- Use `NoDataFallback` component for missing datasources
- Handle both editing and preview modes
- Provide meaningful error messages

```typescript
import { NoDataFallback } from '@/utils/NoDataFallback';

export const ComponentDefault: React.FC<ComponentProps> = (props) => {
  const { fields, isPageEditing } = props;
  
  if (!fields?.data?.datasource) {
    return <NoDataFallback componentName="ComponentName" />;
  }
  
  const { title, description, image } = fields.data.datasource;
  
  // Safe field access with optional chaining
  return (
    <section>
      {title?.jsonValue && (
        <Text field={title.jsonValue} tag="h1" />
      )}
    </section>
  );
};
```

#### Safe Field Handling
Handle destructuring errors gracefully:

```typescript
// ✅ Safe destructuring with fallbacks
const { titleRequired, descriptionOptional } = fields || {};

// ✅ Safe nested destructuring
const { data: { datasource } = {} } = fields || {};

// ✅ Safe field access with optional chaining
field={fields.data?.datasource?.title?.jsonValue}

// ❌ Unsafe - can throw destructuring errors
const { title } = fields.data.datasource; // Error if fields.data is null
```

Sitecore Field Components:
- Use `@sitecore-content-sdk/nextjs` field components
- Access field values through `jsonValue` property
- Handle optional fields with conditional rendering
- Use proper semantic HTML tags

```typescript
import { Text, RichText, Image } from '@sitecore-content-sdk/nextjs';

// Field rendering patterns
{title?.jsonValue && (
  <Text
    tag="h1"
    field={title.jsonValue}
    className="hero-title text-4xl font-bold"
  />
)}

{description?.jsonValue && (
  <RichText field={description.jsonValue} />
)}

{image?.jsonValue && (
  <Image
    field={image.jsonValue}
    alt={title?.jsonValue?.value || 'Hero image'}
    className="w-full h-auto"
  />
)}
```

### Editing Mode Handling

Page Editing Support:
- Use `useSitecore` hook to access page mode
- Check `page.mode.isEditing` for editing state
- Pass `isPageEditing` prop to variant components
- Provide different rendering for editing vs. preview

```typescript
import { useSitecore } from '@sitecore-content-sdk/nextjs';

export const Default: React.FC<ComponentProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  const isEditMode = props.isPageEditing || isEditing;
  
  if (isEditMode) {
    // Simplified rendering for editing mode
  }
  
  // Normal rendering
};
```

### Sitecore Content SDK Import Guidelines

SDK Submodule Usage:
- **Main package**: Use for components and client-side functionality
- **Submodules**: Only use appropriate submodules for specific contexts
- **Server-only**: Never import `/config-cli` or `/tools` in client components

#### Client-Safe Imports (Components & Client Code)
```typescript
// ✅ SAFE - Client-side component usage
import { 
  Text, 
  RichText, 
  Image, 
  Link,
  Field, 
  LinkField, 
  ImageField,
  useSitecore,
  SitecoreProvider,
  Placeholder 
} from '@sitecore-content-sdk/nextjs';

// ✅ SAFE - Middleware usage (edge runtime)
import { 
  LocalizationMiddleware,
  RedirectsMiddleware 
} from '@sitecore-content-sdk/nextjs/middleware';
```

#### Server-Only Imports (Configuration & Build)
```typescript
// ❌ NEVER in client components
// ✅ ONLY in server-side contexts (sitecore.config.ts, sitecore.cli.config.ts)
import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import { generateSites, generateMetadata, extractFiles } from '@sitecore-content-sdk/nextjs/tools';

// ✅ ONLY in lib/sitecore-client.ts or server utilities
import { SitecoreClient, GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';
```

### Styling and UI Patterns

#### Tailwind CSS Usage
```typescript
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

<div className={cn(
  '@container bg-primary rounded-default',
  'relative mx-auto my-6 max-w-7xl px-4 py-16',
  isActive && '@md:w-full'
)}>
```

#### Responsive Design
- Use container queries (@container) for component-based responsive design
- Implement mobile-first approach with Tailwind breakpoints
- Use Shadcn/ui components for consistent accessibility

### Naming Conventions

#### Files and Directories
- Component directories: kebab-case (`article-header/`, `product-listing/`)
- Component files with all variants as well as the props: PascalCase (`Hero.tsx`, `ProductListing.tsx`)
- Utility files: camelCase (`dateUtils.ts`, `componentProps.ts`)

#### Variables and Functions
- Variables: camelCase (`isActive`, `prefersReducedMotion`)
- Boolean variables: prefix with `is`, `has`, `can`, `should`
- Event handlers: prefix with `handle` (`handleClick`, `handleKeyDown`)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`, `USER_ZIPCODE`)

### Component Development Workflow

1. **Start with the main component file** (`ComponentName.tsx`)
2. **Define TypeScript interfaces** for params, fields, and props
3. **Create variant dispatchers** that use `useSitecore` hook
4. **Implement variant components** with proper validation
5. **Add styling** with Tailwind CSS and Shadcn/ui
6. **Test with and without datasources** in editing mode

### Performance and Accessibility
- Use `'use client'` directive for client-side interactivity
- Implement proper ARIA attributes for interactive components
- Use React hooks like `useState`, `useEffect`, `useRef` appropriately
- Check for `prefers-reduced-motion` when using animations

#### Client-Side Interactivity
```typescript
'use client';

import { useState, useEffect } from 'react';

export const InteractiveComponent: React.FC<Props> = (props) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);
  
  // Component implementation with motion respect
};
```

#### SEO and Meta Tags
- Use Next.js `Metadata` API for proper SEO
- Implement structured data for rich snippets
- Use semantic HTML elements for better accessibility

## Development Environment

### Local Development Setup
```bash
# Navigate to any starter
cd examples/kit-nextjs-article-starter

# Copy environment template
cp .env.remote.example .env.local

# Edit .env.local with your XM Cloud values
# Install dependencies and start
npm install
npm run dev
```

### Required Environment Variables
```env
SITECORE_EDGE_CONTEXT_ID=your-context-id
NEXT_PUBLIC_DEFAULT_SITE_NAME=your-site-name
NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID=your-public-context-id
SITECORE_EDITING_SECRET=your-editing-secret
```

## Safety Guidelines

### Never Edit These Files
- `node_modules/` - Installed packages
- `.next/`, `dist/`, `out/`, `build/` - Build outputs
- `package-lock.json`, `yarn.lock` - Lock files
- `.env.local`, `.env.*.local` - Local environment files
- `*.itempackage`, `*.sicpackage` - Sitecore packages
- `.sitecore/user.json` - User-specific configs

### Focus on Source Files
- `.ts`, `.tsx`, `.js`, `.jsx` files in `src/`
- `next.config.js`, `tsconfig.json`, `package.json`
- `.css`, `.scss` files
- `.sitecore/component-map.ts`
