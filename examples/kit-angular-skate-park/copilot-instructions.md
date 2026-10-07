# GitHub Copilot Instructions for Sitecore Content SDK Angular Project

## Project Purpose and Tech Stack

This is a **Sitecore Content SDK** application built with **Angular** and **TypeScript**. It is the Angular Skate Park starter. Pages are server-rendered and served by Express. The app follows Sitecore patterns for SitecoreAI (XM Cloud): layout service data, placeholders, editing, preview, multisite, redirects, and personalization.

### Key Technologies
- **Angular 21** with **Angular SSR**
- **Sitecore Content SDK for Angular** (`@sitecore-content-sdk/angular`)
- **TypeScript**
- **Express** for the production server (`src/server.ts`)
- **Tailwind CSS**
- **ngx-translate** for the Sitecore dictionary

## Coding Standards

### TypeScript Standards
- Prefer explicit field types from the Content SDK over `any`
- Define a fields interface for each component
- Use computed signals when reading Sitecore fields, matching the components already in `src/app/components`

### Naming Conventions
- **Variables/Functions**: camelCase (`getClient()`, `titleField`)
- **Components**: PascalCase class, kebab-case file (`TitleComponent` in `title.component.ts`)
- **Selectors**: `app-` prefix (`app-title`)
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase (`TitleFields`, `RouteFields`)

### Modular Layout
```
src/
  app/
    components/        # Sitecore renderings
    pages/             # Page, not-found, and error routes
    shared/            # Layout component
    app.routes.ts      # Locale matcher and catch-all page route
    app.config.ts      # Router, Sitecore providers, dictionary
  content-sdk/
    client/            # SitecoreClient singleton
    loaders/           # page, dictionary, 404, 500 loaders
  assets/              # Global and per-component CSS
  environments/        # Generated from .env (do not edit by hand)
  server.ts            # Express SSR, editing, sitemap, personalization
sitecore.config.ts
sitecore.cli.config.ts
```

## Library Usage

### @sitecore-content-sdk/angular
- Create the client with `getClient()` so it is not constructed at build time before credentials exist
- Load pages in `pageLoader`, not from a component
- Resolve route data with `loaderResolver('page')` and `loaderResolver('dictionary')`

```typescript
import { getClient } from '../client/sitecore-client';

const page = await getClient().getPage(path, { locale, site });
```

### Angular Component Patterns
- Standalone components with an inline `template`
- Import only the Sitecore directives the template uses
- Extend `SxaComponent` for standard renderings
- Use `@if` and `@for` instead of `*ngIf` and `*ngFor`

### Sitecore Field Directives
- Render text with `*scText`, rich text with `*scRichText`, and links with `*scLink`
- Render placeholders with `<sc-placeholder>`
- Check the field before binding it
- When a field is missing, render the field name in brackets, as the other components do

```html
@if (contentField(); as content) {
  <div *scRichText="content"></div>
} @else {
  [Content]
}
```

## Example Patterns

### Page route
The catch-all route lives behind `scLocaleMatcher`. Loaders attach `page` and `dictionary` to the route data. `PageComponent` reads that data and passes the page into `LayoutComponent`.

Do not add a second catch-all. Error routes (`404` and `500`) stay declared both with and without a locale segment so Angular SSR can return the right status code.

### Sitecore rendering
```typescript
@Component({
  selector: 'app-title',
  imports: [ScTextDirective],
  host: {
    '[attr.class]': "('component title ' + styles().trim())",
    '[attr.id]': 'renderingId()',
  },
  template: `
    <div class="component-content">
      @if (titleField(); as title) {
        <span *scText="title"></span>
      }
    </div>
  `,
})
export class TitleComponent extends SxaComponent {}
```

New files under `src/app/components` are included by `sitecore.cli.config.ts`. Exclude `**/*.spec.ts`. Run `npm run sitecore-tools:generate-map` after adding a rendering (dev already watches the map).

### Layout placeholders
```html
<sc-placeholder name="headless-header" [rendering]="scRoute()!"></sc-placeholder>
<sc-placeholder name="headless-main" [rendering]="scRoute()!"></sc-placeholder>
<sc-placeholder name="headless-footer" [rendering]="scRoute()!"></sc-placeholder>
```

### Error handling
- `pageLoader` throws `NotFoundNavigationError` when Sitecore returns no page
- Navigation errors are handled by `handleNavigationError()` on the router
- The not-found page is `/404` and the error page is `/500` (`provideSitecoreAngular` in `app.config.ts`)

### Configuration
`sitecore.config.ts` calls `defineConfig` from `@sitecore-content-sdk/angular/config`. Client-safe values come from generated `environment` files (`CSDK_PUBLIC_*`). Server-only values stay on `process.env`.

```typescript
import { defineConfig } from '@sitecore-content-sdk/angular/config';
import { environment } from './src/environments/environment';

export default defineConfig({}, environment);
```

Do not hand-edit `src/environments/environment.dev.ts` or `environment.prod.ts`. Change `.env` and rerun `npm run gen:env:dev` or `npm run gen:env:prod`.

### Internationalization
- Locales come from `scConfig.angular.locales`
- `LocaleUrlSerializer` keeps links locale-aware
- Dictionary phrases use `SitecoreTranslateLoader` with `@ngx-translate/core`
- Set the default language with `CSDK_PUBLIC_SITECORE_DEFAULT_LANGUAGE`

## Server Endpoints
Implemented in `src/server.ts`:

- `GET /healthz`
- `POST /api/revalidate` (optional `x-revalidate-secret` when `SITECORE_REVALIDATE_SECRET` is set)
- `GET /sitemap.xml`, `GET /sitemap-{id}.xml`, and `GET /robots.txt`
- `GET /api/editing/config`, `GET /api/editing/experimental`, and `POST /api/editing/render`
- `POST /_data` for client navigations

## Development Workflow

1. **Install dependencies**: `npm install`
2. **Configure environment**: copy `.env.example` to `.env` and fill in Sitecore values
3. **Start development**: `npm run dev`
4. **Lint**: `npm run lint`
5. **Build for production**: `npm run build`
6. **Serve the SSR build**: `npm run serve:ssr`

Cloud deploy uses editing host name `angularstarter`, build command `build`, and run command `serve:ssr` (`xmcloud.build.json` at the repository root).

## Best Practices

### Angular SSR
- Keep data fetching in loaders
- Leave client hydration off. `app.config.ts` disables it so `RouterLink` listeners attach after bootstrap
- Add Express middleware in `src/server.ts` when the behavior must run before Angular renders (redirects, personalization, editing)

### Security
- Never commit `.env` or `.env.dev`
- Only `CSDK_PUBLIC_*` values are safe to expose to the browser
- Keep API keys and the revalidate secret unprefixed so they stay on the server

### Code Quality
- Match the SXA class names already used (`component`, `component-content`, field classes)
- Put component CSS in `src/assets/components` and import it from the existing CSS entry
- Test behavior with `npm test` when specs exist
- Run `npm run lint` before committing
