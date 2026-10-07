# Skate Park - Demo Site (Angular) - angularstarter

## Table of Contents

- [Overview](#overview)
- [Developer Expectations](#developer-expectations)
- [Preconditions](#preconditions)
- [Build and run site locally](#build-and-run-site-locally)
- [Add Editing host to XM Cloud](#add-editing-host-to-xm-cloud)
- [Documentation](#documentation)

## Overview

Skate Park is a simple website with sample component implementations showcasing data source handling and other essentials. This demo site is the Angular front end for that site, built to showcase SitecoreAI capabilities using the [Sitecore Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/sitecore-content-sdk-for-angular.html).

Pages are rendered on the server by Angular SSR and an Express server (`src/server.ts`). Sitecore layout data is loaded through route loaders, then placed into the `headless-header`, `headless-main`, and `headless-footer` placeholders.

## Developer Expectations

* Tailwind-based styling
* Personalized pages through the Sitecore personalization middleware
* Modular components for reuse
* Localization through the configured default language and the Sitecore dictionary (`ngx-translate`)
* Server-side rendering, with editing and preview support for Sitecore Pages

## Preconditions

1. You have deployed your SitecoreAI environment already. If not follow this link: [Deploy a Project and Environment](https://doc.sitecore.com/xmc/en/developers/xm-cloud/deploy-a-project-and-environment.html)

## Build and run site locally

1. Clone the repository (if not yet done)
    ```git clone https://github.com/Sitecore/xmcloud-starter-js```
2. Starting from the root of the repository navigate to the site app folder
    ```cd examples\kit-angular-skate-park\```
3. Copy the environment file ```.env.example```
4. Rename the copied file to ```.env```
5. Edit ```.env``` and provide a value for ```SITECORE_EDGE_CONTEXT_ID```, ```CSDK_PUBLIC_SITECORE_EDGE_CONTEXT_ID```, ```CSDK_PUBLIC_SITECORE_DEFAULT_SITE```, and ```CSDK_PUBLIC_SITECORE_DEFAULT_LANGUAGE```. (More info: [Environment variables in SitecoreAI](https://doc.sitecore.com/xmc/en/developers/xm-cloud/get-the-environment-variables-for-a-site.html)) Variables prefixed with ```CSDK_PUBLIC_``` are written into the Angular environment files by ```npm run gen:env:dev``` and ```npm run gen:env:prod```. Do not commit ```.env```.

6. Install dependencies:
   from ```kit-angular-skate-park``` run ```npm install```
7. Run the site locally:
    ```npm run dev```
   This generates the development environment file, builds the Sitecore component map and `.sitecore` metadata, and starts the Angular dev server.
8. Access the site:
Visit http://localhost:4200 in your browser.

**Production build and serve:**

```bash
npm run build
npm run serve:ssr
```

`npm run serve:ssr` starts the Express server at `dist/kit-angular-skate-park/server/server.mjs`. That is the command used by `xmcloud.build.json`. The server listens on http://localhost:3000, or on the port set in the `PORT` environment variable.

## Add Editing host to XM Cloud

If you have not enabled the split deployment feature your editing hosts are automatically created based on the xmcloud.build.json if enabled is set to true. The following steps are not required. Only if you have enabled the split deployment feature, continue with the next steps.

1. Go to Sitecore Cloud Portal https://portal.sitecorecloud.io
2. Open SitecoreAI Deploy
3. Select the project that has been deployed
4. Switch to the "Editing Hosts" tab
5. Click "Add editing host"
6. Provide the editing host name ```angularstarter``` as per xmcloud.build.json
7. Check if the link to the authoring environment is set correctly (should be by default)
8. Check if the source code provider is set correctly (should be by default)
9. Check if the GitHub account is set correctly (should be by default)
10. Check if the repository is set correctly (should be by default)
11. Check if the branch is set correctly (should be by default)
12. Set the Auto deploy option (recommended)
13. No custom environment variables are required
14. Click "Save"
15. On the new editing host click the ... and hit "Build and deploy"

The rendering host build command is ```build``` and the run command is ```serve:ssr```.

Additional info: You do not have to create rendering host items in SitecoreAI as those are created automatically when you create a rendering host. Mapping of sites using site templates to editing hosts is also done automatically.

## Documentation

[Sitecore Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/sitecore-content-sdk-for-angular.html)
