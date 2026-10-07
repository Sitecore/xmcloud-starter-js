# Sitecore Content Resolvers Reference

## What are Content Resolvers?

Content Resolvers (also called Rendering Contents Resolvers) control how a rendering's data is resolved and passed to the component's `fields` prop. They replace or augment the default behavior where `fields` comes from the datasource item's fields.

Content resolvers are configured on the **rendering item** in the `Rendering Contents Resolver` field.

## When to use

| Data strategy | When to use | Configured on |
|---|---|---|
| **Default (no resolver)** | Simple components with a datasource template | Rendering has `Datasource Template` set |
| **ComponentQuery** | List components needing parent/child data | Rendering has `ComponentQuery` field set |
| **Content Resolver** | Components needing specialized data (navigation trees, folder children, context data) | Rendering has `Rendering Contents Resolver` field set |

## Available Built-in Resolvers

### Context Item Resolver
- Returns the current page/route item's fields
- Use for components that render page-level data
- `fields` shape: same as route fields (`fields.Title`, `fields.Description`, etc.)

### Navigation Contents Resolver
- Returns a navigation tree starting from the Data Source item
- Use for navigation components (headers, sidebars, breadcrumbs)
- `fields` shape: array of navigation items, each with `Id`, `Href`, `NavigationTitle`, `Children`, `Styles`
- **Data Source must be set** on the component instance to the navigation root item (e.g., Home)

### Folder Children Resolver
- Returns child items of the Data Source folder
- Use when you need a flat list of items from a specific folder

### GraphQL Resolver
- Executes a custom GraphQL query defined in the resolver
- Alternative to ComponentQuery for complex queries

## Navigation Contents Resolver — detailed reference

This is the most commonly used resolver for demo templates.

### Configuration
1. Set `Rendering Contents Resolver` on the rendering item to the Navigation Contents Resolver item
2. Set `Data Source` on each component instance to the navigation root item

### Props shape

```typescript
interface NavField {
  Id: string;
  Styles: string[];
  Href: string;
  Querystring: string;
  DisplayName?: string;
  Title?: TextField;
  NavigationTitle?: TextField;
  Children?: NavField[];
}

// fields arrives as an array or object with numeric keys
type NavigationFields = NavField[] | Record<string, NavField>;
```

### Normalization pattern

```typescript
function getNavItems(fields: NavField[] | Record<string, NavField>): NavField[] {
  if (!fields) return [];
  if (Array.isArray(fields)) return fields;
  return Object.values(fields).filter((f) => f && typeof f === 'object' && 'Href' in f);
}
```

### Rendering configuration

The rendering item should have:
- `Datasource Template`: **empty** (no datasource template needed)
- `Datasource Location`: **empty**
- `ComponentQuery`: **empty**
- `Rendering Contents Resolver`: set to Navigation Contents Resolver
- `Data Source` is set per-instance at placement time

### Example: NavigationHeader

```
Rendering: NavigationHeader
  - Rendering Contents Resolver: Navigation Contents Resolver
  - Data Source: (empty on rendering, set per-instance to Home item)
  - Datasource Template: (empty)
  - ComponentQuery: (empty)
```

## Content Resolver vs ComponentQuery vs getComponentServerProps

| Feature | Content Resolver | ComponentQuery | getComponentServerProps |
|---|---|---|---|
| Where configured | Rendering item field | Rendering `ComponentQuery` field | Component module export |
| Runs on | Layout Service (server) | Layout Service (server) | App server (SSR) |
| Data source required | Usually yes (resolver root) | Yes (query root) | No |
| GraphQL query needed | No (built-in logic) | Yes (custom query) | Optional |
| Works in editing mode | Yes | Yes (if schema is ready) | Depends on setup |
| Caching | Layout Service cache | Layout Service cache | App-level cache |
| Best for | Navigation, context data | Parent/child datasources | External APIs, complex logic |

## Lesson learned

For the NavigationHeader component, we initially tried `getComponentServerProps` with Edge GraphQL, which required knowing the exact endpoint URL and API key format. The Navigation Contents Resolver is the standard Sitecore mechanism — it provides nav data directly in `fields` without custom server-side code, works in both editing and delivery modes, and is the recommended approach for navigation components.
