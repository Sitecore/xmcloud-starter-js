# XM Cloud Front End Application Starter Kits

This repository contains multiple Next.js Starter Kits, and the SPA Starters monorepo (which includes a Node Proxy Application and and SPA starter apps) for Sitecore XM Cloud Development. It is intended to get developers up and running quickly with a new front end project that is integrated with Sitecore XM Cloud.

[Deploying XM Cloud](https://doc.sitecore.com/xmc/en/developers/xm-cloud/deploying-xm-cloud.html)

Here's a quick overview of the major folders and their purpose:

  - `/examples`:
  Contains starter front-end applications. Each subfolder is a working app
    * basic-nextjs: [README](https://github.com/kendoce/xmcloud-starter-js/blob/main/examples/basic-nextjs/README.md)
    * basic-spa: [README](https://github.com/kendoce/xmcloud-starter-js/blob/main/examples/basic-spa/README.md)
    * kit-nextjs-article-starter: [README](https://github.com/kendoce/xmcloud-starter-js/blob/main/examples/kit-nextjs-article-starter/README.md)
    * kit-nextjs-location-finder: [README](https://github.com/kendoce/xmcloud-starter-js/blob/main/examples/kit-nextjs-location-finder/README.md)
    * kit-nextjs-product-listing: [README](https://github.com/kendoce/xmcloud-starter-js/blob/main/examples/kit-nextjs-product-listing/README.md)
    * kit-nextjs-skate-park: [README](https://github.com/kendoce/xmcloud-starter-js/blob/main/examples/kit-nextjs-skate-park/README.md)

  - `/local-containers`:
  Contains Docker-related files for local development environments.

  - `/authoring`: 
    The authoring folder is where Sitecore content items are defined and stored for deployment. These items include:
    * Templates: located under /items — defines the structure of content items used in the application..
    * Powershell, Modules, etc. Organized by namespace under items/items, useful for modular development and deployment.
    * Modules: Each module has its own .module.json file (e.g., nextjs-starter.module.json) to define what items it includes and where they should be deployed in the Sitecore content tree.

  - `xmcloud.build.json`: 
    This is the primary configuration file for building and deploying rendering hosts in your XM Cloud environment.

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

- Access to an Sitecore XM Cloud Environment
- [Node.js LTS](https://nodejs.org/en/)

### Getting Started Guide

For developers new to XM Cloud you can follow the Getting Started Guide on the [Sitecore Documentation Site](https://doc.sitecore.com/xmc) to get up and running with XM Cloud. This will walk you through the process of creating a new XM Cloud Project, provisioning an Environment, deploying the NextJs Starter Kit, and finally creating your first Component.

### Running the Next.js Starter Kit

>  **Note:** Please refer to the `README.md` of the specific example starter you’re working with for detailed setup instructions.
> The following outlines the general steps to run the app locally:
- Log into the Sitecore XM Cloud Deploy Portal, locate your Environment and select the `Developer Settings` tab.
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

A new starter SPA based on Angular has been introduced with JSS v22.3.0. The Angular starter has been designed to be compatible with XM Cloud and should be used with the provided node XM Cloud proxy application to handle server-side rendering (SSR), data queries, personalization and more. For more details and information on how to run and deploy the Angular starter and proxy to XM Cloud have a look at [SPA starters monorepo](examples/basic-spa/)

## Disconnected offline development

It is possible to mock a small subset of the XM Cloud Application elements to enable offline development. This can allow for a disconnected development experience, however it is recommend to work in the default connected mode.

You can find more information about how setup the offline development experience [here](./local-containers/README.md)
