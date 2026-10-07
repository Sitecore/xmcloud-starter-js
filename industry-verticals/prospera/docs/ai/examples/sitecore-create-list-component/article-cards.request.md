# Example: ArticleCards list component  
  
## User request  
Create an ArticleCards component for `mysite`.  
  
Parent template:  
- ArticleCards  
- Title (Single-Line Text)  
  
Child template:  
- ArticleCard  
- Title (Single-Line Text)  
- Image (Image)  
- Link (General Link)  
- BadgeText (Single-Line Text)  
  
## Expected classification  
- list / parent-child datasource component  
  
## Expected behavior  
- create parent template  
- create child template  
- create `__Standard Values` for both  
- parent `__Standard Values` should set `__Masters` to child template  
- parent should inherit `_HorizonDatasourceGrouping`  
- create folder template  
- create content folder under `/Data`  
- create JSON Rendering  
- create valid `ComponentQuery`  
- create the React component under:  
  - `src/components/uiim/cards/ArticleCards.tsx`  
- React should use Tailwind + shadcn/ui  
- React should use:  
  - `fields.data.datasource`  
  - `fields.data.datasource.children.results`  
  - `.jsonValue`  
- update the component map  
- use the Sitecore marketer MCP for Sitecore item creation  