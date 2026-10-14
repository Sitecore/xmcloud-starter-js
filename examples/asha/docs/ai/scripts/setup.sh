#!/bin/bash
# setup.sh — Install Playwright and Chromium for the site scraper
# Run this once before using the theme extraction skill.
#
# Usage: bash scripts/setup.sh

set -e

echo "[setup] Checking Node.js..."
if ! command -v node &> /dev/null; then
  echo "[setup] Error: Node.js is required. Install it from https://nodejs.org"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'.' -f1 | tr -d 'v')
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "[setup] Error: Node.js 18+ required, found $(node -v)"
  exit 1
fi
echo "[setup] ✓ Node.js $(node -v)"

echo "[setup] Installing Playwright..."
npm install --save-dev playwright@latest 2>/dev/null || npm install playwright@latest

echo "[setup] Installing Chromium browser..."
npx playwright install chromium

echo ""
echo "[setup] ✓ Ready. You can now run:"
echo "  node docs/ai/scripts/site-scraper.mjs --url https://example.com --output docs/ai/themes/example"
