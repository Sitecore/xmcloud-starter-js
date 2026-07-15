# escape=`

#
# Development-only image for running Next.js in a containerized environment.
# Assumes that the Next.js rendering host source is mounted to c:\app.
#

ARG PARENT_IMAGE
FROM ${PARENT_IMAGE} AS debug

USER ContainerAdministrator

WORKDIR /app

EXPOSE 3000

HEALTHCHECK --interval=2m --timeout=10s --start-period=300s --retries=3 CMD ["C:/Windows/System32/curl.exe", "-sS", "-o", "nul", "--max-time", "5", "http://127.0.0.1:3000/"]

#ENTRYPOINT ["cmd.exe", "/C", "npm install && npm run dev"]
ENTRYPOINT ["cmd.exe", "/C", "npm install && npm run dev"]