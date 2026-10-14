---
name: get-site-ia
description: Extract a website's information architecture (Home / L1 / L2 / L3 navigation) into an indented markdown IA spec for sitecore-create-ia. Use when the user asks to "get site IA", "extract IA", "map the navigation", "build IA from URL", or produce a docs/ai/ia/*-ia.md file before creating Sitecore pages.
---

Read and follow `docs/ai/skills/get-site-ia.md` in full before proceeding.

This skill analyzes a client website's main navigation and writes a creatable-item
tree to `docs/ai/ia/<client-kebab>-ia.md` in the exact format consumed by
`sitecore-create-ia`.

**Does not create Sitecore items.** Output is the IA markdown file only.
Hand off to `sitecore-create-ia` after the user confirms the tree.
