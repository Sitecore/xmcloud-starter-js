[CmdletBinding(DefaultParameterSetName = "no-arguments")]
Param (
    [Parameter(HelpMessage = "Enables initialization of values in the .env file, which may be placed in source control.",
        ParameterSetName = "env-init")]
    [switch]$InitEnv,

    [Parameter(Mandatory = $true,
        HelpMessage = "The path to a valid Sitecore license.xml file.",
        ParameterSetName = "env-init")]
    [string]$LicenseXmlPath,

    # We do not need to use [SecureString] here since the value will be stored unencrypted in .env,
    # and used only for transient local development environments.
    [Parameter(Mandatory = $true,
        HelpMessage = "Sets the sitecore\\admin password for this environment via environment variable.",
        ParameterSetName = "env-init")]
    [string]$AdminPassword,

    [Parameter(Mandatory = $false, HelpMessage = "Specifies the Windows LTSC version of the container base images (ltsc2019, ltsc2022, or ltsc2025). Must be compatible with the host OS.")]
    [ValidateSet("ltsc2019", "ltsc2022", "ltsc2025")]
    [string]$baseOs = "ltsc2022"
)

function Get-LocalContainerOsImageSettings {
    param (
        [Parameter(Mandatory = $true)]
        [ValidateSet("ltsc2019", "ltsc2022", "ltsc2025")]
        [string]$BaseOs
    )

    # Pin Traefik to tags that exist on Docker Hub for each Windows base.
    # Traefik dropped windowsservercore-1809 after v3.4.1; v3.6.4 is not published for ltsc2025.
    $traefikImageByOs = @{
        ltsc2019 = "traefik:v3.4.1-windowsservercore-1809"
        ltsc2022 = "traefik:v3.6.4-windowsservercore-ltsc2022"
        ltsc2025 = "traefik:v3.6.23-windowsservercore-ltsc2025"
    }

    # Sitecore XM Cloud CM/init images exist for ltsc2025, but nonproduction SQL/Solr
    # (and tools assets) are still published only for ltsc2022. Keep that suffix on 2022
    # when opting into ltsc2025 so compose can pull supporting images.
    $externalImageTagSuffix = if ($BaseOs -eq "ltsc2025") { "ltsc2022" } else { $BaseOs }

    return [pscustomobject]@{
        SitecoreVersion          = "1-$BaseOs"
        ExternalImageTagSuffix   = $externalImageTagSuffix
        NodeJsParentImage        = "mcr.microsoft.com/windows/nanoserver:$BaseOs"
        TraefikImage             = $traefikImageByOs[$BaseOs]
    }
}

$ErrorActionPreference = "Stop";

# Set the root of the repository
$RepoRoot = Resolve-Path "$PSScriptRoot\..\.."

if ($InitEnv) {
    if (-not $LicenseXmlPath.EndsWith("license.xml")) {
        Write-Error "Sitecore license file must be named 'license.xml'."
    }
    if (-not (Test-Path $LicenseXmlPath)) {
        Write-Error "Could not find Sitecore license file at path '$LicenseXmlPath'."
    }
    # We actually want the folder that it's in for mounting
    $LicenseXmlPath = (Get-Item $LicenseXmlPath).Directory.FullName
}

Write-Host "Preparing your Sitecore Containers environment!" -ForegroundColor Green

$renderingHostName = "xmc-starter-js.localhost"
$nextjsHostName = "nextjs.$renderingHostName"

################################################
# Retrieve and import SitecoreDockerTools module
################################################

# Check for Sitecore Gallery
Import-Module PowerShellGet
$SitecoreGallery = Get-PSRepository | Where-Object { $_.SourceLocation -eq "https://nuget.sitecore.com/resources/v2" }
if (-not $SitecoreGallery) {
    Write-Host "Adding Sitecore PowerShell Gallery..." -ForegroundColor Green
    Unregister-PSRepository -Name SitecoreGallery -ErrorAction SilentlyContinue
    Register-PSRepository -Name SitecoreGallery -SourceLocation https://nuget.sitecore.com/resources/v2 -InstallationPolicy Trusted
    $SitecoreGallery = Get-PSRepository -Name SitecoreGallery
}

# Install and Import SitecoreDockerTools
$dockerToolsVersion = "10.2.7"
Remove-Module SitecoreDockerTools -ErrorAction SilentlyContinue
if (-not (Get-InstalledModule -Name SitecoreDockerTools -RequiredVersion $dockerToolsVersion -ErrorAction SilentlyContinue)) {
    Write-Host "Installing SitecoreDockerTools..." -ForegroundColor Green
    Install-Module SitecoreDockerTools -RequiredVersion $dockerToolsVersion -Scope CurrentUser -Repository $SitecoreGallery.Name
}
Write-Host "Importing SitecoreDockerTools..." -ForegroundColor Green
Import-Module SitecoreDockerTools -RequiredVersion $dockerToolsVersion
Write-SitecoreDockerWelcome

##################################
# Configure TLS/HTTPS certificates
##################################

