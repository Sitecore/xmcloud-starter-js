# XM Cloud Next.js Starter Kit - Disconnected offline mode

Below are the instructions for how to mock a small subset of the XM Cloud Application elements in offline mode using Docker. This can allow for a disconnected development, however it is recommend to work in the default connected mode for the best experience.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Base Image Versions](#base-image-versions)
- [Running the Containers](#running-the-containers)
  - [Initialising the Repository](#initialising-the-repository)
  - [Starting the Containers](#starting-the-containers)
  - [Stopping the Containers](#stopping-the-containers)

## Prerequisites

- [.NET 8.0](https://dotnet.microsoft.com/en-us/download)
- [Docker](https://www.docker.com/products/docker-desktop)
- A Windows-based machine is required to run the local containers

## Base Image Versions

Local containers default to **Windows Server LTSC 2022** base images. Pass `-baseOs` when you initialize so Sitecore, Traefik, and Node image tags stay on the same OS. Use `-baseOs ltsc2025` on Windows 11 24H2 or Windows Server 2025 if you want the current Microsoft LTSC.

| Host OS | Use `-baseOs` |
| --- | --- |
| Windows 11 21H2/22H2/23H2 or Windows Server 2022 | `ltsc2022` (default) |
| Windows 11 24H2 or Windows Server 2025 (`10.0.26100`) | `ltsc2025` |
| Windows 10 | `ltsc2019` |

Windows containers require a compatible host OS (process isolation typically needs a matching kernel). See [Microsoft Learn — Version compatibility](https://learn.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility?tabs=windows-server-2022%2Cwindows-11).

If you change `-baseOs` after a previous init, re-run `init.ps1 -InitEnv` so `SITECORE_VERSION`, `EXTERNAL_IMAGE_TAG_SUFFIX`, `TRAEFIK_IMAGE`, and `NODEJS_PARENT_IMAGE` in `./local-containers/.env` are updated together. You can also amend those values in `.env` directly.

`init.ps1` pins Traefik to a published Windows tag for each OS: `v3.6.4` (ltsc2022), `v3.6.23` (ltsc2025), and `v3.4.1` on `windowsservercore-1809` (ltsc2019). Traefik no longer publishes 1809 images after v3.4.1.

When you choose `-baseOs ltsc2025`, Sitecore CM / mssql-init / solr-init use `1-ltsc2025`, but `EXTERNAL_IMAGE_TAG_SUFFIX` stays `ltsc2022` because Sitecore has not published `nonproduction/mssql-developer` or `nonproduction/solr` for LTSC 2025 yet. The CM build also needs `sitecore-xmcloud-docker-tools-assets:1-ltsc2025`; until Sitecore publishes that tag, create a local alias from the 2022 image:

```ps1
docker pull scr.sitecore.com/tools/sitecore-xmcloud-docker-tools-assets:1-ltsc2022
docker tag scr.sitecore.com/tools/sitecore-xmcloud-docker-tools-assets:1-ltsc2022 scr.sitecore.com/tools/sitecore-xmcloud-docker-tools-assets:1-ltsc2025
```

## Running the Containers

A number of PowerShell scripts have been provided to help you configure the repository and interact with the containers. These scripts are located in the `./local-containers/scripts` folder.
### Initialising the Repository

You first need to initialize the repository, which will configure how the different application elements will run. This will configure the different environment variables required for the Containers to build and run. You can do this by running the `./local-containers/scripts/init.ps1` script in a terminal with elevated privilidges:

```ps1
./local-containers/scripts/init.ps1 -InitEnv -LicenseXmlPath "C:\path\to\license.xml" -AdminPassword "DesiredAdminPassword"
```

On Windows 11 24H2 or Windows Server 2025, you can opt into LTSC 2025:

```ps1
./local-containers/scripts/init.ps1 -InitEnv -LicenseXmlPath "C:\path\to\license.xml" -AdminPassword "DesiredAdminPassword" -baseOs ltsc2025
```

### Starting the Containers

After you have initialised the repository you can use the `./local-containers/scripts/up.ps1` script to build and run the containers:

```ps1
./local-containers/scripts/up.ps1
```

### Stopping the Containers

Once you have finished you can use the `./local-containers/scripts/down.ps1` script to stop the containers:

```ps1
./local-containers/scripts/down.ps1
```

This will stop all containers, and tidy up any resources that were created.