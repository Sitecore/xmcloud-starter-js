# DMZ Workflow - Quick Reference Card

## Table of Contents

- [Daily Workflow](#-daily-workflow)
- [Common Error: "Not based on latest main"](#-common-error-not-based-on-latest-main)
- [Keeping Long-Running Branch Updated](#-keeping-long-running-branch-updated)
- [After Your PR is Merged to DMZ](#-after-your-pr-is-merged-to-dmz)
- [Common Mistakes](#-common-mistakes)
- [Pre-PR Checklist](#-pre-pr-checklist)
- [Emergency: PR Merged with Errors](#-emergency-pr-merged-with-errors)
- [Full Documentation](#-full-documentation)
- [Still Stuck?](#-still-stuck)

## 🚀 Daily Workflow

```bash
# 1. Start a new feature
git checkout main
git pull origin main
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature

# 3. Create PR to dmz (not main!) on GitHub
# 4. Wait for validation, then maintainer manually merges dmz to main
```

## ⚠️ Common Error: "Not based on latest main"

**This means**: `main` was updated after you created your branch.

**Quick fix**:
```bash
git fetch origin main
git rebase origin/main
git push --force-with-lease origin feature/my-feature
```

## 🔄 Keeping Long-Running Branch Updated

```bash
# Run this every day if your branch takes > 1 day
git fetch origin main
git rebase origin/main
git push --force-with-lease origin feature/my-feature
```

## 🔀 After Your PR is Merged to DMZ

1. ✅ Wait for DMZ validation workflow to complete
2. 👤 Maintainer will manually merge `dmz` to `main` via GitHub web interface
3. 📝 Main is updated with a merge commit

## ❌ Common Mistakes

| ❌ Don't Do This | ✅ Do This Instead |
|-----------------|-------------------|
| Create branch from `dmz` | Create branch from `main` |
| Create PR to `main` | Create PR to `dmz` |
| Use "Merge commit" for PRs to dmz | Use "Squash and merge" for PRs to dmz |
| Push directly to `main` | Always go through `dmz` |
| Ignore "not based on latest main" error | Rebase onto latest `main` |

## 📋 Pre-PR Checklist

Before creating a PR to `dmz`:

- [ ] My branch is created from `main` (not `dmz` or another feature branch)
- [ ] I've pulled the latest `main` and rebased if needed
- [ ] My code builds locally (`npm run build`)
- [ ] My code passes linting (`npm run lint`)
- [ ] My code passes tests (`npm test`)
- [ ] My PR targets `dmz` (not `main`)

**Note**: The PR validation workflow will automatically check all of these, but running them locally first saves time!

## 🔥 Emergency: PR Merged with Errors

If a PR was merged to `dmz` but breaks CI:

```bash
# Maintainers can rebase dmz to remove bad commits
git fetch origin
git checkout dmz
git rebase -i origin/main

# Find the problematic commit and remove it or mark as 'drop'
# Save and close the editor

git push --force-with-lease origin dmz
```

## 📚 Full Documentation

- **[Complete Workflow Guide](.github/DMZ-WORKFLOW.md)** - Detailed explanations and troubleshooting
- **[Branch Protection Setup](.github/DMZ-WORKFLOW.md#security-requirements)** - For repository maintainers

## 🆘 Still Stuck?

1. Check if you're on the latest `main`: `git fetch origin main && git rebase origin/main`
2. Check if your PR targets `dmz` (not `main`)
3. Check the PR validation errors on GitHub
4. Ask a maintainer for help


