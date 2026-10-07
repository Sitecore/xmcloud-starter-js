# Example: PageHero context-only component  
  
## User request  
Create a PageHero component for `mysite`.  
  
This component should read content from the existing route/page fields on the `Content Page` template.  
  
Route fields:  
- EyebrowText (Single-Line Text)  
- Title (Single-Line Text)  
- Description (Rich Text)  
- HeroImage (Image)  
- PrimaryLink (General Link)  
  
## Expected classification  
- context-only component  
  
## Expected behavior  
- create a JSON Rendering  
- do NOT create a datasource template  
- do NOT create a child template  
- do NOT create a folder template  
- do NOT create a datasource content folder  
- do NOT create `ComponentQuery`  
- create the React component under:  
  - `src/components/uiim/page/page-hero.tsx`  
- React should use Tailwind + shadcn/ui  
- React should use:
  - `useSitecore()` (SDK 2.0)
  - `page?.layout?.sitecore?.route?.fields` (or `page` from `ComponentProps`)  
- use Sitecore JSS helpers for editable route fields  
- update the component map  
- if the route fields do not already exist, ask before changing the page template  
- use the Sitecore marketer MCP for rendering item creation  
- use the sitecore-documentation-docs MCP if official Sitecore behavior needs verification  