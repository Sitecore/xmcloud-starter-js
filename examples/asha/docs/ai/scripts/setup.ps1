# setup.ps1 — Install Playwright and Chromium for the site scraper
# Run this once before using the theme extraction skill.
#
# Usage (Windows PowerShell):
#   .\setup.ps1
#
# Usage (macOS/Linux with pwsh):
#   pwsh setup.ps1

Write-Host "[setup] Checking Node.js..." -ForegroundColor Cyan

try {
    $nodeVersion = node -v
    $major = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($major -lt 18) {
        Write-Host "[setup] Error: Node.js 18+ required, found $nodeVersion" -ForegroundColor Red
        exit 1
    }
    Write-Host "[setup] ✓ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[setup] Error: Node.js is required. Install it from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host "[setup] Installing Playwright..." -ForegroundColor Cyan
npm install --save-dev playwright@latest

Write-Host "[setup] Installing Chromium browser..." -ForegroundColor Cyan
npx playwright install chromium

Write-Host ""
Write-Host "[setup] ✓ Ready! You can now run:" -ForegroundColor Green
Write-Host '  node docs/ai/scripts/site-scraper.mjs --url https://example.com --output docs/ai/themes/example' -ForegroundColor Yellow
