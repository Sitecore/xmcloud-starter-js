---
name: skinned-demo-setup
description: >-
  Sets up a skinned Sitecore demo from ProsperaFinancial (or another chosen base
  site): selects or creates a Site Collection, duplicates/renames a Site via Sites
  API, prompts Content Editor move when needed while copying an industry-verticals
  source folder to a customer-named folder, wires .env.local and xmcloud.build.json,
  optionally creates an XM Cloud editing host, then hands off to sitecore-build-demo.
  Tracks progress in setup-progress.yaml for resume. Use when the user asks for
  Skinned Demo Setup, a skinned demo, Prospera skin, to scaffold a customer demo
  from ProsperaFinancial, or to resume a stalled skinned demo setup.
disable-model-invocation: true
---

# Skinned Demo Setup

Scaffold a customer skinned demo from a base XM Cloud site (default **ProsperaFinancial**) and its matching **`industry-verticals/<source-folder>`** codebase (default **`prospera`**).

## Progress file (source of truth)

Mirror the Prospera `demo-progress.yaml` pattern:

| Item | Path |
|---|---|
| Template | [setup-progress.template.yaml](setup-progress.template.yaml) |
| Per-run file | `.cursor/skills/skinned-demo-setup/runs/<customer-folder>/setup-progress.yaml` |

**Rules:**

1. **Create** the progress file as soon as customer name / folder are known (after Inputs). Copy the template; fill `customer.*` and set `steps.inputs.status: "complete"`.
2. **Update** after every meaningful step: set the step’s `status`, IDs under `selection` / `artifacts`, and `customer.lastUpdatedAt` (ISO-8601). Append a short line to `notes` when waiting on the user or recovering from failure.
3. **Never store secrets** (JWTs, client secrets, passwords). IDs, names, paths, and statuses only.
4. **Do not re-run** steps with `status: "complete"` or `"skipped"` unless the user explicitly asks to redo them.
5. On Step 2 handoff, set `steps.step2_build_demo.status: "handed_off"`. Further resume of the demo build uses the customer app’s `docs/ai/demos/<client-kebab>/demo-progress.yaml` from `sitecore-build-demo`.

### Running plan / summary (chat)

After Inputs (and on every resume), show a short plan in chat:

```
Skinned Demo Setup — <customer name>
Done: <list complete/skipped steps>
Next: <first pending/partial/failed step>
Blocked: <notes waiting on user, if any>
```

Update that summary when a major step completes or when pausing for user action (e.g. Content Editor move, editing-host opt-in).

## Resume a skinned demo setup

If the user says **"resume skinned demo"**, **"continue setup"**, **"pick up where we left off"**, or a previous session was interrupted:

1. Find the progress file under `.cursor/skills/skinned-demo-setup/runs/*/setup-progress.yaml` (ask which customer if several).
2. Load session variables from `customer`, `selection`, and `artifacts`.
3. Find the last step with `status: "complete"` or `"skipped"`.
4. Resume at the first step with `status: "pending"`, `"failed"`, or (for move) still waiting — read `notes` / `error`.
5. Show the running plan summary (Done / Next / Blocked) and confirm before continuing.
6. **Do not re-run completed steps.** Re-auth (Sites API / Marketer MCP) if tokens may have expired, even when `preflight_auth` was complete.

If Step 2 is `handed_off` or `complete`, resume inside the customer folder via `sitecore-build-demo` and its `demo-progress.yaml`, not by redoing Step 1.

## Inputs (required)

Collect before any work:

1. **Customer name** — used for Site name, optional new Site Collection name, local folder name, and Step 2 demo build
2. **Customer URL** — passed to Step 2 / `sitecore-build-demo` (content extraction and theme scraping)
3. **Screenshot of the customer’s homepage** — required; passed to Step 2 / `sitecore-build-demo` as the primary visual reference. Accept an attached image, a local file path, or ask the user to upload one. Do not proceed without a screenshot.

Derive names:

| Use | Rule |
|---|---|
| Site Collection / Site system `name` | Sanitize to Sites API pattern: letters, digits, `_`, `-`, spaces; no leading/trailing space or leading `-`. Prefer PascalCase or spaced display-friendly form matching the customer name. Max 50 for site rename, 100 for collection. |
| Local folder (`<customer-folder>`) | Prefer lowercase kebab-case under `industry-verticals/` (e.g. `Acme Bank` → `acme-bank`). If that path exists, ask before overwriting. |

