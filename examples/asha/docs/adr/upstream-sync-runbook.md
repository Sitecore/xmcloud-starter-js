# Upstream Sync Runbook

Repeatable process for syncing with `Sitecore/xmcloud-starter-js`. See [ADR 0001](./0001-upstream-sync-strategy.md) for rationale and decision record.

## When to Sync

- Triggered by **upstream SDK releases** (e.g. 2.1, 3.0), not on a fixed schedule.
- Check https://github.com/sitecore/xmcloud-starter-js for new releases and tags.
- Most upstream commits are CI fixes or doc tweaks — only sync on meaningful version bumps.

## Pre-flight Checks

1. Working tree must be clean:
   ```bash
   git status
   ```
   If dirty, stash or commit before proceeding.

2. Confirm `content-sdk/` is gitignored. The `.gitignore` entry must be `/content-sdk/` (leading slash) to avoid matching `src/components/basic/content-sdk/`:
   ```bash
   grep 'content-sdk' .gitignore
   ```

3. Confirm you are on `main`:
   ```bash
   git branch --show-current
   ```

4. Confirm the `upstream` remote exists:
   ```bash
   git remote -v | grep upstream
   ```
   If missing:
   ```bash
   git remote add upstream https://github.com/Sitecore/xmcloud-starter-js.git
   ```

## Step-by-Step Process

### 1. Fetch upstream

```bash
git fetch upstream main
```

### 2. Create feature branch

```bash
git checkout -b upstream-sync-<version>
```

Example: `upstream-sync-2.1`

### 3. Merge

```bash
git merge upstream/main --no-edit
```

Expect conflicts. Do not use `--squash` or `--rebase` (see ADR 0001).

### 4. Resolve conflicts

Use the file-by-file ownership rules below. For each conflicted file, determine the owner and resolve accordingly.

### 5. Regenerate lock file

Always delete and regenerate — do not attempt a three-way merge on the lock file:

```bash
rm package-lock.json
npm install
```

### 6. Build

```bash
npm run build
```

Fix any component build errors. Common issues:
- Renamed SDK imports (`@sitecore-cloudsdk/*` replaced by `@sitecore-content-sdk/*`)
- Changed API signatures in new SDK version
- Tailwind class changes (reject Tailwind v4 — see Special Cases)

### 7. Smoke test

```bash
npm run dev
```

- Verify the homepage renders.
- Verify at least one UIIM component renders correctly.
- Verify the `/sitecore-build-demo` pipeline runs on a test client (if applicable).

### 8. Merge to main

```bash
git checkout main
git merge upstream-sync-<version>
```

### 9. Push

```bash
git push origin main
```

### 10. Clean up

```bash
git branch -d upstream-sync-<version>
```

## File-by-File Ownership Rules

| Owner | Files |
|---|---|
| **Upstream** | SDK dependency versions in `package.json`, Next.js version, `tsconfig.json` base config, upstream's own components under `src/components/basic/`, all non-`basic-nextjs` example dirs, `authoring/`, `local-containers/`, `xmcloud.build.json` |
| **Ours** | `src/components/uiim/**`, `docs/ai/**`, `docs/adr/**`, `CLAUDE.md`, `.claude/`, any file only we have touched |
| **Manual merge** | `package.json` (accept upstream versions + keep our extra deps), `next.config.ts` (accept upstream structure + keep our Content Hub domains), `.sitecore/component-map.ts` (include both upstream and our component sets) |

When in doubt: if the file exists only in our repo, keep ours. If it exists only in upstream, accept theirs. If both modified, check the table.

## Special Cases

- **`package-lock.json`**: Always delete and regenerate with `npm install`. Never merge manually.
- **Tailwind version**: We stay on **v3** until a dedicated migration is planned. Do not accept upstream's Tailwind v4 upgrade. Revert Tailwind-related `package.json` changes if upstream has moved to v4.
- **`@sitecore-cloudsdk/*` packages**: Replaced by `@sitecore-content-sdk/*` in SDK 2.0+. After merge, search for stale imports:
  ```bash
  grep -r "@sitecore-cloudsdk" src/
  ```
- **Demo branches**: Never rebased. They are historical snapshots of completed demos. If a client needs updates, create a new branch from current `main`.
- **AI docs update**: Update `docs/ai/rules/`, `docs/ai/skills/`, and `CLAUDE.md` in a **separate follow-up commit** after the merge, not as part of the merge itself.

## Rollback

| Scenario | Action |
|---|---|
| Merge in progress, not yet committed | `git merge --abort` |
| Committed on feature branch, not yet merged to main | `git checkout main && git branch -D upstream-sync-<version>` — main is untouched |
| Already merged to main but not pushed | `git reset --hard HEAD~1` on main |
| Already pushed to main | Revert with `git revert -m 1 <merge-commit-sha>` and push. **Never force-push main.** |

## Reference

- **ADR**: [docs/adr/0001-upstream-sync-strategy.md](./0001-upstream-sync-strategy.md)
- **Upstream**: https://github.com/sitecore/xmcloud-starter-js
