# Repository agent instructions

This repository is a fork (`FMC-ORG/custom-demo`) of Sitecore's XM Cloud front-end starter kits. Applies to Claude Code, Cursor, and Pi; `CLAUDE.md` imports this file.

## Where to work

| Path | What it is |
|---|---|
| `examples/basic-nextjs/` | **The active app** — the SitecoreAI Demo Builder rendering host (the only host enabled in `xmcloud.build.json`). Its own `AGENTS.md` holds the project rules, skills, and MCP setup and **takes precedence** for anything under that folder. Start agents from that folder. |
| `examples/*` (others) | Upstream reference starters, not deployed. Their conventions are documented in `docs/ai-guidance/starter-kits-guide.md`; read it only when working on those starters. |
| `authoring/` | Sitecore serialization modules (`items/**/*.module.json`) and the platform project |
| `integrations/auto-translate-function/` | Azure Function that AI-translates pages approved in Sample Workflow. Deployed **by hand**, not by CI: its `README.md` ("Maintaining and deploying") is the runbook for changes, deploys, logs, rollback and secrets. |
| `local-containers/` | Docker setup for a local Sitecore stack |
| `xmcloud.build.json` | Rendering host configuration for XM Cloud Deploy |

## Repo-wide rules

- **Git:** work on feature branches; pull requests follow `.github/DMZ-WORKFLOW.md`. Keep commits focused.
- **Upstream scope:** this fork is not upstream. Do not frame fork-specific work (demo builder, new starters, client demos) as upstream contributions — see `CONTRIBUTING.md`.
- **Never edit by hand:** `node_modules/`, build output (`.next/`, `dist/`, `out/`), lock files (let npm update them), generated agent files (see the app's `AGENTS.md`).
- **Ask first before changing:** `.github/workflows/`, Docker files, `xmcloud.build.json`, serialized Sitecore items under `authoring/items/`.
- **Secrets:** never commit or print `.env*` values, `*.local.*` files, credentials, or tokens.
