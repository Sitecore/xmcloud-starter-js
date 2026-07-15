# Project Context

## Table of Contents

- [Repository Overview](#repository-overview)
- [Technology Stack](#technology-stack)
- [Development Principles](#development-principles)
- [Upstream, forks, and pull request scope](#upstream-forks-and-pull-request-scope)
- [Constraints and Guidelines](#constraints-and-guidelines)
- [Code Style](#code-style)
- [General Coding Principles](#general-coding-principles)
- [JavaScript/TypeScript Rules](#javascripttypescript-rules)
- [Sitecore XM Cloud Rules](#sitecore-xm-cloud-rules)
- [Next.js Development Patterns](#nextjs-development-patterns)
- [Testing Patterns](#testing-patterns)
- [Safety Rules](#safety-rules)

## Repository Overview

This is the **XM Cloud Front End Application Starter Kits** repository containing multiple Next.js starter applications and SPA examples for Sitecore XM Cloud development.

**Repository Structure:**
- `/examples/` - Contains starter front-end applications (Next.js and SPA)
- `/authoring/` - Sitecore content items, templates, and deployment configurations  
- `/local-containers/` - Docker setup for local development environments
- `xmcloud.build.json` - Primary configuration for XM Cloud deployment

**Available Examples:**
- `basic-nextjs` - Simple Next.js starter with basic XM Cloud integration
- `kit-nextjs-article-starter` - **Solterra & Co.** - Editorial-style template for lifestyle brands
- `kit-nextjs-location-finder` - **Alaris** - Car brand template with location finder functionality
- `kit-nextjs-product-listing` - **SYNC** - Product-focused template for audio gear companies
- `kit-nextjs-skate-park` - Simple demo site showcasing component examples
- `basic-spa` - SPA starter kit with Angular and Node proxy

Each starter demonstrates:
- Tailwind-based styling with Shadcn/ui components
- Personalized homepage via URL parameters
- Modular component architecture with variants
- Localization support for English (en) and Canadian English (en-CA)

## Technology Stack

**Core Technologies:**
- **Next.js 14+** - React framework with App Router (all starters except `basic-nextjs-pages-router`)
- **TypeScript** - Strict type safety throughout all components
- **Sitecore XM Cloud** - Headless content management and delivery
- **Sitecore Content SDK** - Modern SDK for XM Cloud integration
- **Tailwind CSS** - Utility-first CSS with container queries (@container)
- **Shadcn/ui** - Modern component library with accessibility features

**Additional Libraries:**
- **Framer Motion** - Animation library for interactive components
- **Lucide React** - Icon library for consistent iconography  
- **next-localization** - Internationalization with dictionary support
- **change-case** - String case transformation utilities

**Development Tools:**
- **Docker** - Containerized local development with Sitecore CM
- **Node.js LTS** - JavaScript runtime environment
- **npm** - Package management across all starter applications

## Development Principles

**Multi-Starter Architecture:**
- Each example is a standalone application
- Shared patterns and conventions across all starters
- Independent deployment and development workflows
- Common XM Cloud integration patterns

**Content-First Development:**
- Components are designed around Sitecore data structures
- Field-driven rendering with proper fallbacks
- Support for both connected and disconnected development modes
- Proper handling of content authoring scenarios

## Upstream, forks, and pull request scope

The official **upstream** repository (this project’s public GitHub home) keeps a **small, fixed** set of starters in `examples/` as **reference examples**, not a catalog of every vertical. Before treating work as an **upstream pull request**, confirm whether the target is **upstream** or a **user fork** / **template** copy.

- **Fits upstream PRs:** **Improvements, bug fixes, and broadly useful features** in **existing** starters; **documentation** and **tooling** aligned with the repo’s contribution policy.
- **Not for upstream PRs:** **New example sites**, **additional** starters, or **product-specific** extensions for one org that should live in a **fork** or separate repo. Use **Use this template** or maintain a **fork** for that work.
- **Fork or standalone copy:** Add starters and customize freely; do not frame that work as an official upstream change unless maintainers have agreed otherwise.

Authoritative human policy: **[CONTRIBUTING.md](CONTRIBUTING.md)** — especially **[What we do not accept](CONTRIBUTING.md#what-we-do-not-accept)**. For Cursor, see **`.cursor/rules/project-context.mdc`**.

## Constraints and Guidelines

**File Organization:**
- Each starter maintains its own `src/` directory structure
- Shared utilities should be copied, not shared (no monorepo linking)
- Configuration files specific to each starter application
- Independent package.json for each example

**Development Workflow:**

DMZ git flow will be implemented in the future to support better development practices, scaling, efficiency and developer productivity.
Below is an outline of the planned workflow and processes that will be followed:

- Has a shared main repo (`upstream repository`) with two key branches: `main` and `dmz`
- Each contributor uses their own fork as their workspace
- Feature branches are sourced from `main` but Pull Requests (PRs) with changes are merged to `dmz` branch 
- `main` branch in the `upstream repository` is always clean (deployable, branchable and reliable). It does not accept PRs created by developers.
- Developers should push changes to feature branches in their own fork and then create PRs to `dmz` branch in the `upstream repository`.  
- PRs are merged by reviewers to the `dmz` branch after review and validation. Conflicts should be resolved by rebasing onto main. 
- Once a PR has been merged into `dmz` branch the code changes are validated through an automated full build of the `dmz` branch `HEAD` in the Continous Integration server.  
- The `dmz` branch acts as a staging/integration branch and once sevearl chnages are integrated and tested in the `dmz` branch they can be manually merged to the `main` branch using merge commits (usually at the end of 1 or 2 weeks)
- If the build fails, the changes are or issues are found in the `dmz` branch during integration, the problamatic commits can be reverted

- Each starter can be developed independently in its own directory
- Copy `.env.remote.example` to `.env.local` for local development
- Required environment variables: `SITECORE_EDGE_CONTEXT_ID`, `NEXT_PUBLIC_DEFAULT_SITE_NAME`, `SITECORE_EDITING_SECRET`
- Docker containers available for full local Sitecore development stack

**Local Development Setup:**

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

**Deployment:**
- Uses `xmcloud.build.json` for rendering host configuration
- Each starter can be enabled/disabled for deployment via `enabled` flag
- Supports multiple rendering hosts in single repository
- Automatic editing host creation when split deployment is disabled
- Environment-specific configuration through XM Cloud Deploy Portal

## Code Style

### Vibe-Coding Principles

**Core Philosophy:**
- Write clean, modular, and idiomatic code
- Prefer declarative over imperative patterns
- Make code readable and self-documenting
- TypeScript-first development approach
- Component-driven architecture with XM Cloud integration

**Code Organization:**
- Use modern JavaScript/TypeScript features
- Export public types at module boundaries
- Prefer pure functions and thin wrappers
- No top-level side effects (except page entry points)
- Modular architecture with clear separation of concerns

### Code Quality Standards

**TypeScript Usage:**
- Enable strict mode in all projects
- Prefer explicit types over `any`
- Use discriminated unions for complex state
- Export types at module boundaries for reusability
- Define proper interfaces for XM Cloud data structures

**Functional Programming:**
- Prefer pure functions where possible
- Use immutable data patterns
- Avoid side effects in business logic
- Compose small, focused functions
- Use React hooks appropriately

**Readability:**
- Use descriptive variable and function names
- Keep functions small and focused (single responsibility)
- Prefer self-documenting code over extensive comments
- Use consistent naming patterns across all starters

### Component Development

**React Best Practices:**
- Use functional components with hooks
- Implement proper prop validation with TypeScript
- Handle loading and error states explicitly
- Use React.memo for performance optimization when needed
- Follow React 18+ patterns and concurrent features

**XM Cloud Component Patterns:**
- Always validate field existence before rendering
- Provide meaningful fallbacks for missing content
- Use Sitecore field components for proper rendering
- Handle both editing and preview modes
- Implement proper error boundaries
- Handle destructuring, undefined errors and null values in datasource and field values gracefully

```typescript
// Good component pattern
import { Text, Image, useSitecore } from '@sitecore-content-sdk/nextjs';

interface HeroProps {
  fields: {
    data?: {
      datasource?: {
        title?: { jsonValue?: Field };
        subtitle?: { jsonValue?: Field };
        backgroundImage?: { jsonValue?: Field };
      };
    };
  };
}

export default function Hero({ fields }: HeroProps) {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  if (!fields) {
    return <div>Hero content not configured</div>;
  }

  // Handle destructuring errors with safe fallbacks
  const { data } = fields || {};
  const { datasource } = data || {};
  const { title, subtitle, backgroundImage } = datasource || {};

  return (
    <section className="hero">
      {/* Show field components in editing mode even if no content */}
      {(title?.jsonValue?.value || isEditing) && <Text field={title?.jsonValue} tag="h1" />}
      {(subtitle?.jsonValue?.value || isEditing) && <Text field={subtitle?.jsonValue} tag="p" />}
      {(backgroundImage?.jsonValue?.value?.src || isEditing) && (
        <Image field={backgroundImage?.jsonValue} />
      )}
    </section>
  );
}
```

### Safe Destructuring Examples

```typescript
// ✅ Safe destructuring with fallbacks
const { titleRequired, descriptionOptional } = fields || {};

// ✅ Safe nested destructuring
const { data: { datasource } = {} } = fields || {};

// ✅ Safe field access with optional chaining
field={fields.data?.datasource?.title?.jsonValue}

// ❌ Unsafe - can throw destructuring errors
const { title } = fields.data.datasource; // Error if fields.data is null

// ❌ Unsafe - can throw undefined errors  
field={fields.data.datasource.title.jsonValue} // Error if any part is null/undefined
```

### Error Handling

**Error Strategy:**
- Fail fast with clear, actionable messages
- Provide context in error messages
- Use custom error classes for domain-specific errors
- Handle edge cases explicitly with guard clauses
- Log errors appropriately for debugging

**XM Cloud Error Patterns:**
- Handle missing datasource gracefully
- Provide fallback content for failed API calls
- Implement proper error boundaries for component failures
- Handle both connected and disconnected mode errors

**Security:**
- Sanitize user inputs and XM Cloud content
- Validate data at boundaries
- Never log sensitive information
- Use environment variables for all configuration
- Implement proper CSP headers

### Development Workflow

**Styling:**
- Use Tailwind CSS for consistent styling across starters
- Follow utility-first CSS principles
- Use Shadcn/ui components for common UI elements
- Implement responsive design patterns
- Maintain consistent design tokens

**Testing:**
- Write tests for component behavior, not implementation
- Mock XM Cloud services in unit tests
- Test error scenarios and edge cases
- Use proper test data that matches XM Cloud structures
- Implement integration tests for critical paths

**Imports:**
- Use relative imports for local modules
- Group imports logically (external, internal, relative)
- Use barrel exports (index.ts) for clean APIs
- Avoid deep import paths
- Use consistent import ordering

**Lint and Format:**
- Keep ESLint + Prettier passing at all times
- Follow configured style rules consistently
- Use automated formatting on save
- Address linting warnings promptly
- Maintain consistent code style across all starters

### Performance Considerations

**Next.js Optimization:**
- Use Next.js Image component for optimized images
- Implement proper ISR patterns for XM Cloud content
- Use dynamic imports for code splitting
- Optimize bundle size with tree shaking
- Implement proper caching strategies

**React Performance:**
- Use useCallback and useMemo appropriately
- Implement proper key props for list rendering
- Avoid unnecessary re-renders
- Use React.lazy for component lazy loading
- Profile performance in development mode

**XM Cloud Performance:**
- Cache XM Cloud API responses appropriately
- Use proper loading states for content fetching
- Implement error boundaries to prevent cascade failures
- Consider content freshness vs. performance trade-offs
- Use proper GraphQL query optimization

## General Coding Principles

### Universal Standards

**DRY Principle:**
- Don't Repeat Yourself - extract common functionality
- Create reusable utilities and helper functions
- Use composition over inheritance
- Share types and interfaces across components

**SOLID Principles:**
- Single Responsibility: each function/component has one purpose
- Open/Closed: extend functionality through composition
- Dependency Inversion: depend on abstractions, not implementations

**Code Clarity:**
- Write self-documenting code with clear intent
- Use meaningful names that express business concepts
- Prefer explicit over implicit behavior
- Make dependencies and requirements obvious

### Architecture Patterns

**Modular Design:**
- Organize code into focused, cohesive components
- Minimize coupling between modules
- Use clear interfaces between layers
- Follow established Next.js and XM Cloud patterns consistently

**Data Flow:**
- Prefer unidirectional data flow
- Validate inputs at component boundaries
- Transform data at appropriate layers
- Handle errors close to their source

**Testing:**
- Write testable code with minimal dependencies
- Use dependency injection for better testability
- Mock external services and XM Cloud APIs
- Test behavior, not implementation details

### Development Standards

**Version Control:**
- Write descriptive commit messages
- Keep commits focused and atomic
- Use branching strategies appropriate to team size
- Review code before merging to dev branch

**Documentation:**
- Document public APIs and component interfaces
- Include usage examples for complex functionality
- Keep documentation close to code
- Update documentation with code changes

**Performance:**
- Optimize for readability first, performance second
- Profile before optimizing
- Cache expensive operations appropriately
- Consider memory usage and cleanup in React components

### Quality Assurance

**Code Review:**
- Review for logic, readability, and maintainability
- Check error handling and edge cases
- Verify tests cover new functionality
- Ensure documentation is updated

**Continuous Integration:**
- All tests must pass before merging
- Linting and formatting checks must pass
- Build process must complete successfully
- No breaking changes without proper migration

## JavaScript/TypeScript Rules

### Naming Conventions

**Variables and Functions:**
- Use camelCase: `handleClick()`, `isActive`, `prefersReducedMotion`
- Boolean variables: prefix with `is`, `has`, `can`, `should`
- Event handlers: prefix with `handle` or `on`: `handleClick`, `handleKeyDown`
- State variables: descriptive names like `activeIndex`, `isExpanding`

**Components (React):**
- Use PascalCase: `ArticleHeader`, `ProductListing`, `VerticalImageAccordion`
- Main component files: `Hero.tsx`, `ProductListing.tsx`
- Component directories: kebab-case like `article-header/`, `product-listing/`

**Constants and Variables:**
- Use UPPER_SNAKE_CASE: `USER_ZIPCODE`, `DEFAULT_TIMEOUT`
- Environment variables: `SITECORE_EDGE_CONTEXT_ID`, `NEXT_PUBLIC_DEFAULT_SITE_NAME`
- Dictionary keys: `dictionaryKeys.HERO_SubmitCTALabel`

**File Naming Patterns:**
- Utilities: `NoDataFallback.tsx`, `date-utils.ts`
- Main components: `ComponentName.tsx`

**Types and Interfaces:**
- Component props: `HeroProps`, `ArticleHeaderProps`, `ProductListingProps`
- Field interfaces: `ArticleHeaderFields`, `HeroFields`
- Parameter interfaces: `ArticleHeaderParams`, `VerticalImageAccordionParams`
- Use `{ [key: string]: any; // eslint-disable-line }` for flexible params

### Code Layout and Organization

**Directory Structure:**
```
src/
  components/          # React components organized by feature
    hero/             # Component directories with variants
      Hero.tsx        # Main component file with props and variants
    article-header/   # Component with complex structure
    product-listing/  # Multi-variant component
    ui/              # Shadcn/ui components
    image/           # Reusable image wrapper
    button-component/ # Button variations
  lib/                # Configuration and utilities
    component-props/  # Shared component props
    constants.ts      # Application constants
    utils.ts          # Common utilities
  utils/              # Helper functions and utilities
    NoDataFallback.tsx # Standard fallback component
    date-utils.ts     # Date formatting utilities
  hooks/              # Custom React hooks
  variables/          # Constants and dictionary keys
  styles/             # Styling files (global CSS)
```

**File Organization:**
- Component directories contain main file, variants, and props
- Main component file should contain variants and rendering logic; keep props/interfaces in sidecar files (`*.props.ts` / `*.props.tsx`)
- Using `.dev.tsx` files for variant implementations is discouraged unless maintainability becomes dificult for the componenent and seperation can not be avoided
- Shared utilities in dedicated directories
- Group UI components in `ui/` subdirectory
- Exclude sidecar props files from component-map generation in each starter `sitecore.cli.config.ts` via `componentMap.exclude`:
  - `src/components/**/*.props.ts`
  - `src/components/**/*.props.tsx`
- After adding or renaming sidecar props files, regenerate maps with `npm run sitecore-tools:generate-map` and verify `.sitecore/component-map.ts` has no props-sidecar registrations.

### Error Handling

**API Calls:**
- Always wrap XM Cloud API calls in try/catch blocks
- Throw custom errors with context: `XMCloudFetchError`, `ComponentRenderError`
- Handle edge cases with guard clauses

```typescript
async function fetchLayoutData(path: string): Promise<LayoutData> {
  if (!path) {
    throw new Error('Path is required for layout data fetch');
  }
  
  try {
    const response = await sitecoreLayoutService.getRouteData(path);
    return response.sitecore.route;
  } catch (error) {
    throw new XMCloudFetchError(`Failed to fetch layout data for path: ${path}`, error);
  }
}
```

### Security

**Input Validation:**
- Sanitize user inputs before processing
- Validate data at application boundaries
- Use type guards for runtime type checking
- Escape content when rendering to prevent XSS

**Environment Variables:**
- Never hardcode sensitive values in source code
- Use environment variables for all configuration
- Validate environment variables at application startup
- Use different .env files for different environments

```typescript
// Environment validation example
const requiredEnvVars = [
  'SITECORE_EDGE_CONTEXT_ID',
  'NEXT_PUBLIC_DEFAULT_SITE_NAME',
  'SITECORE_EDITING_SECRET'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

### Performance

**Optimization Patterns:**
- Cache XM Cloud API responses using React Query or similar caching solutions
- Use React.memo for expensive components
- Lazy-load non-critical modules: `const Component = lazy(() => import('./Component'))`
- Use useCallback and useMemo for expensive operations
- Implement proper loading states for data fetching

**Next.js Specific:**
- Use Next.js Image component for optimized images
- Implement proper ISR (Incremental Static Regeneration) patterns
- Use dynamic imports for code splitting
- Optimize bundle size with proper imports

**TypeScript:**
- Enable strict mode in tsconfig.json
- Prefer type assertions over any: `value as LayoutData`
- Use discriminated unions for complex state management
- Define proper interfaces for XM Cloud data structures

### Documentation

**Import Patterns:**
- Use `type` imports for TypeScript types: `import type React from 'react'`
- Import Sitecore components: `import { Text, RichText, Image, useSitecore } from '@sitecore-content-sdk/nextjs'`
- Import utilities: `import { cn } from '@/lib/utils'`
- Import UI components: `import { Button } from '@/components/ui/button'`
- Import as alias for reusable components: `import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev'`

```typescript
// Standard import pattern for XM Cloud components
'use client'; // When client-side features needed

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Text, RichText, Image, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { ButtonBase } from '@/components/button-component/ButtonComponent';
```

## Sitecore XM Cloud Rules

### XM Cloud Integration

**Environment Configuration:**
- Always use environment variables for XM Cloud endpoints and keys
- Required variables: `SITECORE_EDGE_CONTEXT_ID`, `NEXT_PUBLIC_DEFAULT_SITE_NAME`, `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID`, `SITECORE_EDITING_SECRET`
- Use `.env.remote.example` as template for environment files
- Copy to `.env.local` for local development

```typescript
// Standard environment variables for XM Cloud starters
SITECORE_EDGE_CONTEXT_ID=your-context-id
NEXT_PUBLIC_DEFAULT_SITE_NAME=your-site-name  
NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID=your-public-context-id
SITECORE_EDITING_SECRET=your-editing-secret
```

### Component Architecture Patterns

**Component Structure:**
- Follow Locality of Behavior pattern
- Create a tsx `ComponentName.tsx` with all varaiants of the component as well as the props
- Export named variants: `Default`, `ThreeUp`, `Slider`, `ImageBottom`, etc. from the componenet file

**Prop and Interface Structure:**
- Extend from `ComponentProps` from `@/lib/component-props`
- Use specific interface for component parameters
- Structure fields with `data.datasource` pattern
- Include `isPageEditing` prop for variants

```typescript
import type React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

interface HeroParams {
  [key: string]: any;
}

interface HeroFields {
  title?: { jsonValue: Field<string> };
  subtitle?: { jsonValue: Field<string> };
  backgroundImage?: { jsonValue: ImageField };
}

interface HeroProps extends ComponentProps {
  params: HeroParams;
  fields: {
    data: {
      datasource: HeroFields;
    };
  };
  isPageEditing?: boolean;
}

export const Default: React.FC<HeroProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <HeroDefault {...props} isPageEditing={isEditing} />;
};

export const ImageBottom: React.FC<HeroProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <HeroImageBottom {...props} isPageEditing={isEditing} />;
};
```

### Data Source Validation

**Standard Validation Pattern:**
- Always check `fields?.data?.datasource` existence
- Use `NoDataFallback` component for missing datasources
- Handle both editing and preview modes
- Provide meaningful error messages

```typescript
import { NoDataFallback } from '@/utils/NoDataFallback';

export const HeroDefault: React.FC<HeroProps> = (props) => {
  const { fields, isPageEditing } = props;
  
  if (!fields?.data?.datasource) {
    return <NoDataFallback componentName="Hero" />;
  }
  
  const { title, description, image } = fields.data.datasource;
  
  // Component implementation
};
```

### Field Handling Patterns

**Sitecore Field Components:**
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

**Page Editing Support:**
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

### Styling and UI Patterns

**Tailwind and Shadcn/ui:**
- Use Tailwind CSS utility classes throughout
- Import UI components from `@/components/ui/`
- Use `cn()` utility for conditional classes
- Follow container query patterns with `@container` classes

```typescript
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

<div className={cn(
  '@container bg-primary rounded-default',
  'relative mx-auto my-6 max-w-7xl px-4 py-16',
  isActive && '@md:w-full'
)}>
```

### Utility Integration

**Common Utilities:**
- Use `NoDataFallback` for missing datasources
- Import image wrapper: `Default as ImageWrapper` from `@/components/image/ImageWrapper.dev`
- Use button components: `ButtonBase` from `@/components/button-component/ButtonComponent`
- Implement localization with `useI18n` and `dictionaryKeys`

```typescript
import { NoDataFallback } from '@/utils/NoDataFallback';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { ButtonBase } from '@/components/button-component/ButtonComponent';
import { useI18n } from 'next-localization';
import { dictionaryKeys } from '@/variables/dictionary';
```

### Performance Patterns

**Accessibility and Performance:**
- Use `'use client'` directive for client-side interactivity
- Implement proper ARIA attributes for interactive components
- Use React hooks like `useState`, `useEffect`, `useRef` appropriately
- Check for `prefers-reduced-motion` when using animations

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';

export const InteractiveComponent: React.FC<Props> = (props) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);
  
  // Component implementation
};
```

### Content SDK Import Guidelines

**SDK Submodule Usage:**
- **Main package**: Use for components and client-side functionality
- **Submodules**: Only use appropriate submodules for specific contexts
- **Server-only**: Never import `/config-cli` or `/tools` in client components

**Client-Safe Imports (Components & Client Code):**

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

**Server-Only Imports (Configuration & Build):**

```typescript
// ❌ NEVER in client components
// ✅ ONLY in server-side contexts (sitecore.config.ts, sitecore.cli.config.ts)
import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import { generateSites, generateMetadata, extractFiles } from '@sitecore-content-sdk/nextjs/tools';

// ✅ ONLY in lib/sitecore-client.ts or server utilities
import { SitecoreClient, GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';
```

**API Route Imports (Next.js API routes):**

```typescript
// ✅ SAFE - API routes only (/pages/api/ or /app/api/)
import { SitemapMiddleware, RobotsMiddleware } from '@sitecore-content-sdk/nextjs/middleware';
import { HealthcheckMiddleware } from '@sitecore-content-sdk/nextjs/monitoring';
import { 
  EditingRenderMiddleware, 
  EditingConfigMiddleware, 
  FEAASRenderMiddleware,
  isDesignLibraryPreviewData 
} from '@sitecore-content-sdk/nextjs/editing';

// ✅ SAFE - Utility functions for page routes
import { extractPath, handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
```

**Import Context Rules:**

**Configuration Files:**
- `sitecore.config.ts`: Use `/config` submodule
- `sitecore.cli.config.ts`: Use `/config-cli` and `/tools` submodules
- `next.config.js`: Do not import Content SDK directly

**Component Files:**
- React components: Main package only (`@sitecore-content-sdk/nextjs`)
- Never import `/config-cli`, `/tools`, or `/client` in components

**Server Utilities:**
- `lib/sitecore-client.ts`: Use `/client` submodule for SitecoreClient
- Utility files: Use appropriate submodules based on context

**Page Files:**
- Page components: Main package + `/utils` for path utilities
- API routes: Use `/middleware`, `/editing`, `/monitoring` as needed

```typescript
// Example: Component file structure
// ✅ CORRECT
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';

// ❌ WRONG - will cause build errors
import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
import { SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
```

### Development Patterns

**Component Development Workflow:**
- Follow Locality of Behavior pattern
- Create a tsx `ComponentName.tsx` with all varaiants of the component as well as the props
- Use kebab-case for component directories: `product-listing/`, `article-header/`

**Testing and Validation:**
- Test components with and without datasources
- Verify editing mode behavior
- Test all component variants
- Ensure accessibility compliance

## Next.js Development Patterns

### Configuration

**Next.js Config:**
- Configure i18n for multi-language XM Cloud sites
- Set up proper image domains for XM Cloud media
- Implement rewrites for XM Cloud API routes
- Configure webpack for SCSS and other assets
- Set up proper build optimization

```javascript
// next.config.js pattern
const nextConfig = {
  i18n: {
    locales: ['en', 'en-CA'],
    defaultLocale: process.env.DEFAULT_LANGUAGE || 'en',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edge*.**',
      },
      {
        protocol: 'https',
        hostname: 'xmc-*.**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
};
```

**Environment Variables:**
- Use NEXT_PUBLIC_ prefix for client-side variables
- Validate required environment variables at build time
- Use different .env files for different environments
- Never commit sensitive environment variables

### App Router Pages and Routing

**Catch-All Routes:**
- Use `src/app/[site]/[locale]/[[...path]]/page.tsx` for XM Cloud page routing
- Fetch layout data in the Server Component with `sitecore-client`
- Call `notFound()` when the route does not exist
- Use `draftMode()` and editing search params for preview and Pages Editor

**Pages Router:**
- Only `examples/basic-nextjs-pages-router` uses `src/pages/[[...path]].tsx` with `getStaticProps` / `getServerSideProps`

### API Routes

**XM Cloud Integration:**
- Implement route handlers under `src/app/api/**/route.ts`
- Use Content SDK `createRobotsRouteHandler` and related route-handler helpers where available
- Handle authentication and authorization properly
- Implement proper error handling and logging

```typescript
// src/app/api/robots/route.ts pattern
import { createRobotsRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';

const { GET: sitecoreGET } = createRobotsRouteHandler({ client, sites });

export async function GET(request: NextRequest) {
  return sitecoreGET(request);
}
```

### Proxy (request pipeline)

App Router starters use `src/proxy.ts` with Content SDK proxy classes (`LocaleProxy`, `AppRouterMultisiteProxy`, `RedirectsProxy`, `PersonalizeProxy`). Editing and preview are handled in `page.tsx` via `draftMode()` and Content SDK editing APIs.

```typescript
// src/proxy.ts pattern
import { defineProxy, LocaleProxy, AppRouterMultisiteProxy } from '@sitecore-content-sdk/nextjs/proxy';

export default function proxy(req: NextRequest) {
  return defineProxy(locale, multisite, redirects, personalize).exec(req);
}
```

### Performance Optimization

**Image Optimization:**
- Always use NextImage component from ContentSDK for XM Cloud media as it supports inline editing in editor mode and uses Image component from next internally
- Configure proper image domains and sizes
- Implement lazy loading for below-fold images
- Use proper alt text from XM Cloud fields

**Code Splitting:**
- Use dynamic imports for large components
- Implement route-based code splitting
- Lazy load non-critical functionality
- Optimize bundle size with proper imports

**Caching:**
- Implement proper caching headers for XM Cloud content
- Use ISR for frequently updated content
- Cache API responses appropriately
- Consider CDN caching strategies

### Development Patterns

**TypeScript Integration:**
- Use proper TypeScript configuration
- Define types for XM Cloud data structures
- Implement proper type guards for runtime validation
- Use strict mode for better type safety

**Error Handling:**
- Implement proper error boundaries
- Handle XM Cloud API errors gracefully
- Provide meaningful error messages to users
- Log errors appropriately for debugging

**Testing:**
- Write tests for page components and API routes
- Mock XM Cloud services in tests
- Test error scenarios and edge cases
- Use proper test data that matches XM Cloud structures

### App Router (Next.js 13+)

**Server Components:**
- Use Server Components for XM Cloud data fetching
- Implement proper loading and error handling
- Handle streaming for better user experience
- Use Client Components only when necessary

**Layout Files:**
- Create proper layout hierarchy
- Handle XM Cloud navigation and footer
- Implement proper SEO meta tags
- Support multi-language layouts

### Deployment

**Build Optimization:**
- Optimize for XM Cloud deployment environment
- Handle environment-specific configurations
- Implement proper health checks
- Monitor build performance and size

**XM Cloud Integration:**
- Configure proper rendering host settings
- Handle XM Cloud deployment pipelines
- Implement proper monitoring and logging
- Support blue-green deployment patterns

## Testing Patterns

### Testing Strategy

**Component Testing:**
- Test component rendering with various XM Cloud field configurations
- Mock XM Cloud services and API calls
- Test error scenarios (missing fields, API failures)
- Verify proper handling of editing vs. preview modes
- Test responsive behavior and accessibility

**Integration Testing:**
- Test complete page rendering with XM Cloud data
- Verify API route functionality
- Test middleware behavior for XM Cloud integration
- Validate environment variable handling
- Test deployment and build processes

### Testing Tools

**Recommended Stack:**
- **Jest** or **Vitest** for unit testing
- **React Testing Library** for component testing
- **MSW (Mock Service Worker)** for API mocking
- **Playwright** or **Cypress** for E2E testing
- **Storybook** for component documentation and testing

**XM Cloud Mocking:**
- Create mock data that matches XM Cloud field structures
- Mock layout service responses
- Simulate both connected and disconnected modes
- Test with various content scenarios

```typescript
// Mock XM Cloud field data
const mockHeroFields = {
  title: { value: 'Test Hero Title', editable: false },
  subtitle: { value: 'Test Hero Subtitle', editable: false },
  backgroundImage: {
    value: {
      src: '/test-image.jpg',
      alt: 'Test Image',
      width: 1200,
      height: 600,
    },
    editable: false,
  },
};
```

### Component Testing Patterns

**Field Validation Testing:**
- Test components with missing fields
- Test components with empty field values
- Test components with various field types
- Verify proper fallback rendering

```typescript
// Component test example
describe('Hero Component', () => {
  it('renders with all fields present', () => {
    render(<Hero fields={mockHeroFields} />);
    
    expect(screen.getByText('Test Hero Title')).toBeInTheDocument();
    expect(screen.getByText('Test Hero Subtitle')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Image');
  });
  
  it('handles missing fields gracefully', () => {
    render(<Hero fields={{}} />);
    
    expect(screen.getByText(/content not configured/i)).toBeInTheDocument();
  });
});
```

### API Testing

**XM Cloud API Mocking:**
- Mock layout service responses
- Test error handling for API failures
- Verify proper caching behavior
- Test authentication and authorization

```typescript
// API route test example (App Router)
import { GET } from '@/app/api/robots/route';

describe('/api/robots', () => {
  it('returns robots.txt content', async () => {
    const response = await GET(new Request('http://localhost/api/robots'));
    
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/plain');
  });
});
```

### E2E Testing

**Page Testing:**
- Test complete user journeys
- Verify XM Cloud content rendering
- Test navigation and routing
- Validate responsive design
- Test accessibility compliance

**Performance Testing:**
- Test page load times
- Verify image optimization
- Test bundle size impact
- Monitor Core Web Vitals

```typescript
// Playwright E2E test example
test('homepage loads and displays content', async ({ page }) => {
  await page.goto('/');
  
  // Wait for XM Cloud content to load
  await page.waitForSelector('[data-testid="hero-component"]');
  
  // Verify content is displayed
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('nav')).toBeVisible();
});
```

### Test Data Management

**XM Cloud Test Data:**
- Create realistic test data that matches XM Cloud structures
- Use factories for generating test data
- Maintain test data consistency across tests
- Update test data when XM Cloud schemas change

```typescript
// Test data factory
export const createMockLayoutData = (overrides = {}) => ({
  sitecore: {
    context: {
      pageEditing: false,
      language: 'en',
      site: { name: 'test-site' },
    },
    route: {
      name: 'Test Page',
      displayName: 'Test Page',
      fields: {},
      placeholders: {},
      ...overrides,
    },
  },
});
```

### Testing Commands

**Package Scripts:**
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:ci` - Run all tests in CI mode

**Coverage Requirements:**
- Tests should be comprehensive enough to cover business logic and to validate that sites and componenets are working as intended
- Ensure different rendering options and  scenarios are considered such as Design Library, Page Editor, Preview mode, Hosted Vercel Sites and Local Deployments
- Test error scenarios and edge cases
- Maintain test quality over quantity

### Continuous Integration

**CI/CD Testing:**
- Run all tests on pull requests
- Generate coverage reports
- Test against multiple Node.js versions
- Validate build processes
- Check for accessibility violations

**Quality Gates:**
- All tests must pass before merging
- Coverage thresholds must be met
- No linting errors allowed
- Performance budgets must be maintained
- Security scans must pass

## Safety Rules

### Do Not Edit Compiled Artifacts

Never edit compiled or generated files:
- **Node modules**: `node_modules/` contains installed packages
- **Build outputs**: `.next/`, `dist/`, `out/`, `build/` are generated during build
- **Cache directories**: `.cache/`, `.sitecore/` (except component-map.ts)
- **Lock files**: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
- **Source maps**: `*.js.map`, `*.css.map`, `*.d.ts.map`

### Do Not Edit Configuration Files

Avoid modifying sensitive configuration:
- **Sitecore configs**: `scjssconfig.json`, `.sitecore/user.json`
- **Docker files**: `Dockerfile`, `docker-compose*.yml`
- **CI/CD configs**: `.github/workflows/`, deployment configurations

### Do Not Edit Package Files

Never modify package artifacts:
- **Sitecore packages**: `*.itempackage`, `*.sicpackage`
- **Archive files**: `*.tgz`, `*.tar.gz`, `*.zip`
- **Binary files**: `*.exe`, `*.dll`, `*.obj`

### Do Not Edit Environment Files

Never commit or edit sensitive environment files:
- **Local environment**: `.env.local`, `.env.*.local`
- **Secret files**: `*.deploysecret.config`
- **User-specific configs**: `.sitecore/user.json`

### Source Files Only

Focus editing on:
- **Source code**: `.ts`, `.tsx`, `.js`, `.jsx` files in `src/`
- **Configuration**: `next.config.js`, `tsconfig.json`, `package.json`
- **Documentation**: `README.md`, `CONTRIBUTING.md`
- **Styles**: `.css`, `.scss` files
- **Component maps**: `.sitecore/component-map.ts`

### When in Doubt

If unsure whether to edit a file:
1. Check if it's in `node_modules/` - never edit
2. Check if it's generated during build - never edit
3. Check if it contains secrets - never edit
4. Ask yourself: "Did I create this file?" - if no, be cautious
