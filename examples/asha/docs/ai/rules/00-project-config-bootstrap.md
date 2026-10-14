# Project config bootstrap

Before starting any Sitecore component task, read:

```
docs/ai/config/project.yaml
```

## If the file exists

Read and extract all fields. Then derive the following:

| Variable | Derivation |
|---|---|
| `dataRoot` | `/sitecore/content/<siteCollection>/<siteName>/Data` |
| `projectFoldersRoot` | `projectTemplatesRoot` + `/Folders` |
| `renderingParamsRoot` | `projectTemplatesRoot` + `/Rendering Parameters` |

The fields `renderingsRoot` and `projectTemplatesRoot` are read directly from the file.
If either is missing from the file, fall back to the defaults:

- `renderingsRoot` default: `/sitecore/layout/Renderings/Project/<siteCollection>`
- `projectTemplatesRoot` default: `/sitecore/templates/Project/<siteCollection>`

The SDK is always `@sitecore-content-sdk/nextjs` — use this directly for all React component imports.

## If the file does not exist

The project has not been configured yet. Ask the user the following questions before proceeding:

1. **siteCollection** — the XM Cloud site collection name (e.g. `new`)
2. **siteName** — the site name within the collection (e.g. `fmc`)
3. **sdk** — always `@sitecore-content-sdk/nextjs` (this project does not use the legacy JSS SDK)
4. **renderingsRoot** — renderings path if non-standard (press Enter to use default)
5. **projectTemplatesRoot** — templates path if non-standard (press Enter to use default)

Then create `docs/ai/config/project.yaml` with those values and proceed with the task.

## Then read the manifest

After loading project config, also read:

```
docs/ai/manifests/sitecore-manifest.yaml
```

If it does not exist, create it from the template and populate the `project` block from `project.yaml`.
See rule `05-sitecore-manifest` for details.

## Then check for credentials (demo builds only)

For demo builds (not component creation), also check:

```
docs/ai/config/credentials.local.yaml
```

This file is **gitignored** and stores Content Hub credentials for image uploads.
If it exists and `contentHub.host` is populated, the agent can automate image uploads.
If it doesn't exist, the agent will ask during Phase 0 and create it.

This file is optional — if the user declines to provide credentials, images fall back to manual upload.

## Do not skip this step

Never assume `siteCollection`, `siteName`, `sdk`, `renderingsRoot`, or `projectTemplatesRoot` from memory, from example files, or from other components in the repo.

Always read `docs/ai/config/project.yaml` first, then the manifest.