Confirm derived names with the user once, then:

1. Create `.cursor/skills/skinned-demo-setup/runs/<customer-folder>/setup-progress.yaml` from the template.
2. Set `customer.name`, `customer.systemName`, `customer.folder`, `customer.url`, `customer.screenshotPath`, `customer.startedAt`, and `steps.inputs.status: "complete"`.
3. Show the running plan summary in chat.
4. Proceed (or, if a progress file already exists for this folder, offer to **resume** instead of starting over).

## Session variables

Resolve these before Step 1a and persist them into `selection` in the progress file (do not keep hardcoding Prospera after selection):

| Variable | Meaning | Default |
|---|---|---|
| `<collection-mode>` | `new` or `existing` | — (ask) |
| `<customer-collection>` | Target collection system name | Customer name (if new) |
| `<collectionId>` | Target collection id | From create or user pick |
| `<source-site-name>` | Site to duplicate | `ProsperaFinancial` |
| `<source-site-id>` | Id of source site | From Sites API / MCP |
| `<source-collection-id>` | Collection that currently owns the source site | From Sites API |
| `<source-folder>` | Local codebase under `industry-verticals/` | `prospera` |
| `<needs-move>` | `true` if `<source-collection-id>` ≠ `<collectionId>` | Computed |

## Progress checklist

Keep the chat checklist and `setup-progress.yaml` `steps.*` in sync:

```
Skinned Demo Setup
- [ ] Inputs collected (customer name + URL + homepage screenshot)
- [ ] Pre-flight: Sites API auth
- [ ] Pre-flight: Marketer MCP auth
- [ ] Collection mode chosen (new vs existing)
- [ ] Source site + source folder resolved
- [ ] Source site and industry-verticals/<source-folder> verified
- [ ] Step 1a: Target collection ready (created or selected)
- [ ] Step 1a: Site duplicated from <source-site-name>
- [ ] Step 1a: Site renamed to customer name
- [ ] User notified of Content Editor move if <needs-move> — continue without waiting
- [ ] Step 1b: Local folder copied from <source-folder>
- [ ] Step 1c: NEXT_PUBLIC_DEFAULT_SITE_NAME set in customer .env.local
- [ ] Step 1c: xmcloud.build.json renderingHosts entry added
- [ ] Move verified (or skipped if !<needs-move>)
- [ ] Step 1d: Editing host (skipped or created)
- [ ] Step 1 verification complete
- [ ] Step 2: Invoked sitecore-build-demo in customer folder
```

After each checklist item completes, update the matching `steps.*` entry in `setup-progress.yaml`.

---

## Pre-flight (auth)

Run auth checks first. **Stop on any failure.**

### A. Authenticate to Sites API