Push-Location $RepoRoot\local-containers\docker\traefik\certs
try {
    $mkcert = ".\mkcert.exe"
    if ($null -ne (Get-Command mkcert.exe -ErrorAction SilentlyContinue)) {
        # mkcert installed in PATH
        $mkcert = "mkcert"
    }
    elseif (-not (Test-Path $mkcert)) {
        Write-Host "Downloading and installing mkcert certificate tool..." -ForegroundColor Green
        Invoke-WebRequest "https://github.com/FiloSottile/mkcert/releases/download/v1.4.1/mkcert-v1.4.1-windows-amd64.exe" -UseBasicParsing -OutFile mkcert.exe
        if ((Get-FileHash mkcert.exe).Hash -ne "1BE92F598145F61CA67DD9F5C687DFEC17953548D013715FF54067B34D7C3246") {
            Remove-Item mkcert.exe -Force
            throw "Invalid mkcert.exe file"
        }
    }
    Write-Host "Generating Traefik TLS certificate..." -ForegroundColor Green
    & $mkcert -install
    & $mkcert "*.$renderingHostName"
    & $mkcert "xmcloudcm.localhost"

    # stash CAROOT path for messaging at the end of the script
    $caRoot = "$(& $mkcert -CAROOT)\rootCA.pem"
}
catch {
    Write-Error "An error occurred while attempting to generate TLS certificate: $_"
}
finally {
    Pop-Location
}

$envFileLocation = "$RepoRoot/local-containers/.env"

################################
# Add Windows hosts file entries
################################

Write-Host "Adding Windows hosts file entries..." -ForegroundColor Green

Add-HostsEntry "xmcloudcm.localhost"
Add-HostsEntry $nextjsHostName

###############################
# Generate scjssconfig
###############################

Set-EnvFileVariable "SITECORE_API_KEY_APP_STARTER" -Value $xmCloudBuild.renderingHosts.nextjsstarter.jssDeploymentSecret -Path $envFileLocation

################################
# Generate Sitecore Api Key
################################

$sitecoreApiKey = (New-Guid).Guid
Set-EnvFileVariable "SITECORE_API_KEY_APP_STARTER" -Value $sitecoreApiKey -Path $envFileLocation

################################
# Generate SITECORE_EDITING_SECRET
################################
$sitecoreEditingSecret = Get-SitecoreRandomString 64 -DisallowSpecial
Set-EnvFileVariable "SITECORE_EDITING_SECRET" -Value $sitecoreEditingSecret -Path $envFileLocation

###############################
# Populate the environment file
###############################

if ($InitEnv) {

    

    Write-Host "Populating required .env file values..." -ForegroundColor Green

    # HOST_LICENSE_FOLDER
    Set-EnvFileVariable "HOST_LICENSE_FOLDER" -Value $LicenseXmlPath -Path $envFileLocation

    # CM_HOST
    Set-EnvFileVariable "CM_HOST" -Value "xmcloudcm.localhost" -Path $envFileLocation

    # RENDERING_HOST
    Set-EnvFileVariable "RENDERING_HOST_NEXTJS" -Value $nextjsHostName -Path $envFileLocation

    # REPORTING_API_KEY = random 64-128 chars
    Set-EnvFileVariable "REPORTING_API_KEY" -Value (Get-SitecoreRandomString 128 -DisallowSpecial) -Path $envFileLocation

    # TELERIK_ENCRYPTION_KEY = random 64-128 chars
    Set-EnvFileVariable "TELERIK_ENCRYPTION_KEY" -Value (Get-SitecoreRandomString 128 -DisallowSpecial) -Path $envFileLocation

    # MEDIA_REQUEST_PROTECTION_SHARED_SECRET
    Set-EnvFileVariable "MEDIA_REQUEST_PROTECTION_SHARED_SECRET" -Value (Get-SitecoreRandomString 64) -Path $envFileLocation

    # SQL_SA_PASSWORD
    # Need to ensure it meets SQL complexity requirements
    Set-EnvFileVariable "SQL_SA_PASSWORD" -Value (Get-SitecoreRandomString 19 -DisallowSpecial -EnforceComplexity) -Path $envFileLocation

    # SQL_SERVER
    Set-EnvFileVariable "SQL_SERVER" -Value "mssql" -Path $envFileLocation

    # SQL_SA_LOGIN
    Set-EnvFileVariable "SQL_SA_LOGIN" -Value "sa" -Path $envFileLocation

    # SITECORE_ADMIN_PASSWORD
    Set-EnvFileVariable "SITECORE_ADMIN_PASSWORD" -Value $AdminPassword -Path $envFileLocation

    $osImages = Get-LocalContainerOsImageSettings -BaseOs $baseOs

    Set-EnvFileVariable "SITECORE_VERSION" -Value $osImages.SitecoreVersion -Path $envFileLocation
    Set-EnvFileVariable "EXTERNAL_IMAGE_TAG_SUFFIX" -Value $osImages.ExternalImageTagSuffix -Path $envFileLocation
    Set-EnvFileVariable "NODEJS_PARENT_IMAGE" -Value $osImages.NodeJsParentImage -Path $envFileLocation
    Set-EnvFileVariable "TRAEFIK_IMAGE" -Value $osImages.TraefikImage -Path $envFileLocation
}

Write-Host "Done!" -ForegroundColor Green

Pop-Location
Push-Location $RepoRoot\local-containers\docker\traefik\certs
try {
    Write-Host
    Write-Host ("#" * 75) -ForegroundColor Cyan
    Write-Host "To avoid HTTPS errors, set the NODE_EXTRA_CA_CERTS environment variable" -ForegroundColor Cyan
    Write-Host "using the following commmand:" -ForegroundColor Cyan
    Write-Host "setx NODE_EXTRA_CA_CERTS $caRoot"
    Write-Host
    Write-Host "You will need to restart your terminal or VS Code for it to take effect." -ForegroundColor Cyan
    Write-Host ("#" * 75) -ForegroundColor Cyan
}
catch {
    Write-Error "An error occurred while attempting to generate TLS certificate: $_"
}
finally {
    Pop-Location
}
