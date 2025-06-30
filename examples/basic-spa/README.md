# SPA Starter Kit Monorepo

The SPA starter kit contains:

* [Node XM Cloud Proxy](proxy/)
* [Angular SPA](angular/)

It's designed to enable users to create their own starter applications and, in the future, will support additional frameworks.

The monorepo is set up using [PNPM workspaces](https://pnpm.io/workspaces).

## Getting Started

1. Install PNPM:
```shell
npm i pnpm -g
```

2. Install all the dependencies of the monorepo and build the SPA:
```shell
npm run install-build:<your-spa-app>
```

3. [Optional] After making changes, re-build your SPA:
```shell
npm run build:<your-spa-app>
```

4. Start the SPA in production mode:
```shell
npm run start:<your-spa-app>
```

> \<your-spa-app\> - your SPA application. Currently the only availble framework is Angular.

## Deployment

1. Create your repository based on this one.
2. The default configuration deploys the `Next.js` application. To deploy your `SPA + Proxy` instead, you need to enable the relevant rendering host in `xmcloud.build.json` and disable the `nextjsstarter` rendering host. The following example is for an Angular SPA:
  ```json
      "renderingHosts": {
          "nextjsstarter": {
              ...
              "enabled": false,
              ...
          },
          "angularstarter": {
              ...
              "enabled": true,
              ...
          }
      },
  ```
3. Push the updates.
4. Log into the [XM Cloud Deploy app](https://deploy.sitecorecloud.io/), create a project and a deployment using your code and select your repository.
5. After the deployment finishes succesfully, [create a site and a page](https://doc.sitecore.com/xmc/en/developers/xm-cloud/create-a-site-and-a-page.html). You should now be able to see your the new page in Pages.
6. If you've previously deployed and created a site based on a different starter application, you might see the following error when you open Pages: `The remote name could not be resolved: ...`. To resolve this, change the editing host configuration of your site as follows:
  - open the content editor and navigate to your site configuration item `/sitecore/content/<your-site-collection-name>/<your-site-name>/Settings/Site Grouping/<your-site-name>`
  - in the `settings` section, in the `Predefined application editing host` field choose the the name of your SPA renderinghost configuration (can be seen in `xmcloud.build.json`). For example, for Angular SPAs, by default it should be `angularstarter`.

## Local development against the XM Cloud instance

1. Log into the Deploy app, locate your `Environment` and select the `Developer Settings` tab.
2. Ensure that the context switch is set to `Preview`.
3. In the **Local Development**`** section, click to copy the sample `.env` file contents to your clipboard.
4. Open the `.env` file in the `./headapps/spa-starters/<your-spa-app>` folder and paste everything except JSS_EDITING_SECRET.
5. From the **Local Development** section copy the value of the JSS_EDITING_SECRET variable and paste it into the `.env` file of the proxy app `./headapps/spa-starters/proxy`
6. Run the following commands in the root of the repository to start your SPA application:
  ```bash
  cd headapps/spa-starters
  pnpm build:<your-spa-app>
  pnpm start:<your-spa-app>
  ```
7. Make sure you can access your site on `http://localhost:3000`
8. You can also [connect your local host to Pages](https://doc.sitecore.com/xmc/en/developers/xm-cloud/connect-your-local-host-to-pages.html) to use it as editing host.

> Running your SPA + Proxy in local containers is not supported, since SPA + Proxy does not support Experience Editor, and the instructions above cover all development flow use cases.