Docs: [Sites API](https://api-docs.sitecore.com/sai/sites-api)

1. Resolve automation credentials (env preferred; prompt if missing):
   - `SITECORE_AUTOMATION_CLIENT_ID`
   - `SITECORE_AUTOMATION_CLIENT_SECRET`
   - Optional: `SITECORE_ENVIRONMENT_ID` (pass as `environmentId` query param when set)
2. Request JWT:

```bash
curl -s -X POST 'https://auth.sitecorecloud.io/oauth/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'client_id=...' \
  --data-urlencode 'client_secret=...' \
  --data-urlencode 'grant_type=client_credentials' \
  --data-urlencode 'audience=https://api.sitecorecloud.io'
```

3. Verify with `GET https://xmapps-api.sitecorecloud.io/api/v1/sites` and `Authorization: Bearer {token}`.
4. On `401`, re-auth and retry once. If still failing, stop and ask the user to fix credentials (Organization Admin/Owner automation client in SitecoreAI Deploy).

Never commit client secrets. Prefer env / session memory for the JWT (valid ~24h).

### B. Authenticate to Marketer MCP

Docs: [Sitecore Marketer MCP server](https://doc.sitecore.com/sai/en/users/sitecoreai/sitecore-marketer-mcp-server.html#cursor-ide)

1. If the Marketer MCP namespace reports `needsAuth`, call its `mcp_auth` tool and wait for the user to complete browser auth / tenant selection.
2. Verify with `list_sites`.

When A–B pass, tell the user auth is ready, then continue to **Collection and source selection** (do not create resources yet).

---

## Collection and source selection (before Step 1a)

Ask the user:

> Do you want a **new** Site Collection created using the customer name, or connect to an **existing** collection?

### If new collection

1. Set `<collection-mode>` = `new`.
2. Set `<customer-collection>` to the derived collection system name from the customer name (confirm with user).
3. Ask which site to use as the copy base:
   - **Default:** ProsperaFinancial
   - Or list sites via Sites API `GET /api/v1/sites` / Marketer MCP `list_sites` and let them pick another
4. Resolve `<source-site-name>` / `<source-site-id>` / `<source-collection-id>` from that choice.

### If existing collection

1. Set `<collection-mode>` = `existing`.
2. `GET /api/v1/collections` — present id, name, displayName; ask the user to pick one.
3. Record `<collectionId>` and `<customer-collection>` (system name) from the choice.
4. `GET /api/v1/collections/{collectionId}/sites` — list sites in that collection.
5. Ask which site to use as the copy base:
   - One of the sites in that collection, **or**
   - The default **ProsperaFinancial** (even if it lives in another collection)
6. Resolve `<source-site-name>` / `<source-site-id>` / `<source-collection-id>`.

### Resolve `<source-folder>`

| Source site | Local folder |
|---|---|
| `ProsperaFinancial` (default) | `industry-verticals/prospera` → `<source-folder>` = `prospera` |
| Any other site | Map to a folder under `industry-verticals/`. List directories there, suggest a kebab/lowercase match to the site name, and **confirm with the user** before continuing. |

### Source verification

After selection:

1. Confirm `<source-site-name>` exists (Sites API / Marketer MCP). Record `<source-site-id>` and `<source-collection-id>`.
2. Confirm `industry-verticals/<source-folder>` exists.
3. Set `<needs-move>`:
   - `new` collection → `true` (duplicate will not land in the new collection)
   - `existing` collection → `true` if `<source-collection-id>` ≠ `<collectionId>`, else `false`

Stop if the source site or source folder is missing.

Confirm the plan with the user once:

> Target collection: `<customer-collection>` (`new`/`existing`)  
> Source site: `<source-site-name>`  
> Source code folder: `industry-verticals/<source-folder>`  
> New site / folder: `<customer-system-name>` / `industry-verticals/<customer-folder>`

Then proceed to Step 1a.

---

## Step 1a — Sites API (collection + duplicate + rename)

Base URL: `https://xmapps-api.sitecorecloud.io`  
Details: [sites-api-reference.md](sites-api-reference.md)

**Why no API move:** Sites API has no move-site endpoint. A duplicate stays in the **source** site’s collection. If `<needs-move>` is true, the user moves it in Content Editor while Step 1b runs.

### 1. Target Site Collection

**If `<collection-mode>` = `new`:**

`POST /api/v1/collections`

```json
{
  "name": "<customer-collection>",
  "displayName": "<customer name>",
  "description": "Skinned demo collection for <customer name>"
}
```

Record `<collectionId>`. Poll jobs if a `handle` is returned ([job polling](sites-api-reference.md#job-polling)). Keep `<needs-move>` = `true`.

**If `<collection-mode>` = `existing`:**

Skip create. Use the already selected `<collectionId>` / `<customer-collection>`.

### 2. Duplicate source site

1. Confirm `<source-site-id>` for `<source-site-name>` (re-fetch if needed).
2. `POST /api/v1/sites/{source-site-id}/copy` with a **temporary** unique name (e.g. `<customer-system-name>-copy`):

```json
{
  "name": "<customer-system-name>-copy",
  "displayName": "<customer name>"
}
```

3. Poll until `Completed`. Resolve the new site id (`GET /api/v1/sites` by the temp name).

### 3. Rename duplicated site

`POST /api/v1/sites/{newSiteId}/rename`

```json
{ "name": "<customer-system-name>" }
```

Poll until `Completed`. Confirm via `GET /api/v1/sites` that the renamed site exists.

### 4. Notify — Content Editor move (only if `<needs-move>`)

**If `<needs-move>` is false** (duplicate already in the target collection): skip this notify. Continue to Step 1b.

**If `<needs-move>` is true:** tell the user they have a parallel action, then **immediately continue to Step 1b** without waiting:

> Sites API work is done:
> - Site Collection: `<customer-collection>` (`<collectionId>`)
> - Site: `<customer-system-name>` (`<newSiteId>`) — still under the source site’s collection
>
> **Your action (while I continue):** The Sites API cannot move sites between collections. Please use **Content Editor** to move the duplicated site into `<customer-collection>`.
>
> I’ll copy `industry-verticals/<source-folder>` now, then verify the move when that finishes. Reply when you’ve completed the move if I haven’t verified it yet.

Do **not** wait for the user before starting Step 1b.

---

## Step 1b — Local codebase folder

Run right after Step 1a (parallel with the user’s move when `<needs-move>`):

1. Confirm `industry-verticals/<source-folder>` still exists.
2. If `industry-verticals/<customer-folder>` already exists, ask before replacing.
3. Copy:

```bash
cp -R "industry-verticals/<source-folder>" "industry-verticals/<customer-folder>"
```

4. Do **not** commit or install deps unless the user asks. Continue to Step 1c (env + build config).

---

## Step 1c — Wire local site name and rendering host

Run after the folder copy, **before** move verification / Step 1d.

### 1. Update customer `.env.local`

In `industry-verticals/<customer-folder>/.env.local`:

1. If `.env.local` is missing, create it by copying `.env.remote.example` (or `.env.container.example`) from the same folder, then proceed.
2. Set `NEXT_PUBLIC_DEFAULT_SITE_NAME` to `<customer-system-name>`.

```env
NEXT_PUBLIC_DEFAULT_SITE_NAME=<customer-system-name>
```

Only change this variable (and create the file if needed). Do not invent or commit other secrets. Edit **only** the copied customer folder’s `.env.local`, never the source folder’s.

### 2. Register rendering host in `xmcloud.build.json`

Edit the repo-root **`xmcloud.build.json`**.

1. Under `renderingHosts`, find an entry whose `path` is `./industry-verticals/<source-folder>` (e.g. `"prospera"` for Prospera). If none matches, ask which existing host to clone.
2. **Duplicate** that object.
3. Rename the new key to **`<customer-folder>`** (customer name in **lowercase** kebab-case — same value everywhere this host is named).
4. Set `"path"` to `"./industry-verticals/<customer-folder>"`.
5. Leave other fields from the source host unchanged unless the user asks otherwise.
6. Do **not** modify or remove the original source host entry.
7. Record this key in progress as `artifacts.renderingHostKey` (= `<customer-folder>`).

**Name consistency:** The `renderingHosts` key, the editing host `--name` (Step 1d), and `<customer-folder>` must be the **same lowercase** string.

If a `renderingHosts` key for that customer already exists, ask before overwriting.

---

## Verify move (after local copy + Step 1c)

**If `<needs-move>` is false:** skip verification; proceed to **Step 1d**.

**If `<needs-move>` is true:**

1. `GET /api/v1/collections/{collectionId}/sites` — confirm the renamed site is listed.
2. Optionally cross-check with Marketer MCP `list_sites` / `get_site_information`.

| Result | Action |
|---|---|
| Site is under the target collection | Proceed to **Step 1d** |
| Site is **not** under the target collection | Ask the user to finish the Content Editor move, then re-check. Do not continue until verified. |

---

## Step 1d — Optional editing host

Ask the user:

> Do you want an editing host created for this demo?

### If no

Skip the rest of Step 1d. Proceed to **Step 1 verification**, then Step 2.

### If yes

#### 1. Tooling pre-flight

Run these checks from the repo root (or a directory with a local tool manifest when using the CLI). For **each** failure, ask permission before installing; do not install without approval.

| Check | Command | Pass criteria |
|---|---|---|
| .NET 8 | `dotnet --info` | Output includes a .NET SDK/runtime **version 8.*** |
| Sitecore CLI | `dotnet sitecore --version` | Version **6.*** or greater |
| XM Cloud plugin | `dotnet sitecore plugin list` | Includes **Sitecore.DevEx.Extensibility.XMCloud** at **v1.1.122** or greater |

**Install .NET 8** (only after permission):

| OS | Install |
|---|---|
| macOS | `brew install dotnet@8` |
| Windows | Download/run the [.NET install PowerShell script](https://dot.net/v1/dotnet-install.ps1) with `--version 8.0.125` |

**Install Sitecore CLI** (macOS or Windows, only after permission), from the repo root:

```bash
dotnet new tool-manifest
dotnet nuget add source -n Sitecore https://nuget.sitecore.com/resources/v3/index.json
dotnet tool install Sitecore.CLI
dotnet sitecore init
```

If a tool manifest or Sitecore NuGet source already exists, skip the redundant `new` / `add source` step and continue.

**Install XM Cloud plugin** (macOS or Windows, only after permission):

```bash
dotnet sitecore plugin add -n Sitecore.DevEx.Extensibility.XMCloud
```

Re-run the failed check(s) after each install. Stop if the user declines a required install.

#### 2. Collect Authoring environment ID

Ask the user for the **Environment ID** of their Authoring environment (`cm-environment-id`).

Tell them: find it in the **Deploy Portal** → their project → **Authoring Environments** tab.

Do not proceed without `cm-environment-id`.

#### 3. Login and create editing host

1. Run `dotnet sitecore cloud login` and wait for the user to complete the authorization pop-up.
2. After success:

```bash
dotnet sitecore cloud editinghost create --cm-environment-id <cm-environment-id> --name <customer-folder>
```

Use **`<customer-folder>`** (lowercase) for `--name` — it must match the `renderingHosts` key added to `xmcloud.build.json` in Step 1c. Do **not** use the display customer name or Site system name here.

3. In the response:
   - Verify **Type** is `eh`
   - Capture the new Environment ID as `eh-environment-id`
4. If Type is not `eh` or no Environment ID is returned, stop and report the response.

#### 4. Upsert `NEXT_PUBLIC_SEARCH_*` variables to the editing host

From `industry-verticals/<customer-folder>/.env.local`, for **each** variable whose name starts with `NEXT_PUBLIC_SEARCH_`:

```bash
dotnet sitecore cloud environment variable upsert --environment-id <eh-environment-id> --name <variable-full-name-from-env.local> --value <variable-full-value-from-env.local> --target EH
```

If none are present, tell the user and continue.

After upserts (or if none), verify:

```bash
dotnet sitecore cloud environment variable list --environment-id <eh-environment-id>
```

Confirm each upserted `NEXT_PUBLIC_SEARCH_*` name appears with the expected value. If verification fails, stop and report.

#### 5. Prompt Deploy Portal GitHub config (non-blocking)

Tell the user:

> In the Deploy Portal, open your project’s **Editing Host** tab, click the new editing host (`<customer-folder>`), then **Options** → **Edit Environment Details**, and configure the GitHub connections for this host.

**Do not wait** for a response. Continue immediately to **Step 1 verification**.

---

## Step 1 verification

Confirm all artifacts:

| Artifact | How to verify |
|---|---|
| Site Collection | `GET /api/v1/collections` — `<customer-collection>` / `<collectionId>` present |
| Site | `GET /api/v1/sites` — `<customer-system-name>` present |
| Site in target collection | `GET /api/v1/collections/{collectionId}/sites` — site listed (required; if `<needs-move>` was false this should already be true) |
| Local folder | `industry-verticals/<customer-folder>` exists (copied from `<source-folder>`) |
| `.env.local` site name | `NEXT_PUBLIC_DEFAULT_SITE_NAME` equals `<customer-system-name>` |
| `xmcloud.build.json` | `renderingHosts.<customer-folder>` exists with `path` `./industry-verticals/<customer-folder>` |
| Editing host (if opted in) | `eh-environment-id` captured; Type was `eh`; `NEXT_PUBLIC_SEARCH_*` vars verified via `variable list` (or none to upsert) |
| Inputs retained | Customer name, URL, and homepage screenshot available for Step 2 |

Report IDs, names, source site/folder, and local path to the user.

Then continue immediately to **Step 2** (do not wait for an extra “continue” prompt unless Step 1 verification failed).

---

## Step 2 — Invoke sitecore-build-demo

Treat this as if the user prompted: **“build a demo for \<customer name\>”**.

### Hard scope (pass into sitecore-build-demo)

When invoking `sitecore-build-demo`, instruct it to use these targets for the entire run:

| Change type | Target |
|---|---|
| **All code changes** | `industry-verticals/<customer-folder>/` only |
| **All content changes** | `/sitecore/content/<customer-collection>/<customer-site>` only |

Where:

- `<customer-folder>` — local folder from Step 1b
- `<customer-collection>` — target Site Collection system name
- `<customer-site>` — Site system name from Step 1a rename (`<customer-system-name>`)

**Do not** edit the source codebase under `industry-verticals/<source-folder>/`, or write content under `<source-site-name>` (or any other site) paths.

### 1. Switch context to the customer app

Working directory / skill root:

`industry-verticals/<customer-folder>/`

Confirm these exist before handoff:

- `industry-verticals/<customer-folder>/docs/ai/skills/sitecore-build-demo.md`
- Paths listed under **Load first** in that skill (relative to the customer folder)

If the skill file is missing, stop — the source folder copy was incomplete.

### 2. Load and follow that skill

1. **Read** `industry-verticals/<customer-folder>/docs/ai/skills/sitecore-build-demo.md` in full (and any files it says to load first).
2. **Execute** that skill’s workflow from Phase 0 onward with the hard scope above: code only under `industry-verticals/<customer-folder>/`; content only under `/sitecore/content/<customer-collection>/<customer-site>`.
3. Do **not** run the source folder’s skill; only the customer folder’s.

### 3. Pass inputs already collected

Do not re-ask for name, URL, or screenshot unless something is missing or invalid. Seed Phase 0 as:

| sitecore-build-demo input | Value from this skill |
|---|---|
| Client name | Customer name |
| Client URL | Customer URL |
| Screenshot | Homepage screenshot collected in Inputs |
| Code root | `industry-verticals/<customer-folder>/` |
| Content root | `/sitecore/content/<customer-collection>/<customer-site>` |

Then follow `sitecore-build-demo` for everything else (Content Hub credentials, Phase 0.5 manifest check, remaining phases, resume rules), still constrained by the hard scope.

### 4. Announce the handoff

Tell the user briefly:

> Step 1 complete. Starting Step 2: running `sitecore-build-demo` as “build a demo for \<customer name\>” with the URL and screenshot you provided. Code changes go in `industry-verticals/<customer-folder>/`; content changes go in `/sitecore/content/<customer-collection>/<customer-site>`.

Set `steps.step2_build_demo.status: "handed_off"` in `setup-progress.yaml` before running the demo skill. Then run the demo skill without inventing alternate demo-build steps outside that file.

---

## Stop conditions

- Missing homepage screenshot (or user declines to provide one)
- Sites API or Marketer MCP auth fails after prompting
- User declines collection mode / collection pick / source site / source folder confirmation
- Chosen `<source-site-name>` or `industry-verticals/<source-folder>` missing
- Copy/rename job status `Failed`
- `<needs-move>` and move verification fails / user will not complete the Content Editor move
- User declines overwrite of an existing local customer folder
- User declines overwrite of an existing `xmcloud.build.json` renderingHosts key
- User opts into editing host but declines a required tooling install, or CLI create/upsert/verify fails
- Customer folder missing `docs/ai/skills/sitecore-build-demo.md`
- Stop conditions defined inside `sitecore-build-demo` (apply during Step 2)

## References

- [Sites API](https://api-docs.sitecore.com/sai/sites-api)
- [Marketer MCP (Cursor IDE)](https://doc.sitecore.com/sai/en/users/sitecoreai/sitecore-marketer-mcp-server.html#cursor-ide)
- [sites-api-reference.md](sites-api-reference.md) — endpoints, auth, job polling
- [setup-progress.template.yaml](setup-progress.template.yaml) — progress / resume template
- Per-run progress: `.cursor/skills/skinned-demo-setup/runs/<customer-folder>/setup-progress.yaml`
- Customer app after Step 1b: `industry-verticals/<customer-folder>/docs/ai/skills/sitecore-build-demo.md`

### Sitecore CLI

- [Install Sitecore Command Line Interface](https://doc.sitecore.com/sai/en/developers/sitecoreai/sitecore-command-line-interface/install-and-setup-sitecore-cli/install-sitecore-command-line-interface.html)
- [Log in to an instance with the Sitecore CLI](https://doc.sitecore.com/sai/en/developers/sitecoreai/sitecore-command-line-interface/connect-to-an-environment/log-in-to-an-instance-with-the-sitecore-cli.html)
- [Install the XM Cloud plugin](https://doc.sitecore.com/sai/en/developers/sitecoreai/sitecore-command-line-interface/plugins/xm-cloud-plugin/install-the-xm-cloud-plugin.html)
- [The cloud login command](https://doc.sitecore.com/sai/en/developers/sitecoreai/sitecore-command-line-interface/sitecore-cli-command-reference/the-cli-cloud-command/the-cloud-login-command.html)
- [The cloud environment command](https://doc.sitecore.com/sai/en/developers/sitecoreai/sitecore-command-line-interface/sitecore-cli-command-reference/the-cli-cloud-command/the-cloud-environment-command.html)
- [The cloud editinghost command](https://doc.sitecore.com/sai/en/developers/sitecoreai/sitecore-command-line-interface/sitecore-cli-command-reference/the-cli-cloud-command/the-cloud-editinghost-command.html)
