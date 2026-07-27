# SitecoreAI Front End Application Starter Kits

This repository contains multiple Next.js Starter Kits, and the SPA Starters monorepo (which includes a Node Proxy Application and and SPA starter apps) for SitecoreAI Development. It is intended to get developers up and running quickly with a new front end project that is integrated with SitecoreAI.

[Deploying SitecoreAI](https://doc.sitecore.com/xmc/en/developers/xm-cloud/deploying-xm-cloud.html)

## Table of Contents

- [Repository Overview](#repository-overview)
- [Contributing](#contributing)
- [How to Run a Next.js Starter Locally](#how-to-run-a-nextjs-starter-locally)
- [How to Add an Editing Host to SitecoreAI](#how-to-add-an-editing-host-to-xm-cloud)
- [GitHub Template](#github-template)
  - [Prerequisites](#prerequisites)
  - [Getting Started Guide](#getting-started-guide)
  - [Running the Next.js Starter Kit](#running-the-nextjs-starter-kit)
  - [SPA Starters Monorepo and Angular SPA](#spa-starters-monorepo-and-angular-spa)
- [Development Workflow](#development-workflow)
- [SEO & AI Crawler Access](#seo--ai-crawler-access)
- [GEO Optimization & Compliance](#geo-optimization--compliance)
- [AI-Assisted Development](#ai-assisted-development)
- [FAQ](#faq)

## Repository Overview

Here's a quick overview of the major folders and their purpose:

  - `/examples`:
  Contains starter front-end applications. Each subfolder is a working app. Each starter is independent and self-contained
    * basic-nextjs: [README](https://github.com/Sitecore/xmcloud-starter-js/tree/main/examples/basic-nextjs/README.md)
    * basic-spa: [README](https://github.com/Sitecore/xmcloud-starter-js/tree/main/examples/basic-spa/README.md)
    * kit-nextjs-article-starter: [README](https://github.com/Sitecore/xmcloud-starter-js/tree/main/examples/kit-nextjs-article-starter/README.md)
    * kit-nextjs-location-finder: [README](https://github.com/Sitecore/xmcloud-starter-js/blob/main/examples/kit-nextjs-location-finder/README.md)
    * kit-nextjs-product-listing: [README](https://github.com/Sitecore/xmcloud-starter-js/blob/main/examples/kit-nextjs-product-listing/README.md)
    * kit-nextjs-skate-park: [README](https://github.com/Sitecore/xmcloud-starter-js/blob/main/examples/kit-nextjs-skate-park/README.md)

  - `/local-containers`:
  Contains Docker-related files for local development environments.

  - `/authoring`:
    The authoring folder is where Sitecore content items are defined and stored for deployment. These items include:
    * Templates: located under /items — defines the structure of content items used in the application..
    * Powershell, Modules, etc. Organized by namespace under items/items, useful for modular development and deployment.
    * Modules: Each module has its own .module.json file (e.g., nextjs-starter.module.json) to define what items it includes and where they should be deployed in the Sitecore content tree.

  - `xmcloud.build.json`: 
    This is the primary configuration file for building and deploying rendering hosts in your SitecoreAI environment.

    Key Sections:
      * renderingHosts: Defines one or more front-end apps to build. Each entry includes:

      * path: where the app is located (e.g., ./examples/kit-nextjs-skate-park)

      * nodeVersion: Node.js version used during build

      * jssDeploymentSecret: Deployment auth key for JSS

      * enabled: Whether the rendering host is active

      * buildCommand / runCommand: Custom scripts for build/start

      * postActions: Actions that run after a successful deployment, such as warming up the CM server or triggering reindexing.

      * authoringPath: Path to the folder containing Sitecore item definitions (default is ./authoring).

## Contributing

**Pull requests to the official repository** are welcome for **improvements, bug fixes, and generally useful features** in the **existing** starters under `examples/`, plus documentation and tooling that support that goal. The maintainers keep a **limited** set of examples that follow shared best practices.

This repository does **not** accept pull requests that add **new example sites** (for example, a new app under `examples/`, or an additional starter). For your own app, extra starters, or heavy product-specific customization, use this repo as a **[GitHub template](#github-template)** or work in your **own fork**. See **[CONTRIBUTING.md](CONTRIBUTING.md)** and **[What we do not accept](CONTRIBUTING.md#what-we-do-not-accept)** for the full policy, branching (`dmz`), and how to submit changes.

## How to Run a Next.js Starter Locally

Use the **path for your chosen starter** (e.g. `examples/kit-nextjs-article-starter`). The steps are the same for all Next.js starters.

1. **Get environment variables**  
   Log into the [SitecoreAI Deploy Portal](https://portal.sitecorecloud.io), open your Environment → **Developer Settings**. Ensure **Preview** is enabled, then copy the sample `.env` contents from **Local Development**.

2. **Create `.env.local`**  
   In your starter folder (e.g. `examples/kit-nextjs-article-starter`), copy `.env.remote.example` to `.env.local` and paste the contents. Set at least: `SITECORE_EDGE_CONTEXT_ID`, `NEXT_PUBLIC_DEFAULT_SITE_NAME`, `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID`, `SITECORE_EDITING_SECRET`. See [Environment variables in SitecoreAI](https://doc.sitecore.com/xmc/en/developers/xm-cloud/get-the-environment-variables-for-a-site.html). Optionally set `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_BASE_URL` to your public site origin when server-rendered code must build absolute URLs without relying on the request `Host` header (see comments in `.env.remote.example`).

3. **Install and run**
   ```bash
   cd examples/<your-starter>   # e.g. kit-nextjs-article-starter
   npm install
   npm run dev
   ```
4. Open **http://localhost:3000** and verify the site loads.

> **Note:** For kit-specific details (editing host name, preconditions), see that starter’s [README](examples/kit-nextjs-article-starter/README.md#overview).

## How to Add an Editing Host to SitecoreAI

If **split deployment** is **not** enabled, editing hosts are created automatically from `xmcloud.build.json` when `enabled` is `true`. You can skip this section.

If split deployment **is** enabled:

1. Go to [Sitecore Cloud Portal](https://portal.sitecorecloud.io) → SitecoreAI Deploy.
2. Select your project → **Editing Hosts** → **Add editing host**.
3. Use the **editing host name** from `xmcloud.build.json` for that starter (e.g. `kit-nextjs-article-starter`, `nextjsstarter`).
4. Confirm: link to authoring, source provider, GitHub account, repository, branch. Enable **Auto deploy** if desired.
5. Save, then use **…** → **Build and deploy** on the new editing host.

Rendering host items are created automatically when you create a rendering host; you do not create them manually. Site-to-editing-host mapping is also automatic.

## GitHub Template

This Github repository is a template that can be used to create your own repository. To get started, click the `Use this template` button at the top of the repository.

### Prerequisites

- Access to an SitecoreAI Environment
- [Node.js LTS](https://nodejs.org/en/)

### Getting Started Guide

For developers new to SitecoreAI you can follow the Getting Started Guide on the [Sitecore Documentation Site](https://doc.sitecore.com/xmc) to get up and running with SitecoreAI. This will walk you through the process of creating a new SitecoreAI Project, provisioning an Environment, deploying the NextJs Starter Kit, and finally creating your first Component.

### Running the Next.js Starter Kit

> **Note:** Please refer to the `README.md` of the specific example starter you're working with for detailed setup instructions.
> The following outlines the general steps to run the app locally:
- Log into the SitecoreAI Deploy Portal, locate your Environment and select the `Developer Settings` tab.
- Ensure that the `Preview` toggle is enabled.
- In the `Local Development` section, click to copy the sample `.env` file contents to your clipboard.
- Create a new `.env.local` file in the `./examples/basic-nextjs` folder of this repository and paste the contents from your clipboard.
- Run the following commands in the root of the repository to start the NextJs application:

  **Development (with hot reload):**
  ```bash
  cd examples/basic-nextjs
  npm install
  npm run dev
  ```
  You should now be able to access your site on `http://localhost:3000` and see your changes in real-time as you make them.

  **Build and run for production:**
  ```bash
  cd examples/basic-nextjs
  npm install
  npm run build
  npm run start
  ```
  This builds the app and runs it in production mode. Access the site at `http://localhost:3000`.

### SPA Starters Monorepo and Angular SPA

A new starter SPA based on Angular has been introduced with JSS v22.3.0. The Angular starter has been designed to be compatible with SitecoreAI and should be used with the provided node SitecoreAI proxy application to handle server-side rendering (SSR), data queries, personalization and more. For more details and information on how to run and deploy the Angular starter and proxy to SitecoreAI have a look at [SPA starters monorepo](examples/basic-spa/)

## Development Workflow

This repository uses a **DMZ git workflow** to ensure the `main` branch is always clean, deployable, and production-ready.

### Quick Overview

- **`main` branch**: Always clean and deployable (never commit directly)
- **`dmz` branch**: Validation layer where PRs are merged and tested
- **Feature branches**: Created from `main`, PRs target `dmz`

### Key Requirements

1. ✅ Always create feature branches from the latest `main`
2. ✅ Create PRs to `dmz` (not `main`)
3. ✅ Use **Squash and merge** only (enforced)
4. ✅ Ensure your branch is based on the latest `main` before creating a PR
5. ✅ PR validation runs automatically (lint, build, test, type-check)
6. ✅ After merge to `dmz`, CI validates the build; `main` is manually updated via merge commits periodically (every 1-2 weeks)

### For Contributors

Read **[Contributing](#contributing)** (including that we do not accept **new example sites** via PR to this repo) and **[CONTRIBUTING.md](CONTRIBUTING.md)**.  
📖 **[Read the full DMZ Workflow Guide](.github/DMZ-WORKFLOW.md)** for detailed instructions, common issues, and best practices.

### For Repository Maintainers

🔒 **[Branch Protection Setup Guide](.github/BRANCH-PROTECTION-SETUP.md)** - Configure GitHub branch protection rules to enforce the workflow.

## SEO & AI Crawler Access

This repository is configured to allow AI crawlers and search engines to index your content for maximum discoverability. All starter applications include:

- **AI Crawler Support**: Explicit allowances for GPTBot (OpenAI), ClaudeBot (Anthropic), PerplexityBot, and other AI crawlers
- **Search Engine Support**: Proper configuration for Googlebot, Bingbot, and other major search engines
- **Dynamic Sitemap**: Automatically generated sitemap.xml linked in robots.txt
- **Error Page Handling**: 404 pages include noindex meta tags to prevent indexing of error pages

📖 **[Read the AI Crawler Access Guide](docs/AI_CRAWLER_ACCESS.md)** for detailed configuration instructions, hosting provider setup (Vercel, Azure, Netlify), and how to restrict access if needed.

## GEO Optimization & Compliance

Starter kits implement **GEO (Generative Engine Optimization)** so content is discoverable by AI crawlers and LLM-based search engines. Requirements, validation rules, and checklists are documented in one place:

- **[GEO Compliance Guide](docs/GEO_COMPLIANCE.MD)** — Full requirements, validation thresholds, and PR-ready checklist
- **[GEO Endpoints (AI JSON, ai.txt, sitemap)](docs/AI_ENDPOINTS.md)** — Implementation details for `/ai/summary.json`, `/ai/faq.json`, `/ai/service.json`, `/.well-known/ai.txt`, `/sitemap-llm.xml`
- **[AI Crawler Access](docs/AI_CRAWLER_ACCESS.md)** — Crawler configuration and hosting setup

For testing and validation, see the [GEO Compliance Checklist](docs/GEO_COMPLIANCE.MD#-4-geo-compliance-checklist-pr‑ready) in the GEO Compliance Guide.

## AI-Assisted Development

This repository includes comprehensive AI guidance files to help maintain consistent code quality and follow SitecoreAI best practices across all starter applications:

- **Skills: Capability Map** ([docs/Skills.md](docs/Skills.md)) - High-level capability groupings for the starter kits; helps AI tools and developers understand what the starters support and when to use each area
- [**Agents.md**](Agents.md) - AI agent guidance: structure, commands, DOs/DON'Ts, boundaries, and quick reference
- **Claude Code Guide** (`CLAUDE.md`) - Comprehensive guide for Claude Code and AI assistants with project architecture, coding standards, and best practices
- **Cursor AI Rules** (`.cursor/rules/`) - Automatically provide context and enforce patterns when using Cursor AI
- **Windsurf IDE Rules** (`.windsurfrules`) - Comprehensive coding standards, folder structure, and best practices for Windsurf's agentic IDE workflows
- **GitHub Copilot Instructions** (`copilot-instructions.md`) - Detailed development patterns and component guidelines for GitHub Copilot
- **LLM Guidance** (`LLMs.txt`) - Concise guidance for various AI assistants covering architecture principles and safety rules

These files ensure consistent development patterns whether you're using Claude Code, Cursor AI, Windsurf IDE, GitHub Copilot, or other AI coding assistants. See the [Contributing Guide](CONTRIBUTING.md#ai-assisted-development) for details on using AI assistance with this project.

## FAQ

### Do I need to create rendering host items in SitecoreAI?

No. Rendering host items are created automatically when you create a rendering host. Site-to-editing-host mapping is also automatic.

### Can I add a new example site or starter via pull request?

No. This repository does **not** accept pull requests that add **new example sites**. Use a **[GitHub template](#github-template)** or a **fork** for additional starters or your own app. You can still contribute **improvements and fixes** to **existing** starters. See [Contributing](#contributing) and [CONTRIBUTING.md - What we do not accept](CONTRIBUTING.md#what-we-do-not-accept).

### Which branch do I create my PR against?

Create your PR against **`dmz`**, not `main`. Branch from the latest `main`. See [Development Workflow](#development-workflow) and [DMZ Workflow Guide](.github/DMZ-WORKFLOW.md).

### Where do I get environment variables for local development?

In SitecoreAI Deploy Portal → your Environment → **Developer Settings** → **Local Development**, copy the sample `.env` and use it in your starter’s `.env.local`. See [How to Run a Next.js Starter Locally](#how-to-run-a-nextjs-starter-locally).

### When do I need to add an editing host manually?

Only if you have **split deployment** enabled. Otherwise, editing hosts are created from `xmcloud.build.json` when the starter is enabled. See [How to Add an Editing Host to XM Cloud](#how-to-add-an-editing-host-to-xm-cloud).
