# Alaris - Demo Site (NextJS) - kit-nextjs-location-starter

## Table of Contents

- [Overview](#overview)
- [Developer Expectations](#developer-expectations)
- [Preconditions](#preconditions)
- [Build and run site locally](#build-and-run-site-locally)
- [Add Editing host to XM Cloud](#add-editing-host-to-xm-cloud)
- [Documentation](#documentation)

## Overview

Alaris is a bold, minimalist template perfect for showcasing premium products, with a homepage, subpage, navigation, and footer. It showcases a car brand site offering an overview about the different models. This demo site is built to showcase XM Cloud capabilities using the Content SDK.

## Developer Expectations

* Tailwind-based styling (Shadcn)
* Personalized homepage via URL parameters
* Modular components for reuse
* Localization support for English (en) and Canadian English (en-CA)

## Preconditions

1. You have deployed your XM Cloud environment already. If not follow this link: [Deploy a Project and Environment](https://doc.sitecore.com/xmc/en/developers/xm-cloud/deploy-a-project-and-environment.html)

## Build and run site locally

1. Clone the repository (if not yet done)
    ```git clone https://github.com/Sitecore/xmcloud-starter-js```
2. Starting from the root of the repository navigate to site app folder
    ```cd examples\kit-nextjs-location-finder\```
3. Copy the environment file ```.env.remote.example```
4. Rename the copied file to ```.env.local```
5. Edit ```.env.local``` and provide a value for ```SITECORE_EDGE_CONTEXT_ID```, ```NEXT_PUBLIC_DEFAULT_SITE_NAME```, ```NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID```, ```SITECORE_EDITING_SECRET```. (More info: [Environment variables in XM Cloud](https://doc.sitecore.com/xmc/en/developers/xm-cloud/get-the-environment-variables-for-a-site.html)) Optionally set ```NEXT_PUBLIC_SITE_URL``` or ```NEXT_PUBLIC_BASE_URL``` to your public site origin when server-rendered code must build absolute URLs without the request ```Host``` header (see ```.env.remote.example```).

6. Install dependencies:
   from ```kit-nextjs-location-finder``` run ```npm install```
7. Run the site locally:
    ```npm run dev```
8. Access the site:
Visit http://localhost:3000 in your browser.

## Add Editing host to XM Cloud

If you have not enabled the split deployment feature your editing hosts are automatically created based on the xmcloud.build.json if enabled is set to true. The following steps are not required. Only if you have enabled the split deployment feature, continue with the next steps.

1. Go to Sitecore Cloud Portal https://portal.sitecorecloud.io
2. Open XM Cloud Deploy
3. Select Project that has been deployed
4. Switch to tab "Editing Hosts"
5. Click "Add editing host"
6. Provide Editing host name  ```kit-nextjs-location-starter``` as per xmcloud.build.json
7. Check if the link to authoring environment is set correctly (should be by default)
8.  Check if the source code provider is set correctly (should be by default)
9. Check if the GitHub Account is set correctly (should be by default)
10. Check if repository is set correctly (should be by default)
11. Check if Branch is set correctly (should be by default)
12. Set the Auto deploy option (recommended)
13. No custom environment variables are required
14. Click "Save"
15. On the new editing host click the ... and hit "Build and deploy"

Additional Info: You do not have to create rendering host items in XM Cloud as those are created automatically for you when creating a rendering host. Mapping of sites using site templates to editing hosts is also done automatically.

## Documentation

- [Skills: capability map for this starter](Skills.md) — High-level capability groupings; see also the repo [docs/Skills.md](../../docs/Skills.md).
- [Sitecore Content SDK for XM Cloud](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html)
