---
name: sitecore-validate-manifest
description: Validate the Sitecore manifest against live Sitecore state and auto-repair what can be fixed. Use when starting a new session, after an environment switch, when a demo build fails, or when the user says "validate manifest", "sync manifest", or "check manifest". Runs Quick mode by default (7 MCP calls, ~15s). Use Full mode for deep per-component validation (~80-100 MCP calls, ~3-5 min).
---

Read and follow `docs/ai/skills/sitecore-validate-manifest.md` in full before proceeding.

Key files:
- `docs/ai/config/project.yaml` — source of truth for site identity
- `docs/ai/manifests/sitecore-manifest.yaml` — the manifest to validate
- `.sitecore/component-map.ts` — component registrations to cross-check

Modes:
- **Quick** (default): config consistency, root paths, React files, component map
- **Full** (on request or Quick failure): per-component template/rendering/folder/variants/example items

Auto-fixes: ID drift, missing datasource folders, missing example items, missing variants, stale manifest paths.
Human intervention: deleted templates/renderings, missing React files, Available Renderings verification, root path failures.
