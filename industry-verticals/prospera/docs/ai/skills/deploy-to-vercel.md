---
name: deploy-to-vercel
description: Validate and deploy an existing customer demo site to separate Vercel preview and production projects. Use for requests such as "deploy my <customer> site to Vercel" or "deploy <customer> to Vercel".
---

# Deploy a customer demo to Vercel

Deploy only an existing customer project. Never scaffold or modify the site as part of this workflow.

The companion script is `../scripts/vercel.sh`, relative to this skill file. It infers the customer project directory by walking up from `docs/ai/scripts` to the customer root. Pass `--project-dir` only if the files are stored elsewhere.

## Workflow

1. Resolve the customer directory and slug. Confirm that `package.json` exists. The Vercel project names will be `<customer>-preview` and `<customer>-production`.
2. Validate the local build before asking deployment questions:

   ```bash
   bash ../scripts/vercel.sh --customer <customer> --validate-only
   ```

   If the build fails, report the relevant error and stop. Do not create, configure, link, or deploy a Vercel project.
3. After the build passes, ask:
   - Deploy **Preview**, **Production**, or **Both**?
   - Use the active Git branch? Read it with `git branch --show-current` and offer it as the default. Require a branch name in detached-HEAD state.
4. Check Vercel authentication with `vercel whoami`.
   - If the Vercel CLI is missing, stop and tell the user to run `npm install --global vercel`.
   - If not logged in, stop and tell the user to run `vercel login` once, then retry the deployment request.
   - Never ask for a Vercel access token and never store one in `.env.local`.
5. Read `.env.local` without printing values.
   - Require `NEXT_PUBLIC_DEFAULT_SITE_NAME` and all four Search variables listed below for every deployment.
   - Ask only for values missing from `.env.local`.
6. Resolve the Sitecore context IDs:
   - Preview: use `SITECORE_EDGE_CONTEXT_ID` and `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` directly from `.env.local`. Ask only for whichever value is missing, including when `.env.local` itself is missing.
   - Production: ask for the Production `SITECORE_EDGE_CONTEXT_ID`; set its `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` to the same value automatically.
   - Both: use the Preview values from `.env.local`, ask for the Production value, and ensure the Preview and Production context IDs differ.
   - Pass values collected outside the file through `VERCEL_PREVIEW_SITECORE_EDGE_CONTEXT_ID`, `VERCEL_PREVIEW_NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID`, and `VERCEL_PRODUCTION_SITECORE_EDGE_CONTEXT_ID` for the script process. Do not write them into `.env.local`.
7. Explain the pending external changes and obtain explicit confirmation immediately before deployment.
8. Run the script. Use `--skip-build` only when validation succeeded in the same unchanged working tree:

   ```bash
   bash ../scripts/vercel.sh \
     --customer <customer> \
     --target <preview|production|both> \
     --search <embedded|standalone> \
     --branch <branch> \
     --skip-build
   ```

9. Report each project name, deployment URL, and outcome. If a remote step fails, identify the incomplete project and stop.

## Vercel environment variables

Always create in each Vercel project:

- `SITECORE_EDGE_CONTEXT_ID`
- `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` — use the value from `.env.local` for Preview; use the Production context ID for Production
- `NEXT_PUBLIC_DEFAULT_SITE_NAME`

Always create the four Search variables, using shared values from `.env.local` or asking for any that are missing:

- `NEXT_PUBLIC_SEARCH_API_KEY`
- `NEXT_PUBLIC_SEARCH_CUSTOMER_KEY`
- `NEXT_PUBLIC_SEARCH_ENV`
- `NEXT_PUBLIC_SEARCH_SOURCE`

Assign applicable variables to both Vercel `production` and `preview` targets inside each project. The `<customer>-preview` project receives the Sitecore Preview context ID; `<customer>-production` receives the Sitecore Production context ID. The suffix describes the Sitecore endpoint used by that project, while its tracked Git branch produces Vercel Production deployments.

## Vercel and Git rules

- Framework preset is always `nextjs`.
- Root Directory is the customer directory's repository-relative path, never an absolute local path.
- Use the repository's `origin` remote. Connect `owner/repository`; a GitHub branch URL is unnecessary.
- Set the confirmed branch as Vercel's production branch.
- Warn when the Git working tree is dirty. The initial CLI deployment includes local source; later Git-triggered deployments use the pushed branch.
- Use the authenticated Vercel CLI session for every CLI and API operation.
- For a Vercel team, use the scope already selected through `vercel switch` or the optional `VERCEL_SCOPE` process variable.
- Never print `.env.local` contents or environment-variable values.

## End-user invocation

The user can type either:

```text
/deploy-to-vercel
```

or:

```text
Deploy my Akamai site to Vercel.
```
