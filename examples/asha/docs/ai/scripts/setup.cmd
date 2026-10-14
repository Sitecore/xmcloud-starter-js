@echo off
REM setup.cmd — Install Playwright and Chromium for the site scraper
REM Run this once before using the theme extraction skill.
REM
REM Usage: setup.cmd
REM    or: .\setup.cmd

echo [setup] Checking Node.js...

node -v >nul 2>&1
if errorlevel 1 (
    echo [setup] Error: Node.js is required. Install it from https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [setup] Found Node.js %NODE_VER%

echo [setup] Installing Playwright...
call npm install --save-dev playwright@latest

echo [setup] Installing Chromium browser...
call npx playwright install chromium

echo.
echo [setup] Ready! You can now run:
echo   node docs\ai\scripts\site-scraper.mjs --url https://example.com --output docs\ai\themes\example
