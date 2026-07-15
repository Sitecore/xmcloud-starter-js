# escape=`

ARG PARENT_IMAGE
ARG SOLUTION_IMAGE
ARG TOOLS_IMAGE

FROM ${TOOLS_IMAGE} AS tools
HEALTHCHECK --interval=30s --timeout=5s --retries=1 CMD ["cmd.exe", "/C", "exit", "0"]

FROM ${PARENT_IMAGE}

HEALTHCHECK --interval=30s --timeout=300s --start-period=300s --retries=3 CMD ["powershell", "-command", "C:/Healthchecks/Healthcheck.ps1"]

USER ContainerAdministrator

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

WORKDIR C:\inetpub\wwwroot

# Copy developer tools and entrypoint
COPY --from=tools C:\tools C:\tools