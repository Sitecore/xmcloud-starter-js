# SitecoreAI Front End Application Starter Kits

This repository contains multiple Next.js Starter Kits, and the SPA Starters monorepo (which includes a Node Proxy Application and and SPA starter apps) for Sitecore SitecoreAI Development. It is intended to get developers up and running quickly with a new front end project that is integrated with Sitecore SitecoreAI.

[Deploying XM Cloud](https://doc.sitecore.com/xmc/en/developers/xm-cloud/deploying-xm-cloud.html)

Here's a quick overview of the major folders and their purpose:

  - `/examples`:
  Contains starter front-end applications. Each subfolder is a working app
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

## GitHub Template

This Github repository is a template that can be used to create your own repository. To get started, click the `Use this template` button at the top of the repository.

### Prerequisites

- Access to an Sitecore SitecoreAI Environment
- [Node.js LTS](https://nodejs.org/en/)

### Getting Started Guide

For developers new to SitecoreAI you can follow the Getting Started Guide on the [Sitecore Documentation Site](https://doc.sitecore.com/xmc) to get up and running with SitecoreAI. This will walk you through the process of creating a new SitecoreAI Project, provisioning an Environment, deploying the NextJs Starter Kit, and finally creating your first Component.

### Running the Next.js Starter Kit

>  **Note:** Please refer to the `README.md` of the specific example starter you’re working with for detailed setup instructions.
> The following outlines the general steps to run the app locally:
- Log into the Sitecore SitecoreAI Deploy Portal, locate your Environment and select the `Developer Settings` tab.
- Ensure that the `Preview` toggle is enabled.
- In the `Local Development` section, click to copy the sample `.env` file contents to your clipboard.
- Create a new `.env.local` file in the `./examples/basic-nextjs` folder of this repository and paste the contents from your clipboard.
- Run the following commands in the root of the repository to start the NextJs application:
  ```bash
  cd examples/basic-nextjs
  npm install
  npm run dev
  ```
- You should now be able to access your site on `http://localhost:3000` and see your changes in real-time as you make them.

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
6. ✅ After merge to `dmz`, CI validates again and auto-fast-forwards `main`

### For Contributors

📖 **[Read the full DMZ Workflow Guide](.github/DMZ-WORKFLOW.md)** for detailed instructions, common issues, and best practices.

### For Repository Maintainers

🔒 **[Branch Protection Setup Guide](.github/BRANCH-PROTECTION-SETUP.md)** - Configure GitHub branch protection rules to enforce the workflow.

## AI-Assisted Development

This repository includes comprehensive AI guidance files to help maintain consistent code quality and follow SitecoreAI best practices across all starter applications:

- **Cursor AI Rules** (`.cursor/rules/`) - Automatically provide context and enforce patterns when using Cursor AI
- **GitHub Copilot Instructions** (`copilot-instructions.md`) - Detailed development patterns and component guidelines for GitHub Copilot
- **LLM Guidance** (`LLMs.txt`) - Concise guidance for various AI assistants covering architecture principles and safety rules

These files ensure consistent development patterns whether you're using Cursor AI, GitHub Copilot, or other AI coding assistants. See the [Contributing Guide](CONTRIBUTING.md#ai-assisted-development) for details on using AI assistance with this project.
