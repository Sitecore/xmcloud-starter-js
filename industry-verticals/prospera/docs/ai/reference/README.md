# AI reference sources  
  
This folder contains internal/project-specific AI references.  
  
## Expected contents  
- `sitecore-marketer-mcp-reference.md`:  
  project-specific notes for using the Sitecore marketer MCP,  
  common Sitecore item paths,  
  local conventions,  
  and known working patterns.  
  
## External tools used by agents  
- `sitecore-documentation-docs` MCP:  
  use when official Sitecore product behavior needs verification.  
- `sitecore marketer` MCP:  
  use to create/update Sitecore items whenever possible.  
  
## Priority  
1. Repo rules (`docs/ai/rules/`, referenced by `.cursor/rules/` and `CLAUDE.md`)  
2. Shared skill docs under `docs/ai/skills`  
3. Internal project references in this folder  
4. Official docs via `sitecore-documentation-docs` MCP  
5. Examples under `docs/ai/examples`  
  
Project-specific conventions override generic examples.  
Official Sitecore mechanics should be checked with the docs MCP when uncertain.  