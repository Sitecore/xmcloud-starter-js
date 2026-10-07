# Example: Hero simple component  
  
## User request  
Create a Hero component for `mysite`.  
  
Fields:  
- Title (Single-Line Text)  
- Description (Rich Text)  
- BackgroundImage (Image)  
- CtaLink (General Link)  
  
## Expected classification  
- simple datasource component  
  
## Expected behavior  
- create one datasource template  
- create `__Standard Values`  
- create a folder template  
- create a content folder under `/Data`  
- create a JSON Rendering  
- do NOT create `ComponentQuery`  
- create the React component under:  
  - `src/components/uiim/banners/Hero.tsx`  
- React should use Tailwind + shadcn/ui  
- React should use default JSS field shape:  
  - `fields.Title`  
  - `fields.Description`  
  - `fields.BackgroundImage`  
  - `fields.CtaLink`  
- update the component map  
- use the Sitecore marketer MCP for Sitecore item creation  